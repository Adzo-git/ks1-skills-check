/* ============================================================
   PTO KS1 MATHS SKILLS CHECK — CONFIGURATION
   ------------------------------------------------------------
   This is the ONLY file you normally need to edit to go live.

   1. Create a free Supabase project (https://supabase.com).
   2. Run the SQL in supabase-setup.sql (SQL Editor > paste > Run).
   3. In Supabase: Project Settings > API. Copy the two values below.
   4. Paste them here and save.

   The anon (public) key is SAFE to include in a public website.
   Row Level Security (set up by supabase-setup.sql) means the public
   can only ADD results — it cannot read anyone else's data.
   ============================================================ */

const PTO_CONFIG = {
  // --- Supabase connection (paste your own values) ---
  SUPABASE_URL:      "YOUR_SUPABASE_URL",       // e.g. https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",  // the long "anon public" key

  // --- Behaviour ---
  // Set to false to try the whole assessment WITHOUT saving anywhere.
  // Useful for testing the questions and report before Supabase is ready.
  SAVE_RESULTS: true,

  // Which assessment this is. Saved with every result so different checks
  // (KS1 Maths, KS1 English, KS2 Maths…) stay distinguishable later.
  ASSESSMENT_NAME: "KS1 Maths Skills Check",

  // Version of the QUESTION SET. Bump this whenever you change questions.js,
  // so you always know which questions a child actually answered.
  ASSESSMENT_VERSION: "v1.0-rc2",

  // Version of the SOFTWARE (this app). Separate from the question-set version.
  APP_VERSION: "v1.0-rc2"
};

// Returns true only when real Supabase details have been entered.
function ptoIsConfigured() {
  return (
    PTO_CONFIG.SAVE_RESULTS &&
    PTO_CONFIG.SUPABASE_URL &&
    PTO_CONFIG.SUPABASE_ANON_KEY &&
    !PTO_CONFIG.SUPABASE_URL.includes("YOUR_") &&
    !PTO_CONFIG.SUPABASE_ANON_KEY.includes("YOUR_")
  );
}
