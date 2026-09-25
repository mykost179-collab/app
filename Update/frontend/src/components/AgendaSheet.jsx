import Sheet from "@/components/Sheet";
import { COLOR_MAP, ICON_MAP, formatTanggalFull, WEEKDAYS_FULL, parseDateStr } from "@/lib/constants";
import { CalendarDays } from "lucide-react";

export default function AgendaSheet({ open, onClose, markers, onJump }) {
  const groups = (() => {
    const sorted = [...markers].sort((a, b) => a.date.localeCompare(b.date));
    const map = new Map();
    for (const m of sorted) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date).push(m);
    }
    return [...map.entries()];
  })();

  return (
    <Sheet open={open} onClose={onClose} title="Agenda" testid="agenda">
      {groups.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93]">
            <CalendarDays size={24} strokeWidth={2.2} />
          </div>
          <p className="mt-4 font-extrabold text-[15px] text-[#0B0B0F]">Agenda masih kosong</p>
          <p className="text-[13px] font-medium text-[#8E8E93] mt-1">Semua tanggal yang Anda tandai akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(([date, items]) => (
            <div key={date}>
              <p className="px-1 mb-1.5 text-[12px] font-extrabold tracking-[0.14em] text-[#8E8E93] uppercase">
                {formatTanggalFull(date)}
              </p>
              <div className="space-y-1.5">
                {items.map((m) => {
                  const Icon = (ICON_MAP[m.icon] || ICON_MAP["check-circle"]).C;
                  const c = COLOR_MAP[m.color];
                  return (
                    <button
                      key={m.id}
                      data-testid={`agenda-item-${m.id}`}
                      onClick={() => onJump(m.date)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F7F9] active:scale-[0.98] transition-transform text-left"
                    >
                      <span
                        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: c.hex }}
                      >
                        <Icon size={19} strokeWidth={2.4} style={{ color: c.darkText ? "#0B0B0F" : "#FFFFFF" }} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-extrabold text-[#0B0B0F] truncate">{m.label}</span>
                        <span className="block text-[12px] font-semibold text-[#8E8E93]">
                          {WEEKDAYS_FULL[parseDateStr(date).getDay()]}, {formatTanggalFull(date)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Sheet>
  );
}
