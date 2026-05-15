// Simple in-memory rate limiter (resets on server restart)
type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count += 1;
  if (entry.count > maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

// Common disposable email domains (freemail/temporary)
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'throwaway.email', 'sharklasers.com', 'trashmail.com', 'yopmail.com',
  'dispostable.com', 'temp-mail.org', 'fakeinbox.com', 'moakt.com',
  'maildrop.cc', 'harakirimail.com', '33mail.com', 'spam4.me',
  'wegwerfmail.de', 'nwytg.com', 'temporarymail.com', 'mytrashmail.com',
]);

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  return true;
}

export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: '密碼至少需要 8 個字元' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個英文字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個數字' };
  }
  return { valid: true, message: '' };
}
