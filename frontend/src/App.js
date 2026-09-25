import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import Lenis from "lenis";
import html2canvas from "html2canvas";
import { fetchMarkers, createMarker, updateMarker, deleteMarker, pesanError } from "@/lib/api";
import { MONTHS_ID, todayStr, parseDateStr, pad2 } from "@/lib/constants";
import TopBar from "@/components/TopBar";
import CalendarGrid from "@/components/CalendarGrid";
import Legend from "@/components/Legend";
import Marquee from "@/components/Marquee";
import DownloadSection from "@/components/DownloadSection";
import ExportCard from "@/components/ExportCard";
import YearSheet from "@/components/YearSheet";
import AgendaSheet from "@/components/AgendaSheet";
import SearchSheet from "@/components/SearchSheet";
import DaySheet from "@/components/DaySheet";
import AddSheet from "@/components/AddSheet";
import "./App.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] p-8 text-center">
          <p className="text-[15px] font-bold text-[#0B0B0F]">Terjadi kesalahan. Muat ulang halaman.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function TandaApp() {
  const qc = useQueryClient();
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [dir, setDir] = useState(1);
  const [sheet, setSheet] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [editMarker, setEditMarker] = useState(null);
  const [legendFilter, setLegendFilter] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleDownload = useCallback(async () => {
    const node = document.getElementById("export-card");
    if (!node || exporting) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#FAFAFB", useCORS: true, logging: false });
      const link = document.createElement("a");
      link.download = `My-Date-${MONTHS_ID[view.month - 1]}-${view.year}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
      toast.success("JPG tersimpan di perangkatmu");
    } catch (e) {
      toast.error("Gagal membuat JPG, coba lagi");
    } finally {
      setExporting(false);
    }
  }, [exporting, view]);

  const { data: markers = [], isLoading } = useQuery({ queryKey: ["markers"], queryFn: fetchMarkers });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const onCreate = useMutation({
    mutationFn: createMarker,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["markers"] });
      toast.success("Penanda ditambahkan");
    },
    onError: (e) => toast.error(pesanError(e)),
  });
  const onUpdate = useMutation({
    mutationFn: ({ id, data }) => updateMarker(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["markers"] });
      toast.success("Perubahan disimpan");
    },
    onError: (e) => toast.error(pesanError(e)),
  });
  const onDelete = useMutation({
    mutationFn: deleteMarker,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["markers"] });
      toast.success("Penanda dihapus");
    },
    onError: (e) => toast.error(pesanError(e)),
  });

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const m of markers) {
      if (!map[m.date]) map[m.date] = [];
      map[m.date].push(m);
    }
    return map;
  }, [markers]);

  const meta = useMemo(() => {
    const prefix = `${view.year}-${pad2(view.month)}`;
    const n = [...new Set(Object.keys(eventsByDate).filter((d) => d.startsWith(prefix)))].length;
    if (n === 0) return "Belum ada penanda bulan ini";
    return n === 1 ? "1 hari ditandai" : `${n} hari ditandai`;
  }, [eventsByDate, view]);

  const goMonth = useCallback((delta) => {
    setDir(delta > 0 ? 1 : -1);
    setView((v) => {
      const d = new Date(v.year, v.month - 1 + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });
  }, []);

  const goToday = useCallback(() => {
    const t = new Date();
    setDir(t.getFullYear() > view.year || (t.getFullYear() === view.year && t.getMonth() + 1 > view.month) ? 1 : -1);
    setView({ year: t.getFullYear(), month: t.getMonth() + 1 });
    setSheet(null);
  }, [view]);

  const jumpTo = useCallback((dateStr) => {
    const d = parseDateStr(dateStr);
    setDir(d.getFullYear() > view.year || (d.getFullYear() === view.year && d.getMonth() + 1 > view.month) ? 1 : -1);
    setView({ year: d.getFullYear(), month: d.getMonth() + 1 });
    setSheet(null);
  }, [view]);

  const openDay = useCallback((dateStr) => {
    setActiveDate(dateStr);
    setSheet("day");
  }, []);

  const openAdd = useCallback((dateStr) => {
    if (dateStr) setActiveDate(dateStr);
    setEditMarker(null);
    setSheet("add");
  }, []);

  const openEdit = useCallback((m) => {
    setEditMarker(m);
    setSheet("add");
  }, []);

  const toggleLegendFilter = useCallback((g) => {
    setLegendFilter((prev) =>
      prev && prev.label === g.label && prev.color === g.color && prev.icon === g.icon ? null : { label: g.label, color: g.color, icon: g.icon }
    );
  }, []);

  const showTodayChip = view.year !== now.getFullYear() || view.month !== now.getMonth() + 1;
  const dayItems = activeDate ? eventsByDate[activeDate] || [] : [];

  return (
    <div className="tanda-desktop-bg min-h-screen flex justify-center">
      <div className="tanda-frame relative flex flex-col min-h-screen w-full max-w-[430px]" data-testid="app-frame">
        <div className="grain" />
        <TopBar
          year={view.year}
          onOpenYear={() => setSheet("year")}
          onAgenda={() => setSheet("agenda")}
          onSearch={() => setSheet("search")}
          onAdd={() => openAdd(activeDate || todayStr())}
          showToday={showTodayChip}
          onToday={goToday}
        />
        <main className="flex-1">
          <CalendarGrid
            view={view}
            dir={dir}
            eventsByDate={eventsByDate}
            onPrev={() => goMonth(-1)}
            onNext={() => goMonth(1)}
            onSelectDate={openDay}
            legendFilter={legendFilter}
            meta={meta}
          />
          <Marquee markers={markers} onJump={jumpTo} />
          <Legend
            markers={markers}
            legendFilter={legendFilter}
            onToggleFilter={toggleLegendFilter}
            onAdd={() => openAdd(todayStr())}
          />
          <DownloadSection onDownload={handleDownload} exporting={exporting} />
        </main>

        <div className="export-offscreen" aria-hidden="true">
          <ExportCard view={view} eventsByDate={eventsByDate} markers={markers} />
        </div>

        <YearSheet
          open={sheet === "year"}
          onClose={() => setSheet(null)}
          year={view.year}
          onPick={(y) => setView((v) => ({ ...v, year: y }))}
          onToday={goToday}
        />
        <AgendaSheet open={sheet === "agenda"} onClose={() => setSheet(null)} markers={markers} onJump={jumpTo} />
        <SearchSheet open={sheet === "search"} onClose={() => setSheet(null)} markers={markers} onJump={jumpTo} />
        <DaySheet
          open={sheet === "day" && !!activeDate}
          onClose={() => setSheet(null)}
          date={activeDate}
          items={dayItems}
          onEdit={openEdit}
          onAdd={() => openAdd(activeDate)}
          onDelete={(id) => onDelete.mutate(id)}
        />
        <AddSheet
          open={sheet === "add"}
          onClose={() => {
            setSheet(null);
            setEditMarker(null);
          }}
          initialDate={activeDate || todayStr()}
          editMarker={editMarker}
          onCreate={(data) => onCreate.mutate(data)}
          onUpdate={(id, data) => onUpdate.mutate({ id, data })}
          onDelete={(id) => onDelete.mutate(id)}
        />

        <Toaster position="top-center" richColors toastOptions={{ style: { fontFamily: "inherit" } }} />
        {isLoading && <div className="fixed bottom-3 left-0 right-0 text-center text-[11px] font-bold text-[#8E8E93]">Memuat…</div>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TandaApp />
    </ErrorBoundary>
  );
}
