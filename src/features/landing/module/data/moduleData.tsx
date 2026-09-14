import type { ReactNode } from "react";

export type ModuleData = {
  number: string;
  badge: string;
  title: string;
  description: string;
  pdfHref: string;
  laboratoryHref: string;
  arLink: string;
  content: ReactNode;
};

export const moduleData: Record<string, ModuleData> = {
  "1": {
    number: "01",
    badge: "MODUL 01 // CETAK BIRU SISTEM, PROPERTI & ENERGI",
    title: "Fondasi Termodinamika Teknik",
    description:
      "Fondasi sistem, boundary, properti termodinamika, tekanan absolut, dan temperatur mutlak.",
    pdfHref: "/pdf/modul-1.pdf",
    laboratoryHref: "/module/1",
    arLink:
      "https://sketchfab.com/3d-models/combustion-engine-working-animation-3665bc7e7b784a0d9b4b043aeafc21fb",
    content: (
      <>
        <ModuleSection
          section="SUB-BAGIAN 1.0"
          meta="PARADIGMA ANALISIS"
          title="Pandangan Makroskopis vs Mikroskopis"
          tone="panel"
        >
          <p className="text-sm leading-relaxed text-slate-600">
            Termodinamika teknik menitikberatkan pada perilaku zat berskala
            teknik yang dapat diukur secara langsung di laboratorium maupun
            bengkel dyno:
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <InfoCard
              title="Lensa Mikroskopis (Pendekatan Statistik)"
              icon="microscope"
            >
              Meninjau posisi dan kecepatan partikel individual
              atom/molekul. Sangat kompleks, memerlukan kalkulasi statistik
              probabilitas, dan umumnya bersifat teoretis murni.
            </InfoCard>

            <InfoCard
              title="Lensa Makroskopis (Pendekatan Klasik Insinyur)"
              icon="gauge"
              accent
            >
              Mengukur properti agregat materi secara nyata tanpa kerumitan
              sub-atomik. Contoh terukur:{" "}
              <Formula>T = 300 K</Formula>,{" "}
              <Formula>P = 1 atm</Formula>. Pendekatan praktis, deterministik,
              dan standar baku analisis mesin otomotif.
            </InfoCard>
          </div>
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 2.0 // ANATOMI SISTEM & BATAS (BOUNDARY)"
          title="Klasifikasi 3 Jenis Batas Sistem"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <SystemCard
              title="Sistem Tertutup"
              border="red"
              rows={[
                ["Massa", "DITOLAK", false],
                ["Energi", "DIIZINKAN", true],
              ]}
              description={
                <>
                  Massa fluida kerja tidak dapat melintasi batas sistem, namun
                  energi bebas berpindah dalam bentuk kalor (<Formula>Q</Formula>)
                  dan kerja gerak piston (<Formula>W</Formula>).
                </>
              }
              example="Contoh: Gas di dalam silinder piston saat kompresi & pembakaran."
            />

            <SystemCard
              title="Sistem Terisolasi"
              border="slate"
              rows={[
                ["Massa", "DITOLAK", false],
                ["Energi", "DITOLAK", false],
              ]}
              description="Sistem tidak memiliki interaksi apapun dengan lingkungan luar. Tidak ada perpindahan massa maupun kalor atau kerja mekanik yang melintasi batas."
              example="Contoh: Termos vakum ideal teoretis."
            />

            <SystemCard
              title="Volume Atur (Terbuka)"
              border="slate"
              rows={[
                ["Massa", "DIIZINKAN", true],
                ["Energi", "DIIZINKAN", true],
              ]}
              description="Wilayah ruang geometris tertentu yang dilingkupi permukaan atur (control surface). Massa fluida udara/bahan bakar dan energi bebas melintas secara kontinu."
              example="Contoh: Turbin angin, kompresor turbo, manifold intake mesin."
            />
          </div>

          <div className="flex items-center gap-2 border-l-4 border-[color:var(--color-brand-red)] bg-red-50 p-3.5 font-formula text-xs text-red-900">
            <span className="font-bold text-[color:var(--color-brand-red)]">
              !
            </span>
            <span>
              CATATAN TEKNIS: Interaksi energi & massa HANYA terjadi melintasi
              batas (boundary) sistem.
            </span>
          </div>
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 3.0"
          meta="PROPERTI & FORMULA"
          title="Kondisi, Perubahan & Matriks Properti"
          tone="panel"
        >
          <p className="text-xs text-slate-600">
            Hirarki Konseptual:{" "}
            <strong className="text-slate-800">
              Properti → Keadaan (State) → Proses → Siklus Termodinamika
            </strong>{" "}
            (berakhir pada keadaan awal yang sama).
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard title="Sifat Ekstensif">
              Bergantung langsung pada ukuran atau massa total sistem. Bersifat
              aditif saat dua sistem digabungkan.
              <div className="mt-2 font-formula text-xs font-bold text-[color:var(--color-brand-red)]">
                Contoh: Massa (m), Volume Total (V)
              </div>
            </InfoCard>

            <InfoCard title="Sifat Intensif">
              Independen dari ukuran atau massa sistem. Nilainya seragam di
              setiap titik dalam sistem yang berada dalam keseimbangan.
              <div className="mt-2 font-formula text-xs font-bold text-[color:var(--color-brand-red)]">
                Contoh: Temperatur (T), Tekanan (P)
              </div>
            </InfoCard>
          </div>

          <FormulaPanel
            label="FORMULA VOLUME SPESIFIK"
            formula="v = V / m"
            description="Membagi dua properti ekstensif (Volume total dibagi Massa total) menghasilkan properti intensif baru!"
          />
        </ModuleSection>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ModuleSection
            section="SUB-BAGIAN 4.1"
            title="Hubungan Tekanan"
            className="h-full"
          >
            <FormulaPanel
              label="TEKANAN ABSOLUT"
              formula="Pabsolut = Patm + Pgage"
            />
            <p className="text-xs leading-relaxed text-slate-600">
              Termodinamika selalu beroperasi dengan{" "}
              <strong>Tekanan Absolut</strong>, yaitu tekanan relatif terhadap
              ruang hampa mutlak, bukan sekadar pembacaan jarum pressure gage.
            </p>
          </ModuleSection>

          <ModuleSection
            section="SUB-BAGIAN 4.2"
            title="Hukum Ke-Nol & Suhu"
            className="h-full"
          >
            <FormulaPanel
              label="TEMPERATUR MUTLAK"
              formula="T(K) = T(°C) + 273.15"
            />
            <p className="text-xs leading-relaxed text-slate-600">
              Suhu adalah properti penentu keseimbangan termal antara dua benda
              yang saling kontak. Seluruh formula termodinamika gas wajib
              menggunakan satuan mutlak Kelvin.
            </p>
          </ModuleSection>
        </div>

        <ModuleSection
          section="SUB-BAGIAN 5.0 // MANIFESTO INSINYUR (3 GOLDEN RULES)"
          title="Tiga Aturan Emas Termodinamika"
          dark
        >
          <div className="grid grid-cols-1 gap-4 font-body text-xs md:grid-cols-3">
            <DarkRule
              title="RULE 01: Batas adalah Raja"
              description="Tanpa batas yang jelas, interaksi kerja mekanik dan perpindahan panas tidak akan pernah bisa dihitung secara terukur."
            />
            <DarkRule
              title="RULE 02: Properti = Destinasi"
              description="Perubahan properti adalah diferensial eksak (point function). Nilainya hanya bergantung pada titik awal dan akhir, bukan jalurnya."
            />
            <DarkRule
              title="RULE 03: Kerja = Perjalanan"
              description="Kerja adalah diferensial tak-eksak (path function). Jumlah kerja yang dihasilkan bergantung penuh pada rute lintasan diagram p-V."
            />
          </div>
        </ModuleSection>
      </>
    ),
  },

  "2": {
    number: "02",
    badge: "MODUL 02 // ENERGY ACCOUNTING & BOUNDARY WORK",
    title: "Energi, Kerja & Hukum I Termodinamika",
    description:
      "Energi total, kerja batas, proses politropik, perpindahan kalor, dan neraca energi sistem tertutup.",
    pdfHref: "/pdf/modul-2.pdf",
    laboratoryHref: "/module/2",
    arLink:
      "https://sketchfab.com/3d-models/4-stroke-internal-combustion-engine-f75ae412d26f4f2c97486eecdbb88301",
    content: (
      <>
        <ModuleSection
          section="SUB-BAGIAN 1.0"
          meta="MEKANIKA KLASIK → TERMODINAMIKA"
          title="Evolusi Spektrum Energi"
          tone="panel"
        >
          <p className="text-sm leading-relaxed text-slate-600">
            Energi total sistem (<Formula>E</Formula>) merepresentasikan
            seluruh kontribusi energi makroskopis dan mikroskopis:
          </p>

          <div className="grid grid-cols-1 gap-4 font-formula text-xs md:grid-cols-2">
            <InfoCard title="Energi Makroskopis (Koordinat Luar)">
              <div className="space-y-1 font-bold text-[color:var(--color-brand-red)]">
                <div>KE = ½ m (v₂² - v₁²)</div>
                <div>PE = m g (z₂ - z₁)</div>
              </div>
              <p className="mt-1 font-body text-[11px] text-slate-500">
                Gerak translasi kendaraan dan elevasi posisi terhadap gravitasi
                bumi.
              </p>
            </InfoCard>

            <InfoCard title="Energi Mikroskopis (Internal Molekuler)">
              <div className="font-body text-sm font-bold text-[color:var(--color-brand-charcoal)]">
                U = Translasi + Rotasi + Vibrasi + Ikatan Kimia
              </div>
              <p className="mt-1 font-body text-[11px] text-slate-500">
                Aktivitas molekuler gas di dalam silinder serta energi kimiawi
                bahan bakar.
              </p>
            </InfoCard>
          </div>

          <FormulaPanel
            label="TOTAL ENERGI SISTEM TERTUTUP"
            formula="ΔE = ΔKE + ΔPE + ΔU"
          />
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 2.0"
          meta="BOUNDARY WORK INTEGRAL"
          title="Definisi Termodinamika Kerja & Kerja Batas"
          tone="panel"
        >
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Kerja (<Formula>W</Formula>) adalah transfer energi melintasi
            batas yang digerakkan oleh gaya makroskopis teramati, bukan
            perbedaan suhu. Kerja <strong>BUKAN properti</strong> sistem:
            <Formula>∫ δW = W</Formula>. Laju kerja dinamakan Daya (
            <Formula>Ẇ</Formula>).
          </p>

          <FormulaPanel
            label="FORMULA KERJA BATAS INTEGRAL (BOUNDARY WORK)"
            formula="W = ∫₁² p dV"
            description="Luas area di bawah kurva diagram p-V merepresentasikan besaran kerja mekanik yang dihasilkan dorongan piston."
            accent
          />

          <div className="border border-slate-300 bg-slate-100 p-4 text-xs leading-relaxed text-slate-600">
            <strong className="mb-1 block font-tech uppercase text-slate-800">
              Paradoks Proses Kuasi-Ekuilibrium:
            </strong>
            Merupakan pemodelan proses nyata yang sengaja diasumsikan
            menyimpang secara infinitesimal lambat agar tekanan fluida di
            seluruh titik ruang silinder tetap seragam di setiap momen.
          </div>
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 3.0 // PROSES POLITROPIK (p Vⁿ = constant)"
          title="3 Persamaan Kerja Proses Politropik"
        >
          <div className="grid grid-cols-1 gap-5 font-formula md:grid-cols-3">
            <InfoCard title="PANEL n ≠ 1 // UMUM" accent>
              <div className="mb-2 font-bold text-[color:var(--color-brand-charcoal)]">
                W = (p₂V₂ - p₁V₁) / (1 - n)
              </div>
              <p className="font-body text-xs text-slate-500">
                Berlaku untuk kompresi gas nyata dan proses isentropik di mana n
                = k (rasio kalor spesifik cp/cv).
              </p>
            </InfoCard>

            <InfoCard title="PANEL n = 1 // ISOTERMAL" accent>
              <div className="mb-2 font-bold text-[color:var(--color-brand-charcoal)]">
                W = p₁V₁ ln(V₂ / V₁)
              </div>
              <p className="font-body text-xs text-slate-500">
                Proses ekspansi/kompresi pada temperatur konstan untuk fluida
                gas ideal (pV = C).
              </p>
            </InfoCard>

            <InfoCard title="PANEL n = 0 // ISOBARIK" accent>
              <div className="mb-2 font-bold text-[color:var(--color-brand-charcoal)]">
                W = p (V₂ - V₁)
              </div>
              <p className="font-body text-xs text-slate-500">
                Tekanan sistem konstan sepanjang proses; kerja berbanding lurus
                dengan perubahan volume.
              </p>
            </InfoCard>
          </div>
        </ModuleSection>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ModuleSection
            section="SUB-BAGIAN 4.0"
            title="Perpindahan Kalor (Q) & 3 Modus"
            className="h-full"
          >
            <div className="space-y-3">
              <HeatMode
                title="KONDUKSI (HUKUM FOURIER)"
                formula="Q̇x = -k A (dT/dx)"
                description="Penjalaran panas melalui dinding blok silinder logam mesin."
              />

              <HeatMode
                title="KONVEKSI (HUKUM NEWTON)"
                formula="Q̇c = h A (Tb - Tf)"
                description="Pelepasan panas fluida pendingin di radiator ke udara hembusan fan."
              />

              <HeatMode
                title="RADIASI (STEFAN-BOLTZMANN)"
                formula="Q̇e = ε σ A Tb⁴"
                description="Pancaran gelombang foton dari nyala api pembakaran dan manifold knalpot."
              />
            </div>
          </ModuleSection>

          <ModuleSection
            section="SUB-BAGIAN 5.0"
            title="Neraca Energi Sistem Tertutup"
            className="h-full"
          >
            <FormulaPanel
              label="HUKUM I KESEIMBANGAN ENERGI"
              formula="ΔE = Q - W"
              description="dE/dt = Q̇ - Ẇ. Steady-State: dE/dt = 0 ⇒ Q̇ = Ẇ"
            />

            <div className="grid grid-cols-1 gap-2.5 font-formula text-xs sm:grid-cols-2">
              <SignCard
                value="+Q : Kalor Masuk"
                description="Sistem menyerap panas"
                positive
              />
              <SignCard
                value="-Q : Kalor Keluar"
                description="Panas terbuang ke luar"
              />
              <SignCard
                value="+W : Kerja Keluar"
                description="Kerja dilakukan sistem"
                positive
              />
              <SignCard
                value="-W : Kerja Masuk"
                description="Kerja diberikan pd sistem"
              />
            </div>
          </ModuleSection>
        </div>
      </>
    ),
  },

  "3": {
    number: "03",
    badge: "MODUL 03 // SIKLUS TERMAL & REGENERATIF HYBRID",
    title: "Siklus Termodinamika & Kendaraan Hybrid",
    description:
      "Siklus termodinamika, efisiensi, regenerative braking, aerodynamic drag, lightweighting, dan closed-loop hybrid.",
    pdfHref: "/pdf/modul-3.pdf",
    laboratoryHref: "/module/3",
    arLink:
      "https://sketchfab.com/3d-models/car-chassis-with-engine-and-transmission-c2a4173ea51543788796da5e408ec21f",
    content: (
      <>
        <ModuleSection
          section="SUB-BAGIAN 1.0"
          meta="ΔE_siklus = 0"
          title="Pengantar Siklus Termodinamika"
          tone="panel"
        >
          <p className="text-sm leading-relaxed text-slate-600">
            Siklus adalah serangkaian proses periodik yang berakhir pada
            keadaan awal yang persis sama. Karena energi adalah fungsi keadaan
            (<Formula>point function</Formula>), maka perubahan energi total
            siklus bernilai nol:
          </p>

          <FormulaPanel
            label="KONDISI SIKLUS"
            formula="ΔE_siklus = 0 ⇒ W_siklus = Q_siklus = Q_in - Q_out"
          />

          <div className="grid grid-cols-1 gap-4 pt-2 font-formula text-xs md:grid-cols-3">
            <InfoCard title="Efisiensi Termal Siklus Daya">
              <div className="text-base font-bold text-[color:var(--color-brand-red)]">
                η = W_cycle / Q_in
              </div>
              <p className="mt-1 font-body text-[11px] text-slate-500">
                = 1 - (Q_out / Q_in). Dibatasi oleh Hukum II Termodinamika.
              </p>
            </InfoCard>

            <InfoCard title="COP Refrigerasi (AC Mobil)">
              <div className="text-base font-bold text-[color:var(--color-brand-red)]">
                β = Q_in / W_cycle
              </div>
              <p className="mt-1 font-body text-[11px] text-slate-500">
                Koefisien performa penyerapan panas dari kabin kendaraan.
              </p>
            </InfoCard>

            <InfoCard title="COP Heat Pump">
              <div className="text-base font-bold text-[color:var(--color-brand-red)]">
                γ = Q_out / W_cycle
              </div>
              <p className="mt-1 font-body text-[11px] text-slate-500">
                Efisiensi pemanasan termal kabin atau baterai EV di cuaca
                dingin.
              </p>
            </InfoCard>
          </div>
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 2.0 // JEBAKAN ENERGI KINETIK & REGENERATIVE BRAKING"
          title="Rem Konvensional vs Rem Regeneratif Hybrid"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ComparisonCard
              title="Mesin Konvensional (Disipasi Panas)"
              badge="100% TERBUANG"
              tone="danger"
              formula="ΔKE → Q_out (Disipasi Gesekan Cakram)"
            >
              Ketika mobil 1.200 kg mengerem dari 100 km/jam, 100% energi
              kinetiknya diubah menjadi panas gesekan rem dan terbuang sia-sia
              ke udara atmosfer.
            </ComparisonCard>

            <ComparisonCard
              title="Powertrain Hybrid (Regenerative)"
              badge="KINETIC HARVESTING"
              tone="success"
              formula="ΔKE → Generator → ΔU_baterai"
            >
              Membalik batas termodinamika saat pengereman: motor bertindak
              sebagai generator yang memanen kinetik menjadi energi internal
              kimia baterai (<Formula>ΔU</Formula>) untuk akselerasi berikutnya.
            </ComparisonCard>
          </div>
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 3.0"
          meta="AERO & LIGHTWEIGHTING"
          title="Melawan Lingkungan & Efisiensi Desain"
          tone="panel"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoCard title="Gaya Hambat Aerodinamika (Aero Drag)">
              <div className="font-formula text-base font-bold text-[color:var(--color-brand-red)]">
                Fd = ½ Cd A ρ V²
              </div>
              <p className="mt-1 font-body text-xs leading-relaxed text-slate-500">
                Meminimalkan area frontal (A) dan koefisien hambat (Cd) secara
                kuadratik memangkas beban output kerja kontinu mesin pada
                kecepatan tinggi.
              </p>
            </InfoCard>

            <InfoCard title="Termodinamika Lightweighting">
              <p className="font-body text-xs leading-relaxed text-slate-600">
                Massa (<Formula>m</Formula>) adalah faktor pengali langsung
                pada <Formula>KE = ½ m v²</Formula> dan hambatan gulir roda
                (rolling resistance).
              </p>
              <p className="mt-2 font-body text-xs leading-relaxed text-slate-600">
                Penggunaan komposit serat karbon dan aluminium memangkas
                kebutuhan kerja mekanis akselerasi secara drastis.
              </p>
            </InfoCard>
          </div>
        </ModuleSection>

        <ModuleSection
          section="SUB-BAGIAN 4.0 // HYBRID CLOSED-LOOP LIFE-CYCLE"
          title="Siklus Aliran Energi Tertutup Powertrain Hybrid"
          dark
        >
          <div className="border border-slate-700 bg-slate-800 p-4 font-formula text-xs">
            <span className="block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              ALUR SIKLUS ENERGI
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 py-3 text-center font-bold text-white">
              {[
                "Gas Tank (Kimia)",
                "Engine (Work)",
                "Forward Motion (KE)",
                "Generator",
                "Battery (ΔU)",
                "Electric Motor",
              ].map((item, index, array) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="border border-slate-700 bg-slate-900 px-2.5 py-1">
                    {item}
                  </span>

                  {index < array.length - 1 ? <span>→</span> : null}
                </span>
              ))}
            </div>
          </div>

          <p className="font-body text-xs leading-relaxed text-slate-300">
            Dengan menutup siklus disipasi energi kinetik melalui rekuperasi
            baterai, efisiensi termal sistem melonjak dari 20-30% (mesin
            konvensional murni) menjadi optimal pada powertrain hybrid.
          </p>
        </ModuleSection>
      </>
    ),
  },
};

