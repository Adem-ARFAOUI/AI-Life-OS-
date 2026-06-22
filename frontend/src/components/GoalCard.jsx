import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

export default function GoalCard() {
  const navigate = useNavigate();

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 hover:border-slate-600 transition-all duration-200'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold text-white mb-2'>Primary Goal</h3>
        <p className='text-sm text-slate-300 leading-relaxed'>
          Launch an EdTech startup or secure a top consulting role within 12
          months.
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-slate-400'>Overall Progress</span>
            <span className='text-sm font-semibold text-white'>34%</span>
          </div>
          <ProgressBar value={34} max={100} color='blue' showLabel={false} />
        </div>

        <div className='pt-2 border-t border-slate-700'>
          <div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-slate-400'>
                Profile Completeness
              </span>
              <span className='text-sm font-semibold text-white'>60%</span>
            </div>
            <ProgressBar value={60} max={100} color='amber' showLabel={false} />
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/roadmap")}
        className='mt-6 w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200'
      >
        View Details
      </button>
    </div>
  );
}
