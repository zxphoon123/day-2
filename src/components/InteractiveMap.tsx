import React, { useState } from 'react';

interface InteractiveMapProps {
  mode?: 'summary' | 'bus' | 'mrt';
  origin?: string;
  destination?: string;
  onSelectOption?: (id: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  mode = 'summary',
  origin = 'Current Location',
  destination = 'Marina Bay Sands',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'mrt' | 'bus' | 'taxi' | 'heatmap'>('all');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#060e20] flex flex-col select-none rounded-b-xl min-h-[380px] md:min-h-[480px]">
      {/* Background Carto Dark Map Style with Singapore Geography */}
      <div
        className="absolute inset-0 bg-[#071124] transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Synthetic Vector / SVG Map for Singapore Marina Bay & Central District */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Water gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#040c1a" />
              <stop offset="100%" stopColor="#08182f" />
            </linearGradient>

            {/* Heatmap blur filters */}
            <filter id="heatGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="highHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FF9500" stopOpacity="0.6" />
              <stop offset="85%" stopColor="#FFCC00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFCC00" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="medHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFCC00" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#34C759" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34C759" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Land Mass / Singapore Central Blueprint */}
          <rect width="1000" height="700" fill="#091428" />

          {/* Marina Reservoir / Water Bodies */}
          <path
            d="M 520,380 C 580,410 650,390 710,440 C 760,480 820,530 920,560 L 1000,650 L 1000,700 L 400,700 C 450,620 480,520 490,460 Z"
            fill="url(#waterGrad)"
            stroke="#172e4c"
            strokeWidth="1.5"
          />
          <path
            d="M 380,470 C 420,490 440,530 460,600 C 470,640 430,700 400,700 Z"
            fill="#050e1e"
          />

          {/* Singapore Coastline & Roads Grid */}
          <g stroke="#1b2a47" strokeWidth="1.2" opacity="0.6" fill="none">
            <line x1="100" y1="120" x2="900" y2="120" strokeDasharray="3,3" />
            <line x1="80" y1="260" x2="920" y2="260" />
            <line x1="120" y1="400" x2="880" y2="400" />
            <line x1="200" y1="60" x2="200" y2="650" />
            <line x1="450" y1="50" x2="450" y2="650" />
            <line x1="700" y1="80" x2="700" y2="620" />

            {/* Expressways (PIE, CTE, ECP) */}
            <path
              d="M 50,180 Q 300,240 550,220 T 950,260"
              stroke="#223659"
              strokeWidth="3.5"
            />
            <path
              d="M 320,50 Q 360,280 420,420 T 480,680"
              stroke="#223659"
              strokeWidth="3.5"
            />
            <path
              d="M 280,480 Q 500,430 750,470 T 980,560"
              stroke="#223659"
              strokeWidth="4"
            />
          </g>

          {/* Urban Road Corridors */}
          <g stroke="#263d63" strokeWidth="2" fill="none" opacity="0.8">
            {/* Orchard Road Corridor */}
            <path d="M 180,310 L 390,305 L 510,340" stroke="#314e7a" strokeWidth="3" />
            {/* Raffles / Shenton Way */}
            <path d="M 440,360 L 520,430 L 560,540 L 480,590" />
            {/* Bras Basah / Bugis / Rochor */}
            <path d="M 420,270 L 580,290 L 640,360" />
            {/* Bayfront Ave / Marina Coastal */}
            <path d="M 540,430 Q 660,450 720,520 T 680,640" />
          </g>

          {/* Location Area Labels */}
          <g fill="#4e688d" fontSize="11" fontFamily="Inter" fontWeight="600" letterSpacing="0.05em">
            <text x="210" y="295">ORCHARD RD</text>
            <text x="440" y="260">DHOBY GHAUT</text>
            <text x="560" y="280">BUGIS</text>
            <text x="400" y="380">CITY HALL</text>
            <text x="440" y="450">RAFFLES PLACE</text>
            <text x="640" y="470">MARINA BAY</text>
            <text x="730" y="580">MARINA SOUTH PIER</text>
            <text x="310" y="160">BISHAN (NS17)</text>
          </g>

          {/* MODE: BUS & TAXI HEATMAP CLUSTERS */}
          {(activeLayer === 'all' || activeLayer === 'heatmap') && (
            <g className="transition-opacity duration-300">
              {/* Orchard High Volume Heatmap */}
              <circle cx="280" cy="310" r="75" fill="url(#highHeat)" filter="url(#heatGlow)" />
              <circle cx="340" cy="305" r="55" fill="url(#highHeat)" filter="url(#heatGlow)" />

              {/* Dhoby Ghaut / City Hall Heatmap */}
              <circle cx="450" cy="290" r="65" fill="url(#highHeat)" filter="url(#heatGlow)" />
              <circle cx="490" cy="370" r="50" fill="url(#medHeat)" filter="url(#heatGlow)" />

              {/* Raffles Place / Downtown Heatmap */}
              <circle cx="480" cy="440" r="60" fill="url(#highHeat)" filter="url(#heatGlow)" />

              {/* Bugis cluster */}
              <circle cx="580" cy="290" r="45" fill="url(#medHeat)" filter="url(#heatGlow)" />
            </g>
          )}

          {/* MRT Network Lines (NSL, EWL, NEL, CCL, DTL, TEL) */}
          {(activeLayer === 'all' || activeLayer === 'mrt') && (
            <g className="transition-opacity duration-300">
              {/* North South Line (NSL) - Red */}
              <path
                d="M 310,120 L 320,180 Q 360,250 440,285 T 480,440 L 510,540 L 730,590"
                fill="none"
                stroke="#D42E12"
                strokeWidth="4"
                strokeDasharray="9,3"
                filter="url(#softGlow)"
              />
              <path
                d="M 310,120 L 320,180 Q 360,250 440,285 T 480,440 L 510,540 L 730,590"
                fill="none"
                stroke="#D42E12"
                strokeWidth="3.5"
              />

              {/* Circle Line (CCL) - Orange */}
              <path
                d="M 240,240 Q 340,190 440,285 T 590,340 Q 680,410 700,500 L 640,580"
                fill="none"
                stroke="#FF9A00"
                strokeWidth="4"
                filter="url(#softGlow)"
              />

              {/* Downtown Line (DTL) - Blue */}
              <path
                d="M 180,200 Q 350,280 500,340 T 630,420 L 560,490"
                fill="none"
                stroke="#005EC4"
                strokeWidth="3.5"
                opacity="0.8"
              />

              {/* East West Line (EWL) - Green */}
              <path
                d="M 120,420 L 380,410 L 480,440 L 620,380 L 880,310"
                fill="none"
                stroke="#009530"
                strokeWidth="3.5"
                opacity="0.8"
              />

              {/* North East Line (NEL) - Purple */}
              <path
                d="M 380,560 L 440,480 L 440,285 L 580,180 L 720,100"
                fill="none"
                stroke="#74007A"
                strokeWidth="3"
                opacity="0.75"
              />

              {/* Animated Transit Pulses along NSL Route */}
              <circle r="5" fill="#FFFFFF" filter="url(#softGlow)">
                <animateMotion
                  path="M 310,120 L 320,180 Q 360,250 440,285 T 480,440 L 510,540 L 730,590"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="4" fill="#FFCC00" filter="url(#softGlow)">
                <animateMotion
                  path="M 240,240 Q 340,190 440,285 T 590,340 Q 680,410 700,500 L 640,580"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}

          {/* Interactive MRT Station Nodes */}
          {(activeLayer === 'all' || activeLayer === 'mrt') && (
            <g>
              {/* Dhoby Ghaut Interchange Node (High Crowd Alert NS24/NE6/CC1) */}
              <g
                transform="translate(440, 285)"
                className="cursor-pointer"
                onClick={() => setSelectedEntity('Dhoby Ghaut Interchange')}
              >
                <circle cx="0" cy="0" r="18" fill="#FF3B30" opacity="0.35" className="animate-ping" />
                <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#FF3B30" strokeWidth="2.5" />
                <text x="0" y="3.5" fill="#dae2fd" fontSize="8" fontWeight="800" textAnchor="middle">
                  NS24
                </text>
              </g>

              {/* Bishan Station (Origin) */}
              <g
                transform="translate(315, 150)"
                className="cursor-pointer"
                onClick={() => setSelectedEntity('Bishan MRT (NS17/CC15)')}
              >
                <circle cx="0" cy="0" r="14" fill="#005baa" opacity="0.4" className="animate-pulse" />
                <circle cx="0" cy="0" r="8" fill="#005baa" stroke="#ffffff" strokeWidth="2" />
                <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
              </g>

              {/* Raffles Place Station */}
              <g
                transform="translate(480, 440)"
                className="cursor-pointer"
                onClick={() => setSelectedEntity('Raffles Place Interchange')}
              >
                <circle cx="0" cy="0" r="7" fill="#1E293B" stroke="#009530" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#D42E12" />
              </g>
            </g>
          )}

          {/* Taxis Scattered (Layer: Taxi) */}
          {(activeLayer === 'all' || activeLayer === 'taxi') && (
            <g>
              {[
                { x: 380, y: 280, id: 'SHB 4912K' },
                { x: 260, y: 320, id: 'SHA 8831T' },
                { x: 320, y: 360, id: 'SHC 1092M' },
                { x: 500, y: 310, id: 'SHD 5542P' },
                { x: 470, y: 410, id: 'SHB 2341R' },
                { x: 530, y: 470, id: 'SHA 9918B' },
                { x: 610, y: 340, id: 'SHC 7720L' },
                { x: 660, y: 490, id: 'SHD 3190C' },
              ].map((taxi, idx) => (
                <g
                  key={idx}
                  transform={`translate(${taxi.x}, ${taxi.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedEntity(`Taxi ${taxi.id} • Available (2 min away)`)}
                >
                  <rect
                    x="-10"
                    y="-10"
                    width="20"
                    height="20"
                    rx="5"
                    fill="#005BAA"
                    stroke="#a6c8ff"
                    strokeWidth="1"
                    className="group-hover:scale-125 transition-transform"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#ffffff"
                    fontFamily="Material Symbols Outlined"
                    fontSize="13"
                    textAnchor="middle"
                  >
                    local_taxi
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* SUMMARY ROUTE HIGHLIGHT & PINS */}
          {mode === 'summary' && (
            <g>
              {/* Recommended Transit Trajectory Curve */}
              <path
                d="M 315,150 Q 360,260 440,285 T 600,430 L 680,480"
                fill="none"
                stroke="#FFCC00"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#softGlow)"
              />

              {/* Start Pin: Current Location (Bishan) */}
              <g transform="translate(315, 150)">
                <circle cx="0" cy="0" r="16" fill="#005baa" opacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="11" fill="#005baa" stroke="#a6c8ff" strokeWidth="2" />
                <circle cx="0" cy="0" r="5" fill="#ffffff" />
                <rect x="18" y="-12" width="68" height="22" rx="4" fill="#171f33" stroke="#334155" strokeWidth="1" />
                <text x="24" y="3" fill="#dae2fd" fontFamily="Inter" fontSize="11" fontWeight="600">
                  {origin === 'Current Location' ? 'Current' : origin}
                </text>
              </g>

              {/* Destination Pin: Marina Bay Sands */}
              <g transform="translate(680, 480)">
                <path
                  d="M 0,-24 C 7,-24 12,-18 12,-11 C 12,-2 0,4 0,4 C 0,4 -12,-2 -12,-11 C -12,-18 -7,-24 0,-24 Z"
                  fill="#FFCC00"
                  filter="url(#softGlow)"
                />
                <circle cx="0" cy="-13" r="4.5" fill="#1E293B" />
                <rect x="16" y="-24" width="130" height="24" rx="4" fill="#1E293B" stroke="#FFCC00" strokeWidth="1" />
                <text x="24" y="-8" fill="#dae2fd" fontFamily="Inter" fontSize="12" fontWeight="700">
                  {destination}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Top Left Overlay: Layer Selector */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          id="map-layers-toggle"
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="bg-[#222a3d]/90 backdrop-blur-md border border-[#334155] text-[#dae2fd] px-3.5 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#2d3449] transition-colors shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#a6c8ff]">layers</span>
          <span>Map Layers</span>
          <span className="text-[10px] text-[#a6c8ff] uppercase bg-[#005baa]/40 px-1.5 py-0.5 rounded">
            {activeLayer}
          </span>
        </button>

        {showLayerMenu && (
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-2 shadow-2xl flex flex-col gap-1 w-44 z-30 animate-in fade-in zoom-in-95 duration-150">
            {[
              { id: 'all', label: 'All Overlays', icon: 'visibility' },
              { id: 'mrt', label: 'MRT Network', icon: 'train' },
              { id: 'taxi', label: 'Taxi Fleet', icon: 'local_taxi' },
              { id: 'heatmap', label: 'Volume Heatmap', icon: 'local_fire_department' },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => {
                  setActiveLayer(layer.id as any);
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left cursor-pointer transition-colors ${
                  activeLayer === layer.id
                    ? 'bg-[#005baa] text-[#bbd4ff] font-bold'
                    : 'text-[#c1c6d3] hover:bg-[#2d3449] hover:text-[#dae2fd]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top Right Overlay: Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          id="map-zoom-in"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 bg-[#222a3d]/90 backdrop-blur-md border border-[#334155] text-[#dae2fd] rounded-lg flex items-center justify-center hover:bg-[#2d3449] transition-colors shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
        <button
          id="map-zoom-out"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 bg-[#222a3d]/90 backdrop-blur-md border border-[#334155] text-[#dae2fd] rounded-lg flex items-center justify-center hover:bg-[#2d3449] transition-colors shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>
        <button
          id="map-zoom-reset"
          onClick={handleResetZoom}
          title="Reset View"
          className="w-9 h-9 bg-[#222a3d]/90 backdrop-blur-md border border-[#334155] text-[#a6c8ff] rounded-lg flex items-center justify-center hover:bg-[#2d3449] transition-colors shadow-lg cursor-pointer text-xs font-mono"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
      </div>

      {/* Selected Entity Info Popup */}
      {selectedEntity && (
        <div className="absolute top-16 left-4 z-20 bg-[#1E293B]/95 backdrop-blur-md border border-[#a6c8ff] rounded-xl p-3.5 shadow-2xl max-w-xs flex items-start gap-3">
          <span className="material-symbols-outlined text-[#a6c8ff] text-[22px] mt-0.5">info</span>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#dae2fd]">{selectedEntity}</h4>
            <p className="text-[11px] text-[#c1c6d3] mt-0.5">
              Real-time telemetry verified via LTA DataMall v2.
            </p>
          </div>
          <button
            onClick={() => setSelectedEntity(null)}
            className="text-[#8c919d] hover:text-white text-xs cursor-pointer p-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Status Pills & Contextual Explore Button */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#060e20] via-[#060e20]/80 to-transparent flex justify-between items-end pointer-events-none z-20">
        <div className="flex flex-wrap gap-2 pointer-events-auto">
          {/* PSI Index Pill */}
          <div className="bg-[#1E293B]/90 backdrop-blur-md border border-[#334155] px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse"></span>
            <span className="text-[12px] text-[#dae2fd] font-semibold tracking-wide">
              PSI: 42 (Good)
            </span>
          </div>

          {/* MRT Line Active Pill */}
          <div className="bg-[#1E293B]/90 backdrop-blur-md border border-[#334155] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D42E12]"></span>
            <span className="text-[12px] text-[#dae2fd] font-semibold">NSL Normal</span>
          </div>

          {/* CCL Line Pill */}
          <div className="bg-[#1E293B]/90 backdrop-blur-md border border-[#334155] px-3 py-1.5 rounded-full hidden sm:flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9A00]"></span>
            <span className="text-[12px] text-[#dae2fd] font-semibold">CCL Normal</span>
          </div>
        </div>

        {/* Floating Explore Action Button */}
        <button
          id="map-explore-btn"
          onClick={() => setSelectedEntity('Central Area Navigation • 12 Taxis & 6 MRT Lines Active')}
          className="bg-[#a6c8ff] text-[#00315f] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform pointer-events-auto cursor-pointer"
          title="Explore Area"
        >
          <span className="material-symbols-outlined text-[26px]">explore</span>
        </button>
      </div>
    </div>
  );
};
