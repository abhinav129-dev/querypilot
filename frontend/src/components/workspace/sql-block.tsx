"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatSql, tokenizeSql, type SqlTokenType } from "@/lib/sql";

const TOKEN_COLORS: Record<SqlTokenType, string | undefined> = {
  keyword: "text-violet-300",
  function: "text-sky-300",
  number: "text-amber-300",
  string: "text-emerald-300",
  identifier: undefined,
  punctuation: "text-zinc-500",
  space: undefined,
};

export function SqlBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => formatSql(sql), [sql]);
  const tokens = useMemo(() => tokenizeSql(formatted), [formatted]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Generated SQL
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors duration-150 hover:bg-elevated hover:text-zinc-100"
          aria-label="Copy SQL to clipboard"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
        <code>
          {tokens.map((token, index) => {
            const color = TOKEN_COLORS[token.type];
            return color ? (
              <span key={index} className={color}>
                {token.text}
              </span>
            ) : (
              token.text
            );
          })}
        </code>
      </pre>
    </div>
  );
}
