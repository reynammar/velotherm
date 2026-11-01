export const SIMULATION_INFORMATION_EVENT =
  "velotherm:information-hotspot";

export type SimulationInformationEventDetail = {
  topicId: string;
  title: string;
  description: string;
};

export function emitSimulationInformation(
  detail: SimulationInformationEventDetail,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<SimulationInformationEventDetail>(
      SIMULATION_INFORMATION_EVENT,
      {
        detail,
      },
    ),
  );
}