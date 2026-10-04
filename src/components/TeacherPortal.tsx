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
} from 'lucide-react';
import type { ScreenName, VoiceSubmission } from '../types';

interface TeacherPortalProps {
  onNavigate: (screen: ScreenName) => void;
  submissions: VoiceSubmission[];
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onNavigate, submissions }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

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
        audio.play();
        audio.onended = () => setPlayingId(null);
      } else {
        // Simulated playback duration
        setTimeout(() => {
          setPlayingId(null);
        }, 3000);
      }
    }
  };

  const handleExportCSV = () => {
    const headers =
      'StudentID,StudentName,Task,SubmittedAt,Duration,FluencyScore,AppropriatenessScore,Transcription,Status\n';
    const rows = submissions
      .map(
        (s) =>
          `"${s.studentNo}","${s.studentName}","${s.task}","${s.submittedAt}","${s.duration}","${s.fluencyScore}/5","${s.appropriatenessScore}/5","${s.transcription || 'Completed'}","Reviewed"`
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

  const handleGiveFeedback = (id: string) => {
    setFeedbackSuccessId(id);
    setTimeout(() => {
      setFeedbackSuccessId(null);
    }, 2000);
  };

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

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-w-lg mx-auto w-full">
        {/* Metric Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Active Learners
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">38 / 40</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">95% completion rate</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Class Submissions
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{submissions.length}</span>
              <span className="text-[10px] text-slate-400">total</span>
            </div>
            <span className="text-[10px] text-orange-600 font-bold">Active CAR Cycle</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Speaking Accuracy
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-600">4.5 / 5.0</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">+1.5 from Pre-test</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Politeness Rating
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-blue-600">4.8 / 5.0</span>
            </div>
            <span className="text-[10px] text-blue-600 font-bold">Natural pragmatics</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Class Filter:</span>
          </div>
          <div className="flex gap-1">
            {['All', 'ม.2', 'ม.4'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassFilter(cls)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  selectedClassFilter === cls
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Submissions Inbox */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900">
              Student Submissions ({filteredSubmissions.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Click to Play & Evaluate</span>
          </div>

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
                        isPlaying ? 'bg-orange-500 text-white animate-pulse' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    {/* Waveform indicator */}
                    <div className="flex-1 flex items-center gap-1 h-5">
                      {[6, 12, 18, 10, 15, 8, 14, 20, 12, 6, 16, 10, 8, 14, 6].map((bar, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-full transition-all ${
                            isPlaying ? 'bg-orange-500' : 'bg-slate-300'
                          }`}
                          style={{ height: `${bar}px` }}
                        ></div>
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-slate-600 font-bold">
                      {sub.duration}
                    </span>
                  </div>

                  {/* Transcription if available */}
                  {sub.transcription && (
                    <div className="p-2 bg-slate-50/80 rounded-lg text-[11px] text-slate-600 italic border border-slate-100">
                      "{sub.transcription}"
                    </div>
                  )}

                  {/* Rubric Score & Feedback Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="font-semibold w-16">Fluency:</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < sub.fluencyScore
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="font-semibold w-16">Politeness:</span>
                        <div className="flex text-emerald-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < sub.appropriatenessScore
                                  ? 'fill-emerald-500 text-emerald-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGiveFeedback(sub.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                        hasGivenFeedback
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                      }`}
                    >
                      {hasGivenFeedback ? (
                        <>
                          <Check className="w-3 h-3" /> Sent!
                        </>
                      ) : (
                        <>
                          <MessageSquareCheck className="w-3 h-3" /> Send Feedback
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Research Analytics Graph */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              CAR ACTION RESEARCH ANALYTICS
            </span>
            <span className="text-[10px] text-slate-400 font-medium">8-Week Cycle</span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            Speaking Fluency & Anxiety: Pre-test vs Post-intervention
          </h4>

          {/* Metric 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
              <span>Speaking Confidence (FLSA Reduction)</span>
              <span>
                Pre 2.7 <span className="text-emerald-600 font-bold">→ Post 4.4 (+1.7)</span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-300" style={{ width: '54%' }}></div>
              <div className="h-full bg-emerald-500" style={{ width: '34%' }}></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
              <span>Communicative Fluency Score</span>
              <span>
                Pre 3.0 <span className="text-emerald-600 font-bold">→ Post 4.5 (+1.5)</span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-300" style={{ width: '60%' }}></div>
              <div className="h-full bg-emerald-500" style={{ width: '30%' }}></div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
            📊 Statistically significant improvement (p &lt; .05) • Ready for Thesis Chapter 4
          </p>
        </div>
      </div>
    </div>
  );
};
