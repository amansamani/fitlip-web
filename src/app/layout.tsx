import type { Metadata, Viewport } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'FitLip: meals, workouts and runs in one app',
  description:
    'FitLip logs your meals from a photo, plans your training, tracks your runs, and answers from your own records. Download the Android app and verify it.',
  applicationName: 'FitLip',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1b0f24',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
