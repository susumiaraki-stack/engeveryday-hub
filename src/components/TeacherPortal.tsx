import React, { useState, useEffect } from 'react';
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
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import type { ScreenName, VoiceSubmission, CarAssessmentRecord } from '../types';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  updateSubmissionFeedbackInDB,
  fetchCarAssessmentsFromDB,
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
  const [activeTab, setActiveTab] = useState<'voice' | 'car'>('voice');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // CAR Pre/Post Assessments
  const [carAssessments, setCarAssessments] = useState<CarAssessmentRecord[]>([]);

  // Supabase Settings Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseConfig().key);
  const [isConfigured, setIsConfigured] = useState(() => isSupabaseConfigured());

  const loadAssessments = async () => {
    const data = await fetchCarAssessmentsFromDB();
    setCarAssessments(data);
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const filteredSubmissions =
    selectedClassFilter === 'All'
      ? submissions
      : submissions.filter((s) => s.studentNo.includes(selectedClassFilter));

  const filteredAssessments =
    selectedClassFilter === 'All'
      ? carAssessments
      : carAssessments.filter((a) => a.grade.includes(selectedClassFilter));

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
    await loadAssessments();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setIsConfigured(isSupabaseConfigured());
    setShowConfigModal(false);
    await handleRefresh();
  };

  // Export Voice Recordings CSV
  const handleExportVoiceCSV = () => {
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
    downloadAnchor.setAttribute('download', `CAR_Voice_Submissions_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CAR Research Pre-test vs Post-test Comparison CSV
  const handleExportCarCSV = () => {
    const headers =
      'StudentName,Class,StudentNo,PreTest_Score,PreTest_Total,PostTest_Score,PostTest_Total,Gain_Score,Percentage_Improvement\n';

    // Group by student
    const studentMap = new Map<string, { pre?: CarAssessmentRecord; post?: CarAssessmentRecord }>();
    carAssessments.forEach((record) => {
      const key = `${record.studentName}_${record.grade}`;
      const entry = studentMap.get(key) || {};
      if (record.testType === 'pre') entry.pre = record;
      if (record.testType === 'post') entry.post = record;
      studentMap.set(key, entry);
    });

    const rows: string[] = [];
    studentMap.forEach((entry) => {
      const name = entry.pre?.studentName || entry.post?.studentName || 'Unknown';
      const grade = entry.pre?.grade || entry.post?.grade || '-';
      const no = entry.pre?.studentNo || entry.post?.studentNo || '-';
      const preScore = entry.pre ? entry.pre.score : '-';
      const preTotal = entry.pre ? entry.pre.total : '-';
      const postScore = entry.post ? entry.post.score : '-';
      const postTotal = entry.post ? entry.post.total : '-';
      const gain =
        entry.pre && entry.post ? (entry.post.score - entry.pre.score).toString() : '-';
      const percentGain =
        entry.pre && entry.post
          ? `${entry.post.percentage - entry.pre.percentage}%`
          : '-';

      rows.push(
        `"${name}","${grade}","${no}","${preScore}","${preTotal}","${postScore}","${postTotal}","${gain}","${percentGain}"`
      );
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `CAR_PrePost_Research_Statistics_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Real calculations for voice
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

  // CAR Pre/Post Calculations
  const preTests = filteredAssessments.filter((a) => a.testType === 'pre');
  const postTests = filteredAssessments.filter((a) => a.testType === 'post');
  const avgPre =
    preTests.length > 0
      ? (preTests.reduce((acc, c) => acc + c.score, 0) / preTests.length).toFixed(2)
      : '-';
  const avgPost =
    postTests.length > 0
      ? (postTests.reduce((acc, c) => acc + c.score, 0) / postTests.length).toFixed(2)
      : '-';

  const meanGain =
    avgPre !== '-' && avgPost !== '-'
      ? (parseFloat(avgPost) - parseFloat(avgPre)).toFixed(2)
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
            onClick={activeTab === 'voice' ? handleExportVoiceCSV : handleExportCarCSV}
            className="px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[11px] font-bold rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Export CSV</span>
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
        {/* Main Tabs Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/60 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('voice')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-white text-orange-600 shadow-2xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>ภารกิจอัดเสียง ({submissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('car')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'car'
                ? 'bg-white text-emerald-600 shadow-2xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>สถิติวิจัย CAR (Pre/Post)</span>
          </button>
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

        {/* TAB 1: Voice Submissions */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
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
                  Avg Fluency (ตรวจแล้ว)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-600">{avgFluency}</span>
                  <span className="text-[10px] text-slate-400">/ 5.0</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">CAR Fluency metric</span>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">
                  Avg Politeness (ตรวจแล้ว)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-blue-600">{avgPoliteness}</span>
                  <span className="text-[10px] text-slate-400">/ 5.0</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold">Pragmatics metric</span>
              </div>
            </div>

            {/* Submissions Inbox */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-900">Student Speech Submissions</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredSubmissions.length} recordings
                </span>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl border border-slate-200/80 text-center space-y-2 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-xl">
                    🎙️
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No submissions yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Student voice recordings from the Voice Lab will appear here for your review and grading.
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
                        className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 transition-all hover:border-slate-300"
                      >
                        {/* Student identity header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 flex items-center justify-center text-xl shadow-2xs">
                              {sub.avatar}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                {sub.studentName}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {sub.studentNo} • {sub.task}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">{sub.submittedAt}</span>
                            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                              {sub.duration}
                            </span>
                          </div>
                        </div>

                        {/* Audio Player & Waveform */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                          <button
                            onClick={() => togglePlay(sub)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                              isPlaying
                                ? 'bg-orange-500 text-white animate-pulse'
                                : 'bg-white text-slate-700 hover:bg-orange-50'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>

                          <div className="flex-1 flex items-center gap-1 h-6">
                            {[12, 20, 16, 24, 8, 18, 22, 14, 10, 24, 18, 12, 16, 8].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${
                                  isPlaying ? 'bg-orange-500' : 'bg-slate-300'
                                }`}
                                style={{ height: `${isPlaying ? Math.max(6, h * 0.9) : h * 0.5}px` }}
                              ></div>
                            ))}
                          </div>

                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {isPlaying ? 'Playing...' : 'Audio Ready'}
                          </span>
                        </div>

                        {/* Interactive Rubric Scoring */}
                        <div className="pt-2 border-t border-slate-100 space-y-2.5">
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            {/* Interactive Fluency Rating */}
                            <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-700">Fluency (ความคล่อง):</span>
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
                                      await updateSubmissionFeedbackInDB(
                                        sub.id,
                                        sub.feedback || '',
                                        star,
                                        sub.appropriatenessScore
                                      );
                                      handleRefresh();
                                    }}
                                    className="cursor-pointer hover:scale-125 transition-transform"
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
                                      await updateSubmissionFeedbackInDB(
                                        sub.id,
                                        sub.feedback || '',
                                        sub.fluencyScore,
                                        star
                                      );
                                      handleRefresh();
                                    }}
                                    className="cursor-pointer hover:scale-125 transition-transform"
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

                          {/* Editable Written Feedback */}
                          <div className="space-y-1.5">
                            <textarea
                              defaultValue={sub.feedback || ''}
                              placeholder="พิมพ์คำแนะนำและข้อเสนอแนะให้นักเรียนรายบุคคล..."
                              rows={2}
                              id={`fb-${sub.id}`}
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
                            />

                            <div className="flex justify-end">
                              <button
                                onClick={async () => {
                                  const text = (
                                    document.getElementById(`fb-${sub.id}`) as HTMLTextAreaElement
                                  )?.value;
                                  sub.feedback = text;
                                  await updateSubmissionFeedbackInDB(
                                    sub.id,
                                    text,
                                    sub.fluencyScore,
                                    sub.appropriatenessScore
                                  );
                                  setFeedbackSuccessId(sub.id);
                                  setTimeout(() => setFeedbackSuccessId(null), 2000);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1"
                              >
                                {hasGivenFeedback ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" /> บันทึกแล้ว!
                                  </>
                                ) : (
                                  <>
                                    <MessageSquareCheck className="w-3.5 h-3.5" /> บันทึก Feedback
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CAR Research Pre/Post Assessment Report */}
        {activeTab === 'car' && (
          <div className="space-y-4">
            {/* CAR Summary Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Pre-test (ก่อน)</span>
                <span className="text-xl font-black text-amber-600">{avgPre}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({preTests.length} คน)
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Post-test (หลัง)</span>
                <span className="text-xl font-black text-rose-600">{avgPost}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({postTests.length} คน)
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Mean Difference (+D)</span>
                <span className="text-xl font-black text-emerald-600">
                  {meanGain !== '-' && parseFloat(meanGain) > 0 ? `+${meanGain}` : meanGain}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">คะแนนพัฒนาการ</span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Export CSV</span>
                <button
                  onClick={handleExportCarCSV}
                  className="mt-1 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> ดาวน์โหลด
                </button>
              </div>
            </div>

            {/* Pre/Post Paired Student Table */}
            <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    ตารางเปรียบเทียบคะแนนก่อน-หลังเรียนรายบุคคล
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  One-Group Pre/Post Design
                </span>
              </div>

              {filteredAssessments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  ยังไม่มีข้อมูลแบบทดสอบ Pre/Post ในระบบ
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                        <th className="pb-2 font-bold">ชื่อนักเรียน</th>
                        <th className="pb-2 font-bold">ชั้น</th>
                        <th className="pb-2 font-bold text-center">Pre-test</th>
                        <th className="pb-2 font-bold text-center">Post-test</th>
                        <th className="pb-2 font-bold text-right">พัฒนาการ (+D)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Unique students */}
                      {Array.from(
                        new Set(filteredAssessments.map((a) => `${a.studentName}_${a.grade}`))
                      ).map((key) => {
                        const studentRecords = filteredAssessments.filter(
                          (a) => `${a.studentName}_${a.grade}` === key
                        );
                        const pre = studentRecords.find((r) => r.testType === 'pre');
                        const post = studentRecords.find((r) => r.testType === 'post');
                        const name = studentRecords[0]?.studentName || '';
                        const grade = studentRecords[0]?.grade || '';
                        const diff =
                          pre && post ? post.score - pre.score : null;

                        return (
                          <tr key={key} className="hover:bg-slate-50/70">
                            <td className="py-2.5 font-bold text-slate-900">{name}</td>
                            <td className="py-2.5 text-slate-500 text-[11px]">{grade}</td>
                            <td className="py-2.5 text-center font-semibold text-amber-700">
                              {pre ? `${pre.score}/${pre.total}` : '-'}
                            </td>
                            <td className="py-2.5 text-center font-semibold text-rose-700">
                              {post ? `${post.score}/${post.total}` : '-'}
                            </td>
                            <td className="py-2.5 text-right font-black">
                              {diff !== null ? (
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] ${
                                    diff >= 0
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {diff >= 0 ? `+${diff}` : diff} ({post!.percentage - pre!.percentage}%)
                                </span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Research Ready Banner */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Classroom Action Research (CAR) Data Hub</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ข้อมูลคลิปเสียง คะแนน Rubric และผลสัมฤทธิ์ Pre/Post Test
            สามารถกด Export เป็นไฟล์ CSV เพื่อนำไปวิเคราะห์สถิติ t-test และเขียนรายงานวิจัยในชั้นเรียนบทที่ 4–5 ได้ทันที
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
