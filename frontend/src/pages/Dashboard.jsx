import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Briefcase, DollarSign, Star } from 'lucide-react';

const Dashboard = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/interviewers/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setMentors(res.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple client-side filtering
  const filteredMentors = mentors.filter(m => 
    m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.user_info.first_name + ' ' + m.user_info.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900">Find a Mentor</h1>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                    type="text" 
                    placeholder="Search by company, role..." 
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
                Me
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        
        {loading ? (
            <div className="text-center py-20 text-slate-500">Loading mentors...</div>
        ) : filteredMentors.length === 0 ? (
            <div className="text-center py-20">
                <h3 className="text-xl font-bold text-slate-700">No mentors found.</h3>
                <p className="text-slate-500">Try adjusting your search or come back later!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                    <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {mentor.user_info.first_name?.[0] || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{mentor.user_info.first_name} {mentor.user_info.last_name}</h3>
                                    <p className="text-slate-500 text-sm flex items-center gap-1">
                                        <Briefcase className="w-3 h-3"/> {mentor.title} at {mentor.company}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                <DollarSign className="w-3 h-3"/> {mentor.price_per_hour}/hr
                            </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
                            {mentor.bio || "No bio provided."}
                        </p>

                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                            Book Session
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;