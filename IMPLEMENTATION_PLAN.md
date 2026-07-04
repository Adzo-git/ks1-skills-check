# Primary Tutor Online — Visual Reference Pack: Analysis & Implementation Plan

**Status: analysis only. No code has been changed.**
This document is the deliverable requested before any implementation begins.

---

## 1. Summary of the final visual direction

Primary Tutor Online's visual identity, as defined by Master Pack C (the
authoritative brand bible) and the ten supporting packs, is:

- **Friendly, professional, trusted.** Clean vector illustration — not
  emoji, not clip-art, not photography, not painted/soft-rendered art.
- **Poppins** throughout, a defined type scale (H1 32px bold → caption
  12px), used for both brand and body text.
- **A four-colour primary palette** (Purple `#652DA0`, Pink `#E91E63`,
  Green `#43A047`, Blue `#2196F3`) plus five secondary tints and four
  neutrals — small, disciplined, not decorative.
- **Four recurring named characters** (Emma, Oliver, Sophie, Ben), each
  drawn consistently front/side/back, with a shared set of actions
  (pointing, counting, thinking, reading, celebrating, confused, idea) and
  expressions (happy, excited, thinking, surprised, proud, focused, kind).
- **Reusable object, scene, and mathematical-model libraries**, each with
  explicit "use for" guidance tying them to curriculum content, not
  decoration.
- **A strict visual hierarchy**: Question → Illustration → Answers → Hint,
  where the hint is deliberately the smallest, quietest element on the
  page and is *never* a permanent motivational panel.
- **Progressive maturity by Key Stage** (confirmed consistent with what I
  already have in `DESIGN_SYSTEM.md` from earlier work) — KS1 bright and
  illustrated, maturing toward KS4 minimal and exam-style.

This is, encouragingly, the same direction the project has already been
moving in through v1.5–v1.9 (strand colours, sparing encouragement, themed
illustrations, sharpened tips) — this pack gives it a name, a formal
palette, and a much larger asset vocabulary to grow into. It is not a
reversal of that work; it's the permanent foundation that work was an
early, correct instinct toward.

## 2. Key design principles I will follow

Directly from the reference pack, in priority order when they compete:

1. **Mathematics is the hero.** Nothing on the page may compete visually
   with the question and the answer choices.
2. **Illustrations teach, never decorate.** Per Master Pack A/Image Pack 8:
   if removing an illustration makes no difference to understanding, it
   shouldn't be there in that form.
3. **Hints are small, quiet, skill-specific, and optional.** Never a
   permanent panel; never present on every question; never reveal an
   answer. This explicitly replaces (not supplements) the current
   always-visible Maths Tip box.
4. **Consistency over novelty.** One illustration style, one character
   set, one palette — reused, not reinvented per question. This directly
   supersedes some of my own v1.7–v1.9 choices (see §10 migration notes).
5. **Mathematical models stay mathematically accurate.** Ten frames,
   number lines, base-10, fraction bars/circles, arrays, bar models, clocks,
   coins, tally charts are explicitly *not* to be reskinned as decorative
   art — they already match this principle in the current codebase and
   that will not change.
6. **Accessible by construction.** High contrast, large touch targets,
   colour never the sole signal, alt text for every image, keyboard/screen
   reader friendly — matches constraints already enforced in the current
   codebase (aria-label leak sweeps, colour+icon+text redundancy).
7. **Build for reuse across the whole future platform**, not just this
   assessment — every naming and folder decision below is made with KS2–4,
   English, Science, worksheets, and lessons in mind, even though only KS1
   Maths exists today.

## 3. Proposed asset library structure

Five libraries, matching the reference pack's own division, each with a
**manifest** (a single JSON/JS file listing every asset ID, its category,
and its current implementation — placeholder or real) so the system always
knows what exists and what's still a placeholder:

```
assets/
  characters/     — Emma, Oliver, Sophie, Ben; poses & expressions
  objects/        — fruit, vehicles, toys, animals, school items, maths items, nature, money, time
  scenes/         — classroom, playground, park, kitchen, farm, beach, bedroom, supermarket, etc.
  models/         — NOT image assets — see §7, these stay code-generated
  hints/          — NOT image assets — pure content, see §8
```

Each of `characters/`, `objects/`, `scenes/` gets a manifest like:

```js
// assets/characters/manifest.js
const CHARACTERS = {
  "emma-point":     { character: "emma",   pose: "point",     status: "placeholder", file: null },
  "oliver-think":   { character: "oliver", pose: "think",     status: "placeholder", file: null },
  // ...
};
```

`status` is either `"placeholder"` (renders a simple built-in stand-in) or
`"final"` (renders the real asset file). **This is the single mechanism
that lets real artwork replace placeholders with zero changes to
`questions.js` or the assessment engine** — exactly the requirement in your
brief. A question never says "draw a circle here"; it says
`character: "emma-point"`, and the manifest decides what that resolves to
today versus after you upload real art.

## 4. Proposed folder and naming structure

Following Master Pack B's own naming examples almost exactly (they're
already good and I see no reason to diverge):

