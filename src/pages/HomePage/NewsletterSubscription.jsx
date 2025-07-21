import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FiMail, FiUser, FiSend } from 'react-icons/fi';

const NewsletterSubscription = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/subscribe`, {
        name,
        email
      });

      if (response.data.insertedId) {
        toast.success('🎉 Successfully subscribed! Thank you!');
        setName('');
        setEmail('');
      } else {
        toast.error('Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg my-12 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Stay Updated
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Subscribe to our newsletter for the latest news, offers, and exclusive content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 input input-bordered w-full p-3.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 input input-bordered w-full p-3.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center py-3.5 px-6 rounded-lg text-white font-medium transition cursor-pointer duration-150 ${isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-blue-600 hover:to-sky-600 shadow-md hover:shadow-lg'
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiSend className="mr-2" />
                Subscribe Now
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscription;