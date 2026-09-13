export type FirstLawBalance = {
  heatInputKJ: number;
  workOutputKJ: number;
  deltaEnergyKJ: number;
};

export function calculateEnergyChange(
  heatInputKJ: number,
  workOutputKJ: number,
): number {
  return (
    heatInputKJ -
    workOutputKJ
  );
}

export function calculateFirstLawBalance({
  heatInputKJ,
  workOutputKJ,
}: {
  heatInputKJ: number;
  workOutputKJ: number;
}): FirstLawBalance {
  if (
    heatInputKJ < 0 ||
    workOutputKJ < 0
  ) {
    throw new RangeError(
      "Energy input and work output cannot be negative.",
    );
  }

  return {
    heatInputKJ,
    workOutputKJ,
    deltaEnergyKJ:
      calculateEnergyChange(
        heatInputKJ,
        workOutputKJ,
      ),
  };
}

export function getEnergyState(
  deltaEnergyKJ: number,
): "STORING" | "BALANCED" | "RELEASING" {
  if (
    Math.abs(deltaEnergyKJ) <
    0.01
  ) {
    return "BALANCED";
  }

  return deltaEnergyKJ > 0
    ? "STORING"
    : "RELEASING";
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    Math.max(value, min),
    max,
  );
}