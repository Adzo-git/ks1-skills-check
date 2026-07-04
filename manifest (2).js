/* ============================================================
   PTO ASSET LIBRARY — CHARACTER MANIFEST  (Stage 1)
   ------------------------------------------------------------
   This file is a REGISTRY, not a renderer. It defines every valid
   character asset ID and what currently exists behind it.

   IMPORTANT: this file is NOT loaded by the live assessment yet.
   Nothing in index.html/app.js/questions.js references it. It exists
   so that Stage 4 (small test set) and beyond have a single, stable
   place to look up "does this asset exist yet, and as what."

   Naming convention: char_<name>_<pose>
   Official character colours (confirmed by Adam, per Master Pack B):
     Emma   = pink    (#E91E63 family)
     Oliver = green   (#43A047 family)
     Sophie = purple  (#652DA0 family)
     Ben    = blue    (#2196F3 family)
   Character Bible showed Ben as orange — that board is a superseded
   earlier draft; Master Pack B is authoritative for final artwork.

   status values:
     "placeholder" — no final artwork yet; resolve.js returns a simple
                     generated stand-in (see resolve.js for exactly what)
     "final"       — real artwork exists; `file` gives its path

   Character colour and curriculum strand colour are DELIBERATE SEPARATE
   SYSTEMS (confirmed decision). Sophie stays purple even on Geometry
   questions (also purple) — any visual clash is handled later by layout/
   spacing/neutral cards, never by recolouring either system.
   ============================================================ */

const CHARACTER_META = {
  emma:   { name: "Emma",   colour: "#E91E63", traits: "Curious, kind, encouraging" },
  oliver: { name: "Oliver", colour: "#43A047", traits: "Thoughtful, logical, helpful" },
  sophie: { name: "Sophie", colour: "#652DA0", traits: "Creative, imaginative, supportive" },
  ben:    { name: "Ben",    colour: "#2196F3", traits: "Energetic, positive, motivated" }
};

// The fixed action vocabulary every character supports (Character Bible,
// Image Pack 2). Not every character/pose combination needs to exist
// before Stage 4 — this list defines what's VALID, not what's built yet.
const POSES = ["point", "count", "think", "read", "celebrate", "confused", "idea"];

const CHARACTERS = {};
Object.keys(CHARACTER_META).forEach(character => {
  POSES.forEach(pose => {
    const id = `char_${character}_${pose}`;
    CHARACTERS[id] = {
      id, character, pose,
      status: "placeholder",   // no final artwork exists yet for ANY character/pose
      file: null
    };
  });
});

// Node/CommonJS export for tooling and tests; the live browser app does not
// (yet) load this file, so a plain `const` at file scope is also safe
// there if it's ever included directly via <script>.
if (typeof module !== "undefined") module.exports = { CHARACTER_META, POSES, CHARACTERS };
