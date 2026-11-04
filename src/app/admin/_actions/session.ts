"use server";

/** Sign in / sign out for /admin. See lib/auth.ts for how the session works. */
import { redirect } from "next/navigation";
import { checkPassword, endSession, startSession } from "@/lib/auth";
import type { FormState } from "./shared";

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!checkPassword(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down password guessing
    return { error: "Wrong password." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}
