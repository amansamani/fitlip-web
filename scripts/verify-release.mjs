import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
const file = new URL('../public/downloads/fitlip-2.0.0.apk', import.meta.url);
const downloadUrl = 'https://github.com/amansamani/fitlip-releases/releases/download/Create_new_tag_v1.0.0_on_publish/fitlip.V2.0.0.apk';
const expected = 'fcea2574fd2e9a0695611aad0e23d72bfd48f774fe34c58755dec38f72014fe0';
if (!existsSync(file)) {
  const url = new URL(downloadUrl);
  if (url.protocol !== 'https:') throw new Error('APK URL must use HTTPS.');
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error('Remote APK unavailable.');
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of response.body) { hash.update(chunk); bytes += chunk.length; }
  if (bytes !== 172448930 || hash.digest('hex') !== expected) throw new Error('Remote APK checksum or size mismatch.');
  console.log('Remote APK SHA-256 and size verified.');
} else {
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of createReadStream(file)) { hash.update(chunk); bytes += chunk.length; }
  if (bytes !== 172448930 || hash.digest('hex') !== expected) throw new Error('Bundled APK checksum or size mismatch.');
  console.log('Bundled APK SHA-256 and size verified.');
}
