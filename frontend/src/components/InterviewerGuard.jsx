import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InterviewerGuard = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner
  }

  // 1. Security Check: Are they actually an interviewer?
  // If they are a normal user (Interviewee), kick them to their own dashboard.
  if (!user || !user.is_interviewer) {
    return <Navigate to="/dashboard" replace />;
  }

  // 2. Status Check: Handle the 4 States
  switch (user.interviewer_status) {
    case 'APPROVED':
      return children; // ACCESS GRANTED
      
    case 'AWAITING_INFORMATION':
      // Show the onboarding form so the interviewer can submit required info
      return <Navigate to="/interviewer/onboarding" replace />;
      
    case 'PENDING':
      return <Navigate to="/interviewer/pending" replace />;
      
    case 'REJECTED':
      return <Navigate to="/interviewer/declined" replace />;
      
    default:
      // Fallback for weird data states
      return <Navigate to="/interviewer/pending" replace />;
  }
};

export default InterviewerGuard;