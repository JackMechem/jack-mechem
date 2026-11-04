"use client";

/**
 * Add / edit an Archive clip. The usual way is a path to a video in
 * public/clips/ (no upload needed); uploading a file instead needs Vercel
 * Blob (BLOB_READ_WRITE_TOKEN). On upload a preview image is grabbed from
 * the video automatically.
 */
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveClip } from "../_actions/clips";
import type { FormState } from "../_actions/shared";
import { posterFromVideo, safeName, uploadFile } from "../_lib/upload";

type Initial = { id?: string; src?: string; poster?: string; title: string; detail: string; alt: string; credit?: string; creditUrl?: string };

export function ClipForm({ initial }: { initial: Initial }) {
  const editing = !!initial.id;
  const [file, setFile] = useState<File | null>(null);
  // a file in public/ (e.g. /clips/toledo.mp4) or any video URL: no upload needed
  const [path, setPath] = useState(initial.src?.startsWith("/") ? initial.src : "");
  const [status, setStatus] = useState("");
  const [warning, setWarning] = useState("");

  /** Fill in src / poster on the form (uploading first if a file was picked). Returns an error message or null. */
  async function prepare(form: FormData): Promise<string | null> {
    if (file) {
      const base = `clips/${safeName(file.name)}`;
      setStatus("Making a preview image…");
      const poster = await posterFromVideo(file);
      if (!poster) setWarning("This browser can't play the video, so some visitors may not be able to either. MP4 (H.264) plays everywhere.");
      const src = await uploadFile(file, `${base}.${file.name.split(".").pop() ?? "mp4"}`, (p) => setStatus(`Uploading video… ${Math.round(p)}%`));
      form.set("src", src);
      if (poster) {
        setStatus("Uploading preview…");
        form.set("poster", await uploadFile(poster, `${base}-poster.jpg`));
      }
      return null;
    }
    if (path.trim()) {
      form.set("src", path.trim());
      const posterPath = String(form.get("posterPath") ?? "").trim();
      if (posterPath) form.set("poster", posterPath);
      else if (path.trim() !== initial.src) form.set("poster", ""); // new video: drop the old preview
      return null;
    }
    return editing ? null : "Add a video: type its path (e.g. /clips/my-gig.mp4) or upload a file.";
  }

  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, form) => {
    try {
      const problem = await prepare(form);
      if (problem) return { error: problem };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload failed" };
    } finally {
      setStatus("");
    }
    // outside the try: on success saveClip redirects, which works by throwing
    setStatus("Saving…");
    return saveClip(prev, form);
  }, {});

  return (
    <form action={action} className="admin-form" key={initial.id ?? "new"}>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="src" value={initial.src ?? ""} />
      <input type="hidden" name="poster" value={initial.poster ?? ""} />
      <div className="admin-row">
        <label>
          <span className="cap">Video path</span>
          <input value={path} onChange={(e) => (setPath(e.target.value), setFile(null))} placeholder="/clips/my-gig.mp4" />
          <small className="admin-hint">Put the MP4 in <code>public/clips/</code> and type its path. It plays here right away and on the live site after you push.</small>
        </label>
        <label>
          <span className="cap">Preview image path (optional)</span>
          <input name="posterPath" defaultValue={initial.poster?.startsWith("/") ? initial.poster : ""} placeholder="/clips/my-gig.jpg" />
          <small className="admin-hint">Leave empty to use a frame from the video.</small>
        </label>
      </div>
      <details className="admin-upload">
        <summary className="cap">…or upload a file (needs Vercel Blob)</summary>
        <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => (setFile(e.target.files?.[0] ?? null), setPath(""), setWarning(""))} />
      </details>
      <label>
        <span className="cap">Title</span>
        <input name="title" defaultValue={initial.title} placeholder="Funk & soul set" required />
      </label>
      <label>
        <span className="cap">Detail</span>
        <input name="detail" defaultValue={initial.detail} placeholder="Live in Los Angeles" />
      </label>
      <div className="admin-row">
        <label>
          <span className="cap">Filmed by (optional)</span>
          <input name="credit" defaultValue={initial.credit} placeholder="@jizzrael" />
        </label>
        <label>
          <span className="cap">Their link</span>
          <input type="url" name="creditUrl" defaultValue={initial.creditUrl} placeholder="https://instagram.com/…" />
        </label>
      </div>
      <label>
        <span className="cap">Description (for screen readers)</span>
        <input name="alt" defaultValue={initial.alt} placeholder="Jack playing drums with a funk band" />
      </label>
      {warning && <p className="admin-error">{warning}</p>}
      {state.error && <p className="admin-error">{state.error}</p>}
      <div className="admin-actions">
        <button className="btn solid" disabled={pending}>
          {pending ? status || "Working…" : editing ? "Save changes" : "Add clip"}
        </button>
        {editing && (
          <Link className="btn" href="/admin/clips">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
