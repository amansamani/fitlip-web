# FitLip web

Next.js 15.5.27 / React 19 / TypeScript / Tailwind 4 / React Three Fiber / drei / Framer Motion. Built for Vercel.

Live website: https://fitlip.vercel.app

## Local use

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`. `npm run build` runs the APK checksum gate first, so it needs the real APK in `public/downloads/` or `APK_DOWNLOAD_URL` set. For a quick UI-only build, run `npx next build`.

## Page structure

The opening is a continuous, scroll-controlled 3D product story, followed by everyday feature cards, Android download, QR dialog, installation FAQ, and file-integrity controls.

The eight story chapters are: introduction → daily overview → meal capture → nutrition → training → outdoor activity → daily tracking → AI coach. One Three.js phone moves between sides, tilts, moves through depth, and crossfades real app screenshots. Procedural scene objects add context: a plate, macro rings, a dumbbell, an outdoor route, activity rings, and a coaching chart. The opening adapts the native splash's bouncing F, purple bloom, and Exercise / Diet / Track icons, without orbit rings or looping movement. Normal scrolling works in both directions on desktop and mobile. Chapter buttons jump to exact scene landings; Skip tour leads directly to the supporting sections.

The header and footer use the exact custom vector wordmark from the mobile app's `src/components/share/FitLipWordmark.tsx`, including the sweeping F and original letter/dot outlines. This is not an approximated font.

## Main implementation files

- `src/components/landing/scroll-story.tsx`: scroll progress, chapter copy, direct navigation, reading mode, WebGL boundary, and visibility handling.
- `src/components/landing/splash-elements.tsx`: native splash identity and finite entrance animation.
- `src/components/landing/story-canvas.tsx`: real 3D phone, screen crossfades, smooth camera-relative motion, and procedural scene objects.
- `src/lib/story.ts`: chapter narrative, screenshots, chapter interpolation, and choreography keyframes.
- `src/components/brand/fitlip-wordmark.tsx`: authentic mobile wordmark geometry.
- `src/components/landing/landing-page.tsx`: navigation, supporting features, download, QR, and FAQs.
- `src/app/story.css`: narrative layout and responsive behavior.
- `src/app/landing.css`: base design system and supporting sections; older three-chapter rules are retained but no longer used.
- `src/lib/seo.ts`: canonical origin, metadata copy, and WebSite/MobileApplication JSON-LD.
- `src/app/layout.tsx`: title, description, canonical, Open Graph, Twitter, robots metadata, and fonts.
- `src/app/robots.ts`, `src/app/sitemap.ts`: crawler rules and canonical sitemap.
- `public/opengraph-image.png`: custom 1200 × 630 share image using the real wordmark and app screen.
- `src/app/apple-icon.png`: 180 × 180 icon derived from the existing app mark.

## Editing and SEO

Edit the story content and timing in `src/lib/story.ts`. The animation maps scroll progress to the same chapter data, including the fallback screenshots. Set `NEXT_PUBLIC_SITE_URL` to the intended production origin for canonical URLs, the sitemap, structured data, and QR download. Default: `https://fitlip.vercel.app`.

All eight chapter narratives are present in the server-rendered HTML. The 3D scene loads separately on the client. Metadata describes the actual Android app; structured data does not invent reviews, ratings, pricing, or publisher claims. The sitemap includes the landing page; crawler rules exclude API routes and APK files. Search Console submission and public indexing checks require a future deployment and were not performed.

## APK release

- App/package: Fitlip / `com.amansamani.aihealthfrontend`
- Version: 2.0.0, version code 1
- Minimum SDK: 26 (Android 8.0), target SDK 36
- Size: 162,673,198 bytes (162.7 decimal MB)
- SHA-256: `a304c1b00cf7ab5612d04c8a6fa6e441ed4cdd0fc9a891593770b5dd8d4871df`
- Android signing certificate SHA-256: `f79fcd8937facb5457a6578f8505dc047c51ef8a4fdd41fa6cac3be8120afa1c`
- Android signature verified using the installed Android SDK apksigner. This is not a malware scan or proof of publisher identity. No VirusTotal clean badge or malware-free guarantee is asserted.

The screenshot data is sample app activity, not promised outcomes. The website displays interactive screenshot previews; it does not run the native app or connect to its backend. Existing app branding remains visible inside the screenshots.

## Downloads and Vercel

The 162.7 MB APK exceeds the documented Hobby CLI source-upload limit. `.vercelignore` excludes it from the website deployment. A public Vercel Blob store holds the immutable release artifact. `APK_DOWNLOAD_URL` must be configured in Vercel before building without the bundled APK.

`GET /api/download` returns a no-store 307 redirect to the configured HTTPS asset URL, or a relative static asset path for local use. No 162.7 MB response is buffered in a Vercel Function. The CDN/Blob delivery supports a complete file download; the static fallback sets attachment headers. `GET /api/release` returns public metadata.

Build verification streams and checks the external APK if the bundled file is absent. Do not deploy without a successful hash check. Do not change a published release in place: publish a new versioned filename, update the metadata and expected values in the build script, and verify it before deployment.

## Motion and resilience

- The 3D scene is dynamically imported and guarded by an error boundary and context-loss handler. Its real screenshot fallback remains until the first rendered frame.
- Save-data preferences, low reported memory, or unavailable WebGL use the screenshot presentation.
- Rendering runs on demand during scroll and interpolation, then pauses when settled, outside the story, and while the document is hidden. Pixel ratio is capped at 1.5; environments and scene geometry are procedural and local.
- Reduced-motion preferences and short landscape viewports show the complete static reading mode. Anyone can choose Read the tour or Skip tour.
- One shared scroll spring synchronizes the phone, screen crossfades, headings, and progress. Camera interpolation and screen crossfades are reversible. Copy fades away during the center of a scene transition to avoid overlapping headings.
- The attached scroll-world reference informed narrative continuity; this implementation uses real-time 3D, not paid generated video.
- Native QR dialogs retain Escape handling and browser focus containment. Existing APK redirect and integrity metadata remain unchanged.

## Security and maintenance

Never commit `.env.local`, Vercel credentials, or Blob tokens. The public website never receives Blob write credentials. The browser checksum tool reads the selected file locally and compares it with the release fingerprint; it does not upload the APK. It uses Web Crypto and may require more memory on low-end devices.

`npm audit` reported zero vulnerabilities at implementation time. A PostCSS override and patched Sharp dependency retain the requested Next.js 15 major while resolving dependency advisories. Keep the lockfile and review future patch updates.

This website has not undergone a conversion experiment, an Android device installation test, or a comprehensive accessibility audit. Motion is adaptive rather than a guarantee of 60–120 FPS on every device.

