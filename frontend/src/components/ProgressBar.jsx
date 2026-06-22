export default function ProgressBar({
  value = 0,
  max = 100,
  color = "blue",
  showLabel = true,
  animated = true,
  size = "md",
}) {
  const percentage = (value / max) * 100;

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
  };

  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className='w-full'>
      <div
        className={`w-full bg-slate-700 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500 ${
            animated ? "ease-out" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className='text-xs text-slate-400 mt-1'>{Math.round(percentage)}%</p>
      )}
    </div>
  );
}