```
char_<name>_<pose>          e.g. char_emma_point, char_oliver_think
obj_<name>_<variant?>       e.g. obj_apple, obj_car_red, obj_bus_blue
scene_<name>                e.g. scene_classroom, scene_farm, scene_beach
model_<type>                e.g. model_ten_frame, model_number_line, model_base10
hint_<strand>_<nn>          e.g. hint_npv_01, hint_time_03
```

All lowercase, underscore-separated, no version numbers in the name
(versioning happens at the manifest/file level, not the ID) — an asset's
*ID* is permanent even when the *artwork behind it* is replaced.

## 5. Proposed character system

- **Four characters, fixed traits** (matching the Character Bible exactly):
  Emma (pink, curious/kind/encouraging), Oliver (green, thoughtful/logical),
  Sophie (purple, creative/imaginative — note: glasses, per the bible art,
  though the brand-bible palette assigns purple to the brand itself, not
  specifically Sophie — I'll treat character *colour* as their clothing
  only, distinct from strand colours, to avoid a collision between
  "Sophie is purple" and "Geometry is purple"), Ben (orange in the Character
  Bible board, though Master Pack B's asset shows Ben in blue — **this is a
  second small inconsistency between boards I'll flag rather than guess**:
  Character Bible = Ben orange, Master Pack B = Ben blue).
- **A fixed action vocabulary**: point, count, think, read, celebrate,
  confused, idea (7 actions × 4 characters = 28 character assets minimum,
  before expressions are layered in).
