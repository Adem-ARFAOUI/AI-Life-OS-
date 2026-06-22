import ProgressBar from "./ProgressBar";

export default function LifeReadinessCard({ score = 0 }) {
  const breakdown = [
    { label: "Financial Readiness", value: 62 },
    { label: "Emotional Readiness", value: 74 },
    { label: "Network Readiness", value: 48 },
  ];

  const barColor = (value) => {
    if (value >= 65) return "green";
    if (value >= 45) return "amber";
    return "red";
  };

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-white'>
          Life Readiness Score
        </h3>
        <span className='text-3xl font-bold text-blue-400'>{score}%</span>
      </div>

      <div className='space-y-3'>
        {breakdown.map((b) => (
          <div key={b.label}>
            <div className='flex justify-between text-xs text-slate-400 mb-1'>
              <span>{b.label}</span>
              <span className='text-slate-300 font-semibold'>{b.value}%</span>
            </div>
            <ProgressBar
              value={b.value}
              max={100}
              color={barColor(b.value)}
              showLabel={false}
              size='sm'
            />
          </div>
        ))}
      </div>

      <p className='text-xs text-slate-500 mt-4 italic'>
        Network Readiness is your lowest dimension — consider finding a
        co-founder or mentor.
      </p>
    </div>
  );
}
