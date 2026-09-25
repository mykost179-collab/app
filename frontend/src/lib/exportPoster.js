import {
  MONTHS_ID, WEEKDAYS_SHORT, COLOR_MAP,
  legendGroups, monthWeeks, formatTanggalPendek, formatTanggalFull, pad2, todayStr,
} from "@/lib/constants";

const INK = "#0B0B0F";
const GRAY = "#8E8E93";
const LIGHT = "#B3B3BA";
const DESIGN_W = 1280;
const SCALE = 3;

const font = (weight, size) => `${weight} ${size}px "Plus Jakarta Sans", sans-serif`;

const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const ellipsize = (ctx, text, maxW) => {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
};

const drawSpaced = (ctx, text, x, y, ls) => {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + ls;
  }
};

const svgToImage = (svg, color) =>
  new Promise((resolve) => {
    let s = svg.replace(/currentColor/g, color);
    if (!s.includes("xmlns")) s = s.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  });

export async function renderPosterJpg({ view, eventsByDate, markers, iconSvgs }) {
  const { year, month } = view;
  const weeks = monthWeeks(year, month);
  const allGroups = legendGroups(markers);
  const groups = allGroups.slice(0, 8);
  const hidden = allGroups.length - groups.length;
  const prefix = `${year}-${pad2(month)}`;
  const markedCount = [...new Set(Object.keys(eventsByDate).filter((d) => d.startsWith(prefix)))].length;

  try {
    await Promise.all([
      document.fonts.load(font(800, 56)),
      document.fonts.load(font(900, 34)),
      document.fonts.load(font(700, 20)),
      document.fonts.load(font(600, 15)),
    ]);
    await document.fonts.ready;
  } catch (e) {
    // lanjut dengan font yang tersedia
  }

  const iconImgs = await Promise.all(
    groups.map((g) => {
      const svg = iconSvgs[g.icon] || iconSvgs["check-circle"] || iconSvgs["check-circle2"];
      return svg ? svgToImage(svg, COLOR_MAP[g.color].hex) : Promise.resolve(null);
    })
  );

  const PAD = 56;
  const W = DESIGN_W;
  const GAP = 48;
  const W1 = 660;
  const W2 = W - PAD * 2 - GAP - W1;
  const cellW = W1 / 7;
  const rowH = 94;
  const HEADER_TOP = 46;
  const headH = 96;
  const bodyTop = HEADER_TOP + headH + 34;
  const calH = 40 + weeks.length * rowH;
  const legendRowH = 112;
  const legendH = 52 + (groups.length ? groups.length * (legendRowH + 12) : 40);
  const bodyH = Math.max(calH, legendH);
  const H = Math.ceil(bodyTop + bodyH + 84);

  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#FAFAFB";
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.textAlign = "left";
  ctx.fillStyle = GRAY;
  ctx.font = font(800, 14);
  drawSpaced(ctx, "MY DATE — KALENDER PENANDA", PAD, HEADER_TOP + 14, 4);
  ctx.fillStyle = INK;
  ctx.font = font(800, 56);
  ctx.fillText(`${MONTHS_ID[month - 1]} ${year}`, PAD, HEADER_TOP + 78);

  ctx.textAlign = "right";
  ctx.fillStyle = INK;
  ctx.font = font(700, 20);
  ctx.fillText(`${markedCount} hari ditandai`, W - PAD, HEADER_TOP + 58);
  ctx.fillStyle = GRAY;
  ctx.font = font(600, 14);
  ctx.fillText(`dicatat ${formatTanggalFull(todayStr())}`, W - PAD, HEADER_TOP + 82);
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(60,60,67,0.14)";
  ctx.fillRect(PAD, HEADER_TOP + headH, W - PAD * 2, 2);

  // Kolom kalender
  const calX = PAD;
  const calTop = bodyTop;
  ctx.textAlign = "center";
  ctx.fillStyle = GRAY;
  ctx.font = font(800, 15);
  for (let i = 0; i < 7; i++) ctx.fillText(WEEKDAYS_SHORT[i], calX + i * cellW + cellW / 2, calTop + 22);
  ctx.fillStyle = "rgba(60,60,67,0.10)";
  ctx.fillRect(calX, calTop + 38, W1, 1);

  for (let wi = 0; wi < weeks.length; wi++) {
    const rowY = calTop + 40 + wi * rowH;
    for (let di = 0; di < 7; di++) {
      const day = weeks[wi][di];
      if (!day) continue;
      const cx = calX + di * cellW + cellW / 2;
      const cy = rowY + rowH / 2;
      const ds = `${year}-${pad2(month)}-${pad2(day)}`;
      const evs = eventsByDate[ds] || [];
      const main = evs[0];
      if (main) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.16)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = COLOR_MAP[main.color].hex;
        ctx.beginPath();
        ctx.arc(cx, cy, 31, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = INK;
        ctx.font = font(800, 26);
        ctx.fillText(String(day), cx, cy + 9);
        if (evs.length > 1) {
          const bx = cx + 27, by = cy - 27;
          ctx.fillStyle = "#0B0B0F";
          ctx.beginPath();
          ctx.arc(bx, by, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#FAFAFB";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = "#FFFFFF";
          ctx.font = font(800, 13);
          ctx.fillText(String(evs.length), bx, by + 4.5);
        }
      } else {
        ctx.fillStyle = ds === todayStr() ? INK : LIGHT;
        ctx.font = font(600, 34);
        ctx.fillText(String(day), cx, cy + 12);
      }
    }
    if (wi < weeks.length - 1) {
      ctx.fillStyle = "rgba(60,60,67,0.07)";
      ctx.fillRect(calX, rowY + rowH, W1, 1);
    }
  }

  // Kolom legenda
  const legX = PAD + W1 + GAP;
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = font(800, 34);
  ctx.fillText("Legenda", legX, calTop + 34);

  let ly = calTop + 56;
  if (!groups.length) {
    ctx.fillStyle = GRAY;
    ctx.font = font(600, 16);
    ctx.fillText("Belum ada penanda bulan ini.", legX, ly + 12);
  } else {
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi];
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.05)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "#FFFFFF";
      rr(ctx, legX, ly, W2, legendRowH, 24);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(60,60,67,0.10)";
      ctx.lineWidth = 1;
      rr(ctx, legX + 0.5, ly + 0.5, W2 - 1, legendRowH - 1, 24);
      ctx.stroke();

      const cyc = ly + legendRowH / 2;
      const ccx = legX + 22 + 42;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ccx, cyc, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ccx, cyc, 41, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLOR_MAP[g.color].hex;
      ctx.beginPath();
      ctx.arc(ccx, cyc, 41, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.font = font(900, 34);
      ctx.textAlign = "center";
      ctx.fillText(String(g.count), ccx, cyc + 12);
      ctx.textAlign = "left";

      const tx = legX + 22 + 84 + 20;
      const maxW = W2 - (22 + 84 + 20) - 36;
      ctx.font = font(800, 26);
      const label = ellipsize(ctx, g.label, maxW - 38);
      const labelW = ctx.measureText(label).width;
      ctx.fillStyle = INK;
      ctx.fillText(label, tx, cyc - 6);
      const iconImg = iconImgs[gi];
      if (iconImg) ctx.drawImage(iconImg, tx + labelW + 10, cyc - 27, 28, 28);
      ctx.fillStyle = GRAY;
      ctx.font = font(600, 15);
      const datesTxt =
        g.dates.slice(0, 6).map(formatTanggalPendek).join(" • ") +
        (g.dates.length > 6 ? ` +${g.dates.length - 6}` : "");
      ctx.fillText(ellipsize(ctx, datesTxt, maxW), tx, cyc + 24);

      ly += legendRowH + 12;
    }
    if (hidden > 0) {
      ctx.fillStyle = GRAY;
      ctx.font = font(600, 14);
      ctx.fillText(`+${hidden} kelompok lainnya`, legX, ly + 10);
    }
  }

  // Kaki poster
  const footY = bodyTop + bodyH + 30;
  ctx.fillStyle = "rgba(60,60,67,0.10)";
  ctx.fillRect(PAD, footY, W - PAD * 2, 1);
  ctx.fillStyle = GRAY;
  ctx.font = font(600, 13);
  ctx.textAlign = "center";
  ctx.fillText(`My Date — catat hari berwarnamu • ${MONTHS_ID[month - 1]} ${year}`, W / 2, footY + 28);
  ctx.textAlign = "left";

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob-gagal"))), "image/jpeg", 0.92)
  );
  return {
    blob,
    fileName: `My-Date-${MONTHS_ID[month - 1]}-${year}.jpg`,
    width: canvas.width,
    height: canvas.height,
  };
}
