import React, { useState } from 'react';
import {
  Flame,
  ArrowUpRight,
  Coffee,
  Plane,
  MessageSquare,
  Mic,
  Home,
  Compass,
  User,
  Sparkles,
  Trophy,
  CheckCircle2,
  Edit2,
  MapPin,
  Pill,
  Inbox,
} from 'lucide-react';
import type { ScreenName, UserProfile, Scenario, VoiceSubmission } from '../types';
import { SCENARIOS } from '../data/scenarios';

interface HomeDashboardProps {
  onNavigate: (screen: ScreenName) => void;
  onSelectScenario: (scenario: Scenario) => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenLogin: () => void;
  submissions?: VoiceSubmission[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onSelectScenario,
  profile,
  onUpdateProfile,
  onOpenLogin,
  submissions = [],
}) => {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2>(1);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editGrade, setEditGrade] = useState(profile.grade);

  const filteredScenarios = SCENARIOS.filter((s) => s.level === selectedLevel);

  // Student's reviewed submissions count
  const mySubmissions = profile.isLoggedIn ? submissions.filter((s) => {
    return (
      s.studentName.toLowerCase() === profile.name.toLowerCase() ||
      s.studentNo === profile.grade ||
      s.studentNo === profile.studentNumber
    );
  }) : [];
  const reviewedCount = mySubmissions.filter(
    (s) => (s.fluencyScore || 0) > 0 || (s.appropriatenessScore || 0) > 0
  ).length;

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'cafe-order':
        return <Coffee className="w-5 h-5 text-orange-600" />;
      case 'airport-travel':
        return <Plane className="w-5 h-5 text-blue-600" />;
      case 'asking-directions':
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      case 'pharmacy-help':
        return <Pill className="w-5 h-5 text-purple-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: editName, grade: editGrade });
    setIsEditingProfile(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-24 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-slate-200/60 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div
            onClick={() => onOpenLogin()}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-white text-xl font-bold shadow-sm group-hover:scale-105 transition-transform">
                {profile.avatar}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                  profile.isLoggedIn ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              ></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-slate-400 font-medium">
                  {profile.isLoggedIn ? 'Student Profile' : 'Guest Mode'}
                </p>
                <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {profile.name}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {profile.grade}
                  {profile.isLoggedIn && profile.studentNumber && ` • No.${profile.studentNumber}`}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!profile.isLoggedIn ? (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-xs font-bold shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            ) : (
              <div
                onClick={() => onNavigate('leaderboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full shadow-2xs cursor-pointer hover:bg-amber-100 transition-colors"
                title="ดูกระดานอันดับ"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-700">{profile.streak}-Day Streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Guest Banner if not logged in */}
        {!profile.isLoggedIn && (
          <div className="mb-2 p-2 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-center justify-between text-[11px] text-amber-900">
            <span>👋 คุณกำลังใช้งานในฐานะ Guest (ไม่ระบุตัวตน)</span>
            <button
              onClick={onOpenLogin}
              className="text-xs font-bold text-orange-600 underline cursor-pointer"
            >
              ลงชื่อนักเรียน →
            </button>
          </div>
        )}

        {/* Level & XP Progress (Clickable to Leaderboard) */}
        <div
          onClick={() => onNavigate('leaderboard')}
          className="space-y-1.5 cursor-pointer group"
          title="แตะเพื่อดูกระดานผู้นำการเรียนรู้"
        >
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 group-hover:text-orange-600 transition-colors">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Level {Math.floor(profile.xp / 100) + 1}: Explorer (ดูกระดานอันดับ →)
            </span>
            <span className="text-orange-600 font-bold">{profile.xp} XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, ((profile.xp % 100) / 100) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Daily Quest Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF7A50] via-[#FF6B4A] to-[#FF5E62] p-5 sm:p-6 text-white shadow-xl shadow-orange-500/20">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-100 mb-2">
            <span>✨ DAILY MISSION</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold leading-snug mb-2 max-w-[280px]">
            Today's Mission: Order a Drink at Starbucks (5 min)
          </h3>
          <p className="text-xs text-orange-100/90 mb-4 max-w-sm">
            ฝึกสั่งเครื่องดื่ม ปรับความหวาน และจ่ายเงินเป็นภาษาอังกฤษอย่างสุภาพ
          </p>
          <button
            onClick={() => {
              onSelectScenario(SCENARIOS[0]);
              onNavigate('situation');
            }}
            className="px-5 py-2.5 bg-white text-orange-600 text-sm font-bold rounded-xl shadow-md hover:bg-orange-50 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start Mission
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Cards: 1) Teacher Feedback & 2) CAR Pre/Post Test */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Teacher Feedback */}
          <div
            onClick={() => onNavigate('feedback')}
            className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-xl shadow-2xs">
                📬
              </div>
              {reviewedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  ตรวจแล้ว {reviewedCount}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">ผลการตรวจของครู</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                ดูคะแนนดาว ⭐ และข้อเสนอแนะรายบุคคล
              </p>
              <span className="inline-block mt-2.5 text-[10px] font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                เปิดดูผลตรวจ →
              </span>
            </div>
          </div>

          {/* Card 2: CAR Pre/Post Test */}
          <div
            onClick={() => onNavigate('assessment')}
            className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-xl shadow-2xs">
                📊
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                CAR Test
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">แบบทดสอบ CAR</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                วัดผลสัมฤทธิ์ก่อน-หลังเรียน (Pre / Post)
              </p>
              <span className="inline-block mt-2.5 text-[10px] font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">
                เริ่มทำแบบทดสอบ →
              </span>
            </div>
          </div>
        </div>

        {/* Level Switcher Tabs */}
        <div>
          <div className="grid grid-cols-2 p-1.5 bg-slate-200/60 rounded-2xl text-xs font-bold text-center">
            <button
              onClick={() => setSelectedLevel(1)}
              className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                selectedLevel === 1
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Level 1: Daily Survival
              <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                ระดับ ม.ต้น (A1-A2)
              </span>
            </button>
            <button
              onClick={() => setSelectedLevel(2)}
              className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                selectedLevel === 2
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Level 2: Real-World Social
              <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                ระดับ ม.ปลาย (A2-B1)
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Scenario Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-bold text-slate-900">Choose a Situation</h4>
            <span className="text-xs text-slate-400 font-medium">
              {filteredScenarios.length} interactive rooms
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredScenarios.map((sc) => {
              const isCompleted = profile.completedQuests.includes(sc.id);
              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc);
                    onNavigate('situation');
                  }}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                      {getScenarioIcon(sc.id)}
                    </div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                      {sc.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                      {sc.description}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-orange-50 text-orange-700">
                      {sc.topic}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Practice Modules */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 px-1">Quick Practice Modules</h4>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Real-Life Chat */}
            <div
              onClick={() => onNavigate('chat')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm leading-tight">Chat Arena</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Slang & Texting</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded-md bg-emerald-50 text-emerald-700">
                  Live Messaging
                </span>
              </div>
            </div>

            {/* Voice Lab Challenge */}
            <div
              onClick={() => onNavigate('voice')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                  <Mic className="w-5 h-5 text-purple-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm leading-tight">Voice Lab</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Speaking Studio</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded-md bg-purple-50 text-purple-700">
                  Record & Submit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal tracker */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌟</span>
            <div>
              <span className="font-bold text-amber-950 block">Daily Goal Status</span>
              <span className="text-amber-800 text-[11px]">
                {profile.completedQuests.length} of 3 quests completed today
              </span>
            </div>
          </div>
          <span className="font-bold text-orange-600 bg-white px-3 py-1.5 rounded-xl shadow-2xs border border-orange-100">
            +{profile.completedQuests.length * 20} XP
          </span>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Edit Student Profile</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Student Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Class / Grade</label>
              <select
                value={editGrade}
                onChange={(e) => setEditGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
              >
                <option value="ม.1/1">ม.1/1</option>
                <option value="ม.2/2">ม.2/2</option>
                <option value="ม.3/1">ม.3/1</option>
                <option value="ม.4/1">ม.4/1</option>
                <option value="ม.5/2">ม.5/2</option>
                <option value="ม.6/1">ม.6/1</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2.5 flex justify-between items-center z-30 shadow-lg">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex flex-col items-center gap-0.5 text-orange-600 font-bold cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">หน้าหลัก</span>
        </button>

        <button
          onClick={() => {
            onSelectScenario(SCENARIOS[0]);
            onNavigate('situation');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">ฝึกสนทนา</span>
        </button>

        <button
          onClick={() => onNavigate('feedback')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 font-medium cursor-pointer relative"
        >
          <Inbox className="w-5 h-5" />
          <span className="text-[10px]">ผลตรวจ</span>
          {reviewedCount > 0 && (
            <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">อันดับ</span>
        </button>

        <button
          onClick={() => setIsEditingProfile(true)}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">โปรไฟล์</span>
        </button>
      </div>
    </div>
  );
};
