-- ============================================================
-- Rofimain Drilling — Sample seed data
-- Optional. Run this AFTER supabase-schema.sql if you want
-- demo content to show on the public site immediately.
-- ============================================================

-- ── SERVICES ──────────────────────────────────────────────
insert into services (title, subtitle, slug, description, full_description, icon, features, process, faq, "order", featured) values
(
  'Bored Pile',
  'Pondasi bor untuk konstruksi skala besar',
  'bored-pile',
  'Pondasi bor pile cast-in-situ dengan diameter 30 cm – 1 m untuk gedung, jembatan, dan infrastruktur dengan beban berat.',
  'Bored pile adalah pondasi dalam cast-in-situ yang dibor sampai lapisan keras lalu diisi tulangan + beton. Cocok untuk lokasi padat, bangunan tinggi, dan tanah dengan lapisan keras dalam. Pengerjaan minim getaran dan kebisingan.',
  'Construction',
  array['Diameter 30–100 cm', 'Rig hidrolik & rotary', 'PIT/PDA integrity test', 'Garansi pengerjaan', 'Laporan harian + dokumentasi'],
  '[
    {"step":1,"title":"Survei & Engineering","description":"Survei tanah, kalkulasi beban, dan rekomendasi diameter/kedalaman."},
    {"step":2,"title":"Mobilisasi Alat","description":"Mobilisasi rig + peralatan ke lokasi proyek."},
    {"step":3,"title":"Pengeboran","description":"Drilling sesuai titik dan kedalaman desain dengan casing temporary bila perlu."},
    {"step":4,"title":"Pemasangan Tulangan","description":"Instalasi rangka tulangan baja sesuai shop drawing."},
    {"step":5,"title":"Pengecoran","description":"Pengecoran dengan tremie pipe + slump test setiap batch."},
    {"step":6,"title":"Quality Test","description":"PIT/PDA test 100% titik + serah-terima dokumentasi."}
  ]'::jsonb,
  '[
    {"q":"Berapa lama pengerjaan bored pile per titik?","a":"Umumnya 4–8 jam per titik tergantung diameter dan kedalaman."},
    {"q":"Apa beda bored pile vs tiang pancang?","a":"Bored pile dicor di tempat dan minim getaran; tiang pancang dipukul dan bergetar besar."},
    {"q":"Apakah aman untuk lokasi padat penduduk?","a":"Sangat aman — getaran minimal sehingga tidak merusak bangunan tetangga."}
  ]'::jsonb,
  1,
  true
),
(
  'Sumur Bor Dalam',
  'Sumur bor untuk kebutuhan air bersih industri & komersial',
  'sumur-bor-dalam',
  'Pengeboran sumur dalam 80–200 m untuk pabrik, hotel, apartemen, dan perumahan dengan kapasitas tinggi.',
  'Layanan pengeboran sumur dalam (deep well) untuk kebutuhan air industri dan komersial. Termasuk survei geolistrik, pengeboran, pumping test, uji kualitas air, dan instalasi pompa submersible.',
  'Droplets',
  array['Kedalaman 80–200 m', 'Survei geolistrik', 'Pumping test 48 jam', 'Uji lab air terakreditasi', 'Instalasi pompa submersible'],
  '[
    {"step":1,"title":"Survei Geolistrik","description":"Pemetaan lapisan akuifer 1–3 titik survei."},
    {"step":2,"title":"Pengeboran","description":"Drilling sampai akuifer target dengan casing baja/PVC."},
    {"step":3,"title":"Gravel Packing","description":"Pemasangan kerikil filter untuk efisiensi air."},
    {"step":4,"title":"Pumping Test","description":"Test pumping kontinu 24–48 jam untuk hitung kapasitas."},
    {"step":5,"title":"Uji Lab","description":"Sampling air ke lab terakreditasi untuk analisa kualitas."},
    {"step":6,"title":"Instalasi Pompa","description":"Pemasangan pompa submersible + panel kontrol."}
  ]'::jsonb,
  '[
    {"q":"Berapa biaya rata-rata sumur bor dalam?","a":"Tergantung kedalaman & diameter — kami berikan penawaran transparan setelah survei lokasi."},
    {"q":"Apakah perlu izin?","a":"Untuk komersial/industri biasanya perlu izin SIPA dari pemerintah daerah. Kami bantu pendampingan."},
    {"q":"Berapa lama pengerjaan?","a":"7–14 hari untuk kedalaman 100–150 m termasuk pumping test."}
  ]'::jsonb,
  2,
  true
),
(
  'Strauss Pile',
  'Pondasi bor manual untuk rumah & ruko',
  'strauss-pile',
  'Pondasi strauss pile diameter 20–40 cm untuk rumah 1–3 lantai dan ruko ekonomis.',
  'Strauss pile adalah pondasi bor manual yang ekonomis untuk bangunan ringan seperti rumah tinggal dan ruko. Diameter 20–40 cm dengan kedalaman 4–12 m sesuai kondisi tanah.',
  'Drill',
  array['Diameter 20–40 cm', 'Kedalaman 4–12 m', 'Tanpa getaran', 'Cocok lahan sempit', 'Harga ekonomis'],
  '[
    {"step":1,"title":"Setting Out","description":"Marking titik bor sesuai gambar."},
    {"step":2,"title":"Pengeboran Manual","description":"Drilling dengan strauss set manual."},
    {"step":3,"title":"Tulangan","description":"Pemasangan stek/tulangan baja."},
    {"step":4,"title":"Pengecoran","description":"Pengecoran beton kualitas K-225 atau sesuai spek."}
  ]'::jsonb,
  '[]'::jsonb,
  3,
  false
)
on conflict (slug) do nothing;

