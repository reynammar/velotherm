export type FoundationTopic = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  formula?: string;
  terms: string[];
  takeaway: string;
  accent: "cyan" | "red";
};

export type FoundationSceneContext = {
  recommendedTopics: string[];
  contextTitle: string;
  contextDescription: string;
};

/**
 * =========================================================
 * FOUNDATION TOPICS
 * =========================================================
 *
 * Materi diambil dari fondasi dan konsep yang muncul
 * pada tiga modul thermodynamics yang digunakan VELOTHERM.
 *
 * Foundation bukan pengganti scene.
 * Foundation hanya membantu user memahami konsep yang
 * sedang dipakai oleh scene.
 */

export const FOUNDATION_TOPICS: FoundationTopic[] = [
  // =======================================================
  // SYSTEM
  // =======================================================

  {
    id: "macro-microscopic",
    title: "Macroscopic & Microscopic View",
    eyebrow: "WAY OF THINKING",
    summary:
      "Thermodynamics can be viewed through measurable macroscopic quantities and through microscopic behavior occurring inside matter.",
    terms: [
      "Macroscopic",
      "Microscopic",
      "Measurement",
      "System behavior",
    ],
    takeaway:
      "The macroscopic view describes what an engineer can measure, while the microscopic view helps explain what happens inside the system.",
    accent: "cyan",
  },

  {
    id: "system",
    title: "Thermodynamic System",
    eyebrow: "SYSTEM",
    summary:
      "A thermodynamic system is the portion of the physical world selected for analysis.",
    terms: [
      "System",
      "Boundary",
      "Surroundings",
      "Region of interest",
    ],
    takeaway:
      "Before calculating energy, define what part of the physical world is being analyzed.",
    accent: "cyan",
  },

  {
    id: "boundary-surroundings",
    title: "Boundary & Surroundings",
    eyebrow: "BOUNDARY",
    summary:
      "A boundary separates the selected thermodynamic system from everything outside it.",
    terms: [
      "Boundary",
      "System",
      "Surroundings",
      "Energy transfer",
      "Work transfer",
    ],
    takeaway:
      "Heat and work are analyzed as energy transfers across a system boundary.",
    accent: "red",
  },

  {
    id: "system-classification",
    title: "System Classification",
    eyebrow: "SYSTEM",
    summary:
      "Thermodynamic systems can be distinguished by what is allowed to cross their boundaries.",
    terms: [
      "Closed system",
      "Open system",
      "Isolated system",
      "Mass transfer",
      "Energy transfer",
    ],
    takeaway:
      "The system boundary determines how mass and energy can interact with the surroundings.",
    accent: "cyan",
  },

  // =======================================================
  // STATE & PROPERTIES
  // =======================================================

  {
    id: "properties",
    title: "Thermodynamic Properties",
    eyebrow: "PROPERTY",
    summary:
      "Properties describe the condition of a thermodynamic system and can be used to characterize its state.",
    terms: [
      "Pressure",
      "Temperature",
      "Volume",
      "Mass",
      "Energy",
    ],
    takeaway:
      "A system state is described through measurable properties.",
    accent: "cyan",
  },

  {
    id: "extensive-intensive",
    title: "Extensive & Intensive Properties",
    eyebrow: "PROPERTY",
    summary:
      "Properties can be classified according to whether their values depend on the size or amount of the system.",
    terms: [
      "Extensive",
      "Intensive",
      "Mass",
      "Volume",
      "Pressure",
      "Temperature",
    ],
    takeaway:
      "Extensive properties depend on system size, while intensive properties do not.",
    accent: "cyan",
  },

  {
    id: "state-process",
    title: "State & Process",
    eyebrow: "STATE",
    summary:
      "A state describes the condition of a system, while a process describes the change from one state to another.",
    terms: [
      "State",
      "Process",
      "Initial state",
      "Final state",
      "Equilibrium",
    ],
    takeaway:
      "State tells us the condition of the system, while process describes its evolution.",
    accent: "cyan",
  },

  {
    id: "thermodynamic-cycle",
    title: "Thermodynamic Cycle",
    eyebrow: "PROCESS",
    summary:
      "A thermodynamic cycle is a sequence of processes in which the system eventually returns to its initial state.",
    terms: [
      "Cycle",
      "Process",
      "Initial state",
      "Final state",
      "Closed path",
    ],
    takeaway:
      "A cycle is defined by a sequence of processes that returns the system to its starting state.",
    accent: "cyan",
  },

  // =======================================================
  // MEASUREMENT
  // =======================================================

  {
    id: "pressure",
    title: "Pressure",
    eyebrow: "MEASUREMENT",
    summary:
      "Pressure is one of the fundamental measurable properties used to describe the state of a thermodynamic system.",
    terms: [
      "Pressure",
      "Force",
      "Area",
      "P",
      "kPa",
    ],
    takeaway:
      "Pressure becomes especially important when a system boundary moves, such as in piston-cylinder work.",
    accent: "red",
  },

  {
    id: "absolute-gauge-pressure",
    title: "Absolute & Gauge Pressure",
    eyebrow: "PRESSURE",
    summary:
      "Pressure measurements can use different references, so the distinction between absolute and gauge pressure matters in thermodynamic analysis.",
    terms: [
      "Absolute pressure",
      "Gauge pressure",
      "Atmospheric pressure",
      "Reference pressure",
    ],
    takeaway:
      "Always identify the pressure reference before interpreting or using a pressure value.",
    accent: "red",
  },

  {
    id: "zeroth-law",
    title: "Zeroth Law",
    eyebrow: "THERMAL EQUILIBRIUM",
    summary:
      "The Zeroth Law provides the basis for understanding thermal equilibrium between systems.",
    terms: [
      "Thermal equilibrium",
      "Temperature",
      "System",
      "Equilibrium",
    ],
    takeaway:
      "Temperature can be compared consistently because systems in thermal equilibrium share the same thermal state.",
    accent: "red",
  },

  {
    id: "temperature",
    title: "Temperature",
    eyebrow: "MEASUREMENT",
    summary:
      "Temperature describes the thermal condition of a system and is central to heat transfer and thermal equilibrium.",
    formula:
      "T(K) = T(°C) + 273.15",
    terms: [
      "Temperature",
      "Kelvin",
      "Celsius",
      "Thermal equilibrium",
    ],
    takeaway:
      "Temperature differences provide the basis for analyzing heat transfer.",
    accent: "red",
  },

  // =======================================================
  // ENERGY
  // =======================================================

  {
    id: "energy",
    title: "Energy",
    eyebrow: "ENERGY",
    summary:
      "Thermodynamics accounts for energy through mechanical and internal forms associated with a system.",
    formula:
      "E = KE + PE + U",
    terms: [
      "Kinetic energy",
      "Potential energy",
      "Internal energy",
      "Total energy",
    ],
    takeaway:
      "Total system energy can be viewed through kinetic, potential, and internal energy.",
    accent: "cyan",
  },

  {
    id: "kinetic-energy",
    title: "Kinetic Energy",
    eyebrow: "MECHANICAL ENERGY",
    summary:
      "Kinetic energy is the energy associated with the motion of a body.",
    formula:
      "KE = ½mv²",
    terms: [
      "Mass",
      "Velocity",
      "Motion",
      "Kinetic energy",
    ],
    takeaway:
      "Vehicle speed and mass directly affect the kinetic energy carried by the vehicle.",
    accent: "cyan",
  },

  {
    id: "potential-energy",
    title: "Potential Energy",
    eyebrow: "MECHANICAL ENERGY",
    summary:
      "Potential energy is associated with the position of a body relative to a selected reference level.",
    formula:
      "PE = mgh",
    terms: [
      "Mass",
      "Gravity",
      "Height",
      "Reference level",
    ],
    takeaway:
      "Changing height changes the gravitational potential energy of the vehicle.",
    accent: "cyan",
  },

  {
    id: "internal-energy",
    title: "Internal Energy",
    eyebrow: "ENERGY STORAGE",
    summary:
      "Internal energy represents energy stored within a system at the microscopic level.",
    formula:
      "ΔU = U₂ − U₁",
    terms: [
      "Internal energy",
      "Microscopic energy",
      "Thermal storage",
      "ΔU",
    ],
    takeaway:
      "A change in system energy can appear as a change in internal energy.",
    accent: "cyan",
  },

  // =======================================================
  // WORK
  // =======================================================

  {
    id: "work",
    title: "Thermodynamic Work",
    eyebrow: "ENERGY TRANSFER",
    summary:
      "Work is energy transferred across the system boundary by mechanisms associated with force, motion, or other organized interactions.",
    formula:
      "W = ∫ P dV",
    terms: [
      "Work",
      "Energy transfer",
      "Boundary",
      "Pressure",
      "Volume",
    ],
    takeaway:
      "Work is energy crossing the boundary, not energy stored as a property of the system.",
    accent: "red",
  },

  {
    id: "boundary-work",
    title: "Boundary Work",
    eyebrow: "PISTON-CYLINDER",
    summary:
      "Boundary work occurs when a system boundary moves against a pressure.",
    formula:
      "W = ∫ P dV",
    terms: [
      "Piston",
      "Cylinder",
      "Pressure",
      "Volume",
      "Boundary",
    ],
    takeaway:
      "Piston movement changes system volume and can produce boundary work.",
    accent: "red",
  },

  {
    id: "sign-convention",
    title: "Work Sign Convention",
    eyebrow: "WORK",
    summary:
      "Thermodynamic work uses a sign convention so that energy entering and leaving the system can be accounted for consistently.",
    terms: [
      "Work in",
      "Work out",
      "Expansion",
      "Compression",
      "Sign convention",
    ],
    takeaway:
      "The sign of work matters because it determines how the energy balance is written.",
    accent: "red",
  },

  {
    id: "expansion-compression",
    title: "Expansion & Compression",
    eyebrow: "BOUNDARY WORK",
    summary:
      "Expansion and compression change system volume and therefore affect boundary work.",
    terms: [
      "Expansion",
      "Compression",
      "Volume",
      "Pressure",
      "Piston motion",
    ],
    takeaway:
      "The direction of volume change determines whether the piston is expanding or compressing the system.",
    accent: "red",
  },

  {
    id: "pv-area",
    title: "P–V Area",
    eyebrow: "WORK",
    summary:
      "On a pressure-volume diagram, the area associated with a process represents boundary work.",
    terms: [
      "Pressure",
      "Volume",
      "P–V diagram",
      "Area",
      "Work",
    ],
    takeaway:
      "Reading the area under a P–V path provides an intuitive way to understand boundary work.",
    accent: "cyan",
  },

  {
    id: "polytropic-process",
    title: "Polytropic Process",
    eyebrow: "PROCESS",
    summary:
      "A polytropic process describes a thermodynamic process using a pressure-volume relationship.",
    formula:
      "P Vⁿ = constant",
    terms: [
      "Pressure",
      "Volume",
      "n",
      "Process path",
    ],
    takeaway:
      "Different process paths on a P–V diagram can produce different amounts of boundary work.",
    accent: "cyan",
  },

  // =======================================================
  // HEAT
  // =======================================================

  {
    id: "heat",
    title: "Heat Transfer",
    eyebrow: "ENERGY TRANSFER",
    summary:
      "Heat is energy transferred across a system boundary because of a temperature difference.",
    terms: [
      "Heat",
      "Temperature",
      "Boundary",
      "Energy transfer",
    ],
    takeaway:
      "Heat describes energy crossing a boundary because of temperature difference.",
    accent: "red",
  },

  {
    id: "conduction",
    title: "Conduction",
    eyebrow: "HEAT TRANSFER",
    summary:
      "Conduction is a mode of heat transfer associated with energy moving through matter.",
    terms: [
      "Conduction",
      "Heat",
      "Material",
      "Temperature difference",
    ],
    takeaway:
      "Conduction transfers thermal energy through a material without requiring bulk fluid motion.",
    accent: "red",
  },

  {
    id: "convection",
    title: "Convection",
    eyebrow: "HEAT TRANSFER",
    summary:
      "Convection transfers thermal energy through the movement of a fluid.",
    terms: [
      "Convection",
      "Fluid",
      "Heat",
      "Temperature",
    ],
    takeaway:
      "Fluid motion plays an important role in convective heat transfer.",
    accent: "red",
  },

  {
    id: "radiation",
    title: "Radiation",
    eyebrow: "HEAT TRANSFER",
    summary:
      "Radiation transfers thermal energy through electromagnetic emission.",
    terms: [
      "Radiation",
      "Thermal energy",
      "Surface",
      "Emission",
    ],
    takeaway:
      "Thermal radiation can transfer energy without direct physical contact between bodies.",
    accent: "red",
  },

  // =======================================================
  // FIRST LAW
  // =======================================================

  {
    id: "first-law",
    title: "First Law of Thermodynamics",
    eyebrow: "ENERGY BALANCE",
    summary:
      "The First Law provides the accounting framework for energy entering, leaving, and remaining within a system.",
    formula:
      "ΔE = Q − W",
    terms: [
      "Heat input",
      "Work output",
      "Stored energy",
      "Energy balance",
    ],
    takeaway:
      "The First Law connects heat transfer and work with the change in system energy.",
    accent: "red",
  },

  {
    id: "energy-balance",
    title: "Energy Balance",
    eyebrow: "FIRST LAW",
    summary:
      "Energy accounting compares the energy supplied to a system with the energy leaving it and the change in stored energy.",
    formula:
      "ΔE = Q − W",
    terms: [
      "Input",
      "Output",
      "Net energy",
      "ΔE",
    ],
    takeaway:
      "An energy ledger makes it possible to see where the supplied energy goes.",
    accent: "red",
  },

  {
    id: "rate-form",
    title: "First Law in Rate Form",
    eyebrow: "ENERGY RATE",
    summary:
      "The First Law can also be expressed in rate form when analyzing energy transfers as they occur over time.",
    terms: [
      "Rate",
      "Heat transfer rate",
      "Power",
      "Energy change",
    ],
    takeaway:
      "Rate form is useful when the engineering problem focuses on how quickly energy is transferred.",
    accent: "cyan",
  },

  // =======================================================
  // ROTATION & POWER
  // =======================================================

  {
    id: "torque",
    title: "Torque",
    eyebrow: "ROTATIONAL MECHANICS",
    summary:
      "Torque describes the turning effect responsible for rotational motion in shafts and other rotating components.",
    terms: [
      "Torque",
      "Shaft",
      "Rotation",
      "Turning effect",
    ],
    takeaway:
      "Torque is the rotational counterpart of force in many engineering systems.",
    accent: "cyan",
  },

  {
    id: "angular-velocity",
    title: "Angular Velocity",
    eyebrow: "ROTATION",
    summary:
      "Angular velocity describes how quickly an object rotates.",
    terms: [
      "Angular velocity",
      "Rotation",
      "rad/s",
      "Shaft",
    ],
    takeaway:
      "The faster the rotating shaft turns, the greater its angular velocity.",
    accent: "cyan",
  },

  {
    id: "rotational-power",
    title: "Rotational Power",
    eyebrow: "POWER",
    summary:
      "Rotational systems connect torque and angular velocity to mechanical power.",
    formula:
      "P = τω",
    terms: [
      "Power",
      "Torque",
      "Angular velocity",
      "Shaft",
    ],
    takeaway:
      "Power in a rotating shaft depends on both the applied torque and its angular velocity.",
    accent: "cyan",
  },

  {
    id: "power",
    title: "Power",
    eyebrow: "RATE",
    summary:
      "Power describes how quickly work or energy transfer occurs.",
    terms: [
      "Energy",
      "Work",
      "Time",
      "Rate",
    ],
    takeaway:
      "Power tells us how fast energy is being transferred, not simply how much total energy is involved.",
    accent: "cyan",
  },

  // =======================================================
  // HYBRID ENERGY
  // =======================================================

  {
    id: "energy-conversion",
    title: "Energy Conversion",
    eyebrow: "CONVERSION",
    summary:
      "Engineering systems can convert energy between different forms while maintaining an overall energy balance.",
    terms: [
      "Mechanical energy",
      "Electrical energy",
      "Thermal energy",
      "Conversion",
    ],
    takeaway:
      "A hybrid vehicle can be understood as a chain of connected energy conversions.",
    accent: "cyan",
  },

  {
    id: "efficiency",
    title: "Efficiency",
    eyebrow: "PERFORMANCE",
    summary:
      "Efficiency describes the relationship between useful output and the energy supplied to a system.",
    formula:
      "η = Useful output / Input",
    terms: [
      "Input",
      "Useful output",
      "Loss",
      "Efficiency",
    ],
    takeaway:
      "Efficiency shows how much of the supplied energy becomes useful output.",
    accent: "red",
  },

  {
    id: "hybrid-flow",
    title: "Hybrid Energy Flow",
    eyebrow: "VEHICLE SYSTEM",
    summary:
      "The hybrid vehicle connects mechanical and electrical components so energy can move through several conversion stages.",
    formula:
      "Engine → Generator → Inverter → Motor → Wheel",
    terms: [
      "Engine",
      "Generator",
      "Inverter",
      "Motor",
      "Wheel",
    ],
    takeaway:
      "Following the energy path makes the role of each hybrid component easier to understand.",
    accent: "cyan",
  },

  {
    id: "regenerative",
    title: "Regenerative Braking",
    eyebrow: "ENERGY RECOVERY",
    summary:
      "During regenerative braking, part of the vehicle's kinetic energy is redirected through the drivetrain toward electrical energy storage.",
    formula:
      "Wheel → Generator → Battery",
    terms: [
      "Kinetic energy",
      "Generator",
      "Electrical energy",
      "Battery",
    ],
    takeaway:
      "Regenerative braking turns part of the vehicle's motion into recovered electrical energy.",
    accent: "red",
  },

  {
    id: "battery-energy",
    title: "Battery Energy",
    eyebrow: "ENERGY STORAGE",
    summary:
      "The battery acts as an energy storage element within the hybrid energy system.",
    terms: [
      "Battery",
      "Stored energy",
      "Electrical energy",
      "Recovery",
    ],
    takeaway:
      "Recovered or supplied electrical energy can be represented as energy stored in the battery.",
    accent: "cyan",
  },

  // =======================================================
  // CYCLES / PERFORMANCE
  // =======================================================

  {
    id: "power-cycle",
    title: "Power Cycle",
    eyebrow: "THERMODYNAMIC CYCLE",
    summary:
      "A power cycle uses a sequence of thermodynamic processes to convert energy into useful work.",
    terms: [
      "Cycle",
      "Heat input",
      "Work output",
      "Efficiency",
    ],
    takeaway:
      "The key engineering question is how effectively energy supplied to the cycle becomes useful work.",
    accent: "cyan",
  },

  {
    id: "refrigeration-cycle",
    title: "Refrigeration",
    eyebrow: "THERMODYNAMIC CYCLE",
    summary:
      "A refrigeration cycle uses work input to move thermal energy from a lower-temperature region toward a higher-temperature region.",
    terms: [
      "Refrigeration",
      "Heat removal",
      "Work input",
      "Cycle",
    ],
    takeaway:
      "Refrigeration focuses on removing heat from the region that needs to be cooled.",
    accent: "red",
  },

  {
    id: "heat-pump",
    title: "Heat Pump",
    eyebrow: "THERMODYNAMIC CYCLE",
    summary:
      "A heat pump uses work input to transfer thermal energy toward the region where heating is desired.",
    terms: [
      "Heat pump",
      "Heat transfer",
      "Work input",
      "Cycle",
    ],
    takeaway:
      "A heat pump emphasizes useful heat delivered to the desired destination.",
    accent: "red",
  },

  {
    id: "thermal-efficiency",
    title: "Thermal Efficiency",
    eyebrow: "CYCLE PERFORMANCE",
    summary:
      "Thermal efficiency compares the useful work produced by a power cycle with the energy supplied to it.",
    terms: [
      "Thermal efficiency",
      "Heat input",
      "Work output",
      "Cycle",
    ],
    takeaway:
      "Efficiency provides a common engineering language for comparing how effectively a cycle uses its energy input.",
    accent: "red",
  },

  {
    id: "cop",
    title: "Coefficient of Performance",
    eyebrow: "CYCLE PERFORMANCE",
    summary:
      "The coefficient of performance describes the performance of refrigeration and heat-pump systems.",
    terms: [
      "COP",
      "Refrigeration",
      "Heat pump",
      "Work input",
    ],
    takeaway:
      "COP focuses on the desired thermal effect relative to the required work input.",
    accent: "red",
  },

  // =======================================================
  // VEHICLE ENERGY INPUT
  // =======================================================

  {
    id: "fuel-energy-input",
    title: "Fuel & Energy Input",
    eyebrow: "ENERGY INPUT",
    summary:
      "Vehicle energy analysis begins by identifying where the supplied energy comes from and how that input enters the system.",
    terms: [
      "Fuel",
      "Energy input",
      "Chemical energy",
      "Conversion",
    ],
    takeaway:
      "Understanding the energy source is the first step in following the complete vehicle energy path.",
    accent: "red",
  },
];

