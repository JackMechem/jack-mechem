import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Jost } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/content/site";

const display = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap", adjustFontFallback: false });
const text = Jost({ subsets: ["latin"], variable: "--font-text", display: "swap" });

// Runs before paint so the saved theme never flashes. Dark is the default.
const themeScript = `try{var t=localStorage.getItem("jm-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100f0d",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { template: "%s | Jack Mechem", default: "Jack Mechem: audio software & developer tools" },
  description: `${site.hero} ${site.heroSub}`,
  openGraph: { type: "website", siteName: "Jack Mechem" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
