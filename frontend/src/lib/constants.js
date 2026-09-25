import * as Icons from "lucide-react";

export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const WEEKDAYS_SHORT = ["M", "S", "S", "R", "K", "J", "S"];
export const WEEKDAYS_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const COLORS = [
  { key: "red", hex: "#FF3B30", label: "Merah", darkText: false },
  { key: "orange", hex: "#FF9500", label: "Oranye", darkText: false },
  { key: "yellow", hex: "#FFCC00", label: "Kuning", darkText: true },
  { key: "green", hex: "#34C759", label: "Hijau", darkText: false },
  { key: "mint", hex: "#00C7BE", label: "Mint", darkText: true },
  { key: "teal", hex: "#30B0C7", label: "Teal", darkText: false },
  { key: "cyan", hex: "#32ADE6", label: "Biru Muda", darkText: false },
  { key: "blue", hex: "#007AFF", label: "Biru", darkText: false },
  { key: "indigo", hex: "#5856D6", label: "Nila", darkText: false },
  { key: "purple", hex: "#AF52DE", label: "Ungu", darkText: false },
  { key: "pink", hex: "#FF2D55", label: "Merah Muda", darkText: false },
  { key: "brown", hex: "#A2845E", label: "Cokelat", darkText: false },
  { key: "gray", hex: "#8E8E93", label: "Abu-abu", darkText: false },
];

export const COLOR_MAP = Object.fromEntries(COLORS.map((c) => [c.key, c]));

