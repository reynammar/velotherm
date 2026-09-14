export type QuizModuleId = "1" | "2" | "3";

export type QuizQuestion = {
  id: number;
  moduleId: QuizModuleId;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  // ============================================================
  // MODULE 01 · FONDASI TERMODINAMIKA TEKNIK
  // ============================================================
  {
    id: 1,
    moduleId: "1",
    question:
      "Dalam pendekatan makroskopis termodinamika teknik, fokus utama analisis adalah ...",
    options: [
      "A. Posisi setiap atom secara individual",
      "B. Properti agregat materi yang dapat diukur secara nyata",
      "C. Probabilitas gerak setiap molekul secara statistik",
      "D. Struktur sub-atomik material",
    ],
    correct: 1,
    explanation:
      "Slide membedakan pendekatan makroskopis sebagai pendekatan klasik insinyur yang mengukur properti agregat seperti temperatur dan tekanan tanpa melacak partikel individual.",
  },
  {
    id: 2,
    moduleId: "1",
    question:
      "Pendekatan mikroskopis dalam termodinamika meninjau terutama ...",
    options: [
      "A. Temperatur dan tekanan sistem secara agregat",
      "B. Posisi dan kecepatan partikel individual",
      "C. Volume total sistem",
      "D. Gaya pada permukaan sistem",
    ],
    correct: 1,
    explanation:
      "Pendekatan mikroskopis meninjau posisi dan kecepatan partikel individual seperti atom dan molekul.",
  },
  {
    id: 3,
    moduleId: "1",
    question:
      "Gas di dalam silinder piston saat kompresi termasuk contoh ...",
    options: [
      "A. Sistem tertutup",
      "B. Sistem terisolasi",
      "C. Volume atur terbuka",
      "D. Lingkungan",
    ],
    correct: 0,
    explanation:
      "Pada slide, gas di dalam silinder piston saat kompresi digunakan sebagai contoh sistem tertutup: massa tidak melintasi boundary, sedangkan energi dapat berpindah.",
  },
  {
    id: 4,
    moduleId: "1",
    question:
      "Karakteristik utama sistem tertutup menurut materi adalah ...",
    options: [
      "A. Massa dan energi sama-sama dapat melintasi boundary",
      "B. Massa dan energi sama-sama tidak dapat melintasi boundary",
      "C. Massa tidak dapat melintasi boundary, tetapi energi dapat berpindah",
      "D. Massa dapat melintasi boundary, tetapi energi tidak dapat berpindah",
    ],
    correct: 2,
    explanation:
      "Sistem tertutup menolak perpindahan massa, tetapi memungkinkan transfer energi seperti kalor dan kerja.",
  },
  {
    id: 5,
    moduleId: "1",
    question:
      "Sistem yang tidak memiliki perpindahan massa maupun perpindahan energi dengan lingkungan disebut ...",
    options: [
      "A. Sistem tertutup",
      "B. Sistem terisolasi",
      "C. Volume atur",
      "D. Sistem tunak",
    ],
    correct: 1,
    explanation:
      "Sistem terisolasi pada materi menolak baik massa maupun energi melintasi boundary.",
  },
  {
    id: 6,
    moduleId: "1",
    question:
      "Manakah yang merupakan contoh volume atur terbuka pada materi?",
    options: [
      "A. Termos vakum ideal",
      "B. Gas dalam silinder piston",
      "C. Manifold intake mesin",
      "D. Ruang tertutup tanpa interaksi",
    ],
    correct: 2,
    explanation:
      "Materi menggunakan manifold intake mesin sebagai contoh volume atur terbuka, tempat massa dan energi dapat melintasi control surface.",
  },
  {
    id: 7,
    moduleId: "1",
    question:
      "Menurut materi, interaksi massa dan energi dengan lingkungan hanya dapat terjadi melalui ...",
    options: [
      "A. Temperatur",
      "B. Volume",
      "C. Boundary sistem",
      "D. Massa jenis",
    ],
    correct: 2,
    explanation:
      "Catatan teknis pada materi menegaskan bahwa interaksi energi dan massa hanya terjadi melintasi boundary sistem.",
  },
  {
    id: 8,
    moduleId: "1",
    question:
      "Urutan hirarki konseptual yang ditampilkan pada materi adalah ...",
    options: [
      "A. Proses → Properti → State → Siklus",
      "B. Properti → State → Proses → Siklus",
      "C. State → Properti → Siklus → Proses",
      "D. Siklus → Proses → Properti → State",
    ],
    correct: 1,
    explanation:
      "Materi menuliskan hirarki: Properti → Keadaan (State) → Proses → Siklus Termodinamika.",
  },
  {
    id: 9,
    moduleId: "1",
    question:
      "Sifat ekstensif adalah sifat yang ...",
    options: [
      "A. Tidak dipengaruhi ukuran sistem",
      "B. Bergantung pada ukuran atau massa total sistem",
      "C. Selalu sama di setiap titik sistem",
      "D. Hanya dimiliki sistem yang setimbang",
    ],
    correct: 1,
    explanation:
      "Sifat ekstensif bergantung langsung pada ukuran atau massa total sistem dan bersifat aditif saat sistem digabungkan.",
  },
  {
    id: 10,
    moduleId: "1",
    question:
      "Manakah pasangan yang seluruhnya merupakan contoh sifat ekstensif dari materi?",
    options: [
      "A. Temperatur dan tekanan",
      "B. Massa dan volume total",
      "C. Tekanan dan volume spesifik",
      "D. Temperatur dan volume spesifik",
    ],
    correct: 1,
    explanation:
      "Materi memberi contoh massa (m) dan volume total (V) sebagai sifat ekstensif.",
  },
  {
    id: 11,
    moduleId: "1",
    question:
      "Sifat intensif adalah sifat yang ...",
    options: [
      "A. Bergantung pada ukuran sistem",
      "B. Bersifat aditif ketika dua sistem digabungkan",
      "C. Independen dari ukuran atau massa sistem",
      "D. Selalu memiliki satuan kilogram",
    ],
    correct: 2,
    explanation:
      "Sifat intensif pada materi didefinisikan independen dari ukuran atau massa sistem.",
  },
  {
    id: 12,
    moduleId: "1",
    question:
      "Manakah pasangan yang merupakan contoh sifat intensif pada materi?",
    options: [
      "A. Massa dan volume total",
      "B. Temperatur dan tekanan",
      "C. Massa dan volume spesifik",
      "D. Massa total dan temperatur",
    ],
    correct: 1,
    explanation:
      "Temperatur (T) dan tekanan (P) dicantumkan sebagai contoh sifat intensif.",
  },
  {
    id: 13,
    moduleId: "1",
    question:
      "Persamaan volume spesifik yang ditampilkan pada materi adalah ...",
    options: [
      "A. v = m / V",
      "B. v = V / m",
      "C. v = V × m",
      "D. v = V + m",
    ],
    correct: 1,
    explanation:
      "Materi menyatakan volume spesifik sebagai v = V / m.",
  },
  {
    id: 14,
    moduleId: "1",
    question:
      "Membagi volume total dengan massa total menghasilkan ...",
    options: [
      "A. Sifat ekstensif baru",
      "B. Properti intensif baru",
      "C. Energi internal",
      "D. Tekanan gauge",
    ],
    correct: 1,
    explanation:
      "Materi menjelaskan bahwa membagi dua properti ekstensif, yaitu volume total dan massa total, menghasilkan properti intensif baru.",
  },
  {
    id: 15,
    moduleId: "1",
    question:
      "Hubungan antara tekanan absolut, tekanan atmosfer, dan tekanan gauge adalah ...",
    options: [
      "A. P_abs = P_atm − P_gage",
      "B. P_abs = P_gage − P_atm",
      "C. P_abs = P_atm + P_gage",
      "D. P_abs = P_atm × P_gage",
    ],
    correct: 2,
    explanation:
      "Materi menampilkan persamaan P_absolut = P_atm + P_gage.",
  },
  {
    id: 16,
    moduleId: "1",
    question:
      "Tekanan yang menjadi acuan operasi termodinamika pada materi adalah ...",
    options: [
      "A. Tekanan gauge saja",
      "B. Tekanan absolut",
      "C. Tekanan atmosfer lokal saja",
      "D. Tekanan diferensial",
    ],
    correct: 1,
    explanation:
      "Materi menegaskan termodinamika selalu beroperasi menggunakan tekanan absolut, bukan sekadar pembacaan pressure gauge.",
  },
  {
    id: 17,
    moduleId: "1",
    question:
      "Konversi temperatur Celsius ke Kelvin pada materi adalah ...",
    options: [
      "A. T(K) = T(°C) − 273.15",
      "B. T(K) = T(°C) + 273.15",
      "C. T(K) = T(°C) × 273.15",
      "D. T(K) = T(°C) / 273.15",
    ],
    correct: 1,
    explanation:
      "Materi menampilkan T(K) = T(°C) + 273.15.",
  },
  {
    id: 18,
    moduleId: "1",
    question:
      "Mengapa skala temperatur Kelvin digunakan dalam formula termodinamika gas menurut materi?",
    options: [
      "A. Karena Kelvin adalah satuan massa",
      "B. Karena Kelvin merupakan satuan mutlak",
      "C. Karena Celsius tidak dapat diukur",
      "D. Karena Kelvin selalu bernilai positif untuk semua besaran",
    ],
    correct: 1,
    explanation:
      "Materi menyatakan seluruh formula termodinamika gas wajib menggunakan temperatur mutlak Kelvin.",
  },
  {
    id: 19,
    moduleId: "1",
    question:
      "Dalam konteks materi, kondisi state suatu sistem menggambarkan ...",
    options: [
      "A. Jalur yang ditempuh sistem",
      "B. Nilai properti yang menentukan kondisi sistem",
      "C. Hanya jumlah energi yang keluar",
      "D. Hanya temperatur sistem",
    ],
    correct: 1,
    explanation:
      "Materi membedakan properti sebagai besaran yang menentukan keadaan (state), kemudian proses sebagai perubahan antar-state.",
  },
  {
    id: 20,
    moduleId: "1",
    question:
      "Pernyataan yang paling tepat tentang properti dibandingkan kerja adalah ...",
    options: [
      "A. Properti bergantung lintasan, kerja tidak",
      "B. Properti dan kerja sama-sama path function",
      "C. Properti merupakan point function, sedangkan kerja merupakan path function",
      "D. Properti dan kerja sama-sama point function",
    ],
    correct: 2,
    explanation:
      "Golden Rule 02 menyatakan perubahan properti merupakan point function, sedangkan Golden Rule 03 menempatkan kerja sebagai path function.",
  },
  {
    id: 21,
    moduleId: "1",
    question:
      "Menurut Golden Rule 01 pada materi, sebelum interaksi termodinamika dihitung, hal yang harus ditentukan lebih dahulu adalah ...",
    options: [
      "A. Nilai COP",
      "B. Batas sistem",
      "C. Efisiensi termal",
      "D. Daya mesin",
    ],
    correct: 1,
    explanation:
      "Rule 01 berbunyi Batas adalah Raja: tanpa batas yang jelas, interaksi kerja mekanik dan perpindahan panas tidak dapat dihitung secara terukur.",
  },
  {
    id: 22,
    moduleId: "1",
    question:
      "Sebuah sensor mencatat T = 300 K dan P = 1 atm untuk kondisi suatu sistem. Pendekatan yang digunakan adalah ...",
    options: [
      "A. Mikroskopis statistik",
      "B. Makroskopis klasik",
      "C. Sub-atomik",
      "D. Molekuler individual",
    ],
    correct: 1,
    explanation:
      "Materi menggunakan T = 300 K dan P = 1 atm sebagai contoh besaran makroskopis yang dapat diukur secara langsung.",
  },
  {
    id: 23,
    moduleId: "1",
    question:
      "Jika dua sistem digabungkan dan suatu properti total dapat dijumlahkan dari masing-masing sistem, sifat tersebut termasuk ...",
    options: [
      "A. Intensif",
      "B. Ekstensif",
      "C. Absolut",
      "D. Kinetik",
    ],
    correct: 1,
    explanation:
      "Materi menyebut sifat ekstensif bersifat aditif ketika dua sistem digabungkan.",
  },
  {
    id: 24,
    moduleId: "1",
    question:
      "Pernyataan yang sesuai dengan Golden Rule 03 adalah ...",
    options: [
      "A. Kerja hanya bergantung pada titik awal dan akhir",
      "B. Kerja tidak dipengaruhi rute proses",
      "C. Jumlah kerja bergantung pada lintasan pada diagram p-V",
      "D. Kerja merupakan properti keadaan sistem",
    ],
    correct: 2,
    explanation:
      "Materi menegaskan kerja sebagai path function sehingga nilainya bergantung pada rute lintasan proses.",
  },
  {
    id: 25,
    moduleId: "1",
    question:
      "Manakah pernyataan yang paling sesuai dengan klasifikasi volume atur terbuka?",
    options: [
      "A. Tidak ada massa dan energi yang melewati control surface",
      "B. Hanya energi yang dapat melewati control surface",
      "C. Massa dan energi dapat melewati control surface",
      "D. Hanya massa yang dapat melewati control surface",
    ],
    correct: 2,
    explanation:
      "Volume atur terbuka pada materi mengizinkan massa dan energi melintasi control surface.",
  },

  // ============================================================
  // MODULE 02 · ENERGI, KERJA & HUKUM I TERMODINAMIKA
  // ============================================================
  {
    id: 26,
    moduleId: "2",
    question:
      "Persamaan yang menyatakan total perubahan energi sistem tertutup pada materi adalah ...",
    options: [
      "A. ΔE = ΔKE + ΔPE + ΔU",
      "B. ΔE = ΔKE − ΔPE − ΔU",
      "C. ΔE = Q + W",
      "D. ΔE = Q − U",
    ],
    correct: 0,
    explanation:
      "Slide energi total menyatakan ΔE = ΔKE + ΔPE + ΔU.",
  },
  {
    id: 27,
    moduleId: "2",
    question:
      "Energi kinetik pada materi merepresentasikan energi yang terkait dengan ...",
    options: [
      "A. Posisi terhadap gravitasi",
      "B. Gerak translasi sistem",
      "C. Interaksi molekul internal saja",
      "D. Tekanan absolut",
    ],
    correct: 1,
    explanation:
      "Energi kinetik diposisikan sebagai energi makroskopis yang berkaitan dengan gerak translasi kendaraan atau sistem.",
  },
  {
    id: 28,
    moduleId: "2",
    question:
      "Persamaan energi kinetik yang ditampilkan pada materi adalah ...",
    options: [
      "A. KE = m(v₂ − v₁)",
      "B. KE = ½m(v₂² − v₁²)",
      "C. KE = mg(z₂ − z₁)",
      "D. KE = pV",
    ],
    correct: 1,
    explanation:
      "Materi menampilkan ΔKE = ½m(v₂² − v₁²) sebagai perubahan energi kinetik.",
  },
  {
    id: 29,
    moduleId: "2",
    question:
      "Perubahan energi potensial pada materi dinyatakan dengan ...",
    options: [
      "A. ΔPE = ½m(v₂² − v₁²)",
      "B. ΔPE = mg(z₂ − z₁)",
      "C. ΔPE = p(V₂ − V₁)",
      "D. ΔPE = m/V",
    ],
    correct: 1,
    explanation:
      "Materi menampilkan ΔPE = mg(z₂ − z₁).",
  },
  {
    id: 30,
    moduleId: "2",
    question:
      "Dalam materi, energi internal U dipahami sebagai energi yang berkaitan dengan ...",
    options: [
      "A. Posisi kendaraan terhadap bumi",
      "B. Gerak translasi kendaraan saja",
      "C. Aktivitas molekuler seperti translasi, rotasi, vibrasi, dan ikatan kimia",
      "D. Tekanan atmosfer saja",
    ],
    correct: 2,
    explanation:
      "Materi menguraikan U sebagai kontribusi energi mikroskopis termasuk translasi, rotasi, vibrasi, dan ikatan kimia.",
  },
  {
    id: 31,
    moduleId: "2",
    question:
      "Dalam perspektif termodinamika, kerja W didefinisikan sebagai ...",
    options: [
      "A. Transfer energi karena perbedaan suhu",
      "B. Transfer energi melintasi boundary yang digerakkan gaya makroskopis",
      "C. Energi yang tersimpan sebagai properti sistem",
      "D. Massa yang melewati boundary",
    ],
    correct: 1,
    explanation:
      "Slide mendefinisikan kerja sebagai transfer energi melintasi batas yang digerakkan oleh gaya makroskopis, bukan perbedaan temperatur.",
  },
  {
    id: 32,
    moduleId: "2",
    question:
      "Manakah pernyataan yang sesuai dengan materi tentang kerja?",
    options: [
      "A. Kerja adalah properti sistem",
      "B. Kerja tidak dipengaruhi proses",
      "C. Kerja bukan properti dan bergantung pada proses",
      "D. Kerja hanya terjadi pada sistem terisolasi",
    ],
    correct: 2,
    explanation:
      "Materi secara eksplisit menyatakan bahwa kerja BUKAN properti sistem dan bergantung pada proses.",
  },
  {
    id: 33,
    moduleId: "2",
    question:
      "Untuk proses kuasi-setimbang pada piston-silinder, kerja batas dirumuskan sebagai ...",
    options: [
      "A. W = ∫V dp",
      "B. W = ∫p dV",
      "C. W = p/V",
      "D. W = V/p",
    ],
    correct: 1,
    explanation:
      "Materi memberikan rumus boundary work W = ∫ p dV.",
  },
  {
    id: 34,
    moduleId: "2",
    question:
      "Secara geometris, nilai kerja batas pada diagram p-V direpresentasikan oleh ...",
    options: [
      "A. Kemiringan kurva",
      "B. Luas di bawah kurva proses",
      "C. Luas di atas sumbu tekanan",
      "D. Selisih tekanan awal dan akhir",
    ],
    correct: 1,
    explanation:
      "Slide menyatakan bahwa luas area di bawah kurva p-V merepresentasikan kerja mekanik.",
  },
  {
    id: 35,
    moduleId: "2",
    question:
      "Mengapa kerja dapat berbeda untuk dua lintasan proses yang menghubungkan state awal dan akhir yang sama?",
    options: [
      "A. Karena kerja merupakan fungsi keadaan",
      "B. Karena kerja bergantung pada lintasan proses",
      "C. Karena state akhir menentukan semua energi",
      "D. Karena tekanan absolut selalu berubah",
    ],
    correct: 1,
    explanation:
      "Kerja adalah path function, sehingga dua lintasan berbeda dapat menghasilkan kerja yang berbeda walaupun state awal dan akhirnya sama.",
  },
  {
    id: 36,
    moduleId: "2",
    question:
      "Proses dengan hubungan pV^n = konstan disebut proses ...",
    options: [
      "A. Isokhorik",
      "B. Isobarik",
      "C. Politropik",
      "D. Terisolasi",
    ],
    correct: 2,
    explanation:
      "Materi memberi judul sub-bagian Proses Politropik dengan hubungan pV^n = constant.",
  },
  {
    id: 37,
    moduleId: "2",
    question:
      "Untuk proses politropik umum dengan n ≠ 1, persamaan kerja yang diberikan adalah ...",
    options: [
      "A. W = p(V₂ − V₁)",
      "B. W = p₁V₁ ln(V₂/V₁)",
      "C. W = (p₂V₂ − p₁V₁)/(1 − n)",
      "D. W = Q − ΔE",
    ],
    correct: 2,
    explanation:
      "Panel n ≠ 1 pada materi memberikan W = (p₂V₂ − p₁V₁)/(1 − n).",
  },
  {
    id: 38,
    moduleId: "2",
    question:
      "Untuk proses politropik n = 1 pada gas ideal, persamaan kerja yang diberikan adalah ...",
    options: [
      "A. W = p₁V₁ ln(V₂/V₁)",
      "B. W = p(V₂ − V₁)",
      "C. W = ΔKE + ΔPE",
      "D. W = p₂V₂ − p₁V₁",
    ],
    correct: 0,
    explanation:
      "Panel n = 1 pada materi memberikan W = p₁V₁ ln(V₂/V₁) untuk proses isotermal.",
  },
  {
    id: 39,
    moduleId: "2",
    question:
      "Untuk proses politropik n = 0, materi mengidentifikasinya sebagai proses ...",
    options: [
      "A. Isobarik",
      "B. Isotermal",
      "C. Isentropik",
      "D. Adiabatik",
    ],
    correct: 0,
    explanation:
      "Panel n = 0 menyatakan proses isobarik dengan kerja W = p(V₂ − V₁).",
  },
  {
    id: 40,
    moduleId: "2",
    question:
      "Perpindahan energi sebagai kalor terjadi terutama karena ...",
    options: [
      "A. Perbedaan massa",
      "B. Perbedaan temperatur",
      "C. Perbedaan volume",
      "D. Perbedaan ketinggian",
    ],
    correct: 1,
    explanation:
      "Slide heat transfer mendefinisikan kalor sebagai transfer energi yang disebabkan oleh perbedaan temperatur.",
  },
  {
    id: 41,
    moduleId: "2",
    question:
      "Modus perpindahan kalor yang melalui medium stasioner adalah ...",
    options: [
      "A. Konveksi",
      "B. Radiasi",
      "C. Konduksi",
      "D. Evaporasi",
    ],
    correct: 2,
    explanation:
      "Pada slide tiga mode heat transfer, konduksi dijelaskan sebagai perpindahan panas melalui medium stasioner.",
  },
  {
    id: 42,
    moduleId: "2",
    question:
      "Perpindahan kalor melalui permukaan dan fluida yang bergerak merupakan ...",
    options: [
      "A. Konduksi",
      "B. Konveksi",
      "C. Radiasi",
      "D. Difusi",
    ],
    correct: 1,
    explanation:
      "Konveksi pada materi dijelaskan terjadi melalui permukaan dan fluida yang bergerak.",
  },
  {
    id: 43,
    moduleId: "2",
    question:
      "Mode perpindahan kalor yang tidak memerlukan medium adalah ...",
    options: [
      "A. Konduksi",
      "B. Konveksi",
      "C. Radiasi",
      "D. Kontak langsung",
    ],
    correct: 2,
    explanation:
      "Radiasi dijelaskan sebagai emisi energi melalui gelombang tanpa membutuhkan medium.",
  },
  {
    id: 44,
    moduleId: "2",
    question:
      "Menurut hukum Fourier yang ditampilkan pada materi, laju kalor konduksi berkaitan dengan ...",
    options: [
      "A. Q̇x = −kA(dT/dx)",
      "B. Q̇x = hA(Tb − Tf)",
      "C. Q̇x = εσAT⁴",
      "D. Q̇x = pV",
    ],
    correct: 0,
    explanation:
      "Slide menampilkan hukum Fourier: Q̇x = −k A (dT/dx).",
  },
  {
    id: 45,
    moduleId: "2",
    question:
      "Persamaan laju perpindahan kalor konveksi yang ditampilkan adalah ...",
    options: [
      "A. Q̇c = hA(Tb − Tf)",
      "B. Q̇c = −kA(dT/dx)",
      "C. Q̇c = εσAT⁴",
      "D. Q̇c = p(V₂ − V₁)",
    ],
    correct: 0,
    explanation:
      "Materi menampilkan hukum Newton untuk konveksi: Q̇c = hA(Tb − Tf).",
  },
  {
    id: 46,
    moduleId: "2",
    question:
      "Persamaan laju perpindahan kalor radiasi pada materi adalah ...",
    options: [
      "A. Q̇e = hA(Tb − Tf)",
      "B. Q̇e = εσATb⁴",
      "C. Q̇e = pA/V",
      "D. Q̇e = mgz",
    ],
    correct: 1,
    explanation:
      "Slide radiasi menampilkan bentuk Stefan-Boltzmann: Q̇e = εσ A Tb⁴.",
  },
  {
    id: 47,
    moduleId: "2",
    question:
      "Dengan konvensi pada materi, tanda positif Q berarti ...",
    options: [
      "A. Kalor keluar dari sistem",
      "B. Kalor masuk ke sistem",
      "C. Kerja masuk ke sistem",
      "D. Tidak ada transfer energi",
    ],
    correct: 1,
    explanation:
      "Slide sign convention menuliskan +Q untuk heat added to system dan −Q untuk heat removed from system.",
  },
  {
    id: 48,
    moduleId: "2",
    question:
      "Dengan konvensi pada materi, tanda positif W berarti ...",
    options: [
      "A. Kerja dilakukan pada sistem",
      "B. Kerja dilakukan oleh sistem",
      "C. Sistem tidak melakukan kerja",
      "D. Kalor masuk ke sistem",
    ],
    correct: 1,
    explanation:
      "Slide sign convention menuliskan +W untuk work done by the system dan −W untuk work done on the system.",
  },
  {
    id: 49,
    moduleId: "2",
    question:
      "Hukum I Termodinamika untuk sistem tertutup pada materi dinyatakan sebagai ...",
    options: [
      "A. ΔE = Q + W",
      "B. ΔE = Q − W",
      "C. ΔE = W − Q",
      "D. ΔE = QW",
    ],
    correct: 1,
    explanation:
      "Slide First Law menampilkan ΔE = Q − W.",
  },
  {
    id: 50,
    moduleId: "2",
    question:
      "Jika sistem berada pada kondisi steady-state, bentuk rate dari First Law pada materi menjadi ...",
    options: [
      "A. dE/dt = Q̇ − Ẇ dan selalu lebih besar dari nol",
      "B. dE/dt = 0 sehingga Q̇ = Ẇ",
      "C. dE/dt = Q̇ + Ẇ",
      "D. dE/dt = ΔKE + ΔPE",
    ],
    correct: 1,
    explanation:
      "Materi memberikan dE/dt = Q̇ − Ẇ dan untuk steady-state dE/dt = 0, sehingga Q̇ = Ẇ.",
  },

  // ============================================================
  // MODULE 03 · SIKLUS TERMODINAMIKA & KENDARAAN HYBRID
  // ============================================================
  {
    id: 51,
    moduleId: "3",
    question:
      "Siklus termodinamika adalah ...",
    options: [
      "A. Satu proses yang berhenti pada state berbeda",
      "B. Serangkaian proses periodik yang kembali ke state awal yang sama",
      "C. Sistem yang tidak berinteraksi dengan lingkungan",
      "D. Proses dengan temperatur selalu konstan",
    ],
    correct: 1,
    explanation:
      "Materi mendefinisikan siklus sebagai serangkaian proses periodik yang berakhir pada keadaan awal yang persis sama.",
  },
  {
    id: 52,
    moduleId: "3",
    question:
      "Karena energi merupakan fungsi keadaan, perubahan energi total selama satu siklus bernilai ...",
    options: [
      "A. Positif",
      "B. Negatif",
      "C. Nol",
      "D. Tidak dapat ditentukan",
    ],
    correct: 2,
    explanation:
      "Materi menyatakan ΔE_siklus = 0 karena sistem kembali ke state awal.",
  },
  {
    id: 53,
    moduleId: "3",
    question:
      "Hubungan energi siklus yang ditampilkan pada materi adalah ...",
    options: [
      "A. W_siklus = 0 untuk semua siklus",
      "B. W_siklus = Q_siklus = Q_in − Q_out",
      "C. Q_siklus = Q_in + Q_out",
      "D. W_siklus = Q_out − Q_in selalu bernilai negatif",
    ],
    correct: 1,
    explanation:
      "Materi memberi hubungan ΔE_siklus = 0 sehingga W_siklus = Q_siklus = Q_in − Q_out.",
  },
  {
    id: 54,
    moduleId: "3",
    question:
      "Efisiensi termal siklus daya pada materi dinyatakan sebagai ...",
    options: [
      "A. η = Q_in / W_cycle",
      "B. η = W_cycle / Q_in",
      "C. η = Q_out / Q_in",
      "D. η = Q_in + W_cycle",
    ],
    correct: 1,
    explanation:
      "Slide performance measurement menampilkan η = W_cycle / Q_in.",
  },
  {
    id: 55,
    moduleId: "3",
    question:
      "Untuk siklus daya, bentuk lain dari efisiensi termal pada materi adalah ...",
    options: [
      "A. η = 1 + Q_out/Q_in",
      "B. η = 1 − Q_out/Q_in",
      "C. η = Q_out/W_cycle",
      "D. η = W_cycle/Q_out",
    ],
    correct: 1,
    explanation:
      "Materi menuliskan η = 1 − (Q_out / Q_in).",
  },
  {
    id: 56,
    moduleId: "3",
    question:
      "COP refrigerasi pada materi didefinisikan sebagai ...",
    options: [
      "A. β = W_cycle / Q_in",
      "B. β = Q_in / W_cycle",
      "C. β = Q_out / W_cycle",
      "D. β = Q_in / Q_out",
    ],
    correct: 1,
    explanation:
      "Materi menampilkan β = Q_in / W_cycle untuk refrigeration COP.",
  },
  {
    id: 57,
    moduleId: "3",
    question:
      "COP heat pump pada materi dinyatakan sebagai ...",
    options: [
      "A. γ = Q_out / W_cycle",
      "B. γ = Q_in / W_cycle",
      "C. γ = W_cycle / Q_out",
      "D. γ = Q_out / Q_in",
    ],
    correct: 0,
    explanation:
      "Materi menampilkan γ = Q_out / W_cycle untuk heat pump COP.",
  },
  {
    id: 58,
    moduleId: "3",
    question:
      "Saat kendaraan konvensional mengerem dalam materi, energi kinetik terutama berubah menjadi ...",
    options: [
      "A. Energi listrik baterai",
      "B. Panas akibat gesekan rem",
      "C. Energi potensial gravitasi",
      "D. Tekanan atmosfer",
    ],
    correct: 1,
    explanation:
      "Materi menunjukkan ΔKE → Q_out sebagai panas disipasi dari gesekan cakram rem.",
  },
  {
    id: 59,
    moduleId: "3",
    question:
      "Pada pengereman regeneratif, aliran energi yang ditunjukkan adalah ...",
    options: [
      "A. ΔKE → generator → ΔU baterai",
      "B. ΔU baterai → rem cakram → ΔKE",
      "C. Q_out → generator → PE",
      "D. PE → rem → Q_in",
    ],
    correct: 0,
    explanation:
      "Materi secara eksplisit menunjukkan ΔKE → Generator → ΔU_baterai.",
  },
  {
    id: 60,
    moduleId: "3",
    question:
      "Dalam sistem hybrid pada saat regenerative braking, motor berperan sebagai ...",
    options: [
      "A. Kompresor",
      "B. Generator",
      "C. Radiator",
      "D. Kondensor",
    ],
    correct: 1,
    explanation:
      "Materi menjelaskan bahwa pada regenerative braking motor bertindak sebagai generator untuk memanen energi kinetik.",
  },
  {
    id: 61,
    moduleId: "3",
    question:
      "Tujuan utama regenerative braking yang ditekankan pada materi adalah ...",
    options: [
      "A. Membuang seluruh energi kinetik lebih cepat",
      "B. Mengubah energi kinetik menjadi energi internal kimia baterai",
      "C. Menambah massa kendaraan",
      "D. Mengubah energi baterai menjadi panas rem",
    ],
    correct: 1,
    explanation:
      "Materi menyatakan sistem regenerative mengubah kinetik menjadi energi internal kimia baterai untuk digunakan kembali.",
  },
  {
    id: 62,
    moduleId: "3",
    question:
      "Untuk kendaraan dengan massa m dan kecepatan v, energi kinetik mengikuti hubungan ...",
    options: [
      "A. KE = m/v²",
      "B. KE = ½mv²",
      "C. KE = mgv",
      "D. KE = pv",
    ],
    correct: 1,
    explanation:
      "Slide regenerative braking menampilkan hubungan energi kinetik KE = ½mv².",
  },
  {
    id: 63,
    moduleId: "3",
    question:
      "Dari hubungan KE = ½mv², faktor yang mempengaruhi energi kinetik secara kuadrat adalah ...",
    options: [
      "A. Massa kendaraan",
      "B. Kecepatan kendaraan",
      "C. Luas frontal",
      "D. Koefisien hambat",
    ],
    correct: 1,
    explanation:
      "Pada persamaan ½mv², kecepatan memiliki pangkat dua sehingga perubahan kecepatan memberi pengaruh kuadratik pada KE.",
  },
  {
    id: 64,
    moduleId: "3",
    question:
      "Gaya hambat aerodinamika pada materi dinyatakan dengan ...",
    options: [
      "A. F_d = C_d A ρ V",
      "B. F_d = ½ C_d A ρ V²",
      "C. F_d = mgz",
      "D. F_d = pV",
    ],
    correct: 1,
    explanation:
      "Materi menampilkan F_d = ½ C_d A ρ V².",
  },
  {
    id: 65,
    moduleId: "3",
    question:
      "Menurut materi, pengurangan area frontal A dan koefisien hambat C_d terutama membantu ...",
    options: [
      "A. Menambah beban kerja kontinu mesin pada kecepatan tinggi",
      "B. Memangkas beban output kerja kontinu mesin pada kecepatan tinggi",
      "C. Meningkatkan massa kendaraan",
      "D. Menghilangkan kebutuhan energi kinetik",
    ],
    correct: 1,
    explanation:
      "Slide aero drag menyatakan meminimalkan area frontal dan koefisien hambat memangkas kebutuhan kerja kontinu mesin pada kecepatan tinggi.",
  },
  {
    id: 66,
    moduleId: "3",
    question:
      "Dalam konteks lightweighting, massa kendaraan merupakan faktor pengali langsung pada ...",
    options: [
      "A. KE = ½mv²",
      "B. F_d = ½C_dAρV² saja",
      "C. COP = Q_in/W_cycle",
      "D. η = Q_out/Q_in",
    ],
    correct: 0,
    explanation:
      "Materi menyatakan massa m adalah faktor pengali langsung pada energi kinetik KE = ½mv² dan rolling resistance.",
  },
  {
    id: 67,
    moduleId: "3",
    question:
      "Material seperti komposit serat karbon dan aluminium pada materi digunakan terutama untuk ...",
    options: [
      "A. Meningkatkan massa kendaraan",
      "B. Memangkas kebutuhan kerja mekanis akselerasi",
      "C. Meningkatkan drag coefficient",
      "D. Menghilangkan energi internal baterai",
    ],
    correct: 1,
    explanation:
      "Slide lightweighting menyatakan penggunaan material tersebut memangkas kebutuhan kerja mekanis akselerasi.",
  },
  {
    id: 68,
    moduleId: "3",
    question:
      "Dalam diagram hybrid energy life-cycle, energi dari tangki bahan bakar pertama kali masuk ke ...",
    options: [
      "A. Generator",
      "B. Engine",
      "C. Battery",
      "D. Electric motor",
    ],
    correct: 1,
    explanation:
      "Alur pada materi dimulai dari Gas Tank (Kimia) → Engine (Work) → Forward Motion (KE).",
  },
  {
    id: 69,
    moduleId: "3",
    question:
      "Urutan aliran energi yang ditampilkan pada hybrid energy life-cycle adalah ...",
    options: [
      "A. Gas Tank → Engine → Forward Motion → Generator → Battery → Electric Motor",
      "B. Battery → Gas Tank → Engine → Generator → Wheels",
      "C. Engine → Battery → Gas Tank → Brakes → Generator",
      "D. Gas Tank → Battery → Generator → Engine → Forward Motion",
    ],
    correct: 0,
    explanation:
      "Slide hybrid life-cycle menampilkan urutan Gas Tank (Kimia) → Engine (Work) → Forward Motion (KE) → Generator → Battery (ΔU) → Electric Motor.",
  },
  {
    id: 70,
    moduleId: "3",
    question:
      "Dalam life-cycle hybrid, baterai pada diagram menyimpan energi dalam bentuk ...",
    options: [
      "A. ΔU",
      "B. PE",
      "C. Q_out rem",
      "D. F_d",
    ],
    correct: 0,
    explanation:
      "Pada diagram, Battery diberi label ΔU sebagai bentuk penyimpanan energi internal.",
  },
  {
    id: 71,
    moduleId: "3",
    question:
      "Pernyataan yang paling tepat mengenai baterai dalam konteks termodinamika pada materi adalah ...",
    options: [
      "A. Baterai tidak menyimpan energi",
      "B. Energi yang dipanen dapat tersimpan sebagai energi internal",
      "C. Baterai hanya membuang panas ke lingkungan",
      "D. Baterai mengubah energi menjadi tekanan absolut",
    ],
    correct: 1,
    explanation:
      "Materi menjelaskan energi hasil regenerative braking dikonversi menjadi energi internal kimia baterai.",
  },
  {
    id: 72,
    moduleId: "3",
    question:
      "Tujuan closed-loop pada powertrain hybrid menurut materi adalah ...",
    options: [
      "A. Memastikan semua energi berubah menjadi panas rem",
      "B. Menutup siklus disipasi energi kinetik melalui rekuperasi baterai",
      "C. Menghilangkan kerja motor listrik",
      "D. Menghentikan seluruh perpindahan energi",
    ],
    correct: 1,
    explanation:
      "Materi menyebut penutupan siklus dilakukan dengan menutup disipasi energi kinetik melalui rekuperasi ke baterai.",
  },
  {
    id: 73,
    moduleId: "3",
    question:
      "Dalam sudut pandang sistem kendaraan pada materi, control volume dapat digunakan untuk menganalisis ...",
    options: [
      "A. Hanya massa kendaraan",
      "B. Pertukaran massa dan energi yang melintasi boundary sistem",
      "C. Hanya warna kendaraan",
      "D. Hanya temperatur lingkungan",
    ],
    correct: 1,
    explanation:
      "Slide drawing the thermodynamic boundary menunjukkan control volume sebagai pendekatan untuk kendaraan dan membedakan sistem terbuka serta tertutup berdasarkan pertukaran massa dan energi.",
  },
  {
    id: 74,
    moduleId: "3",
    question:
      "Berdasarkan arsitektur energi yang ditampilkan, regenerative braking pada hybrid terutama mengubah jalur energi dari kendaraan menjadi ...",
    options: [
      "A. Energi kinetik → generator → energi internal baterai",
      "B. Energi internal baterai → panas rem → energi kinetik",
      "C. Energi potensial → drag → energi internal baterai",
      "D. Kerja mesin → panas knalpot → energi kinetik",
    ],
    correct: 0,
    explanation:
      "Materi menekankan pembalikan aliran energi saat pengereman dari energi kinetik menuju generator lalu menjadi energi internal baterai.",
  },
  {
    id: 75,
    moduleId: "3",
    question:
      "Tiga keluaran engineer yang ditegaskan pada slide terakhir paling tepat dirangkum sebagai ...",
    options: [
      "A. Control volumes are dynamic, first law harvests energy, physics dictates materials",
      "B. Control volume hanya untuk sistem tertutup, First Law menghilangkan energi, material tidak relevan",
      "C. Hybrid selalu 100% efisien, drag tidak penting, massa tidak mempengaruhi energi",
      "D. Semua energi kendaraan harus dibuang sebagai panas",
    ],
    correct: 0,
    explanation:
      "Slide terakhir merangkum tiga output engineer: control volumes are dynamic, the First Law enables energy harvesting, dan physics dictates materials.",
  },
];

export const quizQuestionsByModule: Record<QuizModuleId, QuizQuestion[]> = {
  "1": quizQuestions.filter((question) => question.moduleId === "1"),
  "2": quizQuestions.filter((question) => question.moduleId === "2"),
  "3": quizQuestions.filter((question) => question.moduleId === "3"),
};
