import { NextResponse } from 'next/server';
import { release } from '@/lib/release';

export const dynamic = 'force-dynamic';
export function GET() {
  let target: URL;
  try {
    target = new URL(release.downloadUrl);
    if (target.protocol !== 'https:' || target.username || target.password) throw new Error('Invalid APK URL');
  } catch {
    return NextResponse.json({ error: 'Download is temporarily unavailable. Please try again later.' }, { status: 503 });
  }
  // GitHub Release assets respond with an attachment, so the browser downloads directly.
  const response = new NextResponse(null, {status:307,headers:{Location: target.href}});
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-APK-SHA256', release.sha256);
  return response;
}
