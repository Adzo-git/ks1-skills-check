/* ============================================================
   PTO ASSET LIBRARY — SCENE MANIFEST  (Stage 1)
   ------------------------------------------------------------
   Registry only — not loaded by the live app yet.

   Unlike objects, NO scene rendering exists in the live app at all
   today, so every entry here is genuinely a future addition, not a
   re-registration of something already shipped. status is "placeholder"
   for all of them, meaning: if a question references a scene ID before
   real artwork exists, the correct behaviour is to render NOTHING (no
   scene) rather than invent a fake one — scenes are explicitly optional
   per Image Pack 4 ("used only when it helps children connect to the
   question"), never a required element.

   Naming convention: scene_<name>
   ============================================================ */

const SCENES = {
  // Home
  scene_kitchen:    { category: "home",     status: "placeholder", file: null },
  scene_bedroom:    { category: "home",     status: "placeholder", file: null },
  scene_living_room:{ category: "home",     status: "placeholder", file: null },

  // School
  scene_classroom:  { category: "school",   status: "placeholder", file: null },
  scene_library:    { category: "school",   status: "placeholder", file: null },

  // Outdoors
  scene_park:       { category: "outdoors", status: "placeholder", file: null },
  scene_playground: { category: "outdoors", status: "placeholder", file: null },
  scene_garden:     { category: "outdoors", status: "placeholder", file: null },

  // Town & community
  scene_supermarket:{ category: "town",     status: "placeholder", file: null },
  scene_bakery:     { category: "town",     status: "placeholder", file: null },
  scene_bus_stop:   { category: "town",     status: "placeholder", file: null },

  // Nature & seasons
  scene_woodland:   { category: "nature",   status: "placeholder", file: null },
  scene_beach:      { category: "nature",   status: "placeholder", file: null },
  scene_farm:       { category: "nature",   status: "placeholder", file: null },

  // Fantasy & imagination (used sparingly, per the pack's own guidance)
  scene_space:      { category: "fantasy",  status: "placeholder", file: null },
  scene_underwater: { category: "fantasy",  status: "placeholder", file: null },
  scene_castle:     { category: "fantasy",  status: "placeholder", file: null },

  // Transport & travel
  scene_train_station: { category: "transport", status: "placeholder", file: null },
  scene_road:          { category: "transport", status: "placeholder", file: null },

  // Sport & activities
  scene_football_pitch: { category: "sport", status: "placeholder", file: null },
  scene_swimming_pool:  { category: "sport", status: "placeholder", file: null }
};

if (typeof module !== "undefined") module.exports = { SCENES };
