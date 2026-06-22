/**
 * geminiService.js
 * ------------------------------------------------------------------
 * All communication with the Gemini API lives here. The rest of the
 * backend (controllers/routes) never talks to Gemini directly.
 *
 * NOTE ON THE SDK:
 * The brief asked for `@google/generative-ai`, but that package has
 * been EOL since August 31, 2025 (Google's official notice). It has
 * been replaced by the actively maintained `@google/genai` package,
 * which is what this file uses. See README_GEMINI_INTEGRATION.md for
 * details on why this substitution was made.
 *
 * DESIGN:
 * - 5 separate "prompt builder" functions, one per reasoning stage
 *   (Future Twins, Trade-Offs, Roadmap, Decision, Simulator), as
 *   requested. They are assembled into a single combined prompt so
 *   that ONE Gemini call produces the entire plan. This matters a lot
 *   on the Gemini *free tier*, which has strict requests-per-minute
 *   and requests-per-day quotas — five separate calls per user action
 *   would burn through that budget five times faster for no benefit,
 *   since the five sections are not independent (the roadmap should
 *   agree with the chosen future twin, the decision should agree with
 *   the trade-offs, etc.). A single call with a structured response
 *   schema keeps everything consistent and is far more quota-friendly.
 * - `responseSchema` forces Gemini to return well-formed JSON that
 *   matches the shape the frontend expects, instead of us trying to
 *   regex/parse free-form text.
 * - Every output also carries a confidence score + uncertainty notice
 *   + human-in-the-loop reminder (hackathon "Responsible AI" requirement).
 * - `buildFallbackPlan()` is a deterministic, input-aware generator
 *   used when Gemini is unreachable/unconfigured/quota-exhausted, so
 *   the product never shows a blank screen or crashes during a demo.
 */

const { GoogleGenAI } = require("@google/genai");

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client = null;
const isConfigured = () => Boolean(process.env.GEMINI_API_KEY);

