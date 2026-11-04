"use client";

/**
 * Browser-side upload helpers for the admin forms (optional: needs Vercel Blob).
 */

/** Upload a file straight from the browser to Vercel Blob. Returns its public URL. */
export async function uploadFile(file: Blob, pathname: string, onProgress?: (pct: number) => void) {
  const { upload } = await import("@vercel/blob/client");
  try {
    const res = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/admin/upload",
      multipart: file.size > 50 * 1024 * 1024,
      onUploadProgress: (p) => onProgress?.(p.percentage),
    });
    return res.url;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(msg.replace(/^Vercel Blob: /, ""));
  }
}

/**
 * Grab a frame from a local video file as a JPEG, for the clip's preview image.
 * Returns null if this browser can't decode the video (e.g. iPhone HEVC in Chrome),
 * which also means the video won't play on the site in that browser.
 */
export async function posterFromVideo(file: File): Promise<Blob | null> {
  const url = URL.createObjectURL(file);
  const v = document.createElement("video");
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  v.src = url;
  const once = (ev: string) =>
    new Promise<boolean>((resolve) => {
      const done = (ok: boolean) => () => resolve(ok);
      v.addEventListener(ev, done(true), { once: true });
      v.addEventListener("error", done(false), { once: true });
      setTimeout(done(false), 15000);
    });
  try {
    if (!(await once("loadeddata")) || !v.videoWidth) return null;
    v.currentTime = Math.min(5, v.duration * 0.1 || 0);
    if (!(await once("seeked"))) return null;
    const w = Math.min(1280, v.videoWidth);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = Math.round((v.videoHeight * w) / v.videoWidth);
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    return await new Promise((resolve) => c.toBlob(resolve, "image/jpeg", 0.82));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const safeName = (name: string) =>
  name.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";
