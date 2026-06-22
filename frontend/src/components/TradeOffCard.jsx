import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const DIMENSIONS = [
  { key: "salary", label: "Salary" },
  { key: "risk", label: "Risk" },
  { key: "freedom", label: "Freedom" },
  { key: "growth", label: "Growth" },
];

const OPTION_COLORS = ["blue", "green", "amber", "red"];
const OPTION_TEXT_CLASS = {
  blue: "text-blue-400",
  green: "text-green-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

const getBarColor = (value) => {
  if (value >= 80) return "green";
  if (value >= 60) return "blue";
  if (value >= 40) return "amber";
  return "red";
};

/**
 * Renders one row per metric (Salary/Risk/Freedom/Growth), with one
 * bar per option in `tradeoffs`. Works for any number of options,
 * since Gemini may name and count them differently each time.
 */
export default function TradeOffCard({ tradeoffs = [] }) {
  const navigate = useNavigate();

  const best = [...tradeoffs].sort(
    (a, b) => b.salary + b.growth + b.freedom - b.risk - (a.salary + a.growth + a.freedom - a.risk),
  )[0];
  const safest = [...tradeoffs].sort((a, b) => a.risk - b.risk)[0];

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <h3 className='text-lg font-semibold text-white mb-6'>
        Trade-Off Analysis
      </h3>

      {tradeoffs.length === 0 ? (
        <p className='text-sm text-slate-400'>No trade-off data yet.</p>
      ) : (
        <div className='space-y-4'>
          {DIMENSIONS.map((dimension) => (
            <div key={dimension.key}>
              <p className='text-sm text-slate-300 mb-3 font-medium'>
                {dimension.label}
              </p>
              <div
                className='grid gap-2 sm:gap-4'
                style={{
                  gridTemplateColumns: `repeat(${tradeoffs.length}, minmax(0, 1fr))`,
                }}
              >
                {tradeoffs.map((item, idx) => {
                  const value = item[dimension.key] ?? 0;
                  return (
                    <div key={item.option}>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-xs text-slate-400 truncate'>
                          {item.option}
                        </span>
                        <span
                          className={`text-xs font-bold ${OPTION_TEXT_CLASS[OPTION_COLORS[idx % OPTION_COLORS.length]]}`}
                        >
                          {value}
                        </span>
                      </div>
                      <ProgressBar
                        value={value}
                        max={100}
                        color={getBarColor(value)}
                        showLabel={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {best && safest && (
        <div className='mt-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600 space-y-2'>
          <p className='text-sm text-slate-300'>
            <span className='font-semibold text-amber-400'>
              ⚠️ Key Trade-off:
            </span>{" "}
            {best.option} maximizes growth & freedom, but isn't the lowest
            risk.
          </p>
          <p className='text-sm text-slate-300'>
            <span className='font-semibold text-green-400'>
              ✓ Lowest Risk:
            </span>{" "}
            {safest.option} offers the most predictable path.
          </p>
        </div>
      )}

      <button
        onClick={() => navigate("/trade-off")}
        className='mt-4 w-full px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors duration-200'
      >
        View Full Analysis
      </button>
    </div>
  );
}
