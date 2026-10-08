import type { NextConfig } from 'next';
const config: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/(.*)', headers: [
        {key: 'X-Content-Type-Options', value: 'nosniff'},
        {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
        {key: 'X-Frame-Options', value: 'DENY'},
        {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'}
      ]},
      { source: '/downloads/:path*', headers: [
        {key: 'Content-Type', value: 'application/vnd.android.package-archive'},
        {key: 'Content-Disposition', value: 'attachment; filename="fitlip-2.0.0.apk"'},
        {key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}
      ]}
    ];
  }
};
export default config;
