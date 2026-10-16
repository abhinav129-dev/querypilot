"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { btnPrimary } from "@/lib/styles";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-zinc-300 transition-colors duration-150 hover:bg-elevated"
      >
        {open ? (
          <X className="size-4" aria-hidden />
        ) : (
          <Menu className="size-4" aria-hidden />
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background px-6 pt-2 pb-6">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm text-zinc-300 transition-colors duration-150 last:border-0 hover:text-zinc-50"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/workspace"
              onClick={() => setOpen(false)}
              className={`${btnPrimary} mt-4`}
            >
              Open workspace
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
