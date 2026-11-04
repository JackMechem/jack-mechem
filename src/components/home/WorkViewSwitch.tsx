"use client";

/**
 * The Crate / Shelf switch in the Work section's header. Both layouts are on
 * the page; this sets `data-work-view` on <html> and styles/shelf.css shows
 * the chosen one. The choice is saved in localStorage and restored before
 * first paint by the script in app/layout.tsx, so there's no flash.
 */
import { useSyncExternalStore } from "react";
import { WORK_VIEW_STORAGE_KEY, type WorkView } from "@/lib/workView";

const VIEWS: { id: WorkView; label: string }[] = [
  { id: "crate", label: "Crate" },
  { id: "shelf", label: "Shelf" },
];

// The <html data-work-view> attribute is the source of truth; re-render when it changes.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-work-view"] });
  return () => observer.disconnect();
}
const currentView = (): WorkView => (document.documentElement.dataset.workView === "shelf" ? "shelf" : "crate");

function chooseView(next: WorkView) {
  document.documentElement.dataset.workView = next;
  try {
    localStorage.setItem(WORK_VIEW_STORAGE_KEY, next);
  } catch {
    // private browsing: the choice just won't persist
  }
}

export function WorkViewSwitch() {
  const view = useSyncExternalStore(subscribe, currentView, () => "crate" as WorkView);

  return (
    <div className="work-switch" role="group" aria-label="Layout">
      {VIEWS.map((v) => (
        <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => chooseView(v.id)}>
          {v.label}
        </button>
      ))}
    </div>
  );
}
