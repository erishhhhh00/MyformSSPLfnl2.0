-- ============================================================
-- COMPLETE SUPABASE SCHEMA FOR FORM APPLICATION
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DROP EXISTING TABLES (if you want to start fresh)
-- ============================================================
-- DROP TABLE IF EXISTS activity_log CASCADE;
-- DROP TABLE IF EXISTS qr_links CASCADE;
-- DROP TABLE IF EXISTS moderation_forms CASCADE;
-- DROP TABLE IF EXISTS form_submissions CASCADE;
-- DROP TABLE IF EXISTS attendance CASCADE;
-- DROP TABLE IF EXISTS uids CASCADE;
-- DROP TABLE IF EXISTS moderators CASCADE;
-- DROP TABLE IF EXISTS assessors CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;

-- ============================================================
-- USER AUTHENTICATION TABLES
-- ============================================================

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessors table
CREATE TABLE IF NOT EXISTS assessors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  age INTEGER,
  id_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moderators table
CREATE TABLE IF NOT EXISTS moderators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  id_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default users (change passwords in production!)
INSERT INTO admins (username, password, name, email) VALUES 
  ('admin', 'admin123', 'System Admin', 'admin@ssipl.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO assessors (username, password, name, email) VALUES 
  ('assessor', 'assessor123', 'Default Assessor', 'assessor@ssipl.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO moderators (username, password, name, email) VALUES 
  ('moderator', 'moderator123', 'Default Moderator', 'moderator@ssipl.com')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- UIDs TABLE (main tracking table)
-- ============================================================
CREATE TABLE IF NOT EXISTS uids (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10) UNIQUE NOT NULL,
  assessor_id UUID REFERENCES assessors(id),
  assessor_name VARCHAR(255) DEFAULT '',
  assessor_number VARCHAR(20) DEFAULT '',
  assessor_age INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  stage VARCHAR(50) DEFAULT 'assessor', -- assessor, moderator, admin, approved
  form_link TEXT,
  qr_code_url TEXT,
  student_count INTEGER DEFAULT 0,
  attendance_saved_at TIMESTAMP WITH TIME ZONE,
  sent_to_moderator_at TIMESTAMP WITH TIME ZONE,
  sent_to_admin_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  link_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- FORM SUBMISSIONS TABLE (complete form data for each student)
-- ============================================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10) REFERENCES uids(uid) ON DELETE CASCADE,
  application_id VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, assessor_review, moderator_review, admin_review, approved, rejected
  stage VARCHAR(50) DEFAULT 'assessor',
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- ============================================================
  -- PAGE 1 FIELDS
  -- ============================================================
  learner_name VARCHAR(255),
  id_number VARCHAR(50),
  company_name VARCHAR(255),
  form_date DATE,
  assessor_name_p1 VARCHAR(255),
  assessor_id_number VARCHAR(50),
  moderator_name VARCHAR(255),
  moderator_id_number VARCHAR(50),
  original_id_copy BOOLEAN DEFAULT false,
  digital_id_photo BOOLEAN DEFAULT false,
  medical_certificate BOOLEAN DEFAULT false,
  
  -- ============================================================
  -- PAGE 2 FIELDS
  -- ============================================================
  p2_name VARCHAR(255),
  p2_date_of_birth DATE,
  p2_gender VARCHAR(20),
  p2_govt_id VARCHAR(50),
  p2_designation VARCHAR(100),
  p2_employee_id VARCHAR(50),
  p2_phone_number VARCHAR(20),
  p2_email VARCHAR(255),
  p2_emergency_contact_phone VARCHAR(20),
  p2_emergency_contact_email VARCHAR(255),
  p2_emergency_contact_relationship VARCHAR(100),
  p2_employer_name VARCHAR(255),
  p2_employer_tel_number VARCHAR(20),
  p2_course_details TEXT,
  p2_first_attempt BOOLEAN DEFAULT false,
  p2_second_attempt BOOLEAN DEFAULT false,
  p2_basic_numeric_literacy VARCHAR(10),
  p2_basic_communication VARCHAR(10),
  p2_observer_witness_required VARCHAR(10),
  p2_observer_witness_id_number VARCHAR(50),
  p2_observer_witness_name VARCHAR(255),
  p2_observer_witness_phone VARCHAR(20),
  p2_interpreter_required VARCHAR(10),
  p2_interpreter_id_number VARCHAR(50),
  p2_interpreter_name VARCHAR(255),
  p2_interpreter_phone VARCHAR(20),
  p2_additional_requirements TEXT,
  p2_learner_signature TEXT,
  p2_assessor_signature TEXT,
  p2_learner_signature_image TEXT,
  p2_assessor_signature_image TEXT,
  
  -- ============================================================
  -- PAGE 3 FIELDS
  -- ============================================================
  p3_knowledge_written BOOLEAN DEFAULT false,
  p3_knowledge_other_specify TEXT,
  p3_knowledge_other_tick BOOLEAN DEFAULT false,
  p3_practical_application BOOLEAN DEFAULT false,
  p3_practical_others_specify TEXT,
  p3_practical_others_tick BOOLEAN DEFAULT false,
  p3_external_source_referred TEXT,
  p3_learner_signature TEXT,
  p3_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 4 FIELDS
  -- ============================================================
  p4_learner_signature TEXT,
  p4_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 5 FIELDS
  -- ============================================================
  p5_outcome1 BOOLEAN DEFAULT false,
  p5_outcome2 BOOLEAN DEFAULT false,
  p5_outcome3 BOOLEAN DEFAULT false,
  p5_outcome4 BOOLEAN DEFAULT false,
  p5_outcome5 BOOLEAN DEFAULT false,
  p5_outcome6 BOOLEAN DEFAULT false,
  p5_outcome7 BOOLEAN DEFAULT false,
  p5_outcome8 BOOLEAN DEFAULT false,
  p5_outcome9 BOOLEAN DEFAULT false,
  p5_outcome10 BOOLEAN DEFAULT false,
  p5_facilitator_recommendation VARCHAR(10),
  p5_facilitator_signature TEXT,
  p5_learner_signature TEXT,
  p5_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 6 FIELDS (Questions 1-6)
  -- ============================================================
  p6_question1 TEXT,
  p6_question2 TEXT,
  p6_question3 TEXT,
  p6_question4 TEXT,
  p6_question5 TEXT,
  p6_question6 TEXT,
  p6_learner_signature TEXT,
  p6_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 7 FIELDS (Questions 7-12)
  -- ============================================================
  p7_question7 TEXT,
  p7_question8 TEXT,
  p7_question9 TEXT,
  p7_question10 TEXT,
  p7_question11 TEXT,
  p7_question12 TEXT,
  p7_learner_signature TEXT,
  p7_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 8 FIELDS (Questions 13-18)
  -- ============================================================
  p8_question13 TEXT,
  p8_question14 TEXT,
  p8_question15 TEXT,
  p8_question16 TEXT,
  p8_question17 TEXT,
  p8_question18 TEXT,
  p8_learner_signature TEXT,
  p8_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 9 FIELDS (Questions 19-24)
  -- ============================================================
  p9_question19 TEXT,
  p9_question20 TEXT,
  p9_question21 TEXT,
  p9_question22 TEXT,
  p9_question23 TEXT,
  p9_question24 TEXT,
  p9_learner_signature TEXT,
  p9_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 10 FIELDS (Questions 25-30)
  -- ============================================================
  p10_question25 TEXT,
  p10_question26 TEXT,
  p10_question27 TEXT,
  p10_question28 TEXT,
  p10_question29 TEXT,
  p10_question30 TEXT,
  p10_learner_signature TEXT,
  p10_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 11 FIELDS
  -- ============================================================
  p11_question31 TEXT,
  p11_question32 JSONB DEFAULT '[]',
  p11_learner_signature TEXT,
  p11_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 12 FIELDS
  -- ============================================================
  p12_question33 TEXT,
  p12_question34 TEXT,
  p12_inspected_by VARCHAR(255),
  p12_inspection_date DATE,
  p12_sling_inspection JSONB DEFAULT '[]',
  p12_safety_harness_inspection JSONB DEFAULT '[]',
  p12_safety_helmet_inspection JSONB DEFAULT '[]',
  p12_learner_signature TEXT,
  p12_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 13 FIELDS
  -- ============================================================
  p13_safety_ropes_inspection JSONB DEFAULT '[]',
  p13_shock_absorber_inspection JSONB DEFAULT '[]',
  p13_connector_inspection JSONB DEFAULT '[]',
  p13_double_locking_inspection JSONB DEFAULT '[]',
  p13_fall_arrest_device_inspection JSONB DEFAULT '[]',
  p13_work_positioning_inspection JSONB DEFAULT '[]',
  p13_task2_results JSONB DEFAULT '[]',
  p13_task3_results JSONB DEFAULT '[]',
  p13_learner_signature TEXT,
  p13_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 14 FIELDS
  -- ============================================================
  p14_shock_absorbing_lanyards JSONB DEFAULT '[]',
  p14_work_positioning_system JSONB DEFAULT '[]',
  p14_fall_arrest_system JSONB DEFAULT '[]',
  p14_safe_movement_structures JSONB DEFAULT '[]',
  p14_task4_results JSONB DEFAULT '[]',
  p14_task5_results JSONB DEFAULT '[]',
  p14_task6_results JSONB DEFAULT '[]',
  p14_fall_arrest_practical_result VARCHAR(20),
  p14_learner_signature TEXT,
  p14_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 15 FIELDS
  -- ============================================================
  p15_workplace_instructions TEXT,
  p15_observation_one_hour VARCHAR(10),
  p15_observation_date DATE,
  p15_observation_place VARCHAR(255),
  p15_observation_job_description TEXT,
  p15_supervisor_name VARCHAR(255),
  p15_supervisor_id VARCHAR(50),
  p15_supervisor_contact VARCHAR(50),
  p15_supervisor_signature TEXT,
  p15_time_management VARCHAR(10),
  p15_training_standard VARCHAR(10),
  p15_equipment_impression TEXT,
  p15_learner_signature TEXT,
  p15_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 16 FIELDS
  -- ============================================================
  p16_knowledge_useful VARCHAR(10),
  p16_satisfied_procedure VARCHAR(10),
  p16_accurate_feedback VARCHAR(10),
  p16_satisfied_assessor VARCHAR(10),
  p16_before_assessment JSONB DEFAULT '[]',
  p16_during_after_assessment JSONB DEFAULT '[]',
  p16_learner_comments TEXT,
  p16_learner_signature TEXT,
  p16_assessor_facilitator_signature TEXT,
  
  -- ============================================================
  -- PAGE 17 FIELDS
  -- ============================================================
  p17_specific_outcomes JSONB DEFAULT '[]',
  p17_knowledge_results VARCHAR(20),
  p17_observation_results VARCHAR(20),
  p17_assessment_result VARCHAR(20),
  p17_assessment_date DATE,
  p17_summative_results VARCHAR(20),
  p17_summative_date DATE,
  p17_moderation_date DATE,
  p17_moderator_name VARCHAR(255),
  p17_moderator_signature TEXT,
  p17_learner_signature TEXT,
  p17_assessor_facilitator_signature TEXT
);

