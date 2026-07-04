# PTO Asset Library (Stage 1)

This is the permanent asset architecture for Primary Tutor Online — built
so that future artwork (commissioned, purchased, AI-generated, or
hand-drawn) can replace placeholders **without redesigning the
assessment**, per the approved implementation plan (see
`../IMPLEMENTATION_PLAN.md`).

**Not yet wired into the live app.** Nothing in `index.html`, `app.js`, or
`questions.js` references anything in this folder yet — that's Stage 4
(applying to a small test set). This stage is the plumbing, proven to
work in isolation.

## Structure

```
assets/
  characters/manifest.js   — Emma, Oliver, Sophie, Ben; poses & colours
  objects/manifest.js      — fruit, vehicles, toys, animals, school items...
  scenes/manifest.js       — classroom, farm, beach, park...
  models/manifest.js       — documents which mathematical models are
                              code-generated in app.js today (these are
                              NOT swappable image assets — see below)
  hints/manifest.js        — skeleton per-skill hint library (a handful
                              of real examples; full library is Stage 3)
  resolve.js               — the resolver: given a stable asset ID,
                              returns either a placeholder or real
                              artwork, without the caller needing to know
                              which
```

## How a question will eventually reference an asset

Not yet implemented (Stage 4), but the intended shape, per the approved
plan's own examples:

```js
{
  text: "How many apples can Emma see?",
  character: "char_emma_point",
  objects: [{ id: "obj_apple_red", count: 4 }],
  scene: "scene_kitchen"
}
```

— rather than the current `illustration: {type:"dots", emoji:"🍎", ...}`
embedded directly in the question. That data-model shift is real and
deliberate, and is its own Stage 4 task, not done here.

## How to add real artwork later (the whole point of this system)

1. Add the image file under the relevant `assets/<type>/files/` folder
   (create it — it doesn't exist yet, since there's no real art yet).
2. In that asset's manifest entry, change:
   ```js
   status: "placeholder"  →  status: "final"
   file: null             →  file: "characters/files/emma_point_v1.svg"
   ```
3. Nothing else changes — no question data, no rendering code. The
   resolver already handles both states identically from the caller's
   point of view. This is proven, not just claimed: see
   `/home/claude/test_asset_library.js`, "THE KEY TEST," which simulates
   exactly this swap and confirms the resolver returns the real asset.

## Placeholder behaviour today

- **Characters**: a simple coloured initial badge (e.g. a pink circle
  with "E" for Emma) — deliberately plain so it's never mistaken for
  finished art.
- **Objects**: fall back to the emoji already live in the assessment
  today (already shipped, already leak-verified) — a genuinely reasonable
  placeholder tier, not a step backward.
- **Scenes**: render **nothing**. No scene exists today, and inventing a
  fake one would be worse than no background — scenes are explicitly
  optional per the reference pack.
- **Mathematical models**: not applicable — these stay code-generated
  permanently (see `models/manifest.js` for why), so there's no
  placeholder/final distinction for this category.

## Known gaps surfaced by building this manifest

Cross-checking `models/manifest.js` against Image Pack 5's 15 model
categories found four with no renderer in the live app yet: **ten frames,
part-whole/bond diagrams, bead strings, and true bar models** (the
existing `svgBars` renders comparative length bars, not part/part/whole
bar models), plus **3D shapes** (the existing `svgShape` is 2D-only).
Worth knowing before Stage 6's strand-by-strand rollout reaches
Measurement/Geometry, where these would likely be wanted.

## Character colours (confirmed)

Emma = pink `#E91E63` · Oliver = green `#43A047` · Sophie = purple
`#652DA0` · Ben = blue `#2196F3`. Character colour and curriculum strand
colour are separate systems by design — Sophie stays purple even on
Geometry questions (also purple); any visual clash is resolved later by
layout/spacing, never by recolouring either system.
