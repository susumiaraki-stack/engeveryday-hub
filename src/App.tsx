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
import { Sparkles, Home, Compass, MessageCircle, User } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Student',
  grade: 'ม.2/2',
  avatar: '👩‍🎓',
  xp: 0,
  streak: 1,
  completedQuests: [],
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);

  // Load real profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('eng_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Submissions: starts empty (no fake data!), loaded from Supabase or localStorage
  const [submissions, setSubmissions] = useState<VoiceSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('eng_submissions');
      return saved ? JSON.parse(saved) : [];
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
    // 1. Upload to Supabase
    const savedSub = await uploadAndSaveSubmission(newSub, audioBlob);

    // 2. Add to local state
    setSubmissions((prev) => [savedSub, ...prev]);
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

          {/* Quick Header Nav Links */}
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

            <button
              onClick={() => setCurrentScreen('teacher')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Teacher Portal</span>
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
          />
        )}
      </main>

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
