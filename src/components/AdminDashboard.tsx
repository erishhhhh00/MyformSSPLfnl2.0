import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Eye,
  FileText,
  Clock,
  CheckCircle,
  LogOut,
  Users,
  LayoutDashboard,
  UserCircle,
  UsersRound,
  Store,
  Table2,
  FolderTree,
  Package,
  ShoppingCart,
  BarChart3,
  Building2,
  User,
  Settings,
  Menu,
  ChevronRight,
  Plus,
  Download,
  Edit,
  XCircle,
  ChevronDown,
  ChevronUp,
  Printer,
  Trash2,
  FileSignature,
  GraduationCap,
  ShieldCheck,
  Key
} from 'lucide-react';
import { useSubmission } from '@/context/SubmissionContext';
import { useAuth } from '@/context/AuthContext';
import { FormData } from '@/types/form';
import AdminReviewForm from './AdminReviewForm';
import AdminLogin from './AdminLogin';
import AttendanceSheet from './AttendanceSheet';
import { api, API_BASE } from '@/lib/api';
import socket from '@/lib/socket';
import { generateFormPDF } from '@/utils/pdfGenerator';
import { generateModerationPDF } from '../utils/moderationPdfGenerator';
import { generateBatchPDF } from '@/utils/batchPdfGenerator';
import { useToast } from '@/hooks/use-toast';
import UserManagement from './UserManagement';
import FuturisticLoader from './FuturisticLoader';

