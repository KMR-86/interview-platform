import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const Onboarding = () => {
  const { api, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    bio: '',
    price_per_hour: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Update Profile Data
      await api.put('/api/interviewer/profile/', formData);
      
      // 2. IMPORTANT: We need an endpoint to "Submit for Review" 
      // which changes status from AWAITING_INFORMATION -> PENDING.
      // For MVP, let's assume the backend handles this transition automatically 
      // if the profile is complete, OR we add a specific flag.
      
      // Let's assume PUT updates data. We might need a separate call to change status.
      // For now, let's just refresh the user to see if status changed or 
      // if we need to manually force it.
      
      // Refresh the global user state so the new `interviewer_status` is available
      await refreshUser();
      alert("Profile submitted for review!");
      navigate('/interviewer/pending');
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Complete your Interviewer Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            {/* Add Company, Bio, Price, Meeting Link fields similarly... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input type="text" required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea required rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
              <input type="number" required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.price_per_hour}
                onChange={e => setFormData({...formData, price_per_hour: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Submit for Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;