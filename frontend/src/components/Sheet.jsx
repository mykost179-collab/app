import { Drawer } from "vaul";
import { X } from "lucide-react";

export default function Sheet({ open, onClose, title, children, testid = "sheet" }) {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Drawer.Portal>
        <Drawer.Overlay className="tanda-sheet-overlay" />
        <Drawer.Content className="tanda-sheet flex flex-col max-h-[90vh]" data-testid={`${testid}-sheet`}>
          <div className="tanda-sheet-grabber shrink-0" />
          <div className="sticky top-0 z-10 flex items-center justify-between pl-6 pr-4 pt-1 pb-3 bg-white/95 backdrop-blur rounded-t-[28px] shrink-0">
            <Drawer.Title className="text-xl font-extrabold tracking-tight text-[#0B0B0F]">{title}</Drawer.Title>
            <button
              data-testid="sheet-close-button"
              onClick={onClose}
              aria-label="Tutup"
              className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#3C3C43]/70 active:scale-90 transition-transform"
            >
              <X size={15} strokeWidth={2.8} />
            </button>
          </div>
          <div className="px-5 pb-12 overflow-y-auto flex-1 no-scrollbar">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
