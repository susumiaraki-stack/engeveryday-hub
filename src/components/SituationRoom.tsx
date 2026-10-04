import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Trophy,
} from 'lucide-react';
import type { ScreenName, Scenario } from '../types';
import { speakEnglish } from '../utils/speech';
import confetti from 'canvas-confetti';

interface SituationRoomProps {
  scenario: Scenario;
  onNavigate: (screen: ScreenName) => void;
  onAddXp: (amount: number) => void;
  onCompleteScenario: (scenarioId: string) => void;
}

export const SituationRoom: React.FC<SituationRoomProps> = ({
  scenario,
  onNavigate,
  onAddXp,
  onCompleteScenario,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];
  const totalSteps = scenario.steps.length;

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speakEnglish(currentStep.englishText, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleSelectOption = (opt: (typeof currentStep.options)[0]) => {
    setSelectedOptionId(opt.id);
    speakEnglish(opt.english);

    if (opt.isPolite) {
      onAddXp(opt.xp);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowTranslation(false);
    } else {
      setIsFinished(true);
      onCompleteScenario(scenario.id);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 text-center bg-[#faf8f5] space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-orange-500/20">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Scenario Complete!
          </span>
          <h2 className="text-2xl font-black text-slate-900">{scenario.title}</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You successfully completed all communicative dialogue steps with natural, polite responses!
          </p>
        </div>

        <div className="w-full max-w-sm p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Communication Score:</span>
            <span className="text-emerald-600 font-bold">100% Polite</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>XP Earned:</span>
            <span className="text-orange-600 font-bold">+50 XP</span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3 pt-2">
          <button
            onClick={() => onNavigate('voice')}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <Mic className="w-4 h-4" />
            Try Voice Lab Challenge
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 active:scale-98 transition-all cursor-pointer text-sm"
          >
            Back to Home Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-10 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="text-center">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
            {scenario.title}
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-rose-500">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5 max-w-lg mx-auto w-full">
        {/* Dialogue Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative">
          <div className="relative mb-3">
            <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 border-4 border-emerald-400/30 flex items-center justify-center text-3xl shadow-inner">
              {currentStep.avatar}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-600 text-[10px] text-white font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
              {currentStep.speakerRole}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-800 leading-relaxed mb-2 max-w-xs">
            "{currentStep.englishText}"
          </h3>

          {showTranslation && (
            <p className="text-xs text-slate-500 font-medium mb-3 bg-slate-50 p-2 rounded-xl w-full border border-slate-100">
              {currentStep.thaiTranslation}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isPlayingAudio ? 'Listening...' : 'Listen Audio'}
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showTranslation ? 'Hide Thai' : 'Show Thai'}
            </button>
          </div>
        </div>

        {/* Question & Choices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold text-slate-900">How would you respond?</h4>
            <span className="text-xs text-slate-400">Choose or speak</span>
          </div>

          {currentStep.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const letter = idx === 0 ? 'A' : 'B';

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? opt.isPolite
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-amber-50/70 border-amber-400 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        opt.isPolite
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {letter}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        "{opt.english}"
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 font-normal">
                        ({opt.thaiMeaning})
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      opt.isPolite
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {opt.isPolite ? 'Polite / Natural' : 'Too direct'}
                  </span>
                </div>

                {isSelected && (
                  <div
                    className={`mt-3 pt-3 border-t flex items-start gap-2 text-xs font-medium ${
                      opt.isPolite
                        ? 'border-emerald-200/60 text-emerald-900'
                        : 'border-amber-200 text-amber-900'
                    }`}
                  >
                    {opt.isPolite ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{opt.feedback}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Option C: Speak it yourself */}
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
                  🎙️ Tap to Speak in Voice Lab
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
              Voice Quest →
            </span>
          </div>
        </div>

        {/* Next Step / Complete button */}
        {selectedOptionId && (
          <button
            onClick={handleNextStep}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all cursor-pointer text-sm"
          >
            {currentStepIndex + 1 < totalSteps ? (
              <>
                Next Step
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Finish Scenario
              </>
            )}
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
              <span>Hint & Pragmatics Note</span>
            </div>
            {showHint ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showHint && (
            <div className="p-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-amber-50/20 leading-relaxed">
              <p>
                <strong>Cultural Insight:</strong> In English-speaking cultures, polite requests are often framed as questions ("Could you...", "May I...") rather than direct imperative statements.
              </p>
              <p>
                <strong>Magic Words:</strong> Adding "please", "thank you", and "have a good one" leaves a wonderful impression on service staff!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
