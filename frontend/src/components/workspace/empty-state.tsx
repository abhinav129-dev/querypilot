import { Sparkles } from "lucide-react";
import { card } from "@/lib/styles";

const examples = [
  "Which category generated the most revenue?",
  "What is the total revenue by region?",
  "How many orders were placed each month?",
];

export function EmptyState({
  onSelect,
}: {
  onSelect: (question: string) => void;
}) {
  return (
    <div className={`${card} border-dashed p-8 text-center`}>
      <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg border border-border bg-background">
        <Sparkles className="size-5 text-accent" aria-hidden />
      </span>
      <h2 className="text-sm font-semibold text-zinc-200">
        Ask your first question
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-zinc-500">
        Or start from one of these examples — the sample dataset contains
        orders with category, product, region, quantity, and revenue.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onSelect(example)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-zinc-400 transition-colors duration-150 hover:border-border-strong hover:text-zinc-100"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
