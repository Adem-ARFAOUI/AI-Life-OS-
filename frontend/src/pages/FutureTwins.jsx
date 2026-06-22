import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAIPlan } from "../context/AIPlanContext";
import MainLayout from "../layouts/MainLayout";
import FutureTwinCard from "../components/FutureTwinCard";
import {
  AILoadingState,
  AIFallbackBanner,
  AIConfidenceNotice,
} from "../components/AIStateNotice";

export default function FutureTwins() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan: ai, loading, error, isFallback, refresh } = useAIPlan();
  // If we arrived here via an "Explore X" shortcut, open that twin immediately.
  const [expandedTwin, setExpandedTwin] = useState(
    location.state?.expandTwin ?? null,
  );
  const [selectedTwin, setSelectedTwin] = useState(null);

  if (loading || !ai) {
    return (
      <MainLayout>
        <AILoadingState label='Generating your Future Twins...' />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          {/* Header */}
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              Your Future Twins
            </h1>
            <p className='text-slate-400'>
              Explore and compare your simulated futures
            </p>
          </div>

          {isFallback && <AIFallbackBanner message={error} onRetry={refresh} />}
          <AIConfidenceNotice meta={ai.meta} />

          {/* Future Twins Comparison */}
          <div className='bg-slate-900 rounded-xl p-8 border border-slate-800'>
            <FutureTwinCard twins={ai.futureTwins} />
          </div>

          {/* Detailed Views */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-white'>Twin Details</h3>

            {ai.futureTwins.map((twin) => (
              <div
                key={twin.id}
                className='bg-slate-900 rounded-xl border border-slate-800 overflow-hidden'
              >
                <button
                  onClick={() =>
                    setExpandedTwin(expandedTwin === twin.id ? null : twin.id)
                  }
                  className='w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center'>
                      <span className='text-xl font-bold text-blue-400'>
                        Twin {twin.id}
                      </span>
                    </div>
                    <div className='text-left'>
                      <h4 className='text-lg font-semibold text-white'>
                        {twin.title}
                      </h4>
                      <p className='text-sm text-slate-400'>
                        {twin.description}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-slate-400 transition-transform ${
                      expandedTwin === twin.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedTwin === twin.id && (
                  <div className='px-6 py-6 border-t border-slate-800 space-y-6'>
                    {/* Confidence & Score */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-slate-400 mb-1'>
                          Future Fit Score
                        </p>
                        <div className='text-3xl font-bold text-blue-400'>
                          {twin.score}%
                        </div>
                      </div>
                      <div>
                        <p className='text-sm text-slate-400 mb-1'>
                          AI Confidence
                        </p>
                        <div className='text-3xl font-bold text-green-400'>
                          {twin.confidence}
                        </div>
                      </div>
                    </div>

                    {/* Opportunities */}
                    <div>
                      <h5 className='text-sm font-semibold text-green-400 mb-3'>
                        ✓ Opportunities
                      </h5>
                      <ul className='space-y-2'>
                        {twin.opportunity.map((opp, idx) => (
                          <li
                            key={idx}
                            className='text-sm text-slate-300 flex gap-2'
                          >
                            <span className='text-green-400 mt-0.5'>→</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div>
                      <h5 className='text-sm font-semibold text-amber-400 mb-3'>
                        ⚠ Risks
                      </h5>
                      <ul className='space-y-2'>
                        {twin.risk.map((risk, idx) => (
                          <li
                            key={idx}
                            className='text-sm text-slate-300 flex gap-2'
                          >
                            <span className='text-amber-400 mt-0.5'>!</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h5 className='text-sm font-semibold text-blue-400 mb-3'>
                        📅 Suggested Timeline
                      </h5>
                      <p className='text-sm text-slate-300'>{twin.timeline}</p>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-3 pt-4 border-t border-slate-800'>
                      <button
                        onClick={() => {
                          setSelectedTwin(twin.id);
                          localStorage.setItem("selectedTwin", twin.id);
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedTwin === twin.id
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {selectedTwin === twin.id
                          ? "✓ Selected"
                          : "Select Twin"}
                      </button>
                      <button
                        onClick={() =>
                          navigate("/trade-off", {
                            state: { focusTwin: twin.id },
                          })
                        }
                        className='flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors'
                      >
                        Compare
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Summary */}
          {selectedTwin && (
            <div className='bg-blue-950/30 border border-blue-500/20 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-blue-300 mb-2'>
                ✓ Twin {selectedTwin} Selected
              </h3>

              <p className='text-sm text-blue-200'>
                This future twin is now your preferred scenario for roadmap
                planning.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
