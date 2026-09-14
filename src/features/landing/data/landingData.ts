export type LandingModule = {
  number: string;
  title: string;
  description: string;
  tags: {
    label: string;
    icon: string;
  }[];
  href: string;
  pdfHref: string;
  simulationLabel: string;
  materialLabel: string;
};

export type LandingStat = {
  value: string;
  label: string;
  description: string;
};

export const landingModules: LandingModule[] = [
  {
    number: "01",
    title: "Thermodynamics Fundamentals",
    description:
      "Explore the foundations of thermodynamic systems, properties, state, process, pressure, temperature, energy, and system boundaries.",
    tags: [
      {
        label: "System & Boundary",
        icon: "◫",
      },
      {
        label: "T(K) & Pabs",
        icon: "◌",
      },
    ],
    href: "/module/1",
    pdfHref: "/pdf/modul-01.pdf",
    simulationLabel: "Open Interactive Lab",
    materialLabel: "View Module",
  },
  {
    number: "02",
    title: "Energy, Work & The First Law",
    description:
      "Study kinetic, potential, and internal energy, boundary work, p-V processes, heat transfer, and the First Law of Thermodynamics.",
    tags: [
      {
        label: "W = ∫ p dV",
        icon: "⌁",
      },
      {
        label: "ΔE = Q − W",
        icon: "◈",
      },
    ],
    href: "/module/2",
    pdfHref: "/pdf/modul-02.pdf",
    simulationLabel: "Open Interactive Lab",
    materialLabel: "View Module",
  },
  {
    number: "03",
    title: "Thermodynamic Cycles & Hybrid",
    description:
      "Explore thermodynamic cycles, efficiency, regenerative braking, hybrid energy conversion, and vehicle engineering applications.",
    tags: [
      {
        label: "ΔEcycle = 0",
        icon: "↻",
      },
      {
        label: "Regenerative Braking",
        icon: "⌁",
      },
    ],
    href: "/module/3",
    pdfHref: "/pdf/modul-03.pdf",
    simulationLabel: "Open Interactive Lab",
    materialLabel: "View Module",
  },
];

export const landingStats: LandingStat[] = [
  {
    value: "01",
    label: "Shared Vehicle Model",
    description: "Interactive 3D engineering model",
  },
  {
    value: "03",
    label: "Modul Inti Kuliah",
    description: "Sistem, Hukum I, & Hybrid",
  },
  {
    value: "10",
    label: "Interactive Scenes",
    description: "Simulasi berbasis web dengan kendali parameter",
  },
  {
    value: "AR",
    label: "Spatial Visualization",
    description: "Visualisasi 3D interaktif berbasis web",
  },
];