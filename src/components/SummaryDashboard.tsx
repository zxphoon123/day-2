import React, { useState, useEffect } from 'react';
import { InteractiveMap } from './InteractiveMap';
import { RouteOption } from '../types';
import { INITIAL_ROUTE_OPTIONS, NEARBY_DEPARTURES } from '../data/mockData';
import { fetchSmartAdvisory, fetchLiveWeather } from '../services/api';

interface SummaryDashboardProps {
  onNavigateToBus: () => void;
  onNavigateToMrt: () => void;
  onNavigateToWeather: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  onNavigateToBus,
  onNavigateToMrt,
  onNavigateToWeather,
}) => {
  const [origin, setOrigin] = useState<string>('Bishan Interchange');
  const [destinationA, setDestinationA] = useState<string>('Marina Bay Sands');
  const [destinationB, setDestinationB] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('opt-mrt');
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>(INITIAL_ROUTE_OPTIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [smartAdvisory, setSmartAdvisory] = useState({
    headline: 'Heavy rain forecasted in Marina Bay area within 30 minutes.',
    details: 'Take the MRT to save $18.40 compared to surging taxi prices, and stay dry entirely via underground links.',
    confidence: 94,
    costSavings: '$18.40',
    timeSavings: '12 mins',
  });

  const handleOptimizeRoute = async () => {
    setIsOptimizing(true);
    try {
      const weather = await fetchLiveWeather();
      const advisory = await fetchSmartAdvisory(
        origin,
        destinationA,
        weather.condition || 'Scattered Thunderstorms',
        true
      );

      if (advisory.headline) {
        setSmartAdvisory({
          headline: advisory.headline,
          details: advisory.details,
          confidence: advisory.confidence || 92,
          costSavings: advisory.costSavings || '$18.40',
          timeSavings: advisory.timeSavings || '12 mins',
        });
      }

      setToastMessage(`Optimized with live NEA Weather (${weather.temperature}°C, ${weather.condition}) & LTA feeds!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {
      console.warn('Optimization error:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1326] text-[#dae2fd]">
      {/* Top Routing Bar */}
      <header className="bg-[#0b1326] p-4 md:px-8 md:py-5 border-b border-[#222a3d] flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center z-10 sticky top-0">
        {/* Origin */}
        <div className="flex items-center gap-2.5 bg-[#171f33] border border-[#334155] rounded-lg px-3.5 py-2.5 flex-1 md:max-w-[260px]">
          <span className="material-symbols-outlined text-[#a6c8ff] text-[20px]">
            my_location
          </span>
          <input
            id="input-origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="bg-transparent border-none text-[14px] text-[#dae2fd] w-full focus:outline-none placeholder-[#8c919d]"
            placeholder="Starting Point"
          />
        </div>

        {/* Arrow separator */}
        <div className="hidden md:flex items-center text-[#c1c6d3]">
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>

        {/* Destination A */}
        <div className="flex items-center gap-2.5 bg-[#171f33] border border-[#334155] rounded-lg px-3.5 py-2.5 flex-1 md:max-w-[260px]">
          <span className="material-symbols-outlined text-[#FFCC00] text-[20px]">
            flag
          </span>
          <input
            id="input-dest-a"
            type="text"
            value={destinationA}
            onChange={(e) => setDestinationA(e.target.value)}
            className="bg-transparent border-none text-[14px] text-[#dae2fd] w-full focus:outline-none placeholder-[#8c919d]"
            placeholder="Destination A (e.g. Marina Bay Sands)"
          />
        </div>

        {/* Plus separator */}
        <div className="hidden md:flex items-center text-[#c1c6d3]">
          <span className="material-symbols-outlined text-[16px]">add</span>
        </div>

        {/* Destination B (Optional) */}
        <div className="flex items-center gap-2.5 bg-[#171f33] border border-[#334155] rounded-lg px-3.5 py-2.5 flex-1 md:max-w-[240px]">
          <span className="material-symbols-outlined text-[#74007A] text-[20px]">
            flag_circle
          </span>
          <input
            id="input-dest-b"
            type="text"
            value={destinationB}
            onChange={(e) => setDestinationB(e.target.value)}
            className="bg-transparent border-none text-[14px] text-[#dae2fd] w-full focus:outline-none placeholder-[#8c919d]"
            placeholder="Destination B (Optional)"
          />
        </div>

        {/* Action Button */}
        <div className="md:ml-auto flex items-center gap-2">
          <button
            id="btn-optimize-route"
            onClick={handleOptimizeRoute}
            disabled={isOptimizing}
            className="w-full md:w-auto bg-[#a6c8ff] text-[#00315f] font-semibold text-[14px] px-6 py-2.5 rounded-lg hover:bg-[#bbd4ff] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isOptimizing ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-[#00315f] border-t-transparent rounded-full animate-spin"></span>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">auto_mode</span>
                <span>Optimize Route</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 max-w-[1440px] w-full mx-auto pb-24 md:pb-8 flex flex-col gap-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="bg-[#005baa] text-[#bbd4ff] border border-[#a6c8ff] px-4 py-3 rounded-xl flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <span className="material-symbols-outlined text-[#34C759]">check_circle</span>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#dae2fd] hover:text-white text-xs ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Proactive Advice / Recommendation Banner (Full Width) */}
        <div className="bg-[#005baa] border border-[#a6c8ff]/40 text-[#bbd4ff] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-5 relative overflow-hidden shadow-lg">
          {/* Subtle Background Icon Pattern */}
          <div className="absolute -right-8 -top-8 opacity-15 pointer-events-none text-white">
            <span className="material-symbols-outlined text-[160px]">tips_and_updates</span>
          </div>

          <div className="w-13 h-13 rounded-full bg-[#a6c8ff] text-[#00315f] flex items-center justify-center shrink-0 shadow-md">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
          </div>

          <div className="flex-1 z-10">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h2 className="text-[20px] font-bold text-white tracking-tight">
                AI Proactive Commute Advisory
              </h2>
              <span className="bg-[#FFCC00] text-[#3d2f00] px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide">
                {smartAdvisory.confidence}% Confidence
              </span>
              <span className="bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/40 px-2 py-0.5 rounded text-[11px] font-bold">
                Saves {smartAdvisory.costSavings}
              </span>
            </div>
            <p className="text-[15px] text-[#dae2fd] leading-relaxed">
              <strong className="text-white font-semibold">{smartAdvisory.headline} </strong>
              {smartAdvisory.details}
            </p>
          </div>

          <button
            onClick={onNavigateToWeather}
            className="shrink-0 bg-[#00315f]/80 hover:bg-[#00315f] text-[#dae2fd] text-xs font-semibold px-4 py-2 rounded-lg border border-[#a6c8ff]/30 transition-colors cursor-pointer z-10"
          >
            Check Weather →
          </button>
        </div>

        {/* 2-Column Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Time & Cost Comparison + Nearby Departures (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Time & Cost Comparison Card */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-md">
              <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]/60">
                <h3 className="text-[14px] font-bold text-[#dae2fd] tracking-wide">
                  Time &amp; Cost Comparison
                </h3>
                <span className="material-symbols-outlined text-[#c1c6d3] text-[18px]">
                  compare_arrows
                </span>
              </div>

              <div className="p-3 flex flex-col gap-2">
                {routeOptions.map((opt) => {
                  const isSelected = selectedRouteId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      id={`route-option-${opt.id}`}
                      onClick={() => setSelectedRouteId(opt.id)}
                      className={`relative flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all duration-150 ${
                        opt.isBest
                          ? 'border border-[#a6c8ff] bg-[#131b2e] shadow-sm'
                          : 'bg-[#222a3d] hover:bg-[#2d3449] border border-transparent'
                      } ${isSelected ? 'ring-2 ring-[#a6c8ff]/70' : ''}`}
                    >
                      {/* BEST Badge for MRT */}
                      {opt.isBest && (
                        <div className="absolute -right-6 top-1 bg-[#a6c8ff] text-[#00315f] text-[9px] font-extrabold py-0.5 px-7 transform rotate-45 tracking-wider shadow-sm">
                          BEST
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {/* Icon Container */}
                        {opt.type === 'taxi' && (
                          <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#334155] text-[#005BAA]">
                            <span className="material-symbols-outlined text-[20px]">local_taxi</span>
                          </div>
                        )}
                        {opt.type === 'mrt' && (
                          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#334155] flex flex-col gap-1 items-center justify-center">
                            <div className="h-1.5 w-6 rounded-full bg-[#D42E12]"></div>
                            <div className="h-1.5 w-6 rounded-full bg-[#FF9A00]"></div>
                          </div>
                        )}
                        {opt.type === 'bus' && (
                          <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#334155] text-[#FFD200]">
                            <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                          </div>
                        )}

                        <div>
                          <div className="text-[14px] font-bold text-[#dae2fd] flex items-center gap-1.5">
                            <span>{opt.name}</span>
                          </div>
                          <div className={`text-[12px] flex items-center gap-1 mt-0.5 ${opt.statusColor}`}>
                            {opt.type === 'taxi' && (
                              <span className="material-symbols-outlined text-[13px]">trending_up</span>
                            )}
                            {opt.type === 'mrt' && (
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            )}
                            {opt.type === 'bus' && (
                              <span className="material-symbols-outlined text-[13px]">warning</span>
                            )}
                            <span>{opt.subtext}</span>
                          </div>
                        </div>
                      </div>

                      {/* Numerical Stats */}
                      <div className={`text-right ${opt.isBest ? 'pr-5' : ''}`}>
                        <div
                          className={`text-[18px] font-bold font-mono ${
                            opt.isBest ? 'text-[#a6c8ff]' : 'text-[#dae2fd]'
                          }`}
                        >
                          {opt.durationMin} min
                        </div>
                        <div className="text-[12px] text-[#c1c6d3]">
                          {opt.cost > 10 ? `~$${opt.cost.toFixed(2)}` : `$${opt.cost.toFixed(2)}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nearby Departures Card */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-md">
              <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
                <h3 className="text-[14px] font-bold text-[#dae2fd] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#a6c8ff] text-[18px]">
                    schedule
                  </span>
                  <span>Nearby Departures</span>
                </h3>
                <span className="text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
                  Live
                </span>
              </div>

              <div className="p-4 flex flex-col gap-4">
                {NEARBY_DEPARTURES.map((group, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3 border-t border-[#334155]/60' : ''}>
                    <div className="text-[12px] font-semibold text-[#c1c6d3] mb-2.5">
                      {group.station}
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-1 border-b border-[#334155]/30 last:border-none"
                        >
                          <div className="flex items-center gap-2.5">
                            {item.type === 'mrt' ? (
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shadow-sm"
                                style={{ backgroundColor: item.color }}
                              >
                                {item.lineCode}
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#0b1326] border border-[#FFD200] flex items-center justify-center text-[#FFD200] font-bold text-[12px]">
                                {item.lineCode}
                              </div>
                            )}

                            <div>
                              <div className="text-[14px] font-medium text-[#dae2fd]">
                                {item.destination}
                              </div>
                              <div className="text-[11px] text-[#8c919d]">{item.lineName}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`text-[16px] font-bold font-mono ${
                                item.eta === '2 min' || item.eta === 'Arriving'
                                  ? 'text-[#34C759]'
                                  : 'text-[#dae2fd]'
                              }`}
                            >
                              {item.eta}
                            </div>
                            <div className="text-[10px] text-[#8c919d]">
                              Next: {item.nextEta}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Widget (Span 8) */}
          <div className="md:col-span-8 bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-md flex flex-col">
            <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a6c8ff] text-[20px]">
                  map
                </span>
                <h3 className="text-[14px] font-bold text-[#dae2fd]">
                  Transit Navigation &amp; Corridor Map
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onNavigateToBus}
                  className="text-xs text-[#a6c8ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Bus &amp; Taxi view →
                </button>
              </div>
            </div>

            <div className="w-full flex-1">
              <InteractiveMap
                mode="summary"
                origin={origin}
                destination={destinationA}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
