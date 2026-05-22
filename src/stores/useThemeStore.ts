"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";

function getTheme(): "light" | "dark" {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark-theme") ? "dark" : "light";
}

function getThemeSnapshot(): "light" | "dark" {
    return getTheme();
}

function getServerSnapshot(): "light" | "dark" {
    return "light";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

function notifyListeners() {
    listeners.forEach((cb) => cb());
}

export function useTheme(): "light" | "dark" {
    return useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);
}

export function useSetTheme() {
    return function setTheme() {
        const isDark = document.documentElement.classList.toggle("dark-theme");
        try {
            localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
        } catch {}
        notifyListeners();
    };
}
