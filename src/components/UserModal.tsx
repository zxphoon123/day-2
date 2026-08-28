import React from 'react';
import { USER_PROFILE } from '../data/mockData';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33]">
          <h3 className="font-bold text-[#dae2fd]">Commuter Profile</h3>
          <button
            onClick={onClose}
            className="text-[#8c919d] hover:text-white p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <img
            src={USER_PROFILE.avatarUrl}
            alt="Sarah Chen"
            className="w-20 h-20 rounded-full object-cover border-4 border-[#a6c8ff] shadow-lg mb-3"
          />
          <h4 className="text-lg font-bold text-[#dae2fd]">{USER_PROFILE.name}</h4>
          <p className="text-xs text-[#c1c6d3] mt-0.5">{USER_PROFILE.role}</p>

          <div className="w-full bg-[#171f33] border border-[#334155] rounded-xl p-4 mt-5 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8c919d]">Home Transit Station:</span>
              <span className="font-semibold text-[#dae2fd]">{USER_PROFILE.homeLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c919d]">Default Office:</span>
              <span className="font-semibold text-[#dae2fd]">{USER_PROFILE.officeLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c919d]">EZ-Link / SimplyGo:</span>
              <span className="font-mono text-[#34C759] font-bold">CAN: •••• 8829 ($34.20)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c919d]">Proactive Alert Mode:</span>
              <span className="text-[#a6c8ff] font-bold">Enabled (Monsoon &amp; Peak)</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={onClose}
              className="bg-[#222a3d] hover:bg-[#2d3449] border border-[#334155] py-2 rounded-lg text-xs font-semibold text-[#dae2fd] cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="bg-[#005baa] hover:bg-[#004787] text-white py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
