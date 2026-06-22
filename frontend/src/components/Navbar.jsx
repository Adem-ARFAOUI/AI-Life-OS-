import { Brain, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Map routes to page titles
  const routeTitles = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/future-twins": "Future Twins",
    "/trade-off": "Trade-Off Analysis",
    "/simulator": "What If Simulator",
    "/insight": "AI Insight",
    "/roadmap": "Action Roadmap",
    "/decision-zone": "Human Decision Zone",
    "/responsible-ai": "Responsible AI",
    "/settings": "Settings",
  };

  const currentPage = routeTitles[location.pathname] || "Dashboard";

  return (
    <nav className='h-16 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-between gap-3 px-4 sm:px-8 sticky top-0 z-30'>
      {/* Left: Mobile menu + Logo & Branding */}
      <div className='flex items-center gap-3 min-w-0'>
        <button
          onClick={onMenuClick}
          className='md:hidden text-slate-300 hover:text-white p-1 -ml-1'
          aria-label='Open menu'
        >
          <Menu size={24} />
        </button>
        <div className='hidden sm:flex w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center shrink-0'>
          <Brain size={24} className='text-white' />
        </div>
        <div className='hidden sm:flex flex-col min-w-0'>
          <span className='text-sm font-semibold text-white truncate'>
            AI Life OS
          </span>
          <span className='text-xs text-slate-400'>Second Brain</span>
        </div>
      </div>

      {/* Center: Current Page */}
      <div className='flex-1 min-w-0'>
        <h2 className='text-base sm:text-lg font-semibold text-white truncate'>
          {currentPage}
        </h2>
      </div>

      {/* Right: Status & User Profile */}
      <div className='flex items-center gap-2 sm:gap-4 shrink-0'>
        <div className='hidden md:flex items-center gap-2'>
          <span className='inline-flex h-2 w-2 rounded-full bg-green-500'></span>
          <span className='text-sm text-slate-300'>Second Brain Online</span>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity'
          title='Account settings'
        >
          <span className='text-white font-bold text-sm'>A</span>
        </button>
      </div>
    </nav>
  );
}
