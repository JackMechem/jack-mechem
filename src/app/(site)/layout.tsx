import "../globals.css";
import type { Metadata, Viewport } from "next";
import SideNav from "./components/SideNav";
import LayoutWrapper from "./components/layoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const noFlashScript = `(function(){try{var raw=localStorage.getItem("theme");var v="light";if(raw==="dark"||raw==="light"){v=raw}else{try{v=JSON.parse(raw).state.theme}catch(e){}}if(v==="dark"){document.documentElement.classList.add("dark-theme")}}catch(e){}})();`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f5fc" },
    { media: "(prefers-color-scheme: dark)", color: "#20232c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jackmechem.dev"),
  title: {
    template: "%s | Jack Mechem",
    default: "Jack Mechem",
  },
  description:
    "I'm an independent web developer and musician from Las Vegas, Nevada.",
  keywords: [
    "Jack Mechem",
    "Jack",
    "Mechem",
    "Website",
    "React",
    "Nextjs",
    "Musician",
    "Music",
    "Developer",
    "Freelance",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrains.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body
        className={
          jetbrains.className +
          " bg-[#ffffff] dark-theme:bg-[#0F1318] overflow-hidden"
        }
      >
        <SpeedInsights />
        <LayoutWrapper>
          <SideNav />
          <div className="flex-1 overflow-y-auto pt-[52px] lg:pt-0 lg:m-[10px_10px_10px_0px] lg:rounded-2xl lg:border lg:border-blue/20 min-w-0">
            {children}
          </div>
        </LayoutWrapper>
      </body>
    </html>
  );
}
