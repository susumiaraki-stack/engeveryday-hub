import { useState } from 'react';
import type { ScreenName, VoiceSubmission } from './types';
import { HomeDashboard } from './components/HomeDashboard';
import { SituationRoom } from './components/SituationRoom';
import { VoiceLab } from './components/VoiceLab';
import { RealChatArena } from './components/RealChatArena';
import { TeacherPortal } from './components/TeacherPortal';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

const INITIAL_SUBMISSIONS: VoiceSubmission[] = [
  {
    id: '1',
    studentName: 'Nicha Srisuk',
    studentNo: 'No. 07 • ม.2/2',
    avatar: '👧',
    task: 'Order Coffee',
    submittedAt: 'Today, 10:15 AM',
    duration: '0:18s',
    fluencyScore: 4,
    appropriatenessScore: 5,
  },
  {
    id: '2',
    studentName: 'Punn Tanasiri',
    studentNo: 'No. 12 • ม.2/2',
    avatar: '👦',
    task: 'Order Coffee',
    submittedAt: 'Today, 11:20 AM',
    duration: '0:21s',
    fluencyScore: 3,
    appropriatenessScore: 4,
  },
  {
    id: '3',
    studentName: 'Mali Charoen',
    studentNo: 'No. 19 • ม.2/2',
    avatar: '👩',
    task: 'Order Coffee',
    submittedAt: 'Today, 01:05 PM',
    duration: '0:15s',
    fluencyScore: 5,
    appropriatenessScore: 5,
  },
  {
    id: '4',
    studentName: 'Beam Kittipong',
    studentNo: 'No. 31 • ม.2/2',
    avatar: '🧑',
    task: 'Order Coffee',
    submittedAt: 'Today, 02:40 PM',
    duration: '0:19s',
    fluencyScore: 4,
    appropriatenessScore: 4,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [xp, setXp] = useState(340);
  const [streak] = useState(5);
  const [submissions, setSubmissions] = useState<VoiceSubmission[]>(INITIAL_SUBMISSIONS);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const handleAddXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleAddSubmission = (newSub: VoiceSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-0 md:p-6 select-none font-sans">
      {/* Top Demo Bar for Testing (Only on desktop) */}
      <header className="hidden md:flex items-center justify-between w-full max-w-4xl mb-4 px-4 py-2.5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center font-bold text-white shadow-xs">
            E
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              EngEveryday Hub
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                CAR Research MVP
              </span>
            </h1>
          </div>
        </div>

        {/* Quick Screen Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentScreen === 'dashboard' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Home
          </button>
          <button
            onClick={() => setCurrentScreen('situation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentScreen === 'situation' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Situation
          </button>
          <button
            onClick={() => setCurrentScreen('voice')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentScreen === 'voice' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Voice Lab
          </button>
          <button
            onClick={() => setCurrentScreen('chat')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentScreen === 'chat' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Chat
          </button>
          <button
            onClick={() => setCurrentScreen('teacher')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentScreen === 'teacher' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            5. Teacher Portal
          </button>
        </div>

        {/* Device Frame Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`p-1.5 rounded-lg cursor-pointer ${
              isPhoneFrame ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="iPhone Mockup Frame"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`p-1.5 rounded-lg cursor-pointer ${
              !isPhoneFrame ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Full Width View"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Frame Wrapper */}
      <main
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[400px] h-[844px] max-h-[92vh] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden relative flex flex-col bg-[#faf8f5]'
            : 'max-w-2xl min-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-[#faf8f5]'
        }`}
      >
        {/* Dynamic Island / Notch on Phone Frame */}
        {isPhoneFrame && (
          <div className="w-full bg-[#faf8f5] pt-3 px-6 flex justify-between items-center text-[11px] font-bold text-slate-800 shrink-0 z-40 select-none">
            <span>9:41</span>
            <div className="w-24 h-5 bg-slate-900 rounded-full flex items-center justify-end px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex justify-end">
                <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Screen Routing */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {currentScreen === 'dashboard' && (
            <HomeDashboard onNavigate={setCurrentScreen} xp={xp} streak={streak} />
          )}

          {currentScreen === 'situation' && (
            <SituationRoom onNavigate={setCurrentScreen} onAddXp={handleAddXp} />
          )}

          {currentScreen === 'voice' && (
            <VoiceLab
              onNavigate={setCurrentScreen}
              onSubmitVoice={handleAddSubmission}
              onAddXp={handleAddXp}
            />
          )}

          {currentScreen === 'chat' && (
            <RealChatArena onNavigate={setCurrentScreen} onAddXp={handleAddXp} />
          )}

          {currentScreen === 'teacher' && (
            <TeacherPortal onNavigate={setCurrentScreen} submissions={submissions} />
          )}
        </div>

        {/* Home Indicator Bar on iPhone frame */}
        {isPhoneFrame && (
          <div className="w-full bg-[#faf8f5] py-2 flex justify-center shrink-0 z-40">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-4 text-center text-xs text-slate-500 hidden md:block">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          Designed for 4th Year Practicum • Classroom Action Research (CAR)
        </p>
      </footer>
    </div>
  );
}
