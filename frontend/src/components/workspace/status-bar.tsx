import { Clock, Cpu, ShieldCheck, Table2 } from "lucide-react";
import type { QueryResult } from "@/lib/api";
import { badge } from "@/lib/styles";

export function StatusBar({ result }: { result: QueryResult }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Query status"
    >
      <span className={badge}>
        <ShieldCheck className="size-3.5 text-emerald-400" aria-hidden />
        Validated
      </span>
      <span className={badge}>
        <Table2 className="size-3.5" aria-hidden />
        {result.row_count} {result.row_count === 1 ? "row" : "rows"}
      </span>
      <span className={badge}>
        <Clock className="size-3.5" aria-hidden />
        {result.elapsed_ms.toLocaleString("en-US")} ms
      </span>
      <span className={badge}>
        <Cpu className="size-3.5" aria-hidden />
        {result.model}
      </span>
    </div>
  );
}
