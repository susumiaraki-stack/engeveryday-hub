import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Star,
  Clock,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Mic,
  Lock,
} from 'lucide-react';
import type { ScreenName, VoiceSubmission, UserProfile } from '../types';

interface StudentFeedbackViewProps {
  onNavigate: (screen: ScreenName) => void;
  submissions: VoiceSubmission[];
  profile: UserProfile;
}

export const StudentFeedbackView: React.FC<StudentFeedbackViewProps> = ({
  onNavigate,
  submissions,
  profile,
}) => {
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'pending'>('all');

  // Filter submissions by current student if logged in, block guests entirely
  const studentSubmissions = profile.isLoggedIn
    ? submissions.filter((sub) => {
        return (
          sub.studentName.toLowerCase() === profile.name.toLowerCase() ||
          sub.studentNo === profile.grade ||
          sub.studentNo === profile.studentNumber
        );
      })
    : [];

  const reviewedCount = studentSubmissions.filter(
    (s) => (s.fluencyScore || 0) > 0 || (s.appropriatenessScore || 0) > 0
  ).length;

  const filtered = studentSubmissions.filter((sub) => {
    const isReviewed = (sub.fluencyScore || 0) > 0 || (sub.appropriatenessScore || 0) > 0;
    if (filter === 'reviewed') return isReviewed;
    if (filter === 'pending') return !isReviewed;
    return true;
  });

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
            MY LEARNING PROGRESS
          </span>
          <h2 className="text-sm font-bold text-slate-900">ผลการประเมินจากคุณครู</h2>
        </div>

        <div className="w-9"></div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-w-lg mx-auto w-full">
        {/* Student Summary Card */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 rounded-3xl text-white shadow-lg shadow-orange-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-xs">
              {profile.avatar}
            </div>
            <div>
              <span className="text-[10px] text-orange-100 font-bold uppercase tracking-wider block">
                {profile.isLoggedIn ? 'Student Submissions' : 'Guest Submissions'}
              </span>
              <h3 className="font-bold text-base leading-tight">{profile.name}</h3>
              <p className="text-[11px] text-orange-100/90 mt-0.5">
                {profile.grade} {profile.studentNumber && `• เลขที่ ${profile.studentNumber}`}
              </p>
            </div>
          </div>

          <div className="text-right bg-white/15 px-3 py-2 rounded-2xl border border-white/20">
            <span className="text-[10px] text-orange-100 font-bold block">ตรวจแล้ว</span>
            <span className="text-xl font-black">
              {reviewedCount} <span className="text-xs font-normal">/ {studentSubmissions.length}</span>
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-orange-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ทั้งหมด ({studentSubmissions.length})
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'reviewed'
                ? 'bg-white text-emerald-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ตรวจแล้ว ({reviewedCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-amber-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            รอตรวจ ({studentSubmissions.length - reviewedCount})
          </button>
        </div>

        {/* Submissions List */}
        {!profile.isLoggedIn ? (
          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl text-center space-y-3 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center mx-auto text-2xl border border-slate-100">
              <Lock className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">ส่วนนี้สำหรับนักเรียนที่เข้าสู่ระบบ</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              กรุณาเข้าสู่ระบบด้วยข้อมูลนักเรียนเพื่อดูผลการตรวจและคำติชมจากคุณครูแบบส่วนตัว
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600 cursor-pointer inline-flex items-center gap-1.5"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl text-center space-y-3 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-2xl">
              🎙️
            </div>
            <h4 className="font-bold text-slate-800 text-sm">ยังไม่พบคลิปเสียงที่ส่ง</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              ลองเข้าห้องสนทนาและบันทึกเสียงใน Voice Lab แล้วส่งให้คุณครูตรวจประเมินได้เลย!
            </p>
            <button
              onClick={() => onNavigate('situation')}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5" /> ไปที่ห้องฝึกพูด
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filtered.map((sub) => {
              const isReviewed = (sub.fluencyScore || 0) > 0 || (sub.appropriatenessScore || 0) > 0;

              return (
                <div
                  key={sub.id}
                  className="p-4 bg-white border border-slate-200/80 rounded-3xl shadow-2xs space-y-3 transition-all hover:border-orange-200"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Speaking Task
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{sub.task}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {sub.submittedAt}
                        </span>
                        <span>•</span>
                        <span>ความยาว: {sub.duration}</span>
                      </div>
                    </div>

                    {isReviewed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> คุณครูตรวจแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> รอครูตรวจ
                      </span>
                    )}
                  </div>

                  {/* Audio Player */}
                  {sub.audioBlobUrl && (
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-orange-500" /> คลิปเสียงของคุณ
                        </span>
                      </div>
                      <audio controls src={sub.audioBlobUrl} className="w-full h-8" />
                    </div>
                  )}

                  {/* Teacher Feedback & Rubric Scores (if reviewed) */}
                  {isReviewed ? (
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      {/* Rubric Score Badges */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/70">
                          <span className="text-[10px] font-bold text-amber-900 block mb-1">
                            Fluency (ความคล่องแคล่ว):
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= sub.fluencyScore
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-bold text-amber-800 ml-1">
                              {sub.fluencyScore}/5
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70">
                          <span className="text-[10px] font-bold text-emerald-900 block mb-1">
                            Politeness (ความสุภาพ):
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= sub.appropriatenessScore
                                    ? 'fill-emerald-500 text-emerald-500'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-bold text-emerald-800 ml-1">
                              {sub.appropriatenessScore}/5
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Teacher's Written Feedback Box */}
                      {sub.feedback && (
                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                            <MessageSquare className="w-3.5 h-3.5" /> คำแนะนำจากคุณครู:
                          </div>
                          <p className="leading-relaxed font-medium pl-1 italic">
                            "{sub.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-[11px] text-amber-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>คุณครูกำลังรับฟังคลิปเสียงและจะประเมินคะแนนพร้อมคำติชมให้เร็วๆ นี้</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
