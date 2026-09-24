import { useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  MONTHS_ID, WEEKDAYS_SHORT, COLOR_MAP, dateStr, todayStr,
} from "@/lib/constants";

function Cell({ year, month, day, index, events, onSelect, legendFilter, today }) {
  if (!day) return <div className="h-[58px]" />;
  const ds = dateStr(year, month, day);
  const evs = events || [];
  const main = evs[0];
  const matchesFilter = legendFilter
    ? evs.some((e) => e.label === legendFilter.label && e.color === legendFilter.color && e.icon === legendFilter.icon)
    : true;
  const dimmed = legendFilter && (!evs.length || !matchesFilter);
  const isToday = ds === today;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: dimmed ? 0.22 : 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 26, delay: Math.min(index * 0.014, 0.5) }}
      className="h-[58px] flex items-center justify-center"
    >
      <button
        data-testid={`calendar-day-cell-${ds}`}
        onClick={() => onSelect(ds)}
        className="relative w-[47px] h-[47px] rounded-full flex items-center justify-center active:scale-90 transition-transform"
        aria-label={ds}
      >
        {main ? (
          <span
            className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[19px] font-extrabold text-[#0B0B0F]"
            style={{ background: COLOR_MAP[main.color].hex, boxShadow: "0 5px 14px rgba(0,0,0,0.14)" }}
          >
            {day}
            {evs.length > 1 && (
              <span
                data-testid={`day-multi-badge-${ds}`}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B0B0F] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[#FAFAFB]"
              >
                {evs.length}
              </span>
            )}
          </span>
        ) : (
          <span className={`text-[24px] font-semibold ${isToday ? "text-[#0B0B0F]" : "text-[#B3B3BA]"}`}>{day}</span>
        )}
        {isToday && <span className="absolute bottom-[1px] w-1 h-1 rounded-full bg-[#0B0B0F]/50" />}
      </button>
    </motion.div>
  );
}

export default function CalendarGrid({ view, dir, eventsByDate, onPrev, onNext, onSelectDate, legendFilter, meta }) {
  const { year, month } = view;
  const today = todayStr();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 60]);
  const fadeParallax = useTransform(scrollY, [0, 400], [1, 0.35]);

  const weeks = useMemo(() => {
    const lead = new Date(year, month - 1, 1).getDay();
    const total = new Date(year, month, 0).getDate();
    const cells = Array(lead).fill(null).concat(Array.from({ length: total }, (_, i) => i + 1));
    while (cells.length % 7) cells.push(null);
    const out = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [year, month]);

  return (
    <section className="px-3">
      <motion.div style={{ y: yParallax, opacity: fadeParallax }} className="px-2 pt-5 pb-3 flex items-end justify-between">
        <div className="overflow-hidden">
          <p className="text-[10px] font-extrabold tracking-[0.24em] text-[#8E8E93] mb-1">TANDA — KALENDER PENANDA</p>
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`${year}-${month}`}
                data-testid="month-title-display"
                initial={{ y: "108%" }}
                animate={{ y: 0 }}
                exit={{ y: "-108%" }}
                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                className="text-[44px] leading-[1.02] font-extrabold tracking-tight text-[#0B0B0F]"
              >
                {MONTHS_ID[month - 1]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <motion.p
            key={`meta-${year}-${month}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[13px] font-semibold text-[#8E8E93] mt-1.5"
          >
            {meta}
          </motion.p>
        </div>
        <div className="flex items-center gap-1.5 pb-2">
          <button
            data-testid="month-prev-button"
            onClick={onPrev}
            aria-label="Bulan sebelumnya"
            className="w-9 h-9 rounded-full bg-white border border-[#3C3C43]/10 shadow-sm flex items-center justify-center text-[#0B0B0F] active:scale-90 transition-transform"
          >
            <ChevronLeft size={17} strokeWidth={2.6} />
          </button>
          <button
            data-testid="month-next-button"
            onClick={onNext}
            aria-label="Bulan berikutnya"
            className="w-9 h-9 rounded-full bg-white border border-[#3C3C43]/10 shadow-sm flex items-center justify-center text-[#0B0B0F] active:scale-90 transition-transform"
          >
            <ChevronRight size={17} strokeWidth={2.6} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-7 px-2 pt-1 pb-2 border-b border-[#3C3C43]/10">
        {WEEKDAYS_SHORT.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-extrabold tracking-[0.14em] text-[#8E8E93]">
            {d}
          </div>
        ))}
      </div>

      <div
        data-testid="calendar-grid"
        className="px-1 pb-2 select-none touch-pan-y"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={(e, info) => {
            if (info.offset.x < -70) onNext();
            else if (info.offset.x > 70) onPrev();
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${year}-${month}`}
              initial={{ x: dir * 64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir * -64, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 33 }}
            >
              {weeks.map((week, wi) => (
                <div key={wi} className={`grid grid-cols-7 ${wi < weeks.length - 1 ? "border-b border-[#3C3C43]/[0.08]" : ""}`}>
                  {week.map((day, di) => (
                    <Cell
                      key={`${wi}-${di}`}
                      year={year}
                      month={month}
                      day={day}
                      index={wi * 7 + di}
                      events={day ? eventsByDate[dateStr(year, month, day)] : undefined}
                      onSelect={onSelectDate}
                      legendFilter={legendFilter}
                      today={today}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <p className="px-3 pb-1 text-[11px] font-semibold text-[#8E8E93] text-center">Geser kalender ke kiri / kanan untuk ganti bulan</p>
    </section>
  );
}
