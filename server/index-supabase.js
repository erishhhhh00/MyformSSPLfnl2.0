import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

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
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const useSupabase = !!supabase;

console.log(`🚀 Server starting in ${NODE_ENV} mode`);
console.log(`📦 Database: ${useSupabase ? 'Supabase' : 'JSON File (fallback)'}`);

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production' ? FRONTEND_URL : '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));

// JSON file fallback storage
const DATA_PATH = path.join(process.cwd(), 'data.json');

function readData() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const initial = { uids: [], attendance: {}, user_forms: {}, moderation_pages: {} };
      fs.writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    console.error('Error reading data file:', e);
    return { uids: [], attendance: {}, user_forms: {}, moderation_pages: {} };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing data file:', e);
  }
}

// UID generation (1001, 2001, 3001...)
async function generateNextUid() {
  if (useSupabase) {
    const { data, error } = await supabase
      .from('uids')
      .select('uid')
      .order('uid', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    const maxUid = data?.[0]?.uid ? parseInt(data[0].uid) : 0;
    if (maxUid === 0) return '1001';
    const series = Math.floor(maxUid / 1000);
    return String((series + 1) * 1000 + 1);
  } else {
    const data = readData();
    const nums = data.uids.map(u => parseInt(u.uid, 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return '1001';
    const max = Math.max(...nums);
    const series = Math.floor(max / 1000);
    return String((series + 1) * 1000 + 1);
  }
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
    database: useSupabase ? 'supabase' : 'json',
    environment: NODE_ENV 
  });
});

// ---------------------------------------------
// CREATE UID
// ---------------------------------------------
app.post('/api/uid', async (req, res) => {
  try {
    const { assessorName, assessorNumber, assessorAge } = req.body || {};
    const uid = await generateNextUid();
    
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

    if (useSupabase) {
      const { error } = await supabase.from('uids').insert({
        uid,
        status: 'pending',
        assessor_name: assessorName || '',
        assessor_number: assessorNumber || '',
        assessor_age: assessorAge || '',
        student_count: 0
      });
      if (error) throw error;
      
      // Log activity
      await supabase.from('activity_log').insert({
        uid,
        action: 'uid_created',
        actor_type: 'admin',
        details: { assessorName, assessorNumber, assessorAge }
      });
    } else {
      const data = readData();
      data.uids.push(record);
      writeData(data);
    }

    io.emit('uid_created', record);
    res.json(record);
  } catch (error) {
    console.error('Error creating UID:', error);
    res.status(500).json({ error: 'Failed to create UID' });
  }
});

// ---------------------------------------------
// LIST UIDs
// ---------------------------------------------
app.get('/api/uids', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('uids')
        .select('*, students:students(student_id, learner_name, company_name, status, submitted_at)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match expected format
      const transformed = data.map(u => ({
        uid: u.uid,
        status: u.status,
        createdAt: u.created_at,
        formLink: u.form_link,
        assessor: {
          name: u.assessor_name || '',
          number: u.assessor_number || '',
          age: u.assessor_age || ''
        },
        students: u.students || [],
        studentCount: u.student_count || 0
      }));
      
      res.json(transformed);
    } else {
      const data = readData();
      res.json(data.uids);
    }
  } catch (error) {
    console.error('Error listing UIDs:', error);
    res.status(500).json({ error: 'Failed to list UIDs' });
  }
});

// ---------------------------------------------
// GET SINGLE UID
// ---------------------------------------------
app.get('/api/uid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (useSupabase) {
      const { data, error } = await supabase
        .from('uids')
        .select(`
          *,
          attendance:attendance(*),
          students:students(*),
          moderation:moderation_pages(*)
        `)
        .eq('uid', uid)
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'UID not found' });
      
      res.json({
        uid: data.uid,
        status: data.status,
        createdAt: data.created_at,
        formLink: data.form_link,
        assessor: {
          name: data.assessor_name,
          number: data.assessor_number,
          age: data.assessor_age
        },
        students: data.students || [],
        studentCount: data.student_count,
        attendance: data.attendance?.[0] || null,
        moderation: data.moderation?.[0] || null
      });
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (!u) return res.status(404).json({ error: 'UID not found' });
      
      res.json({
        ...u,
        attendance: data.attendance[uid] || null,
        moderation: data.moderation_pages[uid] || null
      });
    }
  } catch (error) {
    console.error('Error getting UID:', error);
    res.status(500).json({ error: 'Failed to get UID' });
  }
});

