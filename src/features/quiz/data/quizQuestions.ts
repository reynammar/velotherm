export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correct: number;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Dalam perspektif termodinamika teknik, energi yang tersimpan dalam suatu sistem secara makroskopik terutama terdiri atas ...",
    options: [
      "A. Energi kalor, energi kerja, dan energi listrik",
      "B. Energi internal, energi kinetik, dan energi potensial gravitasi",
      "C. Energi tekanan, energi volume, dan energi temperatur",
      "D. Energi mekanik, energi kalor, dan energi massa",
    ],
    correct: 1,
  },
  {
    id: 2,
    question:
      "Sebuah benda bermassa m bergerak dengan kecepatan V. Persamaan energi kinetiknya adalah ...",
    options: [
      "A. KE = mV",
      "B. KE = mV²",
      "C. KE = ½mV²",
      "D. KE = ½mV",
    ],
    correct: 2,
  },
  {
    id: 3,
    question:
      "Jika kecepatan suatu benda meningkat dua kali lipat sementara massanya tetap, energi kinetiknya akan menjadi ...",
    options: [
      "A. 2 kali lebih besar",
      "B. 3 kali lebih besar",
      "C. 4 kali lebih besar",
      "D. 8 kali lebih besar",
    ],
    correct: 2,
  },
  {
    id: 4,
    question:
      "Sebuah benda bermassa m berada pada ketinggian z terhadap bidang referensi. Energi potensial gravitasinya adalah ...",
    options: [
      "A. PE = mgz",
      "B. PE = ½mgz",
      "C. PE = mz/g",
      "D. PE = mg/z",
    ],
    correct: 0,
  },
  {
    id: 5,
    question:
      "Energi internal suatu sistem terutama berkaitan dengan ...",
    options: [
      "A. Gerakan sistem secara keseluruhan",
      "B. Posisi sistem terhadap permukaan bumi",
      "C. Energi pada tingkat mikroskopik yang terkait dengan molekul, atom, dan interaksinya",
      "D. Kerja yang dilakukan sistem terhadap lingkungan",
    ],
    correct: 2,
  },
  {
    id: 6,
    question: "Manakah pernyataan yang paling tepat mengenai sifat energi?",
    options: [
      "A. Energi merupakan fungsi lintasan",
      "B. Energi merupakan sifat sistem",
      "C. Energi hanya dapat berpindah melalui kalor",
      "D. Energi tidak dapat berubah bentuk",
    ],
    correct: 1,
  },
  {
    id: 7,
    question:
      "Dalam terminologi termodinamika, kerja dan kalor merupakan ...",
    options: [
      "A. Sifat intensif sistem",
      "B. Sifat ekstensif sistem",
      "C. Bentuk energi yang tersimpan dalam sistem",
      "D. Cara atau mekanisme perpindahan energi melintasi batas sistem",
    ],
    correct: 3,
  },
  {
    id: 8,
    question:
      "Sebuah gas dalam piston–silinder mengalami ekspansi. Untuk proses kuasi-setimbang, kerja batas dapat dinyatakan sebagai ...",
    options: [
      "A. W = ∫V dp",
      "B. W = ∫p dV",
      "C. W = p/V",
      "D. W = V/p",
    ],
    correct: 1,
  },
  {
    id: 9,
    question:
      "Apabila gas mengalami ekspansi maka kerja yang dilakukan oleh sistem adalah ...",
    options: [
      "A. Positif",
      "B. Negatif",
      "C. Nol",
      "D. Selalu sama dengan kalor",
    ],
    correct: 0,
  },
  {
    id: 10,
    question:
      "Gas dalam piston–silinder dikompresi sehingga volumenya berkurang. Kerja yang dilakukan oleh sistem bernilai ...",
    options: [
      "A. Positif",
      "B. Negatif",
      "C. Nol",
      "D. Tidak dapat ditentukan",
    ],
    correct: 1,
  },
  {
    id: 11,
    question:
      "Pada proses ekspansi atau kompresi kuasi-setimbang, secara geometris kerja batas dapat diinterpretasikan sebagai ...",
    options: [
      "A. Kemiringan kurva p–V",
      "B. Luas di bawah kurva proses pada diagram p–V",
      "C. Luas di atas kurva proses",
      "D. Perubahan tekanan dibagi volume",
    ],
    correct: 1,
  },
  {
    id: 12,
    question:
      "Gas berpindah dari keadaan 1 ke keadaan 2 melalui dua lintasan berbeda pada diagram p–V. Pernyataan yang benar adalah ...",
    options: [
      "A. Kerja selalu sama karena keadaan awal dan akhir sama",
      "B. Kerja tidak bergantung pada lintasan",
      "C. Kerja dapat berbeda karena bergantung pada lintasan proses",
      "D. Kerja merupakan sifat intensif",
    ],
    correct: 2,
  },
  {
    id: 13,
    question:
      "Suatu proses dengan hubungan tekanan-volume pVⁿ = konstan disebut ...",
    options: [
      "A. Proses isokhorik",
      "B. Proses isobarik",
      "C. Proses polytropik",
      "D. Proses isentropik",
    ],
    correct: 2,
  },
  {
    id: 14,
    question:
      "Perpindahan energi melalui kalor terjadi karena adanya ...",
    options: [
      "A. Perbedaan massa",
      "B. Perbedaan volume",
      "C. Perbedaan temperatur",
      "D. Perbedaan energi kinetik saja",
    ],
    correct: 2,
  },
  {
    id: 15,
    question:
      "Apabila kalor ditransfer ke dalam sistem, maka menurut konvensi standar...",
    options: [
      "A. Q < 0",
      "B. Q = 0",
      "C. Q > 0",
      "D. Q selalu sama dengan W",
    ],
    correct: 2,
  },
  {
    id: 16,
    question:
      "Pada proses adiabatik, perpindahan energi melalui kalor adalah ...",
    options: [
      "A. Q > 0",
      "B. Q < 0",
      "C. Q = 0",
      "D. Q = W",
    ],
    correct: 2,
  },
  {
    id: 17,
    question:
      "Mekanisme perpindahan kalor yang dibahas dalam Bab 2 meliputi ...",
    options: [
      "A. Konduksi, konveksi, dan radiasi",
      "B. Konduksi, evaporasi, dan sublimasi",
      "C. Konveksi, ekspansi, dan kompresi",
      "D. Radiasi, difusi, dan evaporasi",
    ],
    correct: 0,
  },
  {
    id: 18,
    question:
      "Hukum I Termodinamika pada dasarnya merupakan prinsip ...",
    options: [
      "A. Kekekalan massa",
      "B. Kekekalan momentum",
      "C. Kekekalan energi",
      "D. Kesetimbangan temperatur",
    ],
    correct: 2,
  },
  {
    id: 19,
    question:
      "Dengan konvensi Q positif menuju sistem dan W positif keluar dari sistem, persamaan neraca energi sistem tertutup adalah ...",
    options: [
      "A. E₂ − E₁ = Q + W",
      "B. E₂ − E₁ = Q − W",
      "C. E₂ − E₁ = W − Q",
      "D. E₂ − E₁ = QW",
    ],
    correct: 1,
  },
  {
    id: 20,
    question:
      "Jika perubahan energi kinetik dan energi potensial dapat diabaikan, persamaan Hukum I menjadi ...",
    options: [
      "A. ΔU = Q − W",
      "B. ΔU = Q + W",
      "C. ΔU = W − Q",
      "D. ΔU = QW",
    ],
    correct: 0,
  },
  {
    id: 21,
    question:
      "Sebuah sistem menerima kalor sebesar 500 kJ dan melakukan kerja sebesar 200 kJ. Perubahan energi internal sistem adalah ...",
    options: [
      "A. 300 kJ",
      "B. 500 kJ",
      "C. 700 kJ",
      "D. −300 kJ",
    ],
    correct: 0,
  },
  {
    id: 22,
    question:
      "Sebuah sistem tertutup mengalami proses adiabatik dan melakukan kerja sebesar 150 kJ. Jika perubahan energi kinetik dan energi potensial diabaikan, maka perubahan energi internalnya adalah ...",
    options: [
      "A. −150 kJ",
      "B. 0 kJ",
      "C. +150 kJ",
      "D. +300 kJ",
    ],
    correct: 0,
  },
  {
    id: 23,
    question:
      "Untuk sistem tertutup, perubahan total energi dapat dituliskan sebagai ...",
    options: [
      "A. ΔE = ΔU + ΔKE + ΔPE",
      "B. ΔE = Q + W + ΔU",
      "C. ΔE = QW",
      "D. ΔE = ΔKE − ΔPE",
    ],
    correct: 0,
  },
  {
    id: 24,
    question:
      "Suatu sistem mengalami siklus termodinamika dan kembali ke keadaan awal. Maka perubahan energi sistem selama satu siklus adalah ...",
    options: [
      "A. Positif",
      "B. Negatif",
      "C. Nol",
      "D. Selalu sama dengan kalor masuk",
    ],
    correct: 2,
  },
  {
    id: 25,
    question:
      "Sebuah sistem menerima energi melalui kalor sebesar 800 kJ dan mengeluarkan energi melalui kerja sebesar 300 kJ. Jika perubahan energi kinetik dan potensial diabaikan, maka ...",
    options: [
      "A. Energi internal turun 500 kJ",
      "B. Energi internal naik 500 kJ",
      "C. Energi internal naik 1.100 kJ",
      "D. Energi internal tetap",
    ],
    correct: 1,
  },
];