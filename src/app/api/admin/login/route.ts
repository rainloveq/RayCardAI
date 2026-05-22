import { NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminCookie } from '@/lib/adminAuth';

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: '密碼錯誤' }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ success: true });
}
