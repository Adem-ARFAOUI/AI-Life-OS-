import { useAIPlan } from "../context/AIPlanContext";

export default function TestAI() {
  const { plan: ai, loading, error, isFallback } = useAIPlan();

  if (loading || !ai) {
    return (
      <div>
        <h1>AI Engine Test</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>AI Engine Test</h1>

      <p>Source: {ai.meta?.source} {isFallback && "(fallback)"}</p>
      {error && <p style={{ color: "orange" }}>Note: {error}</p>}

      <h2>{ai.bestFuture.title}</h2>

      <p>Score: {ai.bestFuture.score}</p>

      <p>Confidence: {ai.bestFuture.confidence}%</p>

      <p>Roadmap Progress: {ai.roadmapProgress}%</p>
    </div>
  );
}
