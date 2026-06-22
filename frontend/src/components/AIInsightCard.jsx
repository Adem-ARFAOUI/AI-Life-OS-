import { Lightbulb, AlertCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ICONS = {
  Strength: TrendingUp,
  Opportunity: Lightbulb,
  Warning: AlertCircle,
};
const ICON_COLORS = {
  Strength: "text-green-400",
  Opportunity: "text-blue-400",
  Warning: "text-amber-400",
};

/**
 * Compact mode: used on the Dashboard, once per real AI-generated
 * insight (one of decision.reasoning / bestFuture.opportunity /
 * bestFuture.risk). Falls back to the original static "Primary
 * Insight" content when rendered with no props at all (Insight.jsx
 * uses it this way as a standalone showcase card).
 */
export default function AIInsightCard({ title, description, confidence, type }) {
  const navigate = useNavigate();

  if (title || description) {
    const Icon = ICONS[type] || Lightbulb;
    const iconColor = ICON_COLORS[type] || "text-blue-400";
    return (
      <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4'>
        <div className='flex gap-3'>
          <Icon size={20} className={`${iconColor} flex-shrink-0 mt-0.5`} />
          <div className='flex-1'>
            <div className='flex items-center justify-between gap-2'>
              <p className='font-semibold text-slate-100 text-sm'>{title}</p>
              {Number.isFinite(confidence) && (
                <span className='text-xs text-slate-400 whitespace-nowrap'>
                  {confidence}% confidence
                </span>
              )}
            </div>
            <p className='text-sm text-slate-300 leading-relaxed mt-1'>
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default/standalone rich content (used by Insight.jsx with no props).
  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <h3 className='text-lg font-semibold text-white mb-6'>AI Insight</h3>

      {/* Primary Insight */}
      <div className='mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30'>
        <div className='flex gap-3'>
          <Lightbulb size={20} className='text-blue-400 flex-shrink-0 mt-1' />
          <div>
            <p className='font-semibold text-blue-200 mb-1'>Primary Insight</p>
            <p className='text-sm text-slate-200 leading-relaxed'>
              Your Future Twins, trade-offs, and roadmap on this page are
              generated from your declared profile. Update your profile or
              re-run a scenario in the Simulator to refresh these insights.
            </p>
          </div>
        </div>
      </div>

      {/* Key Observations */}
      <div className='mb-6'>
        <p className='text-sm font-semibold text-white mb-3'>
          Key Observations
        </p>
        <div className='space-y-2'>
          <div className='flex gap-3 items-start'>
            <AlertCircle
              size={16}
              className='text-amber-400 mt-1 flex-shrink-0'
            />
            <p className='text-sm text-slate-300'>
              Every recommendation here is a probabilistic estimate, not a
              certainty — see the Responsible AI page for details.
            </p>
          </div>
          <div className='flex gap-3 items-start'>
            <AlertCircle
              size={16}
              className='text-amber-400 mt-1 flex-shrink-0'
            />
            <p className='text-sm text-slate-300'>
              The Decision Zone walks you through reviewing, comparing and
              confirming a path with your own reasoning attached.
            </p>
          </div>
        </div>
      </div>

      <div className='mt-6 p-3 rounded-lg bg-slate-700/30 border border-slate-600'>
        <p className='text-xs text-slate-400 italic'>
          💡 This analysis is based entirely on user-declared data. External
          factors are not modeled.
        </p>
      </div>

      <button
        onClick={() => navigate("/insight")}
        className='mt-4 w-full px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors duration-200'
      >
        View Details
      </button>
    </div>
  );
}
