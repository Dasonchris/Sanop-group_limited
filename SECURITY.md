# Sanop Group Ecosystem - Professional Security Audit & Compliance

This server and client bundle is fortified using industry-grade **Defense-In-Depth** design constraints. Below is a full summary of active mitigations, defensive shields, and setup guides.

---

## 🛡️ Core Defensive Layers

### 1. Robust Injection & XSS Shield
*   **Recursive Payload Sanitizer:** Every piece of incoming request data on the registration, login, MoMo cart purchases, and clinic consultations endpoint is parsed recursively using standard sanitization heuristics. Any scripts, custom tag structures (`<script>`), double-quote injections, and HTML parameters are stripped or safely HTML-escaped before arriving at the database query engines.
*   **X-XSS-Protection Header:** Leverages real-time active browser checks to immediately block page loads attempting to bounce structural reflect attacks off parameters.

### 2. Intelligent Non-Relational & SQL Parameterization (Postgrest Protection)
*   **No Raw SQL Execution:** Because we migrate the storage engine to the official `@supabase/supabase-js` framework, standard text-query SQL injections are fundamentally eliminated by Supabase's automatic backend parameter mapping.
*   **Schema Isolation:** All active transaction tables are scoped exclusively inside the `public` schema. Indices on high-throughput columns (like `users.email` and `logs.timestamp desc`) defend the database against resource starvation/exhaustion attacks during periods of heavy usage.

### 3. High-Performance Token HMAC Integrity
*   Your Express server issues session identifiers designed via secure base64 blocks coupled with individual cryptographic signature verification:
    $$\text{Token} = \text{Base64}(\text{Payload}) \mathbin{.} \text{HMAC-SHA256}(\text{Base64}(\text{Payload}),\ \text{SERVER\_SECRET})$$
*   No database hits are required during preliminary validation passes, ensuring ultra-low latency while instantly repelling manipulated tokens.

### 4. Dynamic Defensive Rate-Limiting & Anti-Brute-Force Engines
*   **Endpoint Throttling:** Strict custom rate limiting filters the registration, login, secure PIN verification, and order checkout routes.
*   **Memory Leak Guard:** Limits are tracking client IPs dynamically within standard sliding time windows, with sliding queues safely GC-collected every **60 seconds** to preserve heap memory.

### 5. Advanced Resilience Architecture (Dual Offline-First Persistence)
*   **Automatic Ledger Fallback:** If the primary remote live database (Supabase) experiences packet loss, network outages, or high-latency periods, transactions are instantly registered in a secured local server-level write-ahead log (`/server/db.json`) and client-side browser storage synchronously. 
*   **Audit Logging Stream:** Security metrics or unusual administrative maneuvers immediately trigger signed event actions within a secure system log.

---

## 🛠️ Supabase Database Migration Guide

To synchronize the database cleanly with Supabase, run the statements inside `/schema.sql` inside your **Supabase Workspace SQL Editor**:

1. Log inside your **Supabase Dashboard**.
2. Navigate to your target project.
3. Access **SQL Editor** from the left navigation guide.
4. Create a new query block, drag or copy the exact contents of `/schema.sql`.
5. Click **Run**. Your tables, compound indexes, row-level security (RLS) policies, and default secure admin account are initialized immediately.

---

## 🔑 Recommended Production Keys Setup

Verify that `/index.html` headers are backed by strong environment values inside your cloud host or platform controls (never publish these keys inside standard public code files!):

```env
# Secure encryption key for signing tokens
SESSION_SECRET=Your_Ultra_Secure_Random_64_Char_Session_Key

# Supabase direct API configurations
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (Use Service Role Key to enable secure API communication)
```
