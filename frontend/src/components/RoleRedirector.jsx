import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirector = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 1. NON-INTERVIEWERS (Normal Users) -> Dashboard
  if (!user.is_interviewer) {
    return <Navigate to="/dashboard" replace />;
  }

  // 2. INTERVIEWERS -> Route based on Status
  if (user.is_interviewer) {
    switch (user.interviewer_status) {
      case 'APPROVED':
        return <Navigate to="/interviewer/dashboard" replace />;
      case 'AWAITING_INFORMATION':
        // Redirect to the Onboarding Form (Fix 3 below)
        return <Navigate to="/interviewer/onboarding" replace />; 
      case 'PENDING':
        return <Navigate to="/interviewer/pending" replace />;
      case 'REJECTED':
        return <Navigate to="/interviewer/declined" replace />;
      default:
        return <Navigate to="/interviewer/dashboard" replace />;
    }
  }

  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirector;  