-- ============================================================
-- STUDENTS TABLE (Server expects this table for user form submissions)
-- Status workflow: pending_moderation -> moderated -> sent_to_admin -> approved | rejected
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  uid VARCHAR(10) REFERENCES uids(uid) ON DELETE CASCADE,
  learner_name VARCHAR(255),
  company_name VARCHAR(255),
  form_data JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending_moderation', -- pending_moderation, moderated, sent_to_admin, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- MODERATION PAGES TABLE (Server expects this for moderation data)
-- ============================================================
CREATE TABLE IF NOT EXISTS moderation_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10) UNIQUE NOT NULL,
  form_data JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ATTENDANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10) UNIQUE REFERENCES uids(uid) ON DELETE CASCADE, -- Added UNIQUE for upsert support
  date_from DATE,
  date_to DATE,
  client_name VARCHAR(255),
  training_location VARCHAR(255),
  training_circle VARCHAR(255),
  training_coordinator VARCHAR(255),
  ssipl_trainer VARCHAR(255),
  attendees JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- MODERATION FORM TABLE (all 6 pages)
-- ============================================================
CREATE TABLE IF NOT EXISTS moderation_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10) REFERENCES uids(uid) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  moderator_id UUID REFERENCES moderators(id),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- ============================================================
  -- MODERATION PAGE 1 FIELDS
  -- ============================================================
  mp1_document_title VARCHAR(255),
  mp1_type VARCHAR(100),
  mp1_document_number VARCHAR(50),
  mp1_date_of_implementation DATE,
  mp1_language VARCHAR(50),
  mp1_revision VARCHAR(20),
  
  -- ============================================================
  -- MODERATION PAGE 2 FIELDS
  -- ============================================================
  mp2_moderator_name VARCHAR(255),
  mp2_moderator_registration VARCHAR(100),
  mp2_moderation_purpose TEXT,
  mp2_assessor_name VARCHAR(255),
  mp2_assessor_registration VARCHAR(100),
  mp2_date_of_moderation DATE,
  mp2_number_of_portfolios VARCHAR(100),
  mp2_vodafone_standard_title TEXT,
  mp2_place VARCHAR(255),
  mp2_resources TEXT,
  mp2_batch_no VARCHAR(50),
  mp2_candidates JSONB DEFAULT '[]',
  
  -- ============================================================
  -- MODERATION PAGE 3 FIELDS
  -- ============================================================
  mp3_moderated_portfolios JSONB DEFAULT '[]',
  mp3_individuals JSONB DEFAULT '[]',
  mp3_assessment_planning JSONB DEFAULT '{}',
  mp3_assessment_conducted JSONB DEFAULT '{}',
  
  -- ============================================================
  -- MODERATION PAGE 4 FIELDS
  -- ============================================================
  mp4_assessment_conducted_cont JSONB DEFAULT '{}',
  mp4_assessment_documentation JSONB DEFAULT '{}',
  mp4_assessment_reviews JSONB DEFAULT '{}',
  mp4_assessment_feedback JSONB DEFAULT '{}',
  
  -- ============================================================
  -- MODERATION PAGE 5 FIELDS
  -- ============================================================
  mp5_assessment_principles JSONB DEFAULT '{}',
  mp5_feedback_comments TEXT,
  mp5_date DATE,
  mp5_moderator_signature TEXT,
  
  -- ============================================================
  -- MODERATION PAGE 6 FIELDS
  -- ============================================================
  mp6_feedback_to_assessor TEXT,
  mp6_assessor_date DATE,
  mp6_assessor_signature TEXT,
  mp6_moderator_review JSONB DEFAULT '{}',
  mp6_moderator_signature TEXT,
  mp6_moderator_date DATE,
  mp6_assessor_signature2 TEXT,
  mp6_assessor_date2 DATE
);

