import type { MetadataRoute } from 'next';
import { canonicalOrigin } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${canonicalOrigin}/` }];
}
