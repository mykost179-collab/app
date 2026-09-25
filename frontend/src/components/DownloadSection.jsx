import { Download, Loader2 } from "lucide-react";

export default function DownloadSection({ onDownload, exporting }) {
  return (
    <section className="flex flex-col items-center gap-3 pt-3 pb-12" data-testid="download-section">
      <button
        data-testid="download-jpg-button"
        onClick={onDownload}
        disabled={exporting}
        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B0B0F] text-white text-[14px] font-extrabold shadow-[0_10px_26px_rgba(0,0,0,0.22)] active:scale-95 transition-transform disabled:opacity-60"
      >
        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={17} strokeWidth={2.6} />}
        Share
      </button>
      <p className="text-[11px] font-semibold text-[#8E8E93]">Kualitas 4K (3840px) — di ponsel langsung membuka share sheet</p>
    </section>
  );
}
