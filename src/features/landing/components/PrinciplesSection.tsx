import { Check } from "lucide-react";

const principles = [
  {
    title: "Macroscopic Classical Approach",
    description:
      "Analyze measurable system properties such as temperature, pressure, and volume without tracking individual molecular motion.",
  },
  {
    title: "First Law & Boundary Work",
    description:
      "Understand energy conservation in closed systems through heat transfer, work, and piston-driven boundary interaction.",
  },
  {
    title: "Cycles & Hybrid Conservation",
    description:
      "Connect thermodynamic cycles with regenerative braking and the conversion of kinetic energy into stored battery energy.",
  },
];

export function PrinciplesSection() {
  return (
    <section
      id="principles"
      className="border-b border-slate-200 bg-[color:var(--color-brand-bg)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div
              className="mb-6 inline-flex items-center gap-2 bg-slate-200/90 px-3.5 py-1.5 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-slate-800"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <span className="text-[color:var(--color-brand-red)]">◈</span>
              Automotive Science Foundation
            </div>

            <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase leading-tight tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-5xl">
              Thermodynamics Principles for{" "}
              <span className="text-[color:var(--color-brand-red)]">
                Engines & Powertrains
              </span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-[color:var(--color-brand-muted)]">
              Thermodynamics explains how heat, work, and energy interact
              inside engineering systems. In automotive applications, the
              same principles describe engine operation, energy conversion,
              thermal efficiency, and regenerative vehicle systems.
            </p>

            <div className="mt-8 space-y-3.5">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="flex items-start gap-4 border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-[color:var(--color-brand-red)]/40"
                  style={{
                    clipPath: "var(--clip-chamfer-lg)",
                  }}
                >
                  <div
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center bg-red-100 text-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    <Check className="size-4" />
                  </div>

                  <div>
                    <h3 className="font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wide text-[color:var(--color-brand-charcoal)] sm:text-sm">
                      {principle.title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative overflow-hidden border-2 border-slate-200 bg-[color:var(--color-brand-surface)] shadow-[var(--shadow-card)]"
              style={{
                clipPath: "var(--clip-chamfer-lg)",
              }}
            >
              <div className="aspect-[4/3] bg-[color:var(--color-brand-charcoal)]">
                <div className="relative h-full overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(220,38,38,0.2),transparent_38%)]" />

                  <div className="absolute inset-0 opacity-15">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(148,163,184,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.2) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                  </div>

                  <div className="absolute left-[15%] top-[18%] h-[52%] w-[70%] border-2 border-slate-500/50">
                    <div className="absolute left-[8%] top-[8%] h-[84%] w-[22%] border border-red-400/50" />
                    <div className="absolute right-[8%] top-[8%] h-[84%] w-[22%] border border-red-400/50" />
                    <div className="absolute left-[35%] top-[15%] h-[70%] w-[30%] border border-cyan-400/40" />
                    <div className="absolute left-1/2 top-[-20%] h-1/2 w-0.5 -translate-x-1/2 bg-[color:var(--color-brand-red)]" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="font-[var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-[color:var(--color-brand-red)]">
                      SYSTEM / BOUNDARY / ENERGY
                    </div>

                    <div className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white sm:text-4xl">
                      Engineering{" "}
                      <span className="text-[color:var(--color-brand-red)]">
                        Foundations
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 font-[var(--font-jetbrains-mono)]">
              {["SYSTEM", "ENERGY", "WORK"].map((item) => (
                <div
                  key={item}
                  className="border border-slate-200 bg-white px-3 py-2 text-center text-[9px] font-bold tracking-wider text-slate-500"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}   