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
    fluency_score NUMERIC DEFAULT 0,
    appropriateness_score NUMERIC DEFAULT 0,
    transcription TEXT,
    audio_url TEXT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.voice_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on voice_submissions"
    ON public.voice_submissions FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on voice_submissions"
    ON public.voice_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on voice_submissions"
    ON public.voice_submissions FOR UPDATE
    USING (true);

-- 2. Create table for CAR Pre-test & Post-test Assessments
CREATE TABLE IF NOT EXISTS public.car_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    student_no TEXT NOT NULL,
    grade TEXT NOT NULL,
    test_type TEXT NOT NULL, -- 'pre' or 'post'
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    percentage NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.car_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on car_assessments"
    ON public.car_assessments FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on car_assessments"
    ON public.car_assessments FOR INSERT
    WITH CHECK (true);

-- 3. Create table for Student Profiles & Leaderboard
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    student_no TEXT NOT NULL,
    grade TEXT NOT NULL,
    avatar TEXT DEFAULT '👩‍🎓',
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 1,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT student_profile_unique UNIQUE (student_name, student_no, grade)
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on student_profiles"
    ON public.student_profiles FOR SELECT
    USING (true);

CREATE POLICY "Allow public upsert on student_profiles"
    ON public.student_profiles FOR ALL
    USING (true)
    WITH CHECK (true);

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
