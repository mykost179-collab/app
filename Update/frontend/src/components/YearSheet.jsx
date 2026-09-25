import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sheet from "@/components/Sheet";

export default function YearSheet({ open, onClose, year, onPick, onToday }) {
  const [pageStart, setPageStart] = useState(year - 12);

  useEffect(() => {
    if (open) setPageStart(year - 12);
  }, [open, year]);

  const years = Array.from({ length: 24 }, (_, i) => pageStart + i);

  return (
    <Sheet open={open} onClose={onClose} title="Pilih Tahun" testid="year">
      <button
        data-testid="year-today-button"
        onClick={onToday}
        className="w-full mb-4 py-2.5 rounded-full bg-[#F2F2F7] text-[#0B0B0F] text-sm font-extrabold active:scale-[0.98] transition-transform"
      >
        Kembali ke Hari Ini
      </button>

      <div className="flex items-center justify-between mb-3 px-1">
        <button
          data-testid="year-range-prev"
          onClick={() => setPageStart((s) => s - 24)}
          aria-label="24 tahun sebelumnya"
          className="w-9 h-9 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#0B0B0F] active:scale-90 transition-transform"
        >
          <ChevronLeft size={17} strokeWidth={2.6} />
        </button>
        <span className="text-[13px] font-extrabold tracking-wide text-[#8E8E93]">
          {pageStart} – {pageStart + 23}
        </span>
        <button
          data-testid="year-range-next"
          onClick={() => setPageStart((s) => s + 24)}
          aria-label="24 tahun berikutnya"
          className="w-9 h-9 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#0B0B0F] active:scale-90 transition-transform"
        >
          <ChevronRight size={17} strokeWidth={2.6} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {years.map((y) => (
          <button
            key={y}
            data-testid={`year-option-${y}`}
            onClick={() => onPick(y)}
            className={`py-3 rounded-2xl text-[16px] font-extrabold transition-all active:scale-95 ${
              y === year
                ? "bg-[#0B0B0F] text-white shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
                : "bg-[#F2F2F7] text-[#0B0B0F]"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] font-semibold text-[#8E8E93]">Tanpa batas — geser rentang untuk masa lalu & masa depan</p>
    </Sheet>
  );
}
