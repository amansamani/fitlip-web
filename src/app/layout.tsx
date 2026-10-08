import type { Metadata, Viewport } from 'next';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'FitLip — Build your better.',
  description: 'Your meals. Your movement. Your momentum. Meet FitLip: AI coaching, nutrition, workouts and activity in one Android app. Download v2.0.0 directly.',
  applicationName: 'FitLip',
  robots: {index: true, follow: true},
};
export const viewport: Viewport = {themeColor: '#07080A', width: 'device-width', initialScale: 1};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
