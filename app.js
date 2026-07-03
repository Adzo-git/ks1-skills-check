/* ============================================================
   PTO KS1 MATHS SKILLS CHECK — APP LOGIC
   ------------------------------------------------------------
   Plain HTML/CSS/JS. No build step. Deploys to GitHub Pages.
   Saves one row per completed check to Supabase (insert only).

   Flow:  Welcome (parent sets up) → Instructions → Questions
          → Confidence check (child) → Well done → Independence check (parent)
          → Report (for the grown-up)
   ============================================================ */

/* ---------- State ---------- */
const state = {
  parent: { name: "", email: "" },
  child: { name: "", age: "" },
  startedAt: null,
  order: [],        // questions with per-session shuffled options
  index: 0,
  answers: [],      // { question, chosenIndex }
  confidence: null,     // child's self-rating: easy / ok / quite_difficult / very_difficult
  independence: null,   // parent's rating: independent / a_little_help / a_lot_of_help
  questionsCompletedAt: null, // timestamp when the LAST MATHS QUESTION was answered
                              // (captured separately so duration excludes the two short survey screens)
  saving: false,    // true while a save is in flight
  saved: false      // true once a result has been stored (prevents duplicates)
};

/* ---------- Small helpers ---------- */
function $(id) { return document.getElementById(id); }

function show(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(screenId).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Fisher–Yates shuffle (returns a new array)
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TICK = '<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4 4 8-9" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------- Illustration renderer ----------
   Small, static SVGs. Used only where a picture aids understanding. */
function renderIllustration(ill) {
  if (!ill) return "";
  if (ill.type === "dots") return svgDots(ill.count, ill.color || "#652da0");
  if (ill.type === "array") return svgArray(ill.rows, ill.cols, ill.color || "#652da0");
  if (ill.type === "coins") return svgCoins(ill.values);
  if (ill.type === "shape") return svgShape(ill.shape);
  if (ill.type === "clock") return svgClock(ill.hour, ill.minute || 0);
  if (ill.type === "fraction") return svgFraction(ill.parts, ill.shaded, ill.tall, ill.shape);
  if (ill.type === "bars") return svgBars(ill.bars);
  if (ill.type === "pictogram") return svgPictogram(ill.rows);
  if (ill.type === "tally") return svgTally(ill.rows);
  if (ill.type === "base10") return svgBase10(ill.tens, ill.ones);
  if (ill.type === "numberline") return svgNumberline(ill.start, ill.end, ill.highlight, ill.question);
  if (ill.type === "turns") return svgTurns(ill.quarters);
  if (ill.type === "arrow") return svgArrow(ill.direction);
  return "";
}

function svgDots(n, color) {
  const perRow = 5, r = 20, gap = 20, pad = 16;
  const rows = Math.ceil(n / perRow);
  const cols = Math.min(n, perRow);
  const w = pad * 2 + cols * (r * 2) + (cols - 1) * gap;
  const h = pad * 2 + rows * (r * 2) + (rows - 1) * gap;
  let circles = "";
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const cx = pad + r + col * (r * 2 + gap);
    const cy = pad + r + row * (r * 2 + gap);
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${n} objects">${circles}</svg>`;
}

// Array: rows x cols grid of dots (for equal groups / multiplication).
function svgArray(rows, cols, color) {
  const r = 16, gap = 18, pad = 16;
  const w = pad * 2 + cols * (r * 2) + (cols - 1) * gap;
  const h = pad * 2 + rows * (r * 2) + (rows - 1) * gap;
  let out = "";
  for (let ry = 0; ry < rows; ry++) {
    for (let cx = 0; cx < cols; cx++) {
      const x = pad + r + cx * (r * 2 + gap);
      const y = pad + r + ry * (r * 2 + gap);
      out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
    }
  }
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="A grid of dots">${out}</svg>`;
}

function svgCoins(values) {
  const r = 40, gap = 22, pad = 12;
  const w = pad * 2 + values.length * (r * 2) + (values.length - 1) * gap;
  const h = pad * 2 + r * 2;
  let out = "";
  values.forEach((v, i) => {
    const cx = pad + r + i * (r * 2 + gap);
    const cy = pad + r;
    out += `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#e9c34a" stroke="#c79a1f" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="#c79a1f" stroke-width="1.5" opacity="0.6"/>
      <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="22" font-weight="700" font-family="Poppins, Arial" fill="#5b4406">${v}p</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Coins: ${values.map(v => v + " p").join(", ")}">${out}</svg>`;
}

// 2D shapes. Circle and rectangle/square are drawn directly; triangle,
// pentagon and hexagon are regular polygons drawn around a centre point.
function svgShape(shape) {
  const fill = "#f3edfb", stroke = "#652da0", sw = 6;
  const open = `<svg viewBox="0 0 200 200" role="img" aria-label="A shape">`;
  const close = `</svg>`;
  if (shape === "circle")
    return `${open}<circle cx="100" cy="100" r="80" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>${close}`;
  if (shape === "square")
    return `${open}<rect x="35" y="35" width="130" height="130" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>${close}`;
  if (shape === "rectangle")
    return `${open}<rect x="20" y="55" width="160" height="90" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>${close}`;
  const sides = { triangle: 3, pentagon: 5, hexagon: 6 }[shape] || 3;
  const R = 82, cx = 100, cy = 105;
  let pts = [];
  for (let i = 0; i < sides; i++) {
    const a = (-90 + i * 360 / sides) * Math.PI / 180;
    pts.push(`${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`);
  }
  return `${open}<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>${close}`;
}

function svgClock(hour, minute) {
  minute = minute || 0;
  const cx = 110, cy = 110, R = 96;
  // Hour hand moves on past the hour as the minutes pass (half past = halfway).
  const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
  const minuteAngle = (minute / 60) * 360;          // 0 = up, 30 mins = down
  const rad = (deg) => (deg - 90) * Math.PI / 180;  // 0deg = up
  const hx = cx + Math.cos(rad(hourAngle)) * 52;
  const hy = cy + Math.sin(rad(hourAngle)) * 52;
  const mx = cx + Math.cos(rad(minuteAngle)) * 78;
  const my = cy + Math.sin(rad(minuteAngle)) * 78;
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = rad(i * 30);
    const x1 = cx + Math.cos(a) * (R - 12), y1 = cy + Math.sin(a) * (R - 12);
    const x2 = cx + Math.cos(a) * (R - 4), y2 = cy + Math.sin(a) * (R - 4);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b9a6da" stroke-width="3" stroke-linecap="round"/>`;
  }
  const nums = [[12, 0, -R + 26], [3, R - 26, 0], [6, 0, R - 22], [9, -R + 26, 0]]
    .map(([n, dx, dy]) => `<text x="${cx + dx}" y="${cy + dy + 8}" text-anchor="middle" font-size="22" font-weight="700" font-family="Poppins, Arial" fill="#4e2280">${n}</text>`).join("");
  return `<svg viewBox="0 0 220 220" role="img" aria-label="A clock">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#652da0" stroke-width="6"/>
    ${ticks}${nums}
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#241d38" stroke-width="7" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#241d38" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="7" fill="#652da0"/>
  </svg>`;
}

