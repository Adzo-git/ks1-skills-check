# KS1 Maths Skills Check (Version 1.4)

A short, friendly Key Stage 1 maths check for **Primary Tutor Online**. A parent
sets it up, the child answers **37 questions** one screen at a time, and the parent
gets a simple **strengths and next-steps report**. Results are saved to Supabase.

The 37 questions are chosen at random from a bank of **360 curriculum-mapped
questions** with balanced coverage of every KS1 maths strand, so repeat sittings
feel fresh while staying fair and representative.

Built to the PTO Standards: curriculum-led, child-first, calm, and honest.
Plain HTML/CSS/JavaScript — no build step, no framework, minimal maintenance.

---

## What's in the box

| File | What it is |
|------|------------|
| `index.html` | The whole app (all screens) |
| `styles.css` | PTO design system (purple/white/pink, Poppins, calm, accessible) |
| `questions.js` | The 360-question bank + strand definitions — **edit this to change questions** |
| `app.js` | Flow, question selection, rendering, report generation, saving |
| `config.js` | **The one file you edit to go live** (Supabase details) |
| `supabase-setup.sql` | Run once in Supabase to create the results table |
| `tools/generate-questions.js` | *Optional.* The offline authoring script used to build `questions.js` in bulk. **Not part of the website** — only needed (with Node) if you want to regenerate the bank. |
| `README.md` | This file |

---

## Try it first (no setup needed)

1. Open `config.js` and leave `SAVE_RESULTS: true` but keep the placeholder keys,
   **or** set `SAVE_RESULTS: false`.
2. Open `index.html` in a browser.
3. Walk through the whole check. You'll see the full report; it just won't be saved
   (a small note says "Preview mode"). This is the quickest way to review the
   questions and report before going live.

---

## Going live — two short jobs

### 1. Set up Supabase (stores the results)

1. Create a free account at **https://supabase.com** and make a new project.
2. Open **SQL Editor → New query**, paste the contents of `supabase-setup.sql`,
   and click **Run**. This creates the `skills_check_sessions` table and locks it
   down so the public site can only *add* results, never read them.
3. Open **Project Settings → API** and copy two values:
   - **Project URL**
   - **anon public** key
4. Paste both into `config.js`. (The anon key is designed to be public — it's safe
   in a website because Row Level Security only allows inserts.)

You'll read the collected results in Supabase under **Table Editor →
skills_check_sessions**.

### 2. Publish with GitHub Pages (hosts the site, free)

1. Create a new GitHub repository and upload all the files in this folder
   (keep them at the top level, so `index.html` is in the root).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch**,
   choose your branch (usually `main`) and folder `/root`, then **Save**.
4. Wait a minute, then visit the URL GitHub gives you
   (`https://your-username.github.io/your-repo/`).

That's it. To update anything later, edit the file and push the change.

---

## Testing with real families (the point of V1)

Before wider release, test with a small group (the PTO Standards suggest a mix of
home-educated, mainstream and SEND learners across different ages). Ask them:

- Did your child understand what to do without help?
- Was anything confusing, too easy, or too hard?
- Did the report make sense and feel useful?
- Did it feel calm and encouraging?

Each completed check appears as one row in Supabase, including the answer chosen for
every question — enough to spot any weak questions before you expand the bank.

---

## Key decisions (and why)

These follow "choose the simplest solution that satisfies the educational
requirements":

- **37 questions from a 360-question bank.** Originally 30, increased after the first
  educational review found that Position & Direction and Statistics (1 question each)
  gave too little evidence to fairly classify a whole strand. Quotas are now Number &
  Place Value 8, Addition & Subtraction 6, Measurement 5, Multiplication & Division 4,
  Fractions 4, Geometry 4, Position & Direction 3, Statistics 3 — totalling 37, still a
  few minutes longer at most. Every strand now has at least 3 questions. Within each
  strand the app picks *different skills* and a random variant of each, so no child
  gets two questions on the exact same skill (bank checked: every strand has more
  distinct skills than its quota) and repeat sittings differ.
