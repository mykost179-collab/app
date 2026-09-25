import {
  MONTHS_ID, WEEKDAYS_SHORT, COLOR_MAP,
  legendGroups, monthWeeks, formatTanggalPendek, formatTanggalFull, pad2, todayStr,
} from "@/lib/constants";

const INK = "#0B0B0F";
const GRAY = "#8E8E93";
const LIGHT = "#B3B3BA";

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

async function loadFonts() {
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
}

export async function renderPosterJpg({ view, eventsByDate, markers, iconSvgs, orientation = "landscape" }) {
  const isPortrait = orientation === "portrait";
  const SCALE = isPortrait ? 4 : 3;
  const allGroups = legendGroups(markers);
  const markerData = {
    groups: allGroups.slice(0, 8),
    hidden: Math.max(0, allGroups.length - 8),
    markedCount: [...new Set(Object.keys(eventsByDate).filter((d) => d.startsWith(`${view.year}-${pad2(view.month)}`)))].length,
  };

  await loadFonts();

  const iconImgs = await Promise.all(
    markerData.groups.map((g) => {
      const svg = iconSvgs[g.icon] || iconSvgs["check-circle"] || iconSvgs["check-circle2"];
      return svg ? svgToImage(svg, COLOR_MAP[g.color].hex) : Promise.resolve(null);
    })
  );

  const measure = document.createElement("canvas").getContext("2d");
  measure.scale(SCALE, SCALE);
  const data = { view, eventsByDate, markerData, iconImgs };
  const dims = isPortrait ? drawPortrait(data, measure) : drawLandscape(data, measure);

  const canvas = document.createElement("canvas");
  canvas.width = dims.W * SCALE;
  canvas.height = dims.H * SCALE;
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);
  if (isPortrait) drawPortrait(data, ctx);
  else drawLandscape(data, ctx);

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob-gagal"))), "image/jpeg", 0.92)
  );
  return {
    blob,
    fileName: `My-Date-${MONTHS_ID[view.month - 1]}-${view.year}-${isPortrait ? "Portrait" : "Landscape"}.jpg`,
    width: canvas.width,
    height: canvas.height,
  };
}

function drawLandscape(d, ctx) {
  const { view, eventsByDate, markerData, iconImgs } = d;
  const { year, month } = view;
  const { groups, hidden, markedCount } = markerData;
  const weeks = monthWeeks(year, month);
  const PAD = 56;
  const W = 1280;
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

  return { W, H };
}

