import type { ComponentType } from "react";
import {
  BatteryCharging,
  Bolt,
  Box,
  RotateCcw,
  Scale,
  Thermometer,
} from "lucide-react";

export type LandingModule = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  laboratoryHref: string;
  laboratoryLabel: string;
  pdfHref: string;
  Icon: ComponentType<{ className?: string }>;
};

export type LandingStat = {
  value: string;
  label: string;
  description: string;
};

export const landingModules: LandingModule[] = [
  {
    number: "01",
    title: "Fondasi Termodinamika Teknik",
    description:
      "Membahas paradigma makroskopis vs mikroskopis, batas sistem (tertutup, terisolasi, volume atur), matriks properti ekstensif vs intensif, serta skala temperatur mutlak.",
    tags: ["Sistem & Boundary", "T(K) & P_abs"],
    href: "/materi/1",
    laboratoryHref: "/module/1",
    laboratoryLabel: "Buka Laboratorium Visual Interaktif",
    pdfHref: "/pdf/modul-1.pdf",
    Icon: Box,
  },
  {
    number: "02",
    title: "Energi, Kerja & Hukum I",
    description:
      "Mempelajari spektrum energi kinetik, potensial, dan internal (U), perumusan kerja batas silinder (∫ p dV), 3 persamaan proses politropik, dan neraca energi sistem.",
    tags: ["W = ∫ p dV", "ΔE = Q - W"],
    href: "/materi/2",
    laboratoryHref: "/module/2",
    laboratoryLabel: "Buka Laboratorium Visual Interaktif",
    pdfHref: "/pdf/modul-2.pdf",
    Icon: Bolt,
  },
  {
    number: "03",
    title: "Siklus & Teknologi Hybrid",
    description:
      "Analisis siklus daya berulang, efisiensi termal (η), dan penerapan rem regeneratif otomotif dalam membalik batas termal untuk memanen energi kinetik ke baterai.",
    tags: ["ΔE_siklus = 0", "Rem Regeneratif"],
    href: "/materi/3",
    laboratoryHref: "/module/3",
    laboratoryLabel: "Buka Laboratorium Visual Interaktif",
    pdfHref: "/pdf/modul-3.pdf",
    Icon: BatteryCharging,
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

export const moduleTechnicalIcons = {
  system: Box,
  energy: Bolt,
  cycle: RotateCcw,
  pressure: Scale,
  temperature: Thermometer,
};