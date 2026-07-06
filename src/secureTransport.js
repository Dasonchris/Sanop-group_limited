const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function base64Encode(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function base64Decode(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(token) {
  const salt = textEncoder.encode("sanop-group-encryption-salt-v1");
  const baseKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(token),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptJSON(data, token) {
  const key = await deriveKey(token);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = textEncoder.encode(JSON.stringify(data));
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plain
  );
  return {
    iv: base64Encode(iv),
    payload: base64Encode(new Uint8Array(cipherBuffer)),
  };
}

async function decryptJSON(payload, iv, token) {
  const key = await deriveKey(token);
  const cipherBytes = base64Decode(payload);
  const ivBytes = base64Decode(iv);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    cipherBytes
  );
  return JSON.parse(textDecoder.decode(plainBuffer));
}

export async function postEncryptedJSON(url, data, token) {
  if (!token) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  const encrypted = await encryptJSON(data, token);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Encrypted": "1",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(encrypted),
  });
}

export async function postJSON(url, data, token) {
  return postEncryptedJSON(url, data, token);
}
