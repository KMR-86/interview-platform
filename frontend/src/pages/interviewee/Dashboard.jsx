import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import InterviewerCard from '../../components/InterviewerCard';

const Dashboard = () => {
  const { api } = useAuth();
  const [interviewers, setInterviewers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel data fetching
        const [interviewersRes, bookingsRes] = await Promise.all([
          api.get('/api/interviewers/'),
          api.get('/api/bookings/my-bookings/')
        ]);

        setInterviewers(interviewersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  if (loading) return <div className="text-center mt-20">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SECTION 1: MY SCHEDULE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Upcoming Sessions</h2>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500 shadow-sm">
              You have no upcoming interviews. Book one below!
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {booking.interviewer_name} ({booking.interviewer_title})
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.start_time).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      {booking.status === 'CONFIRMED' && (
                        <a 
                          href={booking.meeting_link_snapshot} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        >
                          Join Meeting &rarr;
                        </a>
                      )}
                      {booking.status === 'PENDING' && (
                        <span className="text-yellow-600 text-sm">Awaiting Confirmation</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* SECTION 2: FIND A MENTOR */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Mentor</h2>
          {interviewers.length === 0 ? (
            <p className="text-gray-500">No interviewers available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewers.map((profile) => (
                <InterviewerCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Dashboard;