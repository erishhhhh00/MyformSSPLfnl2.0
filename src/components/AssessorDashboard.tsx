import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  FileText,
  Clock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
  Menu,
  User,
  ClipboardCheck,
  FileCheck,
  QrCode,
  Send,
  Download,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { FormData } from '@/types/form';
import AdminReviewForm from './AdminReviewForm';
import AssessorLogin from './AssessorLogin';
import AttendanceSheet from './AttendanceSheet';
import { api, API_BASE } from '@/lib/api';
import socket from '@/lib/socket';
import { generateFormPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';


interface SubmissionRecord {
  id: string;
  applicationId: string;
  formData: FormData;
  submittedAt: string;
  status: 'pending_review' | 'approved';
  learnerName: string;
  companyName: string;
}

const AssessorDashboard: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [uids, setUids] = useState<any[]>([]);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ show: boolean; qrCodeUrl: string; link: string; uid: string }>({ show: false, qrCodeUrl: '', link: '', uid: '' });
  const { isAssessorLoggedIn, loginAsAssessor, logoutAssessor, logoutUser, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Live stats (Single Source of Truth: Supabase via /api/stats)
  const [stats, setStats] = useState({
    total_uids: 0,
    pending_count: 0,
    assessor_started_count: 0,
    user_submitted_count: 0,
    ready_for_moderation_count: 0,
    moderation_complete_count: 0,
    sent_to_admin_count: 0,
    approved_count: 0,
    with_moderator_count: 0,  // Combined: ready_for_moderation + moderation_complete
    total_students: 0
  });

  useEffect(() => {
    // Load UIDs and stats from server (NO localStorage)
    // ONLY show UIDs assigned to this assessor - no fallback to all
    const loadData = async () => {
      try {
        let list = [];
        // If user is logged in with Supabase Auth, filter UIDs by assigned assessor
        if (user?.id && user?.role === 'assessor') {
          list = await api.listUidsFiltered(user.id, 'assessor');
        }
        // If not logged in with new auth, or legacy mode - show nothing for security
        // Legacy assessor login should still work separately
        else if (isAssessorLoggedIn) {
          // Legacy mode - show all UIDs for backward compatibility
          list = await api.listUids();
        }
        const serverStats = await api.getStats();
        setUids(list || []);
        setStats(serverStats);
      } catch (e) {
        console.warn('Could not load data', e);
      }
    };

    loadData();

    const refreshData = () => {
      // This is a simple way to refresh all data.
      // A more optimized approach would be to update state based on socket payload.
      loadData();
    };

    socket.on('uid_created', refreshData);
    socket.on('attendance_saved', refreshData);
    socket.on('user_form_saved', refreshData);
    socket.on('user_submitted', refreshData);
    socket.on('send_to_moderator', refreshData);
    socket.on('student_status_updated', refreshData);
    socket.on('assessor_review_complete', refreshData);
    socket.on('uid_approved', refreshData);
    socket.on('uid_deleted', refreshData);

    return () => {
      socket.off('uid_created', refreshData);
      socket.off('attendance_saved', refreshData);
      socket.off('user_form_saved', refreshData);
      socket.off('user_submitted', refreshData);
      socket.off('send_to_moderator', refreshData);
      socket.off('student_status_updated', refreshData);
      socket.off('assessor_review_complete', refreshData);
      socket.off('uid_approved', refreshData);
      socket.off('uid_deleted', refreshData);
    };
  }, [user?.id]);

  const handleViewSubmission = (submission: SubmissionRecord) => {
    setSelectedSubmission(submission);
  };

  const handleBackToDashboard = () => {
    setSelectedSubmission(null);
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
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
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
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (selectedSubmission) {
    return (
      <AdminReviewForm
        submission={selectedSubmission}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (showAttendance) {
    return (
      <AttendanceSheet
        prefillUid={selectedUid ?? ''}
        onComplete={() => setShowAttendance(false)}
      />
    );
  }

  // Flatten student submissions from all UIDs
  const allStudents = uids.flatMap(u =>
    (u.students || []).map((s: any) => ({ ...s, uid: u.uid, assessor: u.assessor }))
  );
  const pendingSubmissions = allStudents.filter(s => s.status === 'pending_review');
  const completedSubmissions = allStudents.filter(s => s.status === 'approved' || s.status === 'rejected');

  // Stats from Supabase (Single Source of Truth)
  const pendingNewUIDs = stats.pending_count || 0;
  const attendanceDone = stats.assessor_started_count || 0;
  const usersSubmitted = stats.user_submitted_count || 0;
  // Use with_moderator_count from server, fallback to sum for backward compatibility
  const sentToModerator = stats.with_moderator_count || ((stats.ready_for_moderation_count || 0) + (stats.moderation_complete_count || 0) + (stats.sent_to_admin_count || 0) + (stats.approved_count || 0));


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Premium Gradient Background CSS */}
      <style>{`
        .assessor-bg {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 25%, #6ee7b7 50%, #d1fae5 75%, #ecfdf5 100%);
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
        .premium-sidebar-assessor {
          background: linear-gradient(180deg, #0f172a 0%, #134e4a 50%, #0f172a 100%);
        }
      `}</style>

      {/* Sidebar - Premium Dark Teal Design */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-20'} premium-sidebar-assessor text-slate-100 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-50 border-r border-teal-700/50 relative`}>

        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500 bg-[length:200%_200%] animate-gradient-x"></div>

        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50 mt-1">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'} animate-in fade-in duration-300`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-900/50">
              <span className="font-bold text-white text-lg">A</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white font-sans">Assessor</h1>
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
            onClick={() => setActiveMenu('dashboard')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<ClipboardCheck className="h-5 w-5" />}
            label="Pending Reviews"
            active={activeMenu === 'pending'}
            onClick={() => setActiveMenu('pending')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FileCheck className="h-5 w-5" />}
            label="Completed"
            active={activeMenu === 'completed'}
            onClick={() => setActiveMenu('completed')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="My Reports"
            active={activeMenu === 'reports'}
            onClick={() => setActiveMenu('reports')}
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
      <div className="flex-1 overflow-auto assessor-bg">
        {/* Top Bar - Glassmorphism */}
        <div className="glassmorphism-card shadow-lg shadow-teal-100/50 mx-4 mt-4 rounded-2xl px-6 py-4 flex items-center justify-between border-b border-white/50">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="hover:text-gray-700 cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-teal-600 font-medium">Assessor</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-teal-700 to-emerald-600 bg-clip-text text-transparent">Assessor Dashboard</h2>
            <p className="text-sm text-gray-500 mt-0.5">Review and grade trainer submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#16a085]/10 rounded-xl">
              <User className="h-5 w-5 text-[#16a085]" />
              <span className="text-sm font-medium text-gray-700">Assessor Panel</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* ============== DASHBOARD VIEW ============== */}
          {activeMenu === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setActiveMenu('pending')}>
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{pendingNewUIDs}</h3>
                    <p className="text-white/90 text-sm font-medium">Pending (New UIDs)</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <Clock className="h-12 w-12" />
                  </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{attendanceDone}</h3>
                    <p className="text-white/90 text-sm font-medium">Attendance Done</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{usersSubmitted}</h3>
                    <p className="text-white/90 text-sm font-medium">Users Submitted</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setActiveMenu('completed')}>
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{sentToModerator}</h3>
                    <p className="text-white/90 text-sm font-medium">Sent to Moderator</p>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-20">
                    <Send className="h-12 w-12" />
                  </div>
                </div>
              </div>

              {/* Live UIDs Panel */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Live UIDs from Admin</h4>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{uids.length} Total</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {uids.length === 0 ? (<div className="text-sm text-gray-500 text-center py-4">No UIDs yet. Wait for Admin to create.</div>) : (
                      uids.map(u => (
                        <div key={u.uid} className={`border-2 rounded-lg overflow-hidden transition-all mb-4 ${u.status === 'sent_to_admin' ? 'border-indigo-400 bg-indigo-50' :
                          u.status === 'approved' || u.status === 'moderation_complete' ? 'border-green-400 bg-green-50' :
                            u.status === 'user_submitted' ? 'border-cyan-400 bg-cyan-50' :
                              'border-gray-200 bg-white'
                          }`}>
                          <div className="flex items-center justify-between p-4 bg-white/50">
                            <div className="flex items-center gap-4">
                              <div className={`font-mono font-bold text-2xl px-4 py-2 rounded-lg ${u.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                u.status === 'user_submitted' ? 'bg-cyan-100 text-cyan-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                {u.uid}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={
                                    u.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                      u.status === 'assessor_started' ? 'bg-blue-50 text-blue-700' :
                                        u.status === 'user_submitted' ? 'bg-cyan-50 text-cyan-700' :
                                          u.status === 'assessor_reviewed' ? 'bg-purple-50 text-purple-700' :
                                            u.status === 'ready_for_moderation' ? 'bg-orange-50 text-orange-700' :
                                              u.status === 'moderation_complete' ? 'bg-green-50 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                  }>
                                    {u.status === 'pending' && 'Apply Now Required'}
                                    {u.status === 'assessor_started' && 'Attendance Done - Share Link'}
                                    {u.status === 'user_submitted' && '⚠️ Users Submitted - Review Required'}
                                    {u.status === 'assessor_reviewed' && 'Reviewed - Sent to Moderation'}
                                    {u.status === 'ready_for_moderation' && 'In Moderation'}
                                    {u.status === 'moderation_complete' && 'Moderation Complete'}
                                    {u.status === 'approved' && 'Approved'}
                                  </Badge>
                                  {u.studentCount > 0 && <Badge variant="secondary">👥 {u.studentCount} Applicants</Badge>}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Created: {new Date(u.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {u.status === 'pending' && (
                                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setSelectedUid(u.uid); setShowAttendance(true); }}>
                                  <FileText className="h-4 w-4 mr-2" /> Apply Now
                                </Button>
                              )}
                              {(u.status === 'assessor_started' || u.status === 'user_submitted') && (
                                <Button className="bg-green-600 hover:bg-green-700" onClick={async () => {
                                  try {
                                    const res = await fetch(`${API_BASE}/api/qr/${u.uid}`, { method: 'POST' });
                                    const data = await res.json();
                                    navigator.clipboard.writeText(data.link);
                                    setQrModal({ show: true, qrCodeUrl: data.qrCodeUrl, link: data.link, uid: u.uid });
                                    toast({ title: '✅ QR Generated!', description: 'Link copied to clipboard' });
                                  } catch (e) {
                                    alert('Failed to generate link');
                                  }
                                }}>
                                  <QrCode className="h-4 w-4 mr-2" /> Generate QR
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Show students list for UIDs with students (user_submitted, ready_for_moderation, moderation_complete, sent_to_admin, approved) */}
                          {u.students && u.students.length > 0 && ['user_submitted', 'ready_for_moderation', 'moderation_complete', 'sent_to_admin', 'approved'].includes(u.status) && (
                            <div className={`border-t bg-white p-4 ${u.status === 'user_submitted' ? 'border-cyan-200' : 'border-green-200'}`}>
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  {u.status === 'user_submitted' ? 'Student Submissions to Review' : 'Reviewed Students'}
                                </h5>
                                <span className="text-xs text-gray-500">
                                  {u.status === 'user_submitted'
                                    ? 'Click "Review & Edit" to review each student. After reviewing, click "Mark as Reviewed" to send to Moderator.'
                                    : 'All students reviewed. Forms are view-only.'
                                  }
                                </span>
                              </div>
                              <div className="space-y-2">
                                {u.students.map((student: any) => {
                                  // Check if student is already reviewed
                                  const isReviewed = student.status === 'pending_moderation' ||
                                    student.status === 'moderated' ||
                                    student.status === 'sent_to_admin' ||
                                    student.status === 'approved';

                                  return (
                                    <div key={student.student_id} className={`flex items-center justify-between p-3 rounded-lg border ${isReviewed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isReviewed ? 'bg-green-100' : 'bg-cyan-100'}`}>
                                          <span className={`font-bold text-sm ${isReviewed ? 'text-green-700' : 'text-cyan-700'}`}>{(student.learner_name || 'S')[0]}</span>
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-900">{student.learner_name || 'Unknown Student'}</div>
                                          <div className="text-xs text-gray-500">{student.company_name || 'No Company'}</div>
                                        </div>
                                        {isReviewed && (
                                          <Badge className="bg-green-100 text-green-700 border-green-300">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Reviewed
                                          </Badge>
                                        )}
                                      </div>
                                      {isReviewed ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-gray-300"
                                          onClick={() => window.open(`/user/${u.uid}/${student.student_id}`, '_blank')}
                                        >
                                          <Eye className="h-4 w-4 mr-2" /> View Only
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700"
                                          onClick={() => window.open(`/user/${u.uid}/${student.student_id}?role=assessor`, '_blank')}
                                        >
                                          <Eye className="h-4 w-4 mr-2" /> Review & Edit
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============== PENDING REVIEWS VIEW ============== */}
          {activeMenu === 'pending' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <ClipboardCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Pending Reviews ({pendingSubmissions.length})</h4>
                </div>
              </div>
              <div className="p-4">
                {pendingSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Pending Reviews</h3>
                    <p className="text-gray-500">All submissions have been reviewed. Great work!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSubmissions.map((student) => (
                      <Card key={student.studentId} className="p-6 hover:shadow-md transition-shadow border-l-4 border-amber-500 bg-amber-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(student.status)}
                            <div>
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold">{student.learnerName}</h3>
                                <Badge variant="outline">UID: {student.uid}</Badge>
                                {getStatusBadge(student.status)}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Company:</span> {student.companyName}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => window.open(`/user/${student.uid}/${student.studentId}?role=assessor`, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review Now
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============== COMPLETED VIEW ============== */}
          {activeMenu === 'completed' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Completed Reviews ({completedSubmissions.length})</h4>
                </div>
              </div>
              <div className="p-4">
                {completedSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Completed Reviews</h3>
                    <p className="text-gray-500">Start reviewing submissions to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedSubmissions.map((student) => (
                      <Card key={student.studentId} className={`p-6 hover:shadow-md transition-shadow border-l-4 ${student.status === 'approved' ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(student.status)}
                            <div>
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold">{student.learnerName}</h3>
                                <Badge variant="outline">UID: {student.uid}</Badge>
                                {getStatusBadge(student.status)}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Company:</span> {student.companyName}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Submitted: {new Date(student.submittedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => window.open(`/user/${student.uid}/${student.studentId}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============== MY REPORTS VIEW ============== */}
          {activeMenu === 'reports' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">My Reports</h4>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-center">
                    <h3 className="text-3xl font-bold text-blue-700">{uids.length}</h3>
                    <p className="text-sm text-gray-600 mt-1">Total UIDs Assigned</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 text-center">
                    <h3 className="text-3xl font-bold text-green-700">{completedSubmissions.length}</h3>
                    <p className="text-sm text-gray-600 mt-1">Reviews Completed</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6 text-center">
                    <h3 className="text-3xl font-bold text-amber-700">{pendingSubmissions.length}</h3>
                    <p className="text-sm text-gray-600 mt-1">Pending Reviews</p>
                  </div>
                </div>
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Detailed Reports Coming Soon</h3>
                  <p className="text-gray-500">Analytics and insights for your assessments will be available here.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setQrModal({ ...qrModal, show: false })}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">📱 QR Code for UID: {qrModal.uid}</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <img
                  src={qrModal.qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4 break-all">{qrModal.link}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(qrModal.link);
                    toast({ title: '✅ Link Copied!' });
                  }}
                >
                  📋 Copy Link
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setQrModal({ ...qrModal, show: false })}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced MenuItem with Teal accent support
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active, onClick, collapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 mb-1 rounded-xl transition-all duration-200 group relative overflow-hidden
        ${active
          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 font-medium'
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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-400 rounded-r-full shadow-[0_0_10px_rgba(45,212,191,0.6)]"></div>
      )}

      {/* Optional Submenu Indicator logic if ever added for Assessor */}
      {!collapsed && active && <ChevronRight className="h-4 w-4 ml-auto text-white/50" />}
    </button>
  );
};

export default AssessorDashboard;
