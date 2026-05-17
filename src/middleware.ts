import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply COOP/COEP to /create page — required by @imgly/background-removal
  // for SharedArrayBuffer support in ONNX runtime
  if (request.nextUrl.pathname === '/create') {
    const response = NextResponse.next();
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    return response;
  }
}

export const config = {
  matcher: '/create',
};
