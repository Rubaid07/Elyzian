import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserTie, FaCheckCircle } from 'react-icons/fa';
import Spinner from '../../../component/Loader/Spinner';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../context/AuthContext';

const ApplyAsAgent = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/agent-applications/status/${user.email}`)
        .then(res => {
          if (res.data?.status === 'pending' || res.data?.status === 'approved') {
            setHasApplied(true);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error checking agent application status:", error);
          setIsLoading(false);
        });
    }
  }, [user, axiosSecure]);

  const handleApply = (e) => {
    e.preventDefault();
    setLoading(true);

    const application = {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      status: 'pending',
      appliedAt: new Date(),
    };

    axiosSecure.post('/agent-applications', application)
      .then(() => {
        toast.success('Your agent application has been submitted successfully!')
        setHasApplied(true);
      })
      .catch((error) => {
        console.error("Application submission failed:", error);
        toast.error('Failed to submit application. Please try again')
      })
      .finally(() => setLoading(false));
  };

  if (isLoading) return <Spinner></Spinner>

  if (hasApplied) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-green-200 text-center max-w-xl mx-auto my-10">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-bounce-in" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Application Submitted Successfully! 🎉</h2>
        <p className="text-gray-600 leading-relaxed">
          Your request to become an agent is currently under review. Our team will process your application as soon as possible and notify you of the decision. Thank you for your patience!
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Please check your dashboard or email for any updates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-sky-100 max-w-2xl mx-auto my-10">
      <div className="flex items-center justify-center mb-6">
        <FaUserTie className="text-sky-700 text-5xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Apply as an Agent</h2>
      </div>
      <p className="mb-8 text-gray-600 text-center leading-relaxed">
        Become a part of our team and kickstart your career as a life insurance agent! Please confirm your application by providing some additional information below.
      </p>

      <form onSubmit={handleApply} className="space-y-6">
         <div className="avatar">
              <div className="w-24 rounded-full">
                <img src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="User" />
              </div>
            </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            value={user?.displayName || ''}
            disabled
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            value={user?.email || ''}
            disabled
          />
        </div>

        <button
          type="submit"
          className="btn bg-sky-700 hover:bg-sky-800 text-white w-full mt-4 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span> Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplyAsAgent;