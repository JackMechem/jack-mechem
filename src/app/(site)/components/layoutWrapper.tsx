"use client";

import { useTheme } from "@/stores/useThemeStore";
import { Nunito } from "next/font/google";
import { useEffect, useState } from "react";

const nunito = Nunito({ subsets: ["latin"] });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const theme: string = useTheme();
    const [themeTwo, setThemeTwo] = useState(theme);
    console.log(theme);

    useEffect(() => {
        setThemeTwo(theme);
    }, [theme]);

    return (
        <>
            {themeTwo.includes("dark") ? (
                <body className={nunito.className + " h-screen w-screen bg-primary dark-theme"}>
                    {children}
                </body>
            ) : (
                themeTwo.includes("light") && (
                    <body className={nunito.className + " h-screen w-screen bg-primary"}>
                        {children}
                    </body>
                )
            )}
        </>
    );
}