function getClient() {
  if (!isConfigured()) {
    throw new GeminiServiceError(
      "GEMINI_API_KEY is not set. Add it to backend/.env (see .env.example).",
      "NOT_CONFIGURED",
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

class GeminiServiceError extends Error {
  constructor(message, code = "GEMINI_ERROR") {
    super(message);
    this.name = "GeminiServiceError";
    this.code = code;
  }
}

// ---------------------------------------------------------------------
// 1. Helpers to normalize the raw profile coming from the controller
// ---------------------------------------------------------------------

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function describeProfile(profile) {
  const { name, age, skills, goals, budget, riskTolerance } = profile;
  return [
    `Name: ${name}`,
    `Age: ${age}`,
    `Skills: ${skills.length ? skills.join(", ") : "Not specified"}`,
    `Goal / ambition: ${goals}`,
    `Available budget: $${budget}`,
    `Risk tolerance: ${riskTolerance}/100 (0 = very risk-averse, 100 = very risk-seeking)`,
  ].join("\n");
}

// ---------------------------------------------------------------------
// 2. The five optimized prompt sections
//    (kept separate on purpose: each is independently testable/tunable,
//    even though they are sent to Gemini as one combined request)
// ---------------------------------------------------------------------

function buildFutureTwinPrompt() {
  return `
### SECTION 1 — FUTURE TWIN GENERATION
Generate exactly 3 "Future Twins": distinct, plausible 1-5 year life/career
paths for this person, derived from their skills, goal, budget and risk
tolerance. They must be meaningfully different from each other (e.g. one
safer, one bolder, one hybrid) — do not make three variations of the same
idea. For each twin provide: an id (1,2,3), a short punchy title, a 1-2
sentence description, a future-fit "score" (0-100, how well it matches the
profile), a "confidence" (0-100, how confident you are in this projection),
an estimated "salary" range as a short string, a "time" horizon as a short
string, a "difficulty" (Easy/Medium/Hard), an "effort" level as a short
string, a "timeline" sentence describing the suggested first steps over
time, a list of 2-4 concrete "opportunity" strings, and a list of 2-4
concrete "risk" strings. Be specific to the person's actual skills and goal,
not generic.`;
}

function buildTradeoffPrompt() {
  return `
### SECTION 2 — TRADE-OFF ANALYSIS
Generate 3 to 5 "tradeoffs": the realistic high-level life/career options
this person is implicitly choosing between (these can be broader categories
than the Future Twins, e.g. "Further Study", "Startup", "Salaried Job",
"Freelance/Consulting" — adapt the labels to the person's actual goal). For
each, score four dimensions from 0-100: "salary" (earning potential),
"risk" (financial/career risk), "freedom" (autonomy and flexibility), and
"growth" (long-term skill/career growth potential). Be honest — no option
should be uniformly best; every option should show real trade-offs.`;
}

function buildRoadmapPrompt() {
  return `
### SECTION 3 — ROADMAP CREATION
Generate a 4-step action roadmap (covering roughly Month 3, Month 6, Month
12 and Month 24) for pursuing the single BEST future twin you identified in
Section 1. For each step provide: a "period" label (e.g. "Month 3"), a
short "title", a one-sentence "description", a list of 3-5 concrete
"actions" the person should take, and "completed" set to false for every
step (the user will track completion themselves).`;
}

function buildDecisionPrompt() {
  return `
### SECTION 4 — DECISION RECOMMENDATION
Recommend ONE of the three Future Twins from Section 1 as the primary
recommendation ("recommendation" = that twin's exact title string). Provide
a "confidence" (0-100) IMPORTANT: this must be presented as a probabilistic
estimate, never a certainty. Provide 3-5 short "reasoning" bullet strings
explaining why, grounded in the person's actual profile. Provide an
"alternatives" list with the titles of the other two twins. Provide a short
"uncertaintyNotice" string reminding the reader this is a model estimate,
not a guarantee, and that personal judgment matters.`;
}

function buildSimulatorPrompt(profile) {
  return `
### SECTION 5 — SCENARIO SIMULATION
Build a "simulator" baseline object using the user's own input as the
starting slider values: "age" (${profile.age}), "budget" (${profile.budget}),
"riskTolerance" (${profile.riskTolerance}, 0-100), an estimated "experience"
in years (0-20, infer a reasonable value from age/skills, do not just copy
budget), and a "confidence" (0-100, self-confidence estimate for this
person pursuing the recommended path). Then provide "scenarios": one
{name, score} entry per Future Twin from Section 1 (same titles, score
0-100), representing how each path looks under these current variables.`;
}

const RESPONSE_FORMAT_INSTRUCTIONS = `
### OUTPUT FORMAT
Respond ONLY with a single JSON object matching the provided response
schema exactly — no markdown, no commentary, no code fences. All text must
be in English regardless of the language used in the input. Every section
above must be internally consistent: the same 3 twin titles must be reused
across futureTwins, decision.recommendation/alternatives and
simulator.scenarios. Also include a top-level "meta" object with:
"confidenceScore" (0-100, overall confidence in this whole plan),
"uncertaintyNotice" (1-2 sentences making clear this is a probabilistic,
AI-generated estimate, not a guaranteed outcome), and "humanInTheLoop"
(1 sentence reminding the user that the final decision is theirs and this
is a decision-support tool, not an authority).`;

function buildMasterPrompt(profile) {
  return `
You are the reasoning engine behind "AI Life OS", a Second Brain for Real
Life. A user has shared their profile below. Your job is to think through
their situation like a thoughtful, honest career/life advisor: realistic,
specific to THEIR profile (not generic advice), and always transparent
about uncertainty. You never present your output as guaranteed fact — you
present it as one well-reasoned input among several the person should
weigh, alongside their own judgment, values and circumstances.

### USER PROFILE
${describeProfile(profile)}

${buildFutureTwinPrompt()}
${buildTradeoffPrompt()}
${buildRoadmapPrompt()}
${buildDecisionPrompt()}
${buildSimulatorPrompt(profile)}
${RESPONSE_FORMAT_INSTRUCTIONS}`;
}

// ---------------------------------------------------------------------
// 3. Structured output schema (forces valid, predictable JSON back)
// ---------------------------------------------------------------------

const TWIN_SCHEMA = {
  type: "OBJECT",
  properties: {
    id: { type: "NUMBER" },
    title: { type: "STRING" },
    description: { type: "STRING" },
    score: { type: "NUMBER" },
    confidence: { type: "NUMBER" },
    salary: { type: "STRING" },
    time: { type: "STRING" },
    difficulty: { type: "STRING" },
    effort: { type: "STRING" },
    timeline: { type: "STRING" },
    opportunity: { type: "ARRAY", items: { type: "STRING" } },
    risk: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "id",
    "title",
    "description",
    "score",
    "confidence",
    "salary",
    "time",
    "difficulty",
    "effort",
    "timeline",
    "opportunity",
    "risk",
  ],
};

const PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    meta: {
      type: "OBJECT",
      properties: {
        confidenceScore: { type: "NUMBER" },
        uncertaintyNotice: { type: "STRING" },
        humanInTheLoop: { type: "STRING" },
      },
      required: ["confidenceScore", "uncertaintyNotice", "humanInTheLoop"],
    },
    futureTwins: { type: "ARRAY", items: TWIN_SCHEMA },
    tradeoffs: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          option: { type: "STRING" },
          salary: { type: "NUMBER" },
          risk: { type: "NUMBER" },
          freedom: { type: "NUMBER" },
          growth: { type: "NUMBER" },
        },
        required: ["option", "salary", "risk", "freedom", "growth"],
      },
    },
    roadmap: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          period: { type: "STRING" },
          title: { type: "STRING" },
          description: { type: "STRING" },
          actions: { type: "ARRAY", items: { type: "STRING" } },
          completed: { type: "BOOLEAN" },
        },
        required: ["period", "title", "description", "actions", "completed"],
      },
    },
    decision: {
      type: "OBJECT",
      properties: {
        recommendation: { type: "STRING" },
        confidence: { type: "NUMBER" },
        reasoning: { type: "ARRAY", items: { type: "STRING" } },
        alternatives: { type: "ARRAY", items: { type: "STRING" } },
        uncertaintyNotice: { type: "STRING" },
      },
      required: [
        "recommendation",
        "confidence",
        "reasoning",
        "alternatives",
        "uncertaintyNotice",
      ],
    },
    simulator: {
      type: "OBJECT",
      properties: {
        age: { type: "NUMBER" },
        budget: { type: "NUMBER" },
        experience: { type: "NUMBER" },
        riskTolerance: { type: "NUMBER" },
        confidence: { type: "NUMBER" },
        scenarios: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              score: { type: "NUMBER" },
            },
            required: ["name", "score"],
          },
        },
      },
      required: [
        "age",
        "budget",
        "experience",
        "riskTolerance",
        "confidence",
        "scenarios",
      ],
    },
  },
  required: [
    "meta",
    "futureTwins",
    "tradeoffs",
    "roadmap",
    "decision",
    "simulator",
  ],
};

