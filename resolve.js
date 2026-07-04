/* ============================================================
   PTO ASSET LIBRARY — RESOLVER  (Stage 1)
   ------------------------------------------------------------
   This is the mechanism that makes the whole system work: given a
   stable asset ID (e.g. "char_emma_point", "obj_car_red",
   "scene_classroom"), return what should actually render — today,
   almost always a placeholder; later, the real artwork — WITHOUT the
   calling code ever needing to know or care which.

   NOT wired into the live app yet. This is intentionally a standalone,
   independently-testable module. Stage 4 (small test set) is where a
   question first calls into this instead of embedding illustration
   data directly — that is a live-behaviour change and belongs in its
   own verified stage, not bundled into this one.

   HOW A REAL ASSET REPLACES A PLACEHOLDER (the whole point of Stage 1):
     1. Add the real image file somewhere under assets/<type>/files/.
     2. In the relevant manifest, change that ID's entry:
          status: "placeholder"  ->  status: "final"
          file: null              ->  file: "characters/files/emma_point.svg"
     3. Nothing else changes. No question data changes. No calling
        code changes. The resolver functions below already handle
        both states.
   ============================================================ */

const path = typeof require !== "undefined" ? require("path") : null;

function loadManifest(relPath) {
  if (typeof require !== "undefined") {
    return require(relPath);
  }
  throw new Error("loadManifest() requires a CommonJS environment (Node) in Stage 1 — " +
    "this module is not yet wired into the browser app.");
}

/**
 * Resolve a character asset ID to a render descriptor.
 * Placeholder behaviour: a simple coloured initial badge using the
 * character's official colour (never invented artwork, never a random
 * shape pretending to be finished art — clearly a placeholder).
 */
function resolveCharacter(id, manifests) {
  const { CHARACTERS, CHARACTER_META } = manifests.characters;
  const entry = CHARACTERS[id];
  if (!entry) return { found: false, id };
  const meta = CHARACTER_META[entry.character];
  if (entry.status === "final") {
    return { found: true, id, kind: "final", file: entry.file };
  }
  return {
    found: true, id, kind: "placeholder",
    label: meta.name.charAt(0).toUpperCase(),
    colour: meta.colour,
    pose: entry.pose
  };
}

/**
 * Resolve an object asset ID. Placeholder behaviour: fall back to the
 * emoji glyph already in use live today (already leak-verified) — a
 * genuinely good placeholder tier, not a step down.
 */
function resolveObject(id, manifests) {
  const { OBJECTS } = manifests.objects;
  const entry = OBJECTS[id];
  if (!entry) return { found: false, id };
  if (entry.status === "final") {
    return { found: true, id, kind: "final", file: entry.file };
  }
  return { found: true, id, kind: "placeholder", emoji: entry.placeholderEmoji || null };
}

/**
 * Resolve a scene asset ID. Placeholder behaviour: render NOTHING.
 * Scenes are explicitly optional (Image Pack 4) — a missing scene must
 * never break a question or force a fallback graphic; it simply means
 * no background is shown, exactly as questions render today.
 */
function resolveScene(id, manifests) {
  const { SCENES } = manifests.scenes;
  const entry = SCENES[id];
  if (!entry) return { found: false, id };
  if (entry.status === "final") {
    return { found: true, id, kind: "final", file: entry.file };
  }
  return { found: true, id, kind: "none" }; // deliberately renders nothing
}

/**
 * Resolve a mathematical model ID. These are never "placeholder vs
 * final" — the code IS the permanent asset (see models/manifest.js).
 * This resolver just confirms the renderer exists and names it; it
 * does not generate SVG itself (that stays in app.js).
 */
function resolveModel(id, manifests) {
  const { MODELS } = manifests.models;
  const entry = MODELS[id];
  if (!entry) return { found: false, id };
  return { found: true, id, status: entry.status, renderer: entry.renderer };
}

if (typeof module !== "undefined") {
  module.exports = { resolveCharacter, resolveObject, resolveScene, resolveModel, loadManifest };
}
