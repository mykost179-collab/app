import { useState } from "react";
import Sheet from "@/components/Sheet";
import { COLOR_MAP, ICON_MAP, formatTanggalFull, WEEKDAYS_FULL, parseDateStr } from "@/lib/constants";
import { Pencil, Trash2, Plus } from "lucide-react";

function DeleteButton({ onClick, testid }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      data-testid={testid}
      onClick={() => {
        if (armed) onClick();
        else setTimeout(() => setArmed(false), 2500);
        setArmed(true);
      }}
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
        armed ? "bg-[#FF3B30] text-white" : "bg-[#F2F2F7] text-[#FF3B30]"
      }`}
      aria-label="Hapus"
    >
      <Trash2 size={16} strokeWidth={2.4} />
    </button>
  );
}

export default function DaySheet({ open, onClose, date, items, onEdit, onAdd, onDelete }) {
  if (!date) return null;
  const d = parseDateStr(date);

  return (
    <Sheet open={open} onClose={onClose} title={formatTanggalFull(date, true, true)} testid="day">
      <p className="px-1 -mt-1 mb-3 text-[12px] font-bold tracking-[0.14em] text-[#8E8E93] uppercase">
        {WEEKDAYS_FULL[d.getDay()]} • {items.length} penanda
      </p>

      {items.length === 0 && (
        <p className="py-8 text-center text-[13px] font-semibold text-[#8E8E93]">
          Belum ada penanda di tanggal ini.
        </p>
      )}

      <div className="space-y-1.5">
        {items.map((m) => {
          const Icon = (ICON_MAP[m.icon] || ICON_MAP["check-circle"]).C;
          const c = COLOR_MAP[m.color];
          return (
            <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F7F9]">
              <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: c.hex }}>
                <Icon size={19} strokeWidth={2.4} style={{ color: c.darkText ? "#0B0B0F" : "#FFFFFF" }} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-extrabold text-[#0B0B0F] truncate">{m.label}</span>
                <span className="block text-[12px] font-semibold text-[#8E8E93]">{c.label} • {(ICON_MAP[m.icon] || ICON_MAP["check-circle"]).label}</span>
              </span>
              <button
                data-testid={`marker-edit-button-${m.id}`}
                onClick={() => onEdit(m)}
                aria-label="Ubah"
                className="w-9 h-9 rounded-full bg-[#F2F2F7] text-[#0B0B0F] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
              >
                <Pencil size={15} strokeWidth={2.4} />
              </button>
              <DeleteButton testid={`marker-delete-button-${m.id}`} onClick={() => onDelete(m.id)} />
            </div>
          );
        })}
      </div>

      <button
        data-testid="day-add-button"
        onClick={onAdd}
        className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B0B0F] text-white text-[15px] font-extrabold active:scale-[0.98] transition-transform"
      >
        <Plus size={18} strokeWidth={2.8} />
        Tambah Penanda
      </button>
    </Sheet>
  );
}
