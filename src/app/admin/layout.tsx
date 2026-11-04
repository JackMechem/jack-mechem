import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin";
import { logout } from "./actions";
import { LoginForm } from "./forms";
import { AdminTabs } from "./tabs";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin()))
    return (
      <div className="adm">
        <h1>Admin</h1>
        <LoginForm />
      </div>
    );

  return (
    <div className="adm">
      <div className="adm-top">
        <AdminTabs />
        <div className="adm-actions">
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
