import React from 'react';
import { ActiveTab } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenHelp: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenHelp,
  onOpenProfile,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'summary', label: 'Summary', icon: 'dashboard' },
    { id: 'bus', label: 'Bus', icon: 'directions_bus' },
    { id: 'mrt', label: 'MRT', icon: 'train' },
    { id: 'weather', label: 'Weather', icon: 'cloud' },
    { id: 'community', label: 'Community', icon: 'forum' },
  ];

  return (
    <>
      {/* Desktop SideNavBar */}
      <nav
        id="desktop-sidebar"
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#222a3d] border-r border-[#334155] z-40 transition-all select-none"
      >
        {/* Header / Brand */}
        <div className="px-6 py-6 border-b border-[#334155]/60 flex items-center gap-3.5">
          <button
            onClick={onOpenProfile}
            className="relative group cursor-pointer focus:outline-none"
            title="View Commuter Profile"
          >
            <img
              src={USER_PROFILE.avatarUrl}
              alt="Commuter Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#a6c8ff] group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#34C759] border-2 border-[#222a3d] rounded-full"></span>
          </button>
          <div>
            <h1 className="text-[14px] font-semibold tracking-wide text-[#dae2fd] leading-tight">
              Commuter Portal
            </h1>
            <p className="text-[12px] text-[#c1c6d3] mt-0.5">
              Reliable. Efficient. Proactive.
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 flex flex-col gap-1.5 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-left font-medium text-[15px] cursor-pointer ${
                  isActive
                    ? 'bg-[#005baa] text-[#bbd4ff] font-semibold scale-95 shadow-sm'
                    : 'text-[#c1c6d3] hover:text-[#dae2fd] hover:bg-[#2d3449]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1, 'wght' 600" }
                      : { fontVariationSettings: "'FILL' 0, 'wght' 400" }
                  }
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#334155]/60 flex flex-col gap-1.5">
          <button
            id="nav-help-btn"
            onClick={onOpenHelp}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl hover:bg-[#2d3449] transition-all text-[#c1c6d3] hover:text-[#dae2fd] text-[14px] font-medium cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Help</span>
          </button>
          <button
            id="nav-logout-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl hover:bg-[#2d3449] transition-all text-[#c1c6d3] hover:text-[#dae2fd] text-[14px] font-medium cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Account</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 w-full bg-[#171f33] border-t border-[#334155] flex justify-around items-center py-2 px-2 z-50 shadow-2xl"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-[#a6c8ff] font-bold'
                  : 'text-[#c1c6d3] hover:text-[#dae2fd]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'bg-[#005baa]/30 px-3 py-0.5 rounded-full' : ''
                }`}
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1, 'wght' 600" }
                    : { fontVariationSettings: "'FILL' 0, 'wght' 400" }
                }
              >
                {item.icon}
              </span>
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
