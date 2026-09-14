import Image from "next/image";
import Link from "next/link";
import { FaArrowDown, FaCircle } from "react-icons/fa6";

const heroImage =
  "https://images.unsplash.com/photo-1680724021598-29a1e588085f?auto=format&fit=crop&w=1200&q=85";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-slate-200 bg-white py-16 md:py-24 lg:py-28"
      style={{
        background:
          "radial-gradient(circle at 85% 20%, rgba(220, 38, 38, 0.08) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(225, 29, 72, 0.05) 0%, transparent 45%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-8 select-none font-formula text-8xl font-black leading-none text-slate-900 opacity-[0.04] md:text-[200px]"
      >
        THERMO
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Hero Content */}
          <div className="space-y-7 text-left lg:col-span-7">
            <h1 className="font-racing text-4xl font-bold uppercase leading-[1.05] tracking-tight text-[color:var(--color-brand-charcoal)] sm:text-6xl xl:text-7xl">
              Konversi Kalor Jadi{" "}
              <span className="bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-orange-600 bg-clip-text text-transparent">
                Tenaga Mekanik
              </span>
            </h1>

            <p className="max-w-2xl font-body text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
              Cetak biru analisis termodinamika teknik otomotif:
              definisikan batas sistem tertutup vs terbuka, hitung kerja
              batas kurva{" "}
              <span className="font-formula font-bold text-slate-800">
                W = ∫ p dV
              </span>
              , dan bongkar mekanisme pembalikan energi pengereman
              regeneratif pada powertrain hybrid.
            </p>

            {/* CTA */}
            <div className="pt-1">
              <Link
                href="#modules"
                className="group inline-flex w-full items-center justify-center gap-3 bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-red-600 px-8 py-4 font-tech text-sm font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all duration-300 hover:brightness-110 active:scale-[0.98] sm:w-auto sm:text-base"
                style={{
                  clipPath: "var(--clip-chamfer-md)",
                }}
              >
                <span>Mulai Belajar dan Eksperimen AR mu</span>

                <FaArrowDown className="text-xs transition-transform duration-300 group-hover:translate-y-1" />
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-4">
              <div className="min-w-0">
                <span className="block whitespace-nowrap font-racing text-2xl font-bold text-[color:var(--color-brand-charcoal)] sm:text-3xl">
                  ΔE = Q - W
                </span>

                <span className="block whitespace-nowrap font-body text-[11px] text-slate-500 sm:text-xs">
                  Hukum I Neraca Energi
                </span>
              </div>

              <div className="min-w-0">
                <span className="block whitespace-nowrap font-racing text-2xl font-bold text-[color:var(--color-brand-red)] sm:text-3xl">
                  W = ∫ p dV
                </span>

                <span className="block whitespace-nowrap font-body text-[11px] text-slate-500 sm:text-xs">
                  Kerja Batas (Boundary)
                </span>
              </div>

              <div className="min-w-0">
                <span className="block whitespace-nowrap font-racing text-2xl font-bold text-[color:var(--color-brand-charcoal)] sm:text-3xl">
                  ΔKE → ΔU
                </span>

                <span className="block whitespace-nowrap font-body text-[11px] text-slate-500 sm:text-xs">
                  Rem Regeneratif Hybrid
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-red-500/15 via-orange-500/10 to-transparent blur-2xl" />

              <div
                className="group relative overflow-hidden border-2 border-slate-300 bg-[color:var(--color-brand-charcoal)] shadow-[var(--shadow-card-hover)]"
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={heroImage}
                    alt="Close-up mesin balap dan komponen powertrain otomotif"
                    fill
                    priority
                    sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, 100vw"
                    className="object-cover brightness-95 transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-brand-charcoal)] via-transparent to-transparent opacity-80" />

                  {/* Technical HUD */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 font-formula text-xs font-bold text-white">
                      <span className="relative flex size-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-brand-red)] opacity-75" />
                        <FaCircle className="relative size-2 text-[color:var(--color-brand-red)]" />
                      </span>

                      Internal Combustion Chamber
                    </span>

                    <span className="whitespace-nowrap font-formula text-xs text-slate-400">
                      Scale 1:1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}