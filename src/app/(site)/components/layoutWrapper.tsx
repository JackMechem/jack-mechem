"use client";

import { useTheme } from "@/stores/useThemeStore";
import { Nunito } from "next/font/google";
import { useState, useEffect } from "react";

const nunito = Nunito({ subsets: ["latin"] });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const theme: string = useTheme();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, [isHydrated]);

    return (
        <>
            {isHydrated && theme.includes("dark") ? (
                <body
                    className={
                        nunito.className +
                        " h-screen w-screen bg-primary overflow-y-scroll dark-theme"
                    }
                >
                    {children}
                </body>
            ) : (
                theme.includes("light") && (
                    <body
                        className={
                            nunito.className + " h-screen w-screen overflow-y-scroll bg-primary"
                        }
                    >
                        {children}
                    </body>
                )
            )}
        </>
    );
}
