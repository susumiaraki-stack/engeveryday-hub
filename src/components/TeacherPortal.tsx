import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Play,
  Pause,
  Star,
  MessageSquareCheck,
  Check,
  Filter,
  Database,
  RefreshCw,
  Sparkles,
  Inbox,
  Lock,
  Trash2,
} from 'lucide-react';
import type { ScreenName, VoiceSubmission } from '../types';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  updateSubmissionFeedbackInDB,
} from '../lib/supabase';

interface TeacherPortalProps {
  onNavigate: (screen: ScreenName) => void;
  submissions: VoiceSubmission[];
  onRefreshSubmissions: () => Promise<void>;
  onLockPortal: () => void;
  onClearLocalCache: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onNavigate,
  submissions,
  onRefreshSubmissions,
  onLockPortal,
  onClearLocalCache,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Supabase Settings Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseConfig().key);
  const [isConfigured, setIsConfigured] = useState(() => isSupabaseConfigured());

  const filteredSubmissions =
    selectedClassFilter === 'All'
      ? submissions
      : submissions.filter((s) => s.studentNo.includes(selectedClassFilter));

  const togglePlay = (sub: VoiceSubmission) => {
    if (playingId === sub.id) {
      setPlayingId(null);
    } else {
      setPlayingId(sub.id);

      if (sub.audioBlobUrl) {
        const audio = new Audio(sub.audioBlobUrl);
        audio.play().catch(() => {});
        audio.onended = () => setPlayingId(null);
      } else {
        setTimeout(() => {
          setPlayingId(null);
        }, 3000);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshSubmissions();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setIsConfigured(isSupabaseConfigured());
    setShowConfigModal(false);
    await handleRefresh();
  };

  const handleExportCSV = () => {
    const headers =
      'StudentID,StudentName,Task,SubmittedAt,Duration,FluencyScore,AppropriatenessScore,Transcription,AudioURL,Status\n';
    const rows = submissions
      .map(
        (s) =>
          `"${s.studentNo}","${s.studentName}","${s.task}","${s.submittedAt}","${s.duration}","${s.fluencyScore}/5","${s.appropriatenessScore}/5","${s.transcription || 'Completed'}","${s.audioBlobUrl || 'N/A'}","Reviewed"`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `CAR_Research_EngEveryday_Data_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleGiveFeedback = async (id: string) => {
    setFeedbackSuccessId(id);
    await updateSubmissionFeedbackInDB(id, 'Great pronunciation and tone!');
    setTimeout(() => {
      setFeedbackSuccessId(null);
    }, 2000);
  };

  // Real calculations
  const totalSubmissions = submissions.length;
  const gradedFluency = submissions.filter((s) => (s.fluencyScore || 0) > 0);
  const avgFluency =
    gradedFluency.length > 0
      ? (
          gradedFluency.reduce((acc, curr) => acc + (curr.fluencyScore || 0), 0) /
          gradedFluency.length
        ).toFixed(1)
      : '-';

  const gradedPoliteness = submissions.filter((s) => (s.appropriatenessScore || 0) > 0);
  const avgPoliteness =
    gradedPoliteness.length > 0
      ? (
          gradedPoliteness.reduce((acc, curr) => acc + (curr.appropriatenessScore || 0), 0) /
          gradedPoliteness.length
        ).toFixed(1)
      : '-';

  return (
    <div className="flex flex-col min-h-full pb-10 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Teacher Portal</h2>
            <span className="text-[10px] text-slate-400 font-medium">
              CAR Research & Assessment Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClearLocalCache}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            title="Clear old cached mockup data"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className={`px-2 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isConfigured ? 'DB: ON' : 'Connect DB'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={totalSubmissions === 0}
            className="px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[11px] font-bold rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            Export
          </button>

          <button
            onClick={onLockPortal}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Lock Portal (Sign Out)"
          >
            <Lock className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-w-lg mx-auto w-full">
        {/* Metric Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Active Submissions
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{totalSubmissions}</span>
              <span className="text-[10px] text-slate-400">total</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {totalSubmissions > 0 ? 'Data recorded' : 'Waiting for students'}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Database Status
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-800">
                {isConfigured ? 'Cloud Sync' : 'Local Mode'}
              </span>
            </div>
            <span className="text-[10px] text-orange-600 font-bold">
              {isConfigured ? 'Supabase Connected' : 'Stored in browser'}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Avg Speaking Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-600">{avgFluency}</span>
              <span className="text-[10px] text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">CAR Fluency metric</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Avg Politeness
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-blue-600">{avgPoliteness}</span>
              <span className="text-[10px] text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-blue-600 font-bold">Pragmatics metric</span>
          </div>
        </div>

        {/* Filter and Refresh Bar */}
        <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
            <div className="flex gap-1 ml-1">
              {['All', 'ม.1', 'ม.2', 'ม.3', 'ม.4'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    selectedClassFilter === cls
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer active:scale-95 transition-all"
            title="Refresh database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Voice Submissions Inbox */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900">
              Student Submissions ({filteredSubmissions.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Real Recorded Audio</span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">No submissions yet</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                When students complete a Voice Lab challenge and press "Submit to Teacher", their
                real recording and score will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((sub) => {
                const isPlaying = playingId === sub.id;
                const hasGivenFeedback = feedbackSuccessId === sub.id;

                return (
                  <div
                    key={sub.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-bold shadow-2xs">
                          {sub.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {sub.studentName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {sub.studentNo} • {sub.submittedAt}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-md">
                        {sub.task}
                      </span>
                    </div>

                    {/* Audio Player Bar */}
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                      <button
                        onClick={() => togglePlay(sub)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                          isPlaying
                            ? 'bg-orange-500 text-white animate-pulse'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="flex-1 flex items-center gap-1 h-5">
                        {[6, 12, 18, 10, 15, 8, 14, 20, 12, 6, 16, 10, 8, 14, 6].map(
                          (bar, idx) => (
                            <div
                              key={idx}
                              className={`w-1 rounded-full transition-all ${
                                isPlaying ? 'bg-orange-500' : 'bg-slate-300'
                              }`}
                              style={{ height: `${bar}px` }}
                            ></div>
                          )
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-600 font-bold">
                        {sub.duration}
                      </span>
                    </div>

                    {/* Speech Transcription */}
                    {sub.transcription && (
                      <div className="p-2.5 bg-slate-50/90 rounded-xl text-[11px] text-slate-700 italic border border-slate-200/60">
                        "{sub.transcription}"
                      </div>
                    )}

                    {/* Feedback if already given */}
                    {sub.feedback && (
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-[11px] text-emerald-900 font-medium">
                        <span className="font-bold block text-[10px] text-emerald-700 uppercase">
                          Teacher's Feedback:
                        </span>
                        {sub.feedback}
                      </div>
                    )}

                    {/* Interactive Rubric Scoring & Feedback Controls */}
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {/* Interactive Fluency Rating */}
                        <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700">Fluency (ความคล่องแคล่ว):</span>
                            <span className="font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                              {sub.fluencyScore > 0 ? `${sub.fluencyScore}/5` : 'รอให้คะแนน'}
                            </span>
                          </div>
                          <div className="flex gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={async () => {
                                  sub.fluencyScore = star;
                                  await updateSubmissionFeedbackInDB(sub.id, sub.feedback || '', star, sub.appropriatenessScore);
                                  handleRefresh();
                                }}
                                className="cursor-pointer hover:scale-125 transition-transform"
                                title={`ให้คะแนนความคล่องแคล่ว ${star}/5`}
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    star <= sub.fluencyScore
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-200 hover:text-amber-200'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Politeness Rating */}
                        <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700">Politeness (ความสุภาพ):</span>
                            <span className="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                              {sub.appropriatenessScore > 0 ? `${sub.appropriatenessScore}/5` : 'รอให้คะแนน'}
                            </span>
                          </div>
                          <div className="flex gap-1 text-emerald-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={async () => {
                                  sub.appropriatenessScore = star;
                                  await updateSubmissionFeedbackInDB(sub.id, sub.feedback || '', sub.fluencyScore, star);
                                  handleRefresh();
                                }}
                                className="cursor-pointer hover:scale-125 transition-transform"
                                title={`ให้คะแนนความสุภาพ ${star}/5`}
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    star <= sub.appropriatenessScore
                                      ? 'fill-emerald-500 text-emerald-500'
                                      : 'text-slate-200 hover:text-emerald-200'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Custom Teacher Feedback Form */}
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          defaultValue={sub.feedback || ''}
                          placeholder="พิมพ์ข้อเสนอแนะหรือคำชมให้นักเรียน..."
                          id={`feedback-input-${sub.id}`}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const inputEl = document.getElementById(`feedback-input-${sub.id}`) as HTMLInputElement;
                            const text = inputEl ? inputEl.value : 'Good job!';
                            sub.feedback = text;
                            await updateSubmissionFeedbackInDB(sub.id, text, sub.fluencyScore, sub.appropriatenessScore);
                            handleGiveFeedback(sub.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-2xs ${
                            hasGivenFeedback
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                          }`}
                        >
                          {hasGivenFeedback ? (
                            <>
                              <Check className="w-3 h-3" /> Saved!
                            </>
                          ) : (
                            <>
                              <MessageSquareCheck className="w-3 h-3" /> Save Feedback
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Research Ready Banner */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Classroom Action Research (CAR) Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All submitted speech recordings, fluency scores, and politeness ratings can be exported
            to CSV at any time for your thesis Chapter 4 data analysis.
          </p>
        </div>
      </div>

      {/* Supabase Connection Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveConfig}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Connect Supabase Cloud</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your Supabase Project credentials to sync student voice submissions online 24/7.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Project URL</label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Anon Public API Key</label>
              <textarea
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:border-emerald-500"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700"
              >
                Save & Sync
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
