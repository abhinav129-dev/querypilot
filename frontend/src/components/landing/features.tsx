import { Lock, MessageSquareText, ShieldCheck, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { card } from "@/lib/styles";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  span?: boolean;
}

const features: Feature[] = [
  {
    icon: MessageSquareText,
    title: "Natural language in, SQL out",
    description:
      "Type a business question in plain English. A locally hosted Qwen model generates a single, readable DuckDB query you can inspect before trusting.",
    span: true,
  },
  {
    icon: Lock,
    title: "Fully local and private",
    description:
      "Ollama runs the model and DuckDB stores the data. Nothing leaves your machine — no accounts, no cloud, no usage meters.",
  },
  {
    icon: ShieldCheck,
    title: "Validated before it runs",
    description:
      "Every generated statement is parsed with SQLGlot: one SELECT only, explicit columns, the orders table only, and an enforced row limit.",
  },
  {
    icon: Table2,
    title: "Results built for reading",
    description:
      "Clean tables, monospace numbers, and clear status — row counts, elapsed time, and the model that produced the query.",
    span: true,
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">
            An analyst workspace, not a chatbot demo
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Every part of the pipeline is visible: the question, the generated
            SQL, the validation, and the rows that come back.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`${card} p-6 transition-colors duration-150 hover:border-border-strong hover:bg-elevated/40 ${
                feature.span ? "lg:col-span-2" : ""
              }`}
            >
              <span className="mb-5 flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                <feature.icon className="size-5 text-accent" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-zinc-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
