import React, { useState } from 'react';
import { User, KeyRound, LogIn, X, Sparkles, BookOpen, UserCheck } from 'lucide-react';
import type { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
  onContinueAsGuest: () => void;
  currentProfile: UserProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onContinueAsGuest,
  currentProfile,
}) => {
  const [fullName, setFullName] = useState(
    currentProfile.isLoggedIn ? currentProfile.name : ''
  );
  const [grade, setGrade] = useState(
    currentProfile.isLoggedIn ? currentProfile.grade : 'ม.2/2'
  );
  const [studentNumber, setStudentNumber] = useState(
    currentProfile.isLoggedIn ? currentProfile.studentNumber : ''
  );
  const [pin, setPin] = useState('');
  const [avatar, setAvatar] = useState(currentProfile.avatar || '👩‍🎓');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newProfile: UserProfile = {
      name: fullName.trim(),
      grade: grade,
      studentNumber: studentNumber.trim() || '01',
      avatar: avatar,
      xp: currentProfile.xp || 50,
      streak: currentProfile.streak || 1,
      completedQuests: currentProfile.completedQuests || [],
      isLoggedIn: true,
    };

    onLogin(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-rose-400 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
            👩‍🎓
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {currentProfile.isLoggedIn ? 'แก้ไขข้อมูลนักเรียน' : 'เข้าสู่ระบบนักเรียน'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกชื่อจริงเพื่อให้คุณครูตรวจคะแนนและผลวิจัยได้ถูกต้อง
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              เลือกรูปประจำตัว
            </label>
            <div className="flex justify-center gap-2">
              {['👩‍🎓', '🧑‍🎓', '👧', '👦', '🦊', '🚀'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAvatar(item)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    avatar === item
                      ? 'bg-orange-100 border-2 border-orange-500 scale-110 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              ชื่อ - นามสกุลจริง
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="เช่น ด.ญ. กานต์พิชชา พรหมมา"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
              required
            />
          </div>

          {/* Grade & Student Number Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                ระดับชั้น/ห้อง
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
              >
                <option value="ม.1/1">ม.1/1</option>
                <option value="ม.1/2">ม.1/2</option>
                <option value="ม.2/1">ม.2/1</option>
                <option value="ม.2/2">ม.2/2</option>
                <option value="ม.3/1">ม.3/1</option>
                <option value="ม.3/2">ม.3/2</option>
                <option value="ม.4/1">ม.4/1</option>
                <option value="ม.4/2">ม.4/2</option>
                <option value="ม.5/1">ม.5/1</option>
                <option value="ม.6/1">ม.6/1</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                เลขที่ (No.)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="เช่น 15"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* Optional PIN for student */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              รหัสจำตัวนักเรียน 4 หลัก (เพื่อกลับมาล็อกอินซ้ำ)
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="เช่น 1234 (ใส่หรือไม่ใส่ก็ได้)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              {currentProfile.isLoggedIn ? 'บันทึกข้อมูล' : 'เข้าสู่ระบบนักเรียน'}
            </button>

            {!currentProfile.isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  onContinueAsGuest();
                  onClose();
                }}
                className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                ใช้งานต่อในฐานะ Guest (ไม่บันทึกชื่อ)
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
