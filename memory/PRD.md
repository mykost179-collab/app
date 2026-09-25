# PRD — My Date (Kalender Penanda Warna)

## Problem Statement (asli)
Saya ingin membuat sebuah webapp untuk tampilan ponsel dengan rentang layar iPhone 11 Pro Max. Fungsi aplikasi ini adalah untuk menandai tanggal pada kalender dengan warna. Varian warna lengkap dengan gaya khas Apple iOS SF Symbol yang elegan mewah dan minimalis. Tanggal dan tahun bisa dipilih masa depan dan masa lalu tanpa batas. Logika bulan yang tampil saat pertama aplikasi dibuka adalah bulan saat ini. Setiap tanggal yang ditandai bisa ditambahkan keterangan di halaman bawahnya (mirip legenda pada diagram). Di legenda ini bisa disematkan berbagai macam simbol khas SF Symbol iOS di setiap ujung tulisan dengan pilihan warna lengkap. Aplikasi tidak memiliki banyak halaman, tapi semua tombol yang tampil berfungsi.

## Keputusan Pengguna (ask_human)
- Contoh gambar: diunggah (mock kalender iOS September 2026: Lunas hijau, Token Listrik kuning, Belum Lunas merah) → direplikasi sebagai seed data
- Mode tampilan: Terang (light iOS)
- Penyimpanan: Di server (FastAPI + MongoDB)
- Penanda per tanggal: Beberapa catatan per tanggal
- Bahasa: Indonesia

## Arsitektur
- Frontend: React (CRA) + Tailwind, framer-motion (reveal/kaskade/spring), lenis (smooth scroll), vaul (bottom sheet iOS), sonner (toast), lucide-react (ikon gaya SF Symbols), font Plus Jakarta Sans. Layout kolom ponsel max-430px di tengah untuk desktop.
- Backend: FastAPI (`/api`), MongoDB via Motor. Model Marker (PyObjectId, BaseDocument): date, color, label, icon, created_at, updated_at.
- Endpoint: GET/POST /api/markers, PATCH/DELETE /api/markers/{id}, GET /api/legend (agregasi Mongo). Seed otomatis saat koleksi kosong (contoh sesuai mock user, September 2026).
- Frontend env: REACT_APP_BACKEND_URL (external preview). DB via MONGO_URL + DB_NAME.

## Fitur Terimplementasikan (2026-09-24)
- Kalender bulanan bergaya iOS persis mock: lingkaran warna (13 warna sistem iOS), angka gelap, hairline antar pekan, hari ini bertanda titik, badge jumlah penanda ganda (>1)
- Navigasi bulan: geser (drag) + tombol ‹ ›, judul bulan reveal ter-mask + parallax halus saat scroll
- Pemilih tahun tanpa batas: pill "‹ 2026" → sheet grid 24 tahun, rentang digeser ‹ › (masa lalu & depan tanpa batas), tombol "Kembali ke Hari Ini", chip HARI INI muncul saat bukan bulan sekarang
- Tandai tanggal: tap tanggal → DaySheet (daftar penanda, edit, hapus dua-langkah, tambah) ; form Penanda Baru: tanggal native, keterangan, 13 warna, 219 simbol gaya SF Symbols (lucide) dengan pencarian instan + grid scroll
- Legenda (agregasi label+warna+ikon dengan hitungan lingkaran besar + ikon warna + daftar tanggal), tap → sorot tanggal terkait di kalender (yang lain redup)
- Agenda (semua penanda per tanggal), Cari (keterangan/tanggal, lompat ke tanggal), Marquee "Jadwal ke Depan" (pelan, klik lompat)
- Data tersimpan di MongoDB; optimistic invalidation via react-query; toast sukses/galat; semua tombol punya data-testid
- Fitur Unduh JPG (2026-09-25): tombol "Bagikan / Unduh JPG" merender kartu statis (ExportCard, layout poster 1280px dua kolom: kalender + legenda) via html2canvas scale 3 → output 3840px (4K UHD), file `My-Date-<Bulan>-<Tahun>.jpg`; di ponsel membuka share sheet native (Web Share API with files), fallback unduh biasa di desktop; batal share = tanpa notifikasi galat
- Rebrand (2026-09-25): nama aplikasi menjadi "My Date"; ikon kalender 3D hitam-putih khas Apple (app-icon.png) HANYA muncul sebagai favicon browser, apple-touch-icon, dan ikon PWA saat di-install ke homepage (manifest.json) — tidak ditampilkan di dalam halaman aplikasi maupun di kartu JPG; eyebrow kalender "MY DATE — KALENDER PENANDA"
- Logo Tanda (squircle 3 titik warna) + favicon.svg

## Persona
- Pribadi rumah tangga: menandai tanggal tagihan/lunas (contoh seed)
- Pekerja: tenggat, rapat, jadwal klien
- Siapa pun yang mencatat hari penting dengan warna

## Backlog (P0/P1/P2)
- P0: — (fungsional inti lengkap & terverifikasi)
- P1: penanda berulang (mingguan/bulanan), catatan panjang (textarea) per penanda, mode gelap
- P2: ekspor/impor data, bagikan legenda sebagai gambar, statistik per kategori

## Kredensial
Tidak ada login (aplikasi personal satu pengguna). Data: MongoDB `test_database.markers`.
