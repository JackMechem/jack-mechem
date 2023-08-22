import type { Metadata } from "next";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Jack Mechem Sanity Admin Panel",
    description: "Sanity Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="h-screen w-screen bg-primary">{children}</body>
        </html>
    );
}
