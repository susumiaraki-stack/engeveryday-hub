import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Flame,
  Crown,
  RefreshCw,
} from 'lucide-react';
import type { ScreenName, UserProfile, LeaderboardUser } from '../types';
import { fetchLeaderboardFromDB, syncStudentProfileToDB } from '../lib/supabase';

interface LeaderboardViewProps {
  onNavigate: (screen: ScreenName) => void;
  profile: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onNavigate,
  profile,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    // Sync current profile first
    await syncStudentProfileToDB(profile);

    const data = await fetchLeaderboardFromDB();
    // Merge current user if not already in data
    let merged = [...data];
    if (profile.isLoggedIn && !merged.some((u) => u.name === profile.name && u.grade === profile.grade)) {
      merged.push({
        id: 'me',
        name: profile.name,
        studentNo: profile.studentNumber,
        grade: profile.grade,
        avatar: profile.avatar,
        xp: profile.xp,
        streak: profile.streak,
      });
    }

    // Sort by XP descending
    merged.sort((a, b) => b.xp - a.xp);
    setUsers(merged);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [profile.xp]);

  const filteredUsers = users.filter((u) => {
    if (selectedClass === 'All') return true;
    return u.grade.startsWith(selectedClass);
  });

  const top3 = filteredUsers.slice(0, 3);

  return (
    <div className="flex flex-col min-h-full pb-16 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="text-center">
          <span className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest">
            CLASSROOM RANKING
          </span>
          <h2 className="text-sm font-bold text-slate-900">กระดานผู้นำการเรียนรู้</h2>
        </div>

        <button
          onClick={loadLeaderboard}
          disabled={isLoading}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
          title="รีเฟรชอันดับ"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-w-lg mx-auto w-full">
        {/* Class Filter Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl text-xs font-bold overflow-x-auto scrollbar-none">
          {['All', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedClass === cls
                  ? 'bg-white text-orange-600 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cls === 'All' ? 'ทุกห้องเรียน' : cls}
            </button>
          ))}
        </div>

        {/* Podium Top 3 */}
        {top3.length > 0 && (
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-center gap-2 sm:gap-3">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="flex flex-col items-center flex-1 max-w-[105px]">
                  <div className="relative mb-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 border-2 border-slate-300 flex items-center justify-center text-2xl shadow-sm">
                      {top3[1].avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                      2
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate w-full text-center mt-1">
                    {top3[1].name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{top3[1].grade}</span>
                  <div className="mt-1.5 w-full bg-slate-100 rounded-xl p-1.5 text-center border border-slate-200/80">
                    <span className="text-xs font-black text-slate-700">{top3[1].xp} XP</span>
                  </div>
                </div>
              )}

              {/* 1st Place (Gold Crown) */}
              {top3[0] && (
                <div className="flex flex-col items-center flex-1 max-w-[120px] -mt-4">
                  <Crown className="w-7 h-7 text-amber-500 fill-amber-400 animate-bounce mb-1" />
                  <div className="relative mb-1">
                    <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-500 border-3 border-amber-300 flex items-center justify-center text-3xl shadow-md shadow-amber-500/30">
                      {top3[0].avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black border-2 border-white shadow-xs">
                      1
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900 truncate w-full text-center mt-1">
                    {top3[0].name}
                  </span>
                  <span className="text-[10px] text-orange-600 font-bold">{top3[0].grade}</span>
                  <div className="mt-1.5 w-full bg-amber-50 rounded-xl p-2 text-center border border-amber-200 shadow-2xs">
                    <span className="text-sm font-black text-amber-900">{top3[0].xp} XP</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="flex flex-col items-center flex-1 max-w-[105px]">
                  <div className="relative mb-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-800 border-2 border-amber-700 flex items-center justify-center text-2xl shadow-sm">
                      {top3[2].avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                      3
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate w-full text-center mt-1">
                    {top3[2].name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{top3[2].grade}</span>
                  <div className="mt-1.5 w-full bg-slate-100 rounded-xl p-1.5 text-center border border-slate-200/80">
                    <span className="text-xs font-black text-slate-700">{top3[2].xp} XP</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Ranking List */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            อันดับผู้เรียนทั้งหมด ({filteredUsers.length} คน)
          </span>

          {filteredUsers.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              ยังไม่มีข้อมูลคะแนนในระดับชั้นนี้
            </div>
          ) : (
            filteredUsers.map((user, idx) => {
              const isCurrentUser =
                profile.isLoggedIn &&
                user.name.toLowerCase() === profile.name.toLowerCase() &&
                user.grade === profile.grade;

              return (
                <div
                  key={user.id || idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isCurrentUser
                      ? 'bg-orange-50/80 border-orange-300 shadow-xs ring-1 ring-orange-200'
                      : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center text-xs font-black ${
                        idx === 0
                          ? 'text-amber-500'
                          : idx === 1
                          ? 'text-slate-400'
                          : idx === 2
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      #{idx + 1}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-2xs">
                      {user.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 leading-none">
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded-md bg-orange-500 text-white text-[9px] font-bold">
                            คุณ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {user.grade} {user.studentNo && `• เลขที่ ${user.studentNo}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {user.streak > 1 && (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-orange-600">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                        <span>{user.streak}d</span>
                      </div>
                    )}
                    <span className="font-black text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-100">
                      {user.xp} XP
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
