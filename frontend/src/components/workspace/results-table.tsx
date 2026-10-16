function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString("en-US");
  return String(value);
}

function isNumericColumn(rows: unknown[][], index: number): boolean {
  return rows.some((row) => typeof row[index] === "number");
}

export function ResultsTable({
  columns,
  rows,
  framed = true,
}: {
  columns: string[];
  rows: unknown[][];
  framed?: boolean;
}) {
  return (
    <div
      className={`overflow-x-auto ${
        framed ? "rounded-xl border border-border bg-surface" : ""
      }`}
    >
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`px-4 py-3 text-xs font-medium tracking-wide whitespace-nowrap text-zinc-500 uppercase ${
                  isNumericColumn(rows, index) ? "text-right" : ""
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/60 transition-colors duration-100 last:border-0 hover:bg-elevated/50"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-2.5 whitespace-nowrap text-zinc-200 ${
                    typeof cell === "number"
                      ? "text-right font-mono text-[13px]"
                      : ""
                  }`}
                >
                  {formatCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
