import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SlotManager = () => {
  const { api } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchSlots = async () => {
    try {
      const res = await api.get('/api/interviewer/availability/');
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to load slots", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Format Data for Backend
    // Backend expects: [ { "start": "YYYY-MM-DDTHH:MM:SS", "end": "..." } ]
    const startISO = `${date}T${startTime}:00Z`; // Simplified UTC handling for MVP
    const endISO = `${date}T${endTime}:00Z`;

    // Basic Validation
    if (new Date(startISO) >= new Date(endISO)) {
      setError("End time must be after start time");
      return;
    }

    try {
      await api.post('/api/interviewer/availability/', [
        { start: startISO, end: endISO }
      ]);
      
      // Reset Form & Refresh List
      setDate('');
      setStartTime('');
      setEndTime('');
      fetchSlots();
      alert("Availability added!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add slots");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Manage Availability</h3>
      
      {/* 1. ADD SLOT FORM */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time (UTC)</label>
            <input 
              type="time" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time (UTC)</label>
            <input 
              type="time" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4 text-right">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none"
          >
            Add Availability Block
          </button>
        </div>
      </form>

      {/* 2. SLOT LIST */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Your Upcoming Slots</h4>
        {loading ? (
          <p>Loading...</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500 italic">No availability set. Add some times above!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div 
                key={slot.id} 
                className={`p-3 rounded border text-center ${slot.is_booked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
              >
                <p className="text-sm font-bold text-gray-700">
                  {new Date(slot.start_time).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(slot.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                  {new Date(slot.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${slot.is_booked ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>
                  {slot.is_booked ? 'BOOKED' : 'OPEN'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotManager;