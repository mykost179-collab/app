import { COLOR_MAP, ICON_MAP, formatTanggalPendek, todayStr } from "@/lib/constants";

export default function Marquee({ markers, onJump }) {
  const today = todayStr();
  const items = markers
    .filter((m) => m.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 15);
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div
      className="mt-1 py-2.5 bg-gradient-to-r from-[#FF9500]/10 via-[#FF2D55]/10 to-[#5856D6]/10 border-y border-[#3C3C43]/[0.06] flex items-center overflow-hidden"
      data-testid="marquee-banner"
    >
      <span className="pl-4 pr-3 text-[10px] font-black tracking-[0.2em] text-[#3C3C43]/60 shrink-0">JADWAL KE DEPAN</span>
      <div className="overflow-hidden flex-1">
        <div className="marquee-track items-center gap-2 pr-2">
          {loop.map((m, i) => {
            const Icon = (ICON_MAP[m.icon] || ICON_MAP["check-circle"]).C;
            return (
              <button
                key={`${m.id}-${i}`}
                data-testid="marquee-item"
                onClick={() => onJump(m.date)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#3C3C43]/[0.08] shadow-sm text-[13px] font-bold text-[#0B0B0F] shrink-0"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: COLOR_MAP[m.color].hex }} />
                {formatTanggalPendek(m.date)} · {m.label}
                <Icon size={14} strokeWidth={2.4} style={{ color: COLOR_MAP[m.color].hex }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
