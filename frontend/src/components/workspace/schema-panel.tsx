"use client";

import { useEffect, useState } from "react";
import { fetchSchema, type SchemaTable } from "@/lib/api";

export function SchemaPanel() {
  const [tables, setTables] = useState<SchemaTable[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSchema()
      .then((data) => {
        if (!cancelled) setTables(data.tables);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
        Schema
      </p>
      {failed && (
        <p className="text-xs leading-relaxed text-zinc-500">
          Schema unavailable — the API server is not running.
        </p>
      )}
      {!failed && !tables && (
        <p className="text-xs text-zinc-600">Loading schema…</p>
      )}
      {tables?.map((table) => (
        <div
          key={table.name}
          className="rounded-lg border border-border bg-background"
        >
          <p className="border-b border-border px-3 py-2 font-mono text-[13px] font-medium text-zinc-200">
            {table.name}
          </p>
          <ul className="px-3 py-2">
            {table.columns.map((column) => (
              <li
                key={column.name}
                className="flex items-center justify-between py-1 font-mono text-xs"
              >
                <span className="text-zinc-300">{column.name}</span>
                <span className="text-zinc-600">{column.type}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
