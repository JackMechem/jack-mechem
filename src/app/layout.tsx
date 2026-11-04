/**
 * Root layout for every page (public site and /admin): fonts, global styles,
 * default metadata and the theme.
 *
 * Dark is the default theme. The inline script below runs before the page
 * paints and applies a theme saved by the toggle, so there's no flash.
 * <BootScreen> covers the page with a loading screen until it has loaded.
 */
import "@/styles/index.css";
import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/content/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { BootScreen } from "@/components/layout/Loader";

// Instrument Sans for everything: titles use its condensed width (--display-stretch in styles/base.css).
const sans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });

const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100f0d",
};

// Page titles are "<page> | Jack Mechem". The share image is app/opengraph-image.png.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { template: "%s | Jack Mechem", default: "Jack Mechem: audio software & developer tools" },
  description: `${site.hero} ${site.heroSub}`,
  openGraph: { type: "website", siteName: "Jack Mechem" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain">
        <BootScreen />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
