import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';
import { IMAGE_CONFIG } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

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

    // Save to database as binary — no Vercel Blob needed
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await prisma.tempUpload.create({
      data: {
        data: buffer,
        mimeType: file.type,
      },
    });

    // Build the image URL using the request's origin
    const url = `${new URL(req.url).origin}/api/temp/${upload.id}`;

    return NextResponse.json({ url });
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Upload error:', err);
    return NextResponse.json({ error: '上傳失敗' }, { status: 500 });
  }
}
