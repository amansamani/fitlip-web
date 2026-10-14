export const release = {
  version: '2.0.0',
  versionCode: 3,
  packageName: 'com.fitlip.app',
  minAndroid: '8.0',
  minSdk: 26,
  bytes: 172448930,
  size: '172.45 MB',
  sha256: 'fcea2574fd2e9a0695611aad0e23d72bfd48f774fe34c58755dec38f72014fe0',
 filename: 'fitlip.V2.0.0.apk',
  path: '/downloads/fitlip.V2.0.0.apk',
  downloadUrl: 'https://github.com/amansamani/fitlip-releases/releases/download/Create_new_tag_v1.0.0_on_publish/fitlip.V2.0.0.apk',
  scanStatus: 'unverified',
} as const;
export const screens = [
  { id: 'home', label: 'Overview', src: '/screens/home.webp', alt: 'FitLip home screen with daily nutrition and activity overview' },
  { id: 'nutrition', label: 'Nutrition', src: '/screens/nutrition.webp', alt: 'FitLip meal plan with calorie budget and macro breakdown' },
  { id: 'progress', label: 'Progress', src: '/screens/progress.webp', alt: 'FitLip weekly nutrition progress, logging consistency, and weight change summary' },
  { id: 'camera', label: 'Meal camera', src: '/screens/camera.webp', alt: 'FitLip meal camera with photo capture and gallery options' },
  { id: 'workouts', label: 'Training', src: '/screens/workouts.webp', alt: 'FitLip weekly workout plan with equipment options' },
  { id: 'tracking', label: 'Activity', src: '/screens/tracking.webp', alt: 'FitLip daily activity tracking with steps, active calories and sleep' },
  { id: 'run', label: 'Outdoor', src: '/screens/run.webp', alt: 'FitLip outdoor run, walk, and cycle tracking screen' },
  { id: 'coach', label: 'AI coach', src: '/screens/coach.webp', alt: 'FitLip Coach showing a personalized diet plan from FitLip records' },
] as const;

/** Public origin used to build the QR code. Set NEXT_PUBLIC_SITE_URL when you use a custom domain. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fitlip.amansamani.me';
/** SHA-256 of the Android signing certificate, verified with apksigner (see README). */
export const signingCertSha256 = '97161d8f322fcf9611fa8b31a6e2d6ad0def6414e2773d2e918452a3b2defe87';