- **Placeholder behaviour**: until real art exists, a character reference
  renders as a simple labelled silhouette/initial-badge (e.g. a circle with
  "E" and the character's brand colour) — clearly a placeholder, never
  mistaken for finished art, per your instruction not to build throwaway
  placeholder *artwork*.
- **Usage discipline** (from Master Pack B's own usage notes): characters
  support understanding, they don't have to appear on every question — a
  counting question with a character pointing at objects earns their
  presence; an abstract place-value question likely doesn't need one.

## 6. Proposed object and scene system

- **Objects**: organised exactly along the 12 categories in Image Pack 3
  (People, Animals, Food & Drink, Transport, Shapes, School Items,
  Everyday Objects, Numbers & Maths, Nature, Time & Calendar, Money,
  Patterns & Counting). Each object is a single reusable asset ID,
  referenced by count/colour/position data from the question, never
  redrawn per question.
- **Scenes**: the 8 categories from Image Pack 4 (Home, School, Outdoors,
  Town & Community, Nature & Seasons, Fantasy & Imagination, Transport &
  Travel, Sport & Activities). Scenes are backgrounds *only* — objects and
  characters composite on top of them. A scene is optional per question,
  used only when it "helps children connect to the question" per the
  pack's own best-practice note, not applied by default.
- **Placeholder behaviour**: an object/scene reference without final
  artwork falls back to the current flat-SVG/emoji rendering already
  built (dots, themed emoji, simple shapes) — which is a perfectly
  reasonable placeholder tier, not a step backward, since it's already
  built, tested, and leak-verified.

## 7. Proposed mathematical model system

**These stay code-generated, not image assets — this is a deliberate
architectural decision, not an oversight.** Ten frames, number lines,
base-10 blocks, fraction bars/circles, arrays, bar models, clocks, coins,
and tally charts all need to render *specific numeric data per question*
(a number line spanning specific values, a clock at a specific time, a
fraction split into a specific number of parts). A static image can't do
that. The existing `app.js` renderers (`svgBase10`, `svgNumberline`,
`svgFraction`, `svgClock`, `svgCoins`, `svgTally`, `svgArray`) already do
exactly this and are already verified against the Illustration Style
Guide's own stated requirements (consistent size/proportions, logical
colours, accurate labelling). **These are the permanent asset for this
category — the code *is* the reusable library**, and my recommendation is
to leave them as-is structurally, restyled only where the colour palette
needs updating to match the brand-bible hex values exactly (see §10).

## 8. Proposed hint system

This is a genuine behaviour change, not just a rename — confirming I've
understood the instruction correctly:

- **Remove** the current always-visible Maths Tip box entirely from the
  default question layout.
- **Replace** with a small, optional "Hint" affordance (matching Image
  Pack 1/7's "View Hint" button pattern) that a child can *choose* to
  reveal, rather than a box that's always showing something.
- **Content**: organised as a hint library by curriculum objective/skill
  (not by the 5-type system from v1.4 — that typed system was a good
  intermediate step, but this pack asks for something more targeted: one
  or a small number of genuinely skill-specific hints *per question type*,
  e.g. "The longer hand shows the minutes" only for half-past/quarter-past
  clock questions, not a general MEA-strand pool). This means the hint
  library is organised more like `hints/npv/count-objects.js` than a flat
  185-entry strand pool.
- **Rule preserved from all existing work**: maximum two short sentences,
  never reveals the answer, verified via the same leak-sweep methodology
  already in place.
- **Migration note**: many of the 185 existing Maths Tips are already
  good raw material for this — several are already skill-specific
  (`"The short hand points to the hour, and the long hand points to the
  minutes"`, `"Equal rows can help you see multiplication clearly"`) and
  can likely be re-homed into the new per-skill hint library rather than
  rewritten from scratch.

## 9. Proposed question page layout

Directly from Image Pack 1 / 7's visual hierarchy panel, adapted to what
the brand bible (Master Pack C) actually specifies for colours/type:

```
1. Header        — brand mark, progress ("Question 12 of 37"), pause/menu
2. Strand tag     — small, e.g. "Maths" (already exists)
3. QUESTION       — largest text on the page
4. ILLUSTRATION   — large, central, the second-largest element
5. ANSWERS        — large tappable cards, 2×2 grid, colour-coded per option
                     (not per strand — this is a change from the current
                     single-column layout)
6. HINT           — small, quiet, optional, bottom or side placement
7. Navigation     — Previous / Flag for Review / Next
```

This is a real layout change from the current single-column answer list
and always-visible tip box — flagged clearly as a UI change requiring its
own careful, verified pass (HTML/CSS), not just a content change.

## 10. Phased implementation plan

Matching the staged approach you specified, with my own honesty checks
built into each stage (nothing marked "done" without the same
leak-sweep/regression rigor used throughout this project):

**Stage 1 — Asset/library architecture.**
Build the manifest structure (§3), folder/naming conventions (§4), and the
placeholder-resolution mechanism, with *zero* visible change to the live
assessment — this stage is pure plumbing, verified by confirming the
current assessment still renders identically before and after.

**Stage 2 — Page layout update.**
Rebuild `index.html`/`styles.css` to the new hierarchy (§9): larger
illustration area, 2×2 colour-coded answer grid, hint moved to a
collapsed/optional affordance, Maths Tip box removed. This is the biggest
single visual change and needs its own dedicated round with full
before/after screenshots-equivalent verification (structural HTML checks,
mobile-width checks, accessibility contrast checks).

**Stage 3 — Hint system rebuild.**
Replace the current always-on 185-tip pool with the per-skill hint library
(§8), migrating salvageable existing tips. Verify: every question has at
most the intended hint(s), none leak, hint is optional not forced.

**Stage 4 — Apply to a small test set.**
Pick one strand's worth of a handful of questions (I'd suggest starting
with the already-partially-migrated NPV counting questions, since they're
the most mature) and apply character/scene/object placeholders end-to-end,
to prove the whole pipeline before committing to all 360.

**Stage 5 — Validate.**
Full regression suite (as used throughout this project): syntax checks,
2,000-run selection simulation, aria-label leak sweep, full sitting
simulation, Supabase row-shape check, mobile-width CSS check.

**Stage 6 — Strand-by-strand rollout.**
NPV → AS → MD → Fractions → Measurement → Geometry → Position & Direction
→ Statistics, each strand fully completed (with a Question Review Log
entry per question) before the next begins, exactly as you specified.

---

## Two things I need your call on before Stage 1 begins

1. **Ben's colour** — Character Bible board shows orange, Master Pack B's
   character sheet shows blue. Worth confirming which is correct before
   any character asset ID gets built around it.
2. **Character colour vs. strand colour collision** — Sophie's brand
   colour is purple, and Geometry's strand colour is also purple in the
   established Design System. If Sophie appears on a Geometry question,
   should her outfit colour and the strand accent colour be allowed to
   clash, or should character colour take visual priority (i.e. strand
   colour becomes a much subtler accent when a character is present)?

No code has been changed. Awaiting your review of this plan.

---

## Stage 1 — COMPLETE

Both decisions confirmed: Ben = blue (Master Pack B authoritative);
character colours and strand colours are permanently separate systems,
any visual clash resolved by layout, never by recolouring.

**What was built** (all under `assets/`, see `assets/README.md` for full
detail): character manifest (4 characters × 7 poses = 28 entries), object
manifest (grounded in every emoji already live in the question bank),
scene manifest (18 scenes across 8 categories, honestly all placeholder
since no scene rendering exists yet), mathematical models manifest
(documents 11 implemented renderers and 4 genuine gaps — ten frames,
part-whole diagrams, bead strings, true bar models, 3D shapes — found by
cross-checking against Image Pack 5), a hint manifest skeleton (8 example
entries proving the naming convention, not a full migration), and the
resolver (`assets/resolve.js`) that makes placeholder→final swaps require
zero other code changes.

**Verified, not asserted:**
- 24/24 tests pass, including the key architectural claim: simulating a
  real-artwork upload (flip `status` to `"final"`, add a `file` path)
  and confirming the resolver returns the real asset with no other code
  touched.
- **Every live file's checksum is byte-for-byte identical before and
  after this stage** (`index.html`, `styles.css`, `app.js`,
  `questions.js`, `config.js`, `supabase-setup.sql`,
  `tools/generate-questions.js`) — this stage added files only; it did
  not modify anything that runs today.
- Full standard regression suite still passes (37 questions, correct
  quotas, 209 illustrations, 2,000 unique selections).

**The live assessment runs exactly as it did before this stage** — this
isn't a judgement call, it's a checksum fact.

