"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="mail"
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
