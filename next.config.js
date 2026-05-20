/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@react-email/components", "@react-email/render", "resend"],
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
