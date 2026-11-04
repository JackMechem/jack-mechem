"use client";

import { useActionState, useState } from "react";
import { saveClip, type FormState } from "../actions";
import { posterFromVideo, safeName, uploadFile } from "../upload";

type Initial = { id?: string; src?: string; poster?: string; title: string; detail: string; alt: string; credit?: string; creditUrl?: string };

export function ClipForm({ initial }: { initial: Initial }) {
  const editing = !!initial.id;
  const [file, setFile] = useState<File | null>(null);
  // a file in public/ (e.g. /clips/toledo.mp4) or any video URL: no upload needed
  const [path, setPath] = useState(initial.src?.startsWith("/") ? initial.src : "");
  const [status, setStatus] = useState("");
  const [warning, setWarning] = useState("");

  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, form) => {
    try {
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
      } else if (path.trim()) {
        form.set("src", path.trim());
        if (path.trim() !== initial.src) form.set("poster", form.get("posterPath") ? String(form.get("posterPath")) : "");
      } else if (!editing) {
        return { error: "Add a video: type its path (e.g. /clips/my-gig.mp4) or upload a file." };
      }
      setStatus("Saving…");
      return await saveClip(prev, form);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload failed" };
    } finally {
      setStatus("");
    }
  }, {});

  return (
    <form action={action} className="adm-card" key={initial.id ?? "new"}>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="src" value={initial.src ?? ""} />
      <input type="hidden" name="poster" value={initial.poster ?? ""} />
      <div className="adm-row">
        <label>
          <span className="cap">Video path</span>
          <input value={path} onChange={(e) => (setPath(e.target.value), setFile(null))} placeholder="/clips/my-gig.mp4" />
          <small className="adm-hint">Put the MP4 in <code>public/clips/</code> and type its path. It plays here right away and on the live site after you push.</small>
        </label>
        <label>
          <span className="cap">Preview image path (optional)</span>
          <input name="posterPath" defaultValue={initial.poster?.startsWith("/") ? initial.poster : ""} placeholder="/clips/my-gig.jpg" />
          <small className="adm-hint">Leave empty to use a frame from the video.</small>
        </label>
      </div>
      <details className="adm-upload">
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
      <div className="adm-row">
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
      {warning && <p className="adm-err">{warning}</p>}
      {state.error && <p className="adm-err">{state.error}</p>}
      <div className="adm-actions">
        <button className="btn solid" disabled={pending}>
          {pending ? status || "Working…" : editing ? "Save changes" : "Add clip"}
        </button>
        {editing && (
          <a className="btn" href="/admin/clips">
            Cancel
          </a>
        )}
      </div>
    </form>
  );
}