interface SubmissionRecord {
  id: string;
  applicationId: string;
  formData: FormData;
  submittedAt: string;
  status: 'pending_review' | 'approved';
  learnerName: string;
  companyName: string;
}

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [viewAttendanceData, setViewAttendanceData] = useState<any>(null); // For viewing filled attendance
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeView, setActiveView] = useState<'overview' | 'trainings' | 'trainer' | 'assessor' | 'moderator' | 'finance' | 'users'>('overview');
  const [uids, setUids] = useState<any[]>([]);
  const { isAdminLoggedIn, loginAsAdmin, logoutAdmin, logoutUser, token, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Create UID form state
  const [showCreateUid, setShowCreateUid] = useState(false);
  const [assessorName, setAssessorName] = useState('');
  const [assessorNumber, setAssessorNumber] = useState('');
  const [assessorAge, setAssessorAge] = useState('');
  const [creatingUid, setCreatingUid] = useState(false);

  // User assignment state
  const [availableAssessors, setAvailableAssessors] = useState<any[]>([]);
  const [availableModerators, setAvailableModerators] = useState<any[]>([]);
  const [selectedAssessorId, setSelectedAssessorId] = useState<string>('');
  const [selectedModeratorId, setSelectedModeratorId] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Edit UID assignment state
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editAssessorId, setEditAssessorId] = useState<string>('');
  const [editModeratorId, setEditModeratorId] = useState<string>('');
  const [savingAssignment, setSavingAssignment] = useState(false);

  // Expanded UID view for students (privacy - hidden until click)
  const [expandedUid, setExpandedUid] = useState<string | null>(null);

  // Live stats from server (Single Source of Truth: Supabase)
  const [stats, setStats] = useState({
    total_uids: 0,
    pending_count: 0,
    assessor_started_count: 0,
    user_submitted_count: 0,
    ready_for_moderation_count: 0,
    moderation_complete_count: 0,
    sent_to_admin_count: 0,
    approved_count: 0,
    // Combined metrics for dashboard
    with_assessor_count: 0,
    with_moderator_count: 0,
    // Student stats
    total_students: 0,
    students_pending_moderation: 0,
    students_moderated: 0,
    students_sent_to_admin: 0,
    students_approved: 0,
    students_rejected: 0
  });

  // Attendance sheets sent to admin for review
  const [attendanceForReview, setAttendanceForReview] = useState<any[]>([]);

  // Students for Moderator View in Admin
  const [pendingModerationStudents, setPendingModerationStudents] = useState<any[]>([]);
  const [moderatedStudents, setModeratedStudents] = useState<any[]>([]);
  const [sentToAdminStudents, setSentToAdminStudents] = useState<any[]>([]);

  // Page loading state for futuristic loader
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Load UIDs from server on component mount (NO localStorage)
  useEffect(() => {
    // load live UIDs from server
    const loadData = async () => {
      try {
        const [list, serverStats, attendanceList, pendingStudents, modStudents, adminStudents] = await Promise.all([
          api.listUids(),
          api.getStats(),
          api.getAttendanceForAdmin(),
          api.getAllStudents({ status: 'pending_moderation' }).catch(() => []),
          api.getAllStudents({ status: 'moderated' }).catch(() => []),
          api.getAllStudents({ status: 'sent_to_admin' }).catch(() => [])
        ]);
        setUids(list || []);
        setStats(serverStats);
        setAttendanceForReview(attendanceList || []);
        setPendingModerationStudents(Array.isArray(pendingStudents) ? pendingStudents : []);
        setModeratedStudents(Array.isArray(modStudents) ? modStudents : []);
        setSentToAdminStudents(Array.isArray(adminStudents) ? adminStudents : []);
      } catch (e) {
        console.warn('Could not load data', e);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadData();

    // socket listeners for LIVE updates
    socket.on('uid_created', (payload) => {
      setUids(prev => [payload, ...prev]);
    });
    socket.on('attendance_saved', ({ uid }) => {
      setUids(prev => prev.map(u => u.uid === uid ? { ...u, status: 'assessor_started' } : u));
    });
    socket.on('attendance_sent_to_admin', (payload) => {
      setAttendanceForReview(prev => [payload, ...prev]);
      refreshStats();
    });
    socket.on('user_form_saved', ({ uid, studentCount }) => {
      setUids(prev => prev.map(u => u.uid === uid ? { ...u, status: 'user_submitted', studentCount: studentCount || (u.studentCount || 0) + 1 } : u));
    });
    socket.on('send_to_moderator', ({ uid }) => {
      setUids(prev => prev.map(u => u.uid === uid ? { ...u, status: 'ready_for_moderation' } : u));
      refreshStats();
    });
    socket.on('moderation_saved', ({ uid }) => {
      setUids(prev => prev.map(u => u.uid === uid ? { ...u, status: 'moderation_complete' } : u));
      refreshStats();
    });
    socket.on('sent_to_admin', ({ uid }) => {
      setUids(prev => prev.map(u => u.uid === uid ? { ...u, status: 'sent_to_admin' } : u));
      refreshStats();
    });
    socket.on('uid_approved', ({ uid }) => {
      setUids(prev => prev.map(u => u.uid === uid ? { ...u, status: 'approved' } : u));
      refreshStats();
    });
    // Listen for individual student status updates
    socket.on('student_status_updated', ({ uid, studentId, status }) => {
      setUids(prev => prev.map(u => {
        if (u.uid === uid && u.students) {
          const updatedStudents = u.students.map((s: any) =>
            s.student_id === studentId ? { ...s, status } : s
          );
          return { ...u, students: updatedStudents };
        }
        return u;
      }));
      refreshStats();
    });
    // Listen for UID deletion
    socket.on('uid_deleted', ({ uid }) => {
      setUids(prev => prev.filter(u => u.uid !== uid));
      refreshStats();
    });
    // Listen for assessor review completion - refresh full data to get updated UID status
    socket.on('assessor_review_complete', async ({ uid }) => {
      // Reload the UID data to get updated status
      const list = await api.listUids();
      setUids(list || []);
      refreshStats();
    });

    return () => {
      socket.off('uid_created');
      socket.off('attendance_saved');
      socket.off('attendance_sent_to_admin');
      socket.off('user_form_saved');
      socket.off('send_to_moderator');
      socket.off('moderation_saved');
      socket.off('sent_to_admin');
      socket.off('uid_approved');
      socket.off('student_status_updated');
      socket.off('uid_deleted');
      socket.off('assessor_review_complete');
    };
  }, []);

  // Refresh stats helper
  const refreshStats = async () => {
    try {
      const serverStats = await api.getStats();
      setStats(serverStats);
    } catch (e) {
      console.warn('Could not refresh stats', e);
    }
  };

  // Load available assessors and moderators for UID assignment
  const loadUsersForAssignment = async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const users = await response.json();
        setAvailableAssessors(users.filter((u: any) => u.role === 'assessor'));
        setAvailableModerators(users.filter((u: any) => u.role === 'moderator'));
      }
    } catch (error) {
      console.warn('Could not load users for assignment:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Create UID handler with optional user assignment
  const handleCreateUid = async () => {
    if (!assessorName.trim()) {
      alert('Please enter Assessor Name');
      return;
    }
    setCreatingUid(true);
    try {
      // Create the UID first
      const newUid = await api.createUid(assessorName, assessorNumber, assessorAge);

      // If assessor or moderator selected, assign them to the UID
      if (newUid?.uid && (selectedAssessorId || selectedModeratorId)) {
        await fetch(`${API_BASE}/api/uid/${newUid.uid}/assign`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessorId: selectedAssessorId || null,
            moderatorId: selectedModeratorId || null
          })
        });
      }

      setShowCreateUid(false);
      setAssessorName('');
      setAssessorNumber('');
      setAssessorAge('');
      setSelectedAssessorId('');
      setSelectedModeratorId('');
      refreshStats();

      toast({
        title: 'UID Created',
        description: `UID ${newUid?.uid} created successfully${selectedAssessorId || selectedModeratorId ? ' with user assignment' : ''}`,
      });
    } catch (e) {
      console.error('Failed to create UID', e);
      alert('Failed to create UID');
    } finally {
      setCreatingUid(false);
    }
  };

  // Open edit assignment dialog for a UID
  const handleOpenEditAssignment = async (uid: string, currentAssessorId?: string, currentModeratorId?: string) => {
    await loadUsersForAssignment();
    setEditingUid(uid);
    setEditAssessorId(currentAssessorId || '');
    setEditModeratorId(currentModeratorId || '');
  };

  // Save assignment changes for existing UID
  const handleSaveAssignment = async () => {
    if (!editingUid) return;
    setSavingAssignment(true);
    try {
      await fetch(`${API_BASE}/api/uid/${editingUid}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessorId: editAssessorId || null,
          moderatorId: editModeratorId || null
        })
      });

      // Refresh UIDs list
      const list = await api.listUids();
      setUids(list || []);

      toast({
        title: 'Assignment Updated',
        description: `UID ${editingUid} assignment updated successfully`,
      });

      setEditingUid(null);
    } catch (e) {
      console.error('Failed to update assignment', e);
      toast({
        title: 'Error',
        description: 'Failed to update assignment',
        variant: 'destructive',
      });
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleViewSubmission = (submission: SubmissionRecord) => {
    setSelectedSubmission(submission);
  };

  const handleBackToDashboard = () => {
    setSelectedSubmission(null);
    setShowAttendance(false);
    // Reload UIDs from server
    (async () => {
      try {
        const list = await api.listUids();
        setUids(list || []);
      } catch (e) {
        console.warn('Could not reload uids', e);
      }
    })();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show filled attendance sheet (read-only view)
  if (viewAttendanceData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 bg-white border-b shadow-sm flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setViewAttendanceData(null)}
            className="flex items-center gap-2"
          >
            ← Back to Dashboard
          </Button>
          <h2 className="text-xl font-bold text-gray-800">
            📋 Attendance Sheet - UID: {viewAttendanceData.uid}
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={async () => {
              try {
                const res = await fetch(`http://localhost:4000/api/pdf/attendance/${viewAttendanceData.uid}`, { method: 'POST' });
                const data = await res.json();
                if (data.pdf) {
                  const link = document.createElement('a');
                  link.href = `data:application/pdf;base64,${data.pdf}`;
                  link.download = data.filename || `attendance_${viewAttendanceData.uid}.pdf`;
                  link.click();
                }
              } catch (e) {
                alert('Failed to download PDF');
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>

        {/* Read-Only Attendance Sheet Display */}
        <div className="max-w-6xl mx-auto p-6">
          <Card className="p-6 bg-white shadow-lg">
            {/* Header */}
            <div className="border-2 border-gray-800 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                <h1 className="text-2xl font-bold text-center">
                  RISE-Q : ATTENDANCE SHEET
                </h1>
                <p className="text-center text-blue-100 text-sm">
                  Rescue, Inspection, Safety, Elevation – Quality
                </p>
              </div>

              {/* Training Details */}
              <div className="p-4 grid grid-cols-2 gap-4 bg-gray-50">
                <div className="space-y-2">
                  <p><strong>UID:</strong> <span className="text-blue-600 font-bold text-xl">{viewAttendanceData.uid}</span></p>
                  <p><strong>Client Name:</strong> {viewAttendanceData.clientName || 'N/A'}</p>
                  <p><strong>Training Location:</strong> {viewAttendanceData.trainingLocation || 'N/A'}</p>
                  <p><strong>Training Circle:</strong> {viewAttendanceData.trainingCircle || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Date From:</strong> {viewAttendanceData.dateFrom || 'N/A'}</p>
                  <p><strong>Date To:</strong> {viewAttendanceData.dateTo || 'N/A'}</p>
                  <p><strong>Training Coordinator:</strong> {viewAttendanceData.trainingCoordinator || 'N/A'}</p>
                  <p><strong>SSIPL Trainer:</strong> {viewAttendanceData.ssiplTrainer || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="border-2 border-gray-800">
              <div className="bg-gray-800 text-white p-2">
                <h2 className="font-bold text-center">ATTENDEES LIST</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-center">S.No</th>
                      <th className="border p-2">Learner Name</th>
                      <th className="border p-2">Company</th>
                      <th className="border p-2">Designation</th>
                      <th className="border p-2">Emp ID</th>
                      <th className="border p-2">Phone</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Govt ID</th>
                      <th className="border p-2">Emergency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewAttendanceData.attendees || []).map((att: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border p-2 font-medium">{att.learnerName || '-'}</td>
                        <td className="border p-2">{att.companyName || '-'}</td>
                        <td className="border p-2">{att.designation || '-'}</td>
                        <td className="border p-2">{att.employeeId || '-'}</td>
                        <td className="border p-2">{att.phoneNumber || '-'}</td>
                        <td className="border p-2">{att.email || '-'}</td>
                        <td className="border p-2">{att.govtId || '-'}</td>
                        <td className="border p-2">{att.emergencyContact || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="font-semibold">Training Coordinator Signature:</p>
                <div className="border-b-2 border-gray-400 mt-8 w-48"></div>
                <p className="text-gray-600 mt-1">{viewAttendanceData.trainingCoordinator || ''}</p>
              </div>
              <div>
                <p className="font-semibold">SSIPL Trainer Signature:</p>
                <div className="border-b-2 border-gray-400 mt-8 w-48"></div>
                <p className="text-gray-600 mt-1">{viewAttendanceData.ssiplTrainer || ''}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show attendance sheet if requested
  if (showAttendance) {
    return (
      <div>
        <div className="p-4 bg-white border-b">
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="mb-2"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <AttendanceSheet />
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <AdminReviewForm
        submission={selectedSubmission}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show futuristic loader during initial page load
  if (isPageLoading) {
    return <FuturisticLoader type="loading" text="Loading Dashboard..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Premium Gradient Background */}
      <style>{`
        .admin-bg {
          background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 25%, #e0f2fe 50%, #f0fdfa 75%, #f5f3ff 100%);
        }
        .glassmorphism-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .premium-sidebar {
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
      `}</style>

      {/* Sidebar - Premium Dark Design */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-20'} premium-sidebar text-slate-100 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-50 border-r border-slate-700/50 relative`}>

        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-[length:200%_200%] animate-gradient-x"></div>

        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50 mt-1">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'} animate-in fade-in duration-300`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <span className="font-bold text-white text-lg">A</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white font-sans">Admin</h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ${!sidebarOpen && 'mx-auto'}`}
          >
            {sidebarOpen ? <Menu className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarOpen && (
            <div className="px-4 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Main Menu
            </div>
          )}

          <MenuItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            active={activeMenu === 'dashboard'}
            onClick={() => { setActiveMenu('dashboard'); setActiveView('overview'); }}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="Assessor View"
            active={activeMenu === 'assessor'}
            onClick={() => { setActiveMenu('assessor'); setActiveView('assessor'); }}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<CheckCircle className="h-5 w-5" />}
            label="Moderator View"
            active={activeMenu === 'moderator'}
            onClick={() => { setActiveMenu('moderator'); setActiveView('moderator'); }}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Finance & Certificates"
            active={activeMenu === 'finance'}
            onClick={() => { setActiveMenu('finance'); setActiveView('finance'); }}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<Users className="h-5 w-5" />}
            label="User Management"
            active={activeMenu === 'users'}
            onClick={() => { setActiveMenu('users'); setActiveView('users'); }}
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* User Profile / Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 mx-2 mb-2 rounded-xl">
          <button
            onClick={async () => { await logoutUser(); navigate('/login'); }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group
              ${sidebarOpen ? 'justify-start' : 'justify-center'}
              text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20`}
            title="Logout"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:-translate-x-1" />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content - Premium Gradient Canvas */}
      <div className="flex-1 overflow-auto admin-bg">
        {/* Top Bar - Glassmorphism */}
        <div className="glassmorphism-card shadow-lg shadow-slate-200/50 p-5 flex items-center justify-between border-b border-white/50 mx-4 mt-4 rounded-2xl">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              {activeView === 'overview' && '🎯 Training Dashboard'}
              {activeView === 'trainings' && '📚 Training Management'}
              {activeView === 'trainer' && '👨‍🏫 Trainer View'}
              {activeView === 'assessor' && '📋 Assessor View'}
              {activeView === 'moderator' && '🛡️ Moderator View'}
              {activeView === 'finance' && '💰 Finance & Certificates'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {activeView === 'overview' && 'Overview & Statistics'}
              {activeView === 'trainings' && 'Assign and Track Trainings'}
              {activeView === 'trainer' && 'My Assignments & Submissions'}
              {activeView === 'assessor' && 'Pending Reviews & Grading'}
              {activeView === 'moderator' && 'Quality Check & Approval'}
              {activeView === 'finance' && 'Payment & Certificate Management'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-slate-100 px-4 py-2 rounded-full">
            <span className="text-slate-500">Home</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-700 font-semibold">
              {activeView === 'overview' && 'Dashboard'}
              {activeView === 'trainings' && 'Training Management'}
              {activeView === 'trainer' && 'Trainer'}
              {activeView === 'assessor' && 'Assessor'}
              {activeView === 'moderator' && 'Moderator'}
              {activeView === 'finance' && 'Finance'}
              {activeView === 'users' && 'User Management'}
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* ============== OVERVIEW (DASHBOARD) ============== */}
          {activeView === 'overview' && (
            <>
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                {/* Total UIDs */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.total_uids}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Total UIDs</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <FileSignature className="h-12 w-12" />
                  </div>
                </div>

                {/* With Assessor */}
                <div className="relative overflow-hidden bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl p-5 text-white shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.assessor_started_count}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">With Assessor</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <Users className="h-12 w-12" />
                  </div>
                </div>

                {/* Users Submitted */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 text-white shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.user_submitted_count}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Users Submitted</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>

                {/* With Moderator */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-700 rounded-2xl p-5 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.with_moderator_count || (stats.ready_for_moderation_count + stats.moderation_complete_count)}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">With Moderator</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <ShieldCheck className="h-12 w-12" />
                  </div>
                </div>

                {/* Awaiting Admin Approval */}
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl p-5 text-white shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.sent_to_admin_count}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Awaiting Admin</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <Clock className="h-12 w-12" />
                  </div>
                </div>

                {/* Approved */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.approved_count}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Approved</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                </div>

                {/* Total Students */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-5 text-white shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.total_students}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Total Students</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <GraduationCap className="h-12 w-12" />
                  </div>
                </div>
              </div>

              {/* UID Management Panel - Glassmorphism */}
              <div className="glassmorphism-card rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-white/50 to-indigo-50/50 px-6 py-4 border-b border-white/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          UID Management
                        </h3>
                      </div>
                    </div>
                    <Dialog open={showCreateUid} onOpenChange={(open) => {
                      setShowCreateUid(open);
                      if (open) loadUsersForAssignment();
                    }}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 px-6 h-11 rounded-xl text-base font-semibold transition-all duration-200">
                          <Plus className="h-5 w-5" /> Create New UID
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Create New UID with User Assignment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {/* Assessor Info Section */}
                          <div className="p-3 bg-slate-50 rounded-lg space-y-3">
                            <h4 className="font-medium text-sm text-slate-600">Assessor Information</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor="assessorName" className="text-xs">Name *</Label>
                                <Input
                                  id="assessorName"
                                  value={assessorName}
                                  onChange={(e) => setAssessorName(e.target.value)}
                                  placeholder="Assessor Name"
                                  className="h-9"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="assessorNumber" className="text-xs">Phone</Label>
                                <Input
                                  id="assessorNumber"
                                  value={assessorNumber}
                                  onChange={(e) => setAssessorNumber(e.target.value)}
                                  placeholder="Phone"
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>

                          {/* User Assignment Section */}
                          <div className="p-3 bg-blue-50 rounded-lg space-y-3">
                            <h4 className="font-medium text-sm text-blue-700">Assign to Users (Optional)</h4>
                            {loadingUsers ? (
                              <p className="text-sm text-slate-500">Loading users...</p>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-xs text-blue-600">Assign Assessor</Label>
                                  <select
                                    value={selectedAssessorId}
                                    onChange={(e) => setSelectedAssessorId(e.target.value)}
                                    className="w-full h-9 px-2 border rounded-md text-sm"
                                  >
                                    <option value="">-- Select Assessor --</option>
                                    {availableAssessors.map((u) => (
                                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                  </select>
                                  {availableAssessors.length === 0 && (
                                    <p className="text-xs text-slate-400">No assessors created yet</p>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-green-600">Assign Moderator</Label>
                                  <select
                                    value={selectedModeratorId}
                                    onChange={(e) => setSelectedModeratorId(e.target.value)}
                                    className="w-full h-9 px-2 border rounded-md text-sm"
                                  >
                                    <option value="">-- Select Moderator --</option>
                                    {availableModerators.map((u) => (
                                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                  </select>
                                  {availableModerators.length === 0 && (
                                    <p className="text-xs text-slate-400">No moderators created yet</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={handleCreateUid}
                            disabled={creatingUid || !assessorName.trim()}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {creatingUid ? 'Creating...' : '✅ Create UID'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Edit Assignment Dialog */}
                    <Dialog open={editingUid !== null} onOpenChange={(open) => !open && setEditingUid(null)}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit UID Assignment - {editingUid}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="p-3 bg-blue-50 rounded-lg space-y-3">
                            <p className="text-sm text-slate-600">
                              Assign or update the assessor and moderator for this UID.
                              Assigned users will only see this UID in their dashboard.
                            </p>

                            {loadingUsers ? (
                              <p className="text-sm text-slate-500">Loading users...</p>
                            ) : (
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <Label className="text-sm font-medium text-blue-700">Assign Assessor</Label>
                                  <select
                                    value={editAssessorId}
                                    onChange={(e) => setEditAssessorId(e.target.value)}
                                    className="w-full h-10 px-3 border rounded-md"
                                  >
                                    <option value="">-- No Assessor Assigned --</option>
                                    {availableAssessors.map((u) => (
                                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm font-medium text-green-700">Assign Moderator</Label>
                                  <select
                                    value={editModeratorId}
                                    onChange={(e) => setEditModeratorId(e.target.value)}
                                    className="w-full h-10 px-3 border rounded-md"
                                  >
                                    <option value="">-- No Moderator Assigned --</option>
                                    {availableModerators.map((u) => (
                                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingUid(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveAssignment}
                              disabled={savingAssignment}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              {savingAssignment ? 'Saving...' : '💾 Save Assignment'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Live UID Status Panel - Redesigned */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {uids.length === 0 ? (
                      <div className="text-base text-slate-400 text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <div className="text-4xl mb-3">📭</div>
                        No UIDs created yet. Click "Create New UID" to start.
                      </div>
                    ) : (
                      uids.map(u => (
                        <div key={u.uid} id={`uid-${u.uid}`} className={`border-2 rounded-xl overflow-hidden transition-all shadow-md hover:shadow-lg ${u.status === 'sent_to_admin' ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-white' :
                          u.status === 'approved' || u.status === 'moderation_complete' ? 'border-green-400 bg-gradient-to-r from-green-50 to-white' :
                            'border-slate-200 bg-white'
                          }`}>
                          {/* UID Header - Always Visible */}
                          <div
                            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                            onClick={() => setExpandedUid(expandedUid === u.uid ? null : u.uid)}
                          >
                            <div className="flex items-center gap-6">
                              {/* UID Number */}
                              <div className={`font-mono font-black text-4xl px-6 py-3 rounded-xl shadow-lg ${u.status === 'sent_to_admin' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-500/40' :
                                u.status === 'approved' || u.status === 'moderation_complete' ? 'bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-green-500/40' :
                                  u.status === 'pending' ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-amber-500/40' :
                                    'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/40'
                                }`}>
                                {u.uid}
                              </div>

                              {/* Status & Info */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getStatusBadge(u.status)}
                                  {u.studentCount > 0 && (
                                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                      👥 {u.studentCount} Students
                                    </Badge>
                                  )}
                                  {/* Show assigned users */}
                                  {u.assignedAssessor && (
                                    <Badge variant="outline" className="border-cyan-300 bg-cyan-50 text-cyan-700">
                                      📋 {u.assignedAssessor.name}
                                    </Badge>
                                  )}
                                  {u.assignedModerator && (
                                    <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                                      ✅ {u.assignedModerator.name}
                                    </Badge>
                                  )}
                                </div>

                                {u.assessor?.name && (
                                  <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <span className="font-semibold text-gray-800">Assessor:</span>
                                    <span>{u.assessor.name}</span>
                                    {u.assessor.number && <span className="text-gray-400">• {u.assessor.number}</span>}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Quick Actions (Always Visible) */}
                              <div className="flex items-center gap-2 mr-4">
                                {/* Approve Button (if actionable) */}
                                {u.status === 'sent_to_admin' && (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 shadow-md h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      api.adminApprove(u.uid).then(() => {
                                        alert(`✅ UID ${u.uid} Approved!`);
                                        api.listUids().then(list => setUids(list || []));
                                      });
                                    }}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                  </Button>
                                )}

                                {/* Edit Assignment Button */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="shadow-md h-8 border-blue-300 text-blue-600 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditAssignment(u.uid, u.assignedAssessorId, u.assignedModeratorId);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" /> Assign
                                </Button>

                                {/* Delete UID Button */}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="shadow-md h-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`⚠️ Are you sure you want to DELETE UID ${u.uid}?\n\nThis will permanently delete:\n• All students attached to this UID\n• Attendance data\n• Moderation data\n\nThis action cannot be undone!`)) {
                                      api.deleteUid(u.uid).then((res) => {
                                        if (res.success) {
                                          toast({ title: '🗑️ UID Deleted', description: `UID ${u.uid} and all related data deleted successfully` });
                                        } else {
                                          toast({ title: 'Error', description: 'Failed to delete UID', variant: 'destructive' });
                                        }
                                      });
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                                </Button>
                              </div>

                              {expandedUid === u.uid ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedUid === u.uid && (
                            <div className="border-t border-gray-200 bg-white p-6 animate-in slide-in-from-top-2">
                              {/* Progress Stepper */}
                              <div className="mb-8">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Workflow Status</h4>
                                <div className="relative flex items-center justify-between w-full max-w-5xl mx-auto">
                                  {/* Connector Line */}
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500`} style={{
                                    width: (() => {
                                      switch (u.status) {
                                        case 'pending': return '0%';
                                        case 'assessor_started': return '20%';
                                        case 'user_submitted': return '40%';
                                        case 'assessor_reviewed': return '60%';
                                        case 'ready_for_moderation':
                                        case 'moderation_complete':
                                        case 'sent_to_admin': return '80%';
                                        case 'approved': return '100%';
                                        default: return '0%'; // Unknown status defaults to start
                                      }
                                    })()
                                  }}></div>

                                  {/* Steps */}
                                  {[
                                    { id: 'pending', label: 'Created', icon: Plus },
                                    { id: 'assessor_started', label: 'Attendance', icon: FileText },
                                    { id: 'user_submitted', label: 'Users Submitted', icon: Users },
                                    { id: 'assessor_reviewed', label: 'Assessor Review', icon: Eye },
                                    { id: 'ready_for_moderation', label: 'Moderation', icon: Store },
                                    { id: 'approved', label: 'Approved', icon: CheckCircle },
                                  ].map((step, idx) => {
                                    // Define exact status progression order
                                    const statusOrder = [
                                      'pending',           // Step 0: Created
                                      'assessor_started',  // Step 1: Attendance
                                      'user_submitted',    // Step 2: Users Submitted
                                      'assessor_reviewed', // Step 3: Assessor Review
                                      'ready_for_moderation', // Step 4: Moderation (includes moderation_complete, sent_to_admin)
                                      'approved'           // Step 5: Approved
                                    ];

                                    // Map current status to step index
                                    let currentStepIndex = statusOrder.indexOf(u.status);
                                    // Handle intermediate statuses
                                    if (u.status === 'moderation_complete' || u.status === 'sent_to_admin') {
                                      currentStepIndex = 4; // Still in moderation phase
                                    }
                                    if (u.status === 'approved') {
                                      currentStepIndex = 5;
                                    }

                                    const isCompleted = currentStepIndex >= idx;

                                    return (
                                      <div key={step.id} className="flex flex-col items-center bg-white px-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 mb-2 shadow-md transition-all ${isCompleted ? 'bg-gradient-to-br from-emerald-400 to-green-600 border-green-500 text-white shadow-green-500/30' : 'bg-slate-50 border-slate-300 text-slate-300'
                                          }`}>
                                          <step.icon className="h-6 w-6" />
                                        </div>
                                        <span className={`text-sm font-bold ${isCompleted ? 'text-green-700' : 'text-slate-400'}`}>
                                          {step.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Student List Table */}
                              <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center justify-between">
                                  <span>Learners ({u.students?.length || 0})</span>
                                  <Button size="sm" variant="outline" className="text-xs h-7"> <Download className="h-3 w-3 mr-1" /> Export CSV</Button>
                                </h4>

                                <div className="border rounded-lg overflow-hidden">
                                  <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                                      <tr>
                                        <th className="p-3">Learner Name</th>
                                        <th className="p-3">Company</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Submitted</th>
                                        <th className="p-3 text-right">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {u.students && u.students.length > 0 ? (
                                        u.students.map((student: any) => (
                                          <tr key={student.student_id} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium">{student.learner_name || 'N/A'}</td>
                                            <td className="p-3">{student.company_name || 'N/A'}</td>
                                            <td className="p-3">
                                              <Badge variant="outline" className={
                                                student.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                  student.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    student.status === 'sent_to_admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                      student.status === 'moderated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        student.status === 'pending_moderation' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                          student.status === 'pending_assessor_review' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                              }>
                                                {student.status === 'approved' ? 'Pass' :
                                                  student.status === 'rejected' ? 'Fail' :
                                                    student.status === 'sent_to_admin' ? 'With Admin' :
                                                      student.status === 'moderated' ? 'Moderated' :
                                                        student.status === 'pending_moderation' ? 'In Moderation' :
                                                          student.status === 'pending_assessor_review' ? 'Assessor Review' :
                                                            'Pending'}
                                              </Badge>
                                            </td>
                                            <td className="p-3 text-gray-500">{new Date(student.created_at || Date.now()).toLocaleDateString()}</td>
                                            <td className="p-3 text-right">
                                              <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full" onClick={() => window.open(`/user/${u.uid}/${student.student_id}`, '_blank')}>
                                                  <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full"
                                                  onClick={async () => {
                                                    try {
                                                      const res = await fetch(`${API_BASE}/api/student/${u.uid}/${student.student_id}`);
                                                      const data = await res.json();
                                                      if (data.form_data) {
                                                        await generateFormPDF(data.form_data, toast);
                                                      } else {
                                                        toast({ title: 'PDF Error', description: 'Could not fetch student form data', variant: 'destructive' });
                                                      }
                                                    } catch (error) {
                                                      console.error('PDF generation error:', error);
                                                      toast({ title: 'PDF Error', description: 'Failed to generate PDF', variant: 'destructive' });
                                                    }
                                                  }}
                                                >
                                                  <Printer className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                {/* Approve/Reject buttons for sent_to_admin status */}
                                                {student.status === 'sent_to_admin' && (
                                                  <>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7"
                                                      onClick={async () => {
                                                        await api.updateStudentStatus(u.uid, student.student_id, 'approved');
                                                        toast({ title: '✅ Approved', description: `${student.learner_name} approved successfully` });
                                                      }}>
                                                      <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" className="h-7"
                                                      onClick={async () => {
                                                        await api.updateStudentStatus(u.uid, student.student_id, 'rejected');
                                                        toast({ title: '❌ Rejected', description: `${student.learner_name} rejected` });
                                                      }}>
                                                      <XCircle className="h-3 w-3 mr-1" /> Reject
                                                    </Button>
                                                  </>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td colSpan={5} className="p-4 text-center text-gray-400 italic">No students have applied yet.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Administrative Tools */}
                              <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap gap-4 items-center justify-between">
                                <div className="text-sm text-gray-600">
                                  <span className="font-semibold">Quick Actions:</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {/* View Attendance Sheet */}
                                  {(u.status === 'assessor_started' || u.status === 'user_submitted' || u.status === 'sent_to_admin' || u.status === 'approved' || u.status === 'ready_for_moderation' || u.status === 'moderation_complete') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={async () => {
                                        const attendance = await api.getAttendance(u.uid);
                                        if (attendance) setViewAttendanceData(attendance);
                                        else alert('Attendance data not found');
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" /> View Attendance
                                    </Button>
                                  )}

                                  {/* Download Attendance PDF */}
                                  {(u.status === 'assessor_started' || u.status === 'user_submitted' || u.status === 'sent_to_admin' || u.status === 'approved' || u.status === 'ready_for_moderation' || u.status === 'moderation_complete') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                      onClick={async () => {
                                        try {
                                          await api.generateAttendancePdf(u.uid);
                                        } catch (e) {
                                          alert('Failed to download Attendance PDF');
                                        }
                                      }}
                                    >
                                      <Download className="h-4 w-4 mr-2" /> Attendance PDF
                                    </Button>
                                  )}

                                  {/* Apply Link */}
                                  <Button variant="outline" size="sm" onClick={() => window.open(u.formLink, '_blank')} disabled={!u.formLink}>
                                    <Eye className="h-4 w-4 mr-2" /> Apply Link
                                  </Button>

                                  {/* View Moderation */}
                                  {(u.status === 'ready_for_moderation' || u.status === 'moderation_complete' || u.status === 'approved') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                      onClick={() => window.open(`/moderation-review/${u.uid}`, '_blank')}
                                    >
                                      <Eye className="h-4 w-4 mr-2" /> View Moderation
                                    </Button>
                                  )}

                                  {/* Moderation PDF */}
                                  {(u.status === 'moderation_complete' || u.status === 'approved') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                      onClick={async () => {
                                        try {
                                          // Fetch moderation data from API
                                          const res = await fetch(`${API_BASE}/api/moderation/${u.uid}`);
                                          const data = await res.json();
                                          if (data.form_data) {
                                            // Use moderation PDF generator (statically imported)
                                            await generateModerationPDF(data.form_data, toast);
                                          } else {
                                            toast({ title: 'PDF Error', description: 'Could not fetch moderation data', variant: 'destructive' });
                                          }
                                        } catch (error) {
                                          console.error('Moderation PDF error:', error);
                                          toast({ title: 'PDF Error', description: 'Failed to generate Moderation PDF', variant: 'destructive' });
                                        }
                                      }}
                                    >
                                      <Printer className="h-4 w-4 mr-2" /> Moderation PDF
                                    </Button>
                                  )}

                                  {/* Approve UID */}
                                  {(u.status === 'sent_to_admin') && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={async () => {
                                        try {
                                          await api.adminApprove(u.uid);
                                          alert('UID Approved!');
                                        } catch (e) {
                                          alert('Failed to approve');
                                        }
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                  )}

                                  {/* Final Batch PDF (All Students) */}
                                  {(u.status === 'sent_to_admin' || u.status === 'approved' || u.status === 'moderation_complete') && (
                                    <Button
                                      size="sm"
                                      className="bg-purple-600 hover:bg-purple-700"
                                      onClick={async () => {
                                        try {
                                          toast({ title: 'Generating Batch PDF...', description: `Fetching all data for UID: ${u.uid}` });

                                          // Fetch all required data for this UID
                                          const [attendance, students, moderation] = await Promise.all([
                                            api.getAttendance(u.uid).catch(() => null),
                                            fetch(`${API_BASE}/api/students?uid=${u.uid}`).then(r => r.json()).catch(() => []),
                                            fetch(`${API_BASE}/api/moderation/${u.uid}`).then(r => r.json()).catch(() => null)
                                          ]);

                                          // Generate the batch PDF
                                          await generateBatchPDF({
                                            uid: u.uid,
                                            attendance: attendance,
                                            students: Array.isArray(students) ? students : [],
                                            moderation: moderation
                                          }, toast);
                                        } catch (error) {
                                          console.error('Batch PDF error:', error);
                                          toast({ title: 'Error', description: 'Failed to generate batch PDF', variant: 'destructive' });
                                        }
                                      }}
                                    >
                                      <Download className="h-4 w-4 mr-2" /> All PDFs
                                    </Button>
                                  )}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Attendance Sheets for Admin Review */}
              {attendanceForReview.length > 0 && (
                <Card className="p-4 mb-6 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-indigo-800">📋 Attendance Sheets for Review</h3>
                        <p className="text-sm text-indigo-600">Sent by Assessors for Admin approval</p>
                      </div>
                    </div>
                    <Badge className="bg-indigo-600 text-white px-3 py-1">
                      {attendanceForReview.filter(a => a.sentToAdmin).length} New
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {attendanceForReview.map((item, idx) => (
                      <div key={item.uid + '-' + idx} className="bg-white rounded-lg border border-indigo-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="font-mono font-bold text-2xl bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg">
                              {item.uid}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {item.attendance?.clientName || 'Client N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                📍 {item.attendance?.trainingLocation || 'Location N/A'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                📅 {item.attendance?.dateFrom || 'N/A'} to {item.attendance?.dateTo || 'N/A'}
                              </div>
                              {item.assessor?.name && (
                                <div className="text-xs text-indigo-600 mt-1">
                                  👤 Assessor: {item.assessor.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.sentToAdmin && (
                              <Badge className="bg-green-100 text-green-800 border border-green-300">
                                ✅ Sent to Admin
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                              onClick={() => {
                                setExpandedUid(item.uid);
                                // Scroll to UID section
                                const uidElement = document.getElementById(`uid-${item.uid}`);
                                if (uidElement) uidElement.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:4000/api/pdf/attendance/${item.uid}`, { method: 'POST' });
                                  const data = await res.json();
                                  if (data.pdf) {
                                    const link = document.createElement('a');
                                    link.href = `data:application/pdf;base64,${data.pdf}`;
                                    link.download = data.filename || `attendance_${item.uid}.pdf`;
                                    link.click();
                                  } else {
                                    alert('Failed to generate PDF');
                                  }
                                } catch (e) {
                                  alert('Failed to download PDF');
                                }
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" /> Download PDF
                            </Button>
                          </div>
                        </div>

                        {/* Attendees Preview */}
                        {item.attendance?.attendees && (
                          <div className="mt-3 pt-3 border-t border-indigo-100">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              👥 Attendees ({item.attendance.attendees.filter((a: any) => a.learnerName).length} filled)
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.attendance.attendees
                                .filter((a: any) => a.learnerName)
                                .slice(0, 5)
                                .map((attendee: any, i: number) => (
                                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {attendee.learnerName}
                                  </span>
                                ))}
                              {item.attendance.attendees.filter((a: any) => a.learnerName).length > 5 && (
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                  +{item.attendance.attendees.filter((a: any) => a.learnerName).length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}


              {/* Form Submissions Section (Default Dashboard) */}
              {activeView === 'overview' && (
                <div className="glassmorphism-card rounded-2xl shadow-xl shadow-purple-100/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">Recent Form Submissions</h3>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
                      <p className="text-gray-500">
                        Form submissions will appear here when users submit their applications.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <Card key={submission.id} className="p-6 hover:shadow-md transition-shadow border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(submission.status)}
                              <div>
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold">{submission.applicationId}</h3>
                                  {getStatusBadge(submission.status)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Learner:</span> {submission.learnerName} |
                                  <span className="font-medium ml-2">Company:</span> {submission.companyName}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewSubmission(submission)}
                                className="flex items-center space-x-2"
                              >
                                <Eye className="h-4 w-4" />
                                <span>Review</span>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ============== ASSESSOR VIEW ============== */}
          {activeView === 'assessor' && (
            <div className="space-y-6">
              {/* Assessor Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{uids.length}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Total UIDs</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{uids.filter(u => u.status === 'pending').length}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Pending Attendance</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{uids.filter(u => u.status === 'assessor_started').length}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Attendance Saved</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{stats.total_students}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Total Students</p>
                  </div>
                </div>
              </div>

              {/* All UIDs with Assessor Info */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">All UIDs - Assessor Assignment Tracking</h3>
                  </div>
                </div>
                <div className="p-6">
                  {uids.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No UIDs created yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {uids.map(u => (
                        <div key={u.uid} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-blue-100 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`font-mono font-bold text-xl px-4 py-2 rounded-lg shadow-sm ${u.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                                u.status === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
                                  'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                }`}>{u.uid}</div>
                              <div>
                                <div className="font-semibold text-gray-900">Assessor: {u.assessor?.name || 'Not Assigned'}</div>
                                <div className="text-sm text-gray-500">Phone: {u.assessor?.number || 'N/A'} | Students: {u.studentCount || 0}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(u.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance for Review */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Attendance Sheets (Sent to Admin)</h3>
                  </div>
                </div>
                <div className="p-6">
                  {attendanceForReview.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No attendance sheets pending review.</div>
                  ) : (
                    <div className="space-y-3">
                      {attendanceForReview.map((att, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-amber-100 transition-all duration-200">
                          <div className="font-semibold text-gray-900">UID: {att.uid}</div>
                          <div className="text-sm text-gray-500">Client: {att.client_name} | Location: {att.training_location}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Reviews */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">✅ Completed Reviews (All Students)</h3>
                {uids.flatMap(u => u.students || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No student submissions yet.</div>
                ) : (
                  <div className="space-y-3">
                    {uids.flatMap(u => (u.students || []).map((s: any) => ({ ...s, uidNumber: u.uid, assessorName: u.assessor?.name }))).map((student: any) => (
                      <div key={student.student_id} className={`border-l-4 rounded-lg p-4 ${student.status === 'approved' ? 'border-green-500 bg-green-50' :
                        student.status === 'rejected' ? 'border-red-500 bg-red-50' :
                          'border-gray-300 bg-gray-50'
                        }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{student.learner_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">UID: {student.uidNumber} | Assessor: {student.assessorName || 'N/A'}</div>
                            <div className="text-xs text-gray-400">Company: {student.company_name || 'N/A'}</div>
                          </div>
                          <Badge className={
                            student.status === 'approved' ? 'bg-green-600' :
                              student.status === 'rejected' ? 'bg-red-600' :
                                student.status === 'sent_to_admin' ? 'bg-blue-600' :
                                  'bg-gray-600'
                          }>
                            {student.status === 'approved' ? 'Pass' :
                              student.status === 'rejected' ? 'Fail' :
                                student.status === 'sent_to_admin' ? 'With Admin' :
                                  student.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ============== MODERATOR VIEW ============== */}
          {activeView === 'moderator' && (
            <div className="space-y-6">
              {/* Moderator Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{pendingModerationStudents.length}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Pending Moderation</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{moderatedStudents.length}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Moderated</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md">{sentToAdminStudents.length}</h3>
                    <p className="text-white/90 text-sm font-medium mt-1">Sent to Admin</p>
                  </div>
                </div>
              </div>

              {/* Pending Moderation */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Pending Moderation ({pendingModerationStudents.length})</h3>
                  </div>
                </div>
                <div className="p-6">
                  {pendingModerationStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No students pending moderation.</div>
                  ) : (
                    <div className="space-y-3">
                      {pendingModerationStudents.map(student => (
                        <div key={student.student_id} className="border-l-4 border-purple-500 bg-purple-50/50 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">{student.learner_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">UID: {student.uid} | Company: {student.company_name || 'N/A'}</div>
                              <div className="text-xs text-gray-400">Student ID: {student.student_id}</div>
                            </div>
                            <Badge className="bg-purple-600">Pending</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sent to Admin */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Sent to Admin ({sentToAdminStudents.length})</h3>
                  </div>
                </div>
                <div className="p-6">
                  {sentToAdminStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No students sent to admin yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {sentToAdminStudents.map(student => (
                        <div key={student.student_id} className="border-l-4 border-blue-500 bg-blue-50/50 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">{student.learner_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">UID: {student.uid} | Company: {student.company_name || 'N/A'}</div>
                              <div className="text-xs text-gray-400">Student ID: {student.student_id}</div>
                            </div>
                            <Badge className="bg-blue-600">With Admin</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Finance & Certificates View */}
          {activeView === 'finance' && (
            <div className="space-y-6">
            </div>
          )}

          {/* ============== USER MANAGEMENT VIEW ============== */}
          {activeView === 'users' && (
            <UserManagement />
          )}
        </div>
      </div>
    </div>
  );
};

// MenuItem Component
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  hasSubmenu?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active, onClick, collapsed, hasSubmenu }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 mb-1 rounded-xl transition-all duration-200 group relative overflow-hidden
        ${active
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-medium'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }
        ${!collapsed ? 'justify-start' : 'justify-center px-2'}
      `}
      title={collapsed ? label : undefined}
    >
      <div className={`relative z-10 flex items-center ${!collapsed ? 'gap-3' : 'justify-center w-full'}`}>
        <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        {!collapsed && <span className="font-medium tracking-wide text-sm">{label}</span>}
      </div>

      {/* Active Indicator for collapsed state */}
      {collapsed && active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full shadow-[0_0_10px_rgba(96,165,250,0.6)]"></div>
      )}

      {/* Right chevron for submenu */}
      {!collapsed && hasSubmenu && <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${active ? 'text-white' : 'text-slate-600'}`} />}
    </button>
  );
};

export default AdminDashboard;