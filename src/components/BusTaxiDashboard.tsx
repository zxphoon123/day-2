import React, { useState } from 'react';
import { BUS_SERVICES, OD_FLOWS } from '../data/mockData';
import { BusServiceItem } from '../types';

export const BusTaxiDashboard: React.FC = () => {
  const [busList, setBusList] = useState<BusServiceItem[]>(BUS_SERVICES);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [hailStatus, setHailStatus] = useState<string | null>(null);
  const [taxiCount, setTaxiCount] = useState<number>(12);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [volumeFilter, setVolumeFilter] = useState<'all' | 'Low' | 'Med' | 'High'>('all');

  const filteredBuses = busList.filter(
    (b) =>
      (volumeFilter === 'all' || b.occupancy === volumeFilter) &&
      (b.serviceNo.includes(searchFilter) ||
        b.destination.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleHailTaxi = () => {
    setHailStatus('Locating closest taxi at Tang Plaza...');
    setTimeout(() => {
      setHailStatus('Taxi SHB 4912K assigned! Arriving at Tang Plaza in 3 mins.');
      setTaxiCount((prev) => Math.max(prev - 1, 1));
      setTimeout(() => setHailStatus(null), 6000);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1326] text-[#dae2fd] p-4 md:p-8 max-w-[1440px] w-full mx-auto pb-24 md:pb-8">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#a6c8ff] tracking-tight">
            Bus &amp; Taxi Dashboard
          </h2>
          <p className="text-[15px] text-[#c1c6d3] mt-1">
            Real-time ground transport metrics for your location.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#171f33] border border-[#334155] px-3 py-1.5 rounded-lg text-[#c1c6d3]">
          <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
          <span>Feed synchronized with LTA DataMall</span>
        </div>
      </header>

      {/* Proactive Advice Banner */}
      <div className="mb-6 bg-[#1E293B] border border-[#334155] rounded-xl p-5 md:p-6 flex items-start gap-4 shadow-md">
        <span
          className="material-symbols-outlined text-[#FFCC00] text-[32px] shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-[#dae2fd] mb-1">
            High Bus Demand in Orchard Area
          </h3>
          <p className="text-[14px] text-[#c1c6d3] leading-relaxed">
            Expect delays on services 65 and 14 due to evening rush hour. Consider grabbing a
            taxi from the nearby stand at Tang Plaza for faster commute.
          </p>
        </div>
        <button
          onClick={handleHailTaxi}
          className="hidden sm:flex shrink-0 bg-[#005BAA] hover:bg-[#004787] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">local_taxi</span>
          <span>Book Taxi</span>
        </button>
      </div>

      {/* Hail Status Banner */}
      {hailStatus && (
        <div className="mb-6 bg-[#005baa]/20 border border-[#a6c8ff] text-[#bbd4ff] p-4 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#a6c8ff] animate-bounce">
              local_taxi
            </span>
            <span className="text-sm font-medium">{hailStatus}</span>
          </div>
          <button
            onClick={() => setHailStatus(null)}
            className="text-xs text-[#c1c6d3] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Top Left: Bus Stop Passenger Volume Live Map (Span 8) */}
        <div className="md:col-span-8 bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col overflow-hidden shadow-md">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a6c8ff] text-[18px]">
                density_medium
              </span>
              <h3 className="text-[14px] font-bold text-[#dae2fd]">
                Bus Stop Passenger Volume
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-[#2d3449] text-[#dae2fd] rounded border border-[#414751]">
              Live Map
            </span>
          </div>

          <div className="flex-1 relative min-h-[340px] bg-[#071124] overflow-hidden flex flex-col justify-end">
            {/* SVG Synthetic Singapore Bus Volume Heatmap */}
            <svg
              viewBox="0 0 800 450"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <filter id="busHeat" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
                </filter>
                <radialGradient id="orchardHeat" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#FF9500" stopOpacity="0.75" />
                  <stop offset="85%" stopColor="#FFCC00" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FFCC00" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="somersetHeat" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFCC00" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#34C759" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#34C759" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Road Grid */}
              <g stroke="#1b2e4f" strokeWidth="1.5" fill="none">
                <path d="M 50,150 L 750,150" />
                <path d="M 50,280 L 750,280" />
                <path d="M 180,50 L 180,400" />
                <path d="M 380,50 L 380,400" />
                <path d="M 580,50 L 580,400" />
                {/* Orchard Main Spine */}
                <path d="M 100,230 L 320,230 L 520,270 L 720,240" stroke="#2d4975" strokeWidth="4" />
                <path d="M 320,80 L 320,380" stroke="#2d4975" strokeWidth="3" />
                <path d="M 520,80 L 520,380" stroke="#2d4975" strokeWidth="3" />
              </g>

              {/* Heatmap Blobs */}
              <circle cx="280" cy="230" r="70" fill="url(#orchardHeat)" filter="url(#busHeat)" />
              <circle cx="360" cy="230" r="60" fill="url(#orchardHeat)" filter="url(#busHeat)" />
              <circle cx="480" cy="265" r="50" fill="url(#orchardHeat)" filter="url(#busHeat)" />
              <circle cx="200" cy="230" r="45" fill="url(#somersetHeat)" filter="url(#busHeat)" />
              <circle cx="620" cy="245" r="40" fill="url(#somersetHeat)" filter="url(#busHeat)" />

              {/* Bus Stops Pins */}
              {[
                { x: 230, y: 225, code: '09048', name: 'Tang Plaza', vol: 'High' },
                { x: 310, y: 225, code: '09037', name: 'Orchard Stn / Lucky Plaza', vol: 'High' },
                { x: 390, y: 235, code: '09022', name: 'Opp Ngee Ann City', vol: 'High' },
                { x: 490, y: 265, code: '08138', name: 'Dhoby Ghaut Stn', vol: 'High' },
                { x: 610, y: 245, code: '04111', name: 'Bugis Stn Exit A', vol: 'Med' },
              ].map((stop, idx) => (
                <g key={idx} transform={`translate(${stop.x}, ${stop.y})`} className="cursor-pointer">
                  <circle cx="0" cy="0" r="8" fill="#FFD200" stroke="#171f33" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#171f33" />
                  <rect
                    x="12"
                    y="-16"
                    width="110"
                    height="20"
                    rx="3"
                    fill="#171f33"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text x="16" y="-3" fill="#dae2fd" fontSize="9" fontWeight="700">
                    {stop.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* In-Map Telemetry HUD */}
            <div className="absolute top-4 left-4 bg-[#171f33]/90 border border-[#334155] p-3 rounded-lg backdrop-blur-md hidden sm:block">
              <div className="text-[11px] text-[#c1c6d3] space-y-1 font-mono">
                <div>Time: <span className="text-white font-bold">18:30 Peak</span></div>
                <div>Active Routes: <span className="text-[#a6c8ff] font-bold">514</span></div>
                <div>Active Stops: <span className="text-[#a6c8ff] font-bold">1,842</span></div>
                <div>Current Ridership: <span className="text-[#FFCC00] font-bold">38,915</span></div>
                <div>On-Time Rate: <span className="text-[#34C759] font-bold">94.2%</span></div>
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="absolute bottom-4 right-4 bg-[#1E293B]/95 border border-[#334155] p-3 rounded-lg backdrop-blur-md shadow-xl">
              <div className="text-[11px] font-semibold text-[#c1c6d3] mb-2">Volume Level</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVolumeFilter(volumeFilter === 'Low' ? 'all' : 'Low')}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                >
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#34C759]"></div>
                  <span className="text-[11px] text-[#dae2fd]">Low</span>
                </button>
                <button
                  onClick={() => setVolumeFilter(volumeFilter === 'Med' ? 'all' : 'Med')}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                >
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#FFCC00]"></div>
                  <span className="text-[11px] text-[#dae2fd]">Med</span>
                </button>
                <button
                  onClick={() => setVolumeFilter(volumeFilter === 'High' ? 'all' : 'High')}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                >
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#FF3B30]"></div>
                  <span className="text-[11px] text-[#dae2fd]">High</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right: Taxi Fleet Status (Span 4) */}
        <div className="md:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="material-symbols-outlined text-[#005BAA] text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_taxi
              </span>
              <h3 className="text-[16px] font-bold text-[#dae2fd]">
                Taxi Fleet Status
              </h3>
            </div>
            <p className="text-[12px] text-[#c1c6d3] mb-6">
              Availability near your starting point (500m radius)
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[44px] font-bold text-[#a6c8ff] font-mono leading-none mb-1">
                {taxiCount}
              </div>
              <div className="text-[14px] text-[#c1c6d3]">Taxis Available Now</div>
            </div>

            <div className="w-full h-px bg-[#334155]"></div>

            <div>
              <div className="text-[26px] font-bold text-[#FFCC00] font-mono leading-none mb-1">
                ~5 mins
              </div>
              <div className="text-[14px] text-[#c1c6d3]">Average Wait Time</div>
            </div>

            <button
              id="hail-taxi-btn"
              onClick={handleHailTaxi}
              className="w-full bg-[#005BAA] hover:bg-[#004787] text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">local_taxi</span>
              <span>Hail Closest Taxi (Tang Plaza)</span>
            </button>
          </div>
        </div>

        {/* Bottom Left: Nearby Bus Services Table (Span 6) */}
        <div className="md:col-span-6 bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
            <h3 className="text-[14px] font-bold text-[#dae2fd] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FFD200] text-[18px]">
                directions_bus
              </span>
              <span>Nearby Bus Services</span>
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter service..."
                className="bg-[#0b1326] border border-[#334155] rounded px-2 py-0.5 text-xs text-[#dae2fd] focus:outline-none w-28 placeholder-[#8c919d]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2d3449] text-[12px] font-semibold text-[#c1c6d3]">
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Destination</th>
                  <th className="p-3.5">Arriving In</th>
                  <th className="p-3.5">Occupancy</th>
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#dae2fd]">
                {filteredBuses.map((bus, idx) => (
                  <tr
                    key={bus.serviceNo}
                    className={`border-b border-[#334155]/60 hover:bg-[#2d3449]/50 transition-colors ${
                      idx % 2 === 0 ? 'bg-[#1E293B]' : 'bg-[#171f33]'
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#FFD200] text-[16px]">
                          directions_bus
                        </span>
                        <span className="font-bold text-[15px]">{bus.serviceNo}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{bus.destination}</td>
                    <td className="p-3.5">
                      <span
                        className={`font-mono font-bold ${
                          bus.arrivingInMin <= 2 ? 'text-[#34C759]' : 'text-[#dae2fd]'
                        }`}
                      >
                        {bus.arrivingInMin} min
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          bus.occupancy === 'Low'
                            ? 'bg-[#34C759]/20 text-[#34C759] border-[#34C759]/30'
                            : bus.occupancy === 'Med'
                            ? 'bg-[#FFCC00]/20 text-[#FFCC00] border-[#FFCC00]/30'
                            : 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30'
                        }`}
                      >
                        {bus.occupancy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Right: Origin-Destination Flow (Span 6) */}
        <div className="md:col-span-6 bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col shadow-md">
          <div className="mb-5">
            <h3 className="text-[14px] font-bold text-[#dae2fd]">
              Origin-Destination Flow
            </h3>
            <p className="text-[12px] text-[#c1c6d3] mt-0.5">
              Top bus passenger routes from current location
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-around gap-4">
            {OD_FLOWS.map((flow, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFlow(flow.destination)}
                className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                  selectedFlow === flow.destination ? 'bg-[#2d3449]' : 'hover:bg-[#222a3d]'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[14px] font-medium text-[#dae2fd]">
                    {flow.origin} <span className="text-[#8c919d] mx-2">→</span> {flow.destination}
                  </span>
                  <span className="text-[13px] font-bold font-mono text-[#a6c8ff]">
                    {flow.percentage}%
                  </span>
                </div>
                <div className="w-full bg-[#2d3449] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#a6c8ff] h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${flow.percentage}%`,
                      opacity: idx === 0 ? 1 : idx === 1 ? 0.8 : 0.6,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-[#8c919d] mt-1">
                  <span>Avg Duration: {flow.avgTravelTime}</span>
                  <span>{flow.passengersPerHour.toLocaleString()} riders/hr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
