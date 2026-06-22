import { useState, useEffect } from "react";
import { Brain, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAIPlan } from "../context/AIPlanContext";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import ProfileCard from "../components/ProfileCard";
import GoalCard from "../components/GoalCard";
import FutureTwinCard from "../components/FutureTwinCard";
import TradeOffCard from "../components/TradeOffCard";
import TimelineCard from "../components/TimelineCard";
import AIInsightCard from "../components/AIInsightCard";
import HumanDecisionCard from "../components/HumanDecisionCard";
import Badge from "../components/Badge";
import QuickActionsCard from "../components/QuickActionsCard";
import AIStatusCard from "../components/AIStatusCard";
import LifeReadinessCard from "../components/LifeReadinessCard";
import DailyRecommendationCard from "../components/DailyRecommendationCard";
import {
  AILoadingState,
  AIFallbackBanner,
  AIConfidenceNotice,
} from "../components/AIStateNotice";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Dashboard() {
  const navigate = useNavigate();
  const { plan: ai, loading, error, isFallback, refresh } = useAIPlan();

  const [stats, setStats] = useState({
    goalProbability: 0,
    aiConfidence: 0,
    resilience: 7,
  });
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("just now");

  // Sync local display stats whenever a (re)generated plan comes in.
  useEffect(() => {
    if (!ai?.bestFuture) return;
    setStats({
      goalProbability: ai.bestFuture.score,
      aiConfidence: ai.bestFuture.confidence,
      resilience: clamp(ai.bestFuture.confidence / 10, 5, 10),
    });
  }, [ai]);

  if (loading || !ai) {
    return (
      <MainLayout>
        <AILoadingState label='Reasoning about your futures...' />
      </MainLayout>
    );
  }

  const riskLabel =
    stats.resilience >= 7.5
      ? "Low"
      : stats.resilience >= 5.5
        ? "Moderate"
        : "High";

  const readinessScore = Math.round(
    stats.goalProbability * 0.4 +
      stats.aiConfidence * 0.35 +
      stats.resilience * 10 * 0.25,
  );

  // "Recalculate" now triggers a real Gemini call instead of faking a
  // jitter on the numbers — Input -> AI Reasoning -> Output, on demand.
  const handleRecalculate = async () => {
    if (isRecalculating) return;
    setIsRecalculating(true);
    await refresh();
    setLastUpdated("just now");
    setIsRecalculating(false);
  };

  const statusBadges = [
    { label: "User Profile", variant: "success", route: "/profile" },
    { label: "Future Twins", variant: "warning", route: "/future-twins" },
    { label: "Trade-Offs", variant: "warning", route: "/trade-off" },
    { label: "Roadmap", variant: "success", route: "/roadmap" },
    { label: "Human Decision", variant: "error", route: "/decision-zone" },
  ];

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 space-y-8 max-w-7xl mx-auto'>
        {/* Header with Status */}
        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              Good morning
            </h1>
            <p className='text-green-400'>
              Best Future : {ai.bestFuture.title}
            </p>

            <p className='text-green-400'>Score : {ai.bestFuture.score}</p>

            <p className='text-green-400'>
              Confidence : {ai.bestFuture.confidence}
            </p>
            <p className='text-slate-400'>
              Your Second Brain is ready · Last updated {lastUpdated}
            </p>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className='px-4 py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-medium hover:bg-green-600/30 disabled:opacity-60 transition-colors flex items-center gap-2 self-start'
          >
            <RefreshCw
              size={16}
              className={isRecalculating ? "animate-spin" : ""}
            />
            {isRecalculating ? "Recalculating..." : "🟢 Recalculate"}
          </button>
        </div>

        {/* AI transparency: confidence + uncertainty + fallback notice */}
        {isFallback && (
          <AIFallbackBanner message={error} onRetry={refresh} />
        )}
        <AIConfidenceNotice meta={ai.meta} />

        {/* Status Tabs/Badges - interactive shortcuts */}
        <div className='flex flex-wrap gap-2 items-center'>
          {statusBadges.map((b) => (
            <button
              key={b.label}
              onClick={() => navigate(b.route)}
              className='hover:opacity-80 transition-opacity'
            >
              <Badge label={b.label} variant={b.variant} size='sm' />
            </button>
          ))}
        </div>

        {/* Top Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatCard
            title='Goal Achievement Probability'
            value={`${stats.goalProbability}%`}
            subtitle='Based on your best-fit Future Twin'
            icon={TrendingUp}
            color='green'
            showInfo={true}
            info='Calculated from your selected Future Twin and historical patterns for similar profiles, weighted by your budget, risk tolerance, and time commitment from the What-If Simulator.'
          />
          <StatCard
            title='AI Confidence Score'
            value={`${stats.aiConfidence}%`}
            subtitle='High data quality'
            icon={Brain}
            color='blue'
            showInfo={true}
            info='Reflects how complete and consistent your profile data is. Adding more profile details or running more Simulator scenarios increases this score.'
          />
          <StatCard
            title='Overall Detected Risk'
            value={riskLabel}
            subtitle={`Resilience index: ${stats.resilience.toFixed(1)}/10`}
            icon={Zap}
            color='amber'
            showInfo={true}
            info='Based on financial runway, stress exposure, and constraint analysis across your three Future Twins. A higher resilience index means more buffer against setbacks.'
          />
        </div>

        {/* Quick Actions & AI Status */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <QuickActionsCard />
          <AIStatusCard lastSync={lastUpdated} isProcessing={isRecalculating} />
        </div>

        {/* Life Readiness & Daily Recommendation */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <LifeReadinessCard score={readinessScore} />
          <DailyRecommendationCard />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Profile & Goal */}
          <div className='lg:col-span-1 space-y-6'>
            <ProfileCard {...ai.profile} />
            <GoalCard goal={ai.profile.goal} />
          </div>

          {/* Center & Right - Future Twins & Analysis */}
          <div className='lg:col-span-2 space-y-6'>
            <FutureTwinCard
              title={ai.bestFuture.title}
              confidence={ai.bestFuture.confidence}
              score={ai.bestFuture.score}
              risk={ai.bestFuture.risk}
              description={ai.bestFuture.description}
            />
            <TradeOffCard tradeoffs={ai.tradeoffs} />
          </div>
        </div>

        {/* Timeline & Insights */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <TimelineCard roadmap={ai.roadmap} progress={ai.roadmapProgress} />
          <div className='space-y-4'>
            {[...ai.strengths, ...ai.opportunities, ...ai.warnings].map(
              (item) => (
                <AIInsightCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  confidence={item.confidence}
                  type={item.type}
                />
              ),
            )}
          </div>
        </div>

        {/* Human Decision Zone - Full Width */}
        <HumanDecisionCard />

        {/* Footer Spacing */}
        <div className='py-4' />
      </div>
    </MainLayout>
  );
}
