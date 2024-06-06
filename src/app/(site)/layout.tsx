import "../globals.css";
import type { Metadata } from "next";
import Nav from "./components/nav";
import LayoutWrapper from "./components/layoutWrapper";
import Header from "./components/header";

export const metadata: Metadata = {
    title: "Jack Mechem",
    description: "My Personal Website and Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <LayoutWrapper>
                <div className="fixed md:top-[20px] md:right-[20px] md:left-[20px] md:bottom-[20px] top-[5px] right-[5px] bottom-[5px] left-[5px] pt-[104px] bg-primary text-foreground overflow-y-scroll">
                    <Header />
                    {children}
                    <Nav />
                </div>
            </LayoutWrapper>
        </html>
    );
}
