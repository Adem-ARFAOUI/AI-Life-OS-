import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import AIInsightCard from "../components/AIInsightCard";

export default function Insight() {
  const [expandedInsight, setExpandedInsight] = useState(0);

  const insights = [
    {
      title: "Leverage Effect Detected",
      description: "Your €10,000 capital combined with startup founder skills",
      confidence: "94%",
      reasoning:
        "Analysis of your management education + ML skills + access to European startup ecosystem suggests high founder premium. With co-founder, could unlock €2-5M funding.",
      opportunities: [
        "Access to accelerators (Y Combinator EU, Entrepreneur First)",
        "Strong appeal to European VCs (€10K validates commitment)",
        "Management+Tech founder combo is highly sought after",
      ],
      warnings: [
        "No co-founder identified - critical for funding rounds",
        "Student loan deadline creates time pressure (18 months)",
        "Geographic constraint (Europe-only) may limit some opportunities",
      ],
    },
    {
      title: "Twin A Maximizes Growth + Innovation",
      description: "Full-time startup path shows highest upside",
      confidence: "91%",
      reasoning:
        "Combining your risk tolerance (50th percentile in our analysis, but increasing with confidence boost), educational background, and available time creates optimal conditions for startup success.",
      opportunities: [
        "Founder role multiplies earnings potential (0% to 5-10x within 5 years)",
        "Build network in startup ecosystem (highest long-term value)",
        "Learning curve accelerated in founder vs. employee role",
      ],
      warnings: [
        "Income uncertainty - loan repayment risk if runway fails",
        "Stress levels will be 70-80% higher than Twin B",
        "Success dependent on finding strong co-founder",
      ],
    },
    {
      title: "Risk Mitigation: Hybrid Path Strong",
      description: "Twin C balances security with upside",
      confidence: "88%",
      reasoning:
        "Consulting role (€3-5K/month) covers loan repayment while startup grows. Gives 24-month window to validate before full commitment, reducing binary success/failure risk.",
      opportunities: [
        "Low financial risk (salary covers constraints)",
        "Time to validate product before full commitment",
        "Can pivot to full startup after 12-18 months with validation",
      ],
      warnings: [
        "Splitting attention may slow both ventures",
        "Market window may close if startup succeeds quickly elsewhere",
        "Managing two jobs requires exceptional time management",
      ],
    },
  ];

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>AI Insights</h1>
            <p className='text-slate-400'>
              Deep analysis and recommendations from your Second Brain
            </p>
          </div>

          <div className='bg-slate-900 rounded-xl p-8 border border-slate-800'>
            <AIInsightCard />
          </div>

          {/* Detailed Insights */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-white'>
              Detailed Recommendations
            </h3>

            {insights.map((insight, idx) => (
              <div
                key={idx}
                className='bg-slate-900 rounded-xl border border-slate-800 overflow-hidden'
              >
                <button
                  onClick={() =>
                    setExpandedInsight(expandedInsight === idx ? null : idx)
                  }
                  className='w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors'
                >
                  <div className='flex items-center gap-4 flex-1 text-left'>
                    <div className='w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0'>
                      <span className='text-lg font-bold text-blue-400'>
                        {idx + 1}
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-lg font-semibold text-white'>
                        {insight.title}
                      </h4>
                      <p className='text-sm text-slate-400'>
                        {insight.description}
                      </p>
                    </div>
                    <div className='px-3 py-1 rounded-full bg-green-900/30 text-green-300 text-xs font-semibold'>
                      {insight.confidence}
                    </div>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-slate-400 transition-transform ml-4 flex-shrink-0 ${
                      expandedInsight === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedInsight === idx && (
                  <div className='px-6 py-6 border-t border-slate-800 space-y-6'>
                    {/* Reasoning */}
                    <div>
                      <h5 className='text-sm font-semibold text-blue-400 mb-2'>
                        🧠 AI Reasoning
                      </h5>
                      <p className='text-sm text-slate-300 leading-relaxed'>
                        {insight.reasoning}
                      </p>
                    </div>

                    {/* Opportunities */}
                    <div>
                      <h5 className='text-sm font-semibold text-green-400 mb-3'>
                        ✓ Opportunities
                      </h5>
                      <ul className='space-y-2'>
                        {insight.opportunities.map((opp, i) => (
                          <li
                            key={i}
                            className='text-sm text-slate-300 flex gap-2'
                          >
                            <span className='text-green-400 mt-0.5'>→</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Warnings */}
                    <div>
                      <h5 className='text-sm font-semibold text-amber-400 mb-3'>
                        ⚠ Warnings
                      </h5>
                      <ul className='space-y-2'>
                        {insight.warnings.map((warn, i) => (
                          <li
                            key={i}
                            className='text-sm text-slate-300 flex gap-2'
                          >
                            <span className='text-amber-400 mt-0.5'>!</span>
                            <span>{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Analysis Summary
            </h3>
            <p className='text-slate-300 leading-relaxed'>
              Based on your profile, constraints, and future scenarios, AI Life
              OS has generated comprehensive insights. These recommendations are
              built on pattern matching, scenario analysis, and strategic
              thinking frameworks. Remember: these are data-informed
              suggestions, not predictions. Your final decision should
              incorporate your values, intuition, and risk tolerance.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
