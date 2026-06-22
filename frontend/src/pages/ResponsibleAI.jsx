import { useState } from "react";
import { ChevronDown, CheckCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function ResponsibleAI() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("Bad recommendation");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    // In a real app, this would be sent to a backend for review.
    setFeedbackSubmitted(true);
    setShowFeedbackForm(false);
    setFeedbackText("");
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  const sections = [
    {
      title: "Privacy First",
      description: "Your data belongs to you",
      details: [
        "All personal data is encrypted at rest and in transit",
        "We never sell your data to third parties",
        "You can request export or deletion anytime",
        "GDPR compliant data handling",
        "No tracking or analytics beyond what you see",
      ],
    },
    {
      title: "Transparency & Explainability",
      description: "We show you how recommendations work",
      details: [
        "Every recommendation includes reasoning and confidence score",
        "You can expand any insight to see the underlying analysis",
        "Historical data sources are cited when used",
        "Confidence levels indicate reliability of predictions",
        "Open source components used where possible",
      ],
    },
    {
      title: "Human Agency",
      description: "AI assists, you decide",
      details: [
        "No decision is automatic or forced by AI",
        "You can always override or ignore recommendations",
        "Final decisions remain 100% in your control",
        "Option to get human advisor review (future feature)",
        "Ethical guidelines prevent harmful recommendations",
      ],
    },
    {
      title: "Bias Mitigation",
      description: "We work to reduce algorithmic bias",
      details: [
        "Multiple perspectives built into recommendation engine",
        "Regular audits for demographic and gender bias",
        "Diverse training data sources",
        "Feedback mechanism to identify and fix bias",
        "Open bias audit results published quarterly",
      ],
    },
  ];

  const responsibilities = [
    {
      area: "Data Security",
      status: "🟢 Verified",
      details: "End-to-end encryption",
    },
    {
      area: "Privacy Compliance",
      status: "🟢 Verified",
      details: "GDPR certified",
    },
    {
      area: "Explainability",
      status: "🟢 Verified",
      details: "All recommendations explained",
    },
    {
      area: "Bias Testing",
      status: "🟢 In Progress",
      details: "Quarterly audits",
    },
  ];

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              Responsible AI
            </h1>
            <p className='text-slate-400'>
              Transparency and principles behind your Second Brain
            </p>
          </div>

          {/* Responsibility Status */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {responsibilities.map((r, idx) => (
              <div
                key={idx}
                className='bg-slate-900 rounded-xl p-6 border border-slate-800'
              >
                <div className='flex justify-between items-start mb-2'>
                  <h4 className='text-lg font-semibold text-white'>{r.area}</h4>
                  <span className='text-lg'>{r.status}</span>
                </div>
                <p className='text-sm text-slate-400'>{r.details}</p>
              </div>
            ))}
          </div>

          {/* Detailed Sections */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-white'>
              Our Commitments in Detail
            </h3>

            {sections.map((section, idx) => (
              <div
                key={idx}
                className='bg-slate-900 rounded-xl border border-slate-800 overflow-hidden'
              >
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === idx ? null : idx)
                  }
                  className='w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors'
                >
                  <div className='text-left'>
                    <h4 className='text-lg font-semibold text-white'>
                      {section.title}
                    </h4>
                    <p className='text-sm text-slate-400'>
                      {section.description}
                    </p>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-slate-400 transition-transform flex-shrink-0 ${
                      expandedSection === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSection === idx && (
                  <div className='px-6 py-6 border-t border-slate-800'>
                    <ul className='space-y-3'>
                      {section.details.map((detail, i) => (
                        <li
                          key={i}
                          className='text-sm text-slate-300 flex gap-2'
                        >
                          <span className='text-blue-400 mt-0.5'>✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Core Philosophy */}
          <div className='bg-blue-950/30 border border-blue-500/30 rounded-xl p-8'>
            <h3 className='text-2xl font-bold text-blue-300 mb-4'>
              Our Core Philosophy
            </h3>
            <p className='text-blue-200 mb-4 leading-relaxed text-lg'>
              "AI should not decide your life for you. AI should help you make
              better decisions."
            </p>
            <p className='text-blue-200 leading-relaxed'>
              AI Life OS is built on the principle that technology should
              enhance human decision-making, not replace it. You remain in full
              control. Our AI is a trusted advisor, not an oracle. We're
              transparent about limitations, confident in our analysis, and
              committed to your autonomy.
            </p>
          </div>

          {/* How Recommendations Work */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              How Recommendations Are Made
            </h3>
            <div className='space-y-4'>
              <div className='flex gap-4'>
                <div className='text-2xl font-bold text-blue-400'>①</div>
                <div>
                  <h4 className='font-semibold text-white mb-1'>
                    Data Collection
                  </h4>
                  <p className='text-sm text-slate-400'>
                    You provide profile, constraints, and goals. No external
                    data used.
                  </p>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='text-2xl font-bold text-blue-400'>②</div>
                <div>
                  <h4 className='font-semibold text-white mb-1'>
                    Pattern Matching
                  </h4>
                  <p className='text-sm text-slate-400'>
                    We match your situation against historical career outcomes
                    and founder success patterns.
                  </p>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='text-2xl font-bold text-blue-400'>③</div>
                <div>
                  <h4 className='font-semibold text-white mb-1'>
                    Scenario Simulation
                  </h4>
                  <p className='text-sm text-slate-400'>
                    We simulate 3 different futures and calculate success
                    probabilities.
                  </p>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='text-2xl font-bold text-blue-400'>④</div>
                <div>
                  <h4 className='font-semibold text-white mb-1'>
                    Reasoning Generation
                  </h4>
                  <p className='text-sm text-slate-400'>
                    We explain why we recommend each path, what to watch for,
                    and what could change our recommendation.
                  </p>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='text-2xl font-bold text-blue-400'>⑤</div>
                <div>
                  <h4 className='font-semibold text-white mb-1'>
                    Your Decision
                  </h4>
                  <p className='text-sm text-slate-400'>
                    You review all analysis and make the final decision. AI
                    provides guidance, not commands.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Help Improve AI Life OS
            </h3>
            <p className='text-slate-300 mb-4'>
              Found a bias? Spotted a bad recommendation? Let us know. We use
              your feedback to continuously improve our AI.
            </p>

            {feedbackSubmitted && (
              <div className='mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm'>
                <CheckCircle size={18} />
                Thanks — your feedback has been recorded for review.
              </div>
            )}

            {!showFeedbackForm ? (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className='px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors'
              >
                Report Feedback
              </button>
            ) : (
              <div className='space-y-3 bg-slate-800/50 border border-slate-700 rounded-lg p-4'>
                <div>
                  <label className='text-xs text-slate-400 mb-1 block'>
                    Category
                  </label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none transition-colors'
                  >
                    <option>Bad recommendation</option>
                    <option>Possible bias</option>
                    <option>Confusing explanation</option>
                    <option>Privacy concern</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className='text-xs text-slate-400 mb-1 block'>
                    Details
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={3}
                    placeholder='Tell us what happened...'
                    className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-blue-500 outline-none transition-colors resize-none'
                  />
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setFeedbackText("");
                    }}
                    className='px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim()}
                    className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors'
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
