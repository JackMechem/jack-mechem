"use client";

/** The /admin sign-in form (single password). */
import { useActionState } from "react";
import { login } from "../_actions/session";
import type { FormState } from "../_actions/shared";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="admin-form">
      <label>
        <span className="cap">Password</span>
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      {state.error && <p className="admin-error">{state.error}</p>}
      <button className="btn solid" disabled={pending}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
