import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Camera,
  Smartphone,
  Zap,
} from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(220, 38, 38, 0.08) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(225, 29, 72, 0.05) 0%, transparent 45%)",
        }}
      />

      <div className="pointer-events-none absolute right-[-1.5rem] top-4 select-none font-[var(--font-jetbrains-mono)] text-[clamp(5rem,16vw,13rem)] font-black leading-none text-slate-900/[0.035]">
        THERMO
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-7 lg:col-span-7">
            <div
              className="inline-flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <span className="size-2 rounded-full bg-[color:var(--color-brand-red)]" />
              Interactive Engineering Laboratory
            </div>

            <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase leading-[0.98] tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-6xl xl:text-7xl">
              Convert Heat Into{" "}
              <span className="bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-orange-600 bg-clip-text text-transparent">
                Mechanical Power
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--color-brand-muted)] sm:text-lg">
              Learn thermodynamics through automotive systems, interactive
              simulations, energy flow, boundary work, and hybrid vehicle
              applications in one engineering-focused platform.
            </p>

            <div
              className="space-y-4 border-2 border-[color:var(--color-brand-red)]/60 bg-gradient-to-br from-red-50/90 to-slate-50 p-5 shadow-[var(--shadow-card)] sm:p-6"
              style={{
                clipPath: "var(--clip-chamfer-lg)",
              }}
            >
              <div
                className="inline-flex items-center gap-2 border-l-2 border-[color:var(--color-brand-red)] bg-red-100/80 px-3 py-1 font-[var(--font-chakra-petch)] text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]"
                style={{
                  clipPath: "var(--clip-chamfer-sm)",
                }}
              >
                <Zap className="size-3.5" />
                Interactive vehicle energy visualization
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/simulation"
                  className="group inline-flex min-h-14 flex-1 items-center justify-center gap-3 bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-red-600 px-6 py-4 font-[var(--font-chakra-petch)] text-sm font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all duration-200 hover:brightness-110 active:scale-[0.99] sm:text-base"
                  style={{
                    clipPath: "var(--clip-chamfer-md)",
                  }}
                >
                  <Camera className="size-5 transition-transform group-hover:rotate-6" />
                  <span>Launch Simulation</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="#modules"
                  className="inline-flex min-h-14 items-center justify-center gap-2 border-2 border-slate-300 bg-white px-6 py-4 font-[var(--font-chakra-petch)] text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors hover:bg-slate-100 sm:text-sm"
                  style={{
                    clipPath: "var(--clip-chamfer-md)",
                  }}
                >
                  <span>Start Learning</span>
                  <ArrowDown className="size-4" />
                </Link>
              </div>

              <p className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
                <Smartphone className="mt-0.5 size-3.5 shrink-0 text-[color:var(--color-brand-red)]" />
                Explore thermodynamic concepts through interactive 3D vehicle
                visualization and guided engineering scenes.
              </p>
            </div>

            <div className="grid max-w-xl grid-cols-1 gap-4 border-t border-slate-200 pt-4 font-[var(--font-jetbrains-mono)] sm:grid-cols-3">
              <HeroMetric
                formula="ΔE = Q − W"
                label="First Law Energy Balance"
              />

              <HeroMetric
                formula="W = ∫ p dV"
                label="Boundary Work"
                accent
              />

              <HeroMetric
                formula="ΔKE → ΔU"
                label="Regenerative Energy"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              <div
                className="absolute -inset-5 bg-gradient-to-tr from-red-500/10 via-orange-500/10 to-transparent blur-2xl"
                aria-hidden="true"
              />

              <div
                className="relative overflow-hidden border-2 border-slate-300 bg-[color:var(--color-brand-charcoal)] shadow-[var(--shadow-card-hover)]"
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.18),transparent_55%)]" />

                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.18) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[color:var(--color-brand-charcoal)] to-transparent" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 font-[var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-slate-300">
                    <span className="size-2 rounded-full bg-[color:var(--color-brand-red)]" />
                    Vehicle Energy Lab
                  </div>

                  <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        Interactive{" "}
                        <span className="text-[color:var(--color-brand-red)]">
                          Powertrain
                        </span>
                      </div>
                      <p className="mt-1 max-w-md font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                        ENERGY • MOTION • TRANSFER • CONVERSION
                      </p>
                    </div>

                    <span className="font-[var(--font-jetbrains-mono)] text-[10px] text-slate-400">
                      SCALE 1:1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({
  formula,
  label,
  accent = false,
}: {
  formula: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-[var(--font-oswald)] text-2xl font-bold sm:text-3xl ${
          accent
            ? "text-[color:var(--color-brand-red)]"
            : "text-[color:var(--color-brand-charcoal)]"
        }`}
      >
        {formula}
      </div>

      <div className="mt-1 font-[var(--font-inter)] text-[10px] leading-relaxed text-slate-500 sm:text-xs">
        {label}
      </div>
    </div>
  );
}