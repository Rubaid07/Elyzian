import React, { useContext, useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../../component/Loader/Spinner';
import toast from 'react-hot-toast';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const DashboardOverview = () => {
    const { user, loading: userLoading } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [role, setRole] = useState(null);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();

    // Helper function to determine if a transaction status is considered 'success'
    const isSuccessStatus = (status) => {
        return ['completed', 'paid', 'success', 'succeeded'].includes(status?.toLowerCase());
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.email || userLoading) {
                setLoadingDashboard(false);
                return;
            }

            setLoadingDashboard(true);
            setError(null);

            try {
                // Fetch user role and dashboard overview data in parallel
                const [roleRes, dashboardRes] = await Promise.all([
                    axiosSecure.get(`/users/${user.email}`),
                    axiosSecure.get(`/dashboard-overview?email=${user.email}`)
                ]);

                setRole(roleRes.data?.role || 'customer');
                setDashboardData(dashboardRes.data);

                // If admin, fetch transactions for the chart
                if (roleRes.data?.role === 'admin') {
                    const transactionsRes = await axiosSecure.get('/admin/transactions');
                    const fetchedTransactions = transactionsRes.data || [];
                    setDashboardData(prevData => ({
                        ...prevData,
                        transactions: fetchedTransactions
                    }));
                }

            } catch (err) {
                console.error('Dashboard Data Fetch Error:', err);
                setError("Failed to load dashboard data. Please try again.");
                toast.error("Failed to load dashboard data.");
            } finally {
                setLoadingDashboard(false);
            }
        };

        fetchDashboardData();
    }, [user, userLoading, axiosSecure]);

    // Graph/Chart Data Preparation for Admin Earnings
    const getEarningsOverTimeData = () => {
        if (role !== 'admin' || !dashboardData?.transactions) return [];

        const dailyEarnings = dashboardData.transactions.reduce((acc, tx) => {
            if (isSuccessStatus(tx.status) && tx.paymentDate && tx.premiumAmount) {
                const date = new Date(tx.paymentDate).toISOString().split('T')[0];
                acc[date] = (acc[date] || 0) + tx.premiumAmount;
            }
            return acc;
        }, {});

        const chartData = Object.keys(dailyEarnings).map(date => ({
            date: date,
            earnings: dailyEarnings[date]
        }));

        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return chartData;
    };

    const earningsChartData = getEarningsOverTimeData();

    if (userLoading || loadingDashboard) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
            </div>
        );
    }

    // Fallback if data is null after loading (shouldn't happen with proper error handling)
    if (!dashboardData || !role) {
        return (
            <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
                <p className="text-xl font-semibold mb-4">No dashboard data available.</p>
                <p>Please try refreshing the page or contact support.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
                Welcome, <span className="text-sky-700">{user?.displayName?.split(' ')[0] || 'User'}</span>!
            </h2>

            {/* Overview Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <p className="text-gray-600 text-base font-medium mb-2">{card.title}</p>
                        <h3 className="text-4xl font-extrabold text-sky-800">{card.value}</h3>
                    </div>
                ))}
            </section>

            {/* Admin Specific: Total Earnings Over Time Graph */}
            {role === 'admin' && (
                <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Total Earnings Over Time 📈</h3>
                    {earningsChartData.length > 0 ? (
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={earningsChartData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `BDT ${value.toFixed(2)}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="earnings" stroke="#38b2ac" activeDot={{ r: 8 }} name="Earnings" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                            No earnings data available for the chart.
                        </div>
                    )}
                </section>
            )}

            {/* Recent Activities Section */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recent Activities</h3>

                {role === 'admin' && dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Latest Applications</h4>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Applicant Name</th>
                                        <th>Policy Name</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.recentApplications.slice(0, 5).map((app, i) => ( // Show top 5
                                        <tr key={i}>
                                            <td>{app.applicantName || 'N/A'}</td>
                                            <td>{app.policyName || 'N/A'}</td>
                                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${
                                                    app.status === 'pending' ? 'badge-info' :
                                                    app.status === 'approved' ? 'badge-success' :
                                                    app.status === 'rejected' ? 'badge-error' :
                                                    app.status === 'paid' ? 'badge-primary' :
                                                    'badge-neutral'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {role === 'agent' && dashboardData?.recentBlogs && dashboardData.recentBlogs.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Latest Blogs</h4>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Blog Title</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.recentBlogs.slice(0, 5).map((blog, i) => ( // Show top 5
                                        <tr key={i}>
                                            <td>{blog.title}</td>
                                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {role === 'customer' && dashboardData?.myPolicies && dashboardData.myPolicies.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Active Policies</h4>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Policy Name</th>
                                        <th>Premium Amount</th>
                                        <th>Frequency</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.myPolicies.slice(0, 5).map((policy, i) => ( // Show top 5
                                        <tr key={i}>
                                            <td>{policy.policyName}</td>
                                            <td>BDT {policy.premiumAmount?.toFixed(2) || 'N/A'}</td>
                                            <td>{policy.paymentFrequency || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${
                                                    policy.status === 'active' ? 'badge-success' :
                                                    policy.status === 'inactive' ? 'badge-error' :
                                                    'badge-neutral'
                                                }`}>
                                                    {policy.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* If no recent activity data */}
                {(!dashboardData?.recentApplications || dashboardData.recentApplications.length === 0) &&
                 (!dashboardData?.recentBlogs || dashboardData.recentBlogs.length === 0) &&
                 (!dashboardData?.myPolicies || dashboardData.myPolicies.length === 0) && (
                    <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                        No recent activity to display.
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardOverview;