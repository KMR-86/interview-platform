import React from 'react';
import { Link } from 'react-router-dom';

const InterviewerCard = ({ profile }) => {
  // profile.user_info contains { username, first_name, ... }
  const { user_info, title, company, price_per_hour, id } = profile;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
          {user_info.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{user_info.username}</h3>
          <p className="text-sm text-gray-500">{title} at {company}</p>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{profile.bio}</p>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-lg font-bold text-gray-900">${price_per_hour}/hr</span>
        <Link 
          to={`/book/${id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default InterviewerCard;