"use client";

import { Loader2, Play } from "lucide-react";
import { btnPrimary, card } from "@/lib/styles";

interface ComposerProps {
  question: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function Composer({
  question,
  loading,
  onChange,
  onSubmit,
}: ComposerProps) {
  return (
    <div className={`${card} p-4`}>
      <label htmlFor="question" className="sr-only">
        Ask a business question
      </label>
      <textarea
        id="question"
        value={question}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        rows={3}
        placeholder="Which category generated the most revenue?"
        className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-zinc-600">
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">
            Enter
          </kbd>{" "}
          to run
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className={btnPrimary}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Analyzing…
            </>
          ) : (
            <>
              <Play className="size-4" aria-hidden />
              Analyze
            </>
          )}
        </button>
      </div>
    </div>
  );
}
