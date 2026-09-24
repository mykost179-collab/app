import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, List, Search, Plus } from "lucide-react";

export default function TopBar({ year, onOpenYear, onAgenda, onSearch, onAdd, showToday, onToday }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAFAFB]/85 px-4 pt-5 pb-3 flex items-center justify-between gap-2 border-b border-[#3C3C43]/5">
      <button
        data-testid="header-year-button"
        onClick={onOpenYear}
        className="flex items-center gap-0.5 pl-2.5 pr-4 py-2 rounded-full bg-white border border-[#3C3C43]/10 text-[15px] font-extrabold text-[#0B0B0F] shadow-[0_2px_10px_rgba(0,0,0,0.06)] active:scale-95 transition-transform"
      >
        <ChevronLeft size={18} strokeWidth={3} />
        {year}
      </button>

      <AnimatePresence mode="popLayout">
        {showToday && (
          <motion.button
            key="today-chip"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            data-testid="today-button"
            onClick={onToday}
            className="px-3.5 py-2 rounded-full bg-[#0B0B0F] text-white text-[11px] font-extrabold tracking-[0.12em] shadow-[0_4px_14px_rgba(0,0,0,0.18)] active:scale-95 transition-transform"
          >
            HARI INI
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-0.5 p-1 rounded-full bg-white/90 border border-[#3C3C43]/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <button data-testid="header-agenda-button" onClick={onAgenda} className="top-pill-btn" aria-label="Agenda">
          <List size={19} strokeWidth={2.4} />
        </button>
        <button data-testid="header-search-button" onClick={onSearch} className="top-pill-btn" aria-label="Cari">
          <Search size={19} strokeWidth={2.4} />
        </button>
        <button data-testid="header-add-marker-button" onClick={onAdd} className="top-pill-btn" aria-label="Tambah penanda">
          <Plus size={20} strokeWidth={2.6} />
        </button>
      </div>
    </header>
  );
}
