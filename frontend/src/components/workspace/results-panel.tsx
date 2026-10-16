"use client";

import { useMemo, useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { getChartData, ResultChart } from "./result-chart";
import { ResultsTable } from "./results-table";

export function ResultsPanel({
  columns,
  rows,
}: {
  columns: string[];
  rows: unknown[][];
}) {
  const chartData = useMemo(() => getChartData(columns, rows), [columns, rows]);
  const [view, setView] = useState<"table" | "chart">("table");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Results
        </p>
        {chartData && (
          <div
            className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5"
            role="group"
            aria-label="Result view"
          >
            <button
              type="button"
              onClick={() => setView("table")}
              aria-pressed={view === "table"}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                view === "table"
                  ? "bg-elevated text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Table2 className="size-3.5" aria-hidden />
              Table
            </button>
            <button
              type="button"
              onClick={() => setView("chart")}
              aria-pressed={view === "chart"}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                view === "chart"
                  ? "bg-elevated text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <BarChart3 className="size-3.5" aria-hidden />
              Chart
            </button>
          </div>
        )}
      </div>

      {view === "chart" && chartData ? (
        <ResultChart data={chartData} />
      ) : (
        <ResultsTable columns={columns} rows={rows} framed={false} />
      )}
    </div>
  );
}
