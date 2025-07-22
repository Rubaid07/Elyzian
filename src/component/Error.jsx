import React from 'react';
import { Link } from 'react-router'; 
import logo from '../assets/logo.png';
import { FaHome } from 'react-icons/fa';

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
      <div className="text-center bg-white rounded-2xl shadow-xl p-8 sm:p-12 max-w-lg w-full border border-white/20 transform transition-all duration-300 ">
        <div className="mb-8">
          <div className="animate-pop-in">
            <img 
              src={logo}
              alt="Elyzian" 
              className="mx-auto h-12 mb-6 drop-shadow-md" 
            />
          </div>
          
          <div className="relative inline-block mb-6">
            <p className="text-8xl font-bold animate-bounce animate-soft-bounce text-sky-700">
              404
            </p>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3 animate-fade-in">
            Oops! Page Not Found
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto animate-fade-in delay-100">
            The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        <div className="space-y-4 animate-fade-in delay-200">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <FaHome />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;