-- ============================================================
-- ACTIVITY LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10),
  action VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  performed_by VARCHAR(255),
  user_type VARCHAR(50), -- admin, assessor, moderator, user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- QR LINKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS qr_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid VARCHAR(10) REFERENCES uids(uid) ON DELETE CASCADE,
  link_code VARCHAR(100) UNIQUE NOT NULL,
  full_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  accessed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_form_submissions_uid ON form_submissions(uid);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_stage ON form_submissions(stage);
CREATE INDEX IF NOT EXISTS idx_attendance_uid ON attendance(uid);
CREATE INDEX IF NOT EXISTS idx_moderation_uid ON moderation_forms(uid);
CREATE INDEX IF NOT EXISTS idx_activity_uid ON activity_log(uid);
CREATE INDEX IF NOT EXISTS idx_uids_status ON uids(status);
CREATE INDEX IF NOT EXISTS idx_uids_stage ON uids(stage);
CREATE INDEX IF NOT EXISTS idx_qr_links_uid ON qr_links(uid);
CREATE INDEX IF NOT EXISTS idx_qr_links_code ON qr_links(link_code);
CREATE INDEX IF NOT EXISTS idx_students_uid ON students(uid);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_moderation_pages_uid ON moderation_pages(uid);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessors_updated_at ON assessors;
CREATE TRIGGER update_assessors_updated_at BEFORE UPDATE ON assessors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_moderators_updated_at ON moderators;
CREATE TRIGGER update_moderators_updated_at BEFORE UPDATE ON moderators
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_uids_updated_at ON uids;
CREATE TRIGGER update_uids_updated_at BEFORE UPDATE ON uids
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_form_submissions_updated_at ON form_submissions;
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_updated_at ON attendance;
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_moderation_forms_updated_at ON moderation_forms;
CREATE TRIGGER update_moderation_forms_updated_at BEFORE UPDATE ON moderation_forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEWS FOR EASIER QUERIES
-- ============================================================

