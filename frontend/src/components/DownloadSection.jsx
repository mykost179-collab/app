import { Download, Loader2, Smartphone } from "lucide-react";

export default function DownloadSection({ onDownload, exporting, orientation, onOrientation }) {
  const pickBtn = (val, testid, label, rotated) => (
    <button
      data-testid={testid}
      onClick={() => onOrientation(val)}
      aria-pressed={orientation === val}
      aria-label={label}
      title={label}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
        orientation === val
          ? "bg-[#0B0B0F] text-white shadow-[0_5px_14px_rgba(0,0,0,0.2)]"
          : "text-[#3C3C43] hover:bg-[#F2F2F7]"
      }`}
    >
      <Smartphone size={19} strokeWidth={2.2} className={rotated ? "rotate-90" : ""} />
    </button>
  );

  return (
    <section className="flex flex-col items-center gap-3 pt-3 pb-12" data-testid="download-section">
      <div
        className="flex items-center gap-1 p-1 rounded-full bg-white/90 border border-[#3C3C43]/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
        data-testid="orientation-picker"
      >
        {pickBtn("portrait", "orientation-portrait-button", "Portrait — kalender di atas, legenda di bawah", false)}
        {pickBtn("landscape", "orientation-landscape-button", "Landscape — kalender di kiri, legenda di kanan", true)}
      </div>
      <button
        data-testid="download-jpg-button"
        onClick={onDownload}
        disabled={exporting || !orientation}
        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B0B0F] text-white text-[14px] font-extrabold shadow-[0_10px_26px_rgba(0,0,0,0.22)] active:scale-95 transition-transform disabled:opacity-40"
      >
        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={17} strokeWidth={2.6} />}
        Share
      </button>
      <p className="text-[11px] font-semibold text-[#8E8E93]">
        {!orientation && "Pilih tata letak dulu, lalu tekan Share"}
        {orientation === "portrait" && "Siap dibagikan — poster portrait (2560px, tajam)"}
        {orientation === "landscape" && "Siap dibagikan — poster landscape 4K (3840px)"}
      </p>
    </section>
  );
}
