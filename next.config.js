/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Screenshots normally live in public/. Ones uploaded through /admin are served
    // from Vercel Blob, so next/image needs permission to optimise images from there.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

module.exports = nextConfig;
