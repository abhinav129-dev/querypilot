"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Database, DatabaseZap, Loader2, X } from "lucide-react";
import { askQuestion, type QueryResult } from "@/lib/api";
import { card } from "@/lib/styles";
import { Composer } from "./composer";
import { SchemaPanel } from "./schema-panel";
import { SqlBlock } from "./sql-block";
import { ResultsPanel } from "./results-panel";
import { StatusBar } from "./status-bar";
import { EmptyState } from "./empty-state";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; result: QueryResult }
  | { kind: "error"; message: string };

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-zinc-50"
    >
      <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-background">
        <DatabaseZap className="size-4 text-accent" aria-hidden />
      </span>
      QueryPilot
    </Link>
  );
}

export function WorkspaceApp() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [schemaOpen, setSchemaOpen] = useState(false);

  async function run(override?: string) {
    const q = (override ?? question).trim();
    if (!q || status.kind === "loading") return;
    if (override) setQuestion(override);

    setStatus({ kind: "loading" });
    try {
      const result = await askQuestion(q);
      setStatus({ kind: "success", result });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-surface/50 lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <SchemaPanel />
        </div>
        <div className="border-t border-border p-5">
          <p className="text-xs leading-relaxed text-zinc-600">
            Local stack — DuckDB, Ollama, and FastAPI running on this machine.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => setSchemaOpen((open) => !open)}
            aria-expanded={schemaOpen}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors duration-150 hover:bg-elevated"
          >
            {schemaOpen ? (
              <X className="size-3.5" aria-hidden />
            ) : (
              <Database className="size-3.5" aria-hidden />
            )}
            Schema
          </button>
        </header>

        {schemaOpen && (
          <div className="border-b border-border bg-surface/50 p-4 lg:hidden">
            <SchemaPanel />
          </div>
        )}

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Ask a business question
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              QueryPilot generates SQL, validates it, and runs it against your
              local DuckDB database.
            </p>
          </div>

          <Composer
            question={question}
            loading={status.kind === "loading"}
            onChange={setQuestion}
            onSubmit={() => run()}
          />

          <div className="mt-8 space-y-4" aria-live="polite">
            {status.kind === "idle" && (
              <EmptyState onSelect={(q) => run(q)} />
            )}

            {status.kind === "loading" && (
              <div
                className={`${card} flex items-center gap-3 p-5 text-sm text-zinc-400`}
              >
                <Loader2
                  className="size-4 shrink-0 animate-spin text-accent"
                  aria-hidden
                />
                Generating SQL with Ollama — the first run can take a moment
                while the model loads.
              </div>
            )}

            {status.kind === "error" && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-5"
              >
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0 text-rose-400"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-medium text-rose-200">
                    Analysis failed
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-rose-200/70">
                    {status.message}
                  </p>
                </div>
              </div>
            )}

            {status.kind === "success" && (
              <>
                <StatusBar result={status.result} />
                <SqlBlock sql={status.result.sql} />
                {status.result.rows.length > 0 ? (
                  <ResultsPanel
                    columns={status.result.columns}
                    rows={status.result.rows}
                  />
                ) : (
                  <div className={`${card} p-5 text-sm text-zinc-400`}>
                    The query ran successfully but returned no rows.
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
