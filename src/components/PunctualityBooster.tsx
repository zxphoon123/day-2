import React, { useState, useEffect, useRef } from 'react';
import { fetchPunctualityMotivation, getRandomPersonaMotivation, PunctualityMotivation } from '../services/api';

interface PunctualityBoosterProps {
  destination?: string;
  className?: string;
}

export const PunctualityBooster: React.FC<PunctualityBoosterProps> = ({
  destination = 'Marina Bay Sands',
  className = '',
}) => {
  const [selectedTone, setSelectedTone] = useState<'singlish' | 'inspirational' | 'witty' | 'zen'>('singlish');
  const [motivation, setMotivation] = useState<PunctualityMotivation>(() =>
    getRandomPersonaMotivation('singlish')
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(7);
  const [justClaimedBonus, setJustClaimedBonus] = useState<boolean>(false);
  const currentQuoteRef = useRef<string>(motivation.quote);

  const generateNewMessage = async (tone = selectedTone) => {
    setIsLoading(true);
    try {
      const data = await fetchPunctualityMotivation(
        tone,
        destination,
        0,
        currentQuoteRef.current
      );
      if (data && data.quote) {
        setMotivation(data);
        currentQuoteRef.current = data.quote;
      }
    } catch (e) {
      console.warn('Error generating message:', e);
      const fallback = getRandomPersonaMotivation(tone, currentQuoteRef.current);
      setMotivation(fallback);
      currentQuoteRef.current = fallback.quote;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToneChange = (tone: 'singlish' | 'inspirational' | 'witty' | 'zen') => {
    setSelectedTone(tone);
    // Instant responsive update from the chosen persona bank
    const instantPick = getRandomPersonaMotivation(tone, currentQuoteRef.current);
    setMotivation(instantPick);
    currentQuoteRef.current = instantPick.quote;
    // Also trigger asynchronous fetch / AI generation
    generateNewMessage(tone);
  };

  useEffect(() => {
    // Generate initial on destination change if needed
    generateNewMessage(selectedTone);
  }, [destination]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${motivation.quote}" — ${motivation.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimBonus = () => {
    if (!justClaimedBonus) {
      setStreakCount((prev) => prev + 1);
      setJustClaimedBonus(true);
      setTimeout(() => setJustClaimedBonus(false), 4000);
    }
  };

  const toneOptions: Array<{ id: 'singlish' | 'inspirational' | 'witty' | 'zen'; label: string; icon: string }> = [
    { id: 'singlish', label: '🇸🇬 Singlish', icon: 'local_cafe' },
    { id: 'inspirational', label: '🚀 High-Flyer', icon: 'trending_up' },
    { id: 'witty', label: '😄 Witty', icon: 'sentiment_very_satisfied' },
    { id: 'zen', label: '🧘 Zen Calm', icon: 'spa' },
  ];

  return (
    <div
      className={`bg-gradient-to-br from-[#171f33] to-[#121929] border border-[#2b3954] rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Subtle Background Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#005BAA]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#34C759]/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] flex items-center justify-center text-[#1E293B] shadow-md">
            <span className="material-symbols-outlined text-[20px] font-bold">bolt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#dae2fd] tracking-tight">
                Punctuality Encouragement
              </h3>
              <span className="bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {motivation.tag || 'Daily Motivation'}
              </span>
            </div>
            <p className="text-[12px] text-[#8c919d]">
              Custom AI pep talk to beat the rush &amp; arrive on time
            </p>
          </div>
        </div>

        {/* Streak & Bonus Button */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0b1326] border border-[#334155] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs text-[#dae2fd]">
            <span className="material-symbols-outlined text-[#FF9500] text-[16px]">local_fire_department</span>
            <span className="font-mono font-bold text-[#FFCC00]">{streakCount}d</span>
            <span className="text-[#8c919d] hidden sm:inline">Punctual Streak</span>
          </div>
          <button
            onClick={handleClaimBonus}
            disabled={justClaimedBonus}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              justClaimedBonus
                ? 'bg-[#34C759] text-white'
                : 'bg-[#1E293B] hover:bg-[#283548] text-[#34C759] border border-[#34C759]/30'
            }`}
            title="Log early arrival"
          >
            <span className="material-symbols-outlined text-[14px]">
              {justClaimedBonus ? 'check_circle' : 'add_task'}
            </span>
            <span>{justClaimedBonus ? 'On Time +5!' : 'I Reached Early'}</span>
          </button>
        </div>
      </div>

      {/* Tone Selectors */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none z-10 relative">
        {toneOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleToneChange(opt.id)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedTone === opt.id
                ? 'bg-[#005BAA] text-white shadow-sm border border-[#3b82f6]'
                : 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-[#c1c6d3] border border-transparent'
            }`}
          >
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Quote Display Area */}
      <div className="bg-[#0b1326]/80 border border-[#222d42] rounded-xl p-4 md:p-5 relative mb-3.5 z-10 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[#334155] text-[36px] absolute top-2 right-3 select-none pointer-events-none opacity-40">
          format_quote
        </span>

        <p className="text-[15px] md:text-[16px] font-medium text-[#dae2fd] leading-relaxed italic pr-6 min-h-[48px] flex items-center">
          {isLoading ? (
            <span className="inline-flex items-center gap-2 text-[#8c919d] not-italic">
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              Generating fresh encouragement for {destination}...
            </span>
          ) : (
            `"${motivation.quote}"`
          )}
        </p>

        <div className="mt-3 pt-3 border-t border-[#1e283d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#a6c8ff]">
            <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
            <span className="font-semibold">{motivation.author}</span>
          </div>

          {/* Practical Transit Micro-tip */}
          {motivation.punctualityTip && (
            <div className="text-[11px] text-[#c1c6d3] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#FFCC00] text-[14px]">tips_and_updates</span>
              <span>
                <strong className="text-[#e2e8f0]">Pro Tip:</strong> {motivation.punctualityTip}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-2 z-10 relative">
        <span className="text-[11px] text-[#8c919d]">
          Target: <strong className="text-[#dae2fd]">{destination}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#283548] border border-[#334155] text-xs font-semibold text-[#c1c6d3] hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => generateNewMessage(selectedTone)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#005BAA] to-[#0070D2] hover:from-[#004787] hover:to-[#005BAA] text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
              casino
            </span>
            <span>{isLoading ? 'Generating...' : 'Roll Next Message'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
