import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserForm from "./pages/UserForm";
import AdminDashboardPage from "./pages/AdminDashboard";
import AssessorDashboardPage from "./pages/AssessorDashboard";
import AssessorReviewPage from "./pages/AssessorReviewPage";
import ModeratorDashboardPage from "./pages/ModeratorDashboard";
import ModerationForm from "./pages/ModerationForm";
import NotFound from "./pages/NotFound";
import SubmissionReviewPage from "./pages/SubmissionReviewPage";
import ModerationReviewPage from "./pages/ModerationReviewPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/:uid" element={<UserForm />} />
            <Route path="/user/:uid/:studentId" element={<SubmissionReviewPage />} />

            {/* Old login URLs - redirect to unified login */}
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/assessor" element={<Navigate to="/login" replace />} />
            <Route path="/moderator" element={<Navigate to="/login" replace />} />

            {/* Protected Dashboard routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/assessor-dashboard" element={
              <ProtectedRoute allowedRoles={['assessor']}>
                <AssessorDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/moderator-dashboard" element={
              <ProtectedRoute allowedRoles={['moderator']}>
                <ModeratorDashboardPage />
              </ProtectedRoute>
            } />

            {/* Protected work routes */}
            <Route path="/assessor-review/:uid/:studentId" element={<AssessorReviewPage />} />
            <Route path="/moderation/:uid" element={<ModerationForm />} />
            <Route path="/moderation-review/:uid" element={<ModerationReviewPage />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

