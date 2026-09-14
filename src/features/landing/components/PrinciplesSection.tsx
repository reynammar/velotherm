import Image from "next/image";
import { FaAtom, FaCheck } from "react-icons/fa6";

const principlesImage =
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=85";

const principles = [
  {
    title: "Pendekatan Makroskopis Klasik",
    description: (
      <>
        Menganalisis sistem agregat materi secara makro (
        <span className="font-formula text-slate-700">T, P, V</span>
        ) tanpa perlu melacak dinamika statistik triliunan molekul individual.
      </>
    ),
  },
  {
    title: "Hukum I: Neraca Energi & Kerja Batas",
    description: (
      <>
        Kekekalan energi sistem tertutup: perubahan energi internal didorong
        oleh selisih kalor masuk dan kerja ekspansi batas piston (
        <span className="font-formula font-semibold text-slate-700">
          ΔE = Q - W
        </span>
        ).
      </>
    ),
  },
  {
    title: "Siklus Tertutup & Konservasi Hybrid",
    description: (
      <>
        Penerapan siklus daya periodik (
        <span className="font-formula font-semibold text-slate-700">
          ΔE<sub>siklus</sub> = 0
        </span>
        ) dan pemulihan energi kinetik melalui sistem pengereman regeneratif.
      </>
    ),
  },
];

export function PrinciplesSection() {
  return (
    <section
      id="principles"
      className="relative border-b border-slate-200 bg-[color:var(--color-brand-bg)] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-6">
            {/* Section Badge */}
            <div
              className="inline-flex items-center gap-2 bg-slate-200/90 px-3.5 py-1.5 font-tech text-xs font-bold uppercase tracking-wider text-slate-800"
              style={{
                clipPath: "var(--clip-chamfer-sm)",
              }}
            >
              <FaAtom className="text-[color:var(--color-brand-red)]" />
              <span>Fondasi Sains Otomotif</span>
            </div>

            {/* Heading */}
            <h2 className="font-racing text-3xl font-bold uppercase leading-[1.05] tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-5xl">
              Prinsip Termodinamika{" "}
              <span className="text-[color:var(--color-brand-red)]">
                Mesin &amp; Powertrain
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-2xl font-body text-base leading-relaxed text-slate-600">
              Termodinamika teknik mempelajari transformasi energi antara kalor
              dan kerja mekanis. Dalam dunia otomotif modern, pemahaman ini
              melandasi efisiensi ruang bakar mesin bensin &amp; diesel hingga
              konservasi energi pengereman kendaraan hybrid.
            </p>

            {/* Principle Cards */}
            <div className="space-y-3.5 pt-2">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="group flex items-start gap-4 border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-200 hover:border-[color:var(--color-brand-red)]/50"
                  style={{
                    clipPath: "var(--clip-chamfer-lg)",
                  }}
                >
                  <div
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center bg-red-100 text-[color:var(--color-brand-red)]"
                    style={{
                      clipPath: "var(--clip-chamfer-sm)",
                    }}
                  >
                    <FaCheck className="text-xs" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-body text-sm font-bold uppercase text-[color:var(--color-brand-charcoal)]">
                      {principle.title}
                    </h3>

                    <p className="mt-1 font-body text-xs leading-relaxed text-slate-500">
                      {principle.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div
                className="relative overflow-hidden border-2 border-slate-200 bg-white shadow-[var(--shadow-card)]"
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                }}
              >
                <div className="relative h-80 w-full sm:h-96">
                  <Image
                    src={principlesImage}
                    alt="Detail mesin otomotif dan sistem powertrain"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--color-brand-charcoal)]/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}