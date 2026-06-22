import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  // Mobile off-canvas drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop collapse (icon-only) state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='flex h-screen bg-slate-950 text-white overflow-hidden'>
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden min-w-0'>
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
