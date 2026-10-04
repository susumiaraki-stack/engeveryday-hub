export type ScreenName = 'dashboard' | 'situation' | 'voice' | 'chat' | 'teacher';

export interface VoiceSubmission {
  id: string;
  studentName: string;
  studentNo: string;
  avatar: string;
  task: string;
  submittedAt: string;
  duration: string;
  fluencyScore: number;
  appropriatenessScore: number;
  audioUrl?: string;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'alex' | 'student' | 'system';
  text: string;
  timestamp: string;
  slangTip?: string;
}
