import { useNavigate } from "react-router-dom";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";

/**
 * Dual-mode card, now driven by real AI data instead of hardcoded
 * twins:
 *  - `twins` (array) -> grid of all Future Twins (used on the
 *    FutureTwins page).
 *  - individual props (title/score/confidence/risk/description) ->
 *    a single highlighted "best future" card (used on the Dashboard).
 */
export default function FutureTwinCard({
  twins,
  title,
  score,
  confidence,
  risk,
  description,
}) {
  const navigate = useNavigate();

  const handleExplore = (twinId) => {
    // Jump to the Future Twins page with the chosen twin pre-expanded.
    navigate("/future-twins", { state: { expandTwin: twinId } });
  };

  if (Array.isArray(twins) && twins.length) {
    const bestId = [...twins].sort((a, b) => b.score - a.score)[0].id;
    return (
      <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
        <h3 className='text-lg font-semibold text-white mb-6'>Future Twins</h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {twins.map((twin) => {
            const recommended = twin.id === bestId;
            return (
              <div
                key={twin.id}
                className={`rounded-lg border p-4 transition-all duration-200 ${
                  recommended
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                }`}
              >
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <p className='text-xl font-bold text-white'>
                      {twin.title}
                    </p>
                    <p className='text-xs text-slate-400 mt-1 line-clamp-2'>
                      {twin.description}
                    </p>
                  </div>
                  <Badge
                    label={recommended ? "Recommended" : twin.difficulty}
                    variant={recommended ? "primary" : "neutral"}
                    size='sm'
                  />
                </div>

                <div className='my-4'>
                  <ProgressBar
                    value={twin.score}
                    max={100}
                    color='blue'
                    showLabel={false}
                  />
                  <p className='text-sm text-slate-300 mt-2 font-semibold'>
                    Future Fit Score: {twin.score}%
                  </p>
                </div>

                <button
                  onClick={() => handleExplore(twin.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    recommended
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }`}
                >
                  Explore {twin.title.split(" ")[0]}
                </button>
              </div>
            );
          })}
        </div>

        <div className='mt-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600'>
          <p className='text-sm text-slate-300'>
            <span className='font-semibold text-blue-300'>💡 Insight:</span>{" "}
            {twins.find((t) => t.id === bestId)?.title} currently offers the
            best fit for your profile — but this is a probabilistic estimate,
            not a guarantee.
          </p>
        </div>
      </div>
    );
  }

  // Single "best future" highlight mode (Dashboard).
  const riskItems = Array.isArray(risk) ? risk : risk ? [risk] : [];
  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <div className='flex items-start justify-between mb-3'>
        <div>
          <h3 className='text-lg font-semibold text-white'>
            Best Future: {title}
          </h3>
          {description && (
            <p className='text-sm text-slate-400 mt-1'>{description}</p>
          )}
        </div>
        <Badge label='Recommended' variant='primary' size='sm' />
      </div>

      <div className='grid grid-cols-2 gap-4 my-4'>
        <div>
          <p className='text-xs text-slate-400 mb-1'>Future Fit Score</p>
          <ProgressBar value={score ?? 0} max={100} color='blue' />
        </div>
        <div>
          <p className='text-xs text-slate-400 mb-1'>AI Confidence</p>
          <ProgressBar value={confidence ?? 0} max={100} color='green' />
        </div>
      </div>

      {riskItems.length > 0 && (
        <div className='mb-4'>
          <p className='text-xs font-semibold text-amber-400 mb-2'>
            ⚠ Things to watch
          </p>
          <ul className='space-y-1'>
            {riskItems.slice(0, 2).map((r, idx) => (
              <li key={idx} className='text-xs text-slate-300'>
                • {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate("/future-twins")}
        className='w-full py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200'
      >
        Explore All Future Twins
      </button>
    </div>
  );
}
