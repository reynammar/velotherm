"use client";

import { useState } from "react";

import { Scene03PistonWork } from "../scenes/Scene03PistonWork";

import { Scene04PVWork } from "../scenes/Scene04PVWork";

import { Scene05PowerRotation } from "../scenes/Scene05PowerRotation";

import { Scene06HeatInternalEnergy } from "../scenes/Scene06HeatInternalEnergy";

import { Scene07FirstLaw } from "../scenes/Scene07FirstLaw";

import { Button } from "@/src/shared/components/Button";

export function Module02Container() {
  const [
    activeScene,
    setActiveScene,
  ] = useState<
    | "piston-work"
    | "pv-work"
    | "power-rotation"
    | "heat-internal-energy"
    | "first-law"
  >("piston-work");

  return (
    <div className="relative">
      {activeScene ===
        "piston-work" && (
        <Scene03PistonWork />
      )}

      {activeScene ===
        "pv-work" && (
        <Scene04PVWork />
      )}

      {activeScene ===
        "power-rotation" && (
        <Scene05PowerRotation />
      )}

      {activeScene ===
        "heat-internal-energy" && (
        <Scene06HeatInternalEnergy />
      )}

      {activeScene ===
        "first-law" && (
        <Scene07FirstLaw />
      )}

      <nav
        aria-label="Module 02 scenes"
        className="pointer-events-none absolute left-4 top-[76px] z-40 max-w-[calc(100%-32px)] overflow-x-auto sm:left-6 sm:top-[88px] lg:left-8"
      >
        <div className="pointer-events-auto flex min-w-max gap-2">
          <Button
            type="button"
            size="sm"
            variant={
              activeScene ===
              "piston-work"
                ? "primary"
                : "secondary"
            }
            onClick={() =>
              setActiveScene(
                "piston-work",
              )
            }
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            03 · Piston Work
          </Button>

          <Button
            type="button"
            size="sm"
            variant={
              activeScene ===
              "pv-work"
                ? "primary"
                : "secondary"
            }
            onClick={() =>
              setActiveScene(
                "pv-work",
              )
            }
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            04 · P–V Work
          </Button>

          <Button
            type="button"
            size="sm"
            variant={
              activeScene ===
              "power-rotation"
                ? "primary"
                : "secondary"
            }
            onClick={() =>
              setActiveScene(
                "power-rotation",
              )
            }
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            05 · Power
          </Button>

          <Button
            type="button"
            size="sm"
            variant={
              activeScene ===
              "heat-internal-energy"
                ? "primary"
                : "secondary"
            }
            onClick={() =>
              setActiveScene(
                "heat-internal-energy",
              )
            }
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            06 · Heat & Energy
          </Button>

          <Button
            type="button"
            size="sm"
            variant={
              activeScene ===
              "first-law"
                ? "primary"
                : "secondary"
            }
            onClick={() =>
              setActiveScene(
                "first-law",
              )
            }
            className="border-slate-700/80 bg-slate-950/70 backdrop-blur-sm"
          >
            07 · First Law
          </Button>
        </div>
      </nav>
    </div>
  );
}