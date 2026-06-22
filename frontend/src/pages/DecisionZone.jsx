import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAIPlan } from "../context/AIPlanContext";
import {
  AILoadingState,
  AIFallbackBanner,
  AIConfidenceNotice,
} from "../components/AIStateNotice";

export default function DecisionZone() {
  const { plan: ai, loading, error, isFallback, refresh } = useAIPlan();
  const navigate = useNavigate();
  const [stage, setStage] = useState("review"); // review, compare, decide, reflect, confirm
  const [selectedTwin, setSelectedTwin] = useState(null);
  const [reflection, setReflection] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (loading || !ai) {
    return (
      <MainLayout>
        <AILoadingState label='Preparing your decision briefing...' />
      </MainLayout>
    );
  }

  const chosenTwin = ai.futureTwins.find((t) => t.id === selectedTwin);
  const handleConfirmDecision = () => {
    localStorage.setItem("selectedTwin", selectedTwin);
    localStorage.setItem("decisionReflection", reflection);
    setConfirmed(true);
  };

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              Human Decision Zone
            </h1>
            <p className='text-slate-400'>
              Final decision framework with AI guidance
            </p>
          </div>

          {isFallback && <AIFallbackBanner message={error} onRetry={refresh} />}
          <AIConfidenceNotice meta={ai.meta} />

          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h2 className='text-xl font-bold text-green-400 mb-2'>
              AI Recommendation
            </h2>

            <p className='text-white text-lg'>{ai.decision.recommendation}</p>

            <p className='text-slate-400'>
              Confidence: {ai.decision.confidence}%
            </p>
            <p className='text-xs text-slate-500 mt-2'>
              {ai.decision.uncertaintyNotice}
            </p>
          </div>
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Why AI recommends this
            </h3>

            <ul className='space-y-2'>
              {ai.decision.reasoning.map((item, index) => (
                <li key={index} className='text-slate-300'>
                  ✓ {item}
                </li>
              ))}
            </ul>
          </div>
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Alternative Paths
            </h3>

            <ul className='space-y-2'>
              {ai.decision.alternatives.map((item, index) => (
                <li key={index} className='text-slate-300'>
                  → {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Decision Progress */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <div className='flex items-center gap-4'>
              {["review", "compare", "decide", "reflect", "confirm"].map(
                (s, idx) => (
                  <div key={s} className='flex items-center gap-4'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        stage === s
                          ? "bg-blue-600 text-white"
                          : [
                                "review",
                                "compare",
                                "decide",
                                "reflect",
                                "confirm",
                              ].indexOf(stage) > idx
                            ? "bg-green-600 text-white"
                            : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {[
                        "review",
                        "compare",
                        "decide",
                        "reflect",
                        "confirm",
                      ].indexOf(stage) > idx ? (
                        <CheckCircle size={20} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    {idx < 4 && (
                      <div
                        className={`h-1 w-8 ${
                          [
                            "review",
                            "compare",
                            "decide",
                            "reflect",
                            "confirm",
                          ].indexOf(stage) > idx
                            ? "bg-green-600"
                            : "bg-slate-700"
                        }`}
                      ></div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Decision Stages */}
          {stage === "review" && (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>
                Step 1: Review Your Options
              </h3>
              <p className='text-slate-300'>
                Review each future twin, their scores, and the detailed analysis
                above. Take time to absorb the information.
              </p>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {ai.futureTwins.map((twin) => (
                  <button
                    key={twin.id}
                    onClick={() => setSelectedTwin(twin.id)}
                    className={`text-left bg-slate-900 rounded-xl p-4 border transition-colors cursor-pointer ${
                      selectedTwin === twin.id
                        ? "border-blue-500 ring-1 ring-blue-500/40"
                        : "border-slate-800 hover:border-blue-500"
                    }`}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <h4 className='text-lg font-semibold text-white mb-2'>
                        {twin.title}
                      </h4>
                      {selectedTwin === twin.id && (
                        <CheckCircle
                          size={18}
                          className='text-blue-400 shrink-0 mt-0.5'
                        />
                      )}
                    </div>
                    <p className='text-xs text-slate-400 mb-3'>
                      Effort: {twin.effort}
                    </p>
                    <p className='text-xs text-blue-300'>{twin.timeline}</p>
                  </button>
                ))}
              </div>
              {selectedTwin && (
                <p className='text-xs text-slate-400'>
                  Pre-selected: {chosenTwin?.title}. You can change this in Step
                  3.
                </p>
              )}
              <button
                onClick={() => setStage("compare")}
                className='px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2'
              >
                Continue to Comparison <ArrowRight size={18} />
              </button>
            </div>
          )}

          {stage === "compare" && (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>
                Step 2: Compare Scenarios
              </h3>
              <p className='text-slate-300'>
                Select two futures to compare side by side, or review all three.
              </p>
              <div className='space-y-4'>
                {ai.futureTwins.map((twin) => (
                  <div
                    key={twin.id}
                    className='bg-slate-900 rounded-xl p-6 border border-slate-800'
                  >
                    <h4 className='text-lg font-semibold text-white mb-4'>
                      {twin.title}
                    </h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                      <div>
                        <h5 className='text-sm font-semibold text-green-400 mb-3'>
                          Advantages
                        </h5>
                        <ul className='space-y-2'>
                          {twin.opportunity.map((pro, idx) => (
                            <li
                              key={idx}
                              className='text-sm text-slate-300 flex gap-2'
                            >
                              <span className='text-green-400'>✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className='text-sm font-semibold text-red-400 mb-3'>
                          Challenges
                        </h5>
                        <ul className='space-y-2'>
                          {twin.risk.map((con, idx) => (
                            <li
                              key={idx}
                              className='text-sm text-slate-300 flex gap-2'
                            >
                              <span className='text-red-400'>✗</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => setStage("review")}
                  className='px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={() => setStage("decide")}
                  className='px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2'
                >
                  Continue to Decision <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {stage === "decide" && (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>
                Step 3: Make Your Decision
              </h3>
              <p className='text-slate-300'>
                Select the future twin that resonates most with your values,
                goals, and risk tolerance.
              </p>
              <div className='space-y-3'>
                {ai.futureTwins.map((twin) => (
                  <button
                    key={twin.id}
                    onClick={() => setSelectedTwin(twin.id)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                      selectedTwin === twin.id
                        ? "border-blue-500 bg-blue-950/20"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    }`}
                  >
                    <div className='flex items-start gap-4'>
                      <div
                        className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center ${
                          selectedTwin === twin.id
                            ? "border-blue-500 bg-blue-600"
                            : "border-slate-600"
                        }`}
                      >
                        {selectedTwin === twin.id && (
                          <CheckCircle size={16} className='text-white' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-lg font-semibold text-white'>
                          {twin.title}
                        </h4>
                        <p className='text-sm text-slate-400 mt-1'>
                          {twin.timeline}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => setStage("compare")}
                  className='px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={() => setStage("reflect")}
                  disabled={!selectedTwin}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedTwin
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Reflection <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {stage === "reflect" && (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>
                Step 4: Reflection & Reasoning
              </h3>
              <p className='text-slate-300'>
                Take a moment to reflect. Why does this path feel right to you?
              </p>
              <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
                <p className='text-lg font-semibold text-blue-300 mb-2'>
                  You've chosen: {chosenTwin?.title}
                </p>
                <p className='text-sm text-slate-400 mb-4'>
                  Write your thoughts on why this path aligns with your values:
                </p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder='What draws you to this decision? What excites or concerns you?'
                  className='w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-colors'
                  rows='5'
                />
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => setStage("decide")}
                  className='px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={() => setStage("confirm")}
                  className='px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2'
                >
                  Confirm Decision <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {stage === "confirm" && !confirmed && (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>
                Step 5: Confirmation
              </h3>
              <div className='bg-green-950/20 border border-green-500/20 rounded-xl p-6'>
                <h4 className='text-lg font-semibold text-green-300 mb-2'>
                  ✓ Ready to Commit
                </h4>
                <p className='text-sm text-green-200 mb-4'>
                  You've selected:{" "}
                  <span className='font-semibold'>{chosenTwin?.title}</span>
                </p>
                {reflection && (
                  <div className='bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700'>
                    <p className='text-xs text-slate-400 mb-1'>
                      Your Reasoning:
                    </p>
                    <p className='text-sm text-slate-200'>{reflection}</p>
                  </div>
                )}
                <p className='text-sm text-slate-300 mb-4'>
                  By confirming, you agree to pursue this path as your primary
                  scenario. You can always revisit and reconsider.
                </p>
                <button
                  onClick={handleConfirmDecision}
                  className='w-full px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center gap-2'
                >
                  <CheckCircle size={20} />
                  Confirm My Decision
                </button>
              </div>
            </div>
          )}

          {confirmed && (
            <div className='space-y-4'>
              <div className='bg-green-950/30 border border-green-500/30 rounded-xl p-8 text-center'>
                <CheckCircle
                  size={48}
                  className='text-green-400 mx-auto mb-4'
                />
                <h3 className='text-2xl font-bold text-green-300 mb-2'>
                  ✓ Decision Confirmed
                </h3>
                <p className='text-lg text-green-200 mb-4'>
                  {chosenTwin?.title}
                </p>
                <p className='text-sm text-slate-300 mb-6 max-w-2xl mx-auto'>
                  Your decision has been saved. Next step: Check your Action
                  Roadmap to begin executing on this path.
                </p>
                <div className='space-y-2'>
                  <button
                    onClick={() => navigate("/roadmap")}
                    className='w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors'
                  >
                    View Action Roadmap
                  </button>
                  <button
                    onClick={() => {
                      setStage("review");
                      setSelectedTwin(null);
                      setReflection("");
                      setConfirmed(false);
                    }}
                    className='w-full px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors'
                  >
                    Reconsider Decision
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Philosophy Note */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Remember: You Decide
            </h3>
            <p className='text-slate-300 leading-relaxed'>
              AI Life OS provides analysis, patterns, and frameworks. But the
              final decision is yours. Trust your intuition combined with data.
              This decision is not irreversible - you can pivot, adjust, and
              evolve your path as circumstances change. The goal is not perfect
              prediction, but informed decision-making that aligns with your
              values.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
