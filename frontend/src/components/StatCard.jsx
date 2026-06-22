import { useState } from "react";
import { Info, X } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  showInfo = false,
  info,
  onInfoClick,
}) {
  const [expanded, setExpanded] = useState(false);

  const colorClasses = {
    blue: "text-blue-400 border-blue-500/30 bg-blue-500/5",
    green: "text-green-400 border-green-500/30 bg-green-500/5",
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/5",
    red: "text-red-400 border-red-500/30 bg-red-500/5",
  };

  const handleInfoClick = () => {
    if (info) setExpanded((e) => !e);
    if (onInfoClick) onInfoClick();
  };

  return (
    <div
      className={`rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 hover:border-opacity-100 ${colorClasses[color]}`}
    >
      <div className='flex items-start justify-between mb-4'>
        <div>
          <p className='text-slate-400 text-sm font-medium'>{title}</p>
          {Icon && <Icon size={24} className='mt-2 opacity-60' />}
        </div>
        {showInfo && (
          <button
            onClick={handleInfoClick}
            className='p-1 hover:bg-white/10 rounded transition-colors'
            title={expanded ? "Hide info" : "More info"}
            aria-expanded={expanded}
          >
            {expanded ? (
              <X size={18} className='text-slate-300' />
            ) : (
              <Info size={18} className='text-slate-500 hover:text-slate-300' />
            )}
          </button>
        )}
      </div>

      <div>
        <p className='text-3xl font-bold text-white'>{value}</p>
        {subtitle && <p className='text-xs text-slate-400 mt-2'>{subtitle}</p>}
      </div>

      {expanded && info && (
        <p className='text-xs text-slate-300 mt-4 pt-3 border-t border-white/10 leading-relaxed'>
          {info}
        </p>
      )}
    </div>
  );
}
