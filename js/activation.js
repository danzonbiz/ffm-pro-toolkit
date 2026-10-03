/* Gerbang aktivasi FFM Toolkit v1.1+.
   - Device yang SUDAH pernah dipakai sebelum fitur ini ada (ditandai dengan
     adanya ffm_auth_user di localStorage dari auth.js) otomatis di-grandfather:
     tidak diminta kode, supaya pembeli lama dari masa "tanpa aktivasi" tidak
     terdampak.
   - Device baru (instal pertama kali) wajib masukkan kode aktivasi dulu
     sebelum masuk ke layar login.
   - Kode diverifikasi ke backend yang sama dengan sistem lama (1 kode = 1
     device), lihat 2026-10-03-ffm-pro-backend-v2. */
window.FFMActivation = (function () {
  "use strict";

  var LS_ACTIVATED = "ffm_activated";
  var LS_AUTH_USER = "ffm_auth_user"; // dibaca saja untuk deteksi grandfather, tidak diubah
  var LS_DEVICE_ID = "ffm_device_id";
  var VERIFY_URL = "https://ffm-backend-xi.vercel.app/api/verify-code"; // sesuaikan kalau domain backend berubah

  /* PENTING: deteksi grandfather dilakukan SEKARANG JUGA, saat script ini
     di-load (bukan ditunda sampai DOMContentLoaded) - supaya hasilnya
     terekam SEBELUM auth.js sempat memproses link ?resetpw=1 (yang
     menghapus ffm_auth_user). Kalau urutan ini dibalik, pembeli lama yang
     kebetulan reset password akan salah terdeteksi sebagai device baru
     dan diminta aktivasi padahal seharusnya sudah grandfathered. */
  var _required = (function () {
    try {
      if (localStorage.getItem(LS_ACTIVATED) === "1") return false;
      if (localStorage.getItem(LS_AUTH_USER)) {
        localStorage.setItem(LS_ACTIVATED, "1");
        return false;
      }
      return true;
    } catch (e) {
      return false; // localStorage bermasalah - jangan sampai mengunci user yang sah
    }
  })();

  function isRequired() { return _required; }

  function getDeviceId() {
    try {
      var id = localStorage.getItem(LS_DEVICE_ID);
      if (id) return id;
      id = "dev-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(LS_DEVICE_ID, id);
      return id;
    } catch (e) { return "dev-unknown"; }
  }

  function show(onSuccess) {
    var screen = document.getElementById("activation-screen");
    var form = document.getElementById("activation-form");
    var input = document.getElementById("activation-code-input");
    var errBox = document.getElementById("activation-error");
    var btn = document.getElementById("activation-submit");

    screen.style.display = "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = input.value.trim().toUpperCase();
      errBox.style.display = "none";
      if (!code) {
        errBox.textContent = "Masukkan kode aktivasi dulu.";
        errBox.style.display = "block";
        return;
      }
      btn.disabled = true;
      btn.textContent = "Memeriksa...";
      fetch(VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, deviceId: getDeviceId() })
      }).then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      }).then(function (r) {
        btn.disabled = false;
        btn.textContent = "Aktifkan";
        if (r.ok && r.data && r.data.valid) {
          try { localStorage.setItem(LS_ACTIVATED, "1"); } catch (e) { /* abaikan */ }
          screen.style.display = "none";
          onSuccess();
        } else {
          errBox.textContent = (r.data && r.data.message) || "Kode tidak valid atau sudah dipakai.";
          errBox.style.display = "block";
        }
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = "Aktifkan";
        errBox.textContent = "Gagal terhubung ke server. Pastikan internet aktif lalu coba lagi.";
        errBox.style.display = "block";
      });
    });
  }

  return { isRequired: isRequired, show: show };
})();
