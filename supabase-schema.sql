-- ==============================================================================
-- EngEveryday Hub - Database Setup Script for Supabase
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create table for Voice Submissions (CAR Research Data)
CREATE TABLE IF NOT EXISTS public.voice_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    student_no TEXT NOT NULL,
    avatar TEXT DEFAULT '👩‍🎓',
    task_title TEXT NOT NULL,
    duration TEXT DEFAULT '0:15s',
    fluency_score NUMERIC DEFAULT 5,
    appropriateness_score NUMERIC DEFAULT 5,
    transcription TEXT,
    audio_url TEXT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.voice_submissions ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous students to read and insert submissions
CREATE POLICY "Allow public read on voice_submissions"
    ON public.voice_submissions FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on voice_submissions"
    ON public.voice_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on voice_submissions"
    ON public.voice_submissions FOR UPDATE
    USING (true);

-- 4. Create Public Storage Bucket for Student Audio Recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-recordings', 'voice-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Policies for audio recordings
CREATE POLICY "Allow public read access to voice-recordings"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'voice-recordings');

CREATE POLICY "Allow public upload access to voice-recordings"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'voice-recordings');
