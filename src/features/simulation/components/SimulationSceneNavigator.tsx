"use client";

import {
  useState,
} from "react";

export type SimulationSceneOption = {
  id: string;
  label: string;
};

type SimulationSceneNavigatorProps = {
  scenes: SimulationSceneOption[];
  activeScene: string;
  onChange: (
    sceneId: string,
  ) => void;
};

function getSceneNumber(
  label: string,
): string {
  return (
    label.match(
      /^\d+/,
    )?.[0] ?? ""
  );
}

function getSceneName(
  label: string,
): string {
  return label
    .replace(
      /^\d+\s*[·•-]?\s*/,
      "",
    )
    .trim();
}

export function SimulationSceneNavigator({
  scenes,
  activeScene,
  onChange,
}: SimulationSceneNavigatorProps) {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const activeSceneData =
    scenes.find(
      (scene) =>
        scene.id ===
        activeScene,
    );

  const activeIndex =
    activeSceneData
      ? scenes.indexOf(
          activeSceneData,
        )
      : 0;

  const handleChange = (
    sceneId: string,
  ) => {
    onChange(sceneId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP
          ≥ 1280px
      ===================================================== */}

      <nav
        aria-label="Simulation scenes"
        className="pointer-events-none absolute left-1/2 top-5 z-50 hidden -translate-x-1/2 min-[1280px]:block"
      >
        <div
          className="pointer-events-auto inline-flex h-7 items-center border border-slate-700/80 bg-slate-950/74 px-1 shadow-md backdrop-blur-md"
          style={{
            clipPath:
              "var(--clip-chamfer-sm)",
          }}
        >
          <span className="px-2 font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Scenes
          </span>

          <span className="mr-1 h-3.5 w-px bg-slate-700" />

          {scenes.map(
            (
              scene,
              index,
            ) => {
              const isActive =
                activeScene ===
                scene.id;

              const number =
                getSceneNumber(
                  scene.label,
                );

              const name =
                getSceneName(
                  scene.label,
                );

              return (
                <button
                  key={
                    scene.id
                  }
                  type="button"
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  title={
                    scene.label
                  }
                  onClick={() =>
                    onChange(
                      scene.id,
                    )
                  }
                  className={[
                    "flex h-5 items-center gap-1 px-2 transition-colors duration-150",
                    isActive
                      ? "bg-[var(--color-brand-red)] text-white"
                      : "text-slate-500 hover:bg-slate-900 hover:text-slate-200",
                  ].join(" ")}
                >
                  <span className="font-[var(--font-jetbrains-mono)] text-[7px] font-semibold">
                    {number}
                  </span>

                  <span className="hidden xl:inline font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.03em]">
                    {name}
                  </span>

                  {isActive && (
                    <span className="h-1 w-1 rounded-full bg-white" />
                  )}

                  {index <
                    scenes.length -
                      1 && (
                    <span className="ml-0.5 h-2.5 w-px bg-slate-800" />
                  )}
                </button>
              );
            },
          )}
        </div>
      </nav>

      {/* =====================================================
          TABLET + MOBILE SIDE TAB

          < 1280px

          Tablet now follows the same interaction model
          as mobile so there is one simple mental model.
      ===================================================== */}

      <div className="pointer-events-none fixed inset-y-0 right-0 z-50 block min-[1280px]:hidden">
        {/* =================================================
            OPEN TAB
        ================================================= */}

        {!mobileOpen && (
          <button
            type="button"
            aria-label="Open scene navigation"
            aria-expanded="false"
            onClick={() =>
              setMobileOpen(true)
            }
            className="pointer-events-auto absolute right-0 top-[43%] flex h-14 w-8 -translate-y-1/2 items-center justify-center border border-r-0 border-slate-700/90 bg-slate-950/90 shadow-lg backdrop-blur-md sm:h-16 sm:w-9"
            style={{
              clipPath:
                "polygon(30% 0,100% 0,100% 100%,30% 100%,0 78%,0 22%)",
            }}
          >
            <span className="flex flex-col items-center gap-0.5">
              <span className="font-[var(--font-jetbrains-mono)] text-[6px] text-slate-500 sm:text-[7px]">
                SC
              </span>

              <span className="font-[var(--font-jetbrains-mono)] text-[9px] font-semibold text-white sm:text-[10px]">
                {getSceneNumber(
                activeSceneData?.label ??
                    "",
                ).padStart(
                2,
                "0",
                )}
              </span>
            </span>
          </button>
        )}

        {/* =================================================
            BACKDROP
        ================================================= */}

        {mobileOpen && (
          <button
            type="button"
            aria-label="Close scene navigation"
            onClick={() =>
              setMobileOpen(
                false,
              )
            }
            className="pointer-events-auto fixed inset-0 bg-slate-950/25"
          />
        )}

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          aria-hidden={
            !mobileOpen
          }
          className={[
            "pointer-events-auto absolute right-0 top-0 h-full w-[220px] sm:w-[250px]",
            "border-l border-slate-700/90 bg-slate-950/97 shadow-[-18px_0_50px_rgba(0,0,0,0.45)] backdrop-blur-xl",
            "transform-gpu transition-transform duration-300 ease-out",
            mobileOpen
              ? "translate-x-0"
              : "pointer-events-none translate-x-full",
          ].join(" ")}
        >
          {/* SIDEBAR HEADER */}

          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-5">
            <div>
              <span className="block font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-red)]">
                Scene Navigation
              </span>

              <span className="mt-1 block font-[var(--font-jetbrains-mono)] text-[8px] uppercase text-slate-500">
                {getSceneNumber(
                activeSceneData?.label ??
                    "",
                ).padStart(
                2,
                "0",
                )}
                /
                {String(
                  scenes.length,
                ).padStart(
                  2,
                  "0",
                )}
              </span>
            </div>

            <button
              type="button"
              aria-label="Close scene navigation"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
              className="flex h-8 w-8 items-center justify-center border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
            >
              <span className="font-[var(--font-jetbrains-mono)] text-sm">
                ×
              </span>
            </button>
          </div>

          {/* SCENES */}

          <div className="space-y-1 p-3 sm:p-4">
            {scenes.map(
              (
                scene,
              ) => {
                const isActive =
                  activeScene ===
                  scene.id;

                return (
                  <button
                    key={
                      scene.id
                    }
                    type="button"
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    onClick={() =>
                      handleChange(
                        scene.id,
                      )
                    }
                    className={[
                      "flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors duration-150 sm:py-3",
                      isActive
                        ? "border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white"
                        : "border-slate-800 bg-slate-900/45 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "font-[var(--font-jetbrains-mono)] text-[8px] font-semibold",
                        isActive
                          ? "text-white"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {getSceneNumber(
                        scene.label,
                      )}
                    </span>

                    <span className="min-w-0 flex-1 truncate font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.04em]">
                      {getSceneName(
                        scene.label,
                      )}
                    </span>

                    {isActive && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    )}
                  </button>
                );
              },
            )}
          </div>
        </aside>
      </div>
    </>
  );
}