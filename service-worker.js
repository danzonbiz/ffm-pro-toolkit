var CACHE_NAME = "ffm-toolkit-v4";
var APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/auth.js",
  "./js/db.js",
  "./js/app.js",
  "./js/data-adcopy.js",
  "./js/data-aieyes.js",
  "./js/data-scripts.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/logo-caf.png"
];

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // cache each file independently - one missing/failed file must not
      // abort caching of the rest (cache.addAll fails atomically, cache.add does not)
      return Promise.all(
        APP_SHELL.map(function (url) {
          return cache.add(url).catch(function (err) {
            return null; // ignore individual failures, keep install alive
          });
        })
      );
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response && response.status === 200 && response.type === "basic") {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        }
        return response;
      })
      .catch(function () {
        // offline or network failed - fall back to cache, then to the
        // cached app shell (for navigations), then to a real Response
        // as a last resort so respondWith() never resolves to undefined.
        return caches.match(event.request).then(function (cached) {
          if (cached) return cached;
          return caches.match("./index.html").then(function (shell) {
            if (shell) return shell;
            return new Response(
              "Offline dan halaman ini belum tersimpan di cache. Buka ulang saat ada koneksi internet.",
              { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
            );
          });
        });
      })
  );
});
