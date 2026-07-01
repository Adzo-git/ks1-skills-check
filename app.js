/* ============================================================
   PTO KS1 MATHS SKILLS CHECK — APP LOGIC
   ------------------------------------------------------------
   Plain HTML/CSS/JS. No build step. Deploys to GitHub Pages.
   Saves one row per completed check to Supabase (insert only).

   Flow:  Welcome (parent sets up) → Instructions → Questions
          → Well done → Report (for the grown-up)
   ============================================================ */

/* ---------- State ---------- */
const state = {
  parent: { name: "", email: "" },
  child: { name: "", age: "" },
  startedAt: null,
  order: [],        // questions with per-session shuffled options
  index: 0,
  answers: [],      // { question, chosenIndex }
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
  if (ill.type === "coins") return svgCoins(ill.values);
  if (ill.type === "shape" && ill.shape === "triangle") return svgTriangle();
  if (ill.type === "clock") return svgClock(ill.hour);
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

function svgTriangle() {
  return `<svg viewBox="0 0 200 190" role="img" aria-label="A triangle">
    <polygon points="100,25 175,165 25,165" fill="#f3edfb" stroke="#652da0" stroke-width="6" stroke-linejoin="round"/>
  </svg>`;
}

function svgClock(hour) {
  // hour hand angle (12 at top). For a whole hour, minute hand points up.
  const cx = 110, cy = 110, R = 96;
  const hourAngle = (hour % 12) * 30;               // degrees clockwise from 12
  const rad = (deg) => (deg - 90) * Math.PI / 180;  // 0deg = up
  const hx = cx + Math.cos(rad(hourAngle)) * 52;
  const hy = cy + Math.sin(rad(hourAngle)) * 52;
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
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 78}" stroke="#241d38" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="7" fill="#652da0"/>
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

/* ---------- Start the check ---------- */
function startCheck() {
  state.startedAt = new Date().toISOString();
  state.index = 0;
  state.answers = [];
  // Build this session's question order, with each question's options shuffled.
  state.order = PTO_QUESTIONS.map(q => {
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
    finish();
  }
}

/* ---------- Finish → celebrate → report ---------- */
function finish() {
  $("child-name-done").textContent = state.child.name;
  show("screen-complete");
}

function buildAndShowReport() {
  // Prevent repeated clicks from building/submitting more than once.
  const btn = $("show-report-btn");
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

  return {
    child: state.child.name,
    age: state.child.age,
    startedAt: state.startedAt,
    completedAt,
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

  // Areas for development
  const areasWrap = $("report-areas");
  if (r.areas.length) {
    areasWrap.innerHTML = r.areas.map(s => `
      <div class="rcard grow">
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(s.covers)} A little more practice here will help build confidence.</p>
        <div class="home"><strong>Try at home:</strong> ${escapeHtml(s.homeTip)}</div>
      </div>`).join("");
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
  $("show-report-btn").addEventListener("click", buildAndShowReport);
  $("print-btn").addEventListener("click", () => window.print());
});
