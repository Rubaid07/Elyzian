import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../component/Loader/Spinner';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const MeetAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/agent`);
        setAgents(response.data);
      } catch (err) {
        console.error("Failed to fetch featured agents:", err);
        setError("Failed to load agents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner className="w-16 h-16" />
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-red-500 text-lg bg-red-50 px-6 py-3 rounded-lg max-w-md text-center">
        {error}
      </p>
    </div>
  );

  if (agents.length === 0) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-600 text-lg bg-gray-50 px-6 py-3 rounded-lg max-w-md text-center">
        No featured agents available at the moment. Check back later!
      </p>
    </div>
  );

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-sky-600">Expert Agents</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our dedicated team of insurance professionals is ready to guide you through every step of your insurance journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div 
              key={agent._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <img 
                  src={agent.photo || 'https://i.ibb.co/5GzXkwq/user.png'}
                  alt={agent.name}
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{agent.name}</h3>
                
                {agent.experience && (
                  <p className="text-gray-700 mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium mr-2">
                      {agent.experience}+ Years
                    </span>
                    <span className="text-gray-500 text-sm">Experience</span>
                  </p>
                )}

                {agent.specialties && agent.specialties.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty, i) => (
                        <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-6">
                  {agent.email && (
                    <div className="flex items-center text-gray-700">
                      <FaEnvelope className="text-blue-500 mr-3" />
                      <a href={`mailto:${agent.email}`} className="hover:text-blue-600 transition-colors truncate">
                        {agent.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetAgent;