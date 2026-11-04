import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jack Mechem",
    short_name: "Jack Mechem",
    description: "Real-time audio software and developer tools in Rust and TypeScript.",
    start_url: "/",
    display: "standalone",
    background_color: "#100f0d",
    theme_color: "#100f0d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
