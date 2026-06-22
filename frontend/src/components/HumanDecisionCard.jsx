import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HumanDecisionCard() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState("");
  const decisions = [
    {
      id: "A",
      title: "Twin A",
      subtitle: "Full Startup Immersion",
      score: 86,
      advantages: [
        "Immediate MVP deployment acceleration",
        "Reduced financial anxiety",
      ],
      disadvantages: [
        "Increased business management responsibility",
        "Operational burnout risk",
      ],
    },
    {
      id: "B",
      title: "Twin B",
      subtitle: "The Secure Track",
      score: 70,
      advantages: ["Elite salary", "High-profile corporate network"],
      disadvantages: ["Delayed startup execution", "Reduced long-term freedom"],
    },
    {
      id: "C",
      title: "Twin C",
      subtitle: "The Hybrid Approach",
      score: 75,
      advantages: ["Maximum safety net", "Zero urgent execution pressure"],
      disadvantages: ["Stable short-term, capped long-term upside"],
    },
  ];

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <h3 className='text-lg font-semibold text-white mb-6'>
        Human Decision Zone
      </h3>

      {/* Systemic Recommendation */}
      <div className='mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30'>
        <div className='flex gap-3'>
          <AlertCircle
            size={20}
            className='text-amber-400 flex-shrink-0 mt-1'
          />
          <div>
            <p className='font-semibold text-amber-200 mb-2'>
              Systemic Recommendation
            </p>
            <p className='text-sm text-slate-200 leading-relaxed'>
              Leverage Effect Detected: The €10,000 injection eliminates the
              critical loan bottleneck. Twin A (Startup) now climbs to the
              recommended option. However, Twin C remains available if you lean
              towards total risk aversion.
            </p>
            <p className='text-xs text-slate-400 italic mt-2'>
              The final decision remains entirely yours.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Options */}
      <div className='space-y-4 mb-6'>
        {decisions.map((option) => (
          <div
            key={option.id}
            className='p-4 rounded-lg border border-slate-600 bg-slate-700/20 hover:border-slate-500 transition-all'
          >
            <div className='flex items-start justify-between mb-3'>
              <div>
                <p className='font-semibold text-white'>{option.title}</p>
                <p className='text-sm text-slate-400 mt-1'>{option.subtitle}</p>
              </div>
              <div className='text-right'>
                <p className='text-3xl font-bold text-blue-400'>
                  {option.score}%
                </p>
                <p className='text-xs text-slate-400'>Future Fit</p>
              </div>
            </div>

            {/* Advantages */}
            <div className='mb-3'>
              <p className='text-xs font-semibold text-green-300 mb-2'>
                ✓ Key Advantages
              </p>
              <ul className='space-y-1'>
                {option.advantages.map((adv, idx) => (
                  <li key={idx} className='text-sm text-slate-300 flex gap-2'>
                    <CheckCircle
                      size={14}
                      className='text-green-500 flex-shrink-0 mt-0.5'
                    />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disadvantages */}
            <div>
              <p className='text-xs font-semibold text-red-300 mb-2'>
                ⚠️ Detected Risks
              </p>
              <ul className='space-y-1'>
                {option.disadvantages.map((dis, idx) => (
                  <li key={idx} className='text-sm text-slate-300 flex gap-2'>
                    <AlertCircle
                      size={14}
                      className='text-red-500 flex-shrink-0 mt-0.5'
                    />
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Reflection Section */}
      <div className='p-4 rounded-lg bg-blue-500/10 border border-blue-500/30'>
        <p className='text-sm font-semibold text-blue-200 mb-3'>
          Your Reflection
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder='Record your thoughts before committing. AI will not influence this.'
          className='w-full h-24 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 p-3 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors'
        />
        <p className='text-xs text-slate-400 mt-2'>Private · Never shared</p>
      </div>

      <button
        onClick={() => navigate("/decision-zone")}
        className='mt-4 w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2'
      >
        Open Human Decision Zone
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
