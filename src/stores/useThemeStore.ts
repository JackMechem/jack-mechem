import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ThemeState {
    theme: "light" | "dark";
    setTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
    devtools(
        persist(
            (set, get) => ({
                theme: "light",
                setTheme: () =>
                    set((state: any) => ({
                        ...state,
                        theme: get().theme === "dark" ? "light" : "dark",
                    })),
            }),
            {
                name: "theme", // name of the item in the storage (must be unique)
            }
        )
    )
);

export const useTheme = () => useThemeStore((state) => state.theme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
