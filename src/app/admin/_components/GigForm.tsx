"use client";

/** Add / edit a gig on /admin. `initial` pre-fills the form; with an id it saves changes instead. */
import Link from "next/link";
import { useActionState } from "react";
import { saveGig } from "../_actions/gigs";
import type { FormState } from "../_actions/shared";

type GigValues = { id?: string; date: string; time?: string; act: string; venue: string; city: string; url?: string };

export function GigForm({ initial, editing }: { initial: GigValues; editing: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveGig, {});
  return (
    <form action={action} className="admin-form" key={initial.id ?? "new"}>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="admin-row">
        <label>
          <span className="cap">Date</span>
          <input type="date" name="date" defaultValue={initial.date} required />
        </label>
        <label>
          <span className="cap">Time</span>
          <input name="time" defaultValue={initial.time} placeholder="8 PM" />
        </label>
      </div>
      <label>
        <span className="cap">Act / band</span>
        <input name="act" defaultValue={initial.act} placeholder="Funk & soul night" required />
      </label>
      <div className="admin-row">
        <label>
          <span className="cap">Venue</span>
          <input name="venue" defaultValue={initial.venue} required />
        </label>
        <label>
          <span className="cap">City</span>
          <input name="city" defaultValue={initial.city} placeholder="Los Angeles, CA" required />
        </label>
      </div>
      <label>
        <span className="cap">Link (optional)</span>
        <input type="url" name="url" defaultValue={initial.url} placeholder="https://…" />
      </label>
      {state.error && <p className="admin-error">{state.error}</p>}
      <div className="admin-actions">
        <button className="btn solid" disabled={pending}>
          {pending ? "Saving…" : editing ? "Save changes" : "Add gig"}
        </button>
        {editing && (
          <Link className="btn" href="/admin">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
