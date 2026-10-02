/* FFM Toolkit v1.1 - Backup, Restore, dan Ekspor Data
   - Backup JSON  : salinan LENGKAP semua data (untuk pindah HP / jaga-jaga hapus app)
   - Restore      : mengganti seluruh data di perangkat dengan isi file backup
   - CSV          : laporan untuk dibuka di Excel / Google Sheets (pemisah titik koma,
                    cocok untuk Excel berbahasa Indonesia). Nilai hasil hitung ditulis
                    sebagai angka, bukan rumus.
   - Salin Unit   : teks tab-separated kolom A-N sheet KALKULATOR_UNIT, tempel di A5.
   Password login TIDAK ikut tersimpan di backup (hanya tersimpan lokal di perangkat). */
(function () {
  "use strict";

  var BACKUP_APP = "ffm-toolkit";
  var BACKUP_FORMAT = 1;
  var REMIND_DAYS = 7;

  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("is-visible"); }, 2600);
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  /* ---------- format helper ---------- */
  function dmy(iso) {
    // "2026-01-15" -> "15/01/2026"; selain itu dikembalikan apa adanya
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    return m ? m[3] + "/" + m[2] + "/" + m[1] : (iso || "");
  }
  function pct(f) {
    if (f === null || f === undefined || isNaN(f)) return "";
    return (f * 100).toFixed(1).replace(".", ",") + "%";
  }
  function n0(v) { return v === null || v === undefined || v === "" || isNaN(v) ? "" : Math.round(v); }

  /* ---------- CSV / TSV ---------- */
  function csvCell(v) {
    v = v === null || v === undefined ? "" : String(v);
    if (/[;"\r\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
    return v;
  }
  function toCSV(header, rows) {
    var lines = [header].concat(rows).map(function (r) { return r.map(csvCell).join(";"); });
    return "﻿" + lines.join("\r\n") + "\r\n";
  }
  function toTSV(rows) {
    return rows.map(function (r) {
      return r.map(function (v) { return String(v === null || v === undefined ? "" : v).replace(/[\t\r\n]+/g, " "); }).join("\t");
    }).join("\r\n");
  }

  function ascending(rows) {
    return rows.slice().sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
  }
  function kodeOf(u, i) { return u.kode || ("U" + (i + 1 < 100 ? ("00" + (i + 1)).slice(-3) : i + 1)); }

  /* Kolom mengikuti sheet Excel Kalkulator Flipping Mobil v1.1 */
  var UNIT_HEADER = ["Kode Unit", "Merek / Model", "Tahun", "Kota / Lokasi", "Harga Pasar Rata-rata", "Harga Beli",
    "Harga Jual Target", "Biaya Poles / Salon", "Biaya Servis / Perbaikan", "Biaya Pajak / Balik Nama",
    "Biaya Kirim / Ekspedisi", "Biaya Lain-lain", "Lama Perputaran (hari)", "Modal Dialokasikan",
    "Total Biaya", "Total Modal Keluar", "Value Gap (%)", "Profit Kotor", "Profit Bersih", "ROI (%)",
    "Profit per Hari", "Status Kelayakan"];
  function unitInputRow(u, i) {
    return [kodeOf(u, i), u.merek, u.tahun || "", u.kota || "", n0(u.hargaPasar), n0(u.hargaBeli), n0(u.hargaJual),
      n0(u.biayaPoles), n0(u.biayaServis), n0(u.biayaPajak), n0(u.biayaKirim), n0(u.biayaLain), n0(u.lamaPutar), ""];
  }
  function unitFullRow(u, i) {
    return unitInputRow(u, i).concat([n0(u.totalBiaya), n0(u.totalModalKeluar), pct(u.valueGap), n0(u.profitKotor),
      n0(u.profitBersih), pct(u.roi), n0(u.profitPerHari), u.status === "-" ? "" : u.status]);
  }

  var RISET_HEADER = ["Tanggal Riset", "Platform", "Merek / Model", "Tahun", "Lokasi", "Harga Listing", "KM", "Catatan",
    "Harga Pasar Rata-rata", "Value Gap (%)", "Calon Unit", "Link Iklan"];
  function risetRow(r) {
    return [dmy(r.tanggal), r.platform, r.merek, r.tahun || "", r.lokasi || "", n0(r.hargaListing), n0(r.km), r.catatan || "",
      n0(r.hargaPasar), pct(r.valueGap), r.calonUnit, r.link || ""];
  }

  var HIST_HEADER = ["Kode Unit", "Merek / Model", "Tahun", "Tanggal Beli", "Tanggal Jual", "Harga Beli", "Total Biaya",
    "Harga Jual", "Profit Bersih", "Lama Terjual (hari)", "Sumber Unit", "Catatan Pelajaran"];
  function histRow(r) {
    return [r.kodeUnit || "", r.merek, r.tahun || "", dmy(r.tglBeli), dmy(r.tglJual), n0(r.hargaBeli), n0(r.totalBiaya),
      n0(r.hargaJual), n0(r.profitBersih), r.lamaTerjual === null || r.lamaTerjual === undefined ? "" : r.lamaTerjual,
      r.sumberUnit || "", r.catatanPelajaran || ""];
  }

  var KOTAK_HEADER = ["Bulan", "Modal Aktif di Unit", "Profit Bulan Ini", "Saldo Capital Box", "Saldo Operation Box",
    "Saldo Profit Box", "Total Modal Bisnis"];
  function kotakRow(r) {
    return [r.bulan, n0(r.modalAktif), n0(r.profitBulan), n0(r.saldoCapital), n0(r.saldoOperation), n0(r.saldoProfit),
      n0((r.saldoCapital || 0) + (r.saldoOperation || 0) + (r.saldoProfit || 0))];
  }

  var CSV_SETS = {
    units: { store: "units", file: "ffm-unit", header: UNIT_HEADER, row: unitFullRow },
    riset: { store: "risetPasar", file: "ffm-riset-pasar", header: RISET_HEADER, row: risetRow },
    history: { store: "historyTransaksi", file: "ffm-riwayat-transaksi", header: HIST_HEADER, row: histRow },
    kotak: { store: "kotakUangTracking", file: "ffm-3-kotak-uang", header: KOTAK_HEADER, row: kotakRow }
  };

  /* ---------- download / clipboard ---------- */
  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(okMsg); } catch (e) { toast("Gagal menyalin"); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }).catch(fallback);
    } else { fallback(); }
  }

  function exportCSV(key) {
    var set = CSV_SETS[key];
    FFMDB.getAll(set.store).then(function (rows) {
      if (!rows.length) { toast("Belum ada data untuk diekspor"); return; }
      var asc = ascending(rows);
      var body = asc.map(function (r, i) { return set.row(r, i); });
      download(set.file + "-" + todayStr() + ".csv", toCSV(set.header, body), "text/csv;charset=utf-8");
      toast("CSV diunduh (" + rows.length + " baris)");
    });
  }

  function copyUnitsForExcel() {
    FFMDB.getAll("units").then(function (rows) {
      if (!rows.length) { toast("Belum ada unit untuk disalin"); return; }
      var body = ascending(rows).map(function (u, i) { return unitInputRow(u, i); });
      copyText(toTSV(body), rows.length + " unit disalin. Tempel di sel A5 sheet KALKULATOR_UNIT");
    });
  }

  /* ---------- Backup JSON ---------- */
  function buildBackup(withPhotos) {
    return FFMDB.exportAll().then(function (stores) {
      if (!withPhotos && stores.aiEyes) {
        stores.aiEyes = stores.aiEyes.map(function (r) {
          var c = Object.assign({}, r);
          c.photoCount = (r.photos && r.photos.length) || 0;
          c.photos = [];
          return c;
        });
      }
      return { app: BACKUP_APP, format: BACKUP_FORMAT, exportedAt: new Date().toISOString(),
        includesPhotos: !!withPhotos, stores: stores };
    });
  }
  function exportJSON() {
    var withPhotos = $("bk-photos").checked;
    buildBackup(withPhotos).then(function (data) {
      download("ffm-backup-" + todayStr() + ".json", JSON.stringify(data), "application/json");
      return FFMDB.setSetting("lastBackupAt", Date.now());
    }).then(function () {
      toast("Backup diunduh. Simpan file ini di tempat aman (Google Drive / WhatsApp ke diri sendiri).");
      renderStatus();
    }).catch(function () { toast("Gagal membuat backup"); });
  }

  function validateBackup(data) {
    if (!data || data.app !== BACKUP_APP || !data.stores || typeof data.stores !== "object") return "File ini bukan backup FFM Toolkit.";
    if (data.format !== BACKUP_FORMAT) return "Versi format backup tidak dikenali.";
    var known = FFMDB.STORES.filter(function (n) { return Array.isArray(data.stores[n]); });
    if (!known.length) return "Backup tidak berisi data.";
    return null;
  }
  function summarize(data) {
    var s = data.stores;
    function c(n) { return (s[n] || []).length; }
    return c("units") + " unit, " + c("risetPasar") + " riset, " + c("aiEyes") + " inspeksi, " +
      c("historyTransaksi") + " riwayat transaksi, " + c("kotakUangTracking") + " bulan tracking";
  }
  function importJSON(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try { data = JSON.parse(reader.result); } catch (e) { toast("File tidak bisa dibaca (bukan JSON valid)"); return; }
      var err = validateBackup(data);
      if (err) { toast(err); return; }
      var msg = "Pulihkan backup tanggal " + String(data.exportedAt || "").slice(0, 10) + "?\n\nIsi: " + summarize(data) +
        ".\n\nPERHATIAN: seluruh data di perangkat ini akan DIGANTI dengan isi backup.";
      if (!window.confirm(msg)) return;
      FFMDB.replaceAll(data.stores).then(function () {
        toast("Backup dipulihkan. Memuat ulang...");
        setTimeout(function () { location.reload(); }, 900);
      }).catch(function () { toast("Gagal memulihkan backup. Data lama tidak diubah."); });
    };
    reader.onerror = function () { toast("Gagal membaca file"); };
    reader.readAsText(file);
  }

  /* ---------- status + penyimpanan permanen ---------- */
  function renderStatus() {
    var box = $("bk-status");
    if (!box) return;
    Promise.all([
      FFMDB.getSetting("lastBackupAt", null),
      FFMDB.getAll("units"), FFMDB.getAll("historyTransaksi"), FFMDB.getAll("risetPasar"),
      (navigator.storage && navigator.storage.persisted) ? navigator.storage.persisted() : Promise.resolve(null)
    ]).then(function (r) {
      var last = r[0], hasData = r[1].length + r[2].length + r[3].length > 0, persisted = r[4];
      var text = "Data tersimpan hanya di perangkat ini. ";
      box.classList.remove("bk-warn");
      if (last) {
        var days = Math.floor((Date.now() - last) / 86400000);
        text += "Backup terakhir: " + new Date(last).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
          (days === 0 ? " (hari ini)." : " (" + days + " hari lalu).");
        if (hasData && days >= REMIND_DAYS) { text += " Sudah lebih dari " + REMIND_DAYS + " hari, sebaiknya backup lagi."; box.classList.add("bk-warn"); }
      } else {
        text += "Belum pernah backup.";
        if (hasData) { text += " Unduh backup sekarang supaya data aman kalau aplikasi terhapus."; box.classList.add("bk-warn"); }
      }
      if (persisted === false) text += " Penyimpanan permanen belum aktif: pasang aplikasi ke layar utama agar data lebih tahan terhapus otomatis.";
      box.textContent = text;
    }).catch(function () {});
  }

  function requestPersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(renderStatus, renderStatus);
      }
    } catch (e) { /* abaikan */ }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!$("backup-card")) return;
    $("bk-export-json").addEventListener("click", exportJSON);
    $("bk-import-btn").addEventListener("click", function () { $("bk-import-file").click(); });
    $("bk-import-file").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) importJSON(f);
      e.target.value = "";
    });
    $("bk-copy-units").addEventListener("click", copyUnitsForExcel);
    Array.prototype.forEach.call(document.querySelectorAll("[data-csv]"), function (b) {
      b.addEventListener("click", function () { exportCSV(b.getAttribute("data-csv")); });
    });
    // Refresh status saat tab Dashboard dibuka
    var tab = document.querySelector('.tab-btn[data-tab="dashboard"]');
    if (tab) tab.addEventListener("click", renderStatus);
    requestPersistence();
    renderStatus();
  });
})();
