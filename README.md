# FitLip web experience

Next.js 15.5.27 / React 19 / TypeScript / Tailwind 4 / React Three Fiber / drei / GSAP ScrollTrigger / Framer Motion. Built for Vercel.

Live website: https://fitlip.vercel.app

Vercel project: https://vercel.com/amansamanis-projects/fitlip

## Local use

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`. Development uses `.next-dev`, production uses `.next`, so their output cannot collide.

## Directory map

```text
src/
  app/
    layout.tsx                  Self-hosted fonts, metadata and theme
    page.tsx                    Landing route
    globals.css                 Responsive visual system
    api/download/route.ts       Same-origin download redirect
    api/release/route.ts        Public release metadata
  components/
    fitlip-experience.tsx       Landing page, gallery, FAQ and sticky CTA
    download/
      download-provider.tsx     Modal, install stepper, QR, local SHA-256 verification
    scene/
      scene-loader.tsx          Lazy Canvas, capability detection and CSS fallback
      phone-scene.tsx           Phone layers, materials, particles and selective bloom
  hooks/use-scroll-scene.ts     GSAP disassembly timeline and metric badge sequence
  lib/release.ts                Actual release metadata and screenshot catalogue
public/
  screens/                     Optimized actual app screenshots
  downloads/fitlip-2.0.0.apk    Local release copy (excluded from Vercel upload)
scripts/
  verify-release.mjs           Build gate: compare size and SHA-256
  prepare-screens.mjs          WebP conversion from supplied originals
```

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

- Lazy-loaded R3F renderer; zero external model or environment-map fetches.
- Procedural rounded-box phone geometry; no GLB asset requiring Draco or Meshopt decoding.
- Particle field uses one points draw call. Pointer velocity modulates drift.
- Pixel ratio capped below 2; performance decline reduces it to 1 and disables bloom.
- Canvas stops rendering when off-screen or the document is hidden.
- Reduced motion, data saver, low device capability, WebGL creation errors and context loss use the reserved CSS phone fallback. CSS fallback remains visible during scene loading.
- Mobile uses a compact scroll layout. The full exploded phone sequence is desktop-only.
- Optional gyroscope tilt asks for permission on platforms that require it.
- Bloom is restrained. Depth of field and chromatic aberration are intentionally omitted to preserve app-screen readability and mobile performance.
- Native dialog provides modal focus trapping and Escape handling. The opener regains focus after closing. Preview switches are keyboard accessible.
- QR encodes the current origin installation page; mobile scanning only works after deployment or when served from an address reachable by the phone.

## Security and maintenance

Never commit `.env.local`, Vercel credentials, or Blob tokens. The public website never receives Blob write credentials. The browser checksum tool reads the selected file locally and compares it with the release fingerprint; it does not upload the APK. It uses Web Crypto and may require more memory on low-end devices.

`npm audit` reported zero vulnerabilities at implementation time. A PostCSS override and patched Sharp dependency retain the requested Next.js 15 major while resolving dependency advisories. Keep the lockfile and review future patch updates.

This website has not undergone a conversion experiment, an Android device installation test, or a comprehensive accessibility audit. Motion is adaptive rather than a guarantee of 60–120 FPS on every device.
