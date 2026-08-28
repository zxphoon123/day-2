import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SummaryDashboard } from './components/SummaryDashboard';
import { BusTaxiDashboard } from './components/BusTaxiDashboard';
import { MrtDashboard } from './components/MrtDashboard';
import { WeatherDashboard } from './components/WeatherDashboard';
import { UserModal } from './components/UserModal';
import { HelpModal } from './components/HelpModal';
import { ActiveTab } from './types';
import { USER_PROFILE } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col md:flex-row antialiased selection:bg-[#005baa] selection:text-white">
      {/* Mobile Top Header */}
      <div className="md:hidden flex justify-between items-center w-full px-4 py-3 bg-[#171f33] border-b border-[#334155] sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#005baa] flex items-center justify-center text-white font-bold text-xs">
            SG
          </div>
          <div>
            <span className="text-[15px] font-bold text-[#dae2fd] tracking-tight">
              Commuter Portal
            </span>
            <div className="text-[10px] text-[#c1c6d3]">Reliable • Efficient</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 text-[#c1c6d3] hover:text-white rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
          </button>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="cursor-pointer focus:outline-none"
          >
            <img
              src={USER_PROFILE.avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#a6c8ff]"
            />
          </button>
        </div>
      </div>

      {/* Persistent Left Sidebar (Desktop) + Bottom Nav (Mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen bg-[#0b1326] overflow-x-hidden">
        {activeTab === 'summary' && (
          <SummaryDashboard
            onNavigateToBus={() => setActiveTab('bus')}
            onNavigateToMrt={() => setActiveTab('mrt')}
            onNavigateToWeather={() => setActiveTab('weather')}
          />
        )}

        {activeTab === 'bus' && <BusTaxiDashboard />}

        {activeTab === 'mrt' && <MrtDashboard />}

        {activeTab === 'weather' && <WeatherDashboard />}
      </main>

      {/* Modals */}
      <UserModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
