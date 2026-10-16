const steps = [
  {
    number: "01",
    title: "Ask a business question",
    description:
      "Type what you want to know in plain English — for example, which category generated the most revenue.",
  },
  {
    number: "02",
    title: "Review the generated SQL",
    description:
      "The local model writes one DuckDB query. SQLGlot parses it and rejects anything that is not a single, read-only SELECT before it can run.",
  },
  {
    number: "03",
    title: "Execute and explore",
    description:
      "DuckDB runs the validated query against local data and returns a clean table with row counts and timing.",
  },
];

export function Steps() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-border/70"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Three steps, no black boxes.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            className="absolute top-[18px] right-8 left-8 hidden h-px bg-border sm:block"
            aria-hidden
          />
          <ol className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {steps.map((step) => (
              <li key={step.number} className="relative">
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs text-accent">
                  {step.number}
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
