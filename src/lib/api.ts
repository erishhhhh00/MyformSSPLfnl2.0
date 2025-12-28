export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const api = {
  // ============================================================
  // AUTHENTICATION
  // ============================================================

  // Admin login
  adminLogin: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    return res.json();
  },

  // Assessor login
  assessorLogin: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/assessor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    return res.json();
  },

  // Moderator login
  moderatorLogin: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/moderator/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    return res.json();
  },

  // Get all users
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/api/auth/users`);
    return res.json();
  },

  // Create user
  createUser: async (role: 'admin' | 'assessor' | 'moderator', userData: any) => {
    const res = await fetch(`${API_BASE}/api/auth/users/${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Update user
  updateUser: async (role: 'admin' | 'assessor' | 'moderator', id: string, userData: any) => {
    const res = await fetch(`${API_BASE}/api/auth/users/${role}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Delete user
  deleteUser: async (role: 'admin' | 'assessor' | 'moderator', id: string) => {
    const res = await fetch(`${API_BASE}/api/auth/users/${role}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // ============================================================
  // UID MANAGEMENT
  // ============================================================

  // Create UID with Assessor assignment
  createUid: async (assessorName?: string, assessorNumber?: string, assessorAge?: string) => {
    const res = await fetch(`${API_BASE}/api/uid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessorName, assessorNumber, assessorAge })
    });
    return res.json();
  },

  listUids: async () => {
    const res = await fetch(`${API_BASE}/api/uids`);
    return res.json();
  },

  // List UIDs filtered by assigned user (for assessor/moderator dashboards)
  listUidsFiltered: async (userId?: string, role?: 'assessor' | 'moderator') => {
    let url = `${API_BASE}/api/uids`;
    if (userId && role) {
      url += `?userId=${userId}&role=${role}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  // Base URL for auth context
  baseUrl: API_BASE,

  // Delete UID and all related data
  deleteUid: async (uid: string) => {
    const res = await fetch(`${API_BASE}/api/uid/${uid}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (!res.ok) {
        console.error('Failed to fetch stats:', res.statusText);
        // Return a default object on failure
        return { total_uids: 0, pending_count: 0, assessor_started_count: 0, user_submitted_count: 0, ready_for_moderation_count: 0, completed_count: 0, total_students: 0 };
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return a default object on network error
      return { total_uids: 0, pending_count: 0, assessor_started_count: 0, user_submitted_count: 0, ready_for_moderation_count: 0, completed_count: 0, total_students: 0 };
    }
  },

  // ============================================================
  // FORM DATA
  // ============================================================

  saveAttendance: async (uid: string, payload: any) => {
    const res = await fetch(`${API_BASE}/api/attendance/${uid}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.json();
  },

  // Get attendance sheets sent to admin for review
  getAttendanceForAdmin: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance/for-admin`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      console.error('Failed to fetch attendance for admin:', e);
      return [];
    }
  },

  // Get single attendance data
  getAttendance: async (uid: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance/${uid}`);
      if (!res.ok) return null;
      return res.json();
    } catch (e) {
      console.error('Failed to fetch attendance:', e);
      return null;
    }
  },

  saveUserForm: async (uid: string, payload: any) => {
    const res = await fetch(`${API_BASE}/api/user_form/${uid}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.json();
  },

  saveModeration: async (uid: string, payload: any) => {
    const res = await fetch(`${API_BASE}/api/moderation/${uid}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.json();
  },

  // ============================================================
  // WORKFLOW
  // ============================================================

  sendToModerator: async (uid: string) => {
    const res = await fetch(`${API_BASE}/api/send_to_moderator/${uid}`, { method: 'POST' });
    return res.json();
  },

  // Update student status (for moderation workflow)
  updateStudentStatus: async (uid: string, studentId: string, status: 'pending_moderation' | 'moderated' | 'sent_to_admin' | 'approved' | 'rejected') => {
    const res = await fetch(`${API_BASE}/api/student/${uid}/${studentId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Get students pending moderation
  getPendingModerationStudents: async () => {
    const res = await fetch(`${API_BASE}/api/students/pending-moderation`);
    return res.json();
  },

  // Get all students (with optional filters)
  getAllStudents: async (filters?: { status?: string; uid?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.uid) params.append('uid', filters.uid);
    const res = await fetch(`${API_BASE}/api/students?${params.toString()}`);
    return res.json();
  },

  // Send to Admin (final)
  sendToAdmin: async (uid: string) => {
    const res = await fetch(`${API_BASE}/api/send_to_admin/${uid}`, { method: 'POST' });
    return res.json();
  },

  // Admin final approval
  adminApprove: async (uid: string) => {
    const res = await fetch(`${API_BASE}/api/admin_approve/${uid}`, { method: 'POST' });
    return res.json();
  },

  // Generate QR link
  generateQr: async (uid: string) => {
    const res = await fetch(`${API_BASE}/api/qr/${uid}`, { method: 'POST' });
    return res.json();
  },

  // Generate Attendance PDF
  generateAttendancePdf: async (uid: string) => {
    const res = await fetch(`${API_BASE}/api/pdf/attendance/${uid}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate PDF');
    const data = await res.json();

    // Convert base64 to Blob and download
    const byteCharacters = atob(data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename || `attendance_${uid}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return data;
  },

  // Generate Student Form PDF (merged with moderation)
  generateStudentPdf: async (uid: string, studentId: string) => {
    const res = await fetch(`${API_BASE}/api/pdf/student/${uid}/${studentId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate PDF');
    const data = await res.json();

    // Convert base64 to Blob and download
    const byteCharacters = atob(data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename || `student_${studentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return data;
  }
};
