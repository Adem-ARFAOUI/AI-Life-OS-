import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProgressBar from "../components/ProgressBar";
import { useAIPlan } from "../context/AIPlanContext";
import {
  AILoadingState,
  AIFallbackBanner,
  AIConfidenceNotice,
} from "../components/AIStateNotice";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const DEFAULT_VARIABLES = {
  budget: 5000,
  riskTolerance: 60,
  age: 22,
  experience: 2,
  confidence: 70,
};

export default function Simulator() {
  const { plan: ai, loading, error, isFallback, refresh } = useAIPlan();
  const [variables, setVariables] = useState(DEFAULT_VARIABLES);
  const [isRerunning, setIsRerunning] = useState(false);

  // Sync sliders to the AI's baseline whenever a (re)generated plan
  // arrives — including right after a real Gemini re-run below.
  useEffect(() => {
    if (!ai?.simulator) return;
    setVariables({
      budget: ai.simulator.budget,
      riskTolerance: ai.simulator.riskTolerance,
      age: ai.simulator.age,
      experience: ai.simulator.experience,
      confidence: ai.simulator.confidence,
    });
  }, [ai]);

  if (loading || !ai) {
    return (
      <MainLayout>
        <AILoadingState label='Running scenario simulations...' />
      </MainLayout>
    );
  }

  const handleSliderChange = (key, value) => {
    setVariables((prev) => ({ ...prev, [key]: parseInt(value, 10) }));
  };

  const resetSimulator = () => {
    setVariables({
      budget: ai.simulator.budget,
      riskTolerance: ai.simulator.riskTolerance,
      age: ai.simulator.age,
      experience: ai.simulator.experience,
      confidence: ai.simulator.confidence,
    });
  };

  // Instant, local "what-if" preview while dragging sliders — a real
  // Gemini call on every drag tick would be slow and would burn
  // through the free-tier quota fast. This is a lightweight heuristic
  // nudge around the AI's own baseline scores, clearly labeled below
  // as an estimate. Press "Re-run with AI" to get a real recalculation.
  const previewScenarios = ai.simulator.scenarios.map((s) => {
    const budgetDelta = (variables.budget - ai.simulator.budget) / 1000;
    const riskDelta = variables.riskTolerance - ai.simulator.riskTolerance;
    const expDelta = variables.experience - ai.simulator.experience;
    const confDelta = variables.confidence - ai.simulator.confidence;
    const nudge =
      budgetDelta * 0.05 + riskDelta * 0.15 + expDelta * 1.2 + confDelta * 0.1;
    return { ...s, score: clamp(Math.round(s.score + nudge), 0, 100) };
  });

  const bestScenario = [...previewScenarios].sort(
    (a, b) => b.score - a.score,
  )[0];

  const hasUnsyncedChanges =
    variables.budget !== ai.simulator.budget ||
    variables.riskTolerance !== ai.simulator.riskTolerance ||
    variables.age !== ai.simulator.age ||
    variables.experience !== ai.simulator.experience ||
    variables.confidence !== ai.simulator.confidence;

  const handleRerunWithAI = async () => {
    if (isRerunning) return;
    setIsRerunning(true);
    await refresh({
      age: variables.age,
      budget: variables.budget,
      riskTolerance: variables.riskTolerance,
    });
    setIsRerunning(false);
  };

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          <div className='flex flex-wrap justify-between items-start gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
                What If Simulator
              </h1>
              <p className='text-slate-400'>
                Test scenarios and see how they impact your futures
              </p>
            </div>
            <button
              onClick={resetSimulator}
              className='px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors'
            >
              Reset
            </button>
          </div>

          {isFallback && <AIFallbackBanner message={error} onRetry={refresh} />}
          <AIConfidenceNotice meta={ai.meta} />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Adjust Variables */}
            <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
              <h3 className='text-lg font-semibold text-white mb-6'>
                Adjust Variables
              </h3>
              <div className='space-y-5'>
                {/* Budget */}
                <div>
                  <label className='text-sm text-slate-400 mb-2 flex justify-between'>
                    <span>Initial Capital ($)</span>
                    <span className='text-blue-400 font-semibold'>
                      {variables.budget.toLocaleString()}
                    </span>
                  </label>
                  <input
                    type='range'
                    className='w-full'
                    min='0'
                    max='100000'
                    step='1000'
                    value={variables.budget}
                    onChange={(e) =>
                      handleSliderChange("budget", e.target.value)
                    }
                  />
                  <div className='flex justify-between text-xs text-slate-500 mt-1'>
                    <span>$0</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Risk Tolerance */}
                <div>
                  <label className='text-sm text-slate-400 mb-2 flex justify-between'>
                    <span>Risk Tolerance</span>
                    <span className='text-blue-400 font-semibold'>
                      {variables.riskTolerance}%
                    </span>
                  </label>
                  <input
                    type='range'
                    className='w-full'
                    min='0'
                    max='100'
                    value={variables.riskTolerance}
                    onChange={(e) =>
                      handleSliderChange("riskTolerance", e.target.value)
                    }
                  />
                  <div className='flex justify-between text-xs text-slate-500 mt-1'>
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className='text-sm text-slate-400 mb-2 flex justify-between'>
                    <span>Age</span>
                    <span className='text-blue-400 font-semibold'>
                      {variables.age} years
                    </span>
                  </label>
                  <input
                    type='range'
                    className='w-full'
                    min='18'
                    max='65'
                    value={variables.age}
                    onChange={(e) => handleSliderChange("age", e.target.value)}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className='text-sm text-slate-400 mb-2 flex justify-between'>
                    <span>Years of Experience</span>
                    <span className='text-blue-400 font-semibold'>
                      {variables.experience} years
                    </span>
                  </label>
                  <input
                    type='range'
                    className='w-full'
                    min='0'
                    max='20'
                    value={variables.experience}
                    onChange={(e) =>
                      handleSliderChange("experience", e.target.value)
                    }
                  />
                </div>

                {/* Confidence */}
                <div>
                  <label className='text-sm text-slate-400 mb-2 flex justify-between'>
                    <span>Self-Confidence</span>
                    <span className='text-blue-400 font-semibold'>
                      {variables.confidence}%
                    </span>
                  </label>
                  <input
                    type='range'
                    className='w-full'
                    min='0'
                    max='100'
                    step='5'
                    value={variables.confidence}
                    onChange={(e) =>
                      handleSliderChange("confidence", e.target.value)
                    }
                  />
                </div>

                <button
                  onClick={handleRerunWithAI}
                  disabled={isRerunning || !hasUnsyncedChanges}
                  className='w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2'
                >
                  <Sparkles
                    size={16}
                    className={isRerunning ? "animate-pulse" : ""}
                  />
                  {isRerunning
                    ? "Asking Gemini to re-think this..."
                    : "Re-run with AI"}
                </button>
              </div>
            </div>

            {/* Projected Impact */}
            <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
              <h3 className='text-lg font-semibold text-white mb-2'>
                Projected Impact
              </h3>
              <p className='text-xs text-slate-500 mb-6'>
                {hasUnsyncedChanges
                  ? "Live local estimate while you drag — press \"Re-run with AI\" for a full re-analysis."
                  : "These scores come directly from the AI's analysis of your current profile."}
              </p>
              <div className='space-y-6'>
                {previewScenarios.map((scenario) => (
                  <div key={scenario.name}>
                    <div className='flex justify-between items-center mb-3'>
                      <span className='text-slate-300'>{scenario.name}</span>

                      <span className='text-green-400 text-lg font-bold'>
                        {scenario.score}%
                      </span>
                    </div>

                    <ProgressBar
                      value={scenario.score}
                      max={100}
                      color='green'
                      animated
                    />
                  </div>
                ))}

                {/* Recommendation */}
                <div className='mt-8 p-4 rounded-lg bg-blue-950/30 border border-blue-500/20'>
                  <p className='text-sm text-blue-200'>
                    💡 Based on your variables,
                    <span className='font-semibold'>
                      {" "}
                      {bestScenario.name}
                    </span>{" "}
                    appears to be the best fit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
