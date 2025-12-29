import { Routes, Route } from 'react-router-dom';
import RoleRedirector from './components/RoleRedirector';
import InterviewerGuard from './components/InterviewerGuard';
import RequireAuth from './components/RequireAuth'; 
import Home from './pages/Home';
import Onboarding from './pages/interviewer/Onboarding';

// Pages
import Login from './pages/Login';
import IntervieweeDashboard from './pages/interviewee/Dashboard';
import InterviewerDashboard from './pages/interviewer/Dashboard';
import { ActionRequired, PendingApproval, ApplicationDeclined } from './pages/interviewer/StatusPages';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Root -> Public Homepage (show homepage first for unauthenticated users) */}
      <Route path="/" element={<Home />} />

      {/* Legacy root redirect (if you want automatic role-based landing) */}
      <Route path="/start" element={<RoleRedirector />} />

      {/* ------------------------------------------------------- */}
      {/* INTERVIEWEE ROUTES (Normal Users) - Always Active */}
      {/* ------------------------------------------------------- */}
      <Route path="/dashboard" element={
        <RequireAuth>
          <IntervieweeDashboard />
        </RequireAuth>
      } />

      {/* ------------------------------------------------------- */}
      {/* INTERVIEWER ROUTES - Strictly Gated */}
      {/* ------------------------------------------------------- */}
      
      {/* 1. The "Happy Path" (Approved Only) */}
      <Route path="/interviewer/dashboard" element={
        <RequireAuth>
          <InterviewerGuard>
            <InterviewerDashboard />
          </InterviewerGuard>
        </RequireAuth>
      } />

      <Route path="/interviewer/onboarding" element={
        <RequireAuth>
          <Onboarding />
        </RequireAuth>
      } />
      {/* Add other protected interviewer routes here (Calendar, Settings) */}

      {/* 2. The "Holding Pen" Routes (Accessible if status matches, checked by Redirector) */}
      <Route path="/interviewer/action-required" element={<RequireAuth><ActionRequired /></RequireAuth>} />
      <Route path="/interviewer/pending" element={<RequireAuth><PendingApproval /></RequireAuth>} />
      <Route path="/interviewer/declined" element={<RequireAuth><ApplicationDeclined /></RequireAuth>} />

    </Routes>
  );
}

export default App;