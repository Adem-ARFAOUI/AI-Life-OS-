import { useState, useEffect } from "react";
import { ChevronDown, CheckCircle, Circle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import TimelineCard from "../components/TimelineCard";
import { useAIPlan } from "../context/AIPlanContext";
import {
  AILoadingState,
  AIFallbackBanner,
  AIConfidenceNotice,
} from "../components/AIStateNotice";

export default function Roadmap() {
  const { plan: ai, loading, error, isFallback, refresh } = useAIPlan();
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [completedItems, setCompletedItems] = useState({});

  // Reset local tracking whenever a new plan arrives (first load or
  // after a manual refresh), and open the first milestone by default.
  useEffect(() => {
    if (!ai?.roadmap?.length) return;
    setCompletedItems({});
    setExpandedMonth(ai.roadmap[0].period);
  }, [ai]);

  if (loading || !ai) {
    return (
      <MainLayout>
        <AILoadingState label='Building your roadmap...' />
      </MainLayout>
    );
  }

  const roadmapData = {};
  ai.roadmap.forEach((step, index) => {
    roadmapData[step.period] = {
      title: step.title,
      description: step.description,
      status:
        index === 0 ? "completed" : index === 1 ? "in-progress" : "planned",
      statusColor:
        index === 0
          ? "bg-green-600"
          : index === 1
            ? "bg-blue-600"
            : "bg-slate-600",
      items: step.actions,
    };
  });

  // Defensive accessor: never assumes completedItems[month] exists yet.
  const getMonthCompletion = (month, length) =>
    completedItems[month] || new Array(length).fill(false);

  const toggleItem = (month, index, length) => {
    setCompletedItems((prev) => {
      const monthItems = [...getMonthCompletion(month, length)];
      monthItems[index] = !monthItems[index];
      return { ...prev, [month]: monthItems };
    });
  };

  const getCompletionPercentage = () => {
    const allItems = ai.roadmap.flatMap((step) =>
      getMonthCompletion(step.period, step.actions.length),
    );
    if (!allItems.length) return 0;
    const completed = allItems.filter(Boolean).length;
    return Math.round((completed / allItems.length) * 100);
  };

  const getTotalMilestones = ai.roadmap.length;
  const completedMilestones = ai.roadmap.filter((step) =>
    getMonthCompletion(step.period, step.actions.length).every(Boolean),
  ).length;
  const inProgressMilestones = ai.roadmap.filter((step) => {
    const items = getMonthCompletion(step.period, step.actions.length);
    return items.some(Boolean) && !items.every(Boolean);
  }).length;

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          {/* Header */}
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              Action Roadmap
            </h1>
            <p className='text-slate-400'>
              Milestone-based plan for your selected future twin
            </p>
          </div>

          {isFallback && <AIFallbackBanner message={error} onRetry={refresh} />}
          <AIConfidenceNotice meta={ai.meta} />

          {/* Timeline Card */}
          <div className='bg-slate-900 rounded-xl p-8 border border-slate-800'>
            <TimelineCard roadmap={ai.roadmap} progress={ai.roadmapProgress} />
          </div>

          {/* Overall Progress */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Overall Progress
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-slate-300'>Completion</span>
                <span className='text-2xl font-bold text-blue-400'>
                  {getCompletionPercentage()}%
                </span>
              </div>
              <div className='w-full bg-slate-800 rounded-full h-3'>
                <div
                  className='bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300'
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Milestone Stats */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
              <h3 className='text-sm font-semibold text-slate-400 mb-2'>
                Total Milestones
              </h3>
              <div className='text-3xl font-bold text-white'>
                {getTotalMilestones}
              </div>
            </div>
            <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
              <h3 className='text-sm font-semibold text-slate-400 mb-2'>
                Completed
              </h3>
              <div className='text-3xl font-bold text-green-500'>
                {completedMilestones}
              </div>
            </div>
            <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
              <h3 className='text-sm font-semibold text-slate-400 mb-2'>
                In Progress
              </h3>
              <div className='text-3xl font-bold text-blue-500'>
                {inProgressMilestones}
              </div>
            </div>
          </div>

          {/* Detailed Roadmap */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-white'>
              Milestone Details
            </h3>

            {Object.entries(roadmapData).map(([month, milestone], stepIdx) => {
              const monthCompletion = getMonthCompletion(
                month,
                milestone.items.length,
              );
              return (
                <div
                  key={month}
                  className='bg-slate-900 rounded-xl border border-slate-800 overflow-hidden'
                >
                  <button
                    onClick={() =>
                      setExpandedMonth(expandedMonth === month ? null : month)
                    }
                    className='w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors'
                  >
                    <div className='flex items-center gap-4'>
                      <div
                        className={`${milestone.statusColor} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {stepIdx + 1}
                      </div>
                      <div className='text-left'>
                        <h4 className='text-lg font-semibold text-white'>
                          {month} - {milestone.title}
                        </h4>
                        <p className='text-sm text-slate-400'>
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`text-slate-400 transition-transform ${
                        expandedMonth === month ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedMonth === month && (
                    <div className='px-6 py-6 border-t border-slate-800 space-y-4'>
                      <div className='space-y-3'>
                        {milestone.items.map((item, idx) => (
                          <div
                            key={idx}
                            className='flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors'
                            onClick={() =>
                              toggleItem(month, idx, milestone.items.length)
                            }
                          >
                            {monthCompletion[idx] ? (
                              <CheckCircle
                                size={24}
                                className='text-green-500 flex-shrink-0 mt-0.5'
                              />
                            ) : (
                              <Circle
                                size={24}
                                className='text-slate-600 flex-shrink-0 mt-0.5'
                              />
                            )}
                            <span
                              className={`text-sm leading-relaxed ${
                                monthCompletion[idx]
                                  ? "text-slate-400 line-through"
                                  : "text-slate-300"
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className='pt-4 border-t border-slate-800'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-slate-400'>
                            {monthCompletion.filter(Boolean).length} of{" "}
                            {monthCompletion.length} items completed
                          </span>
                          <span className='text-blue-400 font-semibold'>
                            {Math.round(
                              (monthCompletion.filter(Boolean).length /
                                monthCompletion.length) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