/**
 * =========================================================
 * SCENE CONTEXT
 * =========================================================
 *
 * The first topics in each context are intentionally
 * recommended because they are the most relevant to the
 * current scene.
 */

export const FOUNDATION_SCENE_CONTEXT: Record<
  string,
  FoundationSceneContext
> = {
  "01": {
    recommendedTopics: [
      "kinetic-energy",
      "energy",
      "power",
    ],
    contextTitle:
      "Why motion carries energy",
    contextDescription:
      "This scene introduces the relationship between vehicle motion and kinetic energy.",
  },

  "02": {
    recommendedTopics: [
      "potential-energy",
      "energy",
      "state-process",
    ],
    contextTitle:
      "Why position stores energy",
    contextDescription:
      "This scene uses vehicle elevation to introduce gravitational potential energy.",
  },

  "03": {
    recommendedTopics: [
      "system",
      "boundary-surroundings",
      "work",
      "boundary-work",
      "state-process",
    ],
    contextTitle:
      "Why a piston can transfer energy",
    contextDescription:
      "The piston-cylinder provides a clear physical boundary where pressure and volume change are connected with work.",
  },

  "04": {
    recommendedTopics: [
      "pressure",
      "boundary-work",
      "pv-area",
      "state-process",
      "polytropic-process",
    ],
    contextTitle:
      "Reading a P–V process",
    contextDescription:
      "The P–V diagram connects pressure, volume change, process path, and boundary work.",
  },

  "05": {
    recommendedTopics: [
      "torque",
      "angular-velocity",
      "rotational-power",
      "power",
    ],
    contextTitle:
      "From rotation to power",
    contextDescription:
      "Rotating shafts connect torque and angular velocity with mechanical power.",
  },

  "06": {
    recommendedTopics: [
      "heat",
      "internal-energy",
      "temperature",
      "conduction",
      "convection",
      "radiation",
    ],
    contextTitle:
      "Where thermal energy moves",
    contextDescription:
      "This scene connects heat transfer with changes in internal energy.",
  },

  "07": {
    recommendedTopics: [
      "first-law",
      "energy-balance",
      "energy",
      "heat",
      "work",
      "internal-energy",
    ],
    contextTitle:
      "Balancing the energy ledger",
    contextDescription:
      "The First Law connects heat transfer, work, and changes in system energy.",
  },

  "08": {
    recommendedTopics: [
      "energy-conversion",
      "hybrid-flow",
      "efficiency",
      "power",
    ],
    contextTitle:
      "Following energy through the vehicle",
    contextDescription:
      "The hybrid system connects several energy conversion stages from engine output to vehicle motion.",
  },

  "09": {
    recommendedTopics: [
      "thermodynamic-cycle",
      "energy",
      "efficiency",
      "power-cycle",
      "thermal-efficiency",
    ],
    contextTitle:
      "Thinking in cycles",
    contextDescription:
      "This context introduces repeated thermodynamic processes and how cycle performance is evaluated.",
  },

  "10": {
    recommendedTopics: [
      "energy",
      "energy-conversion",
      "efficiency",
      "hybrid-flow",
      "regenerative",
      "battery-energy",
      "fuel-energy-input",
    ],
    contextTitle:
      "Thinking like a vehicle energy engineer",
    contextDescription:
      "This lab combines energy input, conversion, vehicle response, efficiency, and energy recovery.",
  },
};

export function getFoundationTopicsForScene(
  sceneNumber: string,
): FoundationTopic[] {
  const context =
    FOUNDATION_SCENE_CONTEXT[
      sceneNumber
    ];

  if (!context) {
    return FOUNDATION_TOPICS;
  }

  const recommended =
    context.recommendedTopics
      .map((topicId) =>
        FOUNDATION_TOPICS.find(
          (topic) =>
            topic.id ===
            topicId,
        ),
      )
      .filter(
        (
          topic,
        ): topic is FoundationTopic =>
          Boolean(topic),
      );

  const recommendedIds =
    new Set(
      context.recommendedTopics,
    );

  const remaining =
    FOUNDATION_TOPICS.filter(
      (topic) =>
        !recommendedIds.has(
          topic.id,
        ),
    );

  return [
    ...recommended,
    ...remaining,
  ];
}

export function getFoundationContext(
  sceneNumber: string,
): FoundationSceneContext {
  return (
    FOUNDATION_SCENE_CONTEXT[
      sceneNumber
    ] ?? {
      recommendedTopics: [],
      contextTitle:
        "Thermodynamic Foundation",
      contextDescription:
        "Review the fundamental concepts used throughout the VELOTHERM simulations.",
    }
  );
}