-- View to get all UIDs with their submission counts
CREATE OR REPLACE VIEW uid_summary AS
SELECT 
  u.uid,
  u.assessor_name,
  u.assessor_number,
  u.status,
  u.stage,
  u.created_at,
  COUNT(fs.id) as submission_count,
  COUNT(CASE WHEN fs.status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN fs.status = 'pending' THEN 1 END) as pending_count
FROM uids u
LEFT JOIN form_submissions fs ON u.uid = fs.uid
GROUP BY u.id, u.uid, u.assessor_name, u.assessor_number, u.status, u.stage, u.created_at;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to generate next UID
CREATE OR REPLACE FUNCTION get_next_uid()
RETURNS VARCHAR(10) AS $$
DECLARE
  last_uid INTEGER;
  new_uid INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(uid AS INTEGER)), 0) INTO last_uid FROM uids;
  
  IF last_uid = 0 THEN
    new_uid := 1001;
  ELSE
    new_uid := last_uid + 1000;
  END IF;
  
  RETURN new_uid::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Enable for production
-- ============================================================
-- Uncomment these lines when you want to enable RLS

-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assessors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE moderators ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE uids ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE moderation_forms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE qr_links ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- MIGRATION SCRIPT: RUN THIS TO UPDATE EXISTING DATABASE
-- (Safe to run multiple times - uses IF NOT EXISTS)
-- ============================================================

