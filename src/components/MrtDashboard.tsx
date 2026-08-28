import React, { useState } from 'react';
import {
  MRT_LINE_STATUSES,
  DHOBY_GHAUT_HOURLY_FORECAST,
  DHOBY_GHAUT_FULL_DAY_FORECAST,
} from '../data/mockData';
import { MrtLineStatus } from '../types';

export const MrtDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'4h' | 'today'>('4h');
  const [selectedStation, setSelectedStation] = useState<string | null>('Dhoby Ghaut Interchange (NS24 / NE6 / CC1)');
  const [lastRefreshed, setLastRefreshed] = useState<string>('08:14 AM');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lineStatuses, setLineStatuses] = useState<MrtLineStatus[]>(MRT_LINE_STATUSES);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const forecastData =
    timeRange === '4h' ? DHOBY_GHAUT_HOURLY_FORECAST : DHOBY_GHAUT_FULL_DAY_FORECAST;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastRefreshed(timeStr);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1326] text-[#dae2fd] p-4 md:p-8 max-w-[1440px] w-full mx-auto pb-24 md:pb-8">
      {/* Page Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#dae2fd] tracking-tight">
            MRT Network Status
          </h2>
          <div className="flex items-center gap-2 text-[#c1c6d3] text-[13px] mt-1">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
            <span>Live Updates</span>
            <span className="mx-1.5">•</span>
            <span>Last Refreshed:</span>
            <span className="font-mono font-semibold text-white">{lastRefreshed}</span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-[#171f33] hover:bg-[#222a3d] border border-[#334155] text-xs font-semibold px-3.5 py-2 rounded-lg text-[#dae2fd] transition-colors cursor-pointer"
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            refresh
          </span>
          <span>Refresh Feeds</span>
        </button>
      </header>

      {/* Peak Hour Proactive Advisory (Full Width) */}
      <div className="mb-6 bg-gradient-to-r from-[#1E293B] to-[#2d3449] border border-[#334155] rounded-xl p-5 md:p-6 flex items-start md:items-center gap-4 shadow-md">
        <div className="bg-[#FFCC00]/20 p-3 rounded-full shrink-0 text-[#FFCC00]">
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-[#dae2fd] mb-1">
            Peak Hour Advisory
          </h3>
          <p className="text-[14px] text-[#c1c6d3] leading-relaxed">
            High density expected at <strong className="text-white">Dhoby Ghaut Interchange</strong> until 09:30 AM.
            Consider alternative routes via <strong className="text-[#a6c8ff]">Downtown Line</strong> for travel towards Marina Bay to save approximately 12 minutes.
          </p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Network Crowd Density Map (Span 8) */}
        <div className="md:col-span-8 bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col h-[480px] overflow-hidden shadow-md">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
            <h3 className="text-[14px] font-bold text-[#dae2fd] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a6c8ff] text-[18px]">
                map
              </span>
              <span>Network Crowd Density Map</span>
            </h3>
            <div className="flex gap-1.5 text-[11px] font-medium">
              <span className="px-2 py-0.5 bg-[#0b1326] rounded text-[#34C759] border border-[#34C759]/30">
                Low
              </span>
              <span className="px-2 py-0.5 bg-[#0b1326] rounded text-[#FFCC00] border border-[#FFCC00]/30">
                Med
              </span>
              <span className="px-2 py-0.5 bg-[#0b1326] rounded text-[#FF3B30] border border-[#FF3B30]/30">
                High
              </span>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-[#060e20]">
            {/* SVG Synthetic Stylized MRT Network Map */}
            <svg
              viewBox="0 0 800 480"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <filter id="mrtGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="highCrowd" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#FF3B30" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="medCrowd" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFCC00" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#FFCC00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFCC00" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Singapore Coastline Outline */}
              <path
                d="M 50,220 Q 200,100 400,120 T 750,180 L 780,360 Q 600,440 400,420 T 60,340 Z"
                fill="#091428"
                stroke="#15243e"
                strokeWidth="1.5"
              />

              {/* North South Line (NSL) */}
              <path
                d="M 280,100 L 290,160 Q 320,240 400,270 T 440,360 L 460,420"
                fill="none"
                stroke="#D42E12"
                strokeWidth="4"
                filter="url(#mrtGlow)"
              />
              {/* East West Line (EWL) */}
              <path
                d="M 80,320 L 280,310 L 400,320 L 580,260 L 750,230"
                fill="none"
                stroke="#009530"
                strokeWidth="4"
                filter="url(#mrtGlow)"
              />
              {/* Circle Line (CCL) */}
              <path
                d="M 200,240 Q 320,180 400,270 T 560,320 Q 620,380 580,430 L 480,440"
                fill="none"
                stroke="#FF9A00"
                strokeWidth="4"
                filter="url(#mrtGlow)"
              />
              {/* Downtown Line (DTL) */}
              <path
                d="M 180,180 Q 320,240 460,310 T 580,380 L 520,430"
                fill="none"
                stroke="#005EC4"
                strokeWidth="4"
                filter="url(#mrtGlow)"
              />
              {/* North East Line (NEL) */}
              <path
                d="M 330,420 L 400,340 L 400,270 L 520,180 L 640,110"
                fill="none"
                stroke="#74007A"
                strokeWidth="4"
                filter="url(#mrtGlow)"
              />
              {/* Thomson-East Coast Line (TEL) */}
              <path
                d="M 360,80 L 370,220 L 430,340 L 620,360 L 720,320"
                fill="none"
                stroke="#733510"
                strokeWidth="4"
                filter="url(#mrtGlow)"
              />

              {/* Crowd Heatmap at Interchanges */}
              <circle cx="400" cy="270" r="55" fill="url(#highCrowd)" className="animate-pulse" />
              <circle cx="440" cy="360" r="40" fill="url(#highCrowd)" />
              <circle cx="520" cy="180" r="35" fill="url(#medCrowd)" />
              <circle cx="290" cy="160" r="30" fill="url(#medCrowd)" />

              {/* Station Markers */}
              {/* Dhoby Ghaut (NS24/NE6/CC1) */}
              <g
                transform="translate(400, 270)"
                className="cursor-pointer"
                onClick={() => setSelectedStation('Dhoby Ghaut Interchange (NS24 / NE6 / CC1)')}
              >
                <circle cx="0" cy="0" r="14" fill="#FF3B30" opacity="0.4" className="animate-ping" />
                <circle cx="0" cy="0" r="9" fill="#1E293B" stroke="#FF3B30" strokeWidth="3" />
                <rect x="12" y="-18" width="95" height="20" rx="3" fill="#171f33" stroke="#334155" />
                <text x="16" y="-4" fill="#dae2fd" fontSize="9" fontWeight="700">
                  Dhoby Ghaut NS24
                </text>
              </g>

              {/* Serangoon (NEL Delay) */}
              <g
                transform="translate(520, 180)"
                className="cursor-pointer"
                onClick={() => setSelectedStation('Serangoon Interchange (NE12 / CC13) - 5 min delay')}
              >
                <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#FFCC00" strokeWidth="2.5" />
                <rect x="12" y="-18" width="80" height="20" rx="3" fill="#171f33" stroke="#FFCC00" />
                <text x="16" y="-4" fill="#FFCC00" fontSize="9" fontWeight="700">
                  Serangoon NE12
                </text>
              </g>

              {/* Bishan (NS17) */}
              <g
                transform="translate(290, 160)"
                className="cursor-pointer"
                onClick={() => setSelectedStation('Bishan Station (NS17 / CC15)')}
              >
                <circle cx="0" cy="0" r="7" fill="#1E293B" stroke="#D42E12" strokeWidth="2.5" />
                <text x="-35" y="-10" fill="#dae2fd" fontSize="9" fontWeight="600">
                  Bishan NS17
                </text>
              </g>

              {/* Raffles Place */}
              <g
                transform="translate(440, 360)"
                className="cursor-pointer"
                onClick={() => setSelectedStation('Raffles Place (NS26 / EW14)')}
              >
                <circle cx="0" cy="0" r="8" fill="#1E293B" stroke="#009530" strokeWidth="2.5" />
                <text x="12" y="4" fill="#dae2fd" fontSize="9" fontWeight="600">
                  Raffles Place
                </text>
              </g>
            </svg>

            {/* Station Inspector Floating Pill */}
            {selectedStation && (
              <div className="absolute bottom-4 left-4 bg-[#1E293B]/95 backdrop-blur-md border border-[#334155] p-3 rounded-lg shadow-xl text-xs max-w-sm flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[#dae2fd]">{selectedStation}</div>
                  <div className="text-[#c1c6d3] text-[11px] mt-0.5">
                    Live crowd sensors: <span className="text-[#FF3B30] font-bold">85% Capacity</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="text-[#8c919d] hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Line Status Panel (Span 4) */}
        <div className="md:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col h-[480px] overflow-hidden shadow-md">
          <div className="p-4 border-b border-[#334155] bg-[#171f33]">
            <h3 className="text-[14px] font-bold text-[#dae2fd] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a6c8ff] text-[18px]">
                list
              </span>
              <span>Line Status</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {lineStatuses.map((line) => (
              <div
                key={line.code}
                className={`p-3 rounded-lg transition-colors flex items-center gap-3 cursor-pointer ${
                  line.status === 'Delays'
                    ? 'border border-[#FFCC00]/40 bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10'
                    : 'bg-[#0b1326] hover:bg-[#2d3449] border border-transparent'
                }`}
              >
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[11px] shrink-0 shadow-sm"
                  style={{ backgroundColor: line.color }}
                >
                  {line.code}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#dae2fd] truncate">
                    {line.name}
                  </div>
                  <div
                    className={`text-[12px] truncate ${
                      line.status === 'Delays' ? 'text-[#FFCC00]' : 'text-[#34C759]'
                    }`}
                  >
                    {line.detail}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      line.status === 'Delays'
                        ? 'bg-[#FFCC00]/20 text-[#FFCC00]'
                        : 'bg-[#34C759]/20 text-[#34C759]'
                    }`}
                  >
                    {line.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crowd Forecast Chart (Span 12) */}
        <div className="col-span-1 md:col-span-12 bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-[#dae2fd]">
                Crowd Forecast: Dhoby Ghaut Interchange
              </h3>
              <p className="text-[12px] text-[#c1c6d3]">
                Predictive commuter volumes based on historical turnstile taps
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-[#0b1326] border border-[#334155] text-[12px] text-[#dae2fd] rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="4h">Next 4 Hours</option>
                <option value="today">Today</option>
              </select>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="h-52 flex items-end gap-3 sm:gap-4 relative border-b border-[#334155] border-l pb-2 pl-8 pt-4">
            {/* Y-Axis Labels */}
            <div className="absolute left-1 top-2 text-[10px] font-mono text-[#8c919d]">
              High
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8c919d]">
              Med
            </div>
            <div className="absolute left-1 bottom-3 text-[10px] font-mono text-[#8c919d]">
              Low
            </div>

            {/* Grid Line Guides */}
            <div className="absolute inset-x-8 top-4 border-t border-[#334155]/40 pointer-events-none"></div>
            <div className="absolute inset-x-8 top-1/2 border-t border-[#334155]/40 pointer-events-none"></div>

            {/* Bars */}
            {forecastData.map((item, idx) => {
              const isPeak = item.densityPercent >= 75;
              const isMed = item.densityPercent >= 40 && item.densityPercent < 75;

              return (
                <div
                  key={item.time}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col justify-end items-center h-full relative group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  {hoveredBar === idx && (
                    <div className="absolute -top-10 bg-[#dae2fd] text-[#283044] text-[11px] font-bold px-2.5 py-1 rounded shadow-xl z-20 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                      {item.time} • {item.densityPercent}% ({item.label})
                    </div>
                  )}

                  {/* The Bar */}
                  <div
                    className={`w-full max-w-[54px] rounded-t transition-all duration-300 ${
                      isPeak
                        ? 'bg-[#D42E12] group-hover:bg-[#FF3B30]'
                        : isMed
                        ? 'bg-[#D42E12]/60 group-hover:bg-[#D42E12]/80'
                        : 'bg-[#222a3d] group-hover:bg-[#31394d]'
                    }`}
                    style={{ height: `${item.densityPercent}%` }}
                  ></div>

                  {/* Time Label */}
                  <div className="absolute -bottom-6 text-[11px] font-mono text-[#8c919d] text-center w-full">
                    {item.time}
                  </div>
                </div>
              );
            })}

            {/* Overlay Trend Line */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none pl-8 pb-2"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M 10,60 L 30,15 L 50,40 L 70,70 L 90,80"
                fill="none"
                stroke="#a6c8ff"
                strokeDasharray="4,4"
                strokeWidth="2"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
