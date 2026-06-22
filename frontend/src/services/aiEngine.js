/**
 * aiEngine.js
 * ------------------------------------------------------------------
 * This used to return a hardcoded object built from the static files
 * in `src/data/*`. It now calls the real Gemini-powered backend
 * (`POST /api/generate-plan` via aiService.generatePlan) and falls
 * back to a local, input-aware mock plan if that call fails for any
 * reason (offline, backend down, etc.) so the UI never crashes or
 * shows a blank page.
 *
 * `generateAIPlan(profileInput)` is now ASYNC. Components should not
 * call it directly — use the `useAIPlan()` hook from
 * `src/context/AIPlanContext.jsx`, which wraps this function with
 * loading/error state and fetches it once per session.
 */
import {
  profile as defaultProfile,
  futureTwins as mockFutureTwins,
  insights,
  roadmap as mockRoadmap,
  tradeoffs as mockTradeoffs,
  simulator as mockSimulator,
  decision as mockDecision,
} from "../data";
import { generatePlan } from "./aiService";

// ---------------------------------------------------------------------
// Derived fields every page expects (bestFuture, roadmapProgress, ...)
// computed from whichever plan we end up with (Gemini or fallback).
// ---------------------------------------------------------------------
function computeDerived(plan) {
  const futureTwins = plan.futureTwins?.length ? plan.futureTwins : mockFutureTwins;
  const roadmap = plan.roadmap?.length ? plan.roadmap : mockRoadmap;
  const tradeoffs = plan.tradeoffs?.length ? plan.tradeoffs : mockTradeoffs;
  const decision = plan.decision || mockDecision;
  const simulator = plan.simulator || mockSimulator;

  const bestFuture = [...futureTwins].sort((a, b) => b.score - a.score)[0];
  const completedTasks = roadmap.filter((task) => task.completed).length;
  const roadmapProgress = roadmap.length
    ? Math.round((completedTasks / roadmap.length) * 100)
    : 0;

  // Turn the AI's own reasoning into the Dashboard's "strengths /
  // opportunities / warnings" insight feed, instead of unrelated
  // static copy. This keeps the whole Dashboard genuinely AI-driven.
  const strengths = (decision.reasoning || []).map((text, idx) => ({
    id: `strength-${idx}`,
    type: "Strength",
    title: "Why this fits you",
    description: text,
    confidence: decision.confidence,
  }));
  const opportunities = (bestFuture?.opportunity || []).map((text, idx) => ({
    id: `opportunity-${idx}`,
    type: "Opportunity",
    title: "Opportunity",
    description: text,
    confidence: bestFuture?.confidence,
  }));
  const warnings = (bestFuture?.risk || []).map((text, idx) => ({
    id: `warning-${idx}`,
    type: "Warning",
    title: "Watch out for",
    description: text,
    confidence: bestFuture?.confidence,
  }));

  return {
    bestFuture,
    futureTwins,
    strengths,
    opportunities,
    warnings,
    roadmap,
    roadmapProgress,
    tradeoffs,
    simulator,
    decision,
  };
}

/**
 * Pure local mock, used only when the backend/Gemini is unreachable.
 * Kept close to the original static prototype data so the app still
 * "works" (visually) even fully offline.
 */
export function buildLocalFallbackPlan(profileInput) {
  const derived = computeDerived({
    futureTwins: mockFutureTwins,
    roadmap: mockRoadmap,
    tradeoffs: mockTradeoffs,
    decision: mockDecision,
    simulator: mockSimulator,
  });
  return {
    profile: { ...defaultProfile, ...profileInput },
    ...derived,
    meta: {
      source: "local-fallback",
      confidenceScore: 50,
      uncertaintyNotice:
        "The backend could not be reached, so this is static demo data, not a live AI analysis.",
      humanInTheLoop:
        "You make the final call. This tool is here to support your decision, not to make it for you.",
    },
  };
}

/**
 * Main entry point. Always resolves (never throws) so consumers don't
 * need their own try/catch — see useAIPlan() for the loading/error UI.
 */
export const generateAIPlan = async (profileInput) => {
  try {
    const result = await generatePlan(profileInput);
    if (!result?.success) {
      throw new Error(result?.message || "AI plan generation failed.");
    }
    const derived = computeDerived(result.data);
    return {
      profile: { ...defaultProfile, ...profileInput },
      ...derived,
      meta: {
        source: result.source, // "gemini" | "local-fallback" (backend-side fallback)
        warning: result.warning || null,
        ...result.data.meta,
      },
    };
  } catch (err) {
    console.warn("[aiEngine] Falling back to local mock plan:", err.message);
    const fallback = buildLocalFallbackPlan(profileInput);
    fallback.meta.error = err.message;
    return fallback;
  }
};

// Kept for reference/backward compatibility with anything still
// importing the static insights list directly.
export { insights };
