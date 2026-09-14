import Link from "next/link";
import { ArrowRight, Bolt, Flag, ListChecks, Trophy } from "lucide-react";

const quizFeatures = [
  {
    title: "Structured Questions",
    description:
      "Standardized multiple-choice questions based on the thermodynamics curriculum.",
    icon: <ListChecks className="size-4" />,
  },
  {
    title: "Instant Feedback",
    description:
      "Review your answers and understand the underlying engineering concepts.",
    icon: <Bolt className="size-4" />,
  },
  {
    title: "Final Score",
    description:
      "Receive a final score together with a concise evaluation of your performance.",
    icon: <Trophy className="size-4" />,
  },
];

export function QuizCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0d121d] text-white">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(#1e293b 0.75px, transparent 0.75px), radial-gradient(#1e293b 0.75px, #0d121d 0.75px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div
          className="relative overflow-hidden border-2 border-slate-700 bg-gradient-to-b from-slate-900/95 to-[color:var(--color-brand-charcoal)]/95 p-6 text-center shadow-2xl sm:p-10 lg:p-14"
          style={{
            clipPath: "var(--clip-chamfer-lg)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-amber-500" />

          <div
            className="inline-flex items-center gap-2 border border-[color:var(--color-brand-red)]/40 bg-red-950/70 px-4 py-1.5 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-red-300"
            style={{
              clipPath: "var(--clip-chamfer-sm)",
            }}
          >
            <Flag className="size-3.5 text-[color:var(--color-brand-red)]" />
            Knowledge Evaluation
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl font-[var(--font-oswald)] text-3xl font-bold uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Test Your{" "}
            <span className="text-[color:var(--color-brand-red)]">
              Thermodynamics
            </span>{" "}
            Knowledge
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Challenge your understanding of energy, work, heat transfer,
            boundary work, and the First Law through a structured engineering
            evaluation.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {quizFeatures.map((feature) => (
              <div
                key={feature.title}
                className="border border-slate-700/80 bg-slate-800/60 p-4"
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                }}
              >
                <div
                  className="mb-3 flex size-8 items-center justify-center bg-red-900/50 text-[color:var(--color-brand-red)]"
                  style={{
                    clipPath: "var(--clip-chamfer-sm)",
                  }}
                >
                  {feature.icon}
                </div>

                <h3 className="font-[var(--font-chakra-petch)] text-xs font-bold uppercase text-white">
                  {feature.title}
                </h3>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[color:var(--color-brand-red)] to-[color:var(--color-brand-crimson)] px-8 py-4 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all hover:brightness-110 active:scale-[0.99]"
              style={{
                clipPath: "var(--clip-chamfer-md)",
              }}
            >
              Start Quiz for Evaluation
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}