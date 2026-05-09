/**
 * SACC Tower - AES-256-GCM Encryption Utility
 * =============================================
 * 
 * Uses the Web Crypto API (SubtleCrypto) for AES-256-GCM encryption.
 * AES-512 does not exist as a standard; AES-256 is the strongest AES variant.
 * GCM mode provides authenticated encryption (confidentiality + integrity).
 * 
 * SECURITY NOTES:
 * - Encryption key is derived from a passphrase using PBKDF2 (100,000 iterations)
 * - Each encryption generates a random 96-bit IV (nonce)
 * - Ciphertext includes authentication tag (GCM provides this automatically)
 * - In production, store the master passphrase in sys_properties with encryption=true
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;

/**
 * Derives an AES-256 key from a passphrase using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts plaintext using AES-256-GCM
 * Returns a base64-encoded string containing: salt + iv + ciphertext
 */
export async function encryptAES256(plaintext: string, passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(passphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plaintext)
  );

  // Combine salt + iv + ciphertext into a single buffer
  const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts an AES-256-GCM encrypted string
 * Input is a base64-encoded string containing: salt + iv + ciphertext
 */
export async function decryptAES256(encryptedBase64: string, passphrase: string): Promise<string> {
  const decoder = new TextDecoder();
  const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(passphrase, salt);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );

  return decoder.decode(plainBuffer);
}

/**
 * Master passphrase for credential encryption.
 * In production, this should be fetched from a ServiceNow system property
 * (sys_properties) with encryption enabled, NOT hardcoded.
 */
const MASTER_PASSPHRASE = "sacctower-aes256-master-key-change-in-production";

/**
 * Encrypt a credential value for storage
 */
export async function encryptCredential(value: string): Promise<string> {
  if (!value) return "";
  return encryptAES256(value, MASTER_PASSPHRASE);
}

/**
 * Decrypt a stored credential value
 */
export async function decryptCredential(encrypted: string): Promise<string> {
  if (!encrypted) return "";
  try {
    return await decryptAES256(encrypted, MASTER_PASSPHRASE);
  } catch {
    console.error("Failed to decrypt credential. Key may have changed.");
    return "[DECRYPTION FAILED]";
  }
}
