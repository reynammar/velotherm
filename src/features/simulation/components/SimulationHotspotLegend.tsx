"use client";

export function SimulationHotspotLegend() {
  return (
    <div
      aria-label="Hotspot legend"
      className="pointer-events-none absolute left-3 top-[104px] z-40 border border-slate-700/80 bg-slate-950/85 px-2.5 py-2 shadow-lg backdrop-blur-md sm:left-5 sm:top-[112px] sm:px-3"
      style={{
        clipPath: "var(--clip-chamfer-sm)",
      }}
    >
      <span className="mb-1.5 block font-[var(--font-chakra-petch)] text-[6px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:text-[7px]">
        Hotspot Legend
      </span>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full border border-red-300 bg-red-500 shadow-[0_0_7px_rgba(239,68,68,0.45)]" />
        <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.06em] text-slate-200 sm:text-[8px]">
          Information
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full border border-blue-200 bg-blue-500 shadow-[0_0_7px_rgba(59,130,246,0.4)]" />
        <span className="font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.06em] text-slate-200 sm:text-[8px]">
          Interact
        </span>
      </div>
    </div>
  );
}