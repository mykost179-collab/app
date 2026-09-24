import {
  CheckCircle2, Zap, XCircle, Heart, Star, Bell, Flag, Briefcase, Gift,
  Plane, Car, Home, UtensilsCrossed, Coffee, ShoppingBag, CreditCard,
  Wrench, BookOpen, Dumbbell, Pill, Sun, Moon, Cloud, Sparkles,
} from "lucide-react";

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

export const ICONS = [
  { key: "check-circle", label: "Selesai", C: CheckCircle2 },
  { key: "zap", label: "Energi", C: Zap },
  { key: "x-circle", label: "Belum Selesai", C: XCircle },
  { key: "heart", label: "Favorit", C: Heart },
  { key: "star", label: "Penting", C: Star },
  { key: "bell", label: "Pengingat", C: Bell },
  { key: "flag", label: "Tenggat", C: Flag },
  { key: "briefcase", label: "Kerja", C: Briefcase },
  { key: "gift", label: "Hadiah", C: Gift },
  { key: "plane", label: "Perjalanan", C: Plane },
  { key: "car", label: "Kendaraan", C: Car },
  { key: "home", label: "Rumah", C: Home },
  { key: "utensils", label: "Makan", C: UtensilsCrossed },
  { key: "coffee", label: "Ngopi", C: Coffee },
  { key: "shopping-bag", label: "Belanja", C: ShoppingBag },
  { key: "credit-card", label: "Tagihan", C: CreditCard },
  { key: "wrench", label: "Servis", C: Wrench },
  { key: "book", label: "Belajar", C: BookOpen },
  { key: "dumbbell", label: "Olahraga", C: Dumbbell },
  { key: "pill", label: "Obat", C: Pill },
  { key: "sun", label: "Pagi", C: Sun },
  { key: "moon", label: "Malam", C: Moon },
  { key: "cloud", label: "Cuaca", C: Cloud },
  { key: "sparkles", label: "Spesial", C: Sparkles },
];

export const ICON_MAP = Object.fromEntries(ICONS.map((i) => [i.key, i]));

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
