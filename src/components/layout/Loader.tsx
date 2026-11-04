/**
 * Loading screens: the logo record spinning on a blank page.
 *
 * <BootScreen> is in the root layout (app/layout.tsx), so it's part of the very
 * first HTML and shows before anything else paints. A small inline script
 * marks <html data-booted> once the page has loaded (images included), or after
 * BOOT_MAX_MS at the latest, and the screen fades out. Without JavaScript it's
 * hidden straight away.
 *
 * <Loader> is the same record without the full-screen cover, for loading.tsx
 * files: Next.js shows it while the server renders a page you navigate to.
 * Styles: styles/loader.css
 */
import { RecordMark } from "./RecordMark";

const BOOT_MAX_MS = 4000;

// Runs as soon as it's parsed. Marks the page as booted on window load, or after the cap.
const bootScript = `(function(){var d=document.documentElement,done=function(){d.dataset.booted=""};if(document.readyState==="complete")done();else{addEventListener("load",done,{once:true});setTimeout(done,${BOOT_MAX_MS})}})()`;

export function Loader({ label = "Dropping the needle" }: { label?: string }) {
  return (
    <div className="loader" role="status">
      <span className="loader-disc">
        <RecordMark size={64} />
      </span>
      <span className="loader-label cap">{label}</span>
    </div>
  );
}

export function BootScreen() {
  return (
    <>
      <div className="boot" aria-hidden="true">
        <Loader />
      </div>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <noscript>
        <style>{`.boot{display:none}`}</style>
      </noscript>
    </>
  );
}
