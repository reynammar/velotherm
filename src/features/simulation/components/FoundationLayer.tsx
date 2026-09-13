"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  ChevronRight,
  X,
} from "lucide-react";

import {
  getFoundationContext,
  getFoundationTopicsForScene,
  type FoundationTopic,
} from "../data/foundationContent";

type FoundationLayerProps = {
  moduleLabel: string;
  sceneNumber: string;
  sceneLabel: string;
  open: boolean;
  onClose: () => void;
};

export function FoundationLayer({
  moduleLabel,
  sceneNumber,
  sceneLabel,
  open,
  onClose,
}: FoundationLayerProps) {
  const topics = useMemo(
    () =>
      getFoundationTopicsForScene(
        sceneNumber,
      ),
    [sceneNumber],
  );

  const context = useMemo(
    () =>
      getFoundationContext(
        sceneNumber,
      ),
    [sceneNumber],
  );

  /**
   * The component is keyed by sceneNumber
   * from SimulationShell.
   *
   * Therefore this initial value is recreated
   * automatically whenever the active scene
   * changes.
   */
  const [
    activeTopicId,
    setActiveTopicId,
  ] = useState(
    topics[0]?.id ?? "",
  );

  const activeTopic =
    topics.find(
      (topic) =>
        topic.id ===
        activeTopicId,
    ) ??
    topics[0];

  if (!open) {
    return null;
  }

  return (
    <>
      {/* ===================================================
          DESKTOP FOUNDATION
      =================================================== */}

      <aside className="absolute right-4 top-28 z-[60] hidden h-[calc(100dvh-8.5rem)] w-[390px] max-w-[calc(100vw-2rem)] min-[1280px]:block">
        <FoundationContent
          moduleLabel={
            moduleLabel
          }
          sceneNumber={
            sceneNumber
          }
          sceneLabel={
            sceneLabel
          }
          context={
            context
          }
          topics={
            topics
          }
          activeTopic={
            activeTopic
          }
          onSelectTopic={(
            id,
          ) =>
            setActiveTopicId(
              id,
            )
          }
          onClose={
            onClose
          }
        />
      </aside>

      {/* ===================================================
          TABLET / MOBILE BACKDROP
      =================================================== */}

      <button
        type="button"
        aria-label="Close foundation"
        onClick={
          onClose
        }
        className="absolute inset-0 z-[65] bg-slate-950/40 backdrop-blur-[2px] min-[1280px]:hidden"
      />

      {/* ===================================================
          TABLET / MOBILE FOUNDATION
      =================================================== */}

      <aside className="absolute inset-x-0 bottom-0 z-[70] min-[1280px]:hidden">
        <div className="mx-auto max-h-[72dvh] w-full max-w-3xl px-2 pb-2 sm:px-4 sm:pb-4">
          <FoundationContent
            moduleLabel={
              moduleLabel
            }
            sceneNumber={
              sceneNumber
            }
            sceneLabel={
              sceneLabel
            }
            context={
              context
            }
            topics={
              topics
            }
            activeTopic={
              activeTopic
            }
            onSelectTopic={(
              id,
            ) =>
              setActiveTopicId(
                id,
              )
            }
            onClose={
              onClose
            }
          />
        </div>
      </aside>
    </>
  );
}

type FoundationContentProps = {
  moduleLabel: string;
  sceneNumber: string;
  sceneLabel: string;
  context: ReturnType<
    typeof getFoundationContext
  >;
  topics: FoundationTopic[];
  activeTopic:
    | FoundationTopic
    | undefined;
  onSelectTopic: (
    id: string,
  ) => void;
  onClose: () => void;
};

