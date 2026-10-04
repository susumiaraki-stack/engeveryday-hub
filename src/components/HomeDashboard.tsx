import React from 'react';
import { Flame, ArrowUpRight, Coffee, Plane, MessageSquare, Mic, Home, Compass, MessageCircle, User } from 'lucide-react';
import type { ScreenName } from '../types';

interface HomeDashboardProps {
  onNavigate: (screen: ScreenName) => void;
  xp: number;
  streak: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, xp, streak }) => {
  const [selectedLevel, setSelectedLevel] = React.useState<1 | 2>(1);

  return (
    <div className="flex flex-col min-h-full pb-20 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Mobile Status Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                👩‍🎓
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Good afternoon,</p>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Simphony</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full shadow-xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-orange-700">{streak}-Day Streak</span>
          </div>
        </div>

        {/* Level & XP Progress */}
        <div className="space-y-1.5 mb-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Level 3: Explorer</span>
            <span className="text-orange-600 font-bold">{xp} XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (xp / 500) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Daily Quest Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF7A50] via-[#FF6B4A] to-[#FF5E62] p-5 text-white shadow-lg shadow-orange-500/20">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-100 mb-2">
            <span>✨ DAILY QUEST</span>
          </div>
          <h3 className="text-lg font-bold leading-snug mb-4 max-w-[220px]">
            Today's Mission: Order a Drink at Starbucks (5 min)
          </h3>
          <button
            onClick={() => onNavigate('situation')}
            className="px-5 py-2.5 bg-white text-orange-600 text-sm font-bold rounded-xl shadow-md hover:bg-orange-50 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start Quest
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Level Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/60 rounded-xl text-xs font-bold text-center">
          <button
            onClick={() => setSelectedLevel(1)}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              selectedLevel === 1
                ? 'bg-[#FFECE4] text-[#E04F2E] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Level 1: Daily Survival <span className="block text-[10px] font-normal">(ม.ต้น)</span>
          </button>
          <button
            onClick={() => setSelectedLevel(2)}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              selectedLevel === 2
                ? 'bg-[#FFECE4] text-[#E04F2E] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Level 2: Real-World Social <span className="block text-[10px] font-normal">(ม.ปลาย)</span>
          </button>
        </div>

        {/* Choose a Situation Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-800">Choose a situation</h4>
            <span className="text-xs text-slate-400 font-medium">4 activities</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* 1. Cafe & Food */}
            <div
              onClick={() => onNavigate('situation')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-36 group"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                  <Coffee className="w-5 h-5 text-orange-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Cafe & Food</h5>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-600">
                  Beginner
                </span>
              </div>
            </div>

            {/* 2. Travel & Airport */}
            <div
              onClick={() => onNavigate('situation')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-36 group"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Travel & Airport</h5>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-600">
                  Intermediate
                </span>
              </div>
            </div>

            {/* 3. Real-Life Chat & Slang */}
            <div
              onClick={() => onNavigate('chat')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-36 group"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm leading-tight">Real-Life Chat & Slang</h5>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-600">
                  Practice now
                </span>
              </div>
            </div>

            {/* 4. Voice Lab Challenge */}
            <div
              onClick={() => onNavigate('voice')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-36 group"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                  <Mic className="w-5 h-5 text-purple-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm leading-tight">Voice Lab Challenge</h5>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-50 text-purple-600">
                  Practice now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal tracker bar */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🌟</span>
            <div>
              <span className="font-bold text-amber-900">Daily goal</span>
              <span className="text-amber-700/80 ml-2">1 of 3 quests complete</span>
            </div>
          </div>
          <span className="font-bold text-orange-600 bg-white px-2 py-1 rounded-md shadow-2xs">
            +40 XP
          </span>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2.5 flex justify-between items-center z-30">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex flex-col items-center gap-1 text-[#E04F2E] font-bold cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate('situation')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Quests</span>
        </button>

        <button
          onClick={() => onNavigate('chat')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px]">Chat</span>
        </button>

        <button
          onClick={() => onNavigate('teacher')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Teacher</span>
        </button>
      </div>
    </div>
  );
};
