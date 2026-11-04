"use client";

import { useActionState, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveProject, type FormState } from "../../actions";
import { safeName, uploadFile } from "../../upload";

type Initial = {
  id?: string;
  crate?: string;
  slug: string;
  name: string;
  cat: string;
  years: string;
  kind: string;
  stack: string[];
  summary: string;
  image?: string;
  imageNote?: string;
  gallery?: { src: string; caption?: string }[];
  sideA: string[];
  sideB: string[];
  links: { label: string; href: string }[];
  body: string;
  published: boolean;
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ProjectForm({ initial, crates }: { initial: Initial; crates: { id: string; name: string }[] }) {
  const editing = !!initial.id;
  const [state, action, pending] = useActionState<FormState, FormData>(saveProject, {});
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [image, setImage] = useState(initial.image ?? "");
  const [uploading, setUploading] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [body, setBody] = useState(initial.body);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const onImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadError("");
    try {
      const url = await uploadFile(file, `projects/${safeName(slug || file.name)}.${file.name.split(".").pop() ?? "png"}`, (p) =>
        setUploading(`Uploading… ${Math.round(p)}%`),
      );
      setImage(url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading("");
    }
  };

  return (
    <form action={action} className="adm-card adm-wide">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="previousImage" value={initial.image ?? ""} />
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="body" value={body} />

      <div className="adm-row">
        <label>
          <span className="cap">Name</span>
          <input
            name="name"
            defaultValue={initial.name}
            required
            onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
          />
        </label>
        <label>
          <span className="cap">URL slug</span>
          <input name="slug" value={slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={(e) => (setSlug(e.target.value), setSlugTouched(true))} />
          <small className="adm-hint">jackmechem.dev/work/{slug || "…"}</small>
        </label>
      </div>
      <label>
        <span className="cap">Crate</span>
        <select name="crate" defaultValue={initial.crate ?? ""}>
          {crates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="">No crate (shown as “Other”)</option>
        </select>
      </label>
      <div className="adm-row">
        <label>
          <span className="cap">Catalogue no.</span>
          <input name="cat" defaultValue={initial.cat} required />
        </label>
        <label>
          <span className="cap">Years</span>
          <input name="years" defaultValue={initial.years} placeholder="2026 –" required />
        </label>
      </div>
      <label>
        <span className="cap">Kind (one line)</span>
        <input name="kind" defaultValue={initial.kind} placeholder="Digital audio workstation" required />
      </label>
      <label>
        <span className="cap">Stack (comma separated)</span>
        <input name="stack" defaultValue={initial.stack.join(", ")} placeholder="Rust, Tauri 2, React" />
      </label>
      <label>
        <span className="cap">Summary (crate + record preview)</span>
        <textarea name="summary" defaultValue={initial.summary} rows={3} required />
      </label>

      <fieldset className="adm-field">
        <legend className="cap">Screenshot</legend>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="adm-shot" />
        ) : (
          <p className="adm-hint">No screenshot. The cover shows the project name instead.</p>
        )}
        <div className="adm-actions">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => onImage(e.target.files?.[0])} disabled={!!uploading} />
          {image && (
            <button type="button" className="btn" onClick={() => setImage("")}>
              Remove
            </button>
          )}
        </div>
        {uploading && <p className="adm-hint">{uploading}</p>}
        {uploadError && <p className="adm-err">{uploadError}</p>}
        <label>
          <span className="cap">Caption</span>
          <input name="imageNote" defaultValue={initial.imageNote} />
        </label>
      </fieldset>

      <label>
        <span className="cap">More screenshots for the case study (path | caption, one per line)</span>
        <textarea name="gallery" defaultValue={(initial.gallery ?? []).map((g) => (g.caption ? `${g.src} | ${g.caption}` : g.src)).join("\n")} rows={3} placeholder="/projects/my-project-2.png | Admin dashboard" />
        <small className="adm-hint">Put images in <code>public/projects/</code> and type their paths.</small>
      </label>
      <div className="adm-row">
        <label>
          <span className="cap">Side A (one per line)</span>
          <textarea name="sideA" defaultValue={initial.sideA.join("\n")} rows={6} />
        </label>
        <label>
          <span className="cap">Side B (one per line)</span>
          <textarea name="sideB" defaultValue={initial.sideB.join("\n")} rows={6} />
        </label>
      </div>
      <label>
        <span className="cap">Links (Label | URL, one per line)</span>
        <textarea name="links" defaultValue={initial.links.map((l) => `${l.label} | ${l.href}`).join("\n")} rows={3} placeholder="GitHub | https://github.com/JackMechem/…" />
      </label>

      <div className="adm-field">
        <div className="adm-top">
          <span className="cap">Write-up (Markdown)</span>
          <div className="adm-tabs small">
            <button type="button" aria-current={tab === "write" ? "page" : undefined} onClick={() => setTab("write")}>
              Write
            </button>
            <button type="button" aria-current={tab === "preview" ? "page" : undefined} onClick={() => setTab("preview")}>
              Preview
            </button>
          </div>
        </div>
        {tab === "write" ? (
          <textarea className="adm-body" value={body} onChange={(e) => setBody(e.target.value)} rows={24} spellCheck />
        ) : (
          <div className="prose adm-preview">
            <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
          </div>
        )}
      </div>

      <label className="adm-check">
        <input type="checkbox" name="published" defaultChecked={initial.published} />
        <span>Published (unchecked = draft, hidden from the site)</span>
      </label>

      {state.error && <p className="adm-err">{state.error}</p>}
      <div className="adm-actions">
        <button className="btn solid" disabled={pending || !!uploading}>
          {pending ? "Saving…" : editing ? "Save changes" : "Create project"}
        </button>
        <a className="btn" href="/admin/projects">
          Cancel
        </a>
      </div>
    </form>
  );
}
