import MainLayout from "../layouts/MainLayout";
import TradeOffCard from "../components/TradeOffCard";
import { useAIPlan } from "../context/AIPlanContext";
import {
  AILoadingState,
  AIFallbackBanner,
  AIConfidenceNotice,
} from "../components/AIStateNotice";

export default function TradeOff() {
  const { plan: ai, loading, error, isFallback, refresh } = useAIPlan();

  if (loading || !ai) {
    return (
      <MainLayout>
        <AILoadingState label='Weighing the trade-offs...' />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              Trade-Off Analysis
            </h1>
            <p className='text-slate-400'>
              Compare dimensions across your future twins
            </p>
          </div>

          {isFallback && <AIFallbackBanner message={error} onRetry={refresh} />}
          <AIConfidenceNotice meta={ai.meta} />

          <div className='bg-slate-900 rounded-xl p-8 border border-slate-800'>
            <TradeOffCard tradeoffs={ai.tradeoffs} />
          </div>

          {/* Detailed Comparison */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-semibold text-white'>
                Detailed Comparison
              </h3>
              <p className='text-sm text-slate-400'>
                Score: 0-40 (Poor) | 40-60 (Fair) | 60-80 (Good) | 80-100
                (Excellent)
              </p>
            </div>

            {/* Comparison Grid */}
            <div className='bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-slate-800'>
                    <th className='text-left px-6 py-4 text-slate-300'>Path</th>
                    <th className='text-center px-4 py-4 text-slate-300'>
                      Salary
                    </th>
                    <th className='text-center px-4 py-4 text-slate-300'>
                      Risk
                    </th>
                    <th className='text-center px-4 py-4 text-slate-300'>
                      Freedom
                    </th>
                    <th className='text-center px-4 py-4 text-slate-300'>
                      Growth
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ai.tradeoffs.map((item) => (
                    <tr key={item.option} className='border-b border-slate-800'>
                      <td className='px-6 py-4 text-white font-semibold'>
                        {item.option}
                      </td>

                      <td className='text-center text-green-400'>
                        {item.salary}
                      </td>

                      <td className='text-center text-red-400'>{item.risk}</td>

                      <td className='text-center text-blue-400'>
                        {item.freedom}
                      </td>

                      <td className='text-center text-amber-400'>
                        {item.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Decision Helper */}
          <div className='bg-blue-950/30 border border-blue-500/20 rounded-xl p-6'>
            <h3 className='text-lg font-semibold text-blue-300 mb-2'>
              💡 Choosing Your Path
            </h3>
            <p className='text-sm text-blue-200 mb-3'>
              There is no "best" path - only the one that aligns with your
              values. Ask yourself:
            </p>
            <ul className='text-sm text-blue-200 space-y-1'>
              <li>• What matters most to you: freedom or security?</li>
              <li>• Can you handle high stress for potential high reward?</li>
              <li>• Do you prefer innovation or stability?</li>
              <li>• How important is personal time and work-life balance?</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
