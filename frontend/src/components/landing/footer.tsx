import Link from "next/link";
import { ArrowRight, DatabaseZap } from "lucide-react";
import { btnPrimary } from "@/lib/styles";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Ready to query your data?
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Start the local stack and ask your first question.
            </p>
          </div>
          <Link href="/workspace" className={`${btnPrimary} px-5 py-2.5`}>
            Open the workspace
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <DatabaseZap className="size-4 text-accent" aria-hidden />
            QueryPilot
          </p>
          <p className="text-xs text-zinc-600">
            Local-first analytics · Built with Next.js, FastAPI, DuckDB, and
            Ollama
          </p>
        </div>
      </div>
    </footer>
  );
}
