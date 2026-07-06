import express from "express";
import "dotenv/config";
import path from "path";
import fs from "fs";
import net from "net";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
const { Pool } = pg;

const app = express();
const REQUESTED_PORT = Number(process.env.PORT || 3000);
const PORT = Number.isInteger(REQUESTED_PORT) && REQUESTED_PORT > 0 ? REQUESTED_PORT : 3000;
const DEFAULT_HMR_PORT = 24678;
const REQUESTED_HMR_PORT = Number(process.env.HMR_PORT || DEFAULT_HMR_PORT);
const HMR_PORT = Number.isInteger(REQUESTED_HMR_PORT) && REQUESTED_HMR_PORT > 0 ? REQUESTED_HMR_PORT : DEFAULT_HMR_PORT;
const MAX_PORT_TRIES = 10;
const DB_PATH = process.env.VERCEL || process.env.NODE_ENV === "production"
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "server", "db.json");
const SERVER_SECRET = process.env.SESSION_SECRET || "sanop_group_secure_session_secret_2026_volta_ghana";
const isDebug = process.env.DEBUG === "true" || process.env.DEBUG === "1";
const appLog = (...args) => { if (isDebug) console.log(...args); };

// Handle global/benign unhandled process rejections to ensure continuous up-time
process.on("unhandledRejection", (reason) => {
  console.error("[Unhandled Rejection] Node Process Event:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("[Uncaught Exception] Node Process Event:", error);
  process.exit(1);
});
process.on("SIGINT", async () => {
  appLog("[Shutdown] SIGINT received, closing gracefully...");
  if (pgPool) await pgPool.end().catch(() => {});
  process.exit(0);
});
process.on("SIGTERM", async () => {
  appLog("[Shutdown] SIGTERM received, closing gracefully...");
  if (pgPool) await pgPool.end().catch(() => {});
  process.exit(0);
});

async function isPortAvailable(port) {
  const hostsToCheck = ["127.0.0.1", "::1", "0.0.0.0"];
  for (const host of hostsToCheck) {
    const available = await new Promise((resolve) => {
      const tester = net.createServer();
      tester.once("error", () => resolve(false));
      tester.once("listening", () => tester.close(() => resolve(true)));
      tester.listen(port, host);
    });
    if (!available) {
      return false;
    }
  }
  return true;
}

async function resolvePort(preferredPort, options = {}) {
  const { strict = false, attempts = MAX_PORT_TRIES, name = "port" } = options;
  const normalizedPort = Number(preferredPort);
  if (!Number.isInteger(normalizedPort) || normalizedPort <= 0) {
    throw new Error(`Invalid ${name} requested: ${preferredPort}`);
  }

  const available = await isPortAvailable(normalizedPort);
  if (strict) {
    if (!available) {
      throw new Error(`Port ${normalizedPort} is already in use. Set ${name.toUpperCase()} to a free port before starting the service.`);
    }
    return normalizedPort;
  }

  if (available) return normalizedPort;

  let port = normalizedPort;
  for (let i = 1; i < attempts; i += 1) {
    port += 1;
    if (await isPortAvailable(port)) {
      appLog(`[Port Resolver] ${name} ${normalizedPort} unavailable, using ${port} instead.`);
      return port;
    }
  }

  throw new Error(`Failed to find an available ${name} between ${normalizedPort} and ${normalizedPort + attempts - 1}.`);
}

app.use(express.json({ limit: "1mb" }));
app.use(decryptRequestBody);

// Robust In-Memory Rate Limiter for anti-brute-force defense
const requestCounts = new Map();
// Clear rate limit maps periodically to prevent memory leaks
setInterval(() => {
  requestCounts.clear();
}, 60000); // clear every minute

function rateLimiter(limitCount, durationMs = 60000) {
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }
    
    const requestTimes = requestCounts.get(ip);
    // Filter out times older than durationMs
    const activeTimes = requestTimes.filter(time => now - time < durationMs);
    
    if (activeTimes.length >= limitCount) {
      return res.status(429).json({
        error: "Too many request queries. Protective firewall is throttling requests. Please wait a moment."
      });
    }
    
    activeTimes.push(now);
    requestCounts.set(ip, activeTimes);
    next();
  };
}

// Strict secure headers configuration compatible with the AI Studio workspace environment
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  // Prevent MIME-sniffing and cross-site scripting vulnerabilities. Allow embedding for preview.
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://*.google.com https://*.run.app https://ai.studio https://*.studio;");
  next();
});

// Robust recursive sanitize helper to prevent Injection attacks in db and Persistent XSS
function sanitizeValue(val) {
  if (typeof val === "string") {
    // Strip script tags and HTML-dangerous chars
    return val
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "") // strip html tags completely
      .replace(/["]/g, "&quot;")
      .replace(/[']/g, "&#x27;")
      .replace(/[<]/g, "&lt;")
      .replace(/[>]/g, "&gt;");
  } else if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  } else if (val !== null && typeof val === "object") {
    const cleaned = {};
    for (const k in val) {
      if (Object.prototype.hasOwnProperty.call(val, k)) {
        cleaned[k] = sanitizeValue(val[k]);
      }
    }
    return cleaned;
  }
  return val;
}

// Dynamic hybrid database connection (Supabase with local JSON backup fallback)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
let supabase = null;
let isSupabaseConnected = false;
let isSupabaseTablesReady = false;
const hasSupabaseCreds = !!(SUPABASE_URL && SUPABASE_KEY);

async function checkSupabaseTables() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      if (error.code === "PGRST205" || (error.message && error.message.includes("schema cache"))) {
        appLog("[Supabase] Schema tables are not yet available in remote Supabase. Falling back to local JSON database.");
        isSupabaseTablesReady = false;
        isSupabaseConnected = false;
      } else {
        appLog("[Supabase] Checked tables and received error:", error);
        isSupabaseTablesReady = false;
        isSupabaseConnected = false;
      }
    } else {
      appLog("[Supabase] Verified remote tables are available.");
      isSupabaseTablesReady = true;
      isSupabaseConnected = true;
    }
  } catch (err) {
    console.error("[Supabase Setup] Failed to check tables:", err);
    isSupabaseTablesReady = false;
    isSupabaseConnected = false;
  }
}

if (hasSupabaseCreds) {
  appLog("[Supabase] Found credentials. Connecting...");
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false
      }
    });
  } catch (err) {
    console.error("[Supabase Setup Warning] Supabase Connection failed. Operating in fallback local-file DB mode. Details:", err);
  }
} else {
  appLog("[Supabase] No SUPABASE_URL specified; local JSON fallback enabled.");
}

