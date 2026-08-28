import React, { useState } from 'react';
import { HOURLY_WEATHER } from '../data/mockData';

export const WeatherDashboard: React.FC = () => {
  const [showRadarModal, setShowRadarModal] = useState<boolean>(false);
  const [activeHour, setActiveHour] = useState<string>('08:00');
  const [radarStep, setRadarStep] = useState<number>(3);

  // Gauge calculations for 100 max circumference (2 * pi * 45 = ~283)
  const circumference = 283;
  // PSI 42/100 -> offset = 283 - (42/100)*283 = ~164
  const psiOffset = 283 - (42 / 100) * 283;
  // UV 6/12 -> offset = 283 - (6/12)*283 = ~141
  const uvOffset = 283 - (6 / 12) * 283;

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1326] text-[#dae2fd] p-4 md:p-8 max-w-[1440px] w-full mx-auto pb-24 md:pb-8">
      {/* Page Header */}
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#dae2fd] tracking-tight">
            Environment Outlook
          </h2>
          <p className="text-[15px] text-[#c1c6d3] mt-1">
            Real-time conditions across Singapore
          </p>
        </div>
        <div className="text-right">
          <span className="text-[12px] text-[#8c919d]">Last updated</span>
          <p className="text-[14px] font-bold font-mono text-[#dae2fd]">07:42 AM, SGT</p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Proactive Commuter Impact (Span 12) */}
        <section className="col-span-1 md:col-span-12 bg-[#1E293B] border border-[#334155] rounded-xl p-5 md:p-6 flex items-start md:items-center gap-4 shadow-md">
          <div className="bg-[#FFCC00]/20 p-3 rounded-full text-[#FFCC00] shrink-0">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              rainy
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#dae2fd] mb-1">
              Commuter Impact
            </h3>
            <p className="text-[14px] text-[#c1c6d3] leading-relaxed">
              Heavy rain expected in Central area. Wet roads: Expect{' '}
              <strong className="text-white">+10 min for Taxi</strong> travel times.{' '}
              <strong className="text-[#a6c8ff]">MRT platforms</strong> may be crowded.
            </p>
          </div>
        </section>

        {/* Current Conditions Hero (Span 8) */}
        <section className="col-span-1 md:col-span-8 bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-md">
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#a6c8ff]">
                Current Conditions
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <h1 className="text-[72px] font-extrabold font-mono text-[#dae2fd] leading-none">
                  28°
                </h1>
                <span className="text-[28px] font-bold text-[#8c919d]">C</span>
              </div>
              <p className="text-[22px] font-semibold text-[#dae2fd] mt-2">
                Scattered Thunderstorms
              </p>
              <div className="mt-2 text-xs text-[#c1c6d3] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
                <span>Active monsoon surge alert in effect</span>
              </div>
            </div>

            <div className="text-[#a6c8ff] opacity-80 shrink-0">
              <span
                className="material-symbols-outlined text-[90px] md:text-[110px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                thunderstorm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 z-10 border-t border-[#334155] pt-4">
            <div>
              <span className="text-[12px] text-[#8c919d] block mb-1">Humidity</span>
              <span className="text-[18px] font-bold font-mono text-[#dae2fd]">84%</span>
            </div>
            <div>
              <span className="text-[12px] text-[#8c919d] block mb-1">Wind</span>
              <span className="text-[18px] font-bold font-mono text-[#dae2fd]">12 km/h NE</span>
            </div>
            <div>
              <span className="text-[12px] text-[#8c919d] block mb-1">Feels Like</span>
              <span className="text-[18px] font-bold font-mono text-[#dae2fd]">32°</span>
            </div>
          </div>
        </section>

        {/* Environment Indices Panel (Span 4) */}
        <section className="col-span-1 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
          {/* PSI Index Gauge */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col items-center justify-center relative shadow-md">
            <h3 className="text-[13px] font-bold text-[#c1c6d3] self-start mb-2">
              PSI Index
            </h3>
            <div className="relative w-32 h-32 my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                {/* Progress Circle (Safe Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#34C759"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={psiOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[30px] font-bold font-mono text-[#dae2fd]">
                  42
                </span>
                <span className="text-[12px] text-[#34C759] font-bold">
                  Good
                </span>
              </div>
            </div>
            <p className="text-[12px] text-[#c1c6d3] text-center mt-2">
              Normal activities suitable for all.
            </p>
          </div>

          {/* UV Index Gauge */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col items-center justify-center relative shadow-md">
            <h3 className="text-[13px] font-bold text-[#c1c6d3] self-start mb-2">
              UV Index
            </h3>
            <div className="relative w-32 h-32 my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                {/* Progress Circle (Warning Yellow) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#FFCC00"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={uvOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[30px] font-bold font-mono text-[#dae2fd]">
                  6
                </span>
                <span className="text-[12px] text-[#FFCC00] font-bold">
                  High
                </span>
              </div>
            </div>
            <p className="text-[12px] text-[#c1c6d3] text-center mt-2">
              Protection required between 10am-4pm.
            </p>
          </div>
        </section>

        {/* 5-Hour Outlook Carousel (Span 12) */}
        <section className="col-span-1 md:col-span-12 bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#334155]">
            <h3 className="text-[15px] font-bold text-[#dae2fd]">5-Hour Outlook</h3>
            <button
              id="view-radar-btn"
              onClick={() => setShowRadarModal(true)}
              className="text-[#a6c8ff] hover:text-[#bbd4ff] text-[13px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Radar</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
            {HOURLY_WEATHER.map((item) => {
              const isSelected = activeHour === item.time;
              return (
                <div
                  key={item.time}
                  onClick={() => setActiveHour(item.time)}
                  className={`flex-none w-28 flex flex-col items-center rounded-xl py-4 px-2 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#005baa]/20 border-[#a6c8ff] shadow-md scale-105'
                      : 'bg-[#171f33] border-[#334155] hover:bg-[#222a3d]'
                  }`}
                >
                  <span
                    className={`text-[13px] font-semibold mb-2 ${
                      isSelected ? 'text-[#a6c8ff]' : 'text-[#dae2fd]'
                    }`}
                  >
                    {item.time}
                  </span>

                  <span
                    className={`material-symbols-outlined text-[32px] mb-2 ${
                      item.condition.includes('Thunder') || item.condition.includes('Rain')
                        ? 'text-[#a6c8ff]'
                        : item.condition.includes('Cloud')
                        ? 'text-[#FFD200]'
                        : 'text-[#FFCC00]'
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>

                  <span className="text-[18px] font-bold font-mono text-[#dae2fd] mb-1">
                    {item.temp}°
                  </span>

                  <span className="text-[11px] text-[#a6c8ff] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">water_drop</span>
                    <span>{item.rainChance}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Radar Overlay Modal */}
      {showRadarModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a6c8ff]">radar</span>
                <h3 className="font-bold text-[#dae2fd]">Singapore Doppler Weather Radar</h3>
              </div>
              <button
                onClick={() => setShowRadarModal(false)}
                className="text-[#8c919d] hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="relative h-64 bg-[#060e20] rounded-xl overflow-hidden border border-[#334155] flex items-center justify-center">
                {/* Simulated Radar Map */}
                <svg viewBox="0 0 500 300" className="w-full h-full">
                  <rect width="500" height="300" fill="#071124" />
                  {/* Island Outline */}
                  <path
                    d="M 50,150 Q 150,80 300,100 T 450,140 L 460,200 Q 300,240 180,220 Z"
                    fill="#0f2240"
                    stroke="#223d68"
                  />
                  {/* Radar Circles */}
                  <circle cx="250" cy="150" r="50" fill="none" stroke="#223d68" strokeDasharray="3,3" />
                  <circle cx="250" cy="150" r="100" fill="none" stroke="#223d68" strokeDasharray="3,3" />

                  {/* Doppler Storm Clouds */}
                  <circle cx={200 + radarStep * 15} cy="140" r="45" fill="#FF3B30" opacity="0.6" filter="blur(10px)" />
                  <circle cx={230 + radarStep * 15} cy="160" r="55" fill="#FF9500" opacity="0.7" filter="blur(12px)" />
                  <circle cx={270 + radarStep * 15} cy="150" r="65" fill="#005EC4" opacity="0.5" filter="blur(15px)" />
                </svg>

                <div className="absolute top-3 left-3 bg-[#171f33]/80 px-2.5 py-1 rounded text-[11px] font-mono text-[#a6c8ff]">
                  Radar Sweep: Live (Central / South Heavy Rain)
                </div>
              </div>

              {/* Playback Controls */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setRadarStep((prev) => (prev > 0 ? prev - 1 : 5))}
                  className="bg-[#171f33] hover:bg-[#2d3449] border border-[#334155] px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  ◀ Previous
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-[#8c919d]">T-30m</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={radarStep}
                    onChange={(e) => setRadarStep(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-[#a6c8ff]"
                  />
                  <span className="text-xs text-[#a6c8ff] font-bold">Now</span>
                </div>
                <button
                  onClick={() => setRadarStep((prev) => (prev < 5 ? prev + 1 : 0))}
                  className="bg-[#171f33] hover:bg-[#2d3449] border border-[#334155] px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