- **Gentle difficulty ramp.** After selection, questions are ordered easier-first
  with a little randomness inside each difficulty band, so children start with a
  confidence-builder (Part 20).
- **Metadata: curriculum year, misconception category, estimated time.** Each
  question also carries `curriculumYear` (Year 1 or Year 2, taken from the actual
  DfE National Curriculum programme of study for each strand — not invented),
  `misconceptionCategory` (one of 13 short tags, e.g. `place-value`,
  `fraction-partitioning`, `time-reading`, used for diagnostic grouping) and
  `estimatedSeconds` (a simple difficulty-based estimate, not tuned per question).
  These ride inside the existing `responses` jsonb column when a result is saved —
  **no database schema change was needed.**
- **Two short context questions, not shown in the printed report.** After the
  last maths question the child rates how the check felt (easy / OK / quite
  difficult / very difficult); after the handover the parent rates how
  independently their child worked (completely / a little help / a lot of help).
  Both are stored with the result (`child_confidence`, `parent_independence`) for
  interpreting the score, but are deliberately **not shown on the printed report**
  — the report stays exactly as designed, and this keeps the child-facing question
  simple and un-leading.
- **Assessment duration is measured precisely.** `duration_seconds` covers only
  the 30 maths questions (first question shown to last one answered) — it
  deliberately excludes the two short survey screens, so it reflects genuine
  time-on-task.
- **One results table, JSON detail.** Every per-question answer is stored inside the
  session row (`responses`), so nothing is lost and analytics is possible later —
  without the complexity of extra tables for V1. Each row also records `percentage`,
  a friendly `reference` (e.g. `PTO-2026-000123`), `assessment_name`,
  `assessment_version` (the question-set version) and `status`, so different checks
  and question versions stay distinguishable.
- **Insert-only security.** The public site can add results but not read them,
  which protects the emails you collect.
- **No back button.** The Standards (Part 20) prefer capturing current thinking over
  improved guessing, so children move forward through the check.
- **Report leads with strengths**, uses gentle language, groups by curriculum strand,
  gives a practical "try at home" tip per area, and is honest that a short check is an
  early snapshot (Part 14).
- **Area wording is deliberately non-absolute.** "Developing" strands read as "an
  area worth exploring further together"; "practice" strands read as "additional
  practice is likely to help build confidence" — never a flat "needs practice."
  Any strand answered with 3 or fewer questions also gets an explicit caveat that
  it's "an early signal to explore rather than a firm conclusion," since a strand
  sampled by only a few questions genuinely doesn't support a strong claim.
- **Option order is shuffled** per child so the answer isn't always in the same place.
- **Child's first name** is collected (in addition to the required parent name/email)
  purely to personalise the report, as the Standards ask.

## Deliberately NOT in Version 1 (future work, once V1 is tested)

Kept out to protect simplicity and reliability, as instructed. (Statistics and
Position & Direction are now **included** in v1.0-rc1 — all eight KS1 strands are
covered.)

- Resume-after-refresh / autosave mid-check. The check is short; adding this brings
  edge cases and maintenance. Worth revisiting if testing shows a need.
- Automatic emailing of the report (parents can save/print it for now).
- Adaptive difficulty, dashboards, logins, lesson recommendations, other
  subjects/key stages.

---

## Changing the questions

**Small edits:** open `questions.js` and change the wording or options of any
question directly — each is a plain object with the PTO metadata (ID, skill ID,
strand, difficulty, type, misconception, explanation).

**Bulk changes:** use the optional `tools/generate-questions.js` script with Node
(`node tools/generate-questions.js questions.js`) to regenerate the whole bank from
templates. This is only an authoring convenience — the website itself never runs it.

