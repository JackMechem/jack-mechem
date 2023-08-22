import "../globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Header from "./components/header";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Jack Mechem",
    description: "My Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.className + " h-screen w-screen bg-primary"}>
                <Header />
                {children}
            </body>
        </html>
    );
}
