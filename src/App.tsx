import { useState, useEffect, useCallback } from 'react';
import type { ScreenName, VoiceSubmission, UserProfile, Scenario } from './types';
import { SCENARIOS } from './data/scenarios';
import { HomeDashboard } from './components/HomeDashboard';
import { SituationRoom } from './components/SituationRoom';
import { VoiceLab } from './components/VoiceLab';
import { RealChatArena } from './components/RealChatArena';
import { TeacherPortal } from './components/TeacherPortal';
import {
  fetchSubmissionsFromDB,
  uploadAndSaveSubmission,
} from './lib/supabase';
import {
  Sparkles,
  Home,
  Compass,
  MessageCircle,
  Lock,
  KeyRound,
  AlertCircle,
  X,
} from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Student',
  grade: 'ม.2/2',
  avatar: '👩‍🎓',
  xp: 0,
  streak: 1,
  completedQuests: [],
};

// Clean any old legacy mockup data from browser localStorage immediately
if (typeof window !== 'undefined') {
  try {
    const cached = localStorage.getItem('eng_submissions');
    if (
      cached &&
      (cached.includes('Nicha Srisuk') ||
        cached.includes('Punn Tanasiri') ||
        cached.includes('Mali Charoen'))
    ) {
      localStorage.removeItem('eng_submissions');
    }
  } catch {}
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);

  // Teacher Security Gate (PIN Protected)
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Load real profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('eng_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Real Submissions: starts clean/empty (no fake data!)
  const [submissions, setSubmissions] = useState<VoiceSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('eng_submissions');
      if (
        saved &&
        !saved.includes('Nicha Srisuk') &&
        !saved.includes('Punn Tanasiri')
      ) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Fetch real submissions from Supabase on mount
  const refreshSubmissions = useCallback(async () => {
    const data = await fetchSubmissionsFromDB();
    if (data && data.length > 0) {
      setSubmissions(data);
      try {
        localStorage.setItem('eng_submissions', JSON.stringify(data));
      } catch {}
    }
  }, []);

  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  // Save profile to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('eng_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [profile]);

  // Save submissions to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('eng_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [submissions]);

  const handleAddXp = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleCompleteScenario = (scenarioId: string) => {
    setProfile((prev) => ({
      ...prev,
      completedQuests: prev.completedQuests.includes(scenarioId)
        ? prev.completedQuests
        : [...prev.completedQuests, scenarioId],
      xp: prev.xp + 40,
    }));
  };

  const handleAddSubmission = async (newSub: VoiceSubmission, audioBlob?: Blob) => {
    const savedSub = await uploadAndSaveSubmission(newSub, audioBlob);
    setSubmissions((prev) => [savedSub, ...prev]);
  };

  // Teacher Access Check
  const handleTeacherAccessRequest = () => {
    if (isTeacherLoggedIn) {
      setCurrentScreen('teacher');
    } else {
      setPinInput('');
      setPinError(false);
      setShowPinModal(true);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = localStorage.getItem('teacher_pin') || '2026';

    if (pinInput.trim() === correctPin) {
      setIsTeacherLoggedIn(true);
      setShowPinModal(false);
      setCurrentScreen('teacher');
    } else {
      setPinError(true);
    }
  };

  const handleLockPortal = () => {
    setIsTeacherLoggedIn(false);
    setCurrentScreen('dashboard');
  };

  const handleClearLocalCache = () => {
    if (window.confirm('Clear all local browser cache and re-sync from Supabase?')) {
      localStorage.removeItem('eng_submissions');
      setSubmissions([]);
      refreshSubmissions();
    }
  };

  return (
    <div className="min-h-screen bg-[#f1efe9] text-slate-900 flex flex-col justify-between font-sans selection:bg-orange-200">
      {/* Top Application Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div
            onClick={() => setCurrentScreen('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center font-black text-white shadow-xs group-hover:scale-105 transition-transform text-sm">
              E
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                EngEveryday Hub
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  Everyday Communicative English
                </span>
              </h1>
            </div>
          </div>

          {/* Header Navigation Links */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'dashboard'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen('situation')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'situation'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Practice</span>
            </button>

            <button
              onClick={() => setCurrentScreen('chat')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'chat'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </button>

            {/* Teacher Gate Button (Locked with PIN) */}
            <button
              onClick={handleTeacherAccessRequest}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Teacher Access (PIN Protected)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Teacher</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive App Container */}
      <main className="w-full max-w-2xl mx-auto flex-1 bg-[#faf8f5] shadow-xl sm:my-4 sm:rounded-3xl sm:border border-slate-200/80 overflow-hidden flex flex-col relative min-h-[85vh]">
        {currentScreen === 'dashboard' && (
          <HomeDashboard
            onNavigate={setCurrentScreen}
            onSelectScenario={(sc) => setActiveScenario(sc)}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {currentScreen === 'situation' && (
          <SituationRoom
            scenario={activeScenario}
            onNavigate={setCurrentScreen}
            onAddXp={handleAddXp}
            onCompleteScenario={handleCompleteScenario}
          />
        )}

        {currentScreen === 'voice' && (
          <VoiceLab
            scenario={activeScenario}
            profile={profile}
            onNavigate={setCurrentScreen}
            onSubmitVoice={handleAddSubmission}
            onAddXp={handleAddXp}
          />
        )}

        {currentScreen === 'chat' && (
          <RealChatArena onNavigate={setCurrentScreen} onAddXp={handleAddXp} />
        )}

        {currentScreen === 'teacher' && (
          <TeacherPortal
            onNavigate={setCurrentScreen}
            submissions={submissions}
            onRefreshSubmissions={refreshSubmissions}
            onLockPortal={handleLockPortal}
            onClearLocalCache={handleClearLocalCache}
          />
        )}
      </main>

      {/* Teacher PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleVerifyPin}
            className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Security Check
              </span>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs border border-amber-200/60">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Teacher Access Only</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter teacher PIN to access student submissions & research data.
              </p>
            </div>

            <div className="space-y-1">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (Default: 2026)"
                className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500"
                autoFocus
                required
              />
              {pinError && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center justify-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              Unlock Portal
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>EngEveryday Hub • Classroom Action Research Platform (CAR)</span>
        </p>
      </footer>
    </div>
  );
}
