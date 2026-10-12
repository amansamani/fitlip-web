# Validation record — 12 October 2026

## Completed

- Production compilation and TypeScript checking pass with Next.js 15.5.27.
- The release checksum gate accepts the bundled APK at exactly 166,565,551 bytes with SHA-256 `b186c84d1cf92c8b61f3695f98dd44cafd29590b30c24dc1cacd7a5a0e4cdfbf`.
- Android SDK `aapt2` identifies FitLip 2.0.0, version code 3, package `com.fitlip.app`, minimum SDK 26, and target SDK 36.
- The APK contains native libraries for ARM64, ARMv7, x86, and x86_64.
- Android SDK `apksigner` verifies the APK Signature Scheme v2 signature and one signer with certificate SHA-256 `97161d8f322fcf9611fa8b31a6e2d6ad0def6414e2773d2e918452a3b2defe87`.
- All eight supplied 1080 × 2340 screenshots were converted to optimized 810 × 1755 WebP assets and visually inspected.
- The additional weekly-nutrition capture is retained as `progress.webp` and used in the story, tour, release gallery data, and structured metadata.
- The Open Graph image was refreshed with the new home screen and visually inspected at 1200 × 630.
- Local `/api/release` returns version code 3, package `com.fitlip.app`, the new byte size, and the new fingerprint.
- Local `/api/download` returns HTTP 307 to `/downloads/fitlip-2.0.0.apk` with `Cache-Control: no-store` and the matching `X-APK-SHA256` header.
- The local static APK returns HTTP 200 with the Android package MIME type, attachment filename, range support, and content length 166,565,551.
- Server-rendered page output includes the 166.6 MB release size, full fingerprint, and the new weekly-progress asset.
- The refreshed opening scene was inspected in a 1440 × 1000 browser capture.
- No deployment was performed.

## Limits of this validation

No installation was performed on a physical Android phone. No independent malware scan, device compatibility matrix, formal accessibility audit, frame-rate benchmark, or conversion experiment was performed. Motion permission and context-loss fallback were not exercised on physical low-power devices. The supplied screenshots demonstrate the native app UI; this site does not connect to the app backend.