// ---------------------------------------------
// SAVE ATTENDANCE
// ---------------------------------------------
app.post('/api/attendance/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const payload = req.body;

    if (useSupabase) {
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
      
      // Update UID status
      await supabase
        .from('uids')
        .update({ status: 'assessor_started', attendance_saved_at: new Date().toISOString() })
        .eq('uid', uid);
      
      // Log activity
      await supabase.from('activity_log').insert({
        uid,
        action: 'attendance_saved',
        actor_type: 'assessor'
      });
    } else {
      const data = readData();
      data.attendance[uid] = payload;
      const u = data.uids.find(x => x.uid === uid);
      if (u) u.status = 'assessor_started';
      writeData(data);
    }

    io.emit('attendance_saved', { uid, payload });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

// ---------------------------------------------
// SAVE USER FORM (Multiple students per UID)
// ---------------------------------------------
app.post('/api/user_form/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const payload = req.body;
    const studentId = `${uid}-${Date.now()}`;
    
    const studentSubmission = {
      studentId,
      formData: payload,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      learnerName: payload.page1?.learnerName || '',
      companyName: payload.page1?.companyName || ''
    };

    let studentCount = 1;

    if (useSupabase) {
      // Insert student
      const { error: studentError } = await supabase.from('students').insert({
        student_id: studentId,
        uid,
        learner_name: studentSubmission.learnerName,
        company_name: studentSubmission.companyName,
        form_data: payload,
        status: 'pending_review'
      });
      
      if (studentError) throw studentError;
      
      // Update UID status and get count
      const { data: uidData } = await supabase
        .from('uids')
        .update({ status: 'user_submitted' })
        .eq('uid', uid)
        .select('student_count')
        .single();
      
      studentCount = uidData?.student_count || 1;
      
      // Log activity
      await supabase.from('activity_log').insert({
        uid,
        action: 'user_form_submitted',
        actor_type: 'user',
        actor_name: studentSubmission.learnerName,
        details: { studentId }
      });
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (u) {
        if (!u.students) u.students = [];
        u.students.push(studentSubmission);
        u.studentCount = u.students.length;
        u.status = 'user_submitted';
        studentCount = u.studentCount;
      }
      
      if (!data.user_forms[uid]) data.user_forms[uid] = [];
      data.user_forms[uid].push(studentSubmission);
      writeData(data);
    }

    io.emit('user_form_saved', { uid, studentId, studentCount });
    res.json({ success: true, studentId });
  } catch (error) {
    console.error('Error saving user form:', error);
    res.status(500).json({ error: 'Failed to save user form' });
  }
});

// ---------------------------------------------
// SAVE MODERATION
// ---------------------------------------------
app.post('/api/moderation/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const payload = req.body;

    if (useSupabase) {
      const { error } = await supabase
        .from('moderation_pages')
        .upsert({
          uid,
          form_data: payload,
          status: 'completed',
          submitted_at: new Date().toISOString()
        }, { onConflict: 'uid' });
      
      if (error) throw error;
      
      await supabase
        .from('uids')
        .update({ status: 'moderator_review' })
        .eq('uid', uid);
      
      await supabase.from('activity_log').insert({
        uid,
        action: 'moderation_submitted',
        actor_type: 'moderator'
      });
    } else {
      const data = readData();
      data.moderation_pages[uid] = payload;
      const u = data.uids.find(x => x.uid === uid);
      if (u) u.status = 'moderator_review';
      writeData(data);
    }

    io.emit('moderation_saved', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving moderation:', error);
    res.status(500).json({ error: 'Failed to save moderation' });
  }
});