function FoundationContent({
  moduleLabel,
  sceneNumber,
  sceneLabel,
  context,
  topics,
  activeTopic,
  onSelectTopic,
  onClose,
}: FoundationContentProps) {
  const recommendedCount =
    context
      .recommendedTopics
      .length;

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden border border-slate-700/90 bg-slate-950/97 shadow-2xl backdrop-blur-xl"
      style={{
        clipPath:
          "var(--clip-chamfer-sm)",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="shrink-0 border-b border-slate-800 px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BookOpen
                size={13}
                strokeWidth={1.6}
                className="shrink-0 text-cyan-400"
              />

              <span className="font-[var(--font-chakra-petch)] text-[8px] font-semibold uppercase tracking-[0.18em] text-cyan-400 sm:text-[9px]">
                Foundation
              </span>
            </div>

            <span className="mt-1 block truncate font-[var(--font-oswald)] text-base font-semibold uppercase text-white sm:text-lg">
              Thermodynamics
            </span>

            <span className="mt-0.5 block truncate font-[var(--font-jetbrains-mono)] text-[6px] uppercase tracking-wide text-slate-500 sm:text-[7px]">
              {moduleLabel} ·{" "}
              {sceneNumber} ·{" "}
              {sceneLabel}
            </span>
          </div>

          <button
            type="button"
            aria-label="Close foundation"
            onClick={
              onClose
            }
            className="flex h-7 w-7 shrink-0 items-center justify-center border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white sm:h-8 sm:w-8"
          >
            <X
              size={14}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* =================================================
            SCENE CONTEXT
        ================================================= */}

        <div className="mt-3 border border-slate-800 bg-slate-900/45 px-2.5 py-2.5">
          <span className="block font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-red)]">
            Why this matters
          </span>

          <span className="mt-1 block font-[var(--font-oswald)] text-sm font-semibold uppercase text-white">
            {
              context.contextTitle
            }
          </span>

          <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[7px] leading-relaxed text-slate-500">
            {
              context.contextDescription
            }
          </p>
        </div>
      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">
        {/* =================================================
            TOPIC NAVIGATION
        ================================================= */}

        <div className="shrink-0 border-b border-slate-800 sm:w-[148px] sm:border-b-0 sm:border-r">
          <div className="flex gap-1.5 overflow-x-auto p-2 sm:h-full sm:flex-col sm:overflow-y-auto">
            {topics.map(
              (
                topic,
                index,
              ) => {
                const active =
                  topic.id ===
                  activeTopic?.id;

                const recommended =
                  index <
                  recommendedCount;

                return (
                  <button
                    key={
                      topic.id
                    }
                    type="button"
                    onClick={() =>
                      onSelectTopic(
                        topic.id,
                      )
                    }
                    className={[
                      "group flex shrink-0 items-center gap-2 border px-2 py-2 text-left transition-colors",
                      "sm:w-full",
                      active
                        ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
                        : "border-slate-800 bg-slate-950/45 text-slate-500 hover:border-slate-600 hover:text-white",
                    ].join(
                      " ",
                    )}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        recommended
                          ? "bg-cyan-400"
                          : "bg-slate-700",
                      ].join(
                        " ",
                      )}
                    />

                    <span className="min-w-0 flex-1 truncate font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.04em] sm:max-w-none">
                      {
                        topic.title
                      }
                    </span>

                    <ChevronRight
                      size={10}
                      strokeWidth={1.5}
                      className={[
                        "ml-auto hidden shrink-0 sm:block",
                        active
                          ? "text-cyan-300"
                          : "text-slate-700",
                      ].join(
                        " ",
                      )}
                    />
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* =================================================
            TOPIC DETAIL
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTopic && (
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={[
                    "font-[var(--font-jetbrains-mono)] text-[7px] font-semibold uppercase tracking-[0.16em]",
                    activeTopic.accent ===
                      "red"
                      ? "text-[var(--color-brand-red)]"
                      : "text-cyan-400",
                  ].join(
                    " ",
                  )}
                >
                  {
                    activeTopic.eyebrow
                  }
                </span>

                <span className="font-[var(--font-jetbrains-mono)] text-[6px] uppercase text-slate-700">
                  FOUNDATION
                </span>
              </div>

              <h2 className="mt-1.5 font-[var(--font-oswald)] text-2xl font-semibold uppercase leading-none text-white sm:text-[26px]">
                {
                  activeTopic.title
                }
              </h2>

              {/* =================================================
                  CONCEPT
              ================================================= */}

              <div className="mt-4">
                <span className="block font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Concept
                </span>

                <p className="mt-1.5 font-[var(--font-jetbrains-mono)] text-[8px] leading-relaxed text-slate-400">
                  {
                    activeTopic.summary
                  }
                </p>
              </div>

              {/* =================================================
                  FORMULA
              ================================================= */}

              {activeTopic.formula && (
                <div className="mt-4 border border-slate-800 bg-slate-900/50 p-3">
                  <span className="block font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Formula
                  </span>

                  <div className="mt-2 overflow-x-auto">
                    <span className="block whitespace-nowrap font-[var(--font-jetbrains-mono)] text-sm font-semibold text-cyan-300 sm:text-base">
                      {
                        activeTopic.formula
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* =================================================
                  KEY TERMS
              ================================================= */}

              <div className="mt-4">
                <span className="block font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Key Terms
                </span>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {activeTopic.terms.map(
                    (
                      term,
                    ) => (
                      <span
                        key={
                          term
                        }
                        className="border border-slate-800 bg-slate-950 px-2 py-1 font-[var(--font-jetbrains-mono)] text-[6px] text-slate-400"
                      >
                        {
                          term
                        }
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* =================================================
                  TAKEAWAY
              ================================================= */}

              <div
                className={[
                  "mt-4 border-l px-3 py-2.5",
                  activeTopic.accent ===
                    "red"
                    ? "border-l-[var(--color-brand-red)] bg-red-500/5"
                    : "border-l-cyan-400 bg-cyan-500/5",
                ].join(
                  " ",
                )}
              >
                <span
                  className={[
                    "block font-[var(--font-chakra-petch)] text-[7px] font-semibold uppercase tracking-[0.12em]",
                    activeTopic.accent ===
                      "red"
                      ? "text-[var(--color-brand-red)]"
                      : "text-cyan-500",
                  ].join(
                    " ",
                  )}
                >
                  Takeaway
                </span>

                <p className="mt-1 font-[var(--font-jetbrains-mono)] text-[7px] leading-relaxed text-slate-400">
                  {
                    activeTopic.takeaway
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="shrink-0 border-t border-slate-800 px-3 py-2.5 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-[var(--font-jetbrains-mono)] text-[6px] uppercase tracking-wide text-slate-700">
            Foundation Layer
          </span>

          <span className="font-[var(--font-jetbrains-mono)] text-[6px] uppercase tracking-wide text-slate-600">
            {topics.length}{" "}
            topics
          </span>
        </div>
      </div>
    </div>
  );
}