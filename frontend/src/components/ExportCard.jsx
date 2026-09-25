import {
  MONTHS_ID, WEEKDAYS_SHORT, COLOR_MAP, ICON_MAP,
  legendGroups, monthWeeks, formatTanggalPendek, formatTanggalFull, pad2, todayStr,
} from "@/lib/constants";

const HAIRLINE = "1px solid rgba(60,60,67,0.10)";

function Cell({ day, year, month, eventsByDate }) {
  if (!day) return <div style={{ height: 94 }} />;
  const ds = `${year}-${pad2(month)}-${pad2(day)}`;
  const evs = eventsByDate[ds] || [];
  const main = evs[0];
  return (
    <div style={{ height: 94, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {main ? (
        <span
          style={{
            width: 62, height: 62, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
            background: COLOR_MAP[main.color].hex, fontSize: 26, fontWeight: 800, color: "#0B0B0F",
            boxShadow: "0 6px 16px rgba(0,0,0,0.14)", position: "relative", boxSizing: "border-box",
          }}
        >
          {day}
          {evs.length > 1 && (
            <span style={{
              position: "absolute", top: -4, right: -4, minWidth: 24, height: 24, padding: "0 4px",
              borderRadius: 999, background: "#0B0B0F", color: "#FFFFFF", fontSize: 13, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #FAFAFB", boxSizing: "border-box",
            }}>
              {evs.length}
            </span>
          )}
        </span>
      ) : (
        <span style={{ fontSize: 34, fontWeight: 600, color: ds === todayStr() ? "#0B0B0F" : "#B3B3BA" }}>{day}</span>
      )}
    </div>
  );
}

export default function ExportCard({ view, eventsByDate, markers }) {
  const { year, month } = view;
  const weeks = monthWeeks(year, month);
  const allGroups = legendGroups(markers);
  const groups = allGroups.slice(0, 8);
  const hiddenGroups = allGroups.length - groups.length;
  const prefix = `${year}-${pad2(month)}`;
  const markedCount = [...new Set(Object.keys(eventsByDate).filter((d) => d.startsWith(prefix)))].length;

  return (
    <div
      id="export-card"
      style={{ width: 1280, background: "#FAFAFB", padding: "52px 56px 26px", boxSizing: "border-box", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 26, borderBottom: "2px solid rgba(60,60,67,0.14)" }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: "0.28em", color: "#8E8E93" }}>MY DATE — KALENDER PENANDA</p>
          <p style={{ margin: "10px 0 0", fontSize: 56, fontWeight: 800, letterSpacing: "-0.02em", color: "#0B0B0F", lineHeight: 1 }}>
            {MONTHS_ID[month - 1]} {year}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0B0B0F" }}>{markedCount} hari ditandai</p>
          <p style={{ margin: "6px 0 0", fontSize: 14, fontWeight: 600, color: "#8E8E93" }}>dicatat {formatTanggalFull(todayStr())}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 48, paddingTop: 30, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 57%", minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", paddingBottom: 12, borderBottom: HAIRLINE }}>
            {WEEKDAYS_SHORT.map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 15, fontWeight: 800, letterSpacing: "0.1em", color: "#8E8E93" }}>
                {d}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                borderBottom: wi < weeks.length - 1 ? "1px solid rgba(60,60,67,0.07)" : "none",
              }}
            >
              {week.map((day, di) => (
                <Cell key={di} day={day} year={year} month={month} eventsByDate={eventsByDate} />
              ))}
            </div>
          ))}
        </div>

        <div style={{ flex: "1 1 43%", minWidth: 0 }}>
          <p style={{ margin: "0 0 18px", fontSize: 34, fontWeight: 800, color: "#0B0B0F", letterSpacing: "-0.01em" }}>Legenda</p>
          {groups.length === 0 ? (
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#8E8E93" }}>Belum ada penanda bulan ini.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {groups.map((g) => {
                const Icon = (ICON_MAP[g.icon] || ICON_MAP["check-circle"]).C;
                return (
                  <div
                    key={g.key}
                    style={{
                      display: "flex", alignItems: "center", gap: 20, padding: "18px 22px", borderRadius: 24,
                      background: "#FFFFFF", border: HAIRLINE, boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span
                      style={{
                        width: 84, height: 84, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                        background: COLOR_MAP[g.color].hex, fontSize: 34, fontWeight: 900, color: "#0B0B0F",
                        border: "4px solid #FFFFFF", boxShadow: "0 6px 18px rgba(0,0,0,0.12)", flexShrink: 0, boxSizing: "border-box",
                      }}
                    >
                      {g.count}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 26, fontWeight: 800, color: "#0B0B0F" }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.label}</span>
                        <Icon size={26} strokeWidth={2.4} data-export-icon={g.icon} style={{ color: COLOR_MAP[g.color].hex, flexShrink: 0 }} />
                      </span>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#8E8E93", marginTop: 4 }}>
                        {g.dates.slice(0, 6).map(formatTanggalPendek).join(" • ")}
                        {g.dates.length > 6 ? ` +${g.dates.length - 6}` : ""}
                      </span>
                    </span>
                  </div>
                );
              })}
              {hiddenGroups > 0 && (
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "#8E8E93" }}>
                  +{hiddenGroups} kelompok lainnya
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={{ margin: "30px 0 0", paddingTop: 18, borderTop: HAIRLINE, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#8E8E93" }}>
        My Date — catat hari berwarnamu • {MONTHS_ID[month - 1]} {year}
      </p>
    </div>
  );
}
