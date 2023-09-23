import "../globals.css";
import type { Metadata } from "next";
import Header from "./components/header";
import MobileNav from "./components/mobileNav";
import LayoutWrapper from "./components/layoutWrapper";

export const metadata: Metadata = {
    title: "Jack Mechem",
    description: "My Personal Website and Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <LayoutWrapper>
                <Header />
                <MobileNav />
                {children}
                <div className="h-[65px] w-full"></div>
            </LayoutWrapper>
        </html>
    );
}
