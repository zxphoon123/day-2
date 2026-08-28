import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a6c8ff]">help</span>
            <h3 className="font-bold text-[#dae2fd]">SG Commuter Pro Help &amp; Transit Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c919d] hover:text-white p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#c1c6d3]">
          <div className="bg-[#171f33] p-3.5 rounded-xl border border-[#334155]">
            <h4 className="font-bold text-[#dae2fd] text-sm mb-1">
              Smart Proactive Transit Recommendations
            </h4>
            <p>
              The portal integrates Singapore National Environment Agency (NEA) weather radars with LTA DataMall turnstile crowd densities to predict fare surges and recommend the driest, fastest commute.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#dae2fd]">Quick Legend &amp; Identifiers:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D42E12]"></span>
                <span>NSL: North South Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#009530]"></span>
                <span>EWL: East West Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF9A00]"></span>
                <span>CCL: Circle Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#74007A]"></span>
                <span>NEL: North East Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#005EC4]"></span>
                <span>DTL: Downtown Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#733510]"></span>
                <span>TEL: Thomson-East Coast</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#005baa]/20 border border-[#a6c8ff]/30 rounded-xl text-[#bbd4ff]">
            Need emergency transit assistance? Contact TransitLink Hotline at <span className="font-bold">1800-2255-663</span> or MRT Station Control.
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#a6c8ff] text-[#00315f] font-bold py-2.5 rounded-lg text-xs hover:bg-[#bbd4ff] transition-colors cursor-pointer"
          >
            Got it, return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
