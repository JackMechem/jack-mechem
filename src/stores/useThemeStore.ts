import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
    persist(
        (set: any, get: any) => ({
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
);

export const useTheme = () => useStore((state: any) => state.theme);
export const useSetTheme = () => useStore((state: any) => state.setTheme);