-- ── PROJECTS ──────────────────────────────────────────────
insert into projects (title, subtitle, slug, category, location, depth, diameter, piles, duration, year, status, client, description, full_description, tags, featured) values
(
  'Bored Pile Tower 14 Lantai',
  'BSD, Tangerang Selatan',
  'bored-pile-tower-bsd',
  'Bored Pile',
  'BSD, Tangerang Selatan',
  '32 m',
  '60–80 cm',
  124,
  '45 hari',
  2025,
  'completed',
  'PT Konstruksi Mitra (confidential)',
  'Pengerjaan 124 titik bored pile diameter 60–80 cm untuk tower hunian 14 lantai di kawasan BSD.',
  E'Proyek pondasi bored pile untuk tower hunian 14 lantai. Dikerjakan dalam 45 hari dengan kombinasi rig hidrolik dan rotary, sesuai jadwal master schedule.\n\nTantangan utama: lokasi di antara bangunan eksisting yang mewajibkan getaran minimal, lapisan tanah lunak pada 8 m teratas, dan schedule ketat 45 hari kalender.\n\nSolusi: penggunaan casing temporary untuk stabilisasi lubang, slump test setiap batch beton, tim shift 2 dengan dokumentasi harian, dan PIT 100% untuk semua titik.',
  array['Tower','Hunian','BSD','Bored Pile'],
  true
),
(
  'Sumur Bor Dalam Pabrik',
  'Cikarang, Bekasi',
  'sumur-bor-pabrik-cikarang',
  'Sumur Bor Dalam',
  'Cikarang, Bekasi',
  '120 m',
  '8″ casing',
  0,
  '8 hari',
  2024,
  'completed',
  'Pabrik Manufaktur (confidential)',
  'Sumur bor dalam 120 m dengan debit 3 liter/detik untuk kebutuhan utility pabrik manufaktur.',
  E'Pengeboran sumur dalam 120 m untuk pabrik manufaktur di Cikarang, Bekasi. Debit hasil pumping test mencapai 3 liter/detik dengan kualitas air sesuai standar industri.\n\nLingkup pekerjaan: survei geolistrik 1 titik, pengeboran 120 m casing 8″, pumping test 48 jam kontinu, uji kualitas air lab terakreditasi, dan instalasi pompa submersible 7.5 kW.',
  array['Pabrik','Cikarang','Sumur Dalam'],
  true
),
(
  'Strauss Pile Cluster Hunian',
  'Depok, Jawa Barat',
  'strauss-pile-cluster-depok',
  'Strauss Pile',
  'Depok, Jawa Barat',
  '8 m',
  '30 cm',
  68,
  '12 hari',
  2024,
  'completed',
  'Developer Mitra (confidential)',
  '68 titik strauss pile untuk 12 unit cluster hunian di Depok.',
  E'Pengerjaan pondasi strauss pile untuk cluster 12 unit hunian. Total 68 titik dengan kedalaman rata-rata 8 m diameter 30 cm.',
  array['Cluster','Hunian','Depok','Strauss Pile'],
  false
)
on conflict (slug) do nothing;

