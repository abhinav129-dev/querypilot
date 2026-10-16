import Link from "next/link";
import { DatabaseZap } from "lucide-react";
import { btnPrimary } from "@/lib/styles";
import { MobileMenu } from "./mobile-menu";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <nav
        className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-zinc-50"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface">
            <DatabaseZap className="size-4 text-accent" aria-hidden />
          </span>
          QueryPilot
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link href="/workspace" className={`${btnPrimary} hidden md:inline-flex`}>
          Open workspace
        </Link>

        <MobileMenu />
      </nav>
    </header>
  );
}
