import Link from "next/link";

import { Badge } from "@/src/shared/components/Badge";
import { Button } from "@/src/shared/components/Button";
import { Metric } from "@/src/shared/components/Metric";
import { Panel } from "@/src/shared/components/Panel";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

const modules = [
  {
    number: "01",
    title: "Thermodynamics Fundamentals",
    description:
      "Explore the foundations of mechanical and thermodynamic energy.",
    href: "/module/1",
  },
  {
    number: "02",
    title: "Energy & The First Law",
    description:
      "Understand work, heat, internal energy, and energy balance.",
    href: "/module/2",
  },
  {
    number: "03",
    title: "Hybrid Energy Dynamics",
    description:
      "Explore engine conversion, hybrid systems, and energy flow.",
    href: "/module/3",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="min-h-screen px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <TechnicalLabel>
              Interactive Engineering Laboratory
            </TechnicalLabel>

            <h1 className="mt-4 font-[var(--font-oswald)] text-6xl font-bold uppercase tracking-tight text-[var(--color-brand-charcoal)] md:text-7xl">
              VELOTHERM
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-brand-muted)] md:text-lg">
              An interactive learning platform for thermodynamics,
              mechanical energy, and hybrid energy systems.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/module/1" size="lg">
                Start learning
              </Button>

              <Button
                href="/module/3"
                variant="secondary"
                size="lg"
              >
                Explore hybrid
              </Button>
            </div>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {modules.map((module) => (
              <Panel
                key={module.number}
                interactive
                className="flex min-h-72 flex-col"
              >
                <Badge>
                  Module {module.number}
                </Badge>

                <h2 className="mt-6 font-[var(--font-oswald)] text-3xl font-semibold uppercase leading-tight">
                  {module.title}
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-[var(--color-brand-muted)]">
                  {module.description}
                </p>

                <Link
                  href={module.href}
                  className="mt-auto pt-8 font-[var(--font-chakra-petch)] text-sm font-semibold uppercase tracking-wide text-[var(--color-brand-charcoal)] transition-colors hover:text-[var(--color-brand-red)]"
                >
                  Open module →
                </Link>
              </Panel>
            ))}
          </div>

          <Panel variant="dark" className="mt-8">
            <TechnicalLabel accent="cyan">
              System Readout
            </TechnicalLabel>

            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              <Metric
                value="03"
                label="Learning Modules"
                variant="dark"
              />

              <Metric
                value="15"
                label="Interactive Scenes"
                variant="dark"
              />

              <Metric
                value="01"
                label="Shared Vehicle Model"
                variant="dark"
              />
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}