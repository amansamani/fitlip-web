import type { Metadata, Viewport } from 'next';
import { Inter, Archivo } from 'next/font/google';
import './globals.css';
import { canonicalOrigin, seoTitle, seoDescription } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: { default: seoTitle, template: '%s | FitLip' },
  description: seoDescription,
  applicationName: 'FitLip',
  alternates: { canonical: '/' },
  category: 'health and fitness',
  openGraph: {
    type: 'website', locale: 'en_US', url: '/', siteName: 'FitLip',
    title: seoTitle, description: seoDescription,
    images: [{url:'/opengraph-image.png',width:1200,height:630,alt:'FitLip — meals, movement, and your AI coach, together on Android'}],
  },
  twitter: { card: 'summary_large_image', title: seoTitle, description: seoDescription, images: ['/opengraph-image.png'] },
  robots: { index: true, follow: true, googleBot: { index:true, follow:true, 'max-image-preview':'large', 'max-snippet':-1, 'max-video-preview':-1 } },
};

export const viewport: Viewport = {
  themeColor: '#f5f0e8',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