// ---------------------------------------------------------------------
// 4. Defensive sanitization — guarantees the shape the frontend needs
//    no matter what Gemini (or the fallback) actually returned.
// ---------------------------------------------------------------------

const toArray = (value) =>
  Array.isArray(value) ? value : value ? [String(value)] : [];
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

function sanitizePlan(raw, profile) {
  const plan = raw && typeof raw === "object" ? raw : {};

  const futureTwins = (Array.isArray(plan.futureTwins) ? plan.futureTwins : [])
    .slice(0, 3)
    .map((t, idx) => ({
      id: toNumber(t?.id, idx + 1),
      title: t?.title || `Path ${idx + 1}`,
      description: t?.description || "",
      score: clamp(toNumber(t?.score, 70), 0, 100),
      confidence: clamp(toNumber(t?.confidence, 70), 0, 100),
      salary: t?.salary || "Not estimated",
      time: t?.time || "Not estimated",
      difficulty: t?.difficulty || "Medium",
      effort: t?.effort || t?.difficulty || "Medium",
      timeline: t?.timeline || "",
      opportunity: toArray(t?.opportunity),
      risk: toArray(t?.risk),
    }));

  const tradeoffs = (Array.isArray(plan.tradeoffs) ? plan.tradeoffs : []).map(
    (t) => ({
      option: t?.option || "Option",
      salary: clamp(toNumber(t?.salary, 50), 0, 100),
      risk: clamp(toNumber(t?.risk, 50), 0, 100),
      freedom: clamp(toNumber(t?.freedom, 50), 0, 100),
      growth: clamp(toNumber(t?.growth, 50), 0, 100),
    }),
  );

  const roadmap = (Array.isArray(plan.roadmap) ? plan.roadmap : []).map(
    (r) => ({
      period: r?.period || "",
      title: r?.title || "",
      description: r?.description || "",
      actions: toArray(r?.actions),
      completed: Boolean(r?.completed),
    }),
  );

  const decision = {
    recommendation:
      plan.decision?.recommendation || futureTwins[0]?.title || "",
    confidence: clamp(toNumber(plan.decision?.confidence, 70), 0, 100),
    reasoning: toArray(plan.decision?.reasoning),
    alternatives: toArray(plan.decision?.alternatives),
    uncertaintyNotice:
      plan.decision?.uncertaintyNotice ||
      "This is a probabilistic estimate based on the information provided, not a guarantee.",
  };

  const simulator = {
    age: toNumber(plan.simulator?.age, profile.age),
    budget: toNumber(plan.simulator?.budget, profile.budget),
    experience: clamp(toNumber(plan.simulator?.experience, 2), 0, 20),
    riskTolerance: clamp(
      toNumber(plan.simulator?.riskTolerance, profile.riskTolerance),
      0,
      100,
    ),
    confidence: clamp(toNumber(plan.simulator?.confidence, 70), 0, 100),
    scenarios: (Array.isArray(plan.simulator?.scenarios)
      ? plan.simulator.scenarios
      : []
    ).map((s) => ({
      name: s?.name || "Scenario",
      score: clamp(toNumber(s?.score, 70), 0, 100),
    })),
  };

  const meta = {
    confidenceScore: clamp(toNumber(plan.meta?.confidenceScore, 70), 0, 100),
    uncertaintyNotice:
      plan.meta?.uncertaintyNotice ||
      "These are AI-generated projections based on patterns, not certainties. Treat them as one input among several.",
    humanInTheLoop:
      plan.meta?.humanInTheLoop ||
      "You make the final call. This tool is here to support your decision, not to make it for you.",
  };

  return { meta, futureTwins, tradeoffs, roadmap, decision, simulator };
}

