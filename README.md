# KS1 Maths Skills Check (Version 1.0)

A short, friendly Key Stage 1 maths check for **Primary Tutor Online**. A parent
sets it up, the child answers ~15 questions one screen at a time, and the parent
gets a simple **strengths and next-steps report**. Results are saved to Supabase.

Built to the PTO Standards: curriculum-led, child-first, calm, and honest.
Plain HTML/CSS/JavaScript — no build step, no framework, minimal maintenance.

---

## What's in the box

| File | What it is |
|------|------------|
| `index.html` | The whole app (all screens) |
| `styles.css` | PTO design system (purple/white/pink, Poppins, calm, accessible) |
| `questions.js` | The 15 questions + strand definitions — **edit this to change questions** |
| `app.js` | Flow, question rendering, report generation, saving |
| `config.js` | **The one file you edit to go live** (Supabase details) |
| `supabase-setup.sql` | Run once in Supabase to create the results table |
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

- **15 questions.** Enough to sample the KS1 curriculum with the Part 23 weighting
  (Number & Place Value 33%, Addition & Subtraction 27%, Multiplication & Division
  13%, Measurement 13%, Fractions 7%, Geometry 7%) while staying short enough to
  avoid fatigue for a 5–7 year old.
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
- **Option order is shuffled** per child so the answer isn't always in the same place.
- **Child's first name** is collected (in addition to the required parent name/email)
  purely to personalise the report, as the Standards ask.

## Deliberately NOT in Version 1 (future work, once V1 is tested)

Kept out to protect simplicity and reliability, as instructed:

- Statistics questions (KS1 statistics is Year 2 only and the lowest weighting —
  documented omission, not an oversight).
- Resume-after-refresh / autosave mid-check. The check is short; adding this brings
  edge cases and maintenance. Worth revisiting if testing shows a need.
- Automatic emailing of the report (parents can save/print it for now).
- Question rotation engine, adaptive difficulty, dashboards, other subjects/key stages.

---

## Changing the questions

Edit `questions.js` only. Each question follows the PTO metadata pattern (ID, skill
ID, strand, difficulty, type, misconception, explanation). To adjust curriculum
weighting, change how many questions each strand has. To add a picture, use one of
the built-in illustration types (`dots`, `coins`, `shape`, `clock`).

---

Primary Tutor Online · KS1 Maths Skills Check · v1.0
