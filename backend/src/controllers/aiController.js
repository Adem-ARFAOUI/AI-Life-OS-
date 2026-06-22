/**
 * aiController.js
 * ------------------------------------------------------------------
 * HTTP layer for AI plan generation. Validates/normalizes the incoming
 * profile, delegates the actual reasoning to geminiService, and always
 * returns a usable plan — falling back to a local generator if Gemini
 * is unavailable, so the frontend never has to handle a hard failure.
 */

const geminiService = require("../services/geminiService");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Accepts riskTolerance as a number (0-100, per the brief's example
 * payload) OR as the string label already used elsewhere in this app
 * ("Low" / "Medium" / "High", see User model / CompleteProfile.jsx),
 * and normalizes it to a 0-100 number for the AI prompt + simulator.
 */
function normalizeRiskTolerance(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clamp(value, 0, 100);
  }
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "low") return 20;
    if (v === "medium") return 55;
    if (v === "high") return 85;
    const parsed = parseInt(v, 10);
    if (Number.isFinite(parsed)) return clamp(parsed, 0, 100);
  }
  return 50; // sensible default
}

function normalizeSkills(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function buildProfileFromRequest(body) {
  const {
    name,
    age,
    skills,
    goals,
    goal, // tolerate the existing "goal" (singular) field used by the User model
    budget,
    riskTolerance,
  } = body;

  return {
    name: (name || "Anonymous").toString().trim(),
    age: Number.isFinite(Number(age)) ? Number(age) : 25,
    skills: normalizeSkills(skills),
    goals: (goals || goal || "").toString().trim(),
    budget: Number.isFinite(Number(budget)) ? Number(budget) : 5000,
    riskTolerance: normalizeRiskTolerance(riskTolerance),
  };
}

/**
 * POST /api/generate-plan
 * Body: { name, age, skills, goals, budget, riskTolerance }
 */
const generatePlan = async (req, res) => {
  const profile = buildProfileFromRequest(req.body || {});

  if (!profile.goals) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least a 'goals' (or 'goal') field describing the user's ambition.",
    });
  }

  // 1. Try the real Gemini-powered reasoning.
  if (geminiService.isConfigured()) {
    try {
      const data = await geminiService.generateLifePlan(profile);
      return res.json({
        success: true,
        source: "gemini",
        input: profile,
        data,
      });
    } catch (error) {
      console.error("[aiController] Gemini generation failed, using fallback:", error.message);
      // fall through to the local fallback below
    }
  } else {
    console.warn("[aiController] GEMINI_API_KEY not set — using local fallback plan.");
  }

  // 2. Graceful degradation: never leave the user with a broken screen.
  const fallbackData = geminiService.buildFallbackPlan(profile);
  return res.json({
    success: true,
    source: "local-fallback",
    warning:
      "The Gemini API was unavailable, so this plan was generated locally with simplified rules.",
    input: profile,
    data: fallbackData,
  });
};

module.exports = {
  generatePlan,
};
