import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, Mic, RotateCcw, Send, CheckCircle, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ScreenName, VoiceSubmission } from '../types';
import { speakEnglish } from '../utils/speech';

interface VoiceLabProps {
  onNavigate: (screen: ScreenName) => void;
  onSubmitVoice: (submission: VoiceSubmission) => void;
  onAddXp: (amount: number) => void;
}

export const VoiceLab: React.FC<VoiceLabProps> = ({ onNavigate, onSubmitVoice, onAddXp }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(15);
  const [hasRecorded, setHasRecorded] = useState(true);
  const [takeCount, setTakeCount] = useState(2);
  const [isListeningModel, setIsListeningModel] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const modelPhrase = "Could you make it less sweet, please?";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleListenModel = () => {
    setIsListeningModel(true);
    speakEnglish(modelPhrase, () => {
      setIsListeningModel(false);
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setHasRecorded(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordedSeconds(0);
      setHasRecorded(false);
      setTakeCount((prev) => prev + 1);

      timerRef.current = window.setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev >= 30) {
            setIsRecording(false);
            setHasRecorded(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecordedSeconds(0);
    setHasRecorded(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onAddXp(25);

    onSubmitVoice({
      id: Date.now().toString(),
      studentName: 'Simphony (You)',
      studentNo: 'No. 01 • ม.2/2',
      avatar: '👩‍🎓',
      task: 'Order Coffee (Less Sweet)',
      submittedAt: 'Just now',
      duration: `0:${recordedSeconds < 10 ? '0' : ''}${recordedSeconds}s`,
      fluencyScore: 5,
      appropriatenessScore: 5,
      feedback: 'Great intonation on "less sweet"!',
    });

    setTimeout(() => {
      onNavigate('dashboard');
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => onNavigate('situation')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="text-center">
          <span className="block text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            VOICE LAB
          </span>
          <h2 className="text-sm font-bold text-slate-900">Daily Voice Mission</h2>
        </div>

        <div className="w-9"></div>
      </div>

      <div className="p-5 space-y-4">
        {/* Mission Card */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider mb-1">
              TODAY'S CHALLENGE
            </span>
            <p className="text-xs font-bold text-slate-800 leading-snug">
              Challenge: Tell the barista you want less sweet (หวานน้อย)
            </p>
          </div>
        </div>

        {/* Model Phrase Guide */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span>✨</span> MODEL PHRASE GUIDE
            </span>
            <span className="text-[10px] font-medium text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md">
              หวานน้อย
            </span>
          </div>

          <p className="text-base font-bold text-slate-900 mb-3 tracking-tight">
            "{modelPhrase}"
          </p>

          <button
            onClick={handleListenModel}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isListeningModel
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-white text-emerald-800 hover:bg-emerald-100/50 shadow-2xs'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            {isListeningModel ? 'Playing...' : 'Listen Model Audio'}
          </button>
        </div>

        {/* Audio Recording Studio Card */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between text-xs font-semibold mb-6">
            <span className="flex items-center gap-1.5 text-rose-500 font-bold">
              <span className={`w-2.5 h-2.5 rounded-full bg-rose-500 ${isRecording ? 'animate-ping' : ''}`}></span>
              {isRecording ? 'Recording...' : 'Recorded'}
            </span>
            <span className="text-slate-400">Take {takeCount}</span>
          </div>

          {/* Large Mic Button */}
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-lg ${
              isRecording
                ? 'bg-rose-500 text-white scale-110 shadow-rose-500/40 animate-pulse'
                : 'bg-rose-500 text-white hover:scale-105 shadow-rose-500/25 active:scale-95'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>

          {/* Audio Waveform Animation */}
          <div className="flex items-center gap-1 h-12 my-5">
            {[4, 8, 12, 18, 24, 16, 20, 26, 18, 12, 22, 14, 20, 8, 4].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isRecording
                    ? 'bg-rose-500'
                    : hasRecorded
                    ? 'bg-orange-300'
                    : 'bg-slate-200'
                }`}
                style={{
                  height: isRecording ? `${Math.max(6, (h * Math.random() * 1.5))}px` : `${h}px`,
                }}
              ></div>
            ))}
          </div>

          {/* Timer */}
          <p className="text-xs font-bold text-slate-700 mb-1">
            00:{recordedSeconds < 10 ? `0${recordedSeconds}` : recordedSeconds} / 00:30s max
          </p>
          <span className="text-[10px] text-slate-400 mb-5">
            {isRecording ? 'Tap mic to finish' : 'Tap mic to re-record'}
          </span>

          {/* Bottom Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleReset}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Re-record
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitted ? 'Submitted!' : 'Submit to Teacher'}
            </button>
          </div>
        </div>

        {/* Speaking Tip */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-2xl flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Speaking tip: </span>
            Stress "less sweet" and end softly on "please".
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Voice Submitted!</h3>
            <p className="text-xs text-slate-500 mb-4">
              Your recording has been sent to your teacher's portal for feedback. (+25 XP)
            </p>
            <div className="w-full bg-orange-50 text-orange-700 py-2 rounded-xl text-xs font-bold">
              Returning to Home...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
