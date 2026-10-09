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

1. **Hero**: headline in the display face, two actions.
2. **Phone tour**: a pinned 3D phone shows seven real app screens (Home, Diet, Coach, Camera, Exercise, Track, Run). The phone starts on the left with the text on the right. As you scroll it descends, then swoops down and across to the other side while the text moves to the left, and so on. A dock and counter show where you are.
3. **Download**: APK button, QR code (laptops and desktops only), SHA-256 with copy, in-browser file check, terminal commands, signing certificate, install steps.

## Directory map

```text
src/
  app/
    layout.tsx                  Self-hosted fonts (Inter, Instrument Serif), metadata, viewport
    page.tsx                    Landing route (server component)
    globals.css                 Tailwind 4 theme tokens, hero entrance, reduced motion
    icon.svg                    Favicon (FL mark)
    api/download/route.ts       Same-origin download redirect
    api/release/route.ts        Public release metadata
  components/
    brand/fitlip-mark.tsx       FL mark, copied from the app
    landing/
      preloader.tsx             Short logo screen that lifts away
      nav.tsx                   Top bar
      hero.tsx                  Hero
      phone-tour.tsx            Scroll section: progress, text, dock, counter, WebGL guard
      phone-canvas.tsx          R3F phone: metal body, screen textures, procedural lighting
      download-section.tsx      Download, QR, hash check, install steps
  lib/
    release.ts                  Release metadata (version, size, SHA-256, signing cert, site URL)
    tour.ts                     Screen list, copy, and the scroll path of the phone
public/
  screens/                      Real app screenshots (WebP)
  downloads/fitlip-2.0.0.apk    Local release copy (excluded from Vercel upload)
scripts/
  verify-release.mjs            Build gate: compare size and SHA-256
  prepare-screens.mjs           WebP conversion from supplied originals
```

## Editing the page

- **Screen copy and order**: `STEPS` in `src/lib/tour.ts`. Add a screenshot to `public/screens/` and a new entry; the tour length, counter and dock follow automatically.
- **How the phone moves**: `pose()` in `src/lib/tour.ts`. Side, descent, swoop and the point where the screen swaps are all there.
- **Colors and fonts**: `@theme` in `src/app/globals.css`.
- **Download URL and QR**: the button points to `/api/download`. The QR encodes `NEXT_PUBLIC_SITE_URL` (default `https://fitlip.vercel.app`) plus `/api/download`. Set the variable if you move to a custom domain.

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

- The 3D phone loads only in the browser (`next/dynamic`, `ssr: false`) and renders only while the tour is on screen.
- Lighting is procedural (drei `Lightformer`), so no HDR file is fetched. The phone body is a rounded box, so no GLB is needed.
- Pixel ratio is capped at 2.
- If WebGL is unavailable, the tour shows the current screen as a flat image.
- Reduced motion turns off the swoop, tilt and pointer parallax, the hero entrance and the preloader delay.
- Below 54rem the tour stacks: phone on top, text underneath, and the dock collapses to dots.
- QR code: encodes the download URL on `NEXT_PUBLIC_SITE_URL`; mobile scanning works once the site is deployed.

## Security and maintenance

Never commit `.env.local`, Vercel credentials, or Blob tokens. The public website never receives Blob write credentials. The browser checksum tool reads the selected file locally and compares it with the release fingerprint; it does not upload the APK. It uses Web Crypto and may require more memory on low-end devices.

`npm audit` reported zero vulnerabilities at implementation time. A PostCSS override and patched Sharp dependency retain the requested Next.js 15 major while resolving dependency advisories. Keep the lockfile and review future patch updates.

This website has not undergone a conversion experiment, an Android device installation test, or a comprehensive accessibility audit. Motion is adaptive rather than a guarantee of 60–120 FPS on every device.
