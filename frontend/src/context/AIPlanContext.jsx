import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { generateAIPlan } from "../services/aiEngine";
import { profile as defaultProfile } from "../data";

const STORAGE_KEY = "userProfile";

/**
 * Builds the { name, age, skills, goals, budget, riskTolerance }
 * payload the backend expects, from whatever profile data we have.
 * Looks in localStorage first (saved from CompleteProfile.jsx /
 * Profile.jsx), and falls back to the static demo profile so the app
 * is usable even before the user has filled anything in.
 */
function loadProfileInput() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        name: parsed.name || defaultProfile.name,
        age: parsed.age ?? 22,
        skills: parsed.skills || defaultProfile.skills,
        goals: parsed.goals || parsed.goal || defaultProfile.goal,
        budget: parsed.budget ?? 5000,
        riskTolerance: parsed.riskTolerance ?? 60,
      };
    }
  } catch {
    // ignore malformed cache, fall through to default
  }
  return {
    name: defaultProfile.name,
    age: 22,
    skills: defaultProfile.skills,
    goals: defaultProfile.goal,
    budget: 5000,
    riskTolerance: 60,
  };
}

const AIPlanContext = createContext(null);

export function AIPlanProvider({ children }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlan = useCallback(async (overrides) => {
    setLoading(true);
    setError(null);
    try {
      const baseProfile = loadProfileInput();
      const profileInput = { ...baseProfile, ...overrides };
      const result = await generateAIPlan(profileInput);
      setPlan(result);
      // generateAIPlan() never throws (it falls back internally), but
      // it does tell us when it had to fall back — surface that as a
      // soft error/notice rather than a hard failure.
      if (result?.meta?.error) {
        setError(result.meta.error);
      }
    } catch (err) {
      // Should not normally happen since generateAIPlan() catches its
      // own errors, but keep this as a last line of defense.
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      plan,
      loading,
      error,
      isFallback: plan?.meta?.source === "local-fallback",
      refresh: fetchPlan,
    }),
    [plan, loading, error, fetchPlan],
  );

  return <AIPlanContext.Provider value={value}>{children}</AIPlanContext.Provider>;
}

export function useAIPlan() {
  const ctx = useContext(AIPlanContext);
  if (!ctx) {
    throw new Error("useAIPlan() must be used inside <AIPlanProvider>.");
  }
  return ctx;
}
