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
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
  Menu,
  User,
  ShieldCheck,
  AlertCircle,
  XCircle,
  Send,
  Printer,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ModeratorLogin from './ModeratorLogin';
import { api, API_BASE } from '@/lib/api';
import socket from '@/lib/socket';
import { generateFormPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import FuturisticLoader from './FuturisticLoader';

interface Student {
  student_id: string;
  uid: string;
  learner_name: string;
  company_name: string;
  form_data: any;
  status: 'pending_moderation' | 'moderated' | 'sent_to_admin' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
}

const ModeratorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { isModeratorLoggedIn, loginAsModerator, logoutModerator, logoutUser, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [moderatedStudents, setModeratedStudents] = useState<Student[]>([]);
  const [sentToAdminStudents, setSentToAdminStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Track which UIDs have moderation form submitted
  const [moderatedUids, setModeratedUids] = useState<Set<string>>(new Set());

  // Stats from Supabase (Single Source of Truth)
  const [stats, setStats] = useState({
    students_pending_moderation: 0,
    students_moderated: 0,
    students_sent_to_admin: 0,
    sent_to_admin_count: 0,  // UIDs sent to admin
    total_students: 0
  });

  // Load students data and moderation status per UID
  // Filter by assigned UIDs if user is logged in with Supabase Auth
  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch stats from server (Single Source of Truth)
      const serverStats = await api.getStats();
      setStats(serverStats);

      // Get assigned UIDs for this moderator
      let assignedUids: string[] = [];
      if (user?.id && user?.role === 'moderator') {
        const uidsList = await api.listUidsFiltered(user.id, 'moderator');
        assignedUids = (uidsList || []).map((u: any) => u.uid);
      }

      let [pending, moderated, sentToAdmin] = await Promise.all([
        api.getAllStudents({ status: 'pending_moderation' }).catch(() => []),
        api.getAllStudents({ status: 'moderated' }).catch(() => []),
        api.getAllStudents({ status: 'sent_to_admin' }).catch(() => [])
      ]);

      // Ensure we always have arrays
      let pendingArr = Array.isArray(pending) ? pending : [];
      let moderatedArr = Array.isArray(moderated) ? moderated : [];
      let sentToAdminArr = Array.isArray(sentToAdmin) ? sentToAdmin : [];

      // Filter by assigned UIDs if user is a logged-in moderator
      if (user?.id && user?.role === 'moderator' && assignedUids.length > 0) {
        pendingArr = pendingArr.filter((s: Student) => assignedUids.includes(s.uid));
        moderatedArr = moderatedArr.filter((s: Student) => assignedUids.includes(s.uid));
        sentToAdminArr = sentToAdminArr.filter((s: Student) => assignedUids.includes(s.uid));
      }

      setPendingStudents(pendingArr);
      setModeratedStudents(moderatedArr);
      setSentToAdminStudents(sentToAdminArr);

      // Get unique UIDs from all students
      const allStudents = [...pendingArr, ...moderatedArr, ...sentToAdminArr];
      const uniqueUids = [...new Set(allStudents.map(s => s.uid))];

      // Check moderation status for each UID
      const uidModerationStatus = new Set<string>();
      for (const uid of uniqueUids) {
        try {
          const res = await fetch(`${API_BASE}/api/moderation/${uid}`);
          const data = await res.json();
          // If moderation form exists and has data
          if (data && data.form_data && Object.keys(data.form_data).length > 0) {
            uidModerationStatus.add(uid);
          }
        } catch (e) {
          // No moderation data for this UID
        }
      }
      setModeratedUids(uidModerationStatus);

    } catch (e) {
      console.warn('Could not load students', e);
      // Reset to empty arrays on error
      setPendingStudents([]);
      setModeratedStudents([]);
      setSentToAdminStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Socket listeners for real-time updates
    socket.on('user_form_saved', loadData);
    socket.on('student_status_updated', loadData);
    socket.on('uid_approved', loadData);
    socket.on('uid_deleted', loadData);
    socket.on('moderation_saved', loadData);
    socket.on('assessor_review_complete', loadData); // Refresh when assessor marks reviewed
    socket.on('sent_to_admin', loadData); // Refresh when sent to admin

    return () => {
      socket.off('user_form_saved', loadData);
      socket.off('student_status_updated', loadData);
      socket.off('uid_approved', loadData);
      socket.off('uid_deleted', loadData);
      socket.off('moderation_saved', loadData);
      socket.off('assessor_review_complete', loadData);
      socket.off('sent_to_admin', loadData);
    };
  }, [user?.id]);

  // View student form
  const handleViewForm = (student: Student) => {
    window.open(`/user/${student.uid}/${student.student_id}`, '_blank');
  };

  // Mark as moderated (reviewed by moderator)
  const handleMarkModerated = async (student: Student) => {
    try {
      await api.updateStudentStatus(student.uid, student.student_id, 'moderated');
      toast({ title: 'Success', description: `${student.learner_name} marked as moderated` });
      loadData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  // Send to Admin
  const handleSendToAdmin = async (student: Student) => {
    try {
      await api.updateStudentStatus(student.uid, student.student_id, 'sent_to_admin');
      toast({ title: 'Success', description: `${student.learner_name} sent to Admin` });
      loadData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to send to admin', variant: 'destructive' });
    }
  };

  // Generate PDF
  const handleGeneratePDF = async (student: Student) => {
    try {
      if (student.form_data) {
        await generateFormPDF(student.form_data, toast);
      } else {
        // Fetch from API
        const res = await fetch(`${API_BASE}/api/student/${student.uid}/${student.student_id}`);
        const data = await res.json();
        if (data.form_data) {
          await generateFormPDF(data.form_data, toast);
        }
      }
    } catch (error) {
      toast({ title: 'PDF Error', description: 'Failed to generate PDF', variant: 'destructive' });
    }
  };

  const totalPending = pendingStudents.length;
  const totalModerated = moderatedStudents.length + sentToAdminStudents.length;

  // Show futuristic loader during initial page load or logout
  if (loading || isLoggingOut) {
    return <FuturisticLoader type={isLoggingOut ? "logout" : "loading"} text={isLoggingOut ? "Signing Out..." : "Loading Moderator..."} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Premium Gradient Background CSS */}
      <style>{`
        .moderator-bg {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 25%, #c4b5fd 50%, #ede9fe 75%, #f5f3ff 100%);
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
        .premium-sidebar-moderator {
          background: linear-gradient(180deg, #0f172a 0%, #4c1d95 50%, #0f172a 100%);
        }
      `}</style>

      {/* Sidebar - Premium Dark Purple Design */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-20'} premium-sidebar-moderator text-slate-100 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-50 border-r border-purple-700/50 relative`}>

        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-violet-500 to-fuchsia-500 bg-[length:200%_200%] animate-gradient-x"></div>

        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50 mt-1">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'} animate-in fade-in duration-300`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <span className="font-bold text-white text-lg">M</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white font-sans">Moderator</h1>
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
            icon={<AlertCircle className="h-5 w-5" />}
            label={`Pending (${totalPending})`}
            active={activeMenu === 'pending'}
            onClick={() => setActiveMenu('pending')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<CheckCircle className="h-5 w-5" />}
            label={`Moderated (${totalModerated})`}
            active={activeMenu === 'moderated'}
            onClick={() => setActiveMenu('moderated')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="Reports"
            active={activeMenu === 'reports'}
            onClick={() => setActiveMenu('reports')}
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* User Profile / Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 mx-2 mb-2 rounded-xl">
          <button
            onClick={async () => { setIsLoggingOut(true); await logoutUser(); navigate('/login'); }}
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
      <div className="flex-1 overflow-auto moderator-bg">
        {/* Top Bar - Glassmorphism */}
        <div className="glassmorphism-card shadow-lg shadow-purple-100/50 mx-4 mt-4 rounded-2xl px-6 py-4 flex items-center justify-between border-b border-white/50">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="hover:text-gray-700 cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-purple-600 font-medium">Moderator</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-violet-600 bg-clip-text text-transparent">Moderator Dashboard</h2>
            <p className="text-sm text-gray-500 mt-0.5">Review individual learner submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={loadData} className="rounded-xl hover:bg-gray-50">
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{totalPending}</h3>
                <p className="text-white/90 text-sm font-medium">Pending Moderation</p>
                <button
                  onClick={() => setActiveMenu('pending')}
                  className="mt-3 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm"
                >
                  Review Now →
                </button>
              </div>
              <div className="absolute right-3 bottom-3 opacity-20">
                <Clock className="h-12 w-12" />
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{totalModerated}</h3>
                <p className="text-white/90 text-sm font-medium">Moderated</p>
                <button
                  onClick={() => setActiveMenu('moderated')}
                  className="mt-3 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm"
                >
                  View Details →
                </button>
              </div>
              <div className="absolute right-3 bottom-3 opacity-20">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-extrabold drop-shadow-md mb-1">{sentToAdminStudents.length}</h3>
                <p className="text-white/90 text-sm font-medium">Sent to Admin</p>
              </div>
              <div className="absolute right-3 bottom-3 opacity-20">
                <Send className="h-12 w-12" />
              </div>
            </div>
          </div>

          {/* Pending Moderation Queue - Individual Learners */}
          {(activeMenu === 'pending' || activeMenu === 'dashboard') && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
                Pending Moderation - Individual Learners ({pendingStudents.length})
              </h3>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : pendingStudents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Queue is Empty</h3>
                  <p className="text-gray-500">All learner submissions have been moderated.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingStudents.map((student) => (
                    <Card key={student.student_id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-purple-500 bg-purple-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="bg-purple-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-bold">{student.learner_name || 'N/A'}</h3>
                              <Badge className="bg-purple-600 text-white">Pending Moderation</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 flex gap-4">
                              <span><span className="font-semibold">UID:</span> {student.uid}</span>
                              <span><span className="font-semibold">Company:</span> {student.company_name || 'N/A'}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Student ID: {student.student_id} | Submitted: {new Date(student.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewForm(student)}
                            className="flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Form</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleGeneratePDF(student)}
                            className="flex items-center space-x-2"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>

                          {/* Check if moderation form exists for this UID */}
                          {moderatedUids.has(student.uid) ? (
                            <Button
                              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleSendToAdmin(student)}
                            >
                              <Send className="h-4 w-4" />
                              <span>Send to Admin</span>
                            </Button>
                          ) : (
                            <Button
                              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                              onClick={() => window.open(`/moderation/${student.uid}`, '_blank')}
                            >
                              <ClipboardList className="h-4 w-4" />
                              <span>Fill Moderation Form</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Moderated / Sent to Admin Section */}
          {(activeMenu === 'moderated' || activeMenu === 'dashboard') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Sent to Admin ({sentToAdminStudents.length})
              </h3>

              {sentToAdminStudents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No History</h3>
                  <p className="text-gray-500">Moderated learners sent to Admin will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentToAdminStudents.map((student) => (
                    <Card key={student.student_id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-bold">{student.learner_name || 'N/A'}</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Sent to Admin
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-semibold">UID:</span> {student.uid} | <span className="font-semibold">Company:</span> {student.company_name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Reviewed: {student.reviewed_at ? new Date(student.reviewed_at).toLocaleString() : 'N/A'}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewForm(student)}
                            className="flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleGeneratePDF(student)}
                            className="flex items-center space-x-2"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced MenuItem with Purple accent support
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
          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 font-medium'
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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>
      )}

      {/* Optional Submenu Indicator logic if ever added */}
      {!collapsed && active && <ChevronRight className="h-4 w-4 ml-auto text-white/50" />}
    </button>
  );
};

export default ModeratorDashboard;
