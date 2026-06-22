import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TIPS = [
  "Apply to at least one incubator this week to keep your startup timeline on track.",
  "Block 2 focused hours tomorrow to outline your MVP's core user flow.",
  "Reach out to one person in your network about a potential co-founder match.",
  "Revisit your budget in the Simulator — a small capital change shifts your best path.",
  "Write down what's making Twin A feel risky. Naming it is the first step to managing it.",
];

export default function DailyRecommendationCard() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const handleRefresh = () => {
    setIndex((i) => (i + 1) % TIPS.length);
  };

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
          <Sparkles size={18} className='text-amber-400' />
          Daily Recommendation
        </h3>
        <button
          onClick={handleRefresh}
          className='p-1.5 rounded hover:bg-white/10 transition-colors'
          title='Get another tip'
        >
          <RefreshCw size={16} className='text-slate-400 hover:text-slate-200' />
        </button>
      </div>
      <p className='text-sm text-slate-200 leading-relaxed flex-1'>
        {TIPS[index]}
      </p>
      <button
        onClick={() => navigate("/insight")}
        className='mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium self-start'
      >
        View full insight →
      </button>
    </div>
  );
}
