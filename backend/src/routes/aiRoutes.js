const express = require("express");

const router = express.Router();

const { generatePlan } = require("../controllers/aiController");
const geminiService = require("../services/geminiService");

// POST /api/generate-plan
// Body: { name, age, skills, goals, budget, riskTolerance }
router.post("/generate-plan", generatePlan);

// GET /api/ai-status — lets the frontend (e.g. AIStatusCard) show
// whether real Gemini reasoning is active or we're on the local fallback.
router.get("/ai-status", (req, res) => {
  res.json({
    success: true,
    geminiConfigured: geminiService.isConfigured(),
  });
});

module.exports = router;
