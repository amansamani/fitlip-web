import type { MetadataRoute } from 'next';
import { canonicalOrigin } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{userAgent:'*',allow:'/',disallow:['/api/','/downloads/']}], sitemap: `${canonicalOrigin}/sitemap.xml`, host: canonicalOrigin };
}