const kebab = (n) =>
  n
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const ICON_LIST = [
  ["CheckCircle2", "Selesai"], ["CircleX", "Batal"], ["CircleAlert", "Peringatan"], ["TriangleAlert", "Bahaya"],
  ["CircleHelp", "Tanya"], ["CircleMinus", "Kosong"], ["CirclePlus", "Ekstra"], ["Ban", "Terlarang"],
  ["BadgeCheck", "Terverifikasi"], ["CheckCheck", "Cek Ganda"], ["Clock", "Waktu"], ["AlarmClock", "Alarm"],
  ["Timer", "Timer"], ["Hourglass", "Sandi Waktu"], ["Watch", "Jam Tangan"], ["History", "Riwayat"],
  ["Repeat", "Berulang"], ["RefreshCw", "Segarkan"], ["CalendarCheck", "Tgl Selesai"], ["CalendarClock", "Tgl Waktu"],
  ["CalendarDays", "Tgl Lengkap"], ["CalendarHeart", "Tgl Spesial"], ["CalendarX", "Tgl Batal"], ["CalendarRange", "Rentang Tgl"],
  ["Zap", "Energi"], ["Sparkles", "Spesial"], ["Flame", "Semangat"], ["Star", "Penting"],
  ["Gem", "Mewah"], ["Crown", "Raja"], ["Trophy", "Juara"], ["Medal", "Medali"],
  ["Award", "Penghargaan"], ["Target", "Target"], ["Rocket", "Roket"], ["WandSparkles", "Sihir"],
  ["CreditCard", "Kartu"], ["Wallet", "Dompet"], ["Banknote", "Uang"], ["Coins", "Koin"],
  ["PiggyBank", "Tabungan"], ["TrendingUp", "Naik"], ["TrendingDown", "Turun"], ["Receipt", "Struk"],
  ["ShoppingBag", "Belanja"], ["ShoppingCart", "Keranjang"], ["ShoppingBasket", "Pasar"], ["Store", "Toko"],
  ["CircleDollarSign", "Dolar"], ["Percent", "Diskon"], ["HandCoins", "Sedekah"], ["Briefcase", "Kerja"],
  ["BriefcaseBusiness", "Bisnis"], ["Building2", "Kantor"], ["Laptop", "Laptop"], ["MonitorSmartphone", "Perangkat"],
  ["Printer", "Cetak"], ["Folder", "Folder"], ["FolderOpen", "Arsip"], ["FileText", "Dokumen"],
  ["Files", "Berkas"], ["ClipboardList", "Daftar Tugas"], ["ClipboardCheck", "Tugas Selesai"], ["NotebookPen", "Catatan"],
  ["PenLine", "Tulis"], ["Stamp", "Cap"], ["Presentation", "Presentasi"], ["GraduationCap", "Wisuda"],
  ["BookOpen", "Belajar"], ["BookMarked", "Buku"], ["Library", "Perpustakaan"], ["Languages", "Bahasa"],
  ["Microscope", "Riset"], ["Lightbulb", "Ide"], ["Bell", "Pengingat"], ["BellRing", "Panggilan"],
  ["BellOff", "Tenang"], ["MessageCircle", "Pesan"], ["MessagesSquare", "Obrolan"], ["Mail", "Surat"],
  ["MailOpen", "Surat Terbuka"], ["Send", "Kirim"], ["Phone", "Telepon"], ["PhoneCall", "Menelpon"],
  ["Smartphone", "HP"], ["AtSign", "Mention"], ["Megaphone", "Pengumuman"], ["Rss", "Berita"],
  ["User", "Pribadi"], ["Users", "Rame-rame"], ["UserPlus", "Tamu"], ["Baby", "Bayi"],
  ["Heart", "Favorit"], ["HeartHandshake", "Komunitas"], ["Smile", "Senang"], ["Frown", "Sedih"],
  ["PartyPopper", "Pesta"], ["Cake", "Ulang Tahun"], ["CakeSlice", "Kue"], ["Gift", "Hadiah"],
  ["Coffee", "Ngopi"], ["CupSoda", "Soda"], ["Beer", "Bir"], ["Wine", "Wine"],
  ["GlassWater", "Air Putih"], ["UtensilsCrossed", "Makan"], ["Utensils", "Restoran"], ["Pizza", "Pizza"],
  ["Sandwich", "Sandwich"], ["IceCreamCone", "Es Krim"], ["Cookie", "Kuki"], ["Candy", "Permen"],
  ["Popcorn", "Popcorn"], ["Donut", "Donat"], ["Apple", "Apel"], ["Carrot", "Wortel"],
  ["Salad", "Salad"], ["Egg", "Telur"], ["Beef", "Steak"], ["Croissant", "Roti"],
  ["CookingPot", "Masak"], ["Pill", "Obat"], ["Stethoscope", "Dokter"], ["HeartPulse", "Sehat"],
  ["Activity", "Aktivitas"], ["Dumbbell", "Olahraga"], ["Bike", "Sepeda"], ["Footprints", "Jalan"],
  ["PersonStanding", "Senam"], ["Plane", "Pesawat"], ["PlaneTakeoff", "Berangkat"], ["PlaneLanding", "Tiba"],
  ["Car", "Mobil"], ["CarFront", "Kendaraan"], ["Bus", "Bus"], ["TrainFront", "Kereta"],
  ["TramFront", "Tram"], ["Ship", "Kapal"], ["Anchor", "Sandar"], ["Fuel", "Isi Bensin"],
  ["MapPin", "Lokasi"], ["MapPinned", "Rute"], ["Map", "Peta"], ["Compass", "Kompas"],
  ["Navigation", "Navigasi"], ["Luggage", "Bagasi"], ["Tent", "Kemah"], ["Mountain", "Gunung"],
  ["TreePalm", "Pantai"], ["Globe", "Dunia"], ["FerrisWheel", "Taman Hiburan"], ["Hotel", "Hotel"],
  ["Key", "Kunci"], ["Quote", "Kutipan"], ["Home", "Rumah"], ["DoorOpen", "Pintu"],
  ["BedDouble", "Tidur"], ["Bath", "Mandi"], ["Sofa", "Santai"], ["Lamp", "Lampu"],
  ["Refrigerator", "Kulkas"], ["WashingMachine", "Cuci"], ["Tv", "TV"], ["Wifi", "Internet"],
  ["Wrench", "Servis"], ["Hammer", "Bangun"], ["Paintbrush", "Cat"], ["Scissors", "Gunting"],
  ["Camera", "Kamera"], ["Image", "Foto"], ["Video", "Video"], ["Music", "Musik"],
  ["Mic", "Rekam"], ["Headphones", "Audio"], ["Gamepad2", "Main Game"], ["Dices", "Dadu"],
  ["Puzzle", "Misteri"], ["Palette", "Seni"], ["Shirt", "Baju"], ["Glasses", "Kacamata"],
  ["Sun", "Pagi"], ["Sunrise", "Fajar"], ["Sunset", "Senja"], ["Moon", "Malam"],
  ["Cloud", "Cuaca"], ["CloudRain", "Hujan"], ["CloudSnow", "Salju"], ["CloudLightning", "Badai"],
  ["Snowflake", "Dingin"], ["Umbrella", "Payung"], ["Wind", "Angin"], ["Droplets", "Tetesan"],
  ["Waves", "Ombak"], ["Leaf", "Daun"], ["Flower2", "Bunga"], ["Sprout", "Tumbuh"],
  ["TreePine", "Hutan"], ["Bug", "Serangga"], ["Dog", "Anjing"], ["Cat", "Kucing"],
  ["Bird", "Burung"], ["Fish", "Ikan"], ["ThumbsUp", "Setuju"], ["Pin", "Pin"],
  ["Paperclip", "Lampiran"], ["Link", "Tautan"], ["Lock", "Rahasia"], ["LockOpen", "Terbuka"],
  ["Shield", "Lindungi"], ["ShieldCheck", "Aman"], ["Eye", "Lihat"], ["EyeOff", "Lupakan"],
  ["Bookmark", "Simpan"], ["Tag", "Label"], ["Tags", "Label Banyak"], ["Flag", "Tenggat"],
  ["FlagTriangleRight", "Milestone"], ["CircleDot", "Mulai"], ["Hash", "Nomor"],
];

export const ICONS = ICON_LIST.map(([n, label]) => ({ key: kebab(n), label, C: Icons[n] })).filter((i) => !!i.C);

export const ICON_MAP = Object.fromEntries(ICONS.map((i) => [i.key, i]));
ICON_MAP["check-circle"] = ICON_MAP["check-circle2"] || ICONS[0];
ICON_MAP["x-circle"] = ICON_MAP["circle-x"] || ICONS[2];

export const pad2 = (n) => String(n).padStart(2, "0");
export const dateStr = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`;

export const todayStr = () => {
  const t = new Date();
  return dateStr(t.getFullYear(), t.getMonth() + 1, t.getDate());
};

export const parseDateStr = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const formatTanggalPendek = (s) => {
  const d = parseDateStr(s);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()].slice(0, 3)}`;
};

export const formatTanggalFull = (s, withYear = true, withWeekday = false) => {
  const d = parseDateStr(s);
  const base = `${d.getDate()} ${MONTHS_ID[d.getMonth()]}${withYear ? ` ${d.getFullYear()}` : ""}`;
  return withWeekday ? `${WEEKDAYS_FULL[d.getDay()]}, ${base}` : base;
};

export const slugify = (t) =>
  (t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "tanpa-nama";
