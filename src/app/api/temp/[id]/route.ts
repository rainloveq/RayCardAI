import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const upload = await prisma.tempUpload.findUnique({
      where: { id: params.id },
    });

    if (!upload) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return new NextResponse(new Uint8Array(upload.data), {
      headers: {
        'Content-Type': upload.mimeType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Error', { status: 500 });
  }
}
