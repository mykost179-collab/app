import { useState, useMemo } from "react";
import Sheet from "@/components/Sheet";
import { COLOR_MAP, ICON_MAP, formatTanggalFull } from "@/lib/constants";
import { Search } from "lucide-react";

export default function SearchSheet({ open, onClose, markers, onJump }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return markers
      .filter((m) => m.label.toLowerCase().includes(query) || m.date.includes(query))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 30);
  }, [q, markers]);

  return (
    <Sheet open={open} onClose={onClose} title="Cari Penanda" testid="search">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#F2F2F7]">
        <Search size={18} strokeWidth={2.4} className="text-[#8E8E93] shrink-0" />
        <input
          data-testid="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Keterangan atau tanggal (2026-09-20)"
          className="flex-1 bg-transparent outline-none text-[15px] font-semibold text-[#0B0B0F] placeholder:text-[#8E8E93]/70"
        />
      </div>

      <div className="mt-4 space-y-1.5">
        {!q.trim() && (
          <p className="py-10 text-center text-[13px] font-semibold text-[#8E8E93]">
            Ketik untuk mencari keterangan atau tanggal.
          </p>
        )}
        {q.trim() && results.length === 0 && (
          <p className="py-10 text-center text-[13px] font-semibold text-[#8E8E93]">
            Tidak ada penanda yang cocok dengan pencarian.
          </p>
        )}
        {results.map((m) => {
          const Icon = (ICON_MAP[m.icon] || ICON_MAP["check-circle"]).C;
          const c = COLOR_MAP[m.color];
          return (
            <button
              key={m.id}
              data-testid={`search-result-item-${m.id}`}
              onClick={() => onJump(m.date)}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F7F9] active:scale-[0.98] transition-transform text-left"
            >
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: c.hex }}>
                <Icon size={17} strokeWidth={2.4} style={{ color: c.darkText ? "#0B0B0F" : "#FFFFFF" }} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-extrabold text-[#0B0B0F] truncate">{m.label}</span>
                <span className="block text-[12px] font-semibold text-[#8E8E93]">{formatTanggalFull(m.date)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
