import { Sliders, Scale, Lightbulb, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActionsCard() {
  const navigate = useNavigate();

  const actions = [
    { label: "Run Simulation", icon: Sliders, route: "/simulator" },
    { label: "Compare Twins", icon: Scale, route: "/trade-off" },
    { label: "View AI Insights", icon: Lightbulb, route: "/insight" },
    { label: "Decision Zone", icon: Users2, route: "/decision-zone" },
  ];

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <h3 className='text-lg font-semibold text-white mb-4'>Quick Actions</h3>
      <div className='grid grid-cols-2 gap-3'>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}
              className='flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all duration-200 text-center'
            >
              <Icon size={22} className='text-blue-400' />
              <span className='text-xs font-medium text-slate-200'>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
