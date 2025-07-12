import React, { useContext, useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../../component/Loader/Spinner';

const DashboardOverview = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [role, setRole] = useState(null);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (user?.email) {

            axiosSecure.get(`/users/${user.email}`)
                .then(res => setRole(res.data?.role || 'customer'))
                .catch(err => console.error('Role Fetch Error:', err));

            axiosSecure.get(`/dashboard-overview?email=${user.email}`)
                .then(res => setDashboardData(res.data))
                .catch(err => console.error('Dashboard Overview Error:', err));
        }
    }, [user, axiosSecure]);

    if (!dashboardData || !role) return <Spinner />;

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

            {role === 'admin' && dashboardData?.recentApplications && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">Recent Applications</h3>
                    <ul className="space-y-2">
                        {dashboardData.recentApplications.map((app, i) => (
                            <li key={i} className="p-3 bg-white border rounded shadow">
                                {app.name} — {app.status}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {role === 'agent' && dashboardData?.recentBlogs && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">Your Latest Blogs</h3>
                    <ul className="space-y-2">
                        {dashboardData.recentBlogs.map((blog, i) => (
                            <li key={i} className="p-3 bg-white border rounded shadow">
                                {blog.title}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {role === 'customer' && dashboardData?.myPolicies && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">My Recent Policies</h3>
                    <ul className="space-y-2">
                        {dashboardData.myPolicies.map((policy, i) => (
                            <li key={i} className="p-3 bg-white border rounded shadow">
                                {policy.policyName}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default DashboardOverview;
