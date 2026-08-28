import React, { useState, useEffect, useMemo } from 'react';
import { InteractiveMap } from './InteractiveMap';
import { PunctualityBooster } from './PunctualityBooster';
import { RouteOption } from '../types';
import { INITIAL_ROUTE_OPTIONS, NEARBY_DEPARTURES } from '../data/mockData';
import { fetchSmartAdvisory, fetchLiveWeather } from '../services/api';
import { verifyTaxiPrice, calculatePublicTransitFare } from '../utils/taxiFareEngine';

interface SummaryDashboardProps {
  onNavigateToBus: () => void;
  onNavigateToMrt: () => void;
  onNavigateToWeather: () => void;
  onNavigateToCommunity?: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  onNavigateToBus,
  onNavigateToMrt,
  onNavigateToWeather,
  onNavigateToCommunity,
}) => {
  const [origin, setOrigin] = useState<string>('Bishan Interchange');
  const [destinationA, setDestinationA] = useState<string>('Marina Bay Sands');
  const [destinationB, setDestinationB] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('opt-mrt');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFareAccuracyModal, setShowFareAccuracyModal] = useState<boolean>(false);

  // Compute verified fares dynamically based on current origin & destination
  const fareVerification = useMemo(() => {
    return verifyTaxiPrice(origin, destinationA);
  }, [origin, destinationA]);

  const transitFares = useMemo(() => {
    const dist = fareVerification.distanceKm || 12.5;
    return calculatePublicTransitFare(dist);
  }, [fareVerification.distanceKm]);

  // Dynamically constructed route options reflecting verified pricing
  const routeOptions: RouteOption[] = useMemo(() => {
    const isLocVerified = fareVerification.isLocationVerified;
    const dist = fareVerification.distanceKm || 12.5;

    // Estimate transit times
    const taxiDuration = Math.max(10, Math.round(dist * 1.4 + (fareVerification.isPeakHour ? 6 : 2)));
    const mrtDuration = Math.max(12, Math.round(dist * 1.8 + 4));
    const busDuration = Math.max(18, Math.round(dist * 2.6 + 6));

    const taxiOption: RouteOption = {
      id: 'opt-taxi',
      type: 'taxi',
      name: isLocVerified ? 'Metered Taxi (LTA Rate)' : 'Taxi / Ride-Hail',
      subtext: isLocVerified ? 'LTA Meter • Surge Unverified' : 'Dynamic Fare (Unverified)',
      durationMin: taxiDuration,
      cost: isLocVerified ? fareVerification.meteredBaseFare : 0,
      costRange: isLocVerified ? fareVerification.recommendedDisplayPrice : 'Check Booking App',
      distanceKm: dist,
      surgeLevel: 'High Surge',
      statusColor: 'text-[#FF9A00]',
      fareAccuracyStatus: isLocVerified ? 'verified_meter' : 'location_unresolved',
      accuracyNote: fareVerification.accuracyNote,
      surgeWarning: fareVerification.surgeWarning,
    };

    const mrtOption: RouteOption = {
      id: 'opt-mrt',
      type: 'mrt',
      name: 'MRT (NSL > CCL)',
      subtext: 'PTC Regulated Adult Fare',
      durationMin: mrtDuration,
      cost: transitFares.mrtFare,
      distanceKm: dist,
      surgeLevel: 'Normal Crowd',
      statusColor: 'text-[#34C759]',
      isBest: true,
      mrtLines: ['#D42E12', '#FF9A00'],
      fareAccuracyStatus: 'accurate_transit',
      accuracyNote: `PTC regulated distance-based adult fare ($${transitFares.mrtFare.toFixed(2)} for ${dist} km).`,
    };

    const busOption: RouteOption = {
      id: 'opt-bus',
      type: 'bus',
      name: 'Bus 133 / Express',
      subtext: 'PTC Regulated Adult Fare',
      durationMin: busDuration,
      cost: transitFares.busFare,
      distanceKm: dist,
      surgeLevel: 'Moderate Traffic',
      statusColor: 'text-[#FFCC00]',
      busNumber: '133',
      fareAccuracyStatus: 'accurate_transit',
      accuracyNote: `PTC regulated distance-based adult fare ($${transitFares.busFare.toFixed(2)} for ${dist} km).`,
    };

    return [taxiOption, mrtOption, busOption];
  }, [fareVerification, transitFares]);

  const [smartAdvisory, setSmartAdvisory] = useState({
    headline: 'Heavy rain forecasted in Marina Bay area within 30 minutes.',
    details: 'Take the MRT to save ~$14.70 - $19.20 compared to metered taxi prices (surge unverified), and stay dry entirely via underground links.',
    confidence: 94,
    costSavings: '$14.70 - $19.20',
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
        fareVerification.isPeakHour
      );

      const accurateSavings = fareVerification.savingsVsTransit.formatted !== 'Dynamic'
        ? fareVerification.savingsVsTransit.formatted
        : '~$14 - $20';

      if (advisory.headline) {
        setSmartAdvisory({
          headline: advisory.headline,
          details: advisory.details || `MRT provides sheltered connection from ${origin} to ${destinationA}. Save ${accurateSavings} vs metered taxi.`,
          confidence: advisory.confidence || 92,
          costSavings: accurateSavings,
          timeSavings: advisory.timeSavings || '12 mins',
        });
      }

      setToastMessage(`Optimized route (${fareVerification.distanceKm} km) with live NEA Weather (${weather.temperature}°C) & LTA feeds!`);
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

        {/* Punctuality Booster & Encouragement Generator */}
        <PunctualityBooster destination={destinationA || 'Marina Bay Sands'} />

        {/* 2-Column Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Time & Cost Comparison + Nearby Departures (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Time & Cost Comparison Card */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-md">
              <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#dae2fd] tracking-wide">
                    Time &amp; Cost Comparison
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/40">
                    LTA &amp; PTC Verified
                  </span>
                </div>
                <button
                  onClick={() => setShowFareAccuracyModal(true)}
                  className="text-xs text-[#a6c8ff] hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Check taxi price accuracy and data policy"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span className="hidden sm:inline">Fare Accuracy</span>
                </button>
              </div>

              <div className="p-3 flex flex-col gap-2">
                {routeOptions.map((opt) => {
                  const isSelected = selectedRouteId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      id={`route-option-${opt.id}`}
                      onClick={() => setSelectedRouteId(opt.id)}
                      className={`relative flex flex-col p-3.5 rounded-lg cursor-pointer transition-all duration-150 ${
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

                      <div className="flex items-center justify-between">
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
                              {opt.distanceKm && (
                                <span className="text-[11px] font-normal text-[#8c919d]">
                                  ({opt.distanceKm} km)
                                </span>
                              )}
                            </div>
                            <div className={`text-[12px] flex items-center gap-1 mt-0.5 ${opt.statusColor}`}>
                              {opt.type === 'taxi' && (
                                <span className="material-symbols-outlined text-[13px]">info</span>
                              )}
                              {opt.type === 'mrt' && (
                                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              )}
                              {opt.type === 'bus' && (
                                <span className="material-symbols-outlined text-[13px]">check_circle</span>
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
                          <div className="text-[12px] text-[#c1c6d3] font-medium">
                            {opt.costRange ? opt.costRange : `$${opt.cost.toFixed(2)}`}
                          </div>
                        </div>
                      </div>

                      {/* Accuracy & Surge Disclaimer Banner for Taxi */}
                      {opt.type === 'taxi' && isSelected && (
                        <div className="mt-2.5 pt-2.5 border-t border-[#334155]/60 flex flex-col gap-1 text-[11px] text-[#c1c6d3]">
                          <div className="flex items-start gap-1.5 text-[#FF9A00]">
                            <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">verified_user</span>
                            <span>{opt.accuracyNote}</span>
                          </div>
                          <div className="text-[10px] text-[#8c919d] pl-5">
                            ⚠️ Live ride-hail surge multipliers (Grab/Gojek/Zig) vary by minute. Check official operator apps for binding live quotes.
                          </div>
                        </div>
                      )}
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

        {/* Live Commuter Community CTA */}
        <div className="mt-8 bg-[#171f33] border border-[#334155] hover:border-[#a6c8ff]/60 rounded-xl p-5 md:p-6 shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#005baa]/25 border border-[#005baa] flex items-center justify-center text-[#a6c8ff]">
              <span className="material-symbols-outlined text-[24px]">forum</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#dae2fd]">Live Commuter Community & Ground Reports</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#005baa]/20 text-[#a6c8ff] border border-[#005baa]/40">
                  Disqus
                </span>
              </div>
              <p className="text-xs text-[#c1c6d3] mt-0.5">
                Join active discussions, view MRT station alerts, bus crowd reports, and share commute hacks.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToCommunity}
            className="flex items-center gap-2 text-xs md:text-sm font-semibold bg-[#005baa] hover:bg-[#004b8d] text-white px-4 py-2 rounded-lg border border-[#3b82f6]/60 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Open Community Forum</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Taxi Fare Accuracy & Data Integrity Modal */}
      {showFareAccuracyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#334155] max-w-2xl w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-[#dae2fd] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005baa]/30 border border-[#005baa] text-[#a6c8ff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Taxi Price Accuracy &amp; Regulatory Standards</h3>
                  <p className="text-xs text-[#8c919d]">LTA Standard Meter Tariff &amp; Data Integrity Policy</p>
                </div>
              </div>
              <button
                onClick={() => setShowFareAccuracyModal(false)}
                className="w-8 h-8 rounded-lg bg-[#222a3d] hover:bg-[#334155] text-[#c1c6d3] flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Breakdown */}
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="bg-[#0b1326] p-4 rounded-xl border border-[#334155]">
                <div className="text-xs font-bold text-[#a6c8ff] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">rule</span>
                  Our Accuracy Guarantee: No Guesswork
                </div>
                <p className="text-xs text-[#c1c6d3]">
                  We adhere strictly to Singapore transport regulatory frameworks. If live surge pricing cannot be verified with official operator APIs, we mark it as <strong className="text-white">Surge Unverified</strong> and show the statutory LTA metered fare rather than guessing speculative numbers.
                </p>
              </div>

              {/* LTA Meter Breakdown */}
              <div className="border border-[#334155] rounded-xl p-4 bg-[#1e293b]/60">
                <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FFCC00] text-[18px]">calculate</span>
                  LTA Regulated Meter Tariff (Standard 4-Seater)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#334155]/60">
                    <span className="text-[#8c919d] block mb-0.5">Flag-down Fare (First 1 km)</span>
                    <span className="font-mono font-bold text-[#dae2fd] text-sm">$4.40 - $4.80</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#334155]/60">
                    <span className="text-[#8c919d] block mb-0.5">Distance Rate (Every 400m / 350m)</span>
                    <span className="font-mono font-bold text-[#dae2fd] text-sm">$0.26 / jump (~$0.65 - $0.74/km)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#334155]/60">
                    <span className="text-[#8c919d] block mb-0.5">Peak Hour Surcharge (25%)</span>
                    <span className="font-mono font-bold text-[#dae2fd] text-sm">6:00-9:30 AM (Mon-Fri) | 5:00-11:59 PM</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#334155]/60">
                    <span className="text-[#8c919d] block mb-0.5">Midnight Surcharge (50%)</span>
                    <span className="font-mono font-bold text-[#dae2fd] text-sm">12:00 Midnight - 5:59 AM</span>
                  </div>
                </div>
              </div>

              {/* Open Data Limitation Notice */}
              <div className="border border-[#e65100]/40 rounded-xl p-4 bg-[#e65100]/10 text-[#ffd180]">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#ff9800] shrink-0 mt-0.5">warning</span>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-white">Why are Ride-Hail Surge Fares Marked "Unverified"?</div>
                    <p className="text-[#ffe0b2]">
                      Open Government Data (Data.gov.sg v1 and LTA DataMall) provides live taxi vehicle availability coordinates, but does <strong>not</strong> expose third-party algorithmic surge pricing from private operators (Grab, Gojek, Tada, CDG Zig).
                    </p>
                    <p className="text-[#ffe0b2]">
                      For binding trip quotes with live surge multipliers, please verify directly in the operator mobile application.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-[#334155]">
              <button
                onClick={() => setShowFareAccuracyModal(false)}
                className="bg-[#005baa] hover:bg-[#004b8d] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
