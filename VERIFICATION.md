# Validation record — 8 October 2026

## Completed

- Production compilation and TypeScript checking pass with Next.js 15.5.27.
- `npm audit` reports zero known dependency vulnerabilities after applying the PostCSS and Sharp fixes.
- Android SDK `aapt` identifies version 2.0.0, code 1, minimum SDK 26, target SDK 36.
- Android SDK `apksigner verify --print-certs` passes.
- Local download endpoint returns HTTP 307 with a relative location and the expected `X-APK-SHA256` header.
- Local static APK response returns HTTP 200, Android package MIME type, and attachment filename.
- Streaming the entire local HTTP download yields exactly 162,673,198 bytes and the release SHA-256 fingerprint.
- Browser file verifier accepts the supplied APK and reports that it matches the published release.
- QR dialog renders and points at the installation page on the current origin.
- Installation stepper advances through all three steps; the illustrative Android permission switch toggles.
- App screen selection updates the displayed screen and pressed state.
- Phone rendering, exploded layers, and module badge choreography inspected in a desktop browser.
- Desktop 1440×1000 and mobile 390×844 layouts inspected; no document horizontal overflow at either size.
- No browser errors or warnings observed in the final local preview check.
- Vercel cloud build independently streamed and verified the hosted APK's SHA-256 and size.
- Public production home page and release endpoint return HTTP 200 without Vercel authentication.
- Public download handler returns HTTP 307 to the Vercel Blob asset.
- Hosted APK responds with HTTP 200, content length 162673198, APK MIME type, and attachment filename `fitlip-2.0.0.apk`.

Production website: https://fitlip.vercel.app
Vercel project: https://vercel.com/amansamanis-projects/fitlip

## Limits of this validation

No installation was performed on a physical Android phone. No independent malware scan, device compatibility matrix, formal accessibility audit, frame-rate benchmark, or conversion experiment was performed. Motion permission and context-loss fallback are implemented but were not exercised on physical low-power devices. The supplied screenshots demonstrate the native app UI; this site does not connect to the app backend.

The Vercel Blob release URL is public, versioned, and non-overwriting:

https://mgrl0hrlmguvtqw3.public.blob.vercel-storage.com/releases/fitlip-2.0.0.apk?download=1
