import Link from "next/link";
import {
  ArrowRight,
  Bolt,
  Flag,
  ListChecks,
  Trophy,
} from "lucide-react";

const quizFeatures = [
  {
    title: "Struktur Soal Terstandar",
    description:
      "Pilihan ganda dengan tingkat kesulitan seimbang sesuai slide perkuliahan.",
    icon: <ListChecks className="size-4" />,
  },
  {
    title: "Feedback & Penjelasan",
    description:
      "Penjelasan ilmiah instan atas setiap kunci jawaban benar.",
    icon: <Bolt className="size-4" />,
  },
  {
    title: "Kalkulasi Skor Akhir",
    description:
      "Skor nilai skala 0-100 disertai evaluasi tingkat pemahaman materi.",
    icon: <Trophy className="size-4" />,
  },
];

export function QuizCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0d121d] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(#1e293b 0.75px, transparent 0.75px), radial-gradient(#1e293b 0.75px, #0d121d 0.75px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div
          className="relative overflow-hidden border-2 border-slate-700 bg-gradient-to-b from-slate-900/95 to-[color:var(--color-brand-charcoal)]/95 p-6 text-center shadow-2xl sm:p-10 lg:p-14"
          style={{
            clipPath: "var(--clip-chamfer-lg)",
          }}
        >
          {/* Accent Line */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[color:var(--color-brand-red)] via-[color:var(--color-brand-crimson)] to-amber-500" />

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 border border-[color:var(--color-brand-red)]/40 bg-red-950/70 px-4 py-1.5 font-tech text-[10px] font-bold uppercase tracking-wider text-red-300"
            style={{
              clipPath: "var(--clip-chamfer-sm)",
            }}
          >
            <Flag className="size-3.5 text-[color:var(--color-brand-red)]" />
            Kuis Pemahaman Evaluasi
          </div>

          {/* Heading */}
          <h2 className="mx-auto mt-5 max-w-3xl font-racing text-3xl font-bold uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Uji Pemahaman{" "}
            <span className="text-[color:var(--color-brand-red)]">
              Termodinamika
            </span>{" "}
            Kamu
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-relaxed text-slate-300 sm:text-base">
            Tantang diri Anda dengan butir soal evaluasi terstruktur: batasan
            sistem tertutup vs terbuka, perhitungan kerja batas kurva p-V,
            hingga prinsip termodinamika pengereman regeneratif hybrid.
          </p>

          {/* Features */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {quizFeatures.map((feature) => (
              <div
                key={feature.title}
                className="border border-slate-700/80 bg-slate-800/60 p-4"
                style={{
                  clipPath: "var(--clip-chamfer-lg)",
                }}
              >
                <div
                  className="mb-3 flex size-8 items-center justify-center bg-red-900/50 text-[color:var(--color-brand-red)]"
                  style={{
                    clipPath: "var(--clip-chamfer-sm)",
                  }}
                >
                  {feature.icon}
                </div>

                <h3 className="font-tech text-xs font-bold uppercase text-white">
                  {feature.title}
                </h3>

                <p className="mt-1 font-body text-[11px] leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[color:var(--color-brand-red)] to-[color:var(--color-brand-crimson)] px-8 py-4 font-tech text-xs font-bold uppercase tracking-wider text-white shadow-[var(--shadow-glow-red)] transition-all hover:brightness-110 active:scale-[0.99]"
              style={{
                clipPath: "var(--clip-chamfer-md)",
              }}
            >
              <span>Masuk ke Halaman Kuis</span>

              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}