import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InterviewerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    // Fetch Profile Data
    axios.get(`${BACKEND_URL}/api/interviewer/profile/`, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => setProfile(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('access_token');
      navigate('/');
  };

  if (!profile) return <div className="p-10">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Mentor Dashboard</h1>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Your Profile Status: <span className={profile.status === 'ACTIVE' ? "text-green-600" : "text-yellow-600"}>{profile.status}</span></h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-500">Company</label>
                    <div className="font-medium">{profile.company || "Not set"}</div>
                </div>
                <div>
                    <label className="block text-sm text-slate-500">Hourly Rate</label>
                    <div className="font-medium">${profile.price_per_hour}</div>
                </div>
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Edit Profile
            </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
            <p className="text-slate-500 italic">No sessions booked yet.</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewerDashboard;