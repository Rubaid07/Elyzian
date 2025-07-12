import React, { useContext, useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../../component/Loader/Spinner';

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/dashboard-overview?email=${user.email}`)
        .then(res => setDashboardData(res.data))
        .catch(err => console.error('Dashboard Overview Error:', err));
    }
  }, [user, axiosSecure]);

  if (!dashboardData) return <Spinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome, {user?.displayName?.split(' ')[0] || 'User'}!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h3 className="text-2xl font-bold text-sky-700">{card.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
