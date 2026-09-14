import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModuleReader } from "@/src/features/landing/module/components/ModuleReader";
import { moduleData } from "@/src/features/landing/module/data/moduleData";
type ModulePageProps = {
  params: Promise<{
    moduleId: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(moduleData).map((moduleId) => ({
    moduleId,
  }));
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const currentModule = moduleData[moduleId];

  if (!currentModule) {
    return {
      title: "Materi Tidak Ditemukan | VeloTherm",
    };
  }

  return {
    title: `${currentModule.title} | VeloTherm`,
    description: currentModule.description,
  };
}

export default async function ModulePage({
  params,
}: ModulePageProps) {
  const { moduleId } = await params;
  const currentModule = moduleData[moduleId];

  if (!currentModule) {
    notFound();
  }

  return <ModuleReader module={currentModule} />;
}