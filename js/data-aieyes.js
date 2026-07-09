/* Data Modul 2 - AI Eyes Inspection 7 Pilar (Pro)
   Sumber: E-BOOK BONUS "Checklist Rahasia Mobil Untung Instan".
   7 pilar berbobot sesuai Bagian 7.2 ebook. Pilar ke-7 (Nilai Pasar &
   Potensi Cuan) TIDAK diisi manual - nilainya ditarik otomatis dari
   Harga Beli & Harga Pasar unit yang sama di Modul 1/3 (lihat app.js). */
var AIEYES_PILLARS = [
  {
    key: "dataAwal",
    label: "1. Data Mobil Awal",
    weight: 0.10,
    manual: true,
    aspects: [
      "Rasio Harga ke Pasar (RHP)",
      "Relevansi Tahun & Transmisi",
      "Reputasi Merek"
    ]
  },
  {
    key: "eksterior",
    label: "2. Eksterior",
    weight: 0.15,
    manual: true,
    maxSkor: 25,
    interpretasi: [
      { min: 20, label: "Layak langsung jual" },
      { min: 15, label: "Perlu perbaikan ringan" },
      { min: 0, label: "Negosiasi harga wajib" }
    ],
    aspects: [
      "Cat & Kilap Permukaan",
      "Panel & Celah Bodi",
      "Kondisi Ban & Velg",
      "Kaca & Lampu",
      "Emblem & Aksesoris"
    ]
  },
  {
    key: "interior",
    label: "3. Interior",
    weight: 0.15,
    manual: true,
    maxSkor: 25,
    interpretasi: [
      { min: 21, label: "Siap jual tanpa perbaikan" },
      { min: 16, label: "Layak beli, perlu cleaning minor" },
      { min: 11, label: "Perlu negosiasi tambahan" },
      { min: 0, label: "Hindari, indikasi kerusakan serius / kebanjiran" }
    ],
    aspects: [
      "Jok & Trim",
      "Dashboard & Konsol",
      "AC & Audio",
      "Karpet & Langit-langit",
      "Bau Kabin"
    ]
  },
  {
    key: "mesin",
    label: "4. Mesin & Test Drive",
    weight: 0.25,
    manual: true,
    maxSkor: 30,
    interpretasi: [
      { min: 25, label: "Layak Beli - mesin sehat, margin aman" },
      { min: 19, label: "Perlu Negosiasi - gejala kecil tapi tidak fatal" },
      { min: 13, label: "Pertimbangkan Ulang - biaya perbaikan bisa makan margin" },
      { min: 0, label: "Hindari - risiko kerusakan besar" }
    ],
    aspects: [
      "Kondisi ruang mesin (kebersihan, oli, belt)",
      "Suara idle & start-up",
      "Getaran mesin (setir & jok)",
      "Asap knalpot & respons gas",
      "Transmisi & perpindahan gigi",
      "Kaki-kaki & rem"
    ]
  },
  {
    key: "kelistrikan",
    label: "5. Kelistrikan & Fitur",
    weight: 0.15,
    manual: true,
    maxSkor: 30,
    aspects: [
      "Indikator dashboard (nyala & mati sesuai standar)",
      "Baterai & sistem pengisian",
      "Lampu-lampu luar & headlamp leveling",
      "Power window, central lock, spion elektrik",
      "AC, soket charger, lampu kabin",
      "Sensor, kamera, dan fitur tambahan"
    ]
  },
  {
    key: "dokumen",
    label: "6. Dokumen & Legalitas",
    weight: 0.15,
    manual: true,
    maxSkor: 30,
    aspects: [
      "STNK lengkap & pajak hidup",
      "Nama STNK & BPKB cocok",
      "BPKB asli (stempel, hologram, halaman mutasi)",
      "Nomor rangka dan mesin sesuai fisik",
      "Data e-Samsat valid dan tidak blokir",
      "Surat jual-beli / kwitansi lengkap"
    ]
  },
  {
    key: "cuan",
    label: "7. Nilai Pasar & Potensi Cuan",
    weight: 0.05,
    manual: false,
    note: "Otomatis dari Harga Beli vs Harga Pasar unit (Modul 1/3)."
  }
];

/* Kategori skor akhir AI Score (rata-rata 7 pilar, skala 1-5) */
var AIEYES_CATEGORIES = [
  { min: 4.1, label: "Layak Beli", desc: "Mobil sehat, dokumen aman, potensi cuan tinggi. Bisa langsung dibeli dan dijual dengan sedikit perbaikan." },
  { min: 3.1, label: "Perlu Negosiasi", desc: "Ada catatan minor (body, interior, atau fitur). Masih bisa untung asal diskon harga minimal 5-10%." },
  { min: 2.1, label: "Pertimbangkan Ulang", desc: "Ada risiko tersembunyi (mesin, dokumen, kelistrikan). Cocok hanya untuk flipper berpengalaman." },
  { min: 0, label: "Hindari", desc: "Potensi masalah besar, margin tidak sebanding dengan risiko. Lebih baik cari unit lain." }
];

/* Skor pilar 7 (Nilai Pasar & Potensi Cuan) dari Value Gap harga beli vs harga pasar.
   Dipetakan ke skala 1-5 agar konsisten dengan 6 pilar manual lainnya. */
function aiEyesSkorCuanDariValueGap(valueGapPercent) {
  if (valueGapPercent == null || isNaN(valueGapPercent)) return null;
  var g = valueGapPercent * 100;
  if (g >= 15) return 5;
  if (g >= 10) return 4;
  if (g >= 5) return 3;
  if (g >= 0) return 2;
  return 1;
}

function aiEyesKategori(score) {
  for (var i = 0; i < AIEYES_CATEGORIES.length; i++) {
    if (score >= AIEYES_CATEGORIES[i].min) return AIEYES_CATEGORIES[i];
  }
  return AIEYES_CATEGORIES[AIEYES_CATEGORIES.length - 1];
}
