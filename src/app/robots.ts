import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/history', '/bookmarks', '/analytics'],
      },
    ],
    sitemap: 'https://taazi-khabar-fe.vercel.app/sitemap.xml',
  }
}
