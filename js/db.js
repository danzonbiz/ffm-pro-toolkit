/* IndexedDB wrapper - FFM Toolkit
   DB_VERSION 2 (Pro): adds risetPasar, aiEyes, kotakUangTracking,
   historyTransaksi, appSettings stores. Existing MVP stores (units,
   checklists, adDrafts) are left untouched by the upgrade - onupgradeneeded
   only ADDS stores that are missing, never drops/recreates existing ones,
   so buyers upgrading from MVP keep every record they already saved. */
var FFMDB = (function () {
  var DB_NAME = "ffmToolkitDB";
  var DB_VERSION = 2;
  var dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains("units")) {
          var unitStore = db.createObjectStore("units", { keyPath: "id", autoIncrement: true });
          unitStore.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("checklists")) {
          var clStore = db.createObjectStore("checklists", { keyPath: "id", autoIncrement: true });
          clStore.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("adDrafts")) {
          var adStore = db.createObjectStore("adDrafts", { keyPath: "id", autoIncrement: true });
          adStore.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("risetPasar")) {
          var rpStore = db.createObjectStore("risetPasar", { keyPath: "id", autoIncrement: true });
          rpStore.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("aiEyes")) {
          var aiStore = db.createObjectStore("aiEyes", { keyPath: "id", autoIncrement: true });
          aiStore.createIndex("createdAt", "createdAt");
          aiStore.createIndex("unitId", "unitId");
        }
        if (!db.objectStoreNames.contains("kotakUangTracking")) {
          var kuStore = db.createObjectStore("kotakUangTracking", { keyPath: "id", autoIncrement: true });
          kuStore.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("historyTransaksi")) {
          var htStore = db.createObjectStore("historyTransaksi", { keyPath: "id", autoIncrement: true });
          htStore.createIndex("createdAt", "createdAt");
          htStore.createIndex("unitId", "unitId");
        }
        if (!db.objectStoreNames.contains("appSettings")) {
          db.createObjectStore("appSettings", { keyPath: "key" });
        }
      };
      req.onsuccess = function (e) { resolve(e.target.result); };
      req.onerror = function (e) { reject(e.target.error); };
    });
    return dbPromise;
  }

  function get(storeName, id) {
    return tx(storeName, "readonly").then(function (store) {
      return new Promise(function (resolve, reject) {
        var req = store.get(id);
        req.onsuccess = function (e) { resolve(e.target.result || null); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getSetting(key, fallback) {
    return tx("appSettings", "readonly").then(function (store) {
      return new Promise(function (resolve, reject) {
        var req = store.get(key);
        req.onsuccess = function (e) {
          resolve(e.target.result ? e.target.result.value : fallback);
        };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function setSetting(key, value) {
    return tx("appSettings", "readwrite").then(function (store) {
      return new Promise(function (resolve, reject) {
        var req = store.put({ key: key, value: value });
        req.onsuccess = function () { resolve(true); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function tx(storeName, mode) {
    return open().then(function (db) {
      return db.transaction(storeName, mode).objectStore(storeName);
    });
  }

  function add(storeName, record) {
    return tx(storeName, "readwrite").then(function (store) {
      return new Promise(function (resolve, reject) {
        record.createdAt = record.createdAt || Date.now();
        var req = store.add(record);
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function put(storeName, record) {
    return tx(storeName, "readwrite").then(function (store) {
      return new Promise(function (resolve, reject) {
        record.updatedAt = Date.now();
        var req = store.put(record);
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function remove(storeName, id) {
    return tx(storeName, "readwrite").then(function (store) {
      return new Promise(function (resolve, reject) {
        var req = store.delete(id);
        req.onsuccess = function () { resolve(true); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getAll(storeName) {
    return tx(storeName, "readonly").then(function (store) {
      return new Promise(function (resolve, reject) {
        var req = store.getAll();
        req.onsuccess = function (e) {
          var rows = e.target.result || [];
          rows.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
          resolve(rows);
        };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  return {
    add: add, put: put, remove: remove, getAll: getAll, get: get,
    getSetting: getSetting, setSetting: setSetting
  };
})();
