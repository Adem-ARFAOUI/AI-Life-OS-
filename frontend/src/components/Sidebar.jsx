import {
  LayoutDashboard,
  User,
  Zap,
  Scale,
  Sliders,
  Lightbulb,
  MapPin,
  Users2,
  Bot,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile = () => {},
  collapsed = false,
  onToggleCollapsed = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current route from hash-based routing
  const currentRoute = location.pathname;

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      id: "dashboard",
      route: "/dashboard",
    },
    { icon: User, label: "Profile", id: "profile", route: "/profile" },
    {
      icon: Zap,
      label: "Future Twins",
      id: "future-twins",
      route: "/future-twins",
    },
    {
      icon: Scale,
      label: "Trade-Off Analysis",
      id: "trade-off",
      route: "/trade-off",
    },
    {
      icon: Sliders,
      label: "What If Simulator",
      id: "simulator",
      route: "/simulator",
    },
    { icon: Lightbulb, label: "AI Insight", id: "insight", route: "/insight" },
    { icon: MapPin, label: "Roadmap", id: "roadmap", route: "/roadmap" },
    {
      icon: Users2,
      label: "Human Decision Zone",
      id: "decision-zone",
      route: "/decision-zone",
    },
    {
      icon: Bot,
      label: "Responsible AI",
      id: "responsible-ai",
      route: "/responsible-ai",
    },
  ];

  const handleNavClick = (route) => {
    navigate(route);
    onCloseMobile();
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/60 md:hidden'
          onClick={onCloseMobile}
          aria-hidden='true'
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 transition-all duration-300
          ${collapsed ? "w-20" : "w-56"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className='px-4 py-6 border-b border-slate-800 flex items-center justify-between gap-2'>
          <div
            className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden'
            onClick={() => handleNavClick("/dashboard")}
          >
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0'>
              <Brain size={24} className='text-white' />
            </div>
            {!collapsed && (
              <div className='whitespace-nowrap'>
                <p className='text-sm font-bold text-white'>AI Life OS</p>
                <p className='text-xs text-slate-500'>Second Brain</p>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className='md:hidden text-slate-400 hover:text-white p-1'
            aria-label='Close menu'
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className='flex-1 px-3 py-6 space-y-1 overflow-y-auto'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.route)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon size={20} className='shrink-0' />
                {!collapsed && (
                  <span className='text-sm font-medium whitespace-nowrap'>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings + Collapse - Bottom */}
        <div className='border-t border-slate-800 px-3 py-4 space-y-2'>
          <button
            onClick={handleSettingsClick}
            title={collapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            } ${
              currentRoute === "/settings"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Settings size={20} className='shrink-0' />
            {!collapsed && <span className='text-sm font-medium'>Settings</span>}
          </button>

          {/* Desktop-only collapse toggle */}
          <button
            onClick={onToggleCollapsed}
            className={`hidden md:flex w-full items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-200 ${
              collapsed ? "justify-center" : "justify-start"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className='text-xs font-medium'>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
