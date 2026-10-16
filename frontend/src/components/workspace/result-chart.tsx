export interface ChartDatum {
  label: string;
  value: number;
}

export function getChartData(
  columns: string[],
  rows: unknown[][],
): ChartDatum[] | null {
  if (columns.length < 2 || rows.length === 0 || rows.length > 15) {
    return null;
  }

  const mostly = (index: number, test: (value: unknown) => boolean) =>
    rows.filter((row) => test(row[index])).length >= rows.length / 2;

  const valueIndex = columns.findIndex((_, index) =>
    mostly(index, (value) => typeof value === "number"),
  );
  if (valueIndex === -1) return null;

  const labelIndex = columns.findIndex(
    (_, index) =>
      index !== valueIndex &&
      mostly(index, (value) => typeof value === "string"),
  );
  if (labelIndex === -1) return null;

  return rows.map((row) => ({
    label: String(row[labelIndex]),
    value: Number(row[valueIndex]),
  }));
}

function formatValue(value: number): string {
  return value.toLocaleString("en-US");
}

export function ResultChart({ data }: { data: ChartDatum[] }) {
  const max = Math.max(...data.map((datum) => Math.abs(datum.value)), 1);

  return (
    <div className="space-y-3 p-4">
      {data.map((datum, index) => (
        <div key={`${datum.label}-${index}`}>
          <div className="mb-1 flex items-center justify-between gap-4 text-xs">
            <span className="truncate text-zinc-400">{datum.label}</span>
            <span className="shrink-0 font-mono text-zinc-500">
              {formatValue(datum.value)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-accent/80"
              style={{ width: `${Math.max((Math.abs(datum.value) / max) * 100, 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
