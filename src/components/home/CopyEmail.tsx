"use client";

/** The big email address in Contact: click to copy it (shows "Copied ✓" briefly). */
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="contact-email"
      title="Click to copy"
      onClick={() =>
        navigator.clipboard?.writeText(email).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        })
      }
    >
      {copied ? "Copied ✓" : email}
    </button>
  );
}
