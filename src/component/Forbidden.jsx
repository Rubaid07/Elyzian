import React from 'react';
import { Link } from 'react-router'; 
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="text-center bg-white rounded-xl shadow-2xl p-8 sm:p-12 max-w-lg w-full">
        <div className="mb-8">
          <FaBan className="text-8xl text-red-600 mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-2">
            Access Denied
          </h1>
          <p className="text-lg text-gray-700">
            Sorry, you do not have permission to view this page.
          </p>
          <p className="text-md text-gray-600 mt-2">
            This resource is restricted based on your account's role.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-1 text-lg"
          >
            Go to Your Dashboard
          </Link>
          <p className="text-md text-gray-600 mt-4">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;