import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  RotateCcw,
  Send,
  CheckCircle,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ScreenName, VoiceSubmission, Scenario, UserProfile } from '../types';
import { speakEnglish, AudioRecorder } from '../utils/speech';

interface VoiceLabProps {
  scenario: Scenario;
  profile: UserProfile;
  onNavigate: (screen: ScreenName) => void;
  onSubmitVoice: (submission: VoiceSubmission, audioBlob?: Blob) => Promise<void>;
  onAddXp: (amount: number) => void;
}

export const VoiceLab: React.FC<VoiceLabProps> = ({
  scenario,
  profile,
  onNavigate,
  onSubmitVoice,
  onAddXp,
}) => {
  const challenge = scenario.voiceChallenge || {
    mission: 'Tell the barista you want less sweet (หวานน้อย)',
    targetKeywords: ['less', 'sweet', 'please'],
    modelPhrase: 'Could you make it less sweet, please?',
    thaiMeaning: 'ช่วยทำหวานน้อยให้หน่อยได้ไหมครับ/ค่ะ',
    tip: "Stress 'less sweet' and end softly with a rising intonation on 'please'.",
  };

  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isListeningModel, setIsListeningModel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    audioRecorderRef.current = new AudioRecorder();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const handleListenModel = () => {
    setIsListeningModel(true);
    speakEnglish(challenge.modelPhrase, () => {
      setIsListeningModel(false);
    });
  };

  const startRecordingSession = async () => {
    setPermissionError(null);
    setAudioUrl(null);
    setRecordedBlob(null);

    const started = await audioRecorderRef.current?.start();
    if (!started) {
      setPermissionError('กรุณาอนุญาตให้เข้าถึงไมโครโฟนบนเบราว์เซอร์ของคุณเพื่ออัดเสียง');
      return;
    }

    setIsRecording(true);
    setRecordedSeconds(0);
    setHasRecorded(false);

    timerRef.current = window.setInterval(() => {
      setRecordedSeconds((prev) => {
        if (prev >= 30) {
          stopRecordingSession();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecordingSession = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const blob = await audioRecorderRef.current?.stop();
    if (blob) {
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
    setHasRecorded(true);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecordingSession();
    } else {
      startRecordingSession();
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordedSeconds(0);
    setHasRecorded(false);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordedBlob(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const submission: VoiceSubmission = {
      id: Date.now().toString(),
      studentName: profile.name || 'Anonymous Student',
      studentNo: profile.grade,
      avatar: profile.avatar || '👩‍🎓',
      task: scenario.title,
      submittedAt: 'Just now',
      duration: `0:${recordedSeconds < 10 ? '0' : ''}${recordedSeconds}s`,
      fluencyScore: 0, // รอดำเนินการประเมินโดยคุณครู
      appropriatenessScore: 0,
      audioBlobUrl: audioUrl || undefined,
      transcription: challenge.modelPhrase,
      feedback: 'รอดำเนินการประเมินจากคุณครู',
    };

    try {
      await onSubmitVoice(submission, recordedBlob || undefined);
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onAddXp(30);

      setTimeout(() => {
        onNavigate('dashboard');
      }, 1800);
    } catch (e) {
      console.error('Error submitting voice:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          onClick={() => onNavigate('situation')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="text-center">
          <span className="block text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            VOICE LAB
          </span>
          <h2 className="text-sm font-bold text-slate-900">{scenario.title}</h2>
        </div>

        <div className="w-9"></div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-w-lg mx-auto w-full">
        {/* Mission Card */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider mb-1">
              SPEAKING MISSION
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {challenge.mission}
            </p>
          </div>
        </div>

        {/* Model Phrase Guide */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl relative shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> MODEL PHRASE GUIDE
            </span>
            <span className="text-[10px] font-medium text-emerald-800 bg-white/90 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {challenge.thaiMeaning}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-900 mb-3 tracking-tight">
            "{challenge.modelPhrase}"
          </p>

          <button
            onClick={handleListenModel}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isListeningModel
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-white text-emerald-800 hover:bg-emerald-100 shadow-2xs border border-emerald-200/60'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            {isListeningModel ? 'Playing Audio...' : 'Listen Model Audio (ฟังเสียงตัวอย่าง)'}
          </button>
        </div>

        {/* Audio Recording Studio Card */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between text-xs font-semibold mb-6">
            <span className="flex items-center gap-1.5 text-rose-500 font-bold">
              <span
                className={`w-2.5 h-2.5 rounded-full bg-rose-500 ${
                  isRecording ? 'animate-ping' : ''
                }`}
              ></span>
              {isRecording
                ? 'กำลังบันทึกเสียง...'
                : hasRecorded
                ? 'บันทึกเสียงเรียบร้อย'
                : 'พร้อมบันทึกเสียง'}
            </span>
            <span className="text-slate-400">
              00:{recordedSeconds < 10 ? `0${recordedSeconds}` : recordedSeconds} / 00:30s
            </span>
          </div>

          {/* Large Mic Button */}
          <button
            onClick={handleToggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-xl ${
              isRecording
                ? 'bg-rose-500 text-white scale-110 shadow-rose-500/40 animate-pulse'
                : 'bg-rose-500 text-white hover:scale-105 shadow-rose-500/25 active:scale-95'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>

          {/* Live Waveform Indicator */}
          <div className="flex items-center gap-1 h-12 my-4">
            {[6, 12, 18, 24, 16, 22, 28, 20, 14, 26, 18, 12, 20, 10, 6].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isRecording
                    ? 'bg-rose-500'
                    : hasRecorded
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
                style={{
                  height: isRecording
                    ? `${Math.max(6, Math.min(36, h * (0.8 + Math.random())))}px`
                    : `${h}px`,
                }}
              ></div>
            ))}
          </div>

          <span className="text-xs text-slate-500 mb-3">
            {isRecording
              ? 'กำลังพูด... กดปุ่มไมค์อีกครั้งเมื่อพูดจบ'
              : hasRecorded
              ? 'กดปุ่มไมค์เพื่ออัดเสียงใหม่'
              : 'แตะปุ่มไมโครโฟนเพื่อเริ่มพูดภาษาอังกฤษ'}
          </span>

          {/* Real Audio Player & Preview Card */}
          {hasRecorded && audioUrl && (
            <div className="w-full my-3 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>บันทึกเสียงของคุณเรียบร้อยแล้ว</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                ลองกดฟังเสียงของตัวเองเพื่อตรวจสอบความชัดเจน ก่อนส่งให้คุณครูตรวจประเมิน
              </p>
              <audio controls src={audioUrl} className="w-full h-9 rounded-lg" />
            </div>
          )}

          {/* Permission Error notice */}
          {permissionError && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 mb-3 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{permissionError}</span>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            <button
              onClick={handleReset}
              disabled={!hasRecorded || isSubmitting}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              อัดใหม่ (Reset)
            </button>

            <button
              onClick={handleSubmit}
              disabled={!hasRecorded || isSubmitting || submitted}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {submitted ? 'ส่งเรียบร้อย!' : 'ส่งให้คุณครู (Submit)'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Speaking Tip */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-2xl flex items-start gap-3 shadow-2xs">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Speaking tip: </span>
            {challenge.tip}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl animate-in zoom-in duration-300 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Voice Submitted!</h3>
            <p className="text-xs text-slate-500">
              ส่งคลิปเสียงของคุณไปยังระบบของคุณครูเรียบร้อยแล้ว (+30 XP)
            </p>
            <div className="w-full bg-orange-50 text-orange-700 py-2 rounded-xl text-xs font-bold">
              กำลังกลับสู่หน้าหลัก...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