function ModuleSection({
  section,
  meta,
  title,
  tone = "plain",
  dark = false,
  className = "",
  children,
}: {
  section: string;
  meta?: string;
  title: string;
  tone?: "plain" | "panel";
  dark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (dark) {
    return (
      <section
        className={`space-y-4 bg-gradient-to-br from-slate-900 to-[color:var(--color-brand-charcoal)] p-6 text-white sm:p-8 ${className}`}
        style={{ clipPath: "var(--clip-chamfer-lg)" }}
      >
        <div className="flex items-center gap-2 font-tech text-xs font-bold uppercase text-amber-400">
          <span>◆</span>
          <span>{section}</span>
        </div>

        <h2 className="font-racing text-2xl font-bold uppercase">
          {title}
        </h2>

        {children}
      </section>
    );
  }

  return (
    <section
      className={[
        "space-y-4",
        tone === "panel"
          ? "border-2 border-slate-200 bg-slate-50 p-6 sm:p-8"
          : "",
        className,
      ].join(" ")}
      style={tone === "panel" ? { clipPath: "var(--clip-chamfer-lg)" } : undefined}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <span className="font-tech text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand-red)]">
          {section}
        </span>

        {meta ? (
          <span className="font-formula text-[11px] text-slate-500">
            {meta}
          </span>
        ) : null}
      </div>

      <h2 className="font-racing text-2xl font-bold uppercase text-[color:var(--color-brand-charcoal)]">
        {title}
      </h2>

      {children}
    </section>
  );
}

function InfoCard({
  title,
  children,
  accent = false,
  icon,
}: {
  title: string;
  children: ReactNode;
  accent?: boolean;
  icon?: string;
}) {
  return (
    <div
      className={[
        "border bg-white p-4",
        accent
          ? "border-2 border-[color:var(--color-brand-red)]/60"
          : "border-slate-300",
      ].join(" ")}
      style={{ clipPath: "var(--clip-chamfer-md)" }}
    >
      <div
        className={[
          "mb-1 flex items-center gap-2 font-tech text-xs font-bold uppercase",
          accent
            ? "text-[color:var(--color-brand-red)]"
            : "text-slate-700",
        ].join(" ")}
      >
        {icon ? <span>{icon === "gauge" ? "◉" : "◌"}</span> : null}
        <span>{title}</span>
      </div>

      <div className="text-xs leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

function SystemCard({
  title,
  border,
  rows,
  description,
  example,
}: {
  title: string;
  border: "red" | "slate";
  rows: [string, string, boolean][];
  description: ReactNode;
  example: string;
}) {
  return (
    <div
      className={[
        "flex flex-col justify-between bg-slate-50 p-5",
        border === "red"
          ? "border-2 border-[color:var(--color-brand-red)]"
          : "border-2 border-slate-300",
      ].join(" ")}
      style={{ clipPath: "var(--clip-chamfer-md)" }}
    >
      <div>
        <h3 className="mb-2 font-racing text-lg font-bold uppercase text-[color:var(--color-brand-charcoal)]">
          {title}
        </h3>

        <div className="mb-3 space-y-1.5 font-formula text-xs">
          {rows.map(([label, value, positive]) => (
            <p
              key={`${label}-${value}`}
              className={positive ? "font-bold text-emerald-700" : "font-bold text-rose-600"}
            >
              {positive ? "✓" : "×"} {label}: {value}
            </p>
          ))}
        </div>

        <p className="text-xs leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3 font-formula text-[11px] text-slate-500">
        {example}
      </div>
    </div>
  );
}

function Formula({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="font-formula font-semibold text-slate-800">
      {children}
    </span>
  );
}

function FormulaPanel({
  label,
  formula,
  description,
  accent = false,
}: {
  label: string;
  formula: string;
  description?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col items-start justify-between gap-4 p-4 font-formula sm:flex-row sm:items-center",
        accent
          ? "border-2 border-[color:var(--color-brand-red)] bg-white"
          : "bg-slate-900 text-white",
      ].join(" ")}
      style={{ clipPath: "var(--clip-chamfer-md)" }}
    >
      <div>
        <span
          className={[
            "block text-[10px] font-bold uppercase tracking-wider",
            accent ? "text-slate-500" : "text-slate-400",
          ].join(" ")}
        >
          {label}
        </span>

        <span
          className={[
            "mt-1 block text-xl font-bold",
            accent
              ? "text-[color:var(--color-brand-red)]"
              : "text-yellow-300",
          ].join(" ")}
        >
          {formula}
        </span>
      </div>

      {description ? (
        <p
          className={[
            "max-w-sm text-xs leading-relaxed",
            accent ? "text-slate-600" : "text-slate-300",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function DarkRule({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-slate-700 bg-slate-800/80 p-4">
      <strong className="mb-1 block font-tech text-sm uppercase text-amber-400">
        {title}
      </strong>

      <p className="leading-relaxed text-slate-300">{description}</p>
    </div>
  );
}

function HeatMode({
  title,
  formula,
  description,
}: {
  title: string;
  formula: string;
  description: string;
}) {
  return (
    <div
      className="border border-slate-300 bg-white p-3"
      style={{ clipPath: "var(--clip-chamfer-sm)" }}
    >
      <span className="font-formula text-xs font-bold uppercase text-slate-600">
        {title}
      </span>

      <div className="mt-1 font-formula text-sm font-bold text-[color:var(--color-brand-red)]">
        {formula}
      </div>

      <p className="mt-0.5 font-body text-[11px] text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SignCard({
  value,
  description,
  positive = false,
}: {
  value: string;
  description: string;
  positive?: boolean;
}) {
  return (
    <div
      className="border border-slate-300 bg-white p-2.5"
      style={{ clipPath: "var(--clip-chamfer-sm)" }}
    >
      <span
        className={[
          "block font-bold",
          positive ? "text-emerald-700" : "text-rose-600",
        ].join(" ")}
      >
        {value}
      </span>

      <span className="font-body text-[11px] text-slate-500">
        {description}
      </span>
    </div>
  );
}

function ComparisonCard({
  title,
  badge,
  formula,
  tone,
  children,
}: {
  title: string;
  badge: string;
  formula: string;
  tone: "danger" | "success";
  children: ReactNode;
}) {
  const isDanger = tone === "danger";

  return (
    <div
      className={[
        "space-y-3 border-2 bg-white p-6",
        isDanger
          ? "border-rose-300"
          : "border-emerald-500",
      ].join(" ")}
      style={{ clipPath: "var(--clip-chamfer-md)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          className={[
            "font-tech text-base font-bold uppercase",
            isDanger ? "text-rose-700" : "text-emerald-800",
          ].join(" ")}
        >
          {title}
        </h3>

        <span
          className={[
            "shrink-0 px-2 py-0.5 font-formula text-[10px] font-bold",
            isDanger
              ? "bg-rose-100 text-rose-800"
              : "bg-emerald-100 text-emerald-800",
          ].join(" ")}
          style={{ clipPath: "var(--clip-chamfer-sm)" }}
        >
          {badge}
        </span>
      </div>

      <div
        className={[
          "border p-3 font-formula text-xs font-bold",
          isDanger
            ? "border-rose-200 bg-rose-50 text-rose-900"
            : "border-emerald-200 bg-emerald-50 text-emerald-900",
        ].join(" ")}
        style={{ clipPath: "var(--clip-chamfer-sm)" }}
      >
        {formula}
      </div>

      <p className="text-xs leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}