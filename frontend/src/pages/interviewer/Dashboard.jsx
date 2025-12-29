import React from 'react';
import Navbar from '../../components/Navbar';
import SlotManager from '../../components/SlotManager';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Interviewer Workspace
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your availability and view upcoming sessions.
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Status: {user?.interviewer_status}
            </span>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* SECTION 1: Availability Manager */}
          <section>
            <SlotManager />
          </section>

          {/* SECTION 2: Upcoming Sessions (Placeholder for now) */}
          <section className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Upcoming Confirmed Sessions</h3>
            <p className="text-gray-500">
              (This section will display booked sessions once an Interviewee makes a reservation.)
            </p>
            {/* TODO: You can reuse the logic from the Interviewee Dashboard here 
               but fetching from /api/bookings/received-bookings/ 
            */}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;