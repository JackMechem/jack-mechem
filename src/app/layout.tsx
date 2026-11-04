/**
 * Root layout for every page (public site and /admin): fonts, global styles,
 * default metadata and the theme.
 *
 * Dark is the default theme. The inline script below runs before the page
 * paints and applies a theme saved by the toggle, so there's no flash.
 */
import "@/styles/index.css";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Jost } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/content/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// Display face (headings) and text face; exposed as CSS variables used in styles/base.css.
const display = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap", adjustFontFallback: false });
const text = Jost({ subsets: ["latin"], variable: "--font-text", display: "swap" });

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
