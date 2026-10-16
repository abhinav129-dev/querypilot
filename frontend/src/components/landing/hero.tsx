import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  FileCode2,
  MessageSquareText,
  Table2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { btnPrimary, btnSecondary } from "@/lib/styles";
import { ProductPreview } from "./product-preview";

const stack = ["DuckDB", "Ollama", "FastAPI", "SQLGlot", "Next.js"];

const workflow: { icon: LucideIcon; label: string }[] = [
  { icon: MessageSquareText, label: "Question" },
  { icon: FileCode2, label: "SQL" },
  { icon: Table2, label: "Results" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-[-120px] h-[560px] bg-[radial-gradient(ellipse_55%_60%_at_50%_20%,rgba(139,92,246,0.14),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-zinc-400">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Local-first · No API keys · Your data stays on your machine
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-balance text-zinc-50 sm:text-5xl lg:text-6xl">
            Ask questions. Get SQL. See the answer.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400">
            QueryPilot is an AI data analyst that runs entirely on your
            machine. It turns plain-English questions into validated SQL and
            executes them against a local DuckDB database.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/workspace" className={`${btnPrimary} px-5 py-2.5`}>
              Open the workspace
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a href="#how-it-works" className={`${btnSecondary} px-5 py-2.5`}>
              See how it works
            </a>
          </div>

          <div
            className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2"
            aria-label="Workflow: question to SQL to results"
          >
            {workflow.map((step, index) => (
              <div key={step.label} className="flex items-center gap-1.5 sm:gap-2">
                {index > 0 && (
                  <ChevronRight
                    className="size-4 shrink-0 text-zinc-600"
                    aria-hidden
                  />
                )}
                <span className="flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-2 sm:px-3.5">
                  <step.icon className="size-4 text-accent" aria-hidden />
                  <span className="font-mono text-xs text-zinc-300">
                    {step.label}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p className="mt-12 font-mono text-xs tracking-widest text-zinc-600 uppercase">
            {stack.join(" · ")}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