-- ── ARTICLES ──────────────────────────────────────────────
insert into articles (title, slug, excerpt, content, author, category, tags, read_time, published, featured) values
(
  'Mengenal Pondasi Bored Pile: Kapan Harus Pakai?',
  'mengenal-pondasi-bored-pile',
  'Panduan lengkap tentang pondasi bored pile — definisi, kelebihan, kekurangan, dan kapan sebaiknya digunakan.',
  E'## Apa itu Bored Pile?\n\nBored pile adalah jenis pondasi dalam (deep foundation) yang dibuat dengan mengebor lubang di tanah hingga kedalaman tertentu, kemudian diisi dengan tulangan baja dan beton. Berbeda dengan tiang pancang yang dimasukkan dengan cara dipukul, bored pile dicor di tempat (cast-in-situ).\n\n## Kapan Bored Pile Direkomendasikan?\n\n### 1. Lokasi padat penduduk\n\nKarena minim getaran, bored pile aman untuk bangunan tetangga.\n\n### 2. Beban struktur besar\n\nUntuk gedung tinggi, jembatan, atau pabrik dengan beban berat.\n\n### 3. Tanah dengan lapisan keras dalam\n\nBored pile bisa menembus lapisan tanah yang tidak bisa ditembus tiang pancang konvensional.\n\n## Tahapan Pekerjaan\n\n1. Setting out — pengukuran dan marking titik bor\n2. Drilling — pengeboran sesuai kedalaman desain\n3. Cleaning — pembersihan dasar lubang\n4. Reinforcement installation\n5. Concrete pouring dengan tremie pipe\n6. Quality test PIT atau PDA\n\n## Tips Memilih Kontraktor\n\n- Pastikan memiliki SBU dan SKK Konstruksi yang valid\n- Cek portofolio proyek serupa\n- Tanyakan tentang proses quality control\n- Pastikan ada garansi pengerjaan',
  'Tim Engineering',
  'Edukasi',
  array['pondasi','bored pile','panduan'],
  6,
  true,
  true
),
(
  '5 Tips Memilih Jasa Sumur Bor yang Aman',
  'tips-memilih-jasa-sumur-bor',
  'Hindari kesalahan umum saat memilih kontraktor sumur bor. 5 tips praktis dari tim engineer berpengalaman.',
  E'## Mengapa Pemilihan Kontraktor Penting?\n\nKontraktor yang tepat menentukan kualitas air, umur sumur, dan keamanan operasional jangka panjang.\n\n## 5 Tips Utama\n\n### 1. Cek Legalitas & Sertifikasi\n\nPastikan kontraktor punya SBU, SKK Konstruksi, dan rekam jejak yang valid.\n\n### 2. Survei Geolistrik Dulu\n\nJangan langsung bor — survei geolistrik dulu untuk mapping akuifer.\n\n### 3. Casing & Material Berkualitas\n\nPastikan casing pakai material food-grade untuk air konsumsi.\n\n### 4. Pumping Test Minimal 24 Jam\n\nUntuk memastikan kapasitas berkelanjutan.\n\n### 5. Garansi & After Sales\n\nPilih yang memberikan garansi pengerjaan minimal 1 tahun.',
  'Tim Engineering',
  'Tips',
  array['sumur bor','tips','panduan'],
  5,
  true,
  false
)
on conflict (slug) do nothing;

-- ── TEAM (optional) ───────────────────────────────────────
insert into team (name, role, bio, "order") values
('Budi Santoso', 'Project Manager', 'Berpengalaman 12+ tahun memimpin proyek pondasi skala besar.', 1),
('Andre Wijaya', 'Geotechnical Engineer', 'Spesialis interpretasi data tanah dan desain pondasi.', 2),
('Rini Hartono', 'QA/QC Coordinator', 'Memastikan kualitas setiap titik bor sesuai spek engineering.', 3)
on conflict do nothing;

-- ── TESTIMONIALS ──────────────────────────────────────────
insert into testimonials (name, role, company, content, rating, featured) values
('Bpk. Hendra', 'Project Director', 'PT Konstruksi Mitra', 'Tim Rofimain on-time dan dokumentasinya rapi. Bored pile 124 titik kelar 45 hari sesuai master schedule.', 5, true),
('Ibu Linda', 'Plant Manager', 'Pabrik Manufaktur', 'Sumur dalam 120 m sukses dengan debit 3 L/s — utility kami akhirnya stabil.', 5, true),
('Pak Joko', 'Developer', 'Cluster Depok', 'Strauss pile 68 titik selesai 12 hari, harga kompetitif, hasil rapi.', 5, false)
on conflict do nothing;