// Dynamic PostgreSQL / Neon connection setup
const DATABASE_URL = process.env.DATABASE_URL;
let pgPool = null;
let isPgConnected = false;

if (DATABASE_URL) {
  appLog("[Postgres] Found DATABASE_URL. Connecting to PostgreSQL/Neon...");
  try {
    pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes("sslmode=require") || DATABASE_URL.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : false,
    });
    isPgConnected = true;
    appLog("[Postgres] Successfully connected to PostgreSQL/Neon.");
  } catch (err) {
    console.error("[Postgres Setup Warning] PostgreSQL Connection failed. Details:", err);
    isPgConnected = false;
  }
} else {
  appLog("[Postgres] No DATABASE_URL specified; local JSON fallback enabled.");
}

async function initializePgTables() {
  if (!isPgConnected || !pgPool) return;
  let client;
  try {
    client = await pgPool.connect();
  } catch (connErr) {
    appLog("[Postgres] PostgreSQL/Neon database is not configured or offline. Dynamic local fallback ledger and Supabase are active and operational.");
    isPgConnected = false;
    return;
  }
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        "passwordHash" TEXT,
        "passwordSalt" TEXT,
        "pinHash" TEXT,
        "pinSalt" TEXT,
        "fullName" VARCHAR(255),
        phone VARCHAR(100),
        role VARCHAR(50),
        "isVerified" BOOLEAN DEFAULT FALSE,
        region VARCHAR(255),
        "secretQuestion" TEXT,
        "secretAnswerHash" TEXT,
        "pinResetRequested" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP,
        classification VARCHAR(100)
      )
    `);

    // Ensure classification column exists if table was already created earlier without it
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS classification VARCHAR(100);
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "fingerprintEnrolled" BOOLEAN DEFAULT FALSE;
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "biometricToken" VARCHAR(255);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        "userId" VARCHAR(100),
        "customerName" VARCHAR(255) NOT NULL,
        "customerEmail" VARCHAR(255) NOT NULL,
        items JSONB,
        subtotal NUMERIC,
        "deliveryFee" NUMERIC,
        total NUMERIC,
        "momoPhone" VARCHAR(100),
        "momoReference" VARCHAR(100),
        "createdAt" TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id VARCHAR(100) PRIMARY KEY,
        "userId" VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        scope TEXT NOT NULL,
        date TEXT NOT NULL,
        "createdAt" TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(100) PRIMARY KEY,
        timestamp TIMESTAMP,
        "userId" VARCHAR(100),
        "userEmail" VARCHAR(255),
        ip VARCHAR(100),
        action TEXT,
        details TEXT
      )
    `);

    appLog("[Postgres] All PostgreSQL schema tables verified/initialized successfully.");
  } catch (err) {
    console.error("[Postgres Setup Error] Failed to auto-initialize SQL tables:", err);
  } finally {
    client.release();
  }
}

function normalizePgUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user.ID || "",
    email: user.email || user.EMAIL || "",
    passwordHash: user.passwordHash || user.passwordhash || user.PASSWORDHASH || null,
    passwordSalt: user.passwordSalt || user.passwordsalt || user.PASSWORDSALT || null,
    pinHash: user.pinHash || user.pinhash || user.PINHASH || null,
    pinSalt: user.pinSalt || user.pinsalt || user.PINSALT || null,
    fullName: user.fullName || user.fullname || user.FULLNAME || null,
    phone: user.phone || user.PHONE || null,
    role: user.role || user.ROLE || "user",
    isVerified: user.isVerified !== undefined ? user.isVerified : (user.isverified !== undefined ? user.isverified : false),
    region: user.region || user.REGION || null,
    secretQuestion: user.secretQuestion || user.secretquestion || user.SECRETQUESTION || null,
    secretAnswerHash: user.secretAnswerHash || user.secretanswerhash || user.SECRETANSWERHASH || null,
    pinResetRequested: user.pinResetRequested !== undefined ? user.pinResetRequested : (user.pinresetrequested !== undefined ? user.pinresetrequested : false),
    createdAt: user.createdAt || user.createdat || user.CREATEDAT || null,
    updatedAt: user.updatedAt || user.updatedat || user.UPDATEDAT || null,
    classification: user.classification || user.CLASSIFICATION || "",
    fingerprintEnrolled: user.fingerprintEnrolled !== undefined ? user.fingerprintEnrolled : (user.fingerprintenrolled !== undefined ? user.fingerprintenrolled : false),
    biometricToken: user.biometricToken || user.biometrictoken || user.BIOMETRICTOKEN || null
  };
}

function normalizePgOrder(order) {
  if (!order) return null;
  let parsedItems = order.items;
  if (typeof order.items === "string") {
    try {
      parsedItems = JSON.parse(order.items);
    } catch (e) {
      parsedItems = [];
    }
  }
  return {
    ...order,
    id: order.id || order.ID || "",
    userId: order.userId || order.userid || order.USERID || null,
    customerName: order.customerName || order.customername || order.CUSTOMERNAME || "",
    customerEmail: order.customerEmail || order.customeremail || order.CUSTOMEREMAIL || "",
    items: parsedItems || [],
    subtotal: order.subtotal ? parseFloat(order.subtotal) : 0,
    deliveryFee: order.deliveryFee !== undefined ? parseFloat(order.deliveryFee) : (order.deliveryfee !== undefined ? parseFloat(order.deliveryfee) : 0),
    total: order.total ? parseFloat(order.total) : 0,
    momoPhone: order.momoPhone || order.momophone || order.MOMOPHONE || null,
    momoReference: order.momoReference || order.momoreference || order.MOMOREFERENCE || null,
    createdAt: order.createdAt || order.createdat || order.CREATEDAT || null
  };
}

function normalizePgConsultation(cons) {
  if (!cons) return null;
  return {
    ...cons,
    id: cons.id || cons.ID || "",
    userId: cons.userId || cons.userid || cons.USERID || null,
    name: cons.name || cons.NAME || "",
    email: cons.email || cons.EMAIL || "",
    phone: cons.phone || cons.PHONE || "",
    scope: cons.scope || cons.SCOPE || "",
    date: cons.date || cons.DATE || "",
    createdAt: cons.createdAt || cons.createdat || cons.CREATEDAT || null
  };
}

