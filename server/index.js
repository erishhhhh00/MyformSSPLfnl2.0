
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server directory
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Environment config
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL ERROR: Supabase credentials missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log(`🚀 Server starting in ${NODE_ENV} mode`);
console.log(`📦 Database: Supabase (Strict Mode)`);

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));

// UID format: 1001, 1002, 1003... (sequential)
async function generateNextUid() {
  // Fetch all UIDs and find the true maximum
  const { data, error } = await supabase
    .from('uids')
    .select('uid');

  if (error) {
    console.warn('Error fetching UIDs:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return '1001'; // First UID
  }

  // Parse all UIDs as integers and find the maximum
  const uidNumbers = data.map(row => parseInt(row.uid, 10)).filter(n => !isNaN(n));
  const maxUid = Math.max(...uidNumbers);

  if (maxUid === 0 || !isFinite(maxUid)) {
    return '1001';
  }

  // Logic: 1001 -> 1002 -> 1003 (sequential)
  return String(maxUid + 1);
}

// Socket connection
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// =============================================
// API ROUTES
// =============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'supabase',
    environment: NODE_ENV
  });
});

// =============================================
// AUTHENTICATION & USER MANAGEMENT
// =============================================

// Login with email/password (Supabase Auth)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Login error:', authError);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return res.status(401).json({ error: 'User profile not found' });
    }

    res.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        name: profile.name
      },
      session: authData.session
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user from token
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return res.status(401).json({ error: 'Profile not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: profile.role,
      name: profile.name
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Create new user (Admin only) - creates auth user + profile
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const authHeader = req.headers.authorization;

    // Verify admin token from Authorization header
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user: adminUser } } = await supabase.auth.getUser(token);
    if (!adminUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: adminProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', adminUser.id)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Validate input
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (!['assessor', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be assessor or moderator' });
    }

    // Create auth user using service role (admin API)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm email
    });

    if (createError) {
      console.error('Create user error:', createError);
      return res.status(400).json({ error: createError.message });
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: newUser.user.id,
        email,
        role,
        name
      });

    if (profileError) {
      // Rollback: delete the auth user
      await supabase.auth.admin.deleteUser(newUser.user.id);
      console.error('Profile create error:', profileError);
      return res.status(400).json({ error: 'Failed to create profile' });
    }

    res.json({
      id: newUser.user.id,
      email,
      role,
      name
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// List all users (Admin only)
app.get('/api/users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get all users
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(users || []);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// Delete user (Admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Prevent deleting self
    if (id === user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete profile first
    await supabase.from('user_profiles').delete().eq('id', id);

    // Delete auth user
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Assign assessor/moderator to UID
app.put('/api/uid/:uid/assign', async (req, res) => {
  try {
    const { uid } = req.params;
    const { assessorId, moderatorId } = req.body;

    // Build update object
    const updateData = {};
    if (assessorId !== undefined) updateData.assigned_assessor_id = assessorId;
    if (moderatorId !== undefined) updateData.assigned_moderator_id = moderatorId;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one assignment required' });
    }

    const { error } = await supabase
      .from('uids')
      .update(updateData)
      .eq('uid', uid);

    if (error) throw error;

    // Emit socket event
    io.emit('uid_assigned', { uid, ...updateData });

    res.json({ success: true, uid, ...updateData });
  } catch (error) {
    console.error('Assign UID error:', error);
    res.status(500).json({ error: 'Failed to assign UID' });
  }
});


// ---------------------------------------------
// DASHBOARD STATS (Live from Supabase)
// ---------------------------------------------
app.get('/api/stats', async (req, res) => {
  try {
    // Fetch all UIDs with their status
    const { data: uids, error: uidsError } = await supabase
      .from('uids')
      .select('uid, status');

    if (uidsError) throw uidsError;

    // Fetch all students with their status
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('student_id, status, uid');

    if (studentsError) throw studentsError;

    const uidList = uids || [];
    const studentList = students || [];

    // Calculate UID-based stats
    const total_uids = uidList.length;
    const pending_count = uidList.filter(u => u.status === 'pending').length;
    const assessor_started_count = uidList.filter(u => u.status === 'assessor_started').length;
    const user_submitted_count = uidList.filter(u => u.status === 'user_submitted').length;
    const ready_for_moderation_count = uidList.filter(u => u.status === 'ready_for_moderation').length;
    const moderation_complete_count = uidList.filter(u => u.status === 'moderation_complete').length;
    const sent_to_admin_count = uidList.filter(u => u.status === 'sent_to_admin').length;
    const approved_count = uidList.filter(u => u.status === 'approved').length;

    // Calculate student-based stats
    const total_students = studentList.length;
    const students_pending_moderation = studentList.filter(s => s.status === 'pending_moderation').length;
    const students_moderated = studentList.filter(s => s.status === 'moderated').length;
    const students_sent_to_admin = studentList.filter(s => s.status === 'sent_to_admin').length;
    const students_approved = studentList.filter(s => s.status === 'approved').length;
    const students_rejected = studentList.filter(s => s.status === 'rejected').length;

    res.json({
      // UID Stats (Single Source of Truth: uids.status)
      total_uids,
      pending_count,                                           // Assessor: Pending (New UIDs)
      assessor_started_count,                                  // Assessor: Attendance Done
      user_submitted_count,                                    // Users Submitted
      ready_for_moderation_count,                              // With Moderator (ready)
      moderation_complete_count,                               // Moderation Complete
      sent_to_admin_count,                                     // Awaiting Admin Approval
      approved_count,                                          // Approved

      // Combined metrics for dashboards
      with_assessor_count: assessor_started_count,             // Admin: With Assessor
      with_moderator_count: ready_for_moderation_count + moderation_complete_count,  // Admin: With Moderator

      // Student Stats (Single Source of Truth: students.status)
      total_students,
      students_pending_moderation,                             // Moderator: Pending Moderation
      students_moderated,                                      // Moderator: Moderated
      students_sent_to_admin,
      students_approved,
      students_rejected
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ---------------------------------------------
// CREATE UID
// ---------------------------------------------
app.post('/api/uid', async (req, res) => {
  try {
    const { assessorName, assessorNumber, assessorAge } = req.body || {};

    // Generate next UID
    const uid = await generateNextUid();

    // Create new record
    const { error } = await supabase.from('uids').insert({
      uid,
      status: 'pending',
      assessor_name: assessorName || '',
      assessor_number: assessorNumber || '',
      assessor_age: assessorAge ? parseInt(assessorAge) : null,
      student_count: 0
    });

    if (error) throw error;

    const record = {
      uid,
      status: 'pending',
      createdAt: new Date().toISOString(),
      assessor: {
        name: assessorName || '',
        number: assessorNumber || '',
        age: assessorAge || ''
      },
      students: [],
      studentCount: 0
    };

    io.emit('uid_created', record);
    res.json(record);
  } catch (error) {
    console.error('Error creating UID:', error);
    res.status(500).json({ error: 'Failed to create UID' });
  }
});

// ---------------------------------------------
// DELETE UID (and all related data)
// ---------------------------------------------
app.delete('/api/uid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('🗑️ Deleting UID:', uid);

    // Delete students first (foreign key constraint)
    const { error: studentsError } = await supabase
      .from('students')
      .delete()
      .eq('uid', uid);

    if (studentsError) {
      console.warn('Error deleting students:', studentsError);
    }

    // Delete attendance
    const { error: attendanceError } = await supabase
      .from('attendance')
      .delete()
      .eq('uid', uid);

    if (attendanceError) {
      console.warn('Error deleting attendance:', attendanceError);
    }

    // Delete moderation data
    const { error: moderationError } = await supabase
      .from('moderation_pages')
      .delete()
      .eq('uid', uid);

    if (moderationError) {
      console.warn('Error deleting moderation:', moderationError);
    }

    // Delete UID itself
    const { error: uidError } = await supabase
      .from('uids')
      .delete()
      .eq('uid', uid);

    if (uidError) throw uidError;

    // Emit socket event for live sync
    io.emit('uid_deleted', { uid });
    console.log('✅ UID deleted successfully:', uid);

    res.json({ success: true, message: 'UID deleted successfully' });
  } catch (error) {
    console.error('Error deleting UID:', error);
    res.status(500).json({ error: 'Failed to delete UID' });
  }
});

// ---------------------------------------------
// LIST UIDs (with optional user filtering)
// ---------------------------------------------
app.get('/api/uids', async (req, res) => {
  try {
    const { userId, role } = req.query;

    // 1. Build query based on filters
    let query = supabase
      .from('uids')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by assigned user if userId provided
    if (userId && role === 'assessor') {
      query = query.eq('assigned_assessor_id', userId);
    } else if (userId && role === 'moderator') {
      query = query.eq('assigned_moderator_id', userId);
    }

    const { data: uidsData, error: uidsError } = await query;

    if (uidsError) throw uidsError;

    // 2. Fetch Students manually
    const uidList = uidsData.map(u => u.uid);
    let studentsData = [];

    if (uidList.length > 0) {
      const { data, error: studentsError } = await supabase
        .from('students')
        .select('student_id, learner_name, company_name, status, created_at, reviewed_at, approved_at, uid')
        .in('uid', uidList);

      if (studentsError) {
        console.warn('Error fetching students for join:', studentsError);
      } else {
        studentsData = data || [];
      }
    }

    const studentsByUid = studentsData.reduce((acc, student) => {
      if (!acc[student.uid]) acc[student.uid] = [];
      acc[student.uid].push(student);
      return acc;
    }, {});

    // 3. Fetch assigned user profiles for display
    const assessorIds = [...new Set(uidsData.map(u => u.assigned_assessor_id).filter(Boolean))];
    const moderatorIds = [...new Set(uidsData.map(u => u.assigned_moderator_id).filter(Boolean))];
    const allUserIds = [...new Set([...assessorIds, ...moderatorIds])];

    let userProfiles = {};
    if (allUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, name, email, role')
        .in('id', allUserIds);

      if (profiles) {
        userProfiles = profiles.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
      }
    }

    // 4. Transform to match expected format with assignee info
    const transformed = uidsData.map(u => ({
      uid: u.uid,
      status: u.status,
      createdAt: u.created_at,
      formLink: u.form_link,
      qrCodeUrl: u.qr_code_url,
      assessor: {
        name: u.assessor_name || '',
        number: u.assessor_number || '',
        age: u.assessor_age || ''
      },
      students: studentsByUid[u.uid] || [],
      studentCount: u.student_count || (studentsByUid[u.uid] || []).length,
      // New: assigned user info
      assignedAssessorId: u.assigned_assessor_id || null,
      assignedModeratorId: u.assigned_moderator_id || null,
      assignedAssessor: u.assigned_assessor_id ? userProfiles[u.assigned_assessor_id] || null : null,
      assignedModerator: u.assigned_moderator_id ? userProfiles[u.assigned_moderator_id] || null : null
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error listing UIDs:', error);
    res.status(500).json({ error: 'Failed to list UIDs' });
  }
});

// ---------------------------------------------
// GET ATTENDANCE
// ---------------------------------------------
app.get('/api/attendance/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"

    // Map snake_case to camelCase for frontend
    if (data) {
      const mapped = {
        uid: data.uid,
        dateFrom: data.date_from || '',
        dateTo: data.date_to || '',
        clientName: data.client_name || '',
        trainingLocation: data.training_location || '',
        trainingCircle: data.training_circle || '',
        trainingCoordinator: data.training_coordinator || '',
        ssiplTrainer: data.ssipl_trainer || '',
        attendees: data.attendees || []
      };
      res.json(mapped);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error getting attendance:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

// ---------------------------------------------
// SAVE ATTENDANCE
// ---------------------------------------------
app.post('/api/attendance/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const payload = req.body;

    // Upsert attendance
    const { error: attError } = await supabase
      .from('attendance')
      .upsert({
        uid,
        date_from: payload.dateFrom || null,
        date_to: payload.dateTo || null,
        client_name: payload.clientName || '',
        training_location: payload.trainingLocation || '',
        training_circle: payload.trainingCircle || '',
        training_coordinator: payload.trainingCoordinator || '',
        ssipl_trainer: payload.ssiplTrainer || '',
        attendees: payload.attendees || []
      }, { onConflict: 'uid' });

    if (attError) throw attError;

    // Update UID status to assessor_started if it was pending
    // We only want to set it to 'assessor_started' if it's new. 
    // If it's already 'user_submitted' or further, we shouldn't revert it.
    // Fetch current status first or use conditional update?
    // User requirement: "Once apply now -> Attendance Sheet -> Save".

    const { data: currentUid } = await supabase
      .from('uids')
      .select('status')
      .eq('uid', uid)
      .single();

    if (currentUid && currentUid.status === 'pending') {
      await supabase
        .from('uids')
        .update({ status: 'assessor_started', attendance_saved_at: new Date().toISOString() })
        .eq('uid', uid);
    }

    io.emit('attendance_saved', { uid, payload });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});


// ---------------------------------------------
// SAVE USER FORM
// ---------------------------------------------
app.post('/api/user_form/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const payload = req.body;
    const studentId = `${uid}-${Date.now()}`; // Generate Student ID

    // DEBUG: Log what we're receiving
    console.log('📝 User form submission received:');
    console.log('  UID:', uid);
    console.log('  payload.page1:', JSON.stringify(payload.page1, null, 2));
    console.log('  learnerName:', payload.page1?.learnerName);
    console.log('  companyName:', payload.page1?.companyName);

    const studentSubmission = {
      studentId,
      formData: payload,
      learnerName: payload.page1?.learnerName || '',
      companyName: payload.page1?.companyName || ''
    };

    // Insert student with pending_assessor_review status (Assessor reviews first)
    const { error: studentError } = await supabase.from('students').insert({
      student_id: studentId,
      uid,
      learner_name: studentSubmission.learnerName,
      company_name: studentSubmission.companyName,
      form_data: payload,
      status: 'pending_assessor_review'  // Assessor must review before moderation
    });

    if (studentError) throw studentError;

    // Increment student_count and set to user_submitted (Assessor needs to review first)
    const { data: uidData } = await supabase
      .from('uids')
      .select('student_count')
      .eq('uid', uid)
      .single();

    const newCount = (uidData?.student_count || 0) + 1;

    await supabase
      .from('uids')
      .update({
        status: 'user_submitted',  // Set to user_submitted, Assessor review comes next
        student_count: newCount
      })
      .eq('uid', uid);

    io.emit('user_form_saved', { uid, studentId, studentCount: newCount });
    io.emit('user_submitted', { uid });  // Notify dashboards
    res.json({ success: true, studentId });
  } catch (error) {
    console.error('Error saving user form:', error);
    res.status(500).json({ error: 'Failed to save user form' });
  }
});


// ---------------------------------------------
// ASSESSOR REVIEW - SAVE EDITS
// ---------------------------------------------
app.put('/api/assessor-review/:uid/:studentId', async (req, res) => {
  try {
    const { uid, studentId } = req.params;
    const { form_data } = req.body;

    // Update student's form data with Assessor's edits
    const { error } = await supabase
      .from('students')
      .update({
        form_data,
        learner_name: form_data?.page1?.learnerName || '',
        company_name: form_data?.page1?.companyName || ''
      })
      .eq('uid', uid)
      .eq('student_id', studentId);

    if (error) throw error;

    io.emit('assessor_edited', { uid, studentId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving Assessor edits:', error);
    res.status(500).json({ error: 'Failed to save Assessor edits' });
  }
});

// ---------------------------------------------
// ASSESSOR REVIEW - MARK AS REVIEWED
// ---------------------------------------------
app.post('/api/assessor-review/:uid/:studentId/complete', async (req, res) => {
  try {
    const { uid, studentId } = req.params;

    // Update student status to pending_moderation (ready for moderator)
    const { error: studentError } = await supabase
      .from('students')
      .update({
        status: 'pending_moderation'
      })
      .eq('uid', uid)
      .eq('student_id', studentId);

    if (studentError) throw studentError;

    // Check if all students for this UID are reviewed
    const { data: allStudents } = await supabase
      .from('students')
      .select('status')
      .eq('uid', uid);

    const allReviewed = allStudents?.every(s =>
      s.status === 'assessor_reviewed' ||
      s.status === 'pending_moderation' ||
      s.status === 'moderated' ||
      s.status === 'sent_to_admin' ||
      s.status === 'approved'
    );

    // Update UID status if all students reviewed - send to moderation
    if (allReviewed) {
      await supabase
        .from('uids')
        .update({
          status: 'ready_for_moderation',
          sent_to_moderator_at: new Date().toISOString()
        })
        .eq('uid', uid);
    }

    io.emit('assessor_review_complete', { uid, studentId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking as reviewed:', error);
    res.status(500).json({ error: 'Failed to mark as reviewed' });
  }
});

// ---------------------------------------------
// SEND TO MODERATOR
// ---------------------------------------------
app.post('/api/send_to_moderator/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const { error } = await supabase
      .from('uids')
      .update({
        status: 'ready_for_moderation',
        sent_to_moderator_at: new Date().toISOString()
      })
      .eq('uid', uid);

    if (error) throw error;

    io.emit('send_to_moderator', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending to moderator:', error);
    res.status(500).json({ error: 'Failed to send to moderator' });
  }
});

// ---------------------------------------------
// SAVE MODERATION (PAGES 1-6)
// ---------------------------------------------
app.post('/api/moderation/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const payload = req.body; // Moderation Pages 1-6 data

    const { error } = await supabase
      .from('moderation_pages')
      .upsert({
        uid,
        form_data: payload,
        status: 'completed',
        submitted_at: new Date().toISOString()
      }, { onConflict: 'uid' });

    if (error) throw error;

    // Update UID status to indicate moderation is done
    await supabase
      .from('uids')
      .update({ status: 'moderation_complete' })
      .eq('uid', uid);

    io.emit('moderation_saved', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving moderation:', error);
    res.status(500).json({ error: 'Failed to save moderation' });
  }
});

// ---------------------------------------------
// GET MODERATION DATA (Check if form exists)
// ---------------------------------------------
app.get('/api/moderation/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { data, error } = await supabase
      .from('moderation_pages')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"

    res.json(data || null);
  } catch (error) {
    console.error('Error getting moderation:', error);
    res.status(500).json({ error: 'Failed to get moderation' });
  }
});

// ---------------------------------------------
// SEND TO ADMIN
// ---------------------------------------------
app.post('/api/send_to_admin/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const { error } = await supabase
      .from('uids')
      .update({
        status: 'sent_to_admin',
        sent_to_admin_at: new Date().toISOString()
      })
      .eq('uid', uid);

    if (error) throw error;

    io.emit('sent_to_admin', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending to admin:', error);
    res.status(500).json({ error: 'Failed to send to admin' });
  }
});

// ---------------------------------------------
// ADMIN APPROVE
// ---------------------------------------------
app.post('/api/admin_approve/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const { error } = await supabase
      .from('uids')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('uid', uid);

    if (error) throw error;

    io.emit('uid_approved', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error approving UID:', error);
    res.status(500).json({ error: 'Failed to approve UID' });
  }
});


// ---------------------------------------------
// GENERATE QR/LINK
// ---------------------------------------------
app.post('/api/qr/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const origin = req.headers.origin || FRONTEND_URL;
    const link = `${origin}/user/${uid}`;

    const qrCodeDataUrl = await QRCode.toDataURL(link);

    const { error } = await supabase
      .from('uids')
      .update({
        form_link: link,
        qr_code_url: qrCodeDataUrl,
        link_generated_at: new Date().toISOString()
      })
      .eq('uid', uid);

    if (error) throw error;

    io.emit('qr_generated', { uid, link, qrCodeUrl: qrCodeDataUrl });
    res.json({ uid, link, qrCodeUrl: qrCodeDataUrl });
  } catch (error) {
    console.error('Error generating QR:', error);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// ---------------------------------------------
// GET STUDENT DATA (for SubmissionReviewPage)
// ---------------------------------------------
app.get('/api/student/:uid/:studentId', async (req, res) => {
  try {
    const { uid, studentId } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.error('Error fetching student:', error);
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// ---------------------------------------------
// GET MODERATION DATA (for Moderation PDF)
// ---------------------------------------------
app.get('/api/moderation/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const { data, error } = await supabase
      .from('moderation_pages')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error) {
      console.error('Error fetching moderation:', error);
      return res.status(404).json({ error: 'Moderation data not found' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Moderation data not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching moderation:', error);
    res.status(500).json({ error: 'Failed to fetch moderation data' });
  }
});
// ---------------------------------------------
// UPDATE STUDENT STATUS (For Moderation Workflow)
// ---------------------------------------------
app.post('/api/student/:uid/:studentId/status', async (req, res) => {
  try {
    const { uid, studentId } = req.params;
    const { status } = req.body;

    const updateData = { status };

    // Track timestamps based on status
    if (status === 'moderated') {
      updateData.reviewed_at = new Date().toISOString();
    }
    if (status === 'sent_to_admin') {
      updateData.reviewed_at = new Date().toISOString();
    }
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('students')
      .update(updateData)
      .eq('student_id', studentId);

    if (error) throw error;

    // Check if all students for this UID have been approved - update UID status
    const { data: allStudents } = await supabase
      .from('students')
      .select('status')
      .eq('uid', uid);

    const allApproved = allStudents?.every(s => s.status === 'approved');
    const allModeratedOrBetter = allStudents?.every(s =>
      s.status === 'moderated' ||
      s.status === 'sent_to_admin' ||
      s.status === 'approved'
    );

    // Update UID status based on student statuses
    if (allApproved) {
      await supabase
        .from('uids')
        .update({ status: 'approved' })
        .eq('uid', uid);
      io.emit('uid_approved', { uid });
    } else if (status === 'sent_to_admin' && allModeratedOrBetter) {
      await supabase
        .from('uids')
        .update({ status: 'moderation_complete' })
        .eq('uid', uid);
    }

    io.emit('student_status_updated', { uid, studentId, status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ error: 'Failed to update student status' });
  }
});

// ---------------------------------------------
// GET STUDENTS FOR MODERATION (All students with pending_moderation status)
// ---------------------------------------------
app.get('/api/students/pending-moderation', async (req, res) => {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('status', 'pending_moderation')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(students || []);
  } catch (error) {
    console.error('Error fetching pending moderation:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ---------------------------------------------
// GET ALL STUDENTS (with optional status filter)
// ---------------------------------------------
app.get('/api/students', async (req, res) => {
  try {
    const { status, uid } = req.query;

    let query = supabase.from('students').select('*').order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (uid) query = query.eq('uid', uid);

    const { data: students, error } = await query;

    if (error) throw error;
    res.json(students || []);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ---------------------------------------------
// PDF GENERATION (MERGED: Student + Moderation)
// ---------------------------------------------
app.post('/api/pdf/student/:uid/:studentId', async (req, res) => {
  try {
    const { uid, studentId } = req.params;

    // 1. Fetch Student Data
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (studentError) throw studentError;
    if (!studentData) return res.status(404).json({ error: 'Student not found' });

    // 2. Fetch Moderation Data (if active)
    let moderationData = null;
    try {
      const { data: modData } = await supabase
        .from('moderation_pages')
        .select('*')
        .eq('uid', uid)
        .single();
      if (modData) moderationData = modData.form_data;
    } catch (e) {
      console.warn('Moderation fetch warning:', e);
    }

    // 3. Generate PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      const base64Pdf = pdfBuffer.toString('base64');
      res.json({
        success: true,
        pdf: base64Pdf,
        filename: `student_${studentId}.pdf`
      });
    });

    // --- PDF CONTENT START ---

    // === PART 1: STUDENT FORM (Pages 1-17) ===
    doc.fontSize(20).font('Helvetica-Bold').text('User Application Form', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`UID: ${uid}`, { align: 'center' });
    doc.text(`Student ID: ${studentId}`, { align: 'center' });
    doc.moveDown();

    const formData = studentData.form_data || {};

    // Render all 17 pages (Simplified loop for now)
    for (let i = 1; i <= 17; i++) {
      doc.addPage();
      doc.fontSize(16).text(`Form Page ${i}`, { underline: true });
      doc.moveDown();
      const pageData = formData[`page${i}`];
      if (pageData) {
        doc.fontSize(10);
        Object.entries(pageData).forEach(([k, v]) => {
          if (typeof v === 'object') {
            doc.text(`${k}: ${JSON.stringify(v)}`);
          } else {
            doc.text(`${k}: ${v || 'N/A'}`);
          }
          doc.moveDown(0.5);
        });
      }
    }

    // === PART 2: MODERATION FORM (Pages 1-6) ===
    if (moderationData) {
      doc.addPage(); // Start moderation on new page
      doc.fontSize(20).font('Helvetica-Bold').text('Moderation Report', { align: 'center' });
      doc.moveDown();

      for (let i = 1; i <= 6; i++) {
        doc.addPage();
        doc.fontSize(16).text(`Moderation Page ${i}`, { underline: true });
        doc.moveDown();
        const pageData = moderationData[`page${i}`];
        if (pageData) {
          doc.fontSize(10);
          Object.entries(pageData).forEach(([k, v]) => {
            // Filter out non-printable or complex objects if needed
            if (typeof v === 'object') {
              doc.text(`${k}: ${JSON.stringify(v)}`);
            } else {
              doc.text(`${k}: ${v || 'N/A'}`);
            }
            doc.moveDown(0.5);
          });
        }
      }
    }

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// ---------------------------------------------
// PDF GENERATION: ATTENDANCE SHEET
// ---------------------------------------------
app.post('/api/pdf/attendance/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Fetch Attendance Data
    const { data: attData, error: attError } = await supabase
      .from('attendance')
      .select('*')
      .eq('uid', uid)
      .single();

    if (attError && attError.code !== 'PGRST116') throw attError;
    if (!attData) return res.status(404).json({ error: 'Attendance not found' });

    // Fetch UID data for assessor info
    const { data: uidData } = await supabase
      .from('uids')
      .select('*')
      .eq('uid', uid)
      .single();

    // Generate PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      const base64Pdf = pdfBuffer.toString('base64');
      res.json({
        success: true,
        pdf: base64Pdf,
        filename: `attendance_${uid}.pdf`
      });
    });

    // --- PDF CONTENT: ATTENDANCE SHEET (Matching Browser Design) ---
    const pageWidth = 515;
    const leftMargin = 40;

    // ========== HEADER: Blue Gradient Box ==========
    doc.rect(leftMargin, 40, pageWidth, 60).fill('#1e40af'); // Blue header
    doc.fillColor('white').fontSize(20).font('Helvetica-Bold');
    doc.text('RISE-Q : ATTENDANCE SHEET', leftMargin, 50, { width: pageWidth, align: 'center' });
    doc.fontSize(10).font('Helvetica');
    doc.text('Rescue, Inspection, Safety, Elevation – Quality', leftMargin, 75, { width: pageWidth, align: 'center' });

    // UID Badge
    doc.rect(leftMargin + pageWidth / 2 - 50, 102, 100, 25).fill('#dc2626'); // Red badge
    doc.fillColor('white').fontSize(14).font('Helvetica-Bold');
    doc.text(uid, leftMargin + pageWidth / 2 - 50, 108, { width: 100, align: 'center' });

    doc.fillColor('black');
    doc.y = 140;

    // ========== TRAINING DETAILS Section ==========
    doc.rect(leftMargin, doc.y, pageWidth, 120).stroke('#374151');
    const detailsStartY = doc.y + 10;

    // Section Header
    doc.fillColor('#1f2937').fontSize(11).font('Helvetica-Bold');
    doc.text('TRAINING DETAILS', leftMargin + 10, detailsStartY);

    // Two Column Layout
    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    const col1X = leftMargin + 15;
    const col2X = leftMargin + pageWidth / 2 + 10;
    let detailY = detailsStartY + 20;
    const lineHeight = 18;

    // Left Column
    doc.font('Helvetica-Bold').text('UID:', col1X, detailY);
    doc.font('Helvetica').fillColor('#2563eb').text(uid, col1X + 100, detailY);
    doc.fillColor('#374151');
    detailY += lineHeight;

    doc.font('Helvetica-Bold').text('Client Name:', col1X, detailY);
    doc.font('Helvetica').text(attData.client_name || 'N/A', col1X + 100, detailY);
    detailY += lineHeight;

    doc.font('Helvetica-Bold').text('Training Location:', col1X, detailY);
    doc.font('Helvetica').text(attData.training_location || 'N/A', col1X + 100, detailY);
    detailY += lineHeight;

    doc.font('Helvetica-Bold').text('Training Circle:', col1X, detailY);
    doc.font('Helvetica').text(attData.training_circle || 'N/A', col1X + 100, detailY);

    // Right Column
    detailY = detailsStartY + 20;
    doc.font('Helvetica-Bold').text('Date From:', col2X, detailY);
    doc.font('Helvetica').text(attData.date_from || 'N/A', col2X + 100, detailY);
    detailY += lineHeight;

    doc.font('Helvetica-Bold').text('Date To:', col2X, detailY);
    doc.font('Helvetica').text(attData.date_to || 'N/A', col2X + 100, detailY);
    detailY += lineHeight;

    doc.font('Helvetica-Bold').text('Training Coordinator:', col2X, detailY);
    doc.font('Helvetica').text(attData.training_coordinator || 'N/A', col2X + 100, detailY);
    detailY += lineHeight;

    doc.font('Helvetica-Bold').text('SSIPL Trainer:', col2X, detailY);
    doc.font('Helvetica').text(attData.ssipl_trainer || 'N/A', col2X + 100, detailY);

    // Assessor Info
    detailY += lineHeight;
    if (uidData) {
      doc.font('Helvetica-Bold').text('Assessor:', col1X, detailY);
      doc.font('Helvetica').text(`${uidData.assessor_name || 'N/A'} (${uidData.assessor_number || ''})`, col1X + 100, detailY);
    }

    doc.y = detailsStartY + 130;

    // ========== ATTENDEES TABLE ==========
    // Table Header
    doc.rect(leftMargin, doc.y, pageWidth, 25).fill('#1f2937');
    doc.fillColor('white').fontSize(11).font('Helvetica-Bold');
    doc.text('ATTENDEES LIST', leftMargin, doc.y + 7, { width: pageWidth, align: 'center' });

    doc.y += 30;

    const attendees = attData.attendees || [];
    const tableTop = doc.y;

    // Table column headers
    const headers = ['S.No', 'Learner Name', 'Company', 'Designation', 'Emp ID', 'Phone', 'Email', 'Govt ID', 'Emergency'];
    const colWidths = [30, 80, 60, 55, 45, 55, 70, 55, 55];

    // Draw table header row
    doc.rect(leftMargin, tableTop, pageWidth, 20).fill('#f3f4f6').stroke('#d1d5db');
    doc.fillColor('#374151').font('Helvetica-Bold').fontSize(7);
    let xPos = leftMargin + 3;
    headers.forEach((header, i) => {
      doc.text(header, xPos, tableTop + 6, { width: colWidths[i], align: 'center' });
      xPos += colWidths[i];
    });

    // Draw table rows
    let rowY = tableTop + 20;
    doc.font('Helvetica').fontSize(7);

    // Draw 10 rows (empty or filled)
    for (let i = 0; i < 10; i++) {
      if (rowY > 750) {
        doc.addPage();
        rowY = 50;
      }

      const rowHeight = 20;
      const isEven = i % 2 === 0;
      doc.rect(leftMargin, rowY, pageWidth, rowHeight).fill(isEven ? '#ffffff' : '#f9fafb').stroke('#e5e7eb');

      const attendee = attendees[i] || {};
      xPos = leftMargin + 3;
      doc.fillColor('#374151');

      doc.text(String(i + 1), xPos, rowY + 6, { width: colWidths[0], align: 'center' });
      xPos += colWidths[0];
      doc.text(attendee.learnerName || '-', xPos, rowY + 6, { width: colWidths[1], align: 'center' });
      xPos += colWidths[1];
      doc.text(attendee.companyName || '-', xPos, rowY + 6, { width: colWidths[2], align: 'center' });
      xPos += colWidths[2];
      doc.text(attendee.designation || '-', xPos, rowY + 6, { width: colWidths[3], align: 'center' });
      xPos += colWidths[3];
      doc.text(attendee.employeeId || '-', xPos, rowY + 6, { width: colWidths[4], align: 'center' });
      xPos += colWidths[4];
      doc.text(attendee.phoneNumber || '-', xPos, rowY + 6, { width: colWidths[5], align: 'center' });
      xPos += colWidths[5];
      doc.text(attendee.email || '-', xPos, rowY + 6, { width: colWidths[6], align: 'center' });
      xPos += colWidths[6];
      doc.text(attendee.govtId || '-', xPos, rowY + 6, { width: colWidths[7], align: 'center' });
      xPos += colWidths[7];
      doc.text(attendee.emergencyContact || '-', xPos, rowY + 6, { width: colWidths[8], align: 'center' });

      rowY += rowHeight;
    }

    // ========== SIGNATURES Section (Horizontal Layout) ==========
    let signatureStartY = rowY + 150; // Large gap (100px) but try to stay on same page

    // REMOVED page break logic to force same page as requested
    // If it's too lower, it might cut off, but user explicitly asked "page break nhin hona chahie"

    const lineWidth = 100; // Reduced line width
    const sigCol1X = leftMargin;
    const sigCol2X = leftMargin + pageWidth / 2 + 20;

    // ---- ROW 1: Name of Training Coordinator | Name of SSIPL Trainer ----
    let currentY = signatureStartY;
    doc.fontSize(9).fillColor('#374151').font('Helvetica-Bold');

    // Left: Training Coordinator Name
    doc.text('Name of Training Coordinator:', sigCol1X, currentY);
    // Line at baseline (y + 10)
    doc.strokeColor('#374151');
    doc.moveTo(sigCol1X + 145, currentY + 10).lineTo(sigCol1X + 145 + lineWidth, currentY + 10).stroke();
    // Value on top of line
    doc.font('Helvetica').fontSize(9).fillColor('#1f2937');
    doc.text(attData.training_coordinator || '', sigCol1X + 150, currentY);

    // Right: SSIPL Trainer Name
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151');
    doc.text('Name of SSIPL Trainer:', sigCol2X, currentY);
    doc.strokeColor('#374151');
    doc.moveTo(sigCol2X + 110, currentY + 10).lineTo(sigCol2X + 110 + lineWidth, currentY + 10).stroke();
    doc.font('Helvetica').fontSize(9).fillColor('#1f2937');
    doc.text(attData.ssipl_trainer || '', sigCol2X + 115, currentY);

    // ---- ROW 2: Signature | UID ----
    currentY += 35; // Increased vertical gap between rows
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151');

    // Left: Signature
    doc.text('Signature:', sigCol1X, currentY);
    doc.strokeColor('#374151');
    doc.moveTo(sigCol1X + 50, currentY + 10).lineTo(sigCol1X + 50 + lineWidth + 20, currentY + 10).stroke();

    // Right: UID
    doc.text('UID:', sigCol2X, currentY);
    doc.strokeColor('#374151');
    doc.moveTo(sigCol2X + 25, currentY + 10).lineTo(sigCol2X + 25 + lineWidth, currentY + 10).stroke();
    doc.font('Helvetica').fontSize(10).fillColor('#2563eb');
    doc.text(uid, sigCol2X + 30, currentY - 2); // UID slightly adjusted

    // Footer
    doc.y = currentY + 50;
    doc.fontSize(8).fillColor('#9ca3af').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Error generating attendance PDF:', error);
    res.status(500).json({ error: 'Failed to generate attendance PDF' });
  }
});

// ---------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------
app.get('/api/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('uids')
      .select('status, student_count');

    if (error) throw error;

    res.json({
      total_uids: data.length,
      pending_count: data.filter(u => u.status === 'pending').length,
      assessor_started_count: data.filter(u => u.status === 'assessor_started').length,
      user_submitted_count: data.filter(u => u.status === 'user_submitted').length,
      ready_for_moderation_count: data.filter(u => u.status === 'ready_for_moderation').length,
      moderator_review_count: data.filter(u => u.status === 'moderator_review').length,
      sent_to_admin_count: data.filter(u => u.status === 'sent_to_admin').length,
      approved_count: data.filter(u => u.status === 'approved').length,
      total_students: data.reduce((sum, u) => sum + (u.student_count || 0), 0)
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});


server.listen(PORT, () => {
  console.log(`\n🎉 Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});
