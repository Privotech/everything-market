/**
 * Cryptographic & Security Subsystem
 *
 * Implements zero-trust authentication primitives:
 * - PBKDF2-SHA512 password hashing with 100,000 iterations & 32-byte salts
 * - Timing-safe hash comparison to mitigate side-channel timing attacks
 * - HMAC-SHA256 session token generation and tamper-proof verification
 * - NIST-aligned password strength scoring and dictionary attack guards
 * - Zero-dependency Web Crypto API implementation for high-throughput security
 */

export interface PasswordStrengthResult {
  score: number; // 0 (terrible) to 4 (very strong)
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong';
  percentage: number;
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    notCommon: boolean;
  };
  feedback: string[];
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'MODERATOR' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  issuedAt: number;
  expiresAt: number;
}

const COMMON_WEAK_PASSWORDS = new Set([
  'password',
  'password123',
  '12345678',
  '123456789',
  'qwerty123',
  'admin123',
  'welcome123',
  'letmein123',
  'everythingmarket',
]);

const DEFAULT_SECRET = 'everything-market-neon-postgresql-secret-key-2026-v1';

// Convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Timing-safe equal comparison
export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Hash a password using PBKDF2-SHA512 with a cryptographically secure random salt.
 * Output format: "pbkdf2:sha512:100000:<saltHex>:<hashHex>"
 */
export async function hashPassword(
  plainText: string,
  customSaltHex?: string
): Promise<string> {
  const iterations = 100000;
  let salt: Uint8Array;

  if (customSaltHex) {
    salt = hexToBytes(customSaltHex);
  } else {
    salt = new Uint8Array(32);
    crypto.getRandomValues(salt as unknown as Uint8Array<ArrayBuffer>);
  }

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(plainText) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-512',
    },
    keyMaterial,
    512 // 64 bytes
  );

  const hashHex = bytesToHex(new Uint8Array(derivedBits));
  const saltHex = bytesToHex(salt);

  return `pbkdf2:sha512:${iterations}:${saltHex}:${hashHex}`;
}

/**
 * Verify a plaintext password against a stored PBKDF2-SHA512 hash string.
 */
export async function verifyPassword(
  plainText: string,
  storedHashString: string
): Promise<boolean> {
  if (!storedHashString || !storedHashString.startsWith('pbkdf2:sha512:')) {
    return false;
  }

  const parts = storedHashString.split(':');
  if (parts.length !== 5) {
    return false;
  }

  const [, , , saltHex, expectedHashHex] = parts;
  const computed = await hashPassword(plainText, saltHex);
  const computedHashHex = computed.split(':')[4];

  return constantTimeEquals(expectedHashHex, computedHashHex);
}

/**
 * Evaluate password strength with comprehensive NIST and multi-factor rule checks.
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const p = password || '';
  const checks = {
    minLength: p.length >= 8,
    hasUpper: /[A-Z]/.test(p),
    hasLower: /[a-z]/.test(p),
    hasNumber: /[0-9]/.test(p),
    hasSpecial: /[^A-Za-z0-9]/.test(p),
    notCommon: !COMMON_WEAK_PASSWORDS.has(p.toLowerCase().trim()),
  };

  let passed = 0;
  if (checks.minLength) passed++;
  if (checks.hasUpper && checks.hasLower) passed++;
  if (checks.hasNumber) passed++;
  if (checks.hasSpecial) passed++;
  if (checks.notCommon && p.length >= 12) passed++;

  const feedback: string[] = [];
  if (!checks.minLength) feedback.push('At least 8 characters required');
  if (!checks.hasUpper) feedback.push('Add an uppercase letter (A-Z)');
  if (!checks.hasLower) feedback.push('Add a lowercase letter (a-z)');
  if (!checks.hasNumber) feedback.push('Add a number (0-9)');
  if (!checks.hasSpecial) feedback.push('Add a special character (!@#$%^&*)');
  if (!checks.notCommon) feedback.push('Password is too common or easily guessed');

  let score = 0;
  let label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' = 'Very Weak';
  let percentage = 15;

  if (p.length === 0) {
    score = 0;
    label = 'Very Weak';
    percentage = 0;
  } else if (passed <= 2 || !checks.notCommon) {
    score = 1;
    label = 'Weak';
    percentage = 25;
  } else if (passed === 3) {
    score = 2;
    label = 'Weak';
    percentage = 50;
  } else if (passed === 4) {
    score = 3;
    label = 'Fair';
    percentage = 75;
  } else {
    score = 4;
    label = 'Strong';
    percentage = 100;
  }

  return {
    score,
    label,
    percentage,
    checks,
    feedback,
  };
}

/**
 * Generate a signed session token (HMAC-SHA256 signature over Base64URL JSON payload)
 */
export async function generateSessionToken(
  payload: Omit<AuthTokenPayload, 'issuedAt' | 'expiresAt'>,
  ttlHours = 168, // 7 days
  secret = DEFAULT_SECRET
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthTokenPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + ttlHours * 3600,
  };

  const enc = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify(fullPayload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput));
  const signature = bytesToHex(new Uint8Array(signatureBuffer));

  return `${signingInput}.${signature}`;
}

/**
 * Verify a signed session token
 */
export async function verifySessionToken(
  token: string,
  secret = DEFAULT_SECRET
): Promise<{ valid: boolean; payload?: AuthTokenPayload; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureBytes = hexToBytes(signature);
  const isSignatureValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes as unknown as BufferSource,
    enc.encode(signingInput) as unknown as BufferSource
  );

  if (!isSignatureValid) {
    return { valid: false, error: 'Invalid token signature (tamper detected)' };
  }

  try {
    const rawPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload: AuthTokenPayload = JSON.parse(rawPayload);

    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt && payload.expiresAt < now) {
      return { valid: false, error: 'Session expired. Please sign in again.' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Payload decode error' };
  }
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Sanitize human names (strip dangerous HTML/script injection vectors)
 */
export function sanitizeName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .replace(/[<>'"&]/g, '')
    .slice(0, 100);
}
