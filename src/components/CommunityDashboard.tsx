import React, { useState } from 'react';
import { DisqusComments } from './DisqusComments';

export const CommunityDashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const topics = [
    { id: 'all', label: 'All Discussions', icon: 'forum', count: '48+' },
    { id: 'mrt-alerts', label: 'MRT & LRT Alerts', icon: 'train', count: '19' },
    { id: 'bus-crowds', label: 'Bus Intervals', icon: 'directions_bus', count: '14' },
    { id: 'weather-updates', label: 'Rain & Wet Weather', icon: 'thunderstorm', count: '8' },
    { id: 'hacks', label: 'Commute Hacks & Tips', icon: 'tips_and_updates', count: '12' },
  ];

  const quickTips = [
    {
      title: 'Circle Line Stage 6 Updates',
      desc: 'Keppel, Cantonment, and Prince Edward Road stations nearing completion. Share your interchange route hacks!',
      tag: 'MRT News',
    },
    {
      title: 'Rain Shelter Linkway Map',
      desc: 'Got a hidden shortcut to Shenton Way or Raffles Place without stepping into the rain? Post it below!',
      tag: 'Weather Hack',
    },
    {
      title: 'SimplyGo Fare Card Tap Strategy',
      desc: 'Which station gantries have the best responsiveness during peak 8:30 AM rush hour?',
      tag: 'Pro Tip',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1326] text-[#dae2fd] p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#171f33] border border-[#334155] rounded-2xl p-6 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#a6c8ff] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse"></span>
            Live Commuter Community Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#dae2fd] tracking-tight">
            Singapore Transit Discussions & Feedback
          </h1>
          <p className="text-sm text-[#c1c6d3] mt-1 max-w-2xl">
            Real-time peer-to-peer transit updates, ground reports, and daily commuter discussions powered by Disqus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#222a3d] border border-[#334155] rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs text-[#c1c6d3]">Active Topics</div>
            <div className="text-lg font-bold text-[#a6c8ff]">5 Categories</div>
          </div>
          <div className="bg-[#222a3d] border border-[#334155] rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs text-[#c1c6d3]">Disqus Forum</div>
            <div className="text-lg font-bold text-[#34c759]">Online</div>
          </div>
        </div>
      </div>

      {/* Topics Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedTopic === t.id
                ? 'bg-[#005baa] text-white shadow-md border border-[#3b82f6]'
                : 'bg-[#171f33] text-[#c1c6d3] border border-[#334155] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedTopic === t.id ? 'bg-white/20 text-white' : 'bg-[#222a3d] text-[#a6c8ff]'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Community Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickTips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-[#171f33] border border-[#334155] hover:border-[#a6c8ff]/50 rounded-xl p-4 transition-all hover:bg-[#1a233a] flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#005baa]/20 text-[#a6c8ff] border border-[#005baa]/40">
                  {tip.tag}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#c1c6d3] group-hover:text-[#a6c8ff] transition-colors">
                  chat_bubble_outline
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#dae2fd] group-hover:text-white mb-1">
                {tip.title}
              </h4>
              <p className="text-xs text-[#c1c6d3] leading-relaxed">
                {tip.desc}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-[11px] text-[#a6c8ff]">
              <span>Join conversation below</span>
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Disqus Integration */}
      <div className="mt-2">
        <DisqusComments
          article={{
            id: `sg-commuter-${selectedTopic}`,
            title: `SG Commuter - ${topics.find((t) => t.id === selectedTopic)?.label || 'Community'}`,
          }}
          shortname="day-2-project-1"
          language="zh_TW"
        />
      </div>
    </div>
  );
};
