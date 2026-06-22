import API from "./api";

export const generateFuture = async () => {
  const response = await API.get("/ai/future");

  return response.data;
};

/**
 * Calls the Gemini-powered backend endpoint.
 * POST /api/generate-plan
 * body: { name, age, skills, goals, budget, riskTolerance }
 * Returns: { success, source: "gemini"|"local-fallback", input, data }
 */
export const generatePlan = async (profileInput) => {
  const response = await API.post("/generate-plan", profileInput);
  return response.data;
};
