import { useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { COLOR_MAP, ICON_MAP, formatTanggalPendek, slugify } from "@/lib/constants";

export default function Legend({ markers, legendFilter, onToggleFilter, onAdd }) {
  const groups = useMemo(() => {
    const map = new Map();
    for (const m of markers) {
      const key = `${m.label}|${m.color}|${m.icon}`;
      if (!map.has(key)) map.set(key, { key, label: m.label, color: m.color, icon: m.icon, dates: [] });
      map.get(key).dates.push(m.date);
    }
    return [...map.values()]
      .map((g) => ({ ...g, dates: g.dates.sort(), count: g.dates.length }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [markers]);

  return (
    <section className="px-4 pt-3 pb-2" data-testid="legend-section">
      <div className="flex items-baseline justify-between mb-2 px-2">
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#0B0B0F]">Legenda</h2>
        <p className="text-[11px] font-bold text-[#8E8E93]">
          {legendFilter ? "Ketuk lagi untuk hapus sorotan" : "Ketuk untuk menyorot tanggal"}
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="mt-2 rounded-[28px] border-2 border-dashed border-[#3C3C43]/15 bg-white/60 p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-white border border-[#3C3C43]/10 shadow-sm flex items-center justify-center text-[#8E8E93]">
            <Plus size={24} strokeWidth={2.4} />
          </div>
          <p className="mt-4 font-extrabold text-[15px] text-[#0B0B0F]">Belum ada penanda</p>
          <p className="text-[13px] font-medium text-[#8E8E93] mt-1 leading-relaxed">
            Tandai tanggal pertama Anda, nanti legenda terbentuk otomatis di sini.
          </p>
          <button
            data-testid="legend-empty-add-button"
            onClick={onAdd}
            className="mt-5 px-6 py-2.5 rounded-full bg-[#0B0B0F] text-white text-sm font-extrabold active:scale-95 transition-transform"
          >
            Tambah Penanda
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {groups.map((g, i) => {
            const Icon = (ICON_MAP[g.icon] || ICON_MAP["check-circle"]).C;
            const active =
              legendFilter &&
              legendFilter.label === g.label &&
              legendFilter.color === g.color &&
              legendFilter.icon === g.icon;
            const datesLabel =
              g.dates.slice(0, 4).map(formatTanggalPendek).join(" • ") + (g.dates.length > 4 ? ` +${g.dates.length - 4}` : "");
            return (
              <motion.button
                key={g.key}
                data-testid={`legend-item-${slugify(g.label)}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 26 }}
                onClick={() => onToggleFilter(g)}
                className={`w-full flex items-center gap-4 p-3.5 rounded-[26px] text-left transition-all active:scale-[0.98] ${
                  active
                    ? "bg-white ring-2 ring-[#0B0B0F]/15 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                    : "bg-white/85 border border-[#3C3C43]/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                }`}
              >
                <span
                  data-testid={`legend-count-${slugify(g.label)}`}
                  className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-[26px] font-black text-[#0B0B0F] shrink-0 border-[3px] border-white"
                  style={{ background: COLOR_MAP[g.color].hex, boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}
                >
                  {g.count}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5 text-[19px] font-extrabold text-[#0B0B0F]">
                    <span className="truncate">{g.label}</span>
                    <Icon size={20} strokeWidth={2.4} style={{ color: COLOR_MAP[g.color].hex }} className="shrink-0" />
                  </span>
                  <span className="block text-[12.5px] font-semibold text-[#8E8E93] mt-0.5 truncate">{datesLabel}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
}
