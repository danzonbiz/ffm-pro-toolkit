# FFM Toolkit Pro v1.1

Progressive Web App (PWA) offline-first pendamping ebook **Formula Flipping Mobil** oleh Cuan Auto Flip Team. Semua 8 modul terbuka sejak awal, tanpa kode aktivasi dan tanpa backend. Data bisnis tersimpan lokal di perangkat pengguna (IndexedDB).

## Modul

Kalkulator Untung Unit, Checklist Risiko, Ad Generator, Riset Pasar, AI Eyes (7 pilar), Script Assistant, 3 Kotak Uang, History & Dashboard.

## Perubahan v1.1 (dari Pro v1)

1. Checklist Risiko: satu BAHAYA di Mesin, Surat, atau Pajak membatasi kategori maksimal "Perlu Pertimbangan". Dua atau lebih BAHAYA di aspek itu otomatis "Hindari". Aturan "dua atau lebih" adalah tambahan v1.1, hapus `dealbreakers.length >= 2` di `computeRisk()` kalau tidak diinginkan.
2. AI Eyes: label "bobot %" dihapus dari UI. AI Score = rata-rata 7 pilar (total / 7), sama dengan "versi lapangan" di ebook bonus.
3. AI Eyes pilar 7: pemetaan Value Gap ke skor 1-5 sekarang tampil di UI dan didokumentasikan di ebook (Lampiran B).
4. Backup & Ekspor (tab Dashboard): backup JSON, pulihkan dari backup, CSV (Unit, Riset, Riwayat, 3 Kotak Uang), salin Unit untuk Excel, permintaan penyimpanan permanen, dan pengingat backup 7 hari.
5. Dashboard: rata-rata profit per unit sekarang dibagi unit TERJUAL (bukan semua unit di Kalkulator). Level 1-4 juga berdasar unit terjual.
6. Perbaikan bug: dropdown unit di AI Eyes dan Riwayat tidak ikut terisi setelah menyimpan unit baru sampai app dibuka ulang.

## Struktur File

```
index.html          Struktur halaman & semua tab modul
manifest.json       Konfigurasi PWA
service-worker.js   Cache offline-first (cache ffm-toolkit-v5)
css/style.css       Styling
js/auth.js          Login gate lokal & ganti password
js/db.js            Wrapper IndexedDB + exportAll/replaceAll (backup)
js/app.js           Logika semua modul
js/backup.js        Backup, restore, ekspor CSV (baru di v1.1)
js/data-*.js        Data Ad Generator, AI Eyes, Script Assistant
icons/              Ikon PWA & logo brand
```

## Deploy

Static site tanpa build step (Vercel atau hosting statis lain). Origin harus tetap sama dengan versi Pro v1 supaya data pengguna lama (IndexedDB per-domain) tidak hilang. Struktur IndexedDB tidak berubah (versi 2), jadi upgrade dari Pro v1 aman.

## Login

Username `flipper`, password awal `FFMffm`, wajib diganti saat login pertama. Ini gerbang lokal (bukan autentikasi server). Password tidak ikut masuk file backup.

## Arsip

Versi MVP v2 dan ffm-pro-backend sudah dipindahkan ke folder `Arsip` dan tidak dipakai lagi.