// ---------------------------------------------------------------------
// 5. Public API
// ---------------------------------------------------------------------

/**
 * Calls Gemini once with the combined master prompt and a strict
 * response schema, then sanitizes the result.
 */
async function generateLifePlan(profile) {
  const ai = getClient();
  const prompt = buildMasterPrompt(profile);

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: PLAN_SCHEMA,
          temperature: 0.4,
          maxOutputTokens: 4000,
        },
      });

      break; // succès
    } catch (err) {
      lastError = err;
      console.log(`[Gemini] Attempt ${attempt}/3 failed:`, err.message);
      const isTemporaryError =
        err.message?.includes("503") || err.message?.includes("UNAVAILABLE");
      if (isTemporaryError && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
        continue;
      }

      break;
    }
  }

  if (!response) {
    throw new GeminiServiceError(
      `Gemini request failed after 3 attempts: ${lastError?.message}`,
      "REQUEST_FAILED",
    );
  }

  const text = response?.text;
  if (!text) {
    throw new GeminiServiceError(
      "Gemini returned an empty response.",
      "EMPTY_RESPONSE",
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new GeminiServiceError(
      "Gemini response was not valid JSON.",
      "PARSE_FAILED",
    );
  }

  return sanitizePlan(parsed, profile);
}

/**
 * Deterministic, input-aware local generator used when Gemini is not
 * configured or fails. Not random — it scales with the user's actual
 * inputs so the demo still feels responsive to what was typed, while
 * being clearly labeled as a fallback (see meta.source in the controller).
 */
