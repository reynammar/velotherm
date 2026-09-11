"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/Button";
import { TechnicalLabel } from "@/src/shared/components/TechnicalLabel";

import { Scene01KineticEnergy } from "@/src/features/module/1/scenes/Scene01KineticEnergy";
import { Scene02PotentialEnergy } from "@/src/features/module/1/scenes/Scene02PotentialEnergy";

type ModuleScene =
  | "kinetic"
  | "potential";

export function Module01Container() {
  const [activeScene, setActiveScene] =
    useState<ModuleScene>("kinetic");

  return (
    <main className="min-h-screen bg-[var(--color-brand-bg)]">
      <section className="px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <header>
            <TechnicalLabel>
              Module 01
            </TechnicalLabel>

            <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase tracking-tight text-[var(--color-brand-charcoal)] md:text-6xl">
              Mechanical Energy
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-brand-muted)] md:text-lg">
              Explore how motion and elevation
              determine the mechanical energy of a
              vehicle.
            </p>
          </header>

          <nav
            aria-label="Module 01 scenes"
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button
              type="button"
              size="sm"
              variant={
                activeScene ===
                "kinetic"
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                setActiveScene(
                  "kinetic",
                )
              }
            >
              01 · Kinetic Energy
            </Button>

            <Button
              type="button"
              size="sm"
              variant={
                activeScene ===
                "potential"
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                setActiveScene(
                  "potential",
                )
              }
            >
              02 · Potential Energy
            </Button>
          </nav>

          <div className="mt-10">
            {activeScene ===
              "kinetic" && (
              <Scene01KineticEnergy />
            )}

            {activeScene ===
              "potential" && (
              <Scene02PotentialEnergy />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}