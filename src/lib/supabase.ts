import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { VoiceSubmission, CarAssessmentRecord, UserProfile, LeaderboardUser } from '../types';

// Read from env vars or localStorage config
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') || '' : '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
  };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('supabase_url', url.trim());
  localStorage.setItem('supabase_anon_key', key.trim());
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return clientInstance;
};

// Check if Supabase credentials are set
export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
};

// Real DB Fetch: Get all real voice submissions
export const fetchSubmissionsFromDB = async (): Promise<VoiceSubmission[]> => {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('voice_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions from Supabase:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      studentName: row.student_name,
      studentNo: row.student_no,
      avatar: row.avatar || '👩‍🎓',
      task: row.task_title,
      submittedAt: new Date(row.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      duration: row.duration || '0:15s',
      fluencyScore: row.fluency_score ?? 0,
      appropriatenessScore: row.appropriateness_score ?? 0,
      audioBlobUrl: row.audio_url || undefined,
      transcription: row.transcription || '',
      feedback: row.feedback || '',
    }));
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return [];
  }
};

// Real DB Insert: Upload real audio to Storage & save record to Table
export const uploadAndSaveSubmission = async (
  sub: VoiceSubmission,
  audioBlob?: Blob
): Promise<VoiceSubmission> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.info('Supabase not connected. Storing submission locally.');
    return sub;
  }

  let remoteAudioUrl: string | undefined = undefined;

  // 1. If audio blob exists, upload to Supabase Storage bucket 'voice-recordings'
  if (audioBlob) {
    try {
      const fileName = `${Date.now()}-${sub.studentNo.replace(/[^a-zA-Z0-9]/g, '_')}.webm`;
      const { error: uploadErr } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          upsert: true,
        });

      if (!uploadErr) {
        const { data: publicData } = supabase.storage
          .from('voice-recordings')
          .getPublicUrl(fileName);
        remoteAudioUrl = publicData.publicUrl;
      } else {
        console.warn('Storage upload error:', uploadErr);
      }
    } catch (e) {
      console.warn('Failed to upload audio to Supabase Storage:', e);
    }
  }

  // 2. Insert row into 'voice_submissions' table
  try {
    const { data, error } = await supabase
      .from('voice_submissions')
      .insert([
        {
          student_name: sub.studentName,
          student_no: sub.studentNo,
          avatar: sub.avatar,
          task_title: sub.task,
          duration: sub.duration,
          fluency_score: sub.fluencyScore,
          appropriateness_score: sub.appropriatenessScore,
          transcription: sub.transcription,
          audio_url: remoteAudioUrl || sub.audioBlobUrl,
          feedback: sub.feedback,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return {
        ...sub,
        id: data.id,
        audioBlobUrl: remoteAudioUrl || sub.audioBlobUrl,
      };
    }
  } catch (err) {
    console.error('Error saving submission to Supabase:', err);
  }

  return sub;
};

// Real DB Update: Teacher giving feedback or updating score
export const updateSubmissionFeedbackInDB = async (
  id: string,
  feedback: string,
  fluency?: number,
  politeness?: number
) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const updates: any = { feedback };
    if (fluency !== undefined) updates.fluency_score = fluency;
    if (politeness !== undefined) updates.appropriateness_score = politeness;

    await supabase.from('voice_submissions').update(updates).eq('id', id);
  } catch (err) {
    console.warn('Failed to update feedback in Supabase:', err);
  }
};

// 3. CAR Assessment Sync (Pre-test & Post-test)
export const saveCarAssessmentToDB = async (record: CarAssessmentRecord): Promise<void> => {
  // Always save to local storage as fallback
  try {
    const existing: CarAssessmentRecord[] = JSON.parse(
      localStorage.getItem('eng_car_assessments') || '[]'
    );
    localStorage.setItem(
      'eng_car_assessments',
      JSON.stringify([record, ...existing])
    );
  } catch {}

  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from('car_assessments').insert([
      {
        student_name: record.studentName,
        student_no: record.studentNo,
        grade: record.grade,
        test_type: record.testType,
        score: record.score,
        total: record.total,
        percentage: record.percentage,
      },
    ]);
  } catch (err) {
    console.warn('Supabase car_assessments insert error (using local cache):', err);
  }
};

export const fetchCarAssessmentsFromDB = async (): Promise<CarAssessmentRecord[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('car_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          studentName: row.student_name,
          studentNo: row.student_no,
          grade: row.grade,
          testType: row.test_type,
          score: row.score,
          total: row.total,
          percentage: Number(row.percentage),
          submittedAt: new Date(row.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
      }
    } catch (e) {
      console.warn('Supabase car_assessments fetch error:', e);
    }
  }

  // Fallback to local storage
  try {
    return JSON.parse(localStorage.getItem('eng_car_assessments') || '[]');
  } catch {
    return [];
  }
};

// 4. Student Profile & Leaderboard Sync
export const syncStudentProfileToDB = async (profile: UserProfile): Promise<void> => {
  if (!profile.isLoggedIn || profile.name === 'Guest User') return;

  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from('student_profiles').upsert(
      {
        student_name: profile.name,
        student_no: profile.studentNumber,
        grade: profile.grade,
        avatar: profile.avatar,
        xp: profile.xp,
        streak: profile.streak,
        last_active: new Date().toISOString(),
      },
      { onConflict: 'student_name,student_no,grade' }
    );
  } catch (err) {
    console.warn('Student profile upsert error:', err);
  }
};

export const fetchLeaderboardFromDB = async (): Promise<LeaderboardUser[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.student_name,
          studentNo: row.student_no,
          grade: row.grade,
          avatar: row.avatar || '👩‍🎓',
          xp: row.xp || 0,
          streak: row.streak || 1,
        }));
      }
    } catch (e) {
      console.warn('Leaderboard fetch error:', e);
    }
  }

  // Fallback if table is empty or local
  try {
    const cachedProfile = JSON.parse(localStorage.getItem('eng_profile') || '{}');
    if (cachedProfile.name && cachedProfile.isLoggedIn) {
      return [
        {
          id: 'me',
          name: cachedProfile.name,
          studentNo: cachedProfile.studentNumber,
          grade: cachedProfile.grade,
          avatar: cachedProfile.avatar,
          xp: cachedProfile.xp,
          streak: cachedProfile.streak,
        },
      ];
    }
  } catch {}

  return [];
};
