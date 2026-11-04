"use client";

/**
 * The project editor (/admin/projects/<id> and /new). Card fields, crate,
 * screenshot (upload needs Vercel Blob; or edit the path), gallery, Side A /
 * Side B, links, and the Markdown write-up with a live preview.
 * List fields are one item per line; links and gallery use "a | b".
 */
import Link from "next/link";
import { useActionState, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveProject } from "../_actions/projects";
import type { FormState } from "../_actions/shared";
import { safeName, uploadFile } from "../_lib/upload";

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
    <form action={action} className="admin-form admin-wide">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="previousImage" value={initial.image ?? ""} />
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="body" value={body} />

      <div className="admin-row">
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
          <small className="admin-hint">jackmechem.dev/work/{slug || "…"}</small>
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
      <div className="admin-row">
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

      <fieldset className="admin-fieldset">
        <legend className="cap">Screenshot</legend>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="admin-shot" />
        ) : (
          <p className="admin-hint">No screenshot. The cover shows the project name instead.</p>
        )}
        <div className="admin-actions">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => onImage(e.target.files?.[0])} disabled={!!uploading} />
          {image && (
            <button type="button" className="btn" onClick={() => setImage("")}>
              Remove
            </button>
          )}
        </div>
        {uploading && <p className="admin-hint">{uploading}</p>}
        {uploadError && <p className="admin-error">{uploadError}</p>}
        <label>
          <span className="cap">Caption</span>
          <input name="imageNote" defaultValue={initial.imageNote} />
        </label>
      </fieldset>

      <label>
        <span className="cap">More screenshots for the case study (path | caption, one per line)</span>
        <textarea name="gallery" defaultValue={(initial.gallery ?? []).map((g) => (g.caption ? `${g.src} | ${g.caption}` : g.src)).join("\n")} rows={3} placeholder="/projects/my-project-2.png | Admin dashboard" />
        <small className="admin-hint">Put images in <code>public/projects/</code> and type their paths.</small>
      </label>
      <div className="admin-row">
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

      <div className="admin-fieldset">
        <div className="admin-top">
          <span className="cap">Write-up (Markdown)</span>
          <div className="admin-tabs small">
            <button type="button" aria-current={tab === "write" ? "page" : undefined} onClick={() => setTab("write")}>
              Write
            </button>
            <button type="button" aria-current={tab === "preview" ? "page" : undefined} onClick={() => setTab("preview")}>
              Preview
            </button>
          </div>
        </div>
        {tab === "write" ? (
          <textarea className="admin-markdown" value={body} onChange={(e) => setBody(e.target.value)} rows={24} spellCheck />
        ) : (
          <div className="prose admin-preview">
            <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
          </div>
        )}
      </div>

      <label className="admin-check">
        <input type="checkbox" name="published" defaultChecked={initial.published} />
        <span>Published (unchecked = draft, hidden from the site)</span>
      </label>

      {state.error && <p className="admin-error">{state.error}</p>}
      <div className="admin-actions">
        <button className="btn solid" disabled={pending || !!uploading}>
          {pending ? "Saving…" : editing ? "Save changes" : "Create project"}
        </button>
        <Link className="btn" href="/admin/projects">
          Cancel
        </Link>
      </div>
    </form>
  );
}
