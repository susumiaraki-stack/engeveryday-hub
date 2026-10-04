import React, { useState } from 'react';
import { ArrowLeft, Download, Play, Pause, Star, MessageSquareCheck, Check } from 'lucide-react';
import type { ScreenName, VoiceSubmission } from '../types';

interface TeacherPortalProps {
  onNavigate: (screen: ScreenName) => void;
  submissions: VoiceSubmission[];
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onNavigate, submissions }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => {
        setPlayingId(null);
      }, 3500);
    }
  };

  const handleExportCSV = () => {
    const headers = 'StudentID,StudentName,Class,Task,SubmittedAt,FluencyScore,AppropriatenessScore,Status\n';
    const rows = submissions
      .map(
        (s) =>
          `"${s.studentNo}","${s.studentName}","ม.2/2","${s.task}","${s.submittedAt}","${s.fluencyScore}/5","${s.appropriatenessScore}/5","Reviewed"`
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
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Teacher Portal</h2>
            <span className="text-[10px] text-slate-400 font-medium">CAR Research & Voice Review</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-lg">
            ม.2/2
          </span>
          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold rounded-lg shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Metric Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">Active Students</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">38 / 40</span>
            </div>
            <span className="text-[9px] text-emerald-600 font-bold">95% active today</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">Mission Completion</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">92%</span>
            </div>
            <span className="text-[9px] text-orange-600 font-bold">+8% from last week</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">Pending Voice</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-orange-600">{submissions.length}</span>
              <span className="text-[10px] text-slate-400">new</span>
            </div>
            <span className="text-[9px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-sm">
              Needs review
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">Avg Fluency</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-600">4.3 / 5</span>
            </div>
            <span className="text-[9px] text-emerald-600 font-bold">+1.3 since pre-test</span>
          </div>
        </div>

        {/* Voice Submissions Inbox */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900">
              Voice Inbox ({submissions.length} to review)
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Newest first</span>
          </div>

          <div className="space-y-2.5">
            {submissions.map((sub) => {
              const isPlaying = playingId === sub.id;
              const hasGivenFeedback = feedbackSuccessId === sub.id;

              return (
                <div
                  key={sub.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold">
                        {sub.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {sub.studentName}
                        </h4>
                        <span className="text-[10px] text-slate-400">{sub.studentNo}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {sub.task}
                    </span>
                  </div>

                  {/* Audio Player Bar */}
                  <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                    <button
                      onClick={() => togglePlay(sub.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isPlaying ? 'bg-orange-500 text-white animate-pulse' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>

                    {/* Waveform indicator */}
                    <div className="flex-1 flex items-center gap-0.5 h-5">
                      {[6, 12, 18, 10, 15, 8, 14, 20, 12, 6, 16, 10, 8].map((bar, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-full transition-all ${
                            isPlaying ? 'bg-orange-500' : 'bg-slate-300'
                          }`}
                          style={{ height: `${bar}px` }}
                        ></div>
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {sub.duration}
                    </span>
                  </div>

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
                                i < sub.fluencyScore ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
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
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        hasGivenFeedback
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      {hasGivenFeedback ? (
                        <>
                          <Check className="w-3 h-3" /> Sent!
                        </>
                      ) : (
                        <>
                          <MessageSquareCheck className="w-3 h-3" /> Feedback
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Research Mini-Chart */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              CAR RESEARCH ANALYTICS
            </span>
            <span className="text-[9px] text-slate-400">8-Week Cycle</span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            Speaking Fluency & Confidence: Class Average
          </h4>

          {/* Metric 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
              <span>Speaking Confidence</span>
              <span>
                Pre 2.7 <span className="text-emerald-600 font-bold">→ Post 4.2 (+1.5)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-200" style={{ width: '54%' }}></div>
              <div className="h-full bg-emerald-500" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
              <span>Speaking Fluency</span>
              <span>
                Pre 3.0 <span className="text-emerald-600 font-bold">→ Post 4.3 (+1.3)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-200" style={{ width: '60%' }}></div>
              <div className="h-full bg-emerald-500" style={{ width: '26%' }}></div>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-100">
            Based on 40 students • Ready for CAR Thesis Chapter 4 Data Presentation
          </p>
        </div>
      </div>
    </div>
  );
};
