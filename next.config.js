/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // project screenshots uploaded through /admin live in Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

module.exports = nextConfig;
