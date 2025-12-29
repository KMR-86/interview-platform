import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming you have this

const StatusLayout = ({ title, message, color }) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-${color}-100 mb-6`}>
           {/* Simple Icon based on color/status */}
           <span className={`text-2xl text-${color}-600 font-bold`}>!</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <button
          onClick={logout}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export const ActionRequired = () => (
  <StatusLayout 
    title="Additional Information Needed" 
    message="Your profile is incomplete or requires changes. Please check your email for instructions or contact support."
    color="yellow"
  />
);

export const PendingApproval = () => (
  <StatusLayout 
    title="Application Under Review" 
    message="Thanks for applying! Our team is currently reviewing your profile. You will be notified via email once approved."
    color="blue"
  />
);

export const ApplicationDeclined = () => (
  <StatusLayout 
    title="Application Declined" 
    message="Thank you for your interest. Unfortunately, your application to become an interviewer was not approved at this time."
    color="red"
  />
);