/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.thehindu.com' },
      { protocol: 'https', hostname: '**.thgimages.com' },
      { protocol: 'https', hostname: 'images.indianexpress.com' },
      { protocol: 'https', hostname: 'pib.gov.in' },
    ],
  },
};
module.exports = nextConfig;
