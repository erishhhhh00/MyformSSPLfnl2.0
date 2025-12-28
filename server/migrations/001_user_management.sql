-- ============================================
-- User Management & UID Assignment Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create users table for assessors/moderators
-- Using Supabase Auth - this stores additional profile info
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'assessor', 'moderator')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- ADMIN ACCOUNT SETUP (Run AFTER migration)
-- ============================================
-- Go to Supabase Dashboard > Authentication > Users
-- Click "Add User" and create the admin account
-- Then run this SQL to set the admin role:
-- 
-- INSERT INTO user_profiles (id, email, role, name)
-- VALUES (
--   'YOUR_ADMIN_USER_UUID_FROM_AUTH_USERS',
--   'admin@yourcompany.com',
--   'admin',
--   'Administrator'
-- );
