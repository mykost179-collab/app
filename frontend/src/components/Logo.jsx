export const LogoMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <rect width="64" height="64" rx="17" fill="#0B0B0F" />
    <circle cx="20" cy="32" r="6.5" fill="#34C759" />
    <circle cx="32" cy="32" r="6.5" fill="#FFCC00" />
    <circle cx="44" cy="32" r="6.5" fill="#FF3B30" />
  </svg>
);

export default function Logo() {
  return (
    <footer className="flex flex-col items-center gap-1.5 pt-8 pb-12" data-testid="app-footer">
      <LogoMark size={30} />
      <p className="text-[13px] font-extrabold tracking-tight text-[#0B0B0F]">Tanda</p>
      <p className="text-[11px] font-semibold text-[#8E8E93]">Catat hari. Rayai momen.</p>
    </footer>
  );
}
