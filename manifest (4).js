/* ============================================================
   PTO ASSET LIBRARY — OBJECT MANIFEST  (Stage 1)
   ------------------------------------------------------------
   Registry only — not loaded by the live app yet. Organised along
   Image Pack 3's 12 object categories.

   status: "placeholder" means the live app currently renders this
   object as an emoji glyph (already shipped, already leak-verified) —
   that's a perfectly good placeholder tier, not a step backward.
   "final" means real illustrated artwork exists at `file`.

   Naming convention: obj_<name>[_<variant>]
   ============================================================ */

const OBJECTS = {
  // ---- Fruit (already live in questions.js) ----
  obj_apple_red:   { category: "fruit",    status: "placeholder", placeholderEmoji: "🍎", file: null },
  obj_apple_green: { category: "fruit",    status: "placeholder", placeholderEmoji: "🍏", file: null },
  obj_orange:      { category: "fruit",    status: "placeholder", placeholderEmoji: "🍊", file: null },
  obj_banana:      { category: "fruit",    status: "placeholder", placeholderEmoji: "🍌", file: null },
  obj_pear:        { category: "fruit",    status: "placeholder", placeholderEmoji: "🍐", file: null },
  obj_strawberry:  { category: "fruit",    status: "placeholder", placeholderEmoji: "🍓", file: null },

  // ---- Vehicles (already live) ----
  obj_car_red:     { category: "vehicles", status: "placeholder", placeholderEmoji: "🚗", file: null },
  obj_bus_blue:    { category: "vehicles", status: "placeholder", placeholderEmoji: "🚌", file: null },
  obj_bicycle:     { category: "vehicles", status: "placeholder", placeholderEmoji: "🚲", file: null },
  obj_train:       { category: "vehicles", status: "placeholder", placeholderEmoji: "🚂", file: null },
  obj_aeroplane:   { category: "vehicles", status: "placeholder", placeholderEmoji: "✈️", file: null },

  // ---- Toys ----
  obj_teddy:       { category: "toys",     status: "placeholder", placeholderEmoji: "🧸", file: null },
  obj_football:    { category: "toys",     status: "placeholder", placeholderEmoji: "⚽", file: null },
  obj_kite:        { category: "toys",     status: "placeholder", placeholderEmoji: "🪁", file: null },

  // ---- Animals ----
  obj_dog:         { category: "animals",  status: "placeholder", placeholderEmoji: "🐶", file: null },
  obj_cat:         { category: "animals",  status: "placeholder", placeholderEmoji: "🐱", file: null },
  obj_rabbit:      { category: "animals",  status: "placeholder", placeholderEmoji: "🐰", file: null },
  obj_fish:        { category: "animals",  status: "placeholder", placeholderEmoji: "🐟", file: null },

  // ---- School items (already live) ----
  obj_pencil:      { category: "school",   status: "placeholder", placeholderEmoji: "✏️", file: null },
  obj_book:        { category: "school",   status: "placeholder", placeholderEmoji: "📚", file: null },
  obj_backpack:    { category: "school",   status: "placeholder", placeholderEmoji: "🎒", file: null },

  // ---- Food (already live) ----
  obj_cake:        { category: "food",     status: "placeholder", placeholderEmoji: "🍰", file: null },
  obj_cookie:      { category: "food",     status: "placeholder", placeholderEmoji: "🍪", file: null },
  obj_sweet:       { category: "food",     status: "placeholder", placeholderEmoji: "🍬", file: null },
  obj_egg:         { category: "food",     status: "placeholder", placeholderEmoji: "🥚", file: null },

  // ---- Nature ----
  obj_flower:      { category: "nature",   status: "placeholder", placeholderEmoji: "🌸", file: null },
  obj_tree:        { category: "nature",   status: "placeholder", placeholderEmoji: "🌳", file: null },
  obj_sun:         { category: "nature",   status: "placeholder", placeholderEmoji: "☀️", file: null },

  // ---- Patterns & counting items (already live) ----
  obj_star:        { category: "patterns", status: "placeholder", placeholderEmoji: "⭐", file: null },

  // ---- Shapes: NOT here — shapes are a mathematical model (see models/manifest.js),
  // not a decorative object, per the reference pack's own distinction.
};

if (typeof module !== "undefined") module.exports = { OBJECTS };
