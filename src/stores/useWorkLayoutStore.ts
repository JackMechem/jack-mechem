"use client";

import { useSyncExternalStore } from "react";

type Layout = "grid" | "list";
const STORAGE_KEY = "work-layout";
const DEFAULT: Layout = "list";

function getLayout(): Layout {
    if (typeof localStorage === "undefined") return DEFAULT;
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === "grid" || v === "list") return v;
    } catch {}
    return DEFAULT;
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

export function useWorkLayout(): Layout {
    return useSyncExternalStore(subscribe, getLayout, () => DEFAULT);
}

export function useSetWorkLayout() {
    return function setLayout(layout: Layout) {
        try {
            localStorage.setItem(STORAGE_KEY, layout);
        } catch {}
        listeners.forEach((cb) => cb());
    };
}
