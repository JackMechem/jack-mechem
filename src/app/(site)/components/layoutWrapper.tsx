"use client";

import { useTheme } from "@/stores/useThemeStore";
import { JetBrains_Mono } from "next/font/google";
import { useState, useEffect } from "react";

const jetbrains = JetBrains_Mono({ subsets: ["latin"] });

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
                        jetbrains.className +
                        " bg-[#0F1318] dark-theme overflow-hidden"
                    }
                >
                    {children}
                </body>
            ) : (
                theme.includes("light") && (
                    <body
                        className={
                            jetbrains.className + " bg-[#ffffff] overflow-hidden"
                        }
                    >
                        {children}
                    </body>
                )
            )}
        </>
    );
}
