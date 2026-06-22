import { ChevronDown, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getStatusColor = (color) => {
  const colors = {
    green: "text-green-400 bg-green-500/10 border-green-500/30",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    slate: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  };
  return colors[color] || colors.slate;
};

/**
 * Driven by the real AI-generated roadmap instead of a hardcoded
 * "Month 3/6/12/24" list. `completed` (per step) drives the status
 * pill; the first incomplete step is treated as "In Progress".
 */
export default function TimelineCard({ roadmap = [], progress = 0 }) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(roadmap[0]?.period ?? null);

  // Re-open the first milestone whenever the roadmap itself changes
  // (e.g. after a "Recalculate" pulls a fresh plan).
  useEffect(() => {
    setExpandedId(roadmap[0]?.period ?? null);
  }, [roadmap]);

  const firstIncompleteIdx = roadmap.findIndex((step) => !step.completed);

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-white'>Action Roadmap</h3>
        <span className='text-xs text-slate-400'>{progress}% complete</span>
      </div>

      {roadmap.length === 0 ? (
        <p className='text-sm text-slate-400'>No roadmap yet.</p>
      ) : (
        <div className='space-y-3'>
          {roadmap.map((milestone, idx) => {
            const isExpanded = expandedId === milestone.period;
            const hasItems = (milestone.actions || []).length > 0;
            const status = milestone.completed
              ? "Completed"
              : idx === firstIncompleteIdx
                ? "In Progress"
                : "Upcoming";
            const statusColor = milestone.completed
              ? "green"
              : idx === firstIncompleteIdx
                ? "blue"
                : "slate";

            return (
              <div key={milestone.period}>
                <button
                  onClick={() =>
                    hasItems &&
                    setExpandedId(isExpanded ? null : milestone.period)
                  }
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    isExpanded
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                  }`}
                  disabled={!hasItems}
                >
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='text-left'>
                      <p className='font-semibold text-white'>
                        {milestone.period} · {milestone.title}
                      </p>
                      <p
                        className={`text-xs font-medium mt-1 border rounded-full px-2 py-1 inline-block ${getStatusColor(statusColor)}`}
                      >
                        {status}
                      </p>
                    </div>
                  </div>
                  {hasItems && (
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {isExpanded && hasItems && (
                  <div className='mt-2 ml-4 space-y-2 pb-2 border-l-2 border-blue-500/30 pl-4'>
                    {milestone.actions.map((item, idx2) => (
                      <div key={idx2} className='flex items-start gap-3'>
                        <CheckCircle
                          size={16}
                          className='text-green-500 mt-1 flex-shrink-0'
                        />
                        <p className='text-sm text-slate-300'>{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate("/roadmap")}
        className='mt-6 w-full px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors duration-200'
      >
        View Full Roadmap
      </button>
    </div>
  );
}
