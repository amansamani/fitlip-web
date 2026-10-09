export const release = {
  version: '2.0.0',
  versionCode: 1,
  packageName: 'com.amansamani.aihealthfrontend',
  minAndroid: '8.0',
  minSdk: 26,
  bytes: 162673198,
  size: '162.7 MB',
  sha256: 'a304c1b00cf7ab5612d04c8a6fa6e441ed4cdd0fc9a891593770b5dd8d4871df',
  filename: 'fitlip-2.0.0.apk',
  path: '/downloads/fitlip-2.0.0.apk',
  scanStatus: 'unverified',
} as const;
export const screens = [
  { id: 'home', label: 'Overview', src: '/screens/home.webp', alt: 'FitLip home screen with daily nutrition and activity overview' },
  { id: 'coach', label: 'AI coach', src: '/screens/coach.webp', alt: 'FitLip Coach showing a seven day calorie chart from recorded meals' },
  { id: 'nutrition', label: 'Nutrition', src: '/screens/nutrition.webp', alt: 'FitLip meal plan with calorie budget and macro breakdown' },
  { id: 'workouts', label: 'Training', src: '/screens/workouts.webp', alt: 'FitLip weekly workout plan with equipment options' },
  { id: 'tracking', label: 'Activity', src: '/screens/tracking.webp', alt: 'FitLip daily activity tracking with steps, active calories and sleep' },
] as const;

/** Public origin used to build the QR code. Set NEXT_PUBLIC_SITE_URL when you use a custom domain. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fitlip.vercel.app';
/** SHA-256 of the Android signing certificate, verified with apksigner (see README). */
export const signingCertSha256 = 'f79fcd8937facb5457a6578f8505dc047c51ef8a4fdd41fa6cac3be8120afa1c';
