import { createHash } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export async function setAdminCookie(): Promise<void> {
  const token = hashPassword(process.env.ADMIN_PASSWORD || 'default');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === hashPassword(process.env.ADMIN_PASSWORD);
}

export function requireAdmin(): void {
  // Throws in server component context; use isAdmin() check instead
}
