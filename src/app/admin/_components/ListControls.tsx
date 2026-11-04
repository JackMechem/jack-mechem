/**
 * Small buttons used in the admin lists. They're plain <form>s that call a
 * server action, so they work without client-side JavaScript.
 */

type Action = (form: FormData) => Promise<void>;

/** ↑ / ↓ reorder buttons. The action receives `id` and `dir` ("up" | "down"). */
export function MoveButtons({ action, id, index, count, label }: { action: Action; id: string; index: number; count: number; label: string }) {
  return (
    <>
      {(["up", "down"] as const).map((dir) => (
        <form key={dir} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="dir" value={dir} />
          <button className="btn admin-move" disabled={dir === "up" ? index === 0 : index === count - 1} aria-label={`Move ${label} ${dir}`}>
            {dir === "up" ? "↑" : "↓"}
          </button>
        </form>
      ))}
    </>
  );
}

/**
 * "Delete" that asks first: clicking opens a small "Yes, delete" pop-over.
 * `fields` are extra hidden inputs sent with the id (e.g. the image to remove).
 */
export function ConfirmDelete({ action, id, label = "Yes, delete", fields = {} }: { action: Action; id: string; label?: string; fields?: Record<string, string> }) {
  return (
    <details className="admin-confirm">
      <summary className="btn">Delete</summary>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <button className="btn solid">{label}</button>
      </form>
    </details>
  );
}

/** "Saved" and error banners shown at the top of an admin page. */
export function Notices({ saved, error }: { saved?: boolean; error?: string }) {
  return (
    <>
      {saved && <p className="cap admin-ok">Saved. The site is updated.</p>}
      {error && <p className="admin-error">{error}</p>}
    </>
  );
}
