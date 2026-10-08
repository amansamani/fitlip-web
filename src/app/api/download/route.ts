import { NextResponse } from 'next/server';
import { release } from '@/lib/release';

export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  const external = process.env.APK_DOWNLOAD_URL?.trim();
  let target: URL;
  try {
    target = external ? new URL(external) : new URL(release.path, request.url);
    if (external && (target.protocol !== 'https:' || target.username || target.password)) throw new Error('Invalid APK URL');
  } catch {
    return NextResponse.json({ error: 'Download is temporarily unavailable. Please try again later.' }, { status: 503 });
  }
  // Deliver through the static CDN or Blob. Never buffer a 162.7 MB APK in a Vercel Function.
  const response = new NextResponse(null, {status:307,headers:{Location: external ? target.href : release.path}});
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-APK-SHA256', release.sha256);
  return response;
}
