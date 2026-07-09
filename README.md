# FFM Toolkit Pro

Progressive Web App (PWA) offline-first untuk menjalankan bisnis flipping mobil bekas, dari riset unit sampai closing. Bagian dari ekosistem produk digital **Formula Flipping Mobil** oleh Cuan Auto Flip Team.

Semua data (unit, riset, inspeksi, riwayat transaksi) tersimpan lokal di device buyer lewat IndexedDB — tidak ada server database untuk data bisnis. Satu-satunya panggilan ke server terjadi sekali, saat buyer menukar kode pembelian Pro (lihat [FFM Pro Backend](#modul-pro--sistem-unlock)).

## Fitur

**Tersedia untuk semua pengguna:**

| Modul | Fungsi |
|---|---|
| Kalkulator Untung Unit | Hitung kelayakan beli satu unit berbasis Value Gap, ROI, dan profit per hari |
| Checklist Risiko | Skor cepat 10 aspek sebelum deal (skala 0-2 per aspek) |
| Ad Generator | 50+ headline, caption, formula, dan template copy iklan siap pakai |

**Terbuka setelah aktivasi kode Pro:**

| Modul | Fungsi |
|---|---|
| Riset Pasar | Log listing harian dari berbagai platform, hitung Value Gap, tandai calon unit |
| AI Eyes Inspection | Skoring 7 pilar berbobot (Data Awal, Eksterior, Interior, Mesin, Kelistrikan, Dokumen, Potensi Cuan) dengan lampiran foto |
| Script Assistant | 100+ script chat siap pakai, 7 kategori sesuai tahap transaksi, bisa dicari |
| 3 Kotak Uang | Alokasi modal (Capital/Operation/Profit) dan tracking cash flow bulanan |
| History & Dashboard | Riwayat transaksi otomatis dari Kalkulator, ringkasan performa, dan level flipper |

## Login Default

```
Username: flipper
Password: FFMffm
```

Password wajib diganti saat login pertama. Ini gerbang lokal untuk UX, bukan autentikasi server — kalau password lupa, satu-satunya cara reset adalah clear semua data situs di browser (yang juga menghapus seluruh data bisnis tersimpan).

## Struktur File

```
index.html          Struktur halaman & semua tab modul
manifest.json        Konfigurasi PWA (nama, ikon, install)
service-worker.js    Caching offline-first (network-first + fallback)
css/style.css        Seluruh styling
js/auth.js           Login gate & ganti password
js/db.js             Wrapper IndexedDB (semua object store)
js/app.js            Logika seluruh modul + unlock Pro
js/data-adcopy.js    Data Modul Ad Generator
js/data-aieyes.js    Data 7 pilar AI Eyes + formula skor
js/data-scripts.js   Data Script Assistant (7 kategori)
icons/               Ikon PWA & logo brand
```

## Deploy

Static site, tanpa build step. Deploy langsung ke Vercel (atau hosting statis apa pun):

1. Import repo ini sebagai project baru di Vercel, deploy dengan setting default.
2. Pastikan `js/app.js` sudah menunjuk ke URL backend verifikasi kode yang benar (lihat variabel `PRO_VERIFY_URL`).
3. Install sebagai app dari browser (Add to Home Screen) untuk pengalaman penuh offline.

## Modul Pro — Sistem Unlock

App ini sengaja satu origin dengan versi non-Pro (bukan deployment terpisah) supaya data buyer yang sudah ada tidak pernah hilang saat upgrade — IndexedDB terikat per-domain, jadi origin harus tetap sama.

Modul Pro terbuka lewat kode pembelian sekali pakai yang diverifikasi ke backend terpisah ([FFM Pro Backend](https://github.com/) — repo API + admin panel generate kode). Setelah kode valid, status Pro disimpan lokal (`localStorage`/IndexedDB) dan tidak perlu verifikasi ulang kecuali data situs dibersihkan total.

## Catatan Teknis

- Tidak ada framework/build tool — vanilla JS (ES5-friendly), supaya ringan dan mudah di-debug tanpa toolchain.
- IndexedDB versi 2: menambah object store baru untuk modul Pro tanpa pernah menghapus/mengubah store MVP yang sudah ada, jadi upgrade dari versi lama tetap aman.
- Foto pada AI Eyes Inspection otomatis di-resize & dikompres di sisi klien sebelum disimpan, supaya kuota storage device tidak cepat penuh.
