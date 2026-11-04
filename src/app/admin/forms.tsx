"use client";

import { useActionState } from "react";
import { login, saveGig, type FormState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="adm-card">
      <label>
        <span className="cap">Password</span>
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      {state.error && <p className="adm-err">{state.error}</p>}
      <button className="btn solid" disabled={pending}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

type GigValues = { id?: string; date: string; time?: string; act: string; venue: string; city: string; url?: string };

export function GigForm({ initial, editing }: { initial: GigValues; editing: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveGig, {});
  return (
    <form action={action} className="adm-card" key={initial.id ?? "new"}>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="adm-row">
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
      <div className="adm-row">
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
      {state.error && <p className="adm-err">{state.error}</p>}
      <div className="adm-actions">
        <button className="btn solid" disabled={pending}>
          {pending ? "Saving…" : editing ? "Save changes" : "Add gig"}
        </button>
        {editing && (
          <a className="btn" href="/admin">
            Cancel
          </a>
        )}
      </div>
    </form>
  );
}
