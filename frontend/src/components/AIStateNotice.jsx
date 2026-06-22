import { Loader2, AlertTriangle } from "lucide-react";

/**
 * Full-page loading state shown while the Gemini-powered plan is
 * being generated for the first time in this session.
 */
export function AILoadingState({ label = "Generating your AI plan..." }) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 py-24 text-slate-400'>
      <Loader2 size={32} className='animate-spin text-blue-400' />
      <p className='text-sm'>{label}</p>
    </div>
  );
}

/**
 * Small banner shown when we had to fall back to local mock data
 * (Gemini unavailable / backend unreachable). Never blocks the page —
 * the rest of the UI still renders with the fallback plan.
 */
export function AIFallbackBanner({ message, onRetry }) {
  return (
    <div className='flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm'>
      <AlertTriangle size={18} className='flex-shrink-0' />
      <span className='flex-1'>
        {message ||
          "Showing offline demo data — the AI service could not be reached."}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          className='px-3 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 text-xs font-medium transition-colors'
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Honest, non-alarming uncertainty/confidence strip — used to satisfy
 * the "never present AI output as absolute truth" requirement.
 */
export function AIConfidenceNotice({ meta }) {
  if (!meta) return null;
  return (
    <div className='px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex flex-wrap items-center gap-2'>
      <span className='font-semibold'>
        AI confidence: {meta.confidenceScore ?? "—"}%
      </span>
      <span className='text-blue-300/70'>·</span>
      <span>{meta.uncertaintyNotice}</span>
    </div>
  );
}