function drawPortrait(d, ctx) {
  const { view, eventsByDate, markerData, iconImgs } = d;
  const { year, month } = view;
  const { groups, hidden, markedCount } = markerData;
  const weeks = monthWeeks(year, month);
  const PAD = 40;
  const W = 640;
  const W1 = W - PAD * 2;
  const cellW = W1 / 7;
  const rowH = 72;
  const HEADER_TOP = 40;
  const headH = 118;
  const bodyTop = HEADER_TOP + headH + 26;
  const calH = 34 + weeks.length * rowH;
  const legendRowH = 88;
  const legendH = 42 + (groups.length ? groups.length * (legendRowH + 10) : 36);
  const bodyH = calH + 36 + legendH;
  const H = Math.ceil(bodyTop + bodyH + 84);

  ctx.fillStyle = "#FAFAFB";
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "left";
  ctx.fillStyle = GRAY;
  ctx.font = font(800, 11);
  drawSpaced(ctx, "MY DATE — KALENDER PENANDA", PAD, HEADER_TOP + 11, 3);
  ctx.fillStyle = INK;
  ctx.font = font(800, 40);
  ctx.fillText(`${MONTHS_ID[month - 1]} ${year}`, PAD, HEADER_TOP + 62);
  ctx.fillStyle = GRAY;
  ctx.font = font(600, 13);
  ctx.fillText(`${markedCount} hari ditandai • dicatat ${formatTanggalFull(todayStr())}`, PAD, HEADER_TOP + 92);

  ctx.fillStyle = "rgba(60,60,67,0.14)";
  ctx.fillRect(PAD, HEADER_TOP + headH, W1, 2);

  const calTop = bodyTop;
  ctx.textAlign = "center";
  ctx.fillStyle = GRAY;
  ctx.font = font(800, 12);
  for (let i = 0; i < 7; i++) ctx.fillText(WEEKDAYS_SHORT[i], PAD + i * cellW + cellW / 2, calTop + 18);
  ctx.fillStyle = "rgba(60,60,67,0.10)";
  ctx.fillRect(PAD, calTop + 30, W1, 1);

  for (let wi = 0; wi < weeks.length; wi++) {
    const rowY = calTop + 34 + wi * rowH;
    for (let di = 0; di < 7; di++) {
      const day = weeks[wi][di];
      if (!day) continue;
      const cx = PAD + di * cellW + cellW / 2;
      const cy = rowY + rowH / 2;
      const ds = `${year}-${pad2(month)}-${pad2(day)}`;
      const evs = eventsByDate[ds] || [];
      const main = evs[0];
      if (main) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.16)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = COLOR_MAP[main.color].hex;
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = INK;
        ctx.font = font(800, 20);
        ctx.fillText(String(day), cx, cy + 7);
        if (evs.length > 1) {
          const bx = cx + 21, by = cy - 21;
          ctx.fillStyle = "#0B0B0F";
          ctx.beginPath();
          ctx.arc(bx, by, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#FAFAFB";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = "#FFFFFF";
          ctx.font = font(800, 11);
          ctx.fillText(String(evs.length), bx, by + 4);
        }
      } else {
        ctx.fillStyle = ds === todayStr() ? INK : LIGHT;
        ctx.font = font(600, 26);
        ctx.fillText(String(day), cx, cy + 9);
      }
    }
    if (wi < weeks.length - 1) {
      ctx.fillStyle = "rgba(60,60,67,0.07)";
      ctx.fillRect(PAD, rowY + rowH, W1, 1);
    }
  }

  const legTop = calTop + calH + 36;
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = font(800, 26);
  ctx.fillText("Legenda", PAD, legTop + 26);

  let ly = legTop + 42;
  if (!groups.length) {
    ctx.fillStyle = GRAY;
    ctx.font = font(600, 14);
    ctx.fillText("Belum ada penanda bulan ini.", PAD, ly + 12);
  } else {
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi];
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.05)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#FFFFFF";
      rr(ctx, PAD, ly, W1, legendRowH, 20);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(60,60,67,0.10)";
      ctx.lineWidth = 1;
      rr(ctx, PAD + 0.5, ly + 0.5, W1 - 1, legendRowH - 1, 20);
      ctx.stroke();

      const cyc = ly + legendRowH / 2;
      const ccx = PAD + 20 + 32;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ccx, cyc, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = COLOR_MAP[g.color].hex;
      ctx.beginPath();
      ctx.arc(ccx, cyc, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.font = font(900, 26);
      ctx.textAlign = "center";
      ctx.fillText(String(g.count), ccx, cyc + 9);
      ctx.textAlign = "left";

      const tx = PAD + 20 + 64 + 16;
      const maxW = W1 - 100 - 30;
      ctx.font = font(800, 20);
      const label = ellipsize(ctx, g.label, maxW - 30);
      const labelW = ctx.measureText(label).width;
      ctx.fillStyle = INK;
      ctx.fillText(label, tx, cyc - 4);
      const iconImg = iconImgs[gi];
      if (iconImg) ctx.drawImage(iconImg, tx + labelW + 8, cyc - 20, 22, 22);
      ctx.fillStyle = GRAY;
      ctx.font = font(600, 13);
      const datesTxt =
        g.dates.slice(0, 6).map(formatTanggalPendek).join(" • ") +
        (g.dates.length > 6 ? ` +${g.dates.length - 6}` : "");
      ctx.fillText(ellipsize(ctx, datesTxt, maxW), tx, cyc + 20);

      ly += legendRowH + 10;
    }
    if (hidden > 0) {
      ctx.fillStyle = GRAY;
      ctx.font = font(600, 13);
      ctx.fillText(`+${hidden} kelompok lainnya`, PAD, ly + 10);
    }
  }

  const footY = bodyTop + bodyH + 24;
  ctx.fillStyle = "rgba(60,60,67,0.10)";
  ctx.fillRect(PAD, footY, W1, 1);
  ctx.fillStyle = GRAY;
  ctx.font = font(600, 12);
  ctx.textAlign = "center";
  ctx.fillText(`My Date — catat hari berwarnamu • ${MONTHS_ID[month - 1]} ${year}`, W / 2, footY + 26);
  ctx.textAlign = "left";

  return { W, H };
}
