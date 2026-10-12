import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
const file = new URL('../public/downloads/fitlip-2.0.0.apk', import.meta.url);
const expected = 'b186c84d1cf92c8b61f3695f98dd44cafd29590b30c24dc1cacd7a5a0e4cdfbf';
if (!existsSync(file)) {
  if (!process.env.APK_DOWNLOAD_URL) throw new Error('APK missing and APK_DOWNLOAD_URL is not set.');
  const url = new URL(process.env.APK_DOWNLOAD_URL);
  if (url.protocol !== 'https:') throw new Error('APK URL must use HTTPS.');
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error('Remote APK unavailable.');
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of response.body) { hash.update(chunk); bytes += chunk.length; }
  if (bytes !== 166565551 || hash.digest('hex') !== expected) throw new Error('Remote APK checksum or size mismatch.');
  console.log('Remote APK SHA-256 and size verified.');
} else {
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of createReadStream(file)) { hash.update(chunk); bytes += chunk.length; }
  if (bytes !== 166565551 || hash.digest('hex') !== expected) throw new Error('Bundled APK checksum or size mismatch.');
  console.log('Bundled APK SHA-256 and size verified.');
}
