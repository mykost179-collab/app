import { useState, useEffect } from "react";
import Sheet from "@/components/Sheet";
import { COLORS, ICONS, ICON_MAP, todayStr } from "@/lib/constants";
import { Check, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function AddSheet({ open, onClose, initialDate, editMarker, onCreate, onUpdate, onDelete }) {
  const [date, setDate] = useState(initialDate || todayStr());
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("red");
  const [icon, setIcon] = useState("check-circle2");
  const [iconQuery, setIconQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      setIconQuery("");
      if (editMarker) {
        setDate(editMarker.date);
        setLabel(editMarker.label);
        setColor(editMarker.color);
        setIcon(editMarker.icon);
      } else {
        setDate(initialDate || todayStr());
        setLabel("");
        setColor("red");
        setIcon("check-circle2");
      }
    }
  }, [open, editMarker, initialDate]);

  const q = iconQuery.trim().toLowerCase();
  const filteredIcons = q
    ? ICONS.filter((ic) => ic.label.toLowerCase().includes(q) || ic.key.includes(q))
    : ICONS;

  const submit = () => {
    if (!label.trim()) {
      toast.error("Keterangan wajib diisi");
      return;
    }
    if (editMarker) onUpdate(editMarker.id, { date, label, color, icon });
    else onCreate({ date, label, color, icon });
    onClose();
  };

  const activeColor = COLORS.find((c) => c.key === color) || COLORS[0];

  return (
    <Sheet open={open} onClose={onClose} title={editMarker ? "Ubah Penanda" : "Penanda Baru"} testid="add-marker">
      <label className="block mb-1.5 px-1 text-[11px] font-extrabold tracking-[0.18em] text-[#8E8E93]">TANGGAL</label>
      <input
        data-testid="add-marker-date-input"
        type="date"
        value={date}
        onChange={(e) => e.target.value && setDate(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-[#F2F2F7] text-[15px] font-bold text-[#0B0B0F] outline-none appearance-none"
      />

      <label className="block mt-4 mb-1.5 px-1 text-[11px] font-extrabold tracking-[0.18em] text-[#8E8E93]">KETERANGAN</label>
      <input
        data-testid="add-marker-label-input"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Contoh: Lunas, Token Listrik..."
        maxLength={80}
        className="w-full px-4 py-3 rounded-2xl bg-[#F2F2F7] text-[15px] font-semibold text-[#0B0B0F] placeholder:text-[#8E8E93]/70 placeholder:font-medium outline-none"
      />

      <label className="block mt-4 mb-2 px-1 text-[11px] font-extrabold tracking-[0.18em] text-[#8E8E93]">WARNA</label>
      <div className="grid grid-cols-7 gap-2.5 justify-items-center">
        {COLORS.map((c) => (
          <button
            key={c.key}
            data-testid={`color-option-${c.key}`}
            onClick={() => setColor(c.key)}
            aria-label={c.label}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              color === c.key ? "ring-2 ring-[#0B0B0F]/70 ring-offset-2 ring-offset-white scale-110" : ""
            }`}
            style={{ background: c.hex }}
          >
            {color === c.key && <Check size={15} strokeWidth={3.2} style={{ color: c.darkText ? "#0B0B0F" : "#FFFFFF" }} />}
          </button>
        ))}
      </div>

      <label className="block mt-4 mb-2 px-1 text-[11px] font-extrabold tracking-[0.18em] text-[#8E8E93]">
        SIMBOL <span className="text-[#8E8E93]/60 font-bold normal-case tracking-normal">• {ICONS.length} simbol gaya SF</span>
      </label>
      <div className="flex items-center gap-2 mb-2 px-3.5 py-2 rounded-xl bg-[#F2F2F7]">
        <Search size={14} strokeWidth={2.6} className="text-[#8E8E93] shrink-0" />
        <input
          data-testid="icon-search-input"
          value={iconQuery}
          onChange={(e) => setIconQuery(e.target.value)}
          placeholder="Cari simbol (kopi, kerja, hujan...)"
          className="flex-1 bg-transparent outline-none text-[13px] font-semibold text-[#0B0B0F] placeholder:text-[#8E8E93]/70 placeholder:font-medium"
        />
        {iconQuery && (
          <button data-testid="icon-search-clear" onClick={() => setIconQuery("")} aria-label="Bersihkan pencarian" className="text-[11px] font-extrabold text-[#007AFF]">
            Hapus
          </button>
        )}
      </div>
      <div className="grid grid-cols-6 gap-2 justify-items-center max-h-[248px] overflow-y-auto no-scrollbar pt-1 px-0.5">
        {filteredIcons.map((ic) => {
          const selected = icon === ic.key;
          return (
            <button
              key={ic.key}
              data-testid={`icon-option-${ic.key}`}
              onClick={() => setIcon(ic.key)}
              aria-label={ic.label}
              title={`${ic.label}`}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                selected ? "shadow-[0_5px_14px_rgba(0,0,0,0.16)] scale-105" : "bg-[#F2F2F7]"
              }`}
              style={selected ? { background: activeColor.hex } : undefined}
            >
              <ic.C
                size={19}
                strokeWidth={2.3}
                style={{ color: selected ? (activeColor.darkText ? "#0B0B0F" : "#FFFFFF") : "#3C3C43" }}
              />
            </button>
          );
        })}
        {filteredIcons.length === 0 && (
          <p className="col-span-6 py-6 text-center text-[13px] font-semibold text-[#8E8E93]">
            Simbol "{iconQuery}" tidak ditemukan.
          </p>
        )}
      </div>

      <button
        data-testid="add-marker-submit-button"
        onClick={submit}
        className="mt-6 w-full py-4 rounded-2xl bg-[#0B0B0F] text-white text-[15px] font-extrabold active:scale-[0.98] transition-transform shadow-[0_10px_26px_rgba(0,0,0,0.22)]"
      >
        {editMarker ? "Simpan Perubahan" : "Simpan Penanda"}
      </button>

      {editMarker && (
        <button
          data-testid="add-marker-delete-button"
          onClick={() => {
            if (confirmDelete) {
              onDelete(editMarker.id);
              onClose();
            } else {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 2500);
            }
          }}
          className={`mt-3 w-full py-3.5 rounded-2xl text-[15px] font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            confirmDelete ? "bg-[#FF3B30] text-white" : "bg-[#FFE5E5] text-[#FF3B30]"
          }`}
        >
          <Trash2 size={17} strokeWidth={2.4} />
          {confirmDelete ? "Ketuk lagi untuk hapus" : "Hapus Penanda"}
        </button>
      )}
    </Sheet>
  );
}