// ---------------------------------------------
// SEND TO MODERATOR
// ---------------------------------------------
app.post('/api/send_to_moderator/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    if (useSupabase) {
      await supabase
        .from('uids')
        .update({ status: 'ready_for_moderation', sent_to_moderator_at: new Date().toISOString() })
        .eq('uid', uid);
      
      await supabase.from('activity_log').insert({
        uid,
        action: 'sent_to_moderator',
        actor_type: 'assessor'
      });
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (!u) return res.status(404).json({ error: 'UID not found' });
      u.status = 'ready_for_moderation';
      writeData(data);
    }

    io.emit('send_to_moderator', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending to moderator:', error);
    res.status(500).json({ error: 'Failed to send to moderator' });
  }
});

// ---------------------------------------------
// SEND TO ADMIN
// ---------------------------------------------
app.post('/api/send_to_admin/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    if (useSupabase) {
      await supabase
        .from('uids')
        .update({ status: 'sent_to_admin', sent_to_admin_at: new Date().toISOString() })
        .eq('uid', uid);
      
      await supabase.from('activity_log').insert({
        uid,
        action: 'sent_to_admin',
        actor_type: 'moderator'
      });
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (!u) return res.status(404).json({ error: 'UID not found' });
      u.status = 'sent_to_admin';
      writeData(data);
    }

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

    if (useSupabase) {
      await supabase
        .from('uids')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('uid', uid);
      
      await supabase.from('activity_log').insert({
        uid,
        action: 'approved',
        actor_type: 'admin'
      });
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (!u) return res.status(404).json({ error: 'UID not found' });
      u.status = 'approved';
      writeData(data);
    }

    io.emit('uid_approved', { uid });
    res.json({ success: true });
  } catch (error) {
    console.error('Error approving UID:', error);
    res.status(500).json({ error: 'Failed to approve UID' });
  }
});

// ---------------------------------------------
// UPDATE STUDENT STATUS
// ---------------------------------------------
app.post('/api/student/:uid/:studentId/status', async (req, res) => {
  try {
    const { uid, studentId } = req.params;
    const { status } = req.body;

    if (useSupabase) {
      const updateData = { status };
      if (status === 'approved') updateData.approved_at = new Date().toISOString();
      if (status !== 'pending_review') updateData.reviewed_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('students')
        .update(updateData)
        .eq('student_id', studentId);
      
      if (error) throw error;
      
      await supabase.from('activity_log').insert({
        uid,
        action: `student_${status}`,
        actor_type: 'assessor',
        details: { studentId }
      });
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (!u) return res.status(404).json({ error: 'UID not found' });
      
      const student = u.students?.find(s => s.studentId === studentId);
      if (!student) return res.status(404).json({ error: 'Student not found' });
      
      student.status = status;
      student.updatedAt = new Date().toISOString();
      writeData(data);
    }

    io.emit('student_status_updated', { uid, studentId, status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ error: 'Failed to update student status' });
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

    if (useSupabase) {
      await supabase
        .from('uids')
        .update({ form_link: link })
        .eq('uid', uid);
    } else {
      const data = readData();
      const u = data.uids.find(x => x.uid === uid);
      if (u) u.formLink = link;
      writeData(data);
    }

    io.emit('qr_generated', { uid, link });
    res.json({ uid, link });
  } catch (error) {
    console.error('Error generating QR:', error);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// ---------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------
app.get('/api/stats', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      res.json(data);
    } else {
      const data = readData();
      const uids = data.uids;
      res.json({
        total_uids: uids.length,
        pending_count: uids.filter(u => u.status === 'pending').length,
        assessor_started_count: uids.filter(u => u.status === 'assessor_started').length,
        user_submitted_count: uids.filter(u => u.status === 'user_submitted').length,
        ready_for_moderation_count: uids.filter(u => u.status === 'ready_for_moderation').length,
        moderator_review_count: uids.filter(u => u.status === 'moderator_review').length,
        sent_to_admin_count: uids.filter(u => u.status === 'sent_to_admin').length,
        approved_count: uids.filter(u => u.status === 'approved').length,
        total_students: uids.reduce((sum, u) => sum + (u.studentCount || 0), 0)
      });
    }
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// ---------------------------------------------
// START SERVER
// ---------------------------------------------
server.listen(PORT, () => {
  console.log(`\n🎉 Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});
