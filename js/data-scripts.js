/* Data Modul 4 - Script Assistant (Pro)
   Sumber: E-BOOK BONUS "100+ Kata & Script Chat untuk Negosiasi Mobil".
   Struktur asli ebook = 7 Bagian (bukan 4 seperti draf awal), dipetakan
   apa adanya supaya isinya presisi sesuai sumber, bukan ringkasan bebas. */
var SCRIPT_DATA = {
  categories: [
    {
      key: "cari",
      label: "1. Mencari Mobil",
      groups: [
        { sub: "Chat Pembuka Efektif", items: [
          "Halo mas, izin nanya ya, mobilnya masih ada? Saya lagi cari unit buat dipakai pribadi, kebetulan lihat postingan mas di OLX.",
          "Siang bang, saya lihat mobilnya menarik banget, mau tanya dikit boleh? Lagi cari mobil sejenis buat harian."
        ]},
        { sub: "Menjaga Nada & Gaya Bahasa", items: [
          "Mas, kalau boleh tahu masih bisa nego dikit nggak? Biar saya bisa atur budget juga."
        ]},
        { sub: "Sesuai Tipe Penjual: Personal", items: [
          "Wah, mobilnya masih mulus banget ya mas. Saya jadi makin penasaran mau lihat langsung."
        ]},
        { sub: "Sesuai Tipe Penjual: Showroom/Dealer", items: [
          "Pagi mas, saya lihat stok Avanza 2017-nya di OLX. Bisa kirim rincian harga OTR dan kondisi terakhir ya?"
        ]},
        { sub: "Sesuai Tipe Penjual: Emosional/Overprice", items: [
          "Saya ngerti sih mas, harga segitu wajar kok. Cuma saya lagi coba cocok-cocokin dulu sama budget."
        ]},
        { sub: "Menawar Halus Tanpa Ilfeel", items: [
          "Saya suka banget sama unit ini, mas. Cuma jujur, budget saya agak mepet. Kalau misalnya saya datang langsung hari ini, masih bisa nego dikit nggak biar saya gas aja?",
          "Saya pengen cocok aja dua-duanya, mas cepat jual, saya cepat beli. Kira-kira bisa dikasih berapa kalau saya datang sore ini?"
        ]},
        { sub: "Menggali Info Tanpa Interogasi", items: [
          "Kalau boleh tahu, ini mobilnya masih dipakai harian atau udah standby di rumah?",
          "Untuk surat-surat lengkap semua ya, bang? Biar saya bisa persiapin nanti kalau jadi lihat.",
          "Ada PR kecil nggak, kayak servis minor atau ganti ban?"
        ]},
        { sub: "Bahasa Tubuh Digital", items: [
          "Siap, terima kasih responnya. Kalau boleh tahu, posisi unitnya di mana ya? Biar saya bisa atur waktu kalau mau lihat.",
          "Oke noted. Saya kebetulan sering lewat sana. Kalau cocok nanti saya kabarin buat jadwal lihat, ya."
        ]},
        { sub: "Jangan Jadi Pemburu Murah", items: [
          "Saya nggak mau nawar jauh kok, cuma pengen tahu aja batas terakhirnya berapa, biar saya bisa sesuaikan.",
          "Saya paham harga segini udah termasuk wajar, tapi kalau bisa bantu tipis aja saya siapin cash hari ini."
        ]},
        { sub: "Riset Banyak Iklan (Personal Touch)", items: [
          "Halo, saya lihat Avanza putihnya masih kinclong banget ya di foto. Tahun segini tapi interiornya masih bagus, salut.",
          "Mas, fotonya bagus banget, kelihatan dirawat. Mau tanya dikit, ini kilometer real atau udah ganti speedometer?"
        ]},
        { sub: "Ubah Chat Jadi Janji Temu", items: [
          "Kalau nggak keberatan, saya pengen lihat langsung biar bisa pastiin kondisinya. Kapan kira-kira waktu yang cocok buat mas?",
          "Oke mas, berarti saya ke sana hari Sabtu jam 10 ya. Kalau ada perubahan nanti saya kabarin. Terima kasih banyak sebelumnya."
        ]}
      ]
    },
    {
      key: "unit",
      label: "2. Unit Potensial",
      groups: [
        { sub: "Seni Bertanya yang Tepat", items: [
          "Mas, kalau boleh tahu, ada PR kecil nggak yang masih harus dikerjain di mobil ini?",
          "Saya pengen tahu biar bisa siapin dana perawatan aja, bukan buat nawar kok."
        ]},
        { sub: "Menggali Kondisi & Riwayat", items: [
          "Mobilnya dipakai harian atau weekend aja, mas?",
          "Biasanya servis di bengkel mana ya?",
          "Remnya masih pakem atau ada getar waktu diinjak?"
        ]},
        { sub: "Minta Foto/Video Tambahan", items: [
          "Mas, boleh minta tambahan foto bagian interiornya? Biar saya bisa lihat dulu sebelum datang, soalnya saya dari luar kota.",
          "Kalau sempat, bisa kirim video nyalain mesin beberapa detik aja, bang. Saya pengen denger suaranya aja, biar makin yakin."
        ]},
        { sub: "Penjual Lambat Merespons", items: [
          "Oke mas, makasih infonya. Kalau sempat, saya pengen lihat detail interiornya, boleh kirim satu dua foto aja.",
          "Terima kasih responnya, mas. Saya tahu pasti banyak yang nanya, tapi saya serius pengen lihat langsung."
        ]},
        { sub: "Meredakan Jawaban Menghindar", items: [
          "Oke, saya ngerti kok, mungkin susah dijelasin lewat chat ya. Tapi kalau sempat, saya pengen lihat dulu biar sama-sama enak.",
          "Saya juga gak buru-buru kok, yang penting cocok sama kondisi aslinya aja."
        ]},
        { sub: "Mengunci Komitmen Lihat Unit", items: [
          "Oke mas, saya suka banget responnya. Kalau boleh, saya jadwalkan lihat unitnya weekend ini ya?",
          "Kalau unitnya masih ready sampai Sabtu, saya fix lihat langsung biar gak keburu diambil orang."
        ]},
        { sub: "Menghadapi Penjual Manipulatif", items: [
          "Saya paham sih mas, mungkin maksudnya biar cepat laku. Tapi saya pribadi lebih suka kalau semua info disampaikan terbuka aja biar gak salah paham.",
          "Saya gak masalah kok kalau ada minus kecil, namanya mobil bekas pasti ada aja. Cuma kalau dijelasin dari awal, saya bisa atur estimasi biayanya."
        ]},
        { sub: "Menjembatani Gap Informasi", items: [
          "Mas, saya ngerti kok kalau bodi udah pernah cat ulang, itu hal wajar banget buat mobil umur segini. Yang penting hasilnya rapi dan suratnya aman.",
          "Saya bukan mau cari yang sempurna, mas, tapi pengen tahu aja biar gak salah perhitungan nanti kalau ganti part."
        ]},
        { sub: "Meredakan Nada Sinis", items: [
          "Hehe, saya ngerti kok, mas. Saya juga gak nyari yang sempurna. Cuma pengen lihat kondisi real aja biar saya gak salah beli. Namanya juga usaha ya, mas.",
          "Saya paham banget, mas. Mobil kayak gini memang cepat lakunya. Tapi kalau nanti belum sempat laku juga, kabarin saya aja ya. Siapa tahu masih jodoh."
        ]},
        { sub: "Membangun Chemistry", items: [
          "Mas, gaya bicara mas enak banget, berasa ngobrol sama teman sendiri.",
          "Saya juga jualan kecil-kecilan, jadi ngerti banget gimana rasanya dapet pembeli yang nanya-nanya tapi gak jadi."
        ]},
        { sub: "Teknik Mirror (Gaya Santai)", items: [
          "Siap bro, makasih ya infonya. Saya lagi bandingin beberapa unit nih, tapi yang ini keliatannya paling oke."
        ]},
        { sub: "Teknik Mirror (Gaya Formal)", items: [
          "Baik, mas. Terima kasih penjelasannya. Kalau cocok, nanti saya kabari lagi untuk lihat unit."
        ]},
        { sub: "Dari Percakapan ke Rencana Nyata", items: [
          "Oke mas, saya minta waktu dikit nanti sore, biar saya bisa liat kondisi realnya. Kalau cocok, kita langsung bahas harga."
        ]}
      ]
    },
    {
      key: "nego",
      label: "3. Negosiasi Cerdas",
      groups: [
        { sub: "Mengajak Sepakat (Bukan Menawar)", items: [
          "Mas, saya udah cocok banget sama unit ini. Kalau misalnya bisa turun dikit aja, biar sama-sama enak, saya langsung fix hari ini.",
          "Saya bukan mau nyari yang paling murah, mas. Saya cuma pengen cari yang paling pas, dan unit mas ini paling cocok sejauh ini."
        ]},
        { sub: "Frasa 'Kalau Saya Serius Datang Hari Ini'", items: [
          "Kalau saya serius datang hari ini, masih bisa dibantu nego dikit nggak, mas?",
          "Saya serius minat, mas. Biar saya atur waktu datang, bisa dibantu nego dikit biar langsung deal."
        ]},
        { sub: "Alasan Logis Sebagai Pembungkus", items: [
          "Mas, saya pengen pakai mobil ini buat kerjaan luar kota, jadi lagi nyesuain budget aja biar gak terlalu mepet.",
          "Saya lagi bandingin beberapa unit, tapi jujur yang ini paling cocok. Kalau bisa kurang tipis aja, saya fix ambil yang ini."
        ]},
        { sub: "Saat Penjual Bilang 'Harga Sudah Pas'", items: [
          "Oke mas, saya ngerti kok. Memang harga segitu masuk akal kalau lihat kondisinya. Cuma kalau saya datang langsung, bisa lah dikasih harga istimewa dikit ya.",
          "Siap, berarti segitu dulu ya. Tapi kalau nanti belum sempat laku juga, kabarin saya aja, mas. Saya standby kok."
        ]},
        { sub: "Penjual Emosional/Sentimental", items: [
          "Saya ngerti banget, mas. Mobil ini pasti banyak kenangannya. Saya juga pengen rawat dengan baik, bukan buat diputer-puter."
        ]},
        { sub: "Teknik Harga Tengah", items: [
          "Gimana kalau kita ambil tengah aja, mas? 117,5 juta saya langsung transfer DP-nya hari ini."
        ]},
        { sub: "Menghadapi Kebuntuan", items: [
          "Oke mas, saya ngerti kok. Harga segitu masuk akal kalau lihat kondisinya. Cuma saya pengen pertimbangkan dulu bentar ya, biar gak salah ambil keputusan.",
          "Kalau belum cocok sekarang gak apa-apa, mas. Saya juga masih bandingin beberapa unit. Tapi saya paling suka sama mobil mas ini."
        ]},
        { sub: "Anchoring Terbalik", items: [
          "Wah, berarti mobil mas kondisinya bagus banget ya sampai bisa diharga segitu. Saya bandingin dikit sama unit lain yang 117-an, tapi kilometernya lebih tinggi."
        ]},
        { sub: "Urgensi yang Sopan", items: [
          "Saya juga lagi nego satu unit lain sih, tapi jujur yang ini lebih cocok. Kalau bisa dibantu dikit, saya fix ambil biar gak kelamaan mikir."
        ]},
        { sub: "Menutup Negosiasi dengan Elegan", items: [
          "Makasih banyak ya mas, udah mau ngasih harga segitu. Saya juga jadi lebih tenang karena dapat dari orangnya langsung.",
          "Saya hargai banget keterbukaan mas dari awal. Gak semua penjual bisa sejujur ini."
        ]},
        { sub: "Psikologi 'Perasaan Menang' (Keputusan di Tangan Dia)", items: [
          "Mas, saya ngerti kok kalau harga segini wajar. Tapi saya pribadi lebih tenang kalau bisa pas di 115 juta, biar gak kepotong pajak dan balik nama. Tapi keputusan tetap di mas, ya."
        ]}
      ]
    },
    {
      key: "tutup",
      label: "4. Menutup Transaksi",
      groups: [
        { sub: "Menjaga Momentum Setelah Deal Verbal", items: [
          "Oke mas, biar gak gantung dan sama-sama tenang, gimana kalau saya kirim DP kecil dulu hari ini? Nanti saya lanjut datang sesuai waktu yang mas nyaman.",
          "Siap mas, berarti fix di 115 juta ya. Biar saya catat dan siapin uangnya. Kapan kira-kira waktu yang cocok buat ketemu?"
        ]},
        { sub: "Checklist Verbal Sebelum Deal", items: [
          "Biar saya pastiin ya, mas, surat-surat lengkap semua kan? BPKB, STNK, faktur, dan kwitansi jual beli tersedia?",
          "Oh iya mas, pajaknya masih hidup kan? Biar saya siapin sekalian buat perpanjang nanti."
        ]},
        { sub: "Double Confirmation (Verbal + Tertulis)", items: [
          "Oke mas, saya konfirmasi ya, harga fix di 115 juta, lokasi di Ciputat, dan saya datang besok jam 10 pagi. Nanti saya kabarin sejam sebelum berangkat.",
          "Saya kirim DP 2 juta dulu sore ini ke rekening mas, biar unitnya di-hold ya. Sisanya saya lunasi pas ketemu besok."
        ]},
        { sub: "Penjual Ragu di Detik Akhir", items: [
          "Oke mas, gak apa-apa. Saya paham pasti banyak yang nanya juga. Tapi kalau nanti belum sempat deal sama yang lain, kabarin saya ya. Saya masih minat kok."
        ]},
        { sub: "Kesan Profesional di Akhir", items: [
          "Makasih banyak ya, mas. Senang banget bisa ngobrol langsung. Saya suka banget cara mas jelasin detail mobilnya, profesional banget."
        ]},
        { sub: "Menunda Keputusan dengan Elegan", items: [
          "Mas, saya suka banget sama unitnya, tapi saya butuh waktu setengah hari buat ngecek balik nama dan pajaknya dulu. Biar saya gak ambil keputusan buru-buru."
        ]},
        { sub: "Saat Serah Terima Unit", items: [
          "Mas, saya OTW ya, perkiraan sampai sekitar jam 10.30. Nanti saya kabarin kalau sudah dekat.",
          "Wah, akhirnya bisa ketemu langsung. Terima kasih udah sempatin waktu, mas."
        ]},
        { sub: "Pemeriksaan Akhir di Lokasi", items: [
          "Mas, boleh saya cek bagian bawah dikit ya, biar saya tenang aja.",
          "Oh iya, boleh nyalain mesin sebentar aja? Pengen denger suara langsamnya aja."
        ]},
        { sub: "Konfirmasi Transfer & Dokumen", items: [
          "Oke mas, saya siapin transfernya sekarang ya. Begitu masuk, tolong dicek dulu biar sama-sama tenang.",
          "Kalau sudah terkonfirmasi, boleh saya minta foto kwitansi jual beli dan copy BPKB-nya ya. Nanti saya bawa saat balik nama."
        ]},
        { sub: "Setelah Transaksi Selesai", items: [
          "Alhamdulillah, transaksi lancar. Terima kasih banyak ya mas. Semoga rezekinya makin lancar, dan mobilnya beneran jodoh buat saya."
        ]},
        { sub: "Follow-Up Reputasi Pasca-Deal", items: [
          "Mas, mobilnya udah saya pakai keliling dua hari ini. Alhamdulillah puas banget. Makasih ya, semoga bisa silaturahmi lagi."
        ]},
        { sub: "Menjual Kembali ke Penjual Lama", items: [
          "Mas, inget gak Avanza yang dulu saya ambil dari mas? Saya rencana upgrade ke unit lebih tinggi, kalau mas mau ambil lagi saya kasih harga teman aja."
        ]}
      ]
    },
    {
      key: "jual",
      label: "5. Sebagai Penjual",
      groups: [
        { sub: "Pembuka Chat ke Calon Pembeli", items: [
          "Halo mas, iya masih ada. Mobilnya siap pakai banget, baru aja diservis dan pajak juga masih panjang.",
          "Siap, masih ada. Kalau boleh tahu, mas lagi cari buat harian atau proyek? Biar saya bisa bantu kasih gambaran yang pas."
        ]},
        { sub: "Deskripsi via Storytelling (Bukan Bombastis)", items: [
          "Mobil ini saya pakai sendiri beberapa minggu untuk harian, beneran enak banget mesinnya. Cuma karena saya baru dapet unit lain, jadi saya jual lagi biar gak numpuk di garasi.",
          "Biar gak salah ekspektasi, mobil ini bukan mobil kontes ya, tapi kondisinya bener-bener layak pakai dan bersih."
        ]},
        { sub: "Menjawab Pertanyaan Umum Pembeli", items: [
          "Alhamdulillah halus banget, mas. Baru aja ganti oli dan busi minggu lalu, tinggal pakai aja.",
          "Surat lengkap, STNK dan BPKB asli semua. Atas nama pribadi, bukan perusahaan."
        ]},
        { sub: "Menunjukkan Nilai Tanpa Sombong", items: [
          "Saya bisa bilang mobil ini punya value tinggi karena sudah banyak part yang baru. Jadi pembeli tinggal pakai tanpa khawatir keluar biaya tambahan."
        ]},
        { sub: "Saat Pembeli Menawar", items: [
          "Boleh nego wajar kok, mas. Tapi saya pastikan dulu, unit ini kondisinya udah siap pakai banget. Jadi kalau ambil sekarang, bisa langsung gas tanpa keluar biaya lagi.",
          "Kalau mas datang hari ini, saya bisa bantu kurang tipis biar sama-sama enak."
        ]},
        { sub: "Saat Pembeli Ragu/Butuh Waktu", items: [
          "Siap, gak masalah mas. Saya juga gak buru-buru jual, yang penting cocoknya dapet. Mobil ini juga masih saya pakai harian, jadi tetap keurus."
        ]},
        { sub: "Guided Commitment", items: [
          "Mas, biar lebih gampang, kalau cocok nanti tinggal transfer DP aja buat tahan unit. Saya kasih waktu 1 hari buat pelunasan pas serah terima, jadi gak perlu buru-buru."
        ]},
        { sub: "Menjawab 'Saya Masih Bandingin Dulu'", items: [
          "Wajar banget mas, justru bagus kalau bandingin. Tapi biar mas gak salah banding, saya kasih info dikit: mobil ini pajaknya baru diperpanjang dan baru servis besar."
        ]},
        { sub: "Saat Diminta Diskon di Akhir", items: [
          "Kalau ambil minggu ini saya bisa bantu kurang dikit deh mas, biar sama-sama enak. Tapi gak banyak ya, karena udah di posisi pas banget.",
          "Kalau mas fix hari ini, saya siap bantu potong biaya cuci salon aja, biar unitnya langsung siap pakai."
        ]},
        { sub: "Saat Pembeli Siap Closing", items: [
          "Siap mas, makasih banyak. Biar gak gantung, saya catat dulu ya: fix di 117 juta, nanti mas datang jam 3 sore di lokasi ini. Saya siapin kwitansi dan STNK-nya.",
          "Kalau bisa, saya minta DP kecil dulu aja buat tahan unit ya, biar aman di dua pihak. Gak besar kok, 1 juta aja udah cukup."
        ]},
        { sub: "Menutup dengan Kehangatan", items: [
          "Makasih banyak ya, mas. Senang banget bisa ketemu langsung. Semoga mobilnya beneran bermanfaat dan gak rewel."
        ]},
        { sub: "Follow-Up Pasca Penjualan", items: [
          "Mas, mobilnya gimana? Semoga cocok ya. Kalau ada hal kecil yang perlu dicek, tinggal kabarin aja."
        ]},
        { sub: "Meminta Izin Testimoni", items: [
          "Mas, makasih banget udah percaya beli dari saya. Kalau gak keberatan, boleh saya screenshoot chat ini buat bukti testimoni ya? Saya sering upload buat calon pembeli lain biar makin yakin."
        ]}
      ]
    },
    {
      key: "followup",
      label: "6. Follow-Up",
      groups: [
        { sub: "Follow-Up Awal (1-2 Hari)", items: [
          "Halo mas, saya cuma mau update aja, mobilnya masih ready ya. Kemarin sempat dicek sama teman juga, tapi belum fix.",
          "Cuma pengen kabarin aja, mobilnya masih aman. Tapi ada yang lagi nego juga, jadi kalau masih minat tinggal kabarin."
        ]},
        { sub: "Calon Pembeli Hilang Tanpa Kabar", items: [
          "Halo mas, gak apa-apa kalau belum sempat balas. Saya cuma mau pastiin aja, mobilnya masih ready kok, belum saya lepas.",
          "Saya ngerti kok kalau lagi sibuk, cuma kasih kabar aja biar saya bisa atur waktu kalau mas masih minat."
        ]},
        { sub: "Setelah 'Masih Bandingin'", items: [
          "Siap mas, bagus banget kalau bandingin dulu. Biar adil, saya bantu kasih perbandingan aja, unit ini pajaknya baru dan servis besar udah beres."
        ]},
        { sub: "Setelah Janji Tapi Batal Datang", items: [
          "Halo mas, gak apa-apa kalau kemarin belum sempat datang. Saya ngerti banget kadang jadwal bisa berubah.",
          "Kalau masih berminat, saya bisa atur waktu lain yang lebih santai, biar mas gak buru-buru."
        ]},
        { sub: "Follow-Up 3-5 Hari", items: [
          "Mas, halo! Sekadar update aja, mobilnya masih di saya. Minggu ini malah baru ganti aki dan cuci salon, jadi makin siap pakai."
        ]},
        { sub: "Urgensi Tanpa Kata 'Cepat'", items: [
          "Saya kabarin duluan aja, mas, karena udah ada dua yang lagi nego juga. Tapi saya tetap prioritasin yang kontak lebih dulu."
        ]},
        { sub: "Humor Ringan & Keakraban", items: [
          "Mas, saya baru sadar mobil ini belum jodoh sama yang lain, mungkin masih nunggu mas datang.",
          "Mas, kalau minggu ini belum sempat, gak apa-apa. Mobilnya sabar kok."
        ]},
        { sub: "Follow-Up 1-2 Hari Pasca Serah Terima", items: [
          "Halo mas, semoga mobilnya cocok ya. Mau pastiin aja semua lancar setelah dipakai."
        ]},
        { sub: "Follow-Up 7 Hari", items: [
          "Mas, gimana mobilnya setelah seminggu? Udah sempat diajak jalan jauh belum?"
        ]},
        { sub: "Follow-Up 1 Bulan (Top of Mind)", items: [
          "Halo mas, gimana kabarnya? Semoga mobilnya masih nyaman ya.",
          "Oh iya, kalau nanti kenalan atau keluarga mas ada yang cari mobil, boleh kasih kontak saya aja ya."
        ]},
        { sub: "Template Follow-Up Rutin", items: [
          "Mas, halo! Semoga sehat selalu. Cuma mau say hi aja, semoga mobilnya masih nyaman ya. Kalau ada yang perlu saran perawatan, tinggal kabarin aja.",
          "Mas, bulan ini udah waktunya servis ringan ya kalau ngikutin jadwal. Saya dulu sempat servis di bengkel X, hasilnya bagus banget. Mau saya kirim kontaknya?",
          "Mas, saya lagi dapet unit baru mirip kayak yang mas beli dulu, tapi tipe lebih tinggi. Kalau ada teman yang nyari, boleh saya kirim fotonya ya?"
        ]},
        { sub: "Follow-Up untuk Repeat Buyer", items: [
          "Mas, saya lagi dapet unit yang mirip banget sama yang dulu mas beli, tapi tahunnya lebih muda. Mau saya kirim fotonya buat lihat-lihat aja?"
        ]}
      ]
    },
    {
      key: "frasa",
      label: "7. Frasa Kunci (Kamus Mini)",
      groups: [
        { sub: "Trust Builder (Pembuka)", items: [
          "Halo mas, izin tanya sedikit ya soal unitnya. Masih available?",
          "Halo, saya lagi riset beberapa unit. Yang mas jual ini sepertinya sesuai kriteria saya.",
          "Santai aja mas, saya belum tentu beli hari ini kok, cuma lagi kumpulin info dulu."
        ]},
        { sub: "Menggali Informasi", items: [
          "Mas, boleh tahu alasan jualnya? Biar saya ngerti konteksnya aja.",
          "Ada PR kecil yang perlu disiapin gak mas, biar saya bisa estimasi dulu?"
        ]},
        { sub: "Negosiasi Harga", items: [
          "Saya paham kok mas, harga segitu masuk kalau lihat kondisi. Tapi kalau saya ambil buat pribadi, saya targetnya di kisaran sekian, biar aman di biaya perawatan.",
          "Saya gak mau nawar jauh-jauh, mas. Saya cuma pengen harga yang fair buat dua-duanya."
        ]},
        { sub: "Urgensi Elegan", items: [
          "Saya kasih info duluan aja mas, karena udah ada dua orang lain yang nanya juga.",
          "Gak buru-buru sih mas, tapi sayang kalau kelamaan mikir, unit bagus cepat banget muternya."
        ]},
        { sub: "Menutup Transaksi", items: [
          "Siap mas, biar gak gantung saya recap ya: fix di 117 juta, ketemu besok jam 10 di lokasi mas.",
          "Mas, saya kirim bukti transfer sekarang ya, tolong dicek biar sama-sama tenang."
        ]},
        { sub: "Pasca-Transaksi & Follow-Up", items: [
          "Mas, terima kasih ya udah percaya beli/jual lewat saya. Semoga mobilnya beneran jadi rezeki baik.",
          "Kalau nanti ada teman atau saudara yang cari mobil, boleh kabarin saya ya."
        ]},
        { sub: "Kata Berdaya Tinggi: Kepercayaan", items: [
          "Biar sama-sama tenang aja, mas.",
          "Transaksinya insyaAllah aman, saya transparan dari awal."
        ]},
        { sub: "Kata Berdaya Tinggi: Profesional & Fair", items: [
          "Saya cuma pengen harga yang fair buat dua-duanya.",
          "Kita cari titik realistis aja ya, biar sama-sama enak."
        ]},
        { sub: "Kata Berdaya Tinggi: Kejujuran", items: [
          "Saya jujur aja, mobil ini gak sempurna, tapi fungsional banget buat harian.",
          "Saya lebih nyaman ngomong terbuka dari awal."
        ]}
      ]
    }
  ]
};
