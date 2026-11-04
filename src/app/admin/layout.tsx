/**
 * Layout for /admin: shows the sign-in form until you're signed in, then the
 * tabs (Gigs / Clips / Projects), "View site" and "Sign out".
 * Each admin page also checks isAdmin() itself, since layouts don't guard
 * the pages rendered inside them.
 */
import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { logout } from "./_actions/session";
import { AdminTabs } from "./_components/AdminTabs";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin()))
    return (
      <div className="admin">
        <h1>Admin</h1>
        <LoginForm />
      </div>
    );

  return (
    <div className="admin">
      <div className="admin-top">
        <AdminTabs />
        <div className="admin-actions">
          <a className="btn" href="/" target="_blank">
            View site ↗
          </a>
          <form action={logout}>
            <button className="btn">Sign out</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
