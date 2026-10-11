import { siteUrl, release } from './release';

export const canonicalOrigin = new URL(siteUrl).origin;
export const seoTitle = 'FitLip | AI Fitness Coach, Nutrition & Workout Tracker';
export const seoDescription = 'Meet FitLip for Android: log meals with a photo, plan workouts, track runs and daily activity, and explore your progress with an AI coach. Download the app.';

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${canonicalOrigin}/#website`, url: `${canonicalOrigin}/`, name: 'FitLip', description: seoDescription, inLanguage: 'en' },
    {
      '@type': 'MobileApplication', '@id': `${canonicalOrigin}/#app`, name: 'FitLip',
      url: `${canonicalOrigin}/`, description: seoDescription, applicationCategory: 'HealthApplication',
      operatingSystem: `Android ${release.minAndroid} or later`, softwareVersion: release.version,
      fileSize: release.size, downloadUrl: `${canonicalOrigin}/api/download`,
      image: `${canonicalOrigin}/opengraph-image.png`,
      screenshot: ['home','camera','nutrition','workouts','run','tracking','coach'].map(name=>`${canonicalOrigin}/screens/${name}.webp`),
      featureList: ['Meal photo logging with review','Calorie and macronutrient tracking','Workout planning','Running, walking, and cycling tracking','Steps, active calories, and sleep tracking','AI coaching using logged records'],
      mainEntityOfPage: `${canonicalOrigin}/`,
    },
  ],
};
