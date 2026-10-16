import { Database, ShieldCheck, Table2 } from "lucide-react";

const rows = [
  { category: "Electronics", revenue: "22,000", width: "100%" },
  { category: "Books", revenue: "6,000", width: "27%" },
];

function HighlightedSql() {
  const kw = "text-violet-300";
  const fn = "text-sky-300";
  const num = "text-amber-300";
  const id = "text-zinc-300";

  return (
    <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
      <code>
        <span className={kw}>SELECT</span> <span className={id}>category, </span>
        <span className={fn}>SUM</span>
        <span className={id}>(revenue) </span>
        <span className={kw}>AS</span> <span className={id}>total_revenue</span>
        {"\n"}
        <span className={kw}>FROM</span> <span className={id}>orders</span>
        {"\n"}
        <span className={kw}>GROUP BY</span> <span className={id}>category</span>
        {"\n"}
        <span className={kw}>ORDER BY</span>{" "}
        <span className={id}>total_revenue </span>
        <span className={kw}>DESC</span>
        {"\n"}
        <span className={kw}>LIMIT</span> <span className={num}>100</span>
      </code>
    </pre>
  );
}

export function ProductPreview() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_0_100px_-24px_rgba(139,92,246,0.3)]"
      aria-label="Static preview of a QueryPilot analysis"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-zinc-700" aria-hidden />
        <span className="size-2.5 rounded-full bg-zinc-700" aria-hidden />
        <span className="size-2.5 rounded-full bg-zinc-700" aria-hidden />
        <span className="ml-3 text-xs text-zinc-500">
          querypilot · workspace
        </span>
        <span className="ml-auto rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-zinc-500">
          Preview
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3">
          <p className="text-sm text-zinc-200">
            Which category generated the most revenue?
          </p>
          <span className="shrink-0 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white">
            Analyze
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            <ShieldCheck className="size-3.5 text-emerald-400" aria-hidden />
            Validated
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            <Table2 className="size-3.5" aria-hidden />2 rows
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            <Database className="size-3.5" aria-hidden />
            DuckDB
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Generated SQL
            </p>
            <div className="h-full rounded-lg border border-border bg-background">
              <HighlightedSql />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Results
            </p>
            <table className="w-full overflow-hidden rounded-lg border border-border text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-2.5 text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    category
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    total_revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.category}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-zinc-200">
                      {row.category}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[13px] text-zinc-300">
                      {row.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 rounded-lg border border-border bg-background p-4">
              <p className="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
                Revenue by category
              </p>
              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row.category}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{row.category}</span>
                      <span className="font-mono text-zinc-500">
                        {row.revenue}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                      <div
                        className="h-full rounded-full bg-accent/80"
                        style={{ width: row.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