-- ==================== UIDS TABLE MIGRATIONS ====================
ALTER TABLE uids ADD COLUMN IF NOT EXISTS assessor_name VARCHAR(255) DEFAULT '';
ALTER TABLE uids ADD COLUMN IF NOT EXISTS assessor_number VARCHAR(20) DEFAULT '';
ALTER TABLE uids ADD COLUMN IF NOT EXISTS assessor_age INTEGER;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS form_link TEXT;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS attendance_saved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS sent_to_moderator_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS sent_to_admin_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS link_generated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE uids ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT 'assessor';
ALTER TABLE uids ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ==================== STUDENTS TABLE MIGRATIONS ====================
ALTER TABLE students ADD COLUMN IF NOT EXISTS learner_name VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';
ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending_review';
ALTER TABLE students ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- ==================== ATTENDANCE TABLE MIGRATIONS ====================
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS date_from DATE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS date_to DATE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS training_location VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS training_circle VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS training_coordinator VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS ssipl_trainer VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS attendees JSONB DEFAULT '[]';
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add UNIQUE constraint on attendance.uid for upsert support (drop first if exists)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_uid_key'
  ) THEN
    ALTER TABLE attendance ADD CONSTRAINT attendance_uid_key UNIQUE (uid);
  END IF;
END $$;

-- ==================== MODERATION_PAGES TABLE MIGRATIONS ====================
ALTER TABLE moderation_pages ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';
ALTER TABLE moderation_pages ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE moderation_pages ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;

-- Add UNIQUE constraint on moderation_pages.uid for upsert support
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'moderation_pages_uid_key'
  ) THEN
    ALTER TABLE moderation_pages ADD CONSTRAINT moderation_pages_uid_key UNIQUE (uid);
  END IF;
END $$;

-- ==================== INDEXES FOR NEW COLUMNS ====================
CREATE INDEX IF NOT EXISTS idx_uids_link_generated_at ON uids(link_generated_at);
CREATE INDEX IF NOT EXISTS idx_uids_attendance_saved_at ON uids(attendance_saved_at);
CREATE INDEX IF NOT EXISTS idx_students_learner_name ON students(learner_name);

-- ============================================================
-- END OF MIGRATION SCRIPT
-- ============================================================

-- ============================================================
-- USER MANAGEMENT & UID ASSIGNMENT (Supabase Auth Integration)
-- ============================================================

-- 1. Create user_profiles table for Supabase Auth users
-- This stores additional profile info (role, name) linked to auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'assessor', 'moderator')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can delete profiles" ON user_profiles;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Admin can read all profiles
CREATE POLICY "Admin can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admin can insert new profiles
CREATE POLICY "Admin can insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admin can delete profiles (except self)
CREATE POLICY "Admin can delete profiles" ON user_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
    AND id != auth.uid()
  );

-- 2. Add assignment columns to uids table
ALTER TABLE uids 
  ADD COLUMN IF NOT EXISTS assigned_assessor_id UUID REFERENCES user_profiles(id),
  ADD COLUMN IF NOT EXISTS assigned_moderator_id UUID REFERENCES user_profiles(id);

-- 3. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_uids_assigned_assessor ON uids(assigned_assessor_id);
CREATE INDEX IF NOT EXISTS idx_uids_assigned_moderator ON uids(assigned_moderator_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================================
-- ADMIN ACCOUNT SETUP INSTRUCTIONS
-- ============================================================
-- STEP 1: Go to Supabase Dashboard > Authentication > Users
-- STEP 2: Click "Add User" and create admin account (e.g., admin@gmail.com)
-- STEP 3: Copy the User UUID from the table
-- STEP 4: Run this SQL (replace with your values):
-- 
-- INSERT INTO user_profiles (id, email, role, name)
-- VALUES (
--   'YOUR_ADMIN_USER_UUID_HERE',
--   'admin@gmail.com',
--   'admin',
--   'Administrator'
-- );
--
-- STEP 5: Login at /login with admin email + password
-- STEP 6: Go to User Management to create assessor/moderator accounts
-- ============================================================
