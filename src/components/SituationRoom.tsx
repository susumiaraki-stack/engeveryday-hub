import React, { useState } from 'react';
import { ArrowLeft, Volume2, Mic, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { ScreenName } from '../types';
import { speakEnglish } from '../utils/speech';

interface SituationRoomProps {
  onNavigate: (screen: ScreenName) => void;
  onAddXp: (amount: number) => void;
}

export const SituationRoom: React.FC<SituationRoomProps> = ({ onNavigate, onAddXp }) => {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const baristaQuestion = "Hi there! Welcome to Brew & Co. What can I get started for you today? ☕";

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speakEnglish(baristaQuestion, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleSelectOption = (opt: 'A' | 'B') => {
    setSelectedOption(opt);
    if (opt === 'A' && !isCompleted) {
      speakEnglish("I'd like an iced caramel macchiato with oat milk, please.");
      onAddXp(15);
      setIsCompleted(true);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">At the Coffee Shop</h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-rose-500">Step 2 of 5</span>
          <div className="w-14 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="w-2/5 h-full bg-rose-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Dialogue Card (Barista Avatar + Speech Bubble) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 border-4 border-emerald-400/30 flex items-center justify-center text-3xl shadow-inner">
              👩‍🍳
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-600 text-[10px] text-white font-bold rounded-full uppercase tracking-wider">
              Barista
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-800 leading-relaxed mb-4 max-w-xs">
            "{baristaQuestion}"
          </h3>

          <button
            onClick={handlePlayAudio}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {isPlayingAudio ? 'Listening...' : 'Listen'}
          </button>
        </div>

        {/* Question & Choices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold text-slate-800">How would you respond?</h4>
            <span className="text-xs text-slate-400">Choose or speak</span>
          </div>

          {/* Option A (Polite / Natural) */}
          <div
            onClick={() => handleSelectOption('A')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedOption === 'A'
                ? 'bg-emerald-50/60 border-emerald-500 shadow-sm'
                : 'bg-white border-slate-200/80 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  A
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    "I'd like an iced caramel macchiato with oat milk, please."
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md">
                Polite / Natural
              </span>
            </div>

            {selectedOption === 'A' && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Excellent! You used "I'd like..." and "please" which sounds very polite!</span>
              </div>
            )}
          </div>

          {/* Option B (Too direct) */}
          <div
            onClick={() => handleSelectOption('B')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedOption === 'B'
                ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                : 'bg-white border-slate-200/80 hover:border-amber-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  B
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    "Give me iced coffee."
                  </p>
                  <p className="text-xs text-amber-700 mt-1 font-medium">
                    Try "Could I have..." to sound friendlier.
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md">
                Too direct
              </span>
            </div>

            {selectedOption === 'B' && (
              <div className="mt-3 pt-3 border-t border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>In English, "Give me..." can sound demanding or rude to service staff.</span>
              </div>
            )}
          </div>

          {/* Option C: Speak it yourself (Navigates to Voice Lab) */}
          <div
            onClick={() => onNavigate('voice')}
            className="p-4 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  C. SPEAK IT YOURSELF
                </span>
                <span className="text-sm font-bold text-slate-800">
                  🎙️ Tap to Speak Your Answer
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
              Voice Quest →
            </span>
          </div>
        </div>

        {/* Complete button */}
        {selectedOption === 'A' && (
          <button
            onClick={() => onNavigate('voice')}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            Complete this step • +15 XP
          </button>
        )}

        {/* Hint & Vocabulary Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>Hint & Vocabulary</span>
              <span className="text-[11px] text-slate-400 font-normal">order politely • oat milk • iced / hot</span>
            </div>
            {showHint ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showHint && (
            <div className="p-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-amber-50/20">
              <p>
                <strong>Phrases to use:</strong> "Could I get a...", "I'd like to order a...", "Can I please have..."
              </p>
              <p>
                <strong>Customization:</strong> "with oat milk", "less sweet (หวานน้อย)", "extra shot"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
