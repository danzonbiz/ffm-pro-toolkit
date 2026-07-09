(function () {
  "use strict";

  /* ---------------- utils ---------------- */
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmtRp(n) {
    n = Math.round(n || 0);
    return "Rp " + n.toLocaleString("id-ID");
  }
  function fmtPct(n) {
    if (n === null || n === undefined || isNaN(n)) return "-";
    return (n * 100).toFixed(1) + "%";
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }
  function toast(msg) {
    var elx = document.getElementById("toast");
    elx.textContent = msg;
    elx.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { elx.classList.remove("is-visible"); }, 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Disalin ke clipboard"); })
        .catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("Disalin ke clipboard"); } catch (e) { toast("Gagal menyalin"); }
    document.body.removeChild(ta);
  }
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  /* ---------------- tab navigation ---------------- */
  document.getElementById("tabbar").addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    switchToTab(btn.dataset.tab);
  });

  function switchToTab(tabKey) {
    document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.toggle("is-active", b.dataset.tab === tabKey); });
    document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.toggle("is-active", p.id === "tab-" + tabKey); });
  }

  /* ---------------- detail modal (shared) ---------------- */
  function openDetailModal(title, rowsArr) {
    document.getElementById("detail-modal-title").textContent = title;
    var body = document.getElementById("detail-modal-body");
    body.innerHTML = "";
    var grid = el("div", { class: "result-grid" });
    rowsArr.forEach(function (r) {
      grid.appendChild(el("div", { class: "result-item" }, [
        el("span", { class: "result-label", text: r[0] }),
        el("span", { class: "result-value", text: r[1] })
      ]));
    });
    body.appendChild(grid);
    document.getElementById("detail-modal").style.display = "flex";
  }
  function closeDetailModal() { document.getElementById("detail-modal").style.display = "none"; }
  document.getElementById("detail-modal-close").addEventListener("click", closeDetailModal);
  document.getElementById("detail-modal").addEventListener("click", function (e) {
    if (e.target.id === "detail-modal") closeDetailModal();
  });

  /* =========================================================
     MODUL 3 - KALKULATOR UNTUNG UNIT
     ========================================================= */
  var unitFieldIds = ["kode", "merek", "tahun", "kota", "hargaPasar", "hargaBeli", "hargaJual",
    "lamaPutar", "biayaPoles", "biayaServis", "biayaPajak", "biayaKirim", "biayaLain"];

  var editingUnitId = null;
  var editingUnitOriginal = null;

  function readUnitForm() {
    var v = {};
    unitFieldIds.forEach(function (id) {
      var input = document.getElementById("unit-" + id);
      v[id] = input.type === "number" ? num(input.value) : input.value;
    });
    return v;
  }

  function computeUnit(v) {
    var totalBiaya = v.biayaPoles + v.biayaServis + v.biayaPajak + v.biayaKirim + v.biayaLain;
    var totalModalKeluar = v.hargaBeli + totalBiaya;
    var valueGap = v.hargaPasar > 0 ? (v.hargaPasar - v.hargaBeli) / v.hargaPasar : null;
    var profitKotor = v.hargaJual - v.hargaBeli;
    var profitBersih = v.hargaJual - totalModalKeluar;
    var roi = totalModalKeluar > 0 ? profitBersih / totalModalKeluar : null;
    var profitPerHari = v.lamaPutar > 0 ? profitBersih / v.lamaPutar : null;
    var status;
    if (valueGap === null || profitBersih === null) status = "-";
    else if (valueGap >= 0.10 && profitBersih > 0) status = "LAYAK";
    else if (valueGap >= 0.05 && profitBersih > 0) status = "PERTIMBANGKAN";
    else status = "TIDAK IDEAL";
    return {
      totalBiaya: totalBiaya, totalModalKeluar: totalModalKeluar, valueGap: valueGap,
      profitKotor: profitKotor, profitBersih: profitBersih, roi: roi,
      profitPerHari: profitPerHari, status: status
    };
  }

  function statusClass(status) {
    if (status === "LAYAK") return "badge-good";
    if (status === "PERTIMBANGKAN") return "badge-warn";
    if (status === "TIDAK IDEAL") return "badge-bad";
    return "badge-neutral";
  }

  function unitLabel(r) {
    return (r.kode ? r.kode + " - " : "") + r.merek + (r.tahun ? " (" + r.tahun + ")" : "");
  }

  function renderUnitResult() {
    var v = readUnitForm();
    var c = computeUnit(v);
    var box = document.getElementById("unit-result");
    box.innerHTML = "";
    box.appendChild(el("div", { class: "result-badge-row" }, [
      el("span", { class: "badge " + statusClass(c.status), text: c.status })
    ]));
    var rows = [
      ["Total Biaya", fmtRp(c.totalBiaya)],
      ["Total Modal Keluar", fmtRp(c.totalModalKeluar)],
      ["Value Gap", fmtPct(c.valueGap)],
      ["Profit Kotor", fmtRp(c.profitKotor)],
      ["Profit Bersih", fmtRp(c.profitBersih)],
      ["ROI", fmtPct(c.roi)],
      ["Profit / Hari", c.profitPerHari === null ? "-" : fmtRp(c.profitPerHari)]
    ];
    var grid = el("div", { class: "result-grid" });
    rows.forEach(function (r) {
      grid.appendChild(el("div", { class: "result-item" }, [
        el("span", { class: "result-label", text: r[0] }),
        el("span", { class: "result-value", text: r[1] })
      ]));
    });
    box.appendChild(grid);
    return { v: v, c: c };
  }

  document.getElementById("unit-form").addEventListener("input", renderUnitResult);

  function resetUnitForm() {
    unitFieldIds.forEach(function (id) {
      var input = document.getElementById("unit-" + id);
      input.value = (id.indexOf("biaya") === 0) ? "0" : "";
    });
    renderUnitResult();
  }
  document.getElementById("unit-reset").addEventListener("click", resetUnitForm);

  function populateUnitForm(r) {
    unitFieldIds.forEach(function (id) {
      document.getElementById("unit-" + id).value = (r[id] === undefined || r[id] === null) ? "" : r[id];
    });
    renderUnitResult();
  }

  function enterEditMode(r) {
    editingUnitId = r.id;
    editingUnitOriginal = r;
    populateUnitForm(r);
    switchToTab("kalkulator");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("unit-edit-banner").style.display = "block";
    document.getElementById("unit-edit-banner-name").textContent = unitLabel(r);
    document.getElementById("unit-cancel-edit").style.display = "";
    document.getElementById("unit-save").textContent = "Update Unit";
  }

  function exitEditMode() {
    editingUnitId = null;
    editingUnitOriginal = null;
    document.getElementById("unit-edit-banner").style.display = "none";
    document.getElementById("unit-cancel-edit").style.display = "none";
    document.getElementById("unit-save").textContent = "Simpan Unit";
  }

  document.getElementById("unit-cancel-edit").addEventListener("click", function () {
    exitEditMode();
    resetUnitForm();
  });

  function openUnitDetail(r) {
    openDetailModal(unitLabel(r), [
      ["Kode Unit", r.kode || "-"],
      ["Merek / Model", r.merek || "-"],
      ["Tahun", r.tahun || "-"],
      ["Kota / Lokasi", r.kota || "-"],
      ["Harga Pasar Rata-rata", fmtRp(r.hargaPasar)],
      ["Harga Beli", fmtRp(r.hargaBeli)],
      ["Harga Jual Target", fmtRp(r.hargaJual)],
      ["Lama Perputaran", (r.lamaPutar || 0) + " hari"],
      ["Biaya Poles / Salon", fmtRp(r.biayaPoles)],
      ["Biaya Servis / Perbaikan", fmtRp(r.biayaServis)],
      ["Biaya Pajak / Balik Nama", fmtRp(r.biayaPajak)],
      ["Biaya Kirim / Ekspedisi", fmtRp(r.biayaKirim)],
      ["Biaya Lain-lain", fmtRp(r.biayaLain)],
      ["Total Biaya", fmtRp(r.totalBiaya)],
      ["Total Modal Keluar", fmtRp(r.totalModalKeluar)],
      ["Value Gap", fmtPct(r.valueGap)],
      ["Profit Kotor", fmtRp(r.profitKotor)],
      ["Profit Bersih", fmtRp(r.profitBersih)],
      ["ROI", fmtPct(r.roi)],
      ["Profit / Hari", (r.profitPerHari === null || r.profitPerHari === undefined) ? "-" : fmtRp(r.profitPerHari)],
      ["Status Kelayakan", r.status],
      ["Disimpan", fmtDate(r.createdAt)]
    ]);
  }

  function renderUnitList() {
    FFMDB.getAll("units").then(function (rows) {
      var box = document.getElementById("unit-list");
      box.innerHTML = "";
      if (!rows.length) {
        box.appendChild(el("p", { class: "empty-state", text: "Belum ada unit tersimpan." }));
      } else {
        rows.forEach(function (r) {
          var card = el("div", { class: "list-card" }, [
            el("div", { class: "list-card-head" }, [
              el("strong", { text: unitLabel(r) }),
              el("span", { class: "badge " + statusClass(r.status), text: r.status })
            ]),
            el("div", { class: "list-card-body", text:
              "Beli " + fmtRp(r.hargaBeli) + " -> Jual " + fmtRp(r.hargaJual) +
              " | Profit Bersih " + fmtRp(r.profitBersih) + " | ROI " + fmtPct(r.roi) }),
            el("div", { class: "list-card-foot" }, [
              el("span", { class: "muted", text: fmtDate(r.createdAt) }),
              el("div", { class: "copy-actions" }, [
                el("button", { class: "btn-link", text: "Detail" }),
                el("button", { class: "btn-link", text: "Edit" }),
                el("button", { class: "btn-link btn-danger", text: "Hapus" })
              ])
            ])
          ]);
          var actionBtns = card.querySelectorAll(".list-card-foot .btn-link");
          actionBtns[0].addEventListener("click", function () { openUnitDetail(r); });
          actionBtns[1].addEventListener("click", function () { enterEditMode(r); });
          actionBtns[2].addEventListener("click", function () {
            FFMDB.remove("units", r.id).then(function () {
              if (editingUnitId === r.id) { exitEditMode(); resetUnitForm(); }
              renderUnitList();
            });
          });
          box.appendChild(card);
        });
      }
      renderUnitSelectForChecklist();
    });
  }

  document.getElementById("unit-save").addEventListener("click", function () {
    var res = renderUnitResult();
    if (!res.v.merek || !res.v.hargaPasar || !res.v.hargaBeli || !res.v.hargaJual) {
      toast("Isi minimal Merek, Harga Pasar, Harga Beli, dan Harga Jual Target");
      return;
    }
    var record = Object.assign({}, res.v, res.c);
    if (editingUnitId) {
      record.id = editingUnitId;
      record.createdAt = editingUnitOriginal ? editingUnitOriginal.createdAt : Date.now();
      FFMDB.put("units", record).then(function () {
        toast("Unit diperbarui");
        exitEditMode();
        resetUnitForm();
        renderUnitList();
      });
    } else {
      FFMDB.add("units", record).then(function () {
        toast("Unit tersimpan");
        resetUnitForm();
        renderUnitList();
      });
    }
  });

  /* =========================================================
     MODUL 2 RINGKAS - CHECKLIST RISIKO
     ========================================================= */
  var RISK_ASPECTS = [
    { key: "harga", label: "Harga", ideal: "10-20% di bawah harga pasar" },
    { key: "tahun", label: "Tahun", ideal: "Maksimal 10 tahun dari tahun berjalan" },
    { key: "km", label: "Kilometer", ideal: "KM wajar untuk umur mobil" },
    { key: "interior", label: "Interior", ideal: "Rapi, bersih, tidak banyak cacat" },
    { key: "eksterior", label: "Eksterior", ideal: "Bebas bekas tabrak besar, karat minimal" },
    { key: "mesin", label: "Mesin & Kaki-kaki", ideal: "Suara halus, tidak ada bunyi aneh" },
    { key: "surat", label: "Surat-surat", ideal: "STNK, BPKB, faktur lengkap & asli" },
    { key: "pajak", label: "Pajak", ideal: "Pajak hidup / denda minimal" },
    { key: "pemilik", label: "Jumlah Pemilik", ideal: "Tidak terlalu banyak ganti tangan" },
    { key: "alasan", label: "Alasan Dijual", ideal: "Logis & masuk akal" }
  ];
  var RISK_SCORE = { OK: 2, WARNING: 1, BAHAYA: 0 };
  var clState = {};
  var MANUAL_OPTION = "__manual__";

  function renderRiskAspects() {
    var box = document.getElementById("cl-aspects");
    box.innerHTML = "";
    RISK_ASPECTS.forEach(function (a) {
      clState[a.key] = clState[a.key] || "OK";
      var row = el("div", { class: "aspect-row" }, [
        el("div", { class: "aspect-info" }, [
          el("span", { class: "aspect-label", text: a.label }),
          el("span", { class: "aspect-ideal", text: a.ideal })
        ]),
        el("div", { class: "segmented", "data-key": a.key })
      ]);
      var seg = row.querySelector(".segmented");
      ["OK", "WARNING", "BAHAYA"].forEach(function (opt) {
        var b = el("button", { type: "button", class: "seg-btn seg-" + opt.toLowerCase(), text: opt });
        if (clState[a.key] === opt) b.classList.add("is-active");
        b.addEventListener("click", function () {
          clState[a.key] = opt;
          seg.querySelectorAll(".seg-btn").forEach(function (x) { x.classList.remove("is-active"); });
          b.classList.add("is-active");
          renderRiskResult();
        });
        seg.appendChild(b);
      });
      box.appendChild(row);
    });
  }

  function computeRisk() {
    var total = 0;
    RISK_ASPECTS.forEach(function (a) { total += RISK_SCORE[clState[a.key]] || 0; });
    var kategori;
    if (total >= 16) kategori = "Sangat Layak";
    else if (total >= 13) kategori = "Perlu Pertimbangan";
    else kategori = "Hindari";
    return { total: total, kategori: kategori };
  }

  function riskBadgeClass(kategori) {
    if (kategori === "Sangat Layak") return "badge-good";
    if (kategori === "Perlu Pertimbangan") return "badge-warn";
    return "badge-bad";
  }

  function renderRiskResult() {
    var r = computeRisk();
    var box = document.getElementById("cl-result");
    box.innerHTML = "";
    box.appendChild(el("div", { class: "result-badge-row" }, [
      el("span", { class: "badge " + riskBadgeClass(r.kategori), text: r.kategori }),
      el("span", { class: "score-text", text: "Skor Total: " + r.total + " / 20" })
    ]));
    return r;
  }

  function renderUnitSelectForChecklist() {
    var select = document.getElementById("cl-unit-select");
    var prevValue = select.value;
    FFMDB.getAll("units").then(function (units) {
      select.innerHTML = "";
      units.slice().reverse().forEach(function (u) {
        select.appendChild(el("option", { value: String(u.id), text: unitLabel(u) }));
      });
      select.appendChild(el("option", { value: MANUAL_OPTION, text: "+ Tulis manual / unit baru" }));
      var hasPrev = prevValue && prevValue !== MANUAL_OPTION && Array.prototype.some.call(select.options, function (o) { return o.value === prevValue; });
      select.value = hasPrev ? prevValue : (units.length ? String(units[units.length - 1].id) : MANUAL_OPTION);
      toggleManualLabelInput();
    });
  }

  function toggleManualLabelInput() {
    var select = document.getElementById("cl-unit-select");
    var isManual = select.value === MANUAL_OPTION || !select.value;
    document.getElementById("cl-label-manual-wrap").style.display = isManual ? "" : "none";
  }
  document.getElementById("cl-unit-select").addEventListener("change", toggleManualLabelInput);

  function resetChecklistForm() {
    RISK_ASPECTS.forEach(function (a) { clState[a.key] = "OK"; });
    document.getElementById("cl-label-manual").value = "";
    document.getElementById("cl-catatan").value = "";
    document.getElementById("cl-date").value = new Date().toISOString().slice(0, 10);
    renderRiskAspects();
    renderRiskResult();
    renderUnitSelectForChecklist();
  }

  function renderChecklistList() {
    FFMDB.getAll("checklists").then(function (rows) {
      var box = document.getElementById("checklist-list");
      box.innerHTML = "";
      if (!rows.length) {
        box.appendChild(el("p", { class: "empty-state", text: "Belum ada checklist tersimpan." }));
        return;
      }
      rows.forEach(function (r) {
        var card = el("div", { class: "list-card" }, [
          el("div", { class: "list-card-head" }, [
            el("strong", { text: r.label || "(tanpa nama)" }),
            el("span", { class: "badge " + riskBadgeClass(r.kategori), text: r.kategori })
          ]),
          el("div", { class: "list-card-body", text: "Skor " + r.total + "/20 | Tanggal " + (r.tanggal || "-") +
            (r.unitId ? " | Terhubung ke data Kalkulator" : "") }),
          el("div", { class: "list-card-foot" }, [
            el("span", { class: "muted", text: fmtDate(r.createdAt) }),
            el("button", { class: "btn-link btn-danger", text: "Hapus" })
          ])
        ]);
        card.querySelector(".btn-danger").addEventListener("click", function () {
          FFMDB.remove("checklists", r.id).then(renderChecklistList);
        });
        box.appendChild(card);
      });
    });
  }

  document.getElementById("cl-save").addEventListener("click", function () {
    var r = computeRisk();
    var select = document.getElementById("cl-unit-select");
    var isManual = select.value === MANUAL_OPTION || !select.value;
    var unitId = isManual ? null : Number(select.value);
    var label = isManual
      ? document.getElementById("cl-label-manual").value
      : select.options[select.selectedIndex].textContent;
    if (isManual && !label) {
      toast("Isi nama/kode unit manual, atau pilih unit dari daftar");
      return;
    }
    var record = {
      unitId: unitId,
      label: label,
      tanggal: document.getElementById("cl-date").value,
      catatan: document.getElementById("cl-catatan").value,
      aspects: Object.assign({}, clState),
      total: r.total,
      kategori: r.kategori
    };
    FFMDB.add("checklists", record).then(function () {
      toast("Checklist tersimpan");
      resetChecklistForm();
      renderChecklistList();
    });
  });
  document.getElementById("cl-reset").addEventListener("click", resetChecklistForm);

  /* =========================================================
     MODUL 5 - AD COPY GENERATOR
     ========================================================= */
  var adgenState = { subtab: "headline" };

  function saveAdDraft(mode, category, text) {
    FFMDB.add("adDrafts", { mode: mode, category: category, text: text }).then(function () {
      toast("Tersimpan ke riwayat");
      renderAdHistory();
    });
  }

  function renderHeadlineOrCaption(dataKey) {
    var data = ADCOPY_DATA[dataKey];
    var wrap = el("div", {});
    var chips = el("div", { class: "chip-row" });
    var listBox = el("div", { class: "card" });
    wrap.appendChild(chips);
    wrap.appendChild(listBox);

    function showCategory(cat) {
      listBox.innerHTML = "";
      listBox.appendChild(el("p", { class: "muted", text: cat.tip }));
      cat.items.forEach(function (text) {
        var row = el("div", { class: "copy-row" }, [
          el("span", { class: "copy-text", text: text }),
          el("div", { class: "copy-actions" }, [
            (function () { var b = el("button", { class: "btn-link", text: "Salin" }); b.addEventListener("click", function () { copyText(text); }); return b; })(),
            (function () { var b = el("button", { class: "btn-link", text: "Simpan" }); b.addEventListener("click", function () { saveAdDraft(dataKey, cat.label, text); }); return b; })()
          ])
        ]);
        listBox.appendChild(row);
      });
    }

    data.categories.forEach(function (cat, idx) {
      var chip = el("button", { class: "chip" + (idx === 0 ? " is-active" : ""), text: cat.label });
      chip.addEventListener("click", function () {
        chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        showCategory(cat);
      });
      chips.appendChild(chip);
    });
    showCategory(data.categories[0]);
    return wrap;
  }

  function renderFormula() {
    var wrap = el("div", {});
    var chips = el("div", { class: "chip-row" });
    var content = el("div", {});
    wrap.appendChild(chips);
    wrap.appendChild(content);

    function showFormula(f) {
      content.innerHTML = "";
      var card = el("div", { class: "card" });
      card.appendChild(el("p", { class: "muted", text: f.full + " - " + f.desc }));
      var inputs = {};
      f.steps.forEach(function (s) {
        var label = el("label", {}, [document.createTextNode(s.label)]);
        var ta = el("textarea", { rows: "2", placeholder: s.hint });
        label.appendChild(ta);
        card.appendChild(label);
        inputs[s.key] = ta;
      });
      var composeBtn = el("button", { type: "button", class: "btn btn-primary", text: "Susun Copy" });
      var resultBox = el("div", { class: "result-card", style: "display:none" });
      card.appendChild(composeBtn);
      card.appendChild(resultBox);

      composeBtn.addEventListener("click", function () {
        var parts = f.steps.map(function (s) { return inputs[s.key].value.trim(); }).filter(Boolean);
        var text = parts.length ? parts.join(" ") : f.example;
        resultBox.style.display = "block";
        resultBox.innerHTML = "";
        resultBox.appendChild(el("p", { text: text }));
        var actions = el("div", { class: "copy-actions" }, [
          (function () { var b = el("button", { class: "btn-link", text: "Salin" }); b.addEventListener("click", function () { copyText(text); }); return b; })(),
          (function () { var b = el("button", { class: "btn-link", text: "Simpan" }); b.addEventListener("click", function () { saveAdDraft("formula", f.name, text); }); return b; })()
        ]);
        resultBox.appendChild(actions);
      });

      var exampleToggle = el("button", { type: "button", class: "btn-link", text: "Lihat contoh lengkap dari ebook" });
      exampleToggle.addEventListener("click", function () {
        resultBox.style.display = "block";
        resultBox.innerHTML = "";
        resultBox.appendChild(el("p", { text: f.example }));
      });
      card.appendChild(exampleToggle);
      content.appendChild(card);
    }

    ADCOPY_DATA.formula.items.forEach(function (f, idx) {
      var chip = el("button", { class: "chip" + (idx === 0 ? " is-active" : ""), text: f.name });
      chip.addEventListener("click", function () {
        chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        showFormula(f);
      });
      chips.appendChild(chip);
    });
    showFormula(ADCOPY_DATA.formula.items[0]);
    return wrap;
  }

  function renderTemplate() {
    var wrap = el("div", { class: "card" });
    ADCOPY_DATA.template.items.forEach(function (t) {
      var box = el("div", { class: "template-box" });
      box.appendChild(el("strong", { text: t.name }));
      box.appendChild(el("p", { class: "muted", text: "Cocok untuk: " + t.cocok }));
      var ta = el("textarea", { rows: "4" });
      ta.value = t.text;
      box.appendChild(ta);
      var actions = el("div", { class: "copy-actions" }, [
        (function () { var b = el("button", { class: "btn-link", text: "Salin" }); b.addEventListener("click", function () { copyText(ta.value); }); return b; })(),
        (function () { var b = el("button", { class: "btn-link", text: "Simpan" }); b.addEventListener("click", function () { saveAdDraft("template", t.name, ta.value); }); return b; })()
      ]);
      box.appendChild(actions);
      wrap.appendChild(box);
    });
    return wrap;
  }

  function renderAdgenContent() {
    var box = document.getElementById("adgen-content");
    box.innerHTML = "";
    if (adgenState.subtab === "headline") box.appendChild(renderHeadlineOrCaption("headline"));
    else if (adgenState.subtab === "caption") box.appendChild(renderHeadlineOrCaption("caption"));
    else if (adgenState.subtab === "formula") box.appendChild(renderFormula());
    else if (adgenState.subtab === "template") box.appendChild(renderTemplate());
  }

  document.getElementById("adgen-subtabbar").addEventListener("click", function (e) {
    var btn = e.target.closest(".subtab-btn");
    if (!btn) return;
    document.querySelectorAll(".subtab-btn").forEach(function (b) { b.classList.remove("is-active"); });
    btn.classList.add("is-active");
    adgenState.subtab = btn.dataset.subtab;
    renderAdgenContent();
  });

  function renderAdChecklist() {
    var ul = document.getElementById("adgen-checklist");
    ul.innerHTML = "";
    ADCOPY_DATA.checklistCopy.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
  }

  function renderAdHistory() {
    FFMDB.getAll("adDrafts").then(function (rows) {
      var box = document.getElementById("adgen-history");
      box.innerHTML = "";
      if (!rows.length) {
        box.appendChild(el("p", { class: "empty-state", text: "Belum ada copy tersimpan." }));
        return;
      }
      rows.forEach(function (r) {
        var card = el("div", { class: "list-card" }, [
          el("div", { class: "list-card-head" }, [
            el("strong", { text: r.category || r.mode })
          ]),
          el("div", { class: "list-card-body", text: r.text }),
          el("div", { class: "list-card-foot" }, [
            el("span", { class: "muted", text: fmtDate(r.createdAt) }),
            el("span", {}, [])
          ])
        ]);
        var foot = card.querySelector(".list-card-foot");
        var copyBtn = el("button", { class: "btn-link", text: "Salin" });
        copyBtn.addEventListener("click", function () { copyText(r.text); });
        var delBtn = el("button", { class: "btn-link btn-danger", text: "Hapus" });
        delBtn.addEventListener("click", function () { FFMDB.remove("adDrafts", r.id).then(renderAdHistory); });
        foot.appendChild(copyBtn);
        foot.appendChild(delBtn);
        box.appendChild(card);
      });
    });
  }


  /* =========================================================
     PRO: UPGRADE / UNLOCK
     ========================================================= */
  var PRO_VERIFY_URL = "https://ffm-backend-xi.vercel.app/api/verify-code";
  var proUnlocked = false;

  function getDeviceId() {
    return FFMDB.getSetting("device_id", null).then(function (id) {
      if (id) return id;
      var newId = "dev-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
      return FFMDB.setSetting("device_id", newId).then(function () { return newId; });
    });
  }

  function applyProVisibility(unlocked) {
    proUnlocked = unlocked;
    document.querySelectorAll(".pro-tab").forEach(function (b) { b.style.display = unlocked ? "" : "none"; });
    document.getElementById("pro-badge").style.display = unlocked ? "" : "none";
    document.getElementById("upgrade-pro-btn").style.display = unlocked ? "none" : "";
    if (unlocked) {
      renderUnitSelectForAI();
      renderPillars();
      renderAIResult();
      renderAIList();
      renderRisetResult();
      renderRisetList();
      renderScriptSubtabbar();
      renderScriptContent();
      renderKotakUangSettings();
      renderKotakUangTracking();
      renderUnitSelectForHistory();
      renderHistoryList();
      renderDashboardSummary();
    }
  }

  function openUpgradeModal() { document.getElementById("upgrade-modal").style.display = "flex"; }
  function closeUpgradeModal() {
    document.getElementById("upgrade-modal").style.display = "none";
    document.getElementById("upgrade-error").style.display = "none";
    document.getElementById("upgrade-code-input").value = "";
  }
  document.getElementById("upgrade-pro-btn").addEventListener("click", openUpgradeModal);
  document.getElementById("upgrade-modal-close").addEventListener("click", closeUpgradeModal);
  document.getElementById("upgrade-modal").addEventListener("click", function (e) {
    if (e.target.id === "upgrade-modal") closeUpgradeModal();
  });

  document.getElementById("upgrade-submit").addEventListener("click", function () {
    var input = document.getElementById("upgrade-code-input");
    var code = input.value.trim().toUpperCase();
    var errBox = document.getElementById("upgrade-error");
    errBox.style.display = "none";
    if (!code) { errBox.textContent = "Masukkan kode pembelian dulu."; errBox.style.display = "block"; return; }
    var btn = document.getElementById("upgrade-submit");
    btn.disabled = true;
    btn.textContent = "Memeriksa...";
    getDeviceId().then(function (deviceId) {
      return fetch(PRO_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, deviceId: deviceId })
      });
    }).then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        btn.disabled = false; btn.textContent = "Aktifkan Pro";
        if (r.ok && r.data && r.data.valid) {
          FFMDB.setSetting("pro_unlocked", true).then(function () {
            closeUpgradeModal();
            applyProVisibility(true);
            toast("Pro aktif! Semua modul terbuka.");
          });
        } else {
          errBox.textContent = (r.data && r.data.message) || "Kode tidak valid atau sudah dipakai.";
          errBox.style.display = "block";
        }
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Aktifkan Pro";
        errBox.textContent = "Gagal terhubung ke server verifikasi. Pastikan internet aktif lalu coba lagi.";
        errBox.style.display = "block";
      });
  });

  /* =========================================================
     MODUL 1 (PRO) - RISET PASAR & VALUE GAP SCANNER
     ========================================================= */
  var risetFieldIds = ["tanggal", "platform", "merek", "tahun", "lokasi", "hargaListing", "km", "hargaPasar", "link", "catatan"];
  var risetNumFields = { hargaListing: 1, km: 1, hargaPasar: 1, tahun: 1 };

  function readRisetForm() {
    var v = {};
    risetFieldIds.forEach(function (id) {
      var input = document.getElementById("riset-" + id);
      v[id] = risetNumFields[id] ? num(input.value) : input.value;
    });
    return v;
  }
  function computeRiset(v) {
    var valueGap = v.hargaPasar > 0 ? (v.hargaPasar - v.hargaListing) / v.hargaPasar : null;
    var calonUnit = valueGap !== null && valueGap >= 0.10 ? "Ya" : "Tidak";
    return { valueGap: valueGap, calonUnit: calonUnit };
  }
  function renderRisetResult() {
    var v = readRisetForm();
    var c = computeRiset(v);
    var box = document.getElementById("riset-result");
    box.innerHTML = "";
    box.appendChild(el("div", { class: "result-badge-row" }, [
      el("span", { class: "badge " + (c.calonUnit === "Ya" ? "badge-good" : "badge-neutral"), text: "Calon Unit: " + c.calonUnit }),
      el("span", { class: "score-text", text: "Value Gap: " + fmtPct(c.valueGap) })
    ]));
    return { v: v, c: c };
  }
  risetFieldIds.forEach(function (id) {
    var elx = document.getElementById("riset-" + id);
    if (elx) elx.addEventListener("input", renderRisetResult);
  });
  function resetRisetForm() {
    risetFieldIds.forEach(function (id) { document.getElementById("riset-" + id).value = ""; });
    document.getElementById("riset-platform").value = "OLX";
    document.getElementById("riset-tanggal").value = new Date().toISOString().slice(0, 10);
    renderRisetResult();
  }
  document.getElementById("riset-save").addEventListener("click", function () {
    var res = renderRisetResult();
    if (!res.v.merek || !res.v.hargaListing || !res.v.hargaPasar) {
      toast("Isi minimal Merek, Harga Listing, dan Harga Pasar");
      return;
    }
    var record = Object.assign({}, res.v, res.c);
    FFMDB.add("risetPasar", record).then(function () {
      toast("Riset tersimpan");
      resetRisetForm();
      renderRisetList();
    });
  });
  document.getElementById("riset-reset").addEventListener("click", resetRisetForm);

  function renderRisetList() {
    FFMDB.getAll("risetPasar").then(function (rows) {
      var box = document.getElementById("riset-list");
      box.innerHTML = "";
      if (!rows.length) { box.appendChild(el("p", { class: "empty-state", text: "Belum ada riset tersimpan." })); return; }
      rows.forEach(function (r) {
        var card = el("div", { class: "list-card" }, [
          el("div", { class: "list-card-head" }, [
            el("strong", { text: r.merek + (r.tahun ? " (" + r.tahun + ")" : "") }),
            el("span", { class: "badge " + (r.calonUnit === "Ya" ? "badge-good" : "badge-neutral"), text: r.calonUnit })
          ]),
          el("div", { class: "list-card-body", text: r.platform + " | Listing " + fmtRp(r.hargaListing) + " -> Pasar " + fmtRp(r.hargaPasar) + " | Gap " + fmtPct(r.valueGap) }),
          el("div", { class: "list-card-foot" }, [
            el("span", { class: "muted", text: fmtDate(r.createdAt) }),
            el("div", { class: "copy-actions" }, [
              el("button", { class: "btn-link", text: "Jadikan Unit" }),
              el("button", { class: "btn-link btn-danger", text: "Hapus" })
            ])
          ])
        ]);
        var btns = card.querySelectorAll(".list-card-foot .btn-link");
        btns[0].addEventListener("click", function () {
          switchToTab("kalkulator");
          document.getElementById("unit-merek").value = r.merek || "";
          document.getElementById("unit-tahun").value = r.tahun || "";
          document.getElementById("unit-kota").value = r.lokasi || "";
          document.getElementById("unit-hargaPasar").value = r.hargaPasar || "";
          document.getElementById("unit-hargaBeli").value = r.hargaListing || "";
          renderUnitResult();
          toast("Data riset dipindah ke Kalkulator");
        });
        btns[1].addEventListener("click", function () {
          FFMDB.remove("risetPasar", r.id).then(renderRisetList);
        });
        box.appendChild(card);
      });
    });
  }

  /* =========================================================
     MODUL 2 (PRO) - AI EYES INSPECTION 7 PILAR
     ========================================================= */
  var aiState = { scores: {}, photos: [] };
  AIEYES_PILLARS.forEach(function (p) { if (p.manual) aiState.scores[p.key] = p.aspects.map(function () { return 3; }); });

  function renderUnitSelectForAI() {
    var select = document.getElementById("ai-unit-select");
    var prevValue = select.value;
    FFMDB.getAll("units").then(function (units) {
      select.innerHTML = "";
      units.slice().reverse().forEach(function (u) {
        select.appendChild(el("option", { value: String(u.id), text: unitLabel(u) }));
      });
      select.appendChild(el("option", { value: MANUAL_OPTION, text: "+ Tulis manual / unit baru" }));
      var hasPrev = prevValue && prevValue !== MANUAL_OPTION && Array.prototype.some.call(select.options, function (o) { return o.value === prevValue; });
      select.value = hasPrev ? prevValue : (units.length ? String(units[units.length - 1].id) : MANUAL_OPTION);
      toggleAIManualInput();
      renderPillars();
      renderAIResult();
    });
  }
  function toggleAIManualInput() {
    var select = document.getElementById("ai-unit-select");
    var isManual = select.value === MANUAL_OPTION || !select.value;
    document.getElementById("ai-label-manual-wrap").style.display = isManual ? "" : "none";
  }
  document.getElementById("ai-unit-select").addEventListener("change", function () {
    toggleAIManualInput();
    renderPillars();
    renderAIResult();
  });

  function getSelectedAIUnit() {
    return new Promise(function (resolve) {
      var select = document.getElementById("ai-unit-select");
      if (!select.value || select.value === MANUAL_OPTION) { resolve(null); return; }
      FFMDB.get("units", Number(select.value)).then(resolve).catch(function () { resolve(null); });
    });
  }

  function renderPillars() {
    var box = document.getElementById("ai-pillars");
    box.innerHTML = "";
    getSelectedAIUnit().then(function (unit) {
      AIEYES_PILLARS.forEach(function (p) {
        var card = el("div", { class: "card pillar-card" }, [
          el("div", { class: "pillar-title", text: p.label + " (bobot " + Math.round(p.weight * 100) + "%)" })
        ]);
        if (p.manual) {
          p.aspects.forEach(function (aspectLabel, idx) {
            var row = el("div", { class: "aspect-score-row" }, [
              el("span", { class: "aspect-label", text: aspectLabel }),
              el("div", { class: "score-btns", "data-pillar": p.key, "data-idx": String(idx) })
            ]);
            var btnsWrap = row.querySelector(".score-btns");
            for (var n = 1; n <= 5; n++) {
              (function (n) {
                var b = el("button", { type: "button", class: "score-btn", text: String(n) });
                if (aiState.scores[p.key][idx] === n) b.classList.add("is-active");
                b.addEventListener("click", function () {
                  aiState.scores[p.key][idx] = n;
                  btnsWrap.querySelectorAll(".score-btn").forEach(function (x) { x.classList.remove("is-active"); });
                  b.classList.add("is-active");
                  renderAIResult();
                });
                btnsWrap.appendChild(b);
              })(n);
            }
            card.appendChild(row);
          });
        } else {
          var gap = unit ? unit.valueGap : null;
          var skor = aiEyesSkorCuanDariValueGap(gap);
          card.appendChild(el("div", { class: "pillar-auto-note", text: unit
            ? ("Otomatis dari Value Gap unit terpilih (" + fmtPct(gap) + ") -> skor " + (skor || "-") + "/5"
              )
            : "Pilih unit dari Kalkulator/Riset Pasar dulu supaya pilar ini terisi otomatis. Kalau manual, dianggap skor netral (3)." }));
        }
        box.appendChild(card);
      });
    });
  }

  function computeAIResult() {
    return getSelectedAIUnit().then(function (unit) {
      var pillarScores = {};
      AIEYES_PILLARS.forEach(function (p) {
        if (p.manual) {
          var arr = aiState.scores[p.key];
          pillarScores[p.key] = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
        } else {
          var skor = unit ? aiEyesSkorCuanDariValueGap(unit.valueGap) : null;
          pillarScores[p.key] = skor === null ? 3 : skor;
        }
      });
      var total = 0, count = 0;
      AIEYES_PILLARS.forEach(function (p) { total += pillarScores[p.key]; count++; });
      var aiScore = total / count;
      var kategori = aiEyesKategori(aiScore);
      return { pillarScores: pillarScores, aiScore: aiScore, kategori: kategori, unit: unit };
    });
  }

  function renderAIResult() {
    computeAIResult().then(function (r) {
      var box = document.getElementById("ai-result");
      box.innerHTML = "";
      box.appendChild(el("div", { class: "result-badge-row" }, [
        el("span", { class: "badge " + statusClass(r.kategori.label === "Layak Beli" ? "LAYAK" : r.kategori.label === "Hindari" ? "TIDAK IDEAL" : "PERTIMBANGKAN"), text: r.kategori.label }),
        el("span", { class: "score-text", text: "AI Score: " + r.aiScore.toFixed(2) + " / 5" })
      ]));
      box.appendChild(el("p", { class: "muted", text: r.kategori.desc }));
    });
  }

  function resizeImageFile(file) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var maxW = 1280;
          var scale = img.width > maxW ? maxW / img.width : 1;
          var canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = function () { resolve(null); };
        img.src = e.target.result;
      };
      reader.onerror = function () { resolve(null); };
      reader.readAsDataURL(file);
    });
  }

  var aiPhotosInput = document.getElementById("ai-photos");
  if (aiPhotosInput) {
    aiPhotosInput.addEventListener("change", function () {
      var files = Array.prototype.slice.call(aiPhotosInput.files || []);
      Promise.all(files.map(resizeImageFile)).then(function (dataUrls) {
        dataUrls.filter(Boolean).forEach(function (u) { aiState.photos.push(u); });
        renderAIPhotoPreview();
        aiPhotosInput.value = "";
      });
    });
  }
  function renderAIPhotoPreview() {
    var box = document.getElementById("ai-photo-preview");
    box.innerHTML = "";
    aiState.photos.forEach(function (src, idx) {
      var wrap = el("div", {});
      var img = el("img", { class: "photo-thumb", src: src });
      wrap.appendChild(img);
      box.appendChild(wrap);
    });
  }

  function resetAIForm() {
    AIEYES_PILLARS.forEach(function (p) { if (p.manual) aiState.scores[p.key] = p.aspects.map(function () { return 3; }); });
    aiState.photos = [];
    document.getElementById("ai-label-manual").value = "";
    renderAIPhotoPreview();
    renderPillars();
    renderAIResult();
  }
  document.getElementById("ai-reset").addEventListener("click", resetAIForm);

  document.getElementById("ai-save").addEventListener("click", function () {
    var select = document.getElementById("ai-unit-select");
    var isManual = select.value === MANUAL_OPTION || !select.value;
    var unitId = isManual ? null : Number(select.value);
    var label = isManual ? document.getElementById("ai-label-manual").value : select.options[select.selectedIndex].textContent;
    if (isManual && !label) { toast("Isi nama/kode unit manual, atau pilih unit dari daftar"); return; }
    computeAIResult().then(function (r) {
      var record = {
        unitId: unitId, label: label,
        scores: JSON.parse(JSON.stringify(aiState.scores)),
        pillarScores: r.pillarScores, aiScore: r.aiScore, kategori: r.kategori.label,
        photos: aiState.photos.slice()
      };
      FFMDB.add("aiEyes", record).then(function () {
        toast("Inspeksi AI Eyes tersimpan");
        resetAIForm();
        renderAIList();
      });
    });
  });

  function renderAIList() {
    FFMDB.getAll("aiEyes").then(function (rows) {
      var box = document.getElementById("ai-list");
      box.innerHTML = "";
      if (!rows.length) { box.appendChild(el("p", { class: "empty-state", text: "Belum ada inspeksi tersimpan." })); return; }
      rows.forEach(function (r) {
        var card = el("div", { class: "list-card" }, [
          el("div", { class: "list-card-head" }, [
            el("strong", { text: r.label || "(tanpa nama)" }),
            el("span", { class: "badge " + (r.kategori === "Layak Beli" ? "badge-good" : r.kategori === "Hindari" ? "badge-bad" : "badge-warn"), text: r.kategori })
          ]),
          el("div", { class: "list-card-body", text: "AI Score " + r.aiScore.toFixed(2) + "/5" + (r.photos && r.photos.length ? " | " + r.photos.length + " foto" : "") }),
          el("div", { class: "list-card-foot" }, [
            el("span", { class: "muted", text: fmtDate(r.createdAt) }),
            el("button", { class: "btn-link btn-danger", text: "Hapus" })
          ])
        ]);
        card.querySelector(".btn-danger").addEventListener("click", function () {
          FFMDB.remove("aiEyes", r.id).then(renderAIList);
        });
        box.appendChild(card);
      });
    });
  }

  /* =========================================================
     MODUL 4 (PRO) - SCRIPT ASSISTANT
     ========================================================= */
  var scriptState = { catKey: SCRIPT_DATA.categories[0].key };

  function renderScriptSubtabbar() {
    var box = document.getElementById("script-subtabbar");
    box.innerHTML = "";
    SCRIPT_DATA.categories.forEach(function (cat) {
      var b = el("button", { class: "subtab-btn" + (cat.key === scriptState.catKey ? " is-active" : ""), text: cat.label });
      b.addEventListener("click", function () {
        scriptState.catKey = cat.key;
        document.getElementById("script-search").value = "";
        box.querySelectorAll(".subtab-btn").forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        renderScriptContent();
      });
      box.appendChild(b);
    });
  }

  function scriptItemRow(text) {
    return el("div", { class: "copy-row" }, [
      el("span", { class: "copy-text", text: text }),
      (function () {
        var b = el("button", { class: "btn-link", text: "Salin" });
        b.addEventListener("click", function () { copyText(text); });
        return b;
      })()
    ]);
  }

  function renderScriptContent() {
    var box = document.getElementById("script-content");
    box.innerHTML = "";
    var q = (document.getElementById("script-search").value || "").trim().toLowerCase();
    if (q) {
      SCRIPT_DATA.categories.forEach(function (cat) {
        cat.groups.forEach(function (g) {
          var matches = g.items.filter(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
          if (matches.length) {
            box.appendChild(el("div", { class: "script-group-title", text: cat.label + " - " + g.sub }));
            var card = el("div", { class: "card" });
            matches.forEach(function (t) { card.appendChild(scriptItemRow(t)); });
            box.appendChild(card);
          }
        });
      });
      if (!box.children.length) box.appendChild(el("p", { class: "empty-state", text: "Tidak ada script yang cocok." }));
      return;
    }
    var cat = SCRIPT_DATA.categories.filter(function (c) { return c.key === scriptState.catKey; })[0];
    cat.groups.forEach(function (g) {
      box.appendChild(el("div", { class: "script-group-title", text: g.sub }));
      var card = el("div", { class: "card" });
      g.items.forEach(function (t) { card.appendChild(scriptItemRow(t)); });
      box.appendChild(card);
    });
  }
  var scriptSearchInput = document.getElementById("script-search");
  if (scriptSearchInput) scriptSearchInput.addEventListener("input", renderScriptContent);

  /* =========================================================
     MODUL 6 (PRO) - 3 KOTAK UANG & CASH FLOW
     ========================================================= */
  function readKotakUangSettingsForm() {
    return {
      modalAwal: num(document.getElementById("ku-modalAwal").value),
      pctCapital: num(document.getElementById("ku-pctCapital").value),
      pctOperation: num(document.getElementById("ku-pctOperation").value),
      pctProfit: num(document.getElementById("ku-pctProfit").value)
    };
  }
  function renderKotakUangSettingsResult(v) {
    var box = document.getElementById("ku-settings-result");
    box.innerHTML = "";
    box.appendChild(el("div", { class: "result-grid" }, [
      el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Capital Box" }), el("span", { class: "result-value", text: fmtRp(v.modalAwal * v.pctCapital) })]),
      el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Operation Box" }), el("span", { class: "result-value", text: fmtRp(v.modalAwal * v.pctOperation) })]),
      el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Profit Box" }), el("span", { class: "result-value", text: fmtRp(v.modalAwal * v.pctProfit) })])
    ]));
  }
  ["ku-modalAwal", "ku-pctCapital", "ku-pctOperation", "ku-pctProfit"].forEach(function (id) {
    var elx = document.getElementById(id);
    if (elx) elx.addEventListener("input", function () { renderKotakUangSettingsResult(readKotakUangSettingsForm()); });
  });
  function renderKotakUangSettings() {
    FFMDB.getSetting("kotakUang_settings", null).then(function (saved) {
      if (saved) {
        document.getElementById("ku-modalAwal").value = saved.modalAwal || "";
        document.getElementById("ku-pctCapital").value = saved.pctCapital != null ? saved.pctCapital : 0.8;
        document.getElementById("ku-pctOperation").value = saved.pctOperation != null ? saved.pctOperation : 0.05;
        document.getElementById("ku-pctProfit").value = saved.pctProfit != null ? saved.pctProfit : 0.15;
      }
      renderKotakUangSettingsResult(readKotakUangSettingsForm());
    });
  }
  document.getElementById("ku-settings-save").addEventListener("click", function () {
    var v = readKotakUangSettingsForm();
    FFMDB.setSetting("kotakUang_settings", v).then(function () { toast("Pengaturan modal tersimpan"); });
  });

  function renderKotakUangTracking() {
    FFMDB.getAll("kotakUangTracking").then(function (rows) {
      var box = document.getElementById("ku-tracking-list");
      box.innerHTML = "";
      if (!rows.length) { box.appendChild(el("p", { class: "empty-state", text: "Belum ada tracking bulanan." })); return; }
      rows.forEach(function (r) {
        var totalModalBisnis = r.saldoCapital + r.saldoOperation + r.saldoProfit;
        var card = el("div", { class: "list-card" }, [
          el("div", { class: "list-card-head" }, [el("strong", { text: r.bulan })]),
          el("div", { class: "list-card-body", text: "Modal Aktif " + fmtRp(r.modalAktif) + " | Profit " + fmtRp(r.profitBulan) + " | Total Modal Bisnis " + fmtRp(totalModalBisnis) }),
          el("div", { class: "list-card-foot" }, [
            el("span", { class: "muted", text: fmtDate(r.createdAt) }),
            el("button", { class: "btn-link btn-danger", text: "Hapus" })
          ])
        ]);
        card.querySelector(".btn-danger").addEventListener("click", function () {
          FFMDB.remove("kotakUangTracking", r.id).then(function () { renderKotakUangTracking(); renderDashboardSummary(); });
        });
        box.appendChild(card);
      });
    });
  }
  document.getElementById("ku-tracking-save").addEventListener("click", function () {
    var record = {
      bulan: document.getElementById("ku-bulan").value,
      modalAktif: num(document.getElementById("ku-modalAktif").value),
      profitBulan: num(document.getElementById("ku-profitBulan").value),
      saldoCapital: num(document.getElementById("ku-saldoCapital").value),
      saldoOperation: num(document.getElementById("ku-saldoOperation").value),
      saldoProfit: num(document.getElementById("ku-saldoProfit").value)
    };
    if (!record.bulan) { toast("Isi nama bulan dulu, mis. Jan 2026"); return; }
    FFMDB.add("kotakUangTracking", record).then(function () {
      toast("Tracking bulan ini tersimpan");
      ["ku-bulan", "ku-modalAktif", "ku-profitBulan", "ku-saldoCapital", "ku-saldoOperation", "ku-saldoProfit"].forEach(function (id) { document.getElementById(id).value = ""; });
      renderKotakUangTracking();
      renderDashboardSummary();
    });
  });

  /* =========================================================
     MODUL 7 (PRO) - HISTORY & DASHBOARD
     ========================================================= */
  function renderUnitSelectForHistory() {
    var select = document.getElementById("hist-unit-select");
    FFMDB.getAll("units").then(function (units) {
      select.innerHTML = "";
      if (!units.length) { select.appendChild(el("option", { value: "", text: "(belum ada unit di Kalkulator)" })); return; }
      units.slice().reverse().forEach(function (u) { select.appendChild(el("option", { value: String(u.id), text: unitLabel(u) })); });
    });
  }
  document.getElementById("hist-save").addEventListener("click", function () {
    var select = document.getElementById("hist-unit-select");
    if (!select.value) { toast("Belum ada unit tersimpan di Kalkulator"); return; }
    var tglBeli = document.getElementById("hist-tglBeli").value;
    var tglJual = document.getElementById("hist-tglJual").value;
    FFMDB.get("units", Number(select.value)).then(function (unit) {
      if (!unit) { toast("Unit tidak ditemukan"); return; }
      var lamaTerjual = (tglBeli && tglJual) ? Math.round((new Date(tglJual) - new Date(tglBeli)) / 86400000) : null;
      var record = {
        unitId: unit.id, kodeUnit: unit.kode, merek: unit.merek, tahun: unit.tahun,
        tglBeli: tglBeli, tglJual: tglJual,
        hargaBeli: unit.hargaBeli, totalBiaya: unit.totalBiaya, hargaJual: unit.hargaJual, profitBersih: unit.profitBersih,
        lamaTerjual: lamaTerjual,
        sumberUnit: document.getElementById("hist-sumber").value,
        catatanPelajaran: document.getElementById("hist-catatan").value
      };
      FFMDB.add("historyTransaksi", record).then(function () {
        toast("Riwayat transaksi tersimpan");
        document.getElementById("hist-tglBeli").value = "";
        document.getElementById("hist-tglJual").value = "";
        document.getElementById("hist-sumber").value = "";
        document.getElementById("hist-catatan").value = "";
        renderHistoryList();
        renderDashboardSummary();
      });
    });
  });

  function renderHistoryList() {
    FFMDB.getAll("historyTransaksi").then(function (rows) {
      var box = document.getElementById("hist-list");
      box.innerHTML = "";
      if (!rows.length) { box.appendChild(el("p", { class: "empty-state", text: "Belum ada riwayat transaksi." })); return; }
      rows.forEach(function (r) {
        var card = el("div", { class: "list-card" }, [
          el("div", { class: "list-card-head" }, [el("strong", { text: (r.kodeUnit ? r.kodeUnit + " - " : "") + r.merek + (r.tahun ? " (" + r.tahun + ")" : "") })]),
          el("div", { class: "list-card-body", text: "Profit Bersih " + fmtRp(r.profitBersih) + (r.lamaTerjual != null ? " | Terjual dalam " + r.lamaTerjual + " hari" : "") + (r.sumberUnit ? " | Sumber: " + r.sumberUnit : "") }),
          el("div", { class: "list-card-foot" }, [
            el("span", { class: "muted", text: fmtDate(r.createdAt) }),
            el("button", { class: "btn-link btn-danger", text: "Hapus" })
          ])
        ]);
        card.querySelector(".btn-danger").addEventListener("click", function () {
          FFMDB.remove("historyTransaksi", r.id).then(function () { renderHistoryList(); renderDashboardSummary(); });
        });
        box.appendChild(card);
      });
    });
  }

  function renderDashboardSummary() {
    Promise.all([FFMDB.getAll("units"), FFMDB.getAll("historyTransaksi"), FFMDB.getAll("kotakUangTracking")])
      .then(function (results) {
        var units = results[0], history = results[1], tracking = results[2];
        var totalUnit = units.length;
        var totalProfitBersih = history.reduce(function (a, r) { return a + (r.profitBersih || 0); }, 0);
        var avgProfitPerUnit = totalUnit > 0 ? totalProfitBersih / totalUnit : null;
        var lamaVals = history.map(function (r) { return r.lamaTerjual; }).filter(function (v) { return v != null; });
        var avgLamaTerjual = lamaVals.length ? lamaVals.reduce(function (a, b) { return a + b; }, 0) / lamaVals.length : null;
        var totalProfitPerBulan = tracking.reduce(function (a, r) { return a + (r.profitBulan || 0); }, 0);
        var level;
        if (totalUnit >= 60) level = "Level 4 - Pro";
        else if (totalUnit >= 30) level = "Level 3 - Menengah";
        else if (totalUnit >= 10) level = "Level 2 - Pemula Aktif";
        else level = "Level 1 - Baru Mulai";

        var box = document.getElementById("dash-summary");
        box.innerHTML = "";
        box.appendChild(el("div", { class: "result-grid" }, [
          el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Total Unit" }), el("span", { class: "result-value", text: String(totalUnit) })]),
          el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Total Profit Bersih" }), el("span", { class: "result-value", text: fmtRp(totalProfitBersih) })]),
          el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Rata-rata Profit / Unit" }), el("span", { class: "result-value", text: avgProfitPerUnit != null ? fmtRp(avgProfitPerUnit) : "-" })]),
          el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Rata-rata Lama Terjual" }), el("span", { class: "result-value", text: avgLamaTerjual != null ? avgLamaTerjual.toFixed(1) + " hari" : "-" })]),
          el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Total Profit / Bulan (Tracking)" }), el("span", { class: "result-value", text: fmtRp(totalProfitPerBulan) })]),
          el("div", { class: "result-item" }, [el("span", { class: "result-label", text: "Level Perkiraan" }), el("span", { class: "result-value", text: level })])
        ]));
      });
  }

  /* ---------------- init ---------------- */
  function initApp() {
    document.getElementById("cl-date").value = new Date().toISOString().slice(0, 10);
    document.getElementById("riset-tanggal").value = new Date().toISOString().slice(0, 10);
    renderUnitResult();
    renderUnitList();
    renderRiskAspects();
    renderRiskResult();
    renderChecklistList();
    renderUnitSelectForChecklist();
    renderAdgenContent();
    renderAdChecklist();
    renderAdHistory();

    FFMDB.getSetting("pro_unlocked", false).then(function (unlocked) {
      applyProVisibility(!!unlocked);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(function () {});
    }
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
