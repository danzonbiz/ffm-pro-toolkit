(function () {
  "use strict";

  var LS_USER = "ffm_auth_user";
  var LS_SESSION = "ffm_auth_session";
  var DEFAULT_USERNAME = "flipper";
  var DEFAULT_PASSWORD = "FFMffm";

  /* Synchronous, dependency-free hash (cyrb53). Not cryptographic-grade,
     but this gate is a local UX lock, not a real auth server - see note
     to the user. Using this instead of crypto.subtle because SubtleCrypto
     is only available in secure contexts (HTTPS/localhost) and must also
     work over plain LAN HTTP during local testing. */
  function hashPassword(str) {
    var seed = 0x9e3779b9;
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    var num = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return num.toString(36);
  }

  function loadUser() {
    try {
      var raw = localStorage.getItem(LS_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function saveUser(u) {
    try { localStorage.setItem(LS_USER, JSON.stringify(u)); } catch (e) { /* ignore */ }
  }
  function isSessionActive() {
    try { return localStorage.getItem(LS_SESSION) === "1"; } catch (e) { return false; }
  }
  function setSessionActive(active) {
    try {
      if (active) localStorage.setItem(LS_SESSION, "1");
      else localStorage.removeItem(LS_SESSION);
    } catch (e) { /* ignore */ }
  }

  function ensureSeedUser() {
    var u = loadUser();
    if (u) return u;
    var seeded = { username: DEFAULT_USERNAME, passwordHash: hashPassword(DEFAULT_PASSWORD), mustChangePassword: true };
    saveUser(seeded);
    return seeded;
  }

  function show(id) {
    ["auth-screen", "change-password-screen", "app-shell"].forEach(function (s) {
      document.getElementById(s).style.display = (s === id) ? "" : "none";
    });
  }

  function showError(elId, msg) {
    var box = document.getElementById(elId);
    box.textContent = msg;
    box.style.display = msg ? "block" : "none";
  }

  function initLoginScreen() {
    var form = document.getElementById("login-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var username = document.getElementById("login-username").value.trim().toLowerCase();
      var password = document.getElementById("login-password").value;
      showError("login-error", "");
      var user = ensureSeedUser();
      var hash = hashPassword(password);
      if (username === user.username.toLowerCase() && hash === user.passwordHash) {
        setSessionActive(true);
        document.getElementById("login-password").value = "";
        if (user.mustChangePassword) {
          show("change-password-screen");
        } else {
          enterApp();
        }
      } else {
        showError("login-error", "Username atau password salah.");
      }
    });

    var toggle = document.getElementById("login-show-pass");
    toggle.addEventListener("change", function () {
      document.getElementById("login-password").type = toggle.checked ? "text" : "password";
    });
  }

  function initChangePasswordScreen() {
    var form = document.getElementById("changepw-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var p1 = document.getElementById("changepw-new").value;
      var p2 = document.getElementById("changepw-confirm").value;
      showError("changepw-error", "");
      if (p1.length < 6) {
        showError("changepw-error", "Password baru minimal 6 karakter.");
        return;
      }
      if (p1 !== p2) {
        showError("changepw-error", "Konfirmasi password tidak cocok.");
        return;
      }
      var user = loadUser();
      user.passwordHash = hashPassword(p1);
      user.mustChangePassword = false;
      saveUser(user);
      form.reset();
      enterApp();
    });
  }

  function initLogout() {
    var btn = document.getElementById("logout-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      setSessionActive(false);
      document.getElementById("login-username").value = "";
      document.getElementById("login-password").value = "";
      show("auth-screen");
    });
  }

  function enterApp() {
    show("app-shell");
    document.dispatchEvent(new CustomEvent("ffm-authenticated"));
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLoginScreen();
    initChangePasswordScreen();
    initLogout();

    var user = ensureSeedUser();
    if (isSessionActive() && !user.mustChangePassword) {
      enterApp();
    } else if (isSessionActive() && user.mustChangePassword) {
      show("change-password-screen");
    } else {
      show("auth-screen");
    }
  });
})();
