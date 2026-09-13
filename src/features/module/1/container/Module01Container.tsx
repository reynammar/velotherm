"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/Button";

import { Scene01KineticEnergy } from "../scenes/Scene01KineticEnergy";

import { Scene02PotentialEnergy } from "../scenes/Scene02PotentialEnergy";

type ModuleScene =
  | "kinetic"
  | "potential";

export function Module01Container() {
  const [
    activeScene,
    setActiveScene,
  ] =
    useState<ModuleScene>(
      "kinetic",
    );

  return (
    <div className="relative">
      {activeScene ===
        "kinetic" && (
        <Scene01KineticEnergy />
      )}

      {activeScene ===
        "potential" && (
        <Scene02PotentialEnergy />
      )}

      <nav
        aria-label="Module 01 scenes"
        className="pointer-events-none absolute left-4 top-[76px] z-40 max-w-[calc(100%-32px)] overflow-x-auto sm:left-6 sm:top-[88px] lg:left-8"
      >
        <div className="pointer-events-auto flex min-w-max gap-2">
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
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            01 · Kinetic
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
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            02 · Potential
          </Button>
        </div>
      </nav>
    </div>
  );
}