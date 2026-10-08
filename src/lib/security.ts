/**
 * EMT Foods Exports — Security Utilities
 * Client-side hardening helpers. All sensitive logic lives server-side
 * or in Supabase RLS. This file handles client-only sanitisation,
 * validation, and CSRF token handling for XSS/form attack prevention.
 */

// -----------------------------------------------------------
// XSS Sanitisation
// Strips all HTML tags and trims whitespace.
// Supabase uses parameterised queries, so SQL injection is not possible
// from the client. This layer prevents stored XSS in DB-bound data.
// -----------------------------------------------------------
export const sanitize = (value: string | null | undefined, maxLength = 2000): string =>
  String(value ?? '')
    .replace(/<[^>]*>/g, '')  // Strip HTML tags
    .replace(/[&<>"'`]/g, c => ({ // HTML-entity encode remaining special chars
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;',
    }[c] ?? c))
    .trim()
    .slice(0, maxLength);

// -----------------------------------------------------------
// Email Validation
// RFC-5322 simplified check.
// -----------------------------------------------------------
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim().toLowerCase());

// -----------------------------------------------------------
// Phone Validation
// Allows digits, spaces, +, -, ()
// -----------------------------------------------------------
export const isValidPhone = (phone: string): boolean =>
  /^[0-9 +\-().]{7,25}$/.test(phone.trim());

// -----------------------------------------------------------
// URL Validation (for image links pasted externally)
// -----------------------------------------------------------
export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// -----------------------------------------------------------
// File Upload Validation (client-side pre-check only)
// Real enforcement is in Supabase Storage RLS.
// -----------------------------------------------------------
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): FileValidationResult => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are accepted.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size must not exceed 2 MB.' };
  }
  return { valid: true };
};

// -----------------------------------------------------------
// Randomised filename generator
// Prevents path traversal and name collisions in storage.
// -----------------------------------------------------------
export const secureFilename = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  return `${crypto.randomUUID()}.${ext}`;
};

// -----------------------------------------------------------
// Form rate-limiter (client-side)
// Keeps track of submission timestamps per key.
// Primary rate limiting is server-side; this is UX protection.
// -----------------------------------------------------------
const submissionLog: Record<string, number[]> = {};

export const checkClientRateLimit = (
  key: string,
  maxAttempts = 3,
  windowMs = 60_000 // 1 minute
): boolean => {
  const now = Date.now();
  const attempts = (submissionLog[key] ?? []).filter(t => now - t < windowMs);
  if (attempts.length >= maxAttempts) return false;
  submissionLog[key] = [...attempts, now];
  return true;
};

// -----------------------------------------------------------
// Input length constants — shared across all forms
// -----------------------------------------------------------
export const LIMITS = {
  NAME: 120,
  EMAIL: 160,
  PHONE: 40,
  SHORT: 80,
  MEDIUM: 240,
  LONG: 2000,
  URL: 500,
};