**Curriculum balance** is set by `STRAND_QUOTA` near the top of the selection logic
in `app.js` (it must total `ASSESSMENT_LENGTH`, currently 37). **Illustrations** use
the built-in types: `dots`, `array`, `coins`, `shape` (circle, square, rectangle,
triangle, pentagon, hexagon), `clock` (o'clock and half past), `fraction` (bar,
tall-column, or pie/pizza), `bars`, `pictogram`, `tally`, `base10` (Dienes-style
tens rods and ones cubes), `numberline`, `turns` (a quarter-turn reference circle)
and `arrow` (a single directional arrow).

## Illustrations (Version 1.1)

194 of the 360 questions (54%) now carry an illustration, up from 103 (29%) in
v1.0. Every addition follows one rule: **if a picture doesn't genuinely aid
understanding of that specific question, it doesn't get one.** A few examples of
questions left as text on purpose: comparing "a car" and "a shoe" by weight (crude
SVG icons of a car and a shoe would look like decoration, not a real comparison);
matching an object's name to a shape category (`GEO-REAL2D`/`GEO-3D` — needs real
photos to be honest, not abstract SVG shapes); ordinal-position vocabulary
(`POS-ORD` — the words themselves are the thing being tested).

Two things worth knowing if you're reviewing illustration quality:

- **The number line never labels the answer.** For "what is one more than 5?" the
  line shows ticks and numbers either side, but the tick at the answer position is
  left blank with just a "?" — otherwise the answer would be printed right on the
  page. (Checked against all 23 number-line questions in the bank — zero leaks.)
- **The quarter-turns diagram is a fixed reference, not the answer.** Every
  `POS-TURN` question shows the same "this is what one quarter turn looks like"
  image rather than shading in the number of quarters that happens to be correct
  for that question — otherwise a child could just count shaded segments instead
  of reasoning about turns.

Nothing about the assessment engine, scoring, Supabase schema, quotas, or
assessment length changed to support this — illustrations are purely a `q.illustration`
field read by `renderIllustration()` in `app.js` and never touch the saved
`responses` data.

## Maths Tips (Version 1.4)

Every question shows a small typed tip box below the answer choices — each
tip now has a **type**, matching the wider PTO style used across lessons,
worksheets and the home education book:

| Type | Icon | Used for |
|---|---|---|
| Maths Tip | 💡 | Practical mathematical strategies |
| Remember | 🧠 | Key knowledge to hold in mind |
| Top Tip | ⭐ | Helpful problem-solving approaches |
| Look Carefully | 👀 | Careful observation |
| Learning Habit | 🌱 | Confidence, resilience, growth mindset |

One tip is picked at random per question from a bank of **185 distinct
tips** (`TIPS` near the top of `app.js`, each with `category`, `type`, and
`text`) — 25 general tips (all `learningHabit`) plus 20 per curriculum
strand, typed individually by what each one actually teaches (fact →
`remember`, strategy → `mathsTip`, approach → `topTip`, observation →
`lookCarefully`). Selection avoids an immediate repeat where the pool
allows it. A simulated 37-question sitting showed 4–5 of the 5 types
appearing per sitting with zero immediate repeats; across 500 simulated
sittings (18,500 question-to-question transitions) the immediate-repeat
rate was 0%.

Every tip was checked to contain no numbers and no reference to any
specific question, shape, or picture — this was verified automatically
(zero tips contain a digit) and by checking a full sitting's tips against
that question's correct answer text (zero matches).

This is purely a content and presentation change: it reads `q.strand`,
picks a tip object, and writes its icon/label/text into three existing
elements (`#tip-icon`, `#tip-label`, `#tip-text`). The visual design
(box, colours, spacing) is unchanged from v1.2 — only the label/icon are
now dynamic instead of fixed to "💡 Maths Tip". Nothing in the assessment
engine, scoring, question selection, reporting, illustrations, or Supabase
was touched.

---

Primary Tutor Online · KS1 Maths Skills Check · v1.4
