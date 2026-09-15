export type QuizQuestion = {
  id: number;
  sourceModule: 2 | 3;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    sourceModule: 2,
    question:
      "Dalam perspektif termodinamika teknik, energi yang tersimpan dalam suatu sistem secara makroskopik terutama terdiri atas ...",
    options: [
      "A. Energi kalor, energi kerja, dan energi listrik",
      "B. Energi internal, energi kinetik, dan energi potensial gravitasi",
      "C. Energi tekanan, energi volume, dan energi temperatur",
      "D. Energi mekanik, energi kalor, dan energi massa",
    ],
    correct: 1,
    explanation:
      "Energi makroskopik sistem terdiri atas energi internal, energi kinetik, dan energi potensial gravitasi.",
  },
  {
    id: 2,
    sourceModule: 2,
    question:
      "Sebuah benda bermassa m bergerak dengan kecepatan V. Persamaan energi kinetiknya adalah ...",
    options: [
      "A. KE = mV",
      "B. KE = mV²",
      "C. KE = ½mV²",
      "D. KE = ½mV",
    ],
    correct: 2,
    explanation:
      "Energi kinetik benda yang bergerak dinyatakan dengan KE = ½mV².",
  },
  {
    id: 3,
    sourceModule: 2,
    question:
      "Jika kecepatan suatu benda meningkat dua kali lipat sementara massanya tetap, energi kinetiknya akan menjadi ...",
    options: [
      "A. 2 kali lebih besar",
      "B. 3 kali lebih besar",
      "C. 4 kali lebih besar",
      "D. 8 kali lebih besar",
    ],
    correct: 2,
    explanation:
      "Karena KE berbanding lurus dengan kuadrat kecepatan, penggandaan kecepatan membuat energi kinetik menjadi empat kali lipat.",
  },
  {
    id: 4,
    sourceModule: 2,
    question:
      "Sebuah benda bermassa m berada pada ketinggian z terhadap bidang referensi. Energi potensial gravitasinya adalah ...",
    options: [
      "A. PE = mgz",
      "B. PE = ½mgz",
      "C. PE = mz/g",
      "D. PE = mg/z",
    ],
    correct: 0,
    explanation:
      "Energi potensial gravitasi terhadap bidang referensi dinyatakan sebagai PE = mgz.",
  },
  {
    id: 5,
    sourceModule: 2,
    question:
      "Energi internal suatu sistem terutama berkaitan dengan ...",
    options: [
      "A. Gerakan sistem secara keseluruhan",
      "B. Posisi sistem terhadap permukaan bumi",
      "C. Energi pada tingkat mikroskopik yang terkait dengan molekul, atom, dan interaksinya",
      "D. Kerja yang dilakukan sistem terhadap lingkungan",
    ],
    correct: 2,
    explanation:
      "Energi internal berkaitan dengan energi pada tingkat mikroskopik, termasuk gerak dan interaksi molekul serta atom penyusun sistem.",
  },
  {
    id: 6,
    sourceModule: 2,
    question: "Manakah pernyataan yang paling tepat?",
    options: [
      "A. Energi merupakan fungsi lintasan",
      "B. Energi merupakan sifat sistem",
      "C. Energi hanya dapat berpindah melalui kalor",
      "D. Energi tidak dapat berubah bentuk",
    ],
    correct: 1,
    explanation:
      "Energi merupakan sifat sistem, sedangkan kalor dan kerja merupakan mekanisme perpindahan energi melintasi batas sistem.",
  },
  {
    id: 7,
    sourceModule: 2,
    question:
      "Dalam terminologi termodinamika, kerja dan kalor merupakan ...",
    options: [
      "A. Sifat intensif sistem",
      "B. Sifat ekstensif sistem",
      "C. Bentuk energi yang tersimpan dalam sistem",
      "D. Cara atau mekanisme perpindahan energi melintasi batas sistem",
    ],
    correct: 3,
    explanation:
      "Kalor dan kerja bukan energi yang tersimpan sebagai properti sistem, melainkan cara energi berpindah melintasi batas sistem.",
  },
  {
    id: 8,
    sourceModule: 2,
    question:
      "Sebuah gas dalam piston–silinder mengalami ekspansi. Untuk proses kuasi-setimbang, kerja batas dapat dinyatakan sebagai ...",
    options: [
      "A. W = ∫V dp",
      "B. W = ∫p dV",
      "C. W = p/V",
      "D. W = V/p",
    ],
    correct: 1,
    explanation:
      "Untuk proses kuasi-setimbang pada piston–silinder, kerja batas dinyatakan dengan W = ∫p dV.",
  },
  {
    id: 9,
    sourceModule: 2,
    question:
      "Apabila gas mengalami ekspansi maka kerja yang dilakukan oleh sistem adalah ...",
    options: ["A. Positif", "B. Negatif", "C. Nol", "D. Selalu sama dengan kalor"],
    correct: 0,
    explanation:
      "Dengan konvensi W positif untuk kerja yang dilakukan oleh sistem, ekspansi menghasilkan kerja positif.",
  },
  {
    id: 10,
    sourceModule: 2,
    question:
      "Gas dalam piston–silinder dikompresi sehingga volumenya berkurang. Kerja yang dilakukan oleh sistem bernilai ...",
    options: ["A. Positif", "B. Negatif", "C. Nol", "D. Tidak dapat ditentukan"],
    correct: 1,
    explanation:
      "Pada kompresi, kerja dilakukan pada sistem sehingga kerja oleh sistem bernilai negatif.",
  },
  {
    id: 11,
    sourceModule: 2,
    question:
      "Pada proses ekspansi atau kompresi kuasi-setimbang, secara geometris kerja batas dapat diinterpretasikan sebagai ...",
    options: [
      "A. Kemiringan kurva p–V",
      "B. Luas di bawah kurva proses pada diagram p–V",
      "C. Luas di atas kurva proses",
      "D. Perubahan tekanan dibagi volume",
    ],
    correct: 1,
    explanation:
      "Pada diagram p–V, kerja batas direpresentasikan secara geometris oleh luas di bawah kurva proses.",
  },
  {
    id: 12,
    sourceModule: 2,
    question:
      "Gas berpindah dari keadaan 1 ke keadaan 2 melalui dua lintasan berbeda pada diagram p–V. Pernyataan yang benar adalah ...",
    options: [
      "A. Kerja selalu sama karena keadaan awal dan akhir sama",
      "B. Kerja tidak bergantung pada lintasan",
      "C. Kerja dapat berbeda karena bergantung pada lintasan proses",
      "D. Kerja merupakan sifat intensif",
    ],
    correct: 2,
    explanation:
      "Kerja merupakan besaran yang bergantung pada lintasan proses. Dua lintasan berbeda dapat menghasilkan kerja yang berbeda walaupun keadaan awal dan akhirnya sama.",
  },
  {
    id: 13,
    sourceModule: 2,
    question: "Suatu proses dengan hubungan tekanan-volume pVⁿ = konstan disebut ...",
    options: [
      "A. Proses isokhorik",
      "B. Proses isobarik",
      "C. Proses polytropik",
      "D. Proses isentropik",
    ],
    correct: 2,
    explanation:
      "Hubungan tekanan-volume pVⁿ = konstan merupakan bentuk proses polytropik.",
  },
  {
    id: 14,
    sourceModule: 2,
    question: "Perpindahan energi melalui kalor terjadi karena adanya ...",
    options: [
      "A. Perbedaan massa",
      "B. Perbedaan volume",
      "C. Perbedaan temperatur",
      "D. Perbedaan energi kinetik saja",
    ],
    correct: 2,
    explanation:
      "Perpindahan energi melalui kalor terjadi karena adanya perbedaan temperatur.",
  },
  {
    id: 15,
    sourceModule: 2,
    question: "Apabila kalor ditransfer ke dalam sistem, maka ...",
    options: [
      "A. Q < 0",
      "B. Q = 0",
      "C. Q > 0",
      "D. Q selalu sama dengan W",
    ],
    correct: 2,
    explanation:
      "Dengan konvensi yang digunakan, kalor yang masuk ke sistem bernilai positif sehingga Q > 0.",
  },
  {
    id: 16,
    sourceModule: 2,
    question: "Pada proses adiabatik, perpindahan energi melalui kalor adalah ...",
    options: ["A. Q > 0", "B. Q < 0", "C. Q = 0", "D. Q = W"],
    correct: 2,
    explanation:
      "Proses adiabatik didefinisikan sebagai proses tanpa perpindahan energi melalui kalor, sehingga Q = 0.",
  },
  {
    id: 17,
    sourceModule: 2,
    question: "Mekanisme perpindahan kalor yang dibahas dalam Bab 2 meliputi ...",
    options: [
      "A. Konduksi, konveksi, dan radiasi",
      "B. Konduksi, evaporasi, dan sublimasi",
      "C. Konveksi, ekspansi, dan kompresi",
      "D. Radiasi, difusi, dan evaporasi",
    ],
    correct: 0,
    explanation:
      "Tiga mekanisme perpindahan kalor yang disebutkan adalah konduksi, konveksi, dan radiasi.",
  },
  {
    id: 18,
    sourceModule: 2,
    question: "Hukum I Termodinamika pada dasarnya merupakan prinsip ...",
    options: [
      "A. Kekekalan massa",
      "B. Kekekalan momentum",
      "C. Kekekalan energi",
      "D. Kesetimbangan temperatur",
    ],
    correct: 2,
    explanation:
      "Hukum I Termodinamika menyatakan prinsip kekekalan energi.",
  },
  {
    id: 19,
    sourceModule: 2,
    question:
      "Dengan konvensi Q positif menuju sistem dan W positif keluar dari sistem, persamaan neraca energi adalah ...",
    options: [
      "A. E₂ − E₁ = Q + W",
      "B. E₂ − E₁ = Q − W",
      "C. E₂ − E₁ = W − Q",
      "D. E₂ − E₁ = QW",
    ],
    correct: 1,
    explanation:
      "Dengan Q positif masuk sistem dan W positif dilakukan oleh sistem, neraca energi sistem tertutup adalah ΔE = Q − W.",
  },
  {
    id: 20,
    sourceModule: 2,
    question:
      "Jika perubahan energi kinetik dan energi potensial dapat diabaikan, persamaan Hukum I menjadi ...",
    options: ["A. ΔU = Q − W", "B. ΔU = Q + W", "C. ΔU = W − Q", "D. ΔU = QW"],
    correct: 0,
    explanation:
      "Saat perubahan energi kinetik dan potensial diabaikan, perubahan energi total direduksi menjadi perubahan energi internal: ΔU = Q − W.",
  },
  {
    id: 21,
    sourceModule: 2,
    question:
      "Sebuah sistem menerima kalor sebesar 500 kJ dan melakukan kerja sebesar 200 kJ. Perubahan energi internal sistem adalah ...",
    options: ["A. 300 kJ", "B. 500 kJ", "C. 700 kJ", "D. −300 kJ"],
    correct: 0,
    explanation:
      "Dengan ΔU = Q − W, diperoleh ΔU = 500 − 200 = +300 kJ.",
  },
  {
    id: 22,
    sourceModule: 2,
    question:
      "Sebuah sistem tertutup mengalami proses adiabatik dan melakukan kerja sebesar 150 kJ. Jika perubahan energi kinetik dan energi potensial diabaikan, maka perubahan energi internalnya adalah ...",
    options: ["A. −150 kJ", "B. 0 kJ", "C. +150 kJ", "D. +300 kJ"],
    correct: 0,
    explanation:
      "Pada proses adiabatik Q = 0. Dengan sistem melakukan kerja 150 kJ, ΔU = 0 − 150 = −150 kJ.",
  },
  {
    id: 23,
    sourceModule: 2,
    question: "Untuk sistem tertutup, perubahan total energi dapat dituliskan sebagai ...",
    options: [
      "A. ΔE = ΔU + ΔKE + ΔPE",
      "B. ΔE = Q + W + ΔU",
      "C. ΔE = QW",
      "D. ΔE = ΔKE − ΔPE",
    ],
    correct: 0,
    explanation:
      "Perubahan total energi sistem merupakan jumlah perubahan energi internal, kinetik, dan potensial.",
  },
  {
    id: 24,
    sourceModule: 3,
    question:
      "Suatu sistem mengalami siklus termodinamika dan kembali ke keadaan awal. Maka perubahan energi sistem selama satu siklus adalah ...",
    options: ["A. Positif", "B. Negatif", "C. Nol", "D. Selalu sama dengan kalor masuk"],
    correct: 2,
    explanation:
      "Karena sistem kembali ke keadaan awal setelah satu siklus, perubahan energi bersih selama satu siklus adalah nol.",
  },
  {
    id: 25,
    sourceModule: 2,
    question:
      "Sebuah sistem menerima energi melalui kalor sebesar 800 kJ dan mengeluarkan energi melalui kerja sebesar 300 kJ. Jika perubahan energi kinetik dan potensial diabaikan, maka ...",
    options: [
      "A. Energi internal turun 500 kJ",
      "B. Energi internal naik 500 kJ",
      "C. Energi internal naik 1.100 kJ",
      "D. Energi internal tetap",
    ],
    correct: 1,
    explanation:
      "Dengan ΔU = Q − W, perubahan energi internal adalah 800 − 300 = +500 kJ sehingga energi internal naik 500 kJ.",
  },
];

export const TOTAL_QUIZ_QUESTIONS = 25;

if (quizQuestions.length !== TOTAL_QUIZ_QUESTIONS) {
  throw new Error("VeloTherm quiz bank must contain exactly 25 questions.");
}