function buildFallbackPlan(profile) {
  const { name, goals, budget, riskTolerance } = profile;
  const riskFactor = clamp(riskTolerance, 0, 100) / 100;
  const boldScore = Math.round(65 + riskFactor * 25);
  const safeScore = Math.round(80 - riskFactor * 15);
  const hybridScore = Math.round((boldScore + safeScore) / 2);

  const goalLabel = goals?.trim() || "your goal";

  const futureTwins = [
    {
      id: 1,
      title: `${goalLabel} — Bold Path`,
      description: `A direct, fast-paced push toward "${goalLabel}", leaning on your stated budget and risk appetite.`,
      score: clamp(boldScore, 0, 100),
      confidence: 65,
      salary: budget > 10000 ? "$60k - $130k" : "$40k - $90k",
      time: "1-3 years",
      difficulty: "Hard",
      effort: "High",
      timeline:
        "Validate the idea in month 1-3, commit fully by month 6 if signals are positive.",
      opportunity: [
        "Fastest route to your stated goal",
        "Highest learning curve and skill growth",
      ],
      risk: [
        "Higher financial exposure",
        "Less predictable income in the short term",
      ],
    },
    {
      id: 2,
      title: `${goalLabel} — Steady Path`,
      description: `A lower-risk, incremental route toward "${goalLabel}" that protects your budget while you build evidence.`,
      score: clamp(safeScore, 0, 100),
      confidence: 70,
      salary: "$45k - $85k",
      time: "2-4 years",
      difficulty: "Medium",
      effort: "Medium",
      timeline:
        "Build foundational skills and a safety net over the first year before scaling up.",
      opportunity: ["Predictable progress", "Lower financial risk"],
      risk: ["Slower path to the end goal", "Possible opportunity cost"],
    },
    {
      id: 3,
      title: `${goalLabel} — Hybrid Path`,
      description: `Pursue "${goalLabel}" part-time alongside stable income, then re-evaluate.`,
      score: clamp(hybridScore, 0, 100),
      confidence: 68,
      salary: "$50k - $95k",
      time: "1.5-3 years",
      difficulty: "Medium",
      effort: "Medium-High",
      timeline:
        "Run both tracks in parallel for 6-12 months, then commit to whichever shows traction.",
      opportunity: [
        "Keeps options open",
        "Reduces single-point-of-failure risk",
      ],
      risk: [
        "Requires strong time management",
        "Slower momentum on either track alone",
      ],
    },
  ];

  const best = [...futureTwins].sort((a, b) => b.score - a.score)[0];

  return {
    meta: {
      confidenceScore: 55,
      uncertaintyNotice:
        "Gemini was unavailable, so this plan was generated locally with simplified rules. Treat it as a rough placeholder, not a researched recommendation.",
      humanInTheLoop:
        "You make the final call. This tool is here to support your decision, not to make it for you.",
    },
    futureTwins,
    tradeoffs: [
      {
        option: "Bold Path",
        salary: 70,
        risk: clamp(40 + riskFactor * 40, 0, 100),
        freedom: 90,
        growth: 90,
      },
      {
        option: "Steady Path",
        salary: 75,
        risk: clamp(60 - riskFactor * 30, 0, 100),
        freedom: 45,
        growth: 60,
      },
      { option: "Hybrid Path", salary: 72, risk: 50, freedom: 65, growth: 75 },
    ],
    roadmap: [
      {
        period: "Month 3",
        title: "Foundation",
        description: `Lay the groundwork for ${goalLabel}.`,
        actions: [
          "Clarify the specific outcome you want",
          "Identify the 1-2 biggest skill gaps",
          "Talk to 3 people already on this path",
        ],
        completed: false,
      },
      {
        period: "Month 6",
        title: "Validation",
        description: "Test your direction with real evidence.",
        actions: [
          "Ship a small, concrete proof of progress",
          "Collect honest feedback",
          "Reassess budget and timeline",
        ],
        completed: false,
      },
      {
        period: "Month 12",
        title: "Commitment",
        description: "Decide how far to lean in.",
        actions: [
          "Choose Bold, Steady or Hybrid based on results so far",
          "Set a 6-month milestone",
          "Build/strengthen your support network",
        ],
        completed: false,
      },
      {
        period: "Month 24",
        title: "Scale or Pivot",
        description: "Double down on what's working.",
        actions: [
          "Review what changed in your situation",
          "Scale the path that's working",
          "Pivot early if the evidence says so",
        ],
        completed: false,
      },
    ],
    decision: {
      recommendation: best.title,
      confidence: 55,
      reasoning: [
        `Best balance of score and risk for ${name || "this profile"} given the stated risk tolerance`,
        "Generated locally without live AI reasoning — confidence is intentionally capped",
      ],
      alternatives: futureTwins
        .filter((t) => t.id !== best.id)
        .map((t) => t.title),
      uncertaintyNotice:
        "This recommendation comes from a simplified local fallback, not a full AI analysis. Re-run it once the AI service is available.",
    },
    simulator: {
      age: profile.age,
      budget: profile.budget,
      experience: 2,
      riskTolerance: profile.riskTolerance,
      confidence: 60,
      scenarios: futureTwins.map((t) => ({ name: t.title, score: t.score })),
    },
  };
}

module.exports = {
  isConfigured,
  generateLifePlan,
  buildFallbackPlan,
  sanitizePlan,
  GeminiServiceError,
  // exported individually so they can be unit-tested / reused, per the brief
  buildFutureTwinPrompt,
  buildTradeoffPrompt,
  buildRoadmapPrompt,
  buildDecisionPrompt,
  buildSimulatorPrompt,
  buildMasterPrompt,
};
