export type ScreenName = 'dashboard' | 'situation' | 'voice' | 'chat' | 'teacher';

export interface DialogueStep {
  id: number;
  speaker: string;
  speakerRole: string;
  avatar: string;
  englishText: string;
  thaiTranslation: string;
  options: {
    id: string;
    english: string;
    thaiMeaning: string;
    isPolite: boolean;
    feedback: string;
    xp: number;
  }[];
}

export interface Scenario {
  id: string;
  title: string;
  topic: string;
  level: 1 | 2; // 1 = ม.ต้น, 2 = ม.ปลาย
  levelLabel: string;
  category: 'cafe' | 'travel' | 'chat' | 'voice';
  icon: string;
  badge: string;
  badgeColor: string;
  description: string;
  steps: DialogueStep[];
  voiceChallenge?: {
    mission: string;
    targetKeywords: string[];
    modelPhrase: string;
    thaiMeaning: string;
    tip: string;
  };
}

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
  audioBlobUrl?: string;
  transcription?: string;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'alex' | 'student';
  text: string;
  timestamp: string;
  slangTip?: string;
}

export interface UserProfile {
  name: string;
  grade: string;
  avatar: string;
  xp: number;
  streak: number;
  completedQuests: string[];
}