function normalizePgLog(log) {
  if (!log) return null;
  return {
    ...log,
    id: log.id || log.ID || "",
    timestamp: log.timestamp || log.TIMESTAMP || null,
    userId: log.userId || log.userid || log.USERID || null,
    userEmail: log.userEmail || log.useremail || log.USEREMAIL || null,
    ip: log.ip || log.IP || "",
    action: log.action || log.ACTION || "",
    details: log.details || log.DETAILS || ""
  };
}


async function dbGetUsers() {
  if (isPgConnected && pgPool) {
    try {
      const { rows } = await pgPool.query('SELECT * FROM users');
      return rows.map(normalizePgUser);
    } catch (e) {
      console.error("[Postgres Error] dbGetUsers failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (!error && data) return data;
      if (error) {
        console.warn("[Supabase Warning] dbGetUsers query failed, trying local ledger. Error:", error);
      }
    } catch (e) {
      console.error("[Supabase Error] dbGetUsers failed, falling back:", e);
    }
  }
  const db = loadDb();
  return db.users;
}

async function dbGetUserById(id) {
  if (isPgConnected && pgPool) {
    try {
      const { rows } = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
      return rows[0] ? normalizePgUser(rows[0]) : null;
    } catch (e) {
      console.error("[Postgres Error] dbGetUserById failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
      if (!error && data) return data;
      if (error) {
        console.warn("[Supabase Warning] dbGetUserById query failed, trying local ledger. Error:", error);
      }
    } catch (e) {
      console.error("[Supabase Error] dbGetUserById failed, falling back:", e);
    }
  }
  const db = loadDb();
  return db.users.find((u) => u.id === id);
}

async function dbGetUserByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();
  if (isPgConnected && pgPool) {
    try {
      const { rows } = await pgPool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
      return rows[0] ? normalizePgUser(rows[0]) : null;
    } catch (e) {
      console.error("[Postgres Error] dbGetUserByEmail failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("email", cleanEmail).maybeSingle();
      if (!error && data) return data;
      if (error) {
        console.warn("[Supabase Warning] dbGetUserByEmail query failed, trying local ledger. Error:", error);
      }
    } catch (e) {
      console.error("[Supabase Error] dbGetUserByEmail failed, falling back:", e);
    }
  }
  const db = loadDb();
  return db.users.find((u) => u.email === cleanEmail);
}

async function dbCreateUser(userObj) {
  if (isPgConnected && pgPool) {
    try {
      const query = `
        INSERT INTO users (
          id, email, "passwordHash", "passwordSalt", "pinHash", "pinSalt", 
          "fullName", phone, role, "isVerified", region, 
          "secretQuestion", "secretAnswerHash", "pinResetRequested", "createdAt", "updatedAt",
          classification, "fingerprintEnrolled", "biometricToken"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          "passwordHash" = EXCLUDED."passwordHash",
          "passwordSalt" = EXCLUDED."passwordSalt",
          "pinHash" = EXCLUDED."pinHash",
          "pinSalt" = EXCLUDED."pinSalt",
          "fullName" = EXCLUDED."fullName",
          phone = EXCLUDED.phone,
          role = EXCLUDED.role,
          "isVerified" = EXCLUDED."isVerified",
          region = EXCLUDED.region,
          "secretQuestion" = EXCLUDED."secretQuestion",
          "secretAnswerHash" = EXCLUDED."secretAnswerHash",
          "pinResetRequested" = EXCLUDED."pinResetRequested",
          "updatedAt" = EXCLUDED."updatedAt",
          classification = EXCLUDED.classification,
          "fingerprintEnrolled" = EXCLUDED."fingerprintEnrolled",
          "biometricToken" = EXCLUDED."biometricToken"
        RETURNING *
      `;
      const values = [
        userObj.id,
        userObj.email,
        userObj.passwordHash || null,
        userObj.passwordSalt || null,
        userObj.pinHash || null,
        userObj.pinSalt || null,
        userObj.fullName || null,
        userObj.phone || null,
        userObj.role || "user",
        userObj.isVerified || false,
        userObj.region || null,
        userObj.secretQuestion || null,
        userObj.secretAnswerHash || null,
        userObj.pinResetRequested || false,
        userObj.createdAt ? new Date(userObj.createdAt) : new Date(),
        userObj.updatedAt ? new Date(userObj.updatedAt) : new Date(),
        userObj.classification || "",
        userObj.fingerprintEnrolled || false,
        userObj.biometricToken || null
      ];
      const { rows } = await pgPool.query(query, values);
      return rows[0] || userObj;
    } catch (e) {
      console.error("[Postgres Error] dbCreateUser failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("users").insert([userObj]).select().maybeSingle();
      if (!error) return data || userObj;
      console.warn("[Supabase Warning] dbCreateUser failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbCreateUser failed, falling back:", e);
    }
  }
  const db = loadDb();
  db.users.push(userObj);
  saveDb(db);
  return userObj;
}

async function dbUpdateUser(id, updateFields) {
  const normalizedUpdates = { ...updateFields, updatedAt: new Date().toISOString() };
  if (isPgConnected && pgPool) {
    try {
      const keys = Object.keys(normalizedUpdates);
      const setClauses = keys.map((key, index) => `"${key}" = $${index + 2}`).join(", ");
      const query = `UPDATE users SET ${setClauses} WHERE id = $1 RETURNING *`;
      const values = [id, ...keys.map(k => normalizedUpdates[k])];
      const { rows } = await pgPool.query(query, values);
      return rows[0] || null;
    } catch (e) {
      console.error("[Postgres Error] dbUpdateUser failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("users").update(normalizedUpdates).eq("id", id).select().maybeSingle();
      if (!error) return data;
      console.warn("[Supabase Warning] dbUpdateUser failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbUpdateUser failed, falling back:", e);
    }
  }
  const db = loadDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...normalizedUpdates };
    saveDb(db);
    return db.users[index];
  }
  return null;
}

async function dbDeleteUser(id) {
  if (isPgConnected && pgPool) {
    try {
      await pgPool.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (e) {
      console.error("[Postgres Error] dbDeleteUser failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (!error) return true;
      console.warn("[Supabase Warning] dbDeleteUser failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbDeleteUser failed, falling back:", e);
    }
  }
  const db = loadDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index !== -1) {
    db.users.splice(index, 1);
    saveDb(db);
    return true;
  }
  return false;
}

async function dbGetLogs() {
  if (isPgConnected && pgPool) {
    try {
      const { rows } = await pgPool.query('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 500');
      return rows.map(normalizePgLog);
    } catch (e) {
      console.error("[Postgres Error] dbGetLogs failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("logs").select("*").order("timestamp", { ascending: false }).limit(500);
      if (!error && data) return data;
      console.warn("[Supabase Warning] dbGetLogs failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbGetLogs failed, falling back:", e);
    }
  }
  const db = loadDb();
  return db.logs;
}

async function dbCreateLog(logObj) {
  if (isPgConnected && pgPool) {
    try {
      const query = `
        INSERT INTO logs (id, timestamp, "userId", "userEmail", ip, action, details)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [
        logObj.id,
        logObj.timestamp ? new Date(logObj.timestamp) : new Date(),
        logObj.userId || null,
        logObj.userEmail || null,
        logObj.ip || "127.0.0.1",
        logObj.action,
        logObj.details
      ];
      const { rows } = await pgPool.query(query, values);
      return rows[0] || logObj;
    } catch (e) {
      console.error("[Postgres Error] dbCreateLog failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("logs").insert([logObj]).select().maybeSingle();
      if (!error) return data || logObj;
      console.warn("[Supabase Warning] dbCreateLog failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbCreateLog failed, falling back:", e);
    }
  }
  const db = loadDb();
  db.logs.unshift(logObj);
  if (db.logs.length > 500) db.logs.pop();
  saveDb(db);
  return logObj;
}

async function dbCreateConsultation(consObj) {
  if (isPgConnected && pgPool) {
    try {
      const query = `
        INSERT INTO consultations (id, "userId", name, email, phone, scope, date, "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        consObj.id,
        consObj.userId || null,
        consObj.name,
        consObj.email,
        consObj.phone,
        consObj.scope,
        consObj.date,
        consObj.createdAt ? new Date(consObj.createdAt) : new Date()
      ];
      const { rows } = await pgPool.query(query, values);
      return rows[0] || consObj;
    } catch (e) {
      console.error("[Postgres Error] dbCreateConsultation failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("consultations").insert([consObj]).select().maybeSingle();
      if (!error) return data || consObj;
      console.warn("[Supabase Warning] dbCreateConsultation failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbCreateConsultation failed, falling back:", e);
    }
  }
  const db = loadDb();
  db.consultations.push(consObj);
  saveDb(db);
  return consObj;
}

async function dbCreateOrder(orderObj) {
  if (isPgConnected && pgPool) {
    try {
      const query = `
        INSERT INTO orders (id, "userId", "customerName", "customerEmail", items, subtotal, "deliveryFee", total, "momoPhone", "momoReference", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const values = [
        orderObj.id,
        orderObj.userId || null,
        orderObj.customerName,
        orderObj.customerEmail,
        JSON.stringify(orderObj.items),
        orderObj.subtotal,
        orderObj.deliveryFee,
        orderObj.total,
        orderObj.momoPhone || null,
        orderObj.momoReference || null,
        orderObj.createdAt ? new Date(orderObj.createdAt) : new Date()
      ];
      const { rows } = await pgPool.query(query, values);
      return rows[0] || orderObj;
    } catch (e) {
      console.error("[Postgres Error] dbCreateOrder failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.from("orders").insert([orderObj]).select().maybeSingle();
      if (!error) return data || orderObj;
      console.warn("[Supabase Warning] dbCreateOrder failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbCreateOrder failed, falling back:", e);
    }
  }
  const db = loadDb();
  db.orders.push(orderObj);
  saveDb(db);
  return orderObj;
}

async function dbDeleteConsultation(id) {
  if (isPgConnected && pgPool) {
    try {
      await pgPool.query('DELETE FROM consultations WHERE id = $1', [id]);
      return true;
    } catch (e) {
      console.error("[Postgres Error] dbDeleteConsultation failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase.from("consultations").delete().eq("id", id);
      if (!error) return true;
      console.warn("[Supabase Warning] dbDeleteConsultation failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbDeleteConsultation failed, falling back:", e);
    }
  }
  const db = loadDb();
  const index = db.consultations.findIndex((c) => c.id === id);
  if (index !== -1) {
    db.consultations.splice(index, 1);
    saveDb(db);
    return true;
  }
  return false;
}

async function dbDeleteOrder(id) {
  if (isPgConnected && pgPool) {
    try {
      await pgPool.query('DELETE FROM orders WHERE id = $1', [id]);
      return true;
    } catch (e) {
      console.error("[Postgres Error] dbDeleteOrder failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (!error) return true;
      console.warn("[Supabase Warning] dbDeleteOrder failed, trying local ledger. Error:", error);
    } catch (e) {
      console.error("[Supabase Error] dbDeleteOrder failed, falling back:", e);
    }
  }
  const db = loadDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    db.orders.splice(index, 1);
    saveDb(db);
    return true;
  }
  return false;
}

async function dbGetStats() {
  if (isPgConnected && pgPool) {
    try {
      const { rows: rawUserRows } = await pgPool.query('SELECT * FROM users');
      const { rows: rawOrderRows } = await pgPool.query('SELECT * FROM orders');
      const { rows: rawConsultationRows } = await pgPool.query('SELECT * FROM consultations');
      
      const userRows = rawUserRows.map(normalizePgUser);
      const orderRows = rawOrderRows.map(normalizePgOrder);
      const consultationRows = rawConsultationRows.map(normalizePgConsultation);
      
      const totalUsers = userRows.length;
      const verifiedUsers = userRows.filter((u) => u.isVerified).length;
      const unverifiedUsers = totalUsers - verifiedUsers;
      const pinRequests = userRows.filter((u) => u.pinResetRequested).length;
      const totalOrders = orderRows.length;
      const ordersVolume = orderRows.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
      const totalConsultations = consultationRows.length;

      return {
        stats: {
          totalUsers,
          verifiedUsers,
          unverifiedUsers,
          pinRequests,
          totalOrders,
          ordersVolume,
          totalConsultations,
        },
        consultations: consultationRows,
        orders: orderRows,
      };
    } catch (e) {
      console.error("[Postgres Error] dbGetStats failed:", e);
    }
  }
  if (isSupabaseConnected && supabase) {
    try {
      const { count: totalUsers, error: uErr } = await supabase.from("users").select("*", { count: "exact", head: true });
      const { count: verifiedUsers, error: vErr } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("isVerified", true);
      const { count: pinRequests, error: pErr } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("pinResetRequested", true);
      const { count: totalOrders, error: oErr } = await supabase.from("orders").select("*", { count: "exact", head: true });
      const { count: totalConsultations, error: cErr } = await supabase.from("consultations").select("*", { count: "exact", head: true });
      
      const { data: orders, error: ordErr } = await supabase.from("orders").select("*");
      const { data: consultations, error: consErr } = await supabase.from("consultations").select("*");

      if (!uErr && !vErr && !pErr && !oErr && !cErr && !ordErr && !consErr) {
        const ordersVol = orders ? orders.reduce((sum, o) => sum + (o.total || 0), 0) : 0;
        return {
          stats: {
            totalUsers: totalUsers || 0,
            verifiedUsers: verifiedUsers || 0,
            unverifiedUsers: (totalUsers || 0) - (verifiedUsers || 0),
            pinRequests: pinRequests || 0,
            totalOrders: totalOrders || 0,
            ordersVolume: ordersVol,
            totalConsultations: totalConsultations || 0
          },
          consultations: consultations || [],
          orders: orders || []
        };
      }
      console.warn("[Supabase Warning] dbGetStats partially failed, trying local ledger.");
    } catch (e) {
      console.error("[Supabase Error] dbGetStats failed, falling back:", e);
    }
  }

  const db = loadDb();
  const totalUsers = db.users.length;
  const verifiedUsers = db.users.filter((u) => u.isVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const pinRequests = db.users.filter((u) => u.pinResetRequested).length;
  const totalOrders = db.orders.length;
  const ordersVolume = db.orders.reduce((sum, o) => sum + o.total, 0);
  const totalConsultations = db.consultations.length;

  return {
    stats: {
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      pinRequests,
      totalOrders,
      ordersVolume,
      totalConsultations,
    },
    consultations: db.consultations,
    orders: db.orders,
  };
}

// Load and save local JSON database structures
function loadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Ensure folder exists
      const parentDir = path.dirname(DB_PATH);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], orders: [], consultations: [], logs: [] }, null, 2));
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load local DB, resetting to empty. Error: ", error);
    return { users: [], orders: [], consultations: [], logs: [] };
  }
}

function saveDb(data) {
  try {
    const parentDir = path.dirname(DB_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    // Simple atomic write
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, DB_PATH);
  } catch (error) {
    console.error("Failed to write to local DB: ", error);
  }
}

// Generate an audit log entry
async function logSecurityEvent(userId, email, action, details) {
  try {
    const newLog = {
      id: "log_" + crypto.randomBytes(8).toString("hex"),
      timestamp: new Date().toISOString(),
      userId,
      userEmail: email,
      ip: "127.0.0.1",
      action,
      details,
    };
    await dbCreateLog(newLog);
  } catch (err) {
    console.error("Failed to write audit logs: ", err);
  }
}

// Cryptography tools
function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashValue(value, salt) {
  return crypto.pbkdf2Sync(value, salt, 1000, 64, "sha512").toString("hex");
}

function createSessionToken(userId) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiry
  const payload = JSON.stringify({ userId, expiresAt });
  const base64Payload = Buffer.from(payload).toString("base64");
  const signature = crypto.createHmac("sha256", SERVER_SECRET).update(base64Payload).digest("hex");
  return `${base64Payload}.${signature}`;
}

function verifySessionToken(token) {
  try {
    const [base64Payload, signature] = token.split(".");
    if (!base64Payload || !signature) return null;
    const expectedSignature = crypto.createHmac("sha256", SERVER_SECRET).update(base64Payload).digest("hex");
    if (expectedSignature !== signature) return null;
    const payloadStr = Buffer.from(base64Payload, "base64").toString("utf8");
    const { userId, expiresAt } = JSON.parse(payloadStr);
    if (Date.now() > expiresAt) return null;
    return userId;
  } catch {
    return null;
  }
}

function decryptRequestBody(req, res, next) {
  try {
    const encryptedFlag = req.headers["x-encrypted"];
    if (encryptedFlag !== "1") {
      return next();
    }

    const encrypted = req.body;
    if (!encrypted || !encrypted.iv || !encrypted.payload) {
      return res.status(400).json({ error: "Encrypted request body missing required fields." });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Encrypted request requires a valid Bearer token." });
    }

    const decrypted = decryptPayload(encrypted.payload, encrypted.iv, token);
    req.body = decrypted;
    next();
  } catch (err) {
    console.error("Failed to decrypt request body:", err);
    res.status(400).json({ error: "Unable to decrypt request body." });
  }
}

function decryptPayload(payload, iv, token) {
  const key = crypto.pbkdf2Sync(token, "sanop-group-encryption-salt-v1", 100000, 32, "sha256");
  const ivBuffer = Buffer.from(iv, "base64");
  const cipherBuffer = Buffer.from(payload, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuffer);
  decipher.setAuthTag(cipherBuffer.slice(cipherBuffer.length - 16));
  const data = Buffer.concat([
    decipher.update(cipherBuffer.slice(0, cipherBuffer.length - 16)),
    decipher.final(),
  ]);
  return JSON.parse(data.toString("utf8"));
}

// Middleware: Authenticated User check
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: No session active" });
  }
  const token = authHeader.split(" ")[1];
  const userId = verifySessionToken(token);
  if (!userId) {
    return res.status(401).json({ error: "Access Denied: Session expired or invalid" });
  }

  const user = await dbGetUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User profile no longer exists" });
  }

  req.user = user;
  next();
};

// Middleware: Admin check
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied: No session active" });
    }

    const token = authHeader.split(" ")[1];
    const userId = verifySessionToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Access Denied: Session expired or invalid" });
    }

    const user = await dbGetUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User profile no longer exists" });
    }

    if (user.role !== "admin") {
      await logSecurityEvent(user.id, user.email, "MALICIOUS_ACCESS_BLOCKED", "Non-admin attempted to query management APIs.");
      return res.status(403).json({ error: "Unauthorized: Administrator level required" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[Admin Auth Error] Failed to authenticate admin request:", err);
    res.status(500).json({ error: "Administrator authorization failure" });
  }
};

app.get("/api/db-status", async (req, res) => {
  // Re-verify on check to allow real-time refresh if tables were created
  if (hasSupabaseCreds && supabase && !isSupabaseTablesReady) {
    try {
      const { error } = await supabase.from("users").select("id").limit(1);
      if (!error) {
        isSupabaseTablesReady = true;
        isSupabaseConnected = true;
      }
    } catch (e) {}
  }
  res.json({
    supabase: {
      hasCreds: hasSupabaseCreds,
      connected: isSupabaseConnected,
      tablesReady: isSupabaseTablesReady
    },
    postgres: {
      connected: isPgConnected
    }
  });
});

/* --- 🔑 AUTHENTICATION & LOGIN APIS --- */

// 1. REGISTER USER
app.post("/api/auth/register", rateLimiter(10, 60000), async (req, res) => {
  try {
    // Prevent XSS injections in inputs recursively
    req.body = sanitizeValue(req.body);

    const { email, password, pin, fullName, phone, region, secretQuestion, secretAnswer } = req.body;
    if (!email || !password || !pin || !fullName || !phone || !region || !secretQuestion || !secretAnswer) {
      return res.status(400).json({ error: "Please fill out all mandatory registration fields" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Secure Password Complexity Validation
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: "Password must include at least one uppercase letter, one lowercase letter, and one number for cryptographic security." });
    }

    // Prevent duplicate emails
    const existingUser = await dbGetUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({ error: "This email address is already registered on the ecosystem" });
    }

    // Validate PIN (should be numeric and safe)
    if (!/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({ error: "Security PIN must be exactly 4 to 6 numbers" });
    }

    // Create secure salt hashes
    const passwordSalt = generateSalt();
    const passwordHash = hashValue(password, passwordSalt);

    const pinSalt = generateSalt();
    const pinHash = hashValue(pin.trim(), pinSalt);

    const secretAnswerSalt = generateSalt();
    const secretAnswerHash = hashValue(secretAnswer.trim().toLowerCase(), secretAnswerSalt);

    // Bootstrap Admin rule: dasonchris47@gmail.com and admin@sanop-group are instantly admin and verified
    const isBootstrapAdmin = cleanEmail === "dasonchris47@gmail.com" || cleanEmail === "admin@sanop-group";
    const userRole = isBootstrapAdmin ? "admin" : "user";
    const verificationStatus = isBootstrapAdmin ? true : false; // Users must be verified by admin

    const newUser = {
      id: "usr_" + crypto.randomBytes(8).toString("hex"),
      email: cleanEmail,
      passwordHash,
      passwordSalt,
      pinHash,
      pinSalt,
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: userRole,
      isVerified: verificationStatus,
      region,
      secretQuestion,
      secretAnswerHash: `${secretAnswerSalt}.${secretAnswerHash}`,
      pinResetRequested: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      classification: req.body.classification || "",
      fingerprintEnrolled: req.body.fingerprintEnrolled || false,
      biometricToken: req.body.biometricToken || null,
    };

    await dbCreateUser(newUser);

    logSecurityEvent(
      newUser.id,
      newUser.email,
      "USER_REGISTERED",
      `New network profile opened in ${region}. Role: ${userRole}. Verified: ${verificationStatus}.`
    );

    res.status(201).json({
      success: true,
      message: isBootstrapAdmin
        ? "Administrator account successfully registered and pre-verified!"
        : "Profile registered successfully! An administrator will verify your profile shortly.",
    });
  } catch (error) {
    console.error("Register Error: ", error);
    res.status(500).json({ error: "System failure occurred during registration" });
  }
});

// 2. LOGIN USER
app.post("/api/auth/login", rateLimiter(10, 60000), async (req, res) => {
  try {
    req.body = sanitizeValue(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await dbGetUserByEmail(cleanEmail);

    if (!user) {
      logSecurityEvent(null, cleanEmail, "LOGIN_FAILED", "Attempted login with non-existent email.");
      return res.status(400).json({ error: "Invalid login credentials provided" });
    }

    const computedHash = hashValue(password, user.passwordSalt);
    if (computedHash !== user.passwordHash) {
      logSecurityEvent(user.id, user.email, "LOGIN_FAILED", "Incorrect password keyed in.");
      return res.status(400).json({ error: "Invalid login credentials provided" });
    }

    const sessionToken = createSessionToken(user.id);
    logSecurityEvent(user.id, user.email, "LOGIN_SUCCESS", "Successfully authorized session.");

    res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        region: user.region,
        pinResetRequested: user.pinResetRequested,
        classification: user.classification || ""
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to authorize session" });
  }
});

// 3. GET CURRENT PROFILE
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      phone: req.user.phone,
      role: req.user.role,
      isVerified: req.user.isVerified,
      region: req.user.region,
      pinResetRequested: req.user.pinResetRequested,
      secretQuestion: req.user.secretQuestion,
      classification: req.user.classification || ""
    },
  });
});

// 4. VERIFY SECURITY PIN FOR PROTECTED ACTIONS
app.post("/api/auth/pin/verify", requireAuth, rateLimiter(15, 60000), (req, res) => {
  try {
    req.body = sanitizeValue(req.body);
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ error: "Secure numeric PIN is required for authorization" });
    }

    const computedPinHash = hashValue(pin.trim(), req.user.pinSalt);
    if (computedPinHash !== req.user.pinHash) {
      logSecurityEvent(req.user.id, req.user.email, "PIN_VERIFICATION_FAILED", "Failed attempt to verify transaction/firmware PIN.");
      return res.status(400).json({ verified: false, error: "Incorrect security PIN. Access denied." });
    }

    logSecurityEvent(req.user.id, req.user.email, "PIN_VERIFICATION_SUCCESS", "PIN verified successfully for protective transaction.");
    res.json({ verified: true, message: "Security PIN verified" });
  } catch (error) {
    res.status(500).json({ error: "PIN validation error" });
  }
});

// 5. USER TRIGGER PIN ASSISTANCE REQUEST
app.post("/api/auth/pin/reset-request", requireAuth, rateLimiter(10, 60000), async (req, res) => {
  try {
    await dbUpdateUser(req.user.id, { pinResetRequested: true });
    logSecurityEvent(req.user.id, req.user.email, "PIN_RESET_REQUESTED", "User requested PIN assistance check from administration.");
    res.json({ success: true, message: "Security Help request dispatched to the Admin Desk." });
  } catch (error) {
    res.status(500).json({ error: "PIN reset request failed" });
  }
});

// 6. SELF-SERVICE PIN RESET WITH SECRET QUESTION
app.post("/api/auth/pin/reset-self", rateLimiter(5, 60000), async (req, res) => {
  try {
    req.body = sanitizeValue(req.body);
    const { email, secretAnswer, newPin } = req.body;
    if (!email || !secretAnswer || !newPin) {
      return res.status(400).json({ error: "Email, secret answer and new PIN are required" });
    }

    if (!/^\d{4,6}$/.test(newPin)) {
      return res.status(400).json({ error: "New PIN must be exactly 4 to 6 numbers" });
    }

    const user = await dbGetUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Account not found" });
    }

    const [salt, savedHash] = user.secretAnswerHash.split(".");
    const computedAnswerHash = hashValue(secretAnswer.trim().toLowerCase(), salt);

    if (computedAnswerHash !== savedHash) {
      logSecurityEvent(user.id, user.email, "RESET_PIN_SELF_FAILED", "Attempted security-answer reset with incorrect answer.");
      return res.status(400).json({ error: "Incorrect security question answer" });
    }

    // Hash the new PIN
    const newPinSalt = generateSalt();
    const newPinHash = hashValue(newPin.trim(), newPinSalt);

    await dbUpdateUser(user.id, {
      pinSalt: newPinSalt,
      pinHash: newPinHash,
      pinResetRequested: false
    });

    logSecurityEvent(user.id, user.email, "RESET_PIN_SELF_SUCCESS", "Self-service PIN reset completed using secret security question.");

    res.json({ success: true, message: "Your PIN was updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset PIN securely" });
  }
});

// 7. UPDATE USER CLASSIFICATION (BUYER, RETAIL, DEPOT) WITH IMMEDIATE GENERATION
app.post("/api/auth/classification", requireAuth, rateLimiter(20, 60000), async (req, res) => {
  try {
    req.body = sanitizeValue(req.body);
    const { classification } = req.body;
    if (!classification || !["buyer", "retail", "depot"].includes(classification)) {
      return res.status(400).json({ error: "Please select a valid classification: buyer, retail, or depot" });
    }

    const updatedUser = await dbUpdateUser(req.user.id, { classification });
    if (!updatedUser) return res.status(404).json({ error: "User profile not found" });

    logSecurityEvent(
      req.user.id,
      req.user.email,
      "CLASSIFICATION_VERIFIED",
      `User classification verified as: ${classification.toUpperCase()}`
    );

    res.json({
      success: true,
      message: `Practitioner successfully verified as ${classification.toUpperCase()}! ID Certificate updated.`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        region: updatedUser.region,
        pinResetRequested: updatedUser.pinResetRequested,
        classification: updatedUser.classification
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify classification" });
  }
});

/* --- 📋 TRANSACTION & BOOKING SERVICE ENDPOINTS --- */

// BOOK DIAGNOSTICS SESSION
app.post("/api/consultations/create", rateLimiter(10, 60000), async (req, res) => {
  try {
    req.body = sanitizeValue(req.body);
    const { name, email, phone, scope, date } = req.body;
    if (!name || !email || !phone || !scope || !date) {
      return res.status(400).json({ error: "Mandatory consultation fields missing" });
    }

    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    let userId = null;
    let userEmail = null;
    if (token) {
      userId = verifySessionToken(token);
      if (userId) {
        const user = await dbGetUserById(userId);
        if (user) userEmail = user.email;
      }
    }

    const newConsultation = {
      id: "cns_" + crypto.randomBytes(8).toString("hex"),
      userId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      scope,
      date,
      createdAt: new Date().toISOString(),
    };

    await dbCreateConsultation(newConsultation);

    logSecurityEvent(
      userId,
      userEmail || email,
      "DIAGNOSTIC_CONSULTATION_BOOKED",
      `Diagnostics scheduled for ${date}. Target: ${scope}`
    );

    res.status(201).json({ success: true, data: newConsultation });
  } catch (error) {
    res.status(500).json({ error: "Consultation registry failure" });
  }
});

// DISPATCH ECOSYSTEM ORDER
app.post("/api/orders/create", rateLimiter(15, 60000), async (req, res) => {
  try {
    req.body = sanitizeValue(req.body);
    const { customerName, customerEmail, items, subtotal, deliveryFee, total, momoPhone, momoReference } = req.body;
    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Incomplete cart or customer metrics" });
    }

    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    let userId = null;
    if (token) {
      userId = verifySessionToken(token);
    }

    const newOrder = {
      id: "ord_" + crypto.randomBytes(8).toString("hex"),
      userId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      items,
      subtotal,
      deliveryFee,
      total,
      momoPhone: momoPhone ? String(momoPhone).trim() : undefined,
      momoReference: momoReference ? String(momoReference).trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    await dbCreateOrder(newOrder);

    logSecurityEvent(
      userId,
      customerEmail,
      "ORDER_PLACED",
      `Constructed biological dispatch order of ${items.length} items. Total value: $${total.toFixed(2)}`
    );

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Order pipeline synthesis error" });
  }
});

/* --- 👑 SECURED ADMINISTRATOR CONTROL APIS --- */

// 1. QUERY ALL USERS ON SYSTEM
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const users = await dbGetUsers();
    // Return sanitized user objects (no hashes, no salts!) for ultimate vulnerability protection
    const sanitized = users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      region: u.region,
      role: u.role,
      isVerified: u.isVerified,
      pinResetRequested: u.pinResetRequested,
      createdAt: u.createdAt,
    }));
    res.json({ success: true, users: sanitized });
  } catch (error) {
    res.status(500).json({ error: "Failed to query ecosystem registry" });
  }
});

// 2. QUERY SYSTEM AUDIT LOGS
app.get("/api/admin/logs", requireAdmin, async (req, res) => {
  try {
    const logs = await dbGetLogs();
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ error: "Failed to load audit logs stream" });
  }
});

// 3. SECURE VERIFICATION FLIPPER
app.post("/api/admin/users/:userId/verify", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { verified } = req.body;

    if (typeof verified !== "boolean") {
      return res.status(400).json({ error: "Verified status flag must be either true or false" });
    }

    const targetUser = await dbGetUserById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: "Target profile not registered" });
    }

    // Prevent administrators from de-verifying themselves accidentally
    if (targetUser.id === req.user.id) {
      return res.status(400).json({ error: "You cannot change your own verification state" });
    }

    await dbUpdateUser(userId, { isVerified: verified });

    logSecurityEvent(
      req.user.id,
      req.user.email,
      "USER_VERIFICATION_CHANGE",
      `Administrator changed verification of ${targetUser.email} to: ${verified}`
    );

    res.json({ success: true, message: `Profile verification updated successfully!` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile verification status" });
  }
});

// 4. ADMIN-ASSIST PIN RESET HELPER
app.post("/api/admin/users/:userId/reset-pin", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await dbGetUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "Ecosystem profile not found" });
    }

    // Generate a strong, highly visible secure temporary numeric PIN
    const tempPin = Math.floor(100000 + Math.random() * 900000).toString(); // Secure 6 digit numeric code
    const pinSalt = generateSalt();
    const pinHash = hashValue(tempPin, pinSalt);

    await dbUpdateUser(userId, {
      pinSalt,
      pinHash,
      pinResetRequested: false
    });

    logSecurityEvent(
      req.user.id,
      req.user.email,
      "USER_PIN_ADMIN_RESET",
      `Administrator generated and assigned temporary recovery PIN for ${user.email}.`
    );

    res.json({
      success: true,
      tempPin,
      message: `System temporary credentials prepared for ${user.fullName}. Temporary 6-Digit PIN: ${tempPin}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to execute administrative password reset" });
  }
});

// 5. UNILATERAL DELETE ACCOUNT
app.delete("/api/admin/users/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await dbGetUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "Target profile doesn't exist" });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ error: "You cannot terminate your own active administrator credentials" });
    }

    const removedEmail = user.email;
    await dbDeleteUser(userId);

    logSecurityEvent(
      req.user.id,
      req.user.email,
      "USER_TERMINATED",
      `Administrator deleted user profile ${removedEmail} from database.`
    );

    res.json({ success: true, message: `Account record completely purged.` });
  } catch (error) {
    res.status(500).json({ error: "Registry purge failure" });
  }
});

// 5b. UNILATERAL DELETE CONSULTATION/BOOKING
app.delete("/api/admin/consultations/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dbDeleteConsultation(id);
    if (!success) {
      return res.status(404).json({ error: "Consultation record not found" });
    }
    logSecurityEvent(
      req.user.id,
      req.user.email,
      "CONSULTATION_DELETED",
      `Administrator deleted clinical consultation reservation ID: ${id}`
    );
    res.json({ success: true, message: "Clinical booking reservation permanently deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete diagnostic booking record" });
  }
});

