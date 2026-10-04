import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ScreenName, UserProfile, CarAssessmentRecord } from '../types';
import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';
import { saveCarAssessmentToDB } from '../lib/supabase';

interface AssessmentRoomProps {
  onNavigate: (screen: ScreenName) => void;
  profile: UserProfile;
  onAddXp: (amount: number) => void;
}

export const AssessmentRoom: React.FC<AssessmentRoomProps> = ({
  onNavigate,
  profile,
  onAddXp,
}) => {
  const [testType, setTestType] = useState<'pre' | 'post' | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load existing test records from local storage for this student
  const [history, setHistory] = useState<CarAssessmentRecord[]>(() => {
    try {
      const all: CarAssessmentRecord[] = JSON.parse(
        localStorage.getItem('eng_car_assessments') || '[]'
      );
      return all.filter(
        (r) =>
          r.studentName.toLowerCase() === profile.name.toLowerCase() &&
          r.studentNo === profile.grade
      );
    } catch {
      return [];
    }
  });

  const currentQ = ASSESSMENT_QUESTIONS[currentIdx];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;

  const handleStartTest = (type: 'pre' | 'post') => {
    setTestType(type);
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const chosen = currentQ.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Completed!
      const finalScore = score + (currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 1 : 0);
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      onAddXp(50);

      const record: CarAssessmentRecord = {
        id: Date.now().toString(),
        studentName: profile.name || 'Anonymous Student',
        studentNo: profile.studentNumber || profile.grade,
        grade: profile.grade,
        testType: testType || 'pre',
        score: finalScore,
        total: totalQuestions,
        percentage: Math.round((finalScore / totalQuestions) * 100),
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await saveCarAssessmentToDB(record);
      setHistory((prev) => [record, ...prev]);
    }
  };

  const preRecord = history.find((h) => h.testType === 'pre');
  const postRecord = history.find((h) => h.testType === 'post');

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
            CAR ASSESSMENT
          </span>
          <h2 className="text-sm font-bold text-slate-900">แบบวัดผลวิจัยในชั้นเรียน</h2>
        </div>

        <div className="w-9"></div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-w-lg mx-auto w-full">
        {/* State 1: Test Selection Hub */}
        {!testType && !isCompleted && (
          <div className="space-y-4">
            {/* Banner */}
            <div className="p-5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 rounded-3xl text-white shadow-lg shadow-orange-500/20">
              <span className="text-[10px] uppercase font-bold text-orange-100 tracking-wider block mb-1">
                COMMUNICATIVE COMPETENCE EVALUATION
              </span>
              <h3 className="text-lg font-black leading-snug">
                แบบทดสอบวัดผลสัมฤทธิ์ทางการสื่อสาร
              </h3>
              <p className="text-xs text-orange-100/90 mt-1 leading-relaxed">
                แบบประเมินความสามารถในการใช้ภาษาอังกฤษในชีวิตประจำวัน (ความสุภาพ และความเหมาะสมตามบริบท)
              </p>
            </div>

            {/* Test Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Pre-Test Card */}
              <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:border-orange-300 transition-all flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-2">
                    📝
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Pre-test (ก่อนเรียน)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    ทำก่อนเริ่มฝึกฝนสถานการณ์ เพื่อวัดระดับความรู้เดิม (Baseline Score)
                  </p>
                  {preRecord && (
                    <div className="mt-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-800 font-bold flex items-center justify-between">
                      <span>คะแนนที่ทำได้:</span>
                      <span className="text-emerald-700">
                        {preRecord.score}/{preRecord.total} ({preRecord.percentage}%)
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartTest('pre')}
                  className="w-full py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-600 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {preRecord ? 'ทำใหม่อีกครั้ง' : 'เริ่มทำแบบทดสอบก่อนเรียน'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Post-Test Card */}
              <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:border-rose-300 transition-all flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg mb-2">
                    🎯
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Post-test (หลังเรียน)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    ทำหลังฝึกฝนเสร็จสิ้น เพื่อวัดพัฒนาการ (% Improvement) สำหรับงานวิจัย
                  </p>
                  {postRecord && (
                    <div className="mt-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-800 font-bold flex items-center justify-between">
                      <span>คะแนนที่ทำได้:</span>
                      <span className="text-emerald-700">
                        {postRecord.score}/{postRecord.total} ({postRecord.percentage}%)
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartTest('post')}
                  className="w-full py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-600 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {postRecord ? 'ทำใหม่อีกครั้ง' : 'เริ่มทำแบบทดสอบหลังเรียน'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Growth / Improvement Banner if both done */}
            {preRecord && postRecord && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    RESEARCH GROWTH METRIC
                  </span>
                  <p className="text-xs font-bold text-emerald-950">
                    พัฒนาการของคุณ: {postRecord.percentage - preRecord.percentage >= 0 ? '+' : ''}
                    {postRecord.percentage - preRecord.percentage}% (จาก {preRecord.score} เป็น{' '}
                    {postRecord.score} คะแนน)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* State 2: Active Test Question */}
        {testType && !isCompleted && (
          <div className="space-y-4">
            {/* Progress Header */}
            <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-orange-600 uppercase">
                {testType === 'pre' ? '📝 Pre-test' : '🎯 Post-test'}
              </span>
              <span className="font-bold text-slate-500">
                ข้อที่ {currentIdx + 1} / {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>

            {/* Question Card */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                {currentQ.topic}
              </span>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">บริบทสถานการณ์:</span>
                {currentQ.situation}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optStyle =
                    'border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 text-slate-800';

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 shadow-2xs';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-rose-300 bg-rose-50 text-rose-950';
                    } else {
                      optStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswered}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswered && (
                        <span>
                          {opt.isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                          {isSelected && !opt.isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box after answering */}
              {isAnswered && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1 animate-in fade-in duration-200">
                  <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> คำอธิบายทางภาษาศาสตร์:
                  </span>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {currentQ.options.find((o) => o.id === selectedOptionId)?.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-2xl shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {currentIdx + 1 < totalQuestions ? 'ข้อถัดไป →' : 'ดูผลคะแนนรวม 🏆'}
              </button>
            )}
          </div>
        )}

        {/* State 3: Test Completed Summary */}
        {isCompleted && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-md text-center space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
              🎉
            </div>

            <div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">
                COMPLETED {testType?.toUpperCase()} TEST
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">ทดสอบเสร็จสมบูรณ์!</h3>
              <p className="text-xs text-slate-500 mt-1">
                บันทึกผลการประเมินลงในฐานข้อมูลวิจัยเรียบร้อยแล้ว
              </p>
            </div>

            <div className="p-4 bg-orange-50/80 border border-orange-200/80 rounded-2xl">
              <span className="text-xs text-orange-800 font-bold block mb-1">คะแนนรวมที่ได้</span>
              <span className="text-3xl font-black text-orange-600">
                {score} <span className="text-base font-normal text-slate-400">/ {totalQuestions}</span>
              </span>
              <span className="block text-[11px] font-bold text-orange-700 mt-1">
                ({Math.round((score / totalQuestions) * 100)}%)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTestType(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                หน้าเลือกแบบทดสอบ
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
