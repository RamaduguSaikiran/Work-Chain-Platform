// src/utils/crypto.ts

/**
 * Calculates the SHA-256 hash of a string.
 * @param str The string to hash.
 * @returns A promise that resolves to the hex-encoded SHA-256 hash.
 */
export async function sha256(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