// 5c. UNILATERAL DELETE ORDER
app.delete("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dbDeleteOrder(id);
    if (!success) {
      return res.status(404).json({ error: "Order record not found" });
    }
    logSecurityEvent(
      req.user.id,
      req.user.email,
      "ORDER_DELETED",
      `Administrator deleted e-commerce order entry ID: ${id}`
    );
    res.json({ success: true, message: "Ecosystem order record completely deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order record" });
  }
});

// 6. GET ADMIN SYSTEM STATISTICS
app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const statsData = await dbGetStats();
    res.json({
      success: true,
      stats: statsData.stats,
      consultations: statsData.consultations,
      orders: statsData.orders,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to compile system metrics" });
  }
});

/* --- 🌐 COMPILING AND INTEGRATING FRONTEND MIDDLEWARES --- */

async function ensureAdminUserExists() {
  try {
    const adminEmail = "admin@sanop-group";
    const existingAdmin = await dbGetUserByEmail(adminEmail);

    if (!existingAdmin) {
      appLog(`[Admin Seed] Default admin ${adminEmail} not found. Creating...`);
      const passwordSalt = generateSalt();
      const passwordHash = hashValue("Admin@1234", passwordSalt);

      const pinSalt = generateSalt();
      const pinHash = hashValue("1234", pinSalt);

      const secretAnswerSalt = generateSalt();
      const secretAnswerHash = hashValue("accra", secretAnswerSalt);

      const defaultAdmin = {
        id: "usr_admin_default",
        email: adminEmail,
        passwordHash,
        passwordSalt,
        pinHash,
        pinSalt,
        fullName: "Sanop Group Administrator",
        phone: "+233 24 000 0000",
        role: "admin",
        isVerified: true,
        region: "Ecosystem Operations Center",
        secretQuestion: "What is the capital of Ghana?",
        secretAnswerHash: `${secretAnswerSalt}.${secretAnswerHash}`,
        pinResetRequested: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await dbCreateUser(defaultAdmin);
      appLog(`[Admin Seed] Default admin account successfully created.`);
    } else {
      appLog(`[Admin Seed] Confirming presence of admin account ${adminEmail}. Checking credentials...`);
      const passwordHash = hashValue("Admin@1234", existingAdmin.passwordSalt);
      let updated = false;
      const updates = {};

      if (existingAdmin.role !== "admin") {
        updates.role = "admin";
        updated = true;
      }
      if (!existingAdmin.isVerified) {
        updates.isVerified = true;
        updated = true;
      }
      if (existingAdmin.passwordHash !== passwordHash) {
        appLog(`[Admin Seed] Admin password out of sync. Restoring standard Admin@1234 hash...`);
        updates.passwordHash = passwordHash;
        updated = true;
      }

      if (updated) {
        updates.updatedAt = new Date().toISOString();
        await dbUpdateUser(existingAdmin.id, updates);
        appLog(`[Admin Seed] Default admin account updated and synchronized.`);
      }
    }
  } catch (err) {
    console.error("[Admin Seed Error] Failed to ensure default admin user: ", err);
  }
}

async function startServer() {
  // Ensure database tables are created if using Postgres
  await initializePgTables();

  // Ensure Supabase connectivity state is known before accepting requests
  if (hasSupabaseCreds && supabase) {
    await checkSupabaseTables();
  }

  // Ensure standard admin login exists with correct credentials
  await ensureAdminUserExists();

  const isProduction = process.env.NODE_ENV === "production" || 
                       (typeof __filename !== "undefined" && (__filename.includes("dist") || __filename.includes("server.cjs"))) ||
                       (process.argv[1] && (process.argv[1].includes("dist") || process.argv[1].includes("server.cjs")));

  // Mount Vite development middlewares when NOT in production
  if (!isProduction) {
    const hmrPort = await resolvePort(HMR_PORT, {
      strict: !!process.env.HMR_PORT,
      attempts: 20,
      name: "HMR port"
    });

    appLog(`[Vite HMR] resolved port ${hmrPort} for HMR`);

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: hmrPort,
          protocol: "ws",
          host: "127.0.0.1"
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Statically serve built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    let serverPort;
    try {
      serverPort = await resolvePort(PORT, {
        strict: !!process.env.PORT,
        name: "port"
      });
    } catch (err) {
      console.error("[Server Startup Error]", err.message || err);
      process.exit(1);
    }

    const server = app.listen(serverPort, "0.0.0.0", () => {
      appLog(`[Server] Listening on port ${serverPort}`);
      if (!isDebug) {
        console.log(`Server is running on http://localhost:${serverPort}`);
      }
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`[Server Startup Error] Port ${serverPort} is already in use.`);
      } else {
        console.error("[Server Startup Error]", err);
      }
      process.exit(1);
    });
  }
}

startServer();

export default app;
