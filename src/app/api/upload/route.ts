import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/checkSession';
import { IMAGE_CONFIG } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    await requireAuth();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '請選擇圖片' }, { status: 400 });
    }

    if (file.size > IMAGE_CONFIG.maxSizeBytes) {
      return NextResponse.json({ error: '圖片超過 8MB 限制' }, { status: 400 });
    }

    if (!IMAGE_CONFIG.acceptedTypes.includes(file.type)) {
      return NextResponse.json({ error: '只接受 JPG/PNG 格式' }, { status: 400 });
    }

    // If no Vercel Blob configured, use a temporary local approach
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Convert to base64 data URL for demo/dev (not suitable for production)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({ url: dataUrl });
    }

    // Production: upload to Vercel Blob
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Upload error:', err);
    return NextResponse.json({ error: '上傳失敗' }, { status: 500 });
  }
}
