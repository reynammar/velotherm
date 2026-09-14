import { landingStats } from "../data/landingData";

export function StatsSection() {
  const stats = landingStats.map((stat, index) => {
    if (index === 0) {
      return {
        ...stat,
        value: "1.2K+",
        label: "Peserta Belajar",
        description: "Mahasiswa Mesin & Teknisi",
      };
    }

    return stat;
  });

  return (
    <section className="overflow-hidden border-b border-slate-800 bg-[color:var(--color-brand-charcoal)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-slate-800">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${
                index >= 2
                  ? "border-t border-slate-800 pt-8 lg:border-t-0 lg:pt-0"
                  : ""
              }`}
            >
              <div className="font-racing text-5xl font-bold tracking-tight text-[color:var(--color-brand-red)] sm:text-6xl">
                {stat.value}
              </div>

              <div className="mt-2 font-tech text-xs font-bold uppercase tracking-wider text-slate-200 sm:text-sm">
                {stat.label}
              </div>

              <div className="mx-auto mt-1 max-w-[11rem] font-body text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}