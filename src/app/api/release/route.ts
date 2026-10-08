import { release } from '@/lib/release';
export function GET() { return Response.json({...release, path:'/api/download'}, { headers: { 'Cache-Control': 'public, max-age=300' } }); }
