import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://unidev.store';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/dashboard/', '/checkout/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}