// Fraction: a shape split into equal parts, with some parts shaded.
// shape: "pie" draws a circle divided into sectors (pizza-style) for variety;
// otherwise a rectangle strip, tall (columns) or wide (rows).
function svgFraction(parts, shaded, tall, shape) {
  const fill = "#652da0", empty = "#fff", stroke = "#652da0", sw = 5;
  if (shape === "pie") {
    const cx = 100, cy = 100, R = 88;
    let cells = "";
    for (let i = 0; i < parts; i++) {
      const a0 = (-90 + i * 360 / parts) * Math.PI / 180;
      const a1 = (-90 + (i + 1) * 360 / parts) * Math.PI / 180;
      const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
      const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
      const large = (360 / parts) > 180 ? 1 : 0;
      cells += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${i < shaded ? fill : empty}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    }
    return `<svg viewBox="0 0 200 200" role="img" aria-label="A circle split into equal slices">${cells}</svg>`;
  }
  let cells = "", W, H;
  if (tall) {
    W = 120; H = 210; const ph = H / parts;
    for (let i = 0; i < parts; i++) {
      cells += `<rect x="0" y="${(i * ph).toFixed(1)}" width="${W}" height="${ph.toFixed(1)}" fill="${i < shaded ? fill : empty}" stroke="${stroke}" stroke-width="${sw}"/>`;
    }
  } else {
    W = 250; H = 110; const pw = W / parts;
    for (let i = 0; i < parts; i++) {
      cells += `<rect x="${(i * pw).toFixed(1)}" y="0" width="${pw.toFixed(1)}" height="${H}" fill="${i < shaded ? fill : empty}" stroke="${stroke}" stroke-width="${sw}"/>`;
    }
  }
  return `<svg viewBox="-3 -3 ${W + 6} ${H + 6}" role="img" aria-label="A shape split into equal parts">${cells}</svg>`;
}

// Bars: horizontal bars of different lengths, labelled A/B/C (for length comparison).
function svgBars(bars) {
  const pad = 12, labelW = 34, barH = 32, gap = 18, maxW = 210;
  const maxLen = Math.max(...bars.map(b => b.length));
  const w = pad * 2 + labelW + maxW;
  const h = pad * 2 + bars.length * barH + (bars.length - 1) * gap;
  let out = "";
  bars.forEach((b, i) => {
    const y = pad + i * (barH + gap);
    const bw = Math.max(8, (b.length / maxLen) * maxW);
    out += `<text x="${pad}" y="${y + barH / 2 + 6}" font-size="20" font-weight="700" font-family="Poppins, Arial" fill="#4e2280">${escapeHtml(b.label)}</text>`;
    out += `<rect x="${pad + labelW}" y="${y}" width="${bw.toFixed(1)}" height="${barH}" rx="5" fill="#652da0"/>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bars of different lengths">${out}</svg>`;
}

// Pictogram: rows of pictures, one row per category, with a label.
function svgPictogram(rows) {
  const pad = 12, labelW = 90, r = 13, gap = 8, rowH = 34;
  const maxCount = Math.max(...rows.map(x => x.count));
  const w = pad * 2 + labelW + maxCount * (r * 2 + gap);
  const h = pad * 2 + rows.length * rowH;
  let out = "";
  rows.forEach((row, i) => {
    const cy = pad + i * rowH + rowH / 2;
    out += `<text x="${pad}" y="${cy + 5}" font-size="16" font-weight="600" font-family="Poppins, Arial" fill="#4e2280">${escapeHtml(row.label)}</text>`;
    for (let k = 0; k < row.count; k++) {
      const cx = pad + labelW + r + k * (r * 2 + gap);
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#652da0"/>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="A pictogram">${out}</svg>`;
}

// Tally chart: an alternative to the pictogram — groups of 5 tally marks
// (4 uprights + 1 diagonal), one row per category.
function svgTally(rows) {
  const pad = 12, labelW = 90, groupW = 46, rowH = 34;
  const maxGroups = Math.max(...rows.map(r => Math.ceil(r.count / 5)));
  const w = pad * 2 + labelW + Math.max(1, maxGroups) * groupW;
  const h = pad * 2 + rows.length * rowH;
  let out = "";
  rows.forEach((row, ri) => {
    const cy = pad + ri * rowH + rowH / 2;
    out += `<text x="${pad}" y="${cy + 5}" font-size="16" font-weight="600" font-family="Poppins, Arial" fill="#4e2280">${escapeHtml(row.label)}</text>`;
    let remaining = row.count, gx = pad + labelW;
    while (remaining > 0) {
      const inGroup = Math.min(5, remaining);
      for (let i = 0; i < Math.min(4, inGroup); i++) {
        const x = gx + 6 + i * 7;
        out += `<line x1="${x}" y1="${cy - 12}" x2="${x}" y2="${cy + 12}" stroke="#652da0" stroke-width="3" stroke-linecap="round"/>`;
      }
      if (inGroup === 5) {
        out += `<line x1="${gx}" y1="${cy + 12}" x2="${gx + 34}" y2="${cy - 12}" stroke="#e84b8a" stroke-width="3" stroke-linecap="round"/>`;
      }
      remaining -= inGroup;
      gx += groupW;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="A tally chart">${out}</svg>`;
}

// Base 10 (Dienes) blocks: tens rods (each marked into 10 units) and ones
// cubes, for place value questions. Rods wrap after 5 per row, as do cubes.
function svgBase10(tens, ones) {
  const rodW = 20, rodH = 96, unit = 18, gap = 14, pad = 14, perRow = 5;
  const rodRows = Math.max(1, Math.ceil(tens / perRow));
  const rodCols = Math.min(Math.max(tens, 1), perRow);
  const oneRows = Math.max(1, Math.ceil(ones / perRow));
  const oneCols = Math.min(Math.max(ones, 1), perRow);
  const rodsW = rodCols * rodW + (rodCols - 1) * gap;
  const onesW = oneCols * unit + (oneCols - 1) * (gap * 0.5);
  const w = pad * 2 + Math.max(rodsW, onesW, 60);
  const rodsH = tens > 0 ? rodRows * rodH + (rodRows - 1) * gap : 0;
  const onesH = ones > 0 ? oneRows * unit + (oneRows - 1) * (gap * 0.5) : 0;
  const h = pad * 2 + rodsH + (tens > 0 && ones > 0 ? 16 : 0) + onesH;
  let out = "";
  for (let i = 0; i < tens; i++) {
    const col = i % perRow, row = Math.floor(i / perRow);
    const x = pad + col * (rodW + gap), y = pad + row * (rodH + gap);
    out += `<rect x="${x}" y="${y}" width="${rodW}" height="${rodH}" rx="3" fill="#f3edfb" stroke="#652da0" stroke-width="3"/>`;
    for (let t = 1; t < 10; t++) {
      const ty = y + (rodH / 10) * t;
      out += `<line x1="${x}" y1="${ty}" x2="${x + rodW}" y2="${ty}" stroke="#652da0" stroke-width="1.5" opacity="0.6"/>`;
    }
  }
  const onesY = pad + rodsH + (tens > 0 && ones > 0 ? 16 : 0);
  for (let i = 0; i < ones; i++) {
    const col = i % perRow, row = Math.floor(i / perRow);
    const x = pad + col * (unit + gap * 0.5), y = onesY + row * (unit + gap * 0.5);
    out += `<rect x="${x}" y="${y}" width="${unit}" height="${unit}" rx="2" fill="#e84b8a"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${tens} tens and ${ones} ones shown as blocks">${out}</svg>`;
}

// Number line: ticks from start to end, filled dots at each value in
// `highlight`, and an open "?" circle at `question` (the value the child
// is being asked to find). Used for one-more/one-less and count-on sequences.
function svgNumberline(start, end, highlight, question) {
  const step = 44, pad = 24, y = 60;
  const n = end - start;
  const w = pad * 2 + n * step, h = 110;
  const xOf = v => pad + (v - start) * step;
  let out = `<line x1="${xOf(start)}" y1="${y}" x2="${xOf(end)}" y2="${y}" stroke="#cdbfe4" stroke-width="4" stroke-linecap="round"/>`;
  for (let v = start; v <= end; v++) {
    out += `<line x1="${xOf(v)}" y1="${y - 8}" x2="${xOf(v)}" y2="${y + 8}" stroke="#cdbfe4" stroke-width="3"/>`;
    if (v !== question) {
      out += `<text x="${xOf(v)}" y="${y + 30}" text-anchor="middle" font-size="16" font-weight="600" font-family="Poppins, Arial" fill="#6c6683">${v}</text>`;
    }
  }
  (highlight || []).forEach(v => {
    out += `<circle cx="${xOf(v)}" cy="${y}" r="11" fill="#652da0"/>`;
  });
  if (question !== undefined && question !== null) {
    out += `<circle cx="${xOf(question)}" cy="${y}" r="13" fill="#fff" stroke="#e84b8a" stroke-width="3"/>`;
    out += `<text x="${xOf(question)}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="700" font-family="Poppins, Arial" fill="#e84b8a">?</text>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="A number line">${out}</svg>`;
}

// Turns: a circle divided into quarters, with `quarters` of them shaded
// clockwise from the top to show the size of a quarter/half/three-quarter turn.
function svgTurns(quarters) {
  const cx = 100, cy = 100, R = 82;
  let out = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#cdbfe4" stroke-width="4"/>`;
  for (let i = 0; i < quarters; i++) {
    const a0 = (-90 + i * 90) * Math.PI / 180, a1 = (-90 + (i + 1) * 90) * Math.PI / 180;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    out += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="#f3edfb" stroke="#652da0" stroke-width="3" stroke-linejoin="round"/>`;
  }
  out += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - R}" stroke="#652da0" stroke-width="5" stroke-linecap="round"/>`;
  const endA = (-90 + quarters * 90) * Math.PI / 180;
  const ex = cx + R * Math.cos(endA), ey = cy + R * Math.sin(endA);
  out += `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#e84b8a" stroke-width="5" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 200 200" role="img" aria-label="A circle showing a turn">${out}</svg>`;
}

// Arrow: a single large directional arrow with a label, for direction words.
function svgArrow(direction) {
  const map = {
    left:  { angle: 180, label: "left" },  right: { angle: 0,   label: "right" },
    up:    { angle: 270, label: "up" },    down:  { angle: 90,  label: "down" },
    top:   { angle: 270, label: "top" },   bottom:{ angle: 90,  label: "bottom" },
    forwards: { angle: 270, label: "forwards" }, backwards: { angle: 90, label: "backwards" }
  };
  const d = map[direction] || map.right;
  const cx = 100, cy = 90, len = 70;
  const rad = d.angle * Math.PI / 180;
  const tx = cx + Math.cos(rad) * len, ty = cy + Math.sin(rad) * len;
  const bx = cx - Math.cos(rad) * len, by = cy - Math.sin(rad) * len;
  // arrowhead
  const headA1 = rad + 2.6, headA2 = rad - 2.6;
  const h1x = tx + Math.cos(headA1) * 18, h1y = ty + Math.sin(headA1) * 18;
  const h2x = tx + Math.cos(headA2) * 18, h2y = ty + Math.sin(headA2) * 18;
  return `<svg viewBox="0 0 200 160" role="img" aria-label="An arrow pointing ${d.label}">
    <line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="#652da0" stroke-width="8" stroke-linecap="round"/>
    <polygon points="${tx.toFixed(1)},${ty.toFixed(1)} ${h1x.toFixed(1)},${h1y.toFixed(1)} ${h2x.toFixed(1)},${h2y.toFixed(1)}" fill="#652da0"/>
    <text x="100" y="145" text-anchor="middle" font-size="20" font-weight="700" font-family="Poppins, Arial" fill="#4e2280">${d.label}</text>
  </svg>`;
}

/* ---------- Setup (Welcome) ---------- */
function initSetup() {
  const form = $("setup-form");
  const email = $("parent-email");
  const emailNote = $("email-note");
  const startBtn = $("start-btn");

  function validate() {
    const okName = $("parent-name").value.trim().length > 0;
    const okChild = $("child-name").value.trim().length > 0;
    const emailVal = email.value.trim();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const okConsent = $("consent").checked;
    emailNote.textContent = (emailVal && !okEmail) ? "Please check the email address looks right." : "";
    startBtn.disabled = !(okName && okChild && okEmail && okConsent);
  }

  form.addEventListener("input", validate);
  form.addEventListener("change", validate);
  validate();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (startBtn.disabled) return;
    state.parent.name = $("parent-name").value.trim();
    state.parent.email = $("parent-email").value.trim();
    state.child.name = $("child-name").value.trim();
    state.child.age = $("child-age").value;
    $("child-name-inst").textContent = state.child.name;
    show("screen-instructions");
  });
}

/* ---------- Assessment selection (Version 1.1) ----------
   Each check presents 30 questions, chosen at random from the full
   question bank with balanced curriculum coverage. Within a strand we
   pick different skills first (so a child does not get two questions on
   the exact same skill unless the quota requires it), and a random
   variant of each — so repeat sittings feel fresh. Quotas sum to 30. */
const ASSESSMENT_LENGTH = 37;
const STRAND_QUOTA = { NPV: 8, AS: 6, MEA: 5, MD: 4, FRA: 4, GEO: 4, POS: 3, STA: 3 };
const DIFFICULTY_RANK = { "Foundation": 0, "Secure": 1, "Greater Depth": 2, "Mastery": 3 };
function rankOf(q) { const r = DIFFICULTY_RANK[q.difficulty]; return r === undefined ? 1 : r; }

// Pick `k` questions from one strand, preferring different skills.
function pickFromStrand(strand, k) {
  const pool = PTO_QUESTIONS.filter(q => q.strand === strand);
  const bySkill = {};
  pool.forEach(q => { (bySkill[q.skillId] = bySkill[q.skillId] || []).push(q); });
  const skills = shuffled(Object.keys(bySkill));
  const picks = [];
  // One random variant per distinct skill, up to the quota.
  for (const s of skills) {
    if (picks.length >= k) break;
    const variants = bySkill[s];
    picks.push(variants[Math.floor(Math.random() * variants.length)]);
  }
  // If the quota exceeds the number of skills, top up (skills may repeat).
  if (picks.length < k) {
    const extra = shuffled(pool.filter(q => !picks.includes(q)));
    while (picks.length < k && extra.length) picks.push(extra.pop());
  }
  return picks;
}

// Build a balanced assessment of exactly ASSESSMENT_LENGTH questions.
function selectAssessment() {
  let chosen = [];
  Object.keys(STRAND_QUOTA).forEach(strand => {
    chosen = chosen.concat(pickFromStrand(strand, STRAND_QUOTA[strand]));
  });
  // Safety net: if any strand fell short, top up from the rest of the bank
  // so we always present exactly ASSESSMENT_LENGTH questions.
  if (chosen.length < ASSESSMENT_LENGTH) {
    const rest = shuffled(PTO_QUESTIONS.filter(q => !chosen.includes(q)));
    while (chosen.length < ASSESSMENT_LENGTH && rest.length) chosen.push(rest.pop());
  }
  chosen = chosen.slice(0, ASSESSMENT_LENGTH);
  // Gentle confidence-first order: easier questions first, with a little
  // randomness within each difficulty band (PTO Part 20).
  chosen.sort((a, b) => {
    const d = rankOf(a) - rankOf(b);
    return d !== 0 ? d : Math.random() - 0.5;
  });
  return chosen;
}

/* ---------- Start the check ---------- */
function startCheck() {
  state.startedAt = new Date().toISOString();
  state.index = 0;
  state.answers = [];
  // Select this session's 30 questions, then shuffle each one's options.
  state.order = selectAssessment().map(q => {
    const correctValue = q.options[q.correctIndex];
    const opts = shuffled(q.options);
    return { ...q, sessionOptions: opts, sessionCorrectIndex: opts.indexOf(correctValue) };
  });
  show("screen-question");
  renderQuestion();
}

/* ---------- Render a question ---------- */
function renderQuestion() {
  const q = state.order[state.index];
  const total = state.order.length;
  const num = state.index + 1;

  $("progress-count").textContent = `Question ${num} of ${total}`;
  $("progress-fill").style.width = `${(num / total) * 100}%`;

  $("q-illus").innerHTML = renderIllustration(q.illustration);
  $("q-text").textContent = q.text;

  const wrap = $("answers");
  wrap.innerHTML = "";
  const existing = state.answers.find(a => a.question.id === q.id);

  q.sessionOptions.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer" + (existing && existing.chosenIndex === i ? " selected" : "");
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", existing && existing.chosenIndex === i ? "true" : "false");
    btn.innerHTML = `<span class="tick">${TICK}</span><span>${escapeHtml(opt)}</span>`;
    btn.addEventListener("click", () => selectAnswer(i));
    wrap.appendChild(btn);
  });

  const nextBtn = $("next-btn");
  nextBtn.disabled = !existing;
  nextBtn.textContent = (num === total) ? "Finish" : "Next";
}

function selectAnswer(i) {
  const q = state.order[state.index];
  const existingIdx = state.answers.findIndex(a => a.question.id === q.id);
  const record = { question: q, chosenIndex: i };
  if (existingIdx >= 0) state.answers[existingIdx] = record;
  else state.answers.push(record);

  document.querySelectorAll("#answers .answer").forEach((el, idx) => {
    const on = idx === i;
    el.classList.toggle("selected", on);
    el.setAttribute("aria-checked", on ? "true" : "false");
  });
  $("next-btn").disabled = false;
}

function nextQuestion() {
  if (!state.answers.find(a => a.question.id === state.order[state.index].id)) return;
  if (state.index < state.order.length - 1) {
    state.index++;
    renderQuestion();
  } else {
    showConfidence();
  }
}

/* ---------- Confidence check (child, straight after the last question) ---------- */
function showConfidence() {
  state.questionsCompletedAt = new Date().toISOString();
  state.confidence = null;
  document.querySelectorAll("#confidence-options .confidence-btn").forEach(el => el.classList.remove("selected"));
  $("confidence-next-btn").disabled = true;
  show("screen-confidence");
}

function selectConfidence(btn) {
  state.confidence = btn.dataset.value;
  document.querySelectorAll("#confidence-options .confidence-btn").forEach(el => el.classList.toggle("selected", el === btn));
  $("confidence-next-btn").disabled = false;
}

/* ---------- Finish → celebrate → independence check → report ---------- */
function finish() {
  $("child-name-done").textContent = state.child.name;
  show("screen-complete");
}

/* ---------- Independence check (parent, after the handover) ---------- */
function showIndependence() {
  state.independence = null;
  document.querySelectorAll("#independence-options .answer").forEach(el => el.classList.remove("selected"));
  $("to-report-btn").disabled = true;
  show("screen-independence");
}

function selectIndependence(btn) {
  state.independence = btn.dataset.value;
  document.querySelectorAll("#independence-options .answer").forEach(el => el.classList.toggle("selected", el === btn));
  $("to-report-btn").disabled = false;
}

function buildAndShowReport() {
  // Prevent repeated clicks from building/submitting more than once.
  const btn = $("to-report-btn");
  if (btn) btn.disabled = true;
  if (state.saved || state.saving) return;

  const report = computeReport();
  renderReport(report);
  show("screen-report");
  saveResults(report); // report shows regardless of whether saving succeeds
}

/* ---------- Report computation (PTO Part 14) ---------- */
function computeReport() {
  const completedAt = new Date().toISOString();
  const responses = state.answers.map(a => {
    const q = a.question;
    const chosenLabel = q.sessionOptions[a.chosenIndex];
    const correctLabel = q.options[q.correctIndex];
    return {
      question_id: q.id,
      skill_id: q.skillId,
      strand: q.strand,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      curriculum_year: q.curriculumYear,
      misconception_category: q.misconceptionCategory,
      question: q.text,
      chosen: chosenLabel,
      correct: correctLabel,
      is_correct: chosenLabel === correctLabel
    };
  });

  const totalCorrect = responses.filter(r => r.is_correct).length;

  // Per-strand tally + confidence level
  const strands = {};
  Object.keys(PTO_STRANDS).forEach(key => { strands[key] = { correct: 0, total: 0 }; });
  responses.forEach(r => {
    strands[r.strand].total++;
    if (r.is_correct) strands[r.strand].correct++;
  });

  const strandResults = [];
  Object.keys(strands).forEach(key => {
    const s = strands[key];
    if (s.total === 0) return;
    const ratio = s.correct / s.total;
    let level;
    if (ratio >= 0.75) level = "secure";
    else if (ratio >= 0.4) level = "developing";
    else level = "practice";
    strandResults.push({
      key, name: PTO_STRANDS[key].name, covers: PTO_STRANDS[key].covers,
      homeTip: PTO_STRANDS[key].homeTip,
      correct: s.correct, total: s.total, ratio, level
    });
  });

  const strengths = strandResults.filter(s => s.level === "secure");
  // Areas: lowest first (practice before developing) — highest priority first (Part 14)
  const areas = strandResults
    .filter(s => s.level !== "secure")
    .sort((a, b) => a.ratio - b.ratio);

  const percentage = responses.length
    ? Math.round((totalCorrect / responses.length) * 100)
    : 0;

  // Total time actually spent on the maths (first question shown to last
  // question answered) — excludes the confidence and independence screens.
  const durationSeconds = Math.max(0, Math.round(
    (new Date(state.questionsCompletedAt) - new Date(state.startedAt)) / 1000
  ));

  return {
    child: state.child.name,
    age: state.child.age,
    startedAt: state.startedAt,
    completedAt,
    durationSeconds,
    confidence: state.confidence,
    independence: state.independence,
    totalQuestions: responses.length,
    totalCorrect,
    percentage,
    responses,
    strandResults,
    strengths,
    areas
  };
}

/* ---------- Report rendering ---------- */
function renderReport(r) {
  const dateStr = new Date(r.completedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
  $("report-title").textContent = `${r.child}’s Maths Skills Check`;
  $("report-meta").textContent =
    `Key Stage 1 Maths · ${dateStr}` + (r.age ? ` · age ${r.age}` : "");

  // Gentle overall summary — no big percentage headline (Part 5)
  $("report-summary").innerHTML =
    `<p class="summary-line">${escapeHtml(r.child)} answered <strong>${r.totalCorrect} of ${r.totalQuestions}</strong> questions and worked through every one — that effort really matters.</p>
     <p class="report-meta">This is an early snapshot from a short check. It’s a starting point for what to explore next, not a final judgement.</p>`;

  // Strengths
  const strengthsWrap = $("report-strengths");
  if (r.strengths.length) {
    strengthsWrap.innerHTML = r.strengths.map(s => `
      <div class="rcard good">
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(r.child)} showed secure understanding here. ${escapeHtml(s.covers)}</p>
      </div>`).join("");
  } else {
    // Everyone has something to build on — lead with effort and the closest strand.
    const best = r.strandResults.slice().sort((a, b) => b.ratio - a.ratio)[0];
    strengthsWrap.innerHTML = `
      <div class="rcard good">
        <h3>Effort and sticking power</h3>
        <p>${escapeHtml(r.child)} kept going through the whole check${best ? `, and was closest to secure in <strong>${escapeHtml(best.name)}</strong>` : ""}. That’s a great foundation to build on.</p>
      </div>`;
  }

  // Areas for development — wording softened so it never reads as a firm
  // verdict, and is explicit when a strand was sampled by very few questions.
  const areasWrap = $("report-areas");
  if (r.areas.length) {
    areasWrap.innerHTML = r.areas.map(s => {
      const encouragement = s.level === "developing"
        ? "This appears to be an area worth exploring further together."
        : "Additional practice in this area is likely to help build confidence.";
      const lowEvidence = s.total <= 3
        ? " This is based on a small number of questions, so treat it as an early signal to explore rather than a firm conclusion."
        : "";
      return `
      <div class="rcard grow">
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(s.covers)} ${encouragement}${lowEvidence}</p>
        <div class="home"><strong>Try at home:</strong> ${escapeHtml(s.homeTip)}</div>
      </div>`;
    }).join("");
    $("areas-section").style.display = "";
  } else {
    // All secure — offer gentle extension rather than inventing weaknesses.
    areasWrap.innerHTML = `
      <div class="rcard">
        <h3>Ready for the next challenge</h3>
        <p>${escapeHtml(r.child)} was secure across every area in this check. To keep things interesting, try slightly bigger numbers and ask “how do you know?” to stretch their reasoning.</p>
      </div>`;
    $("areas-section").style.display = "";
  }

  // Closing
  $("report-closing").innerHTML =
    `<strong>Well done, ${escapeHtml(r.child)}.</strong> Every question answered tells us something helpful about what to learn next. Small, regular practice — a few minutes at a time — makes a real difference.`;
}

/* ---------- Friendly reference (e.g. PTO-2026-000123) ----------
   A human-friendly label shown to the parent and stored with the result,
   so they can quote it if they get in touch. The row's uuid remains the
   real unique key; this is just a readable reference. */
function makeReference() {
  const year = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return `PTO-${year}-${n}`;
}

/* ---------- Save to Supabase (insert only) ---------- */
async function saveResults(r) {
  const statusEl = $("save-status");

  // Never submit the same result twice.
  if (state.saved || state.saving) return;
  state.saving = true;

  if (!ptoIsConfigured()) {
    statusEl.textContent = "Preview mode — results were not saved. (Add your Supabase details in config.js to save.)";
    state.saving = false;
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    statusEl.textContent = "The report is ready. (Saving is unavailable right now — please check your connection.)";
    state.saving = false;
    return;
  }

  const reference = makeReference();

  const row = {
    parent_name: state.parent.name,
    parent_email: state.parent.email,
    child_name: r.child,
    child_age: r.age ? parseInt(r.age, 10) : null,
    consent: true,
    assessment_name: PTO_CONFIG.ASSESSMENT_NAME,
    assessment_version: PTO_CONFIG.ASSESSMENT_VERSION,
    status: "completed",
    started_at: r.startedAt,
    completed_at: r.completedAt,
    total_questions: r.totalQuestions,
    total_correct: r.totalCorrect,
    percentage: r.percentage,
    duration_seconds: r.durationSeconds,
    child_confidence: r.confidence,
    parent_independence: r.independence,
    reference: reference,
    strand_summary: r.strandResults.map(s => ({
      strand: s.key, name: s.name, correct: s.correct, total: s.total, level: s.level
    })),
    responses: r.responses,
    app_version: PTO_CONFIG.APP_VERSION
  };

  try {
    const client = window.supabase.createClient(PTO_CONFIG.SUPABASE_URL, PTO_CONFIG.SUPABASE_ANON_KEY);
    const { error } = await client.from("skills_check_sessions").insert([row]);
    if (error) throw error;
    state.saved = true; // block any further submissions
    statusEl.innerHTML =
      `Results saved. Thank you.<br>Your reference: <strong>${reference}</strong>`;
  } catch (err) {
    console.error("Save failed:", err);
    statusEl.textContent = "The report below is complete, but we couldn’t save the results this time.";
  } finally {
    state.saving = false;
  }
}

/* ---------- Wire up ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initSetup();
  $("to-questions-btn").addEventListener("click", startCheck);
  $("next-btn").addEventListener("click", nextQuestion);

  document.querySelectorAll("#confidence-options .confidence-btn").forEach(btn => {
    btn.addEventListener("click", () => selectConfidence(btn));
  });
  $("confidence-next-btn").addEventListener("click", finish);

  $("show-report-btn").addEventListener("click", showIndependence);

  document.querySelectorAll("#independence-options .answer").forEach(btn => {
    btn.addEventListener("click", () => selectIndependence(btn));
  });
  $("to-report-btn").addEventListener("click", buildAndShowReport);

  $("print-btn").addEventListener("click", () => window.print());
});
