import {
  MONTHS_ID, WEEKDAYS_SHORT, COLOR_MAP, ICON_MAP,
  legendGroups, monthWeeks, formatTanggalPendek, formatTanggalFull, pad2, todayStr,
} from "@/lib/constants";

export default function ExportCard({ view, eventsByDate, markers }) {
  const { year, month } = view;
  const weeks = monthWeeks(year, month);
  const groups = legendGroups(markers);
  const prefix = `${year}-${pad2(month)}`;
  const markedCount = [...new Set(Object.keys(eventsByDate).filter((d) => d.startsWith(prefix)))].length;

  return (
    <div
      id="export-card"
      style={{ width: 430, background: "#FAFAFB", padding: "26px 24px 18px", boxSizing: "border-box" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <img
          src="/app-icon.png"
          alt="My Date"
          style={{ width: 46, height: 46, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.18)" }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: "#8E8E93" }}>MY DATE</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "#0B0B0F", lineHeight: 1.1 }}>
            {MONTHS_ID[month - 1]} {year}
          </p>
        </div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#8E8E93" }}>{markedCount} hari ditandai</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "4px 0 8px", borderBottom: "1px solid rgba(60,60,67,0.12)" }}>
        {WEEKDAYS_SHORT.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#8E8E93" }}>
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div
          key={wi}
          style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: wi < weeks.length - 1 ? "1px solid rgba(60,60,67,0.08)" : "none",
          }}
        >
          {week.map((day, di) => {
            if (!day) return <div key={di} style={{ height: 50 }} />;
            const ds = `${year}-${pad2(month)}-${pad2(day)}`;
            const evs = eventsByDate[ds] || [];
            const main = evs[0];
            return (
              <div key={di} style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {main ? (
                  <span
                    style={{
                      width: 38, height: 38, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                      background: COLOR_MAP[main.color].hex, fontSize: 16, fontWeight: 800, color: "#0B0B0F",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.12)", position: "relative",
                    }}
                  >
                    {day}
                    {evs.length > 1 && (
                      <span style={{
                        position: "absolute", top: -3, right: -3, minWidth: 15, height: 15, padding: "0 3px",
                        borderRadius: 999, background: "#0B0B0F", color: "#fff", fontSize: 9, fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FAFAFB",
                      }}>
                        {evs.length}
                      </span>
                    )}
                  </span>
                ) : (
                  <span style={{ fontSize: 19, fontWeight: 600, color: ds === todayStr() ? "#0B0B0F" : "#B3B3BA" }}>{day}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <p style={{ margin: "18px 0 10px", fontSize: 19, fontWeight: 800, color: "#0B0B0F" }}>Legenda</p>
      {groups.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#8E8E93" }}>Belum ada penanda bulan ini.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {groups.map((g) => {
            const Icon = (ICON_MAP[g.icon] || ICON_MAP["check-circle"]).C;
            return (
              <div
                key={g.key}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 20,
                  background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)",
                }}
              >
                <span
                  style={{
                    width: 54, height: 54, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                    background: COLOR_MAP[g.color].hex, fontSize: 22, fontWeight: 900, color: "#0B0B0F",
                    border: "3px solid #FFFFFF", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", flexShrink: 0,
                  }}
                >
                  {g.count}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 800, color: "#0B0B0F" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.label}</span>
                    <Icon size={17} strokeWidth={2.4} style={{ color: COLOR_MAP[g.color].hex, flexShrink: 0 }} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#8E8E93" }}>
                    {g.dates.slice(0, 5).map(formatTanggalPendek).join(" • ")}
                    {g.dates.length > 5 ? ` +${g.dates.length - 5}` : ""}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 10, fontWeight: 600, color: "#8E8E93" }}>
        My Date — dicatat {formatTanggalFull(todayStr())}
      </p>
    </div>
  );
}
