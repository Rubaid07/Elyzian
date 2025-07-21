import React, { useContext, useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../../component/Loader/Spinner';
import {
    FaUsers, FaFileContract, FaHandHoldingMedical, FaDollarSign, FaUserTie,
    FaBlog, FaFileAlt, FaUmbrellaBeach, FaCreditCard, FaExclamationTriangle,
    FaFileSignature, FaMoneyBillWave
} from 'react-icons/fa';
import {
    BarChart, PieChart, LineChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const DashboardOverview = () => {
    const { user, loading: userLoading } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [role, setRole] = useState(null);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();

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
                const dashboardRes = await axiosSecure.get(`/dashboard-overview?email=${user.email}`);
                setDashboardData(dashboardRes.data);
                setRole(dashboardRes.data?.role || 'customer');
                if (dashboardRes.data?.role === 'admin') {
                    const transactionsRes = await axiosSecure.get('/admin/transactions');
                    setDashboardData(prevData => ({
                        ...prevData,
                        transactions: transactionsRes.data || []
                    }));
                }

            } catch (err) {
                console.error('Dashboard Data Fetch Error:', err);
                setError("Failed to load dashboard data. Please try again.");
            } finally {
                setLoadingDashboard(false);
            }
        };

        fetchDashboardData();
    }, [user, userLoading, axiosSecure]);
    const getChartData = () => {
        if (!dashboardData) return [];
        if (role === 'admin') {
            const monthlyEarnings = dashboardData.transactions?.reduce((acc, tx) => {
                if (isSuccessStatus(tx.status)) {
                    const date = new Date(tx.paymentDate);
                    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    acc[monthYear] = (acc[monthYear] || 0) + (tx.premiumAmount || 0);
                }
                return acc;
            }, {});
            const sortedMonthlyEarnings = Object.keys(monthlyEarnings || {})
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                .map(key => ({
                    name: new Date(key).toLocaleString('default', { month: 'short', year: '2-digit' }),
                    earnings: monthlyEarnings[key]
                }));

            const appStatusData = dashboardData.recentApplications?.reduce((acc, app) => {
                acc[app.status] = (acc[app.status] || 0) + 1;
                return acc;
            }, { pending: 0, approved: 0, rejected: 0 });

            return [
                {
                    title: "Monthly Earnings (BDT)",
                    type: "line",
                    data: sortedMonthlyEarnings,
                    dataKey: "earnings"
                },
                {
                    title: "Application Status Distribution",
                    type: "pie",
                    data: Object.keys(appStatusData || {}).map(status => ({
                        name: status,
                        value: appStatusData[status],
                        color: status === 'approved' ? '#4CAF50' :
                            status === 'pending' ? '#2196F3' :
                                '#F44336'
                    })).filter(entry => entry.value > 0)
                }
            ];
        }

        if (role === 'agent') {
            const assignedAppStatus = dashboardData.recentAssignedApplications?.reduce((acc, app) => {
                acc[app.status] = (acc[app.status] || 0) + 1;
                return acc;
            }, { pending: 0, approved: 0, rejected: 0 });
            const customersByPolicy = dashboardData.recentAssignedApplications?.reduce((acc, app) => {
                const policy = app.policyName || 'Unknown';
                acc[policy] = (acc[policy] || 0) + 1;
                return acc;
            }, {});
            const sortedCustomersByPolicy = Object.keys(customersByPolicy || {})
                .map(policy => ({
                    name: policy.length > 15 ? `${policy.substring(0, 15)}...` : policy,
                    value: customersByPolicy[policy]
                }))
                .sort((a, b) => b.value - a.value);

            return [
                {
                    title: "Assigned Applications Status",
                    type: "pie",
                    data: Object.keys(assignedAppStatus || {}).map(status => ({
                        name: status,
                        value: assignedAppStatus[status],
                        color: status === 'approved' ? '#4CAF50' :
                            status === 'pending' ? '#2196F3' :
                                '#F44336'
                    })).filter(entry => entry.value > 0)
                },
                {
                    title: "Customers Assigned By Policy Type",
                    type: "bar",
                    data: sortedCustomersByPolicy,
                    dataKey: "value"
                }
            ];
        }

        if (role === 'customer') {
            const paymentData = dashboardData.recentPaidPolicies?.map(policy => ({
                name: policy.policyName?.split(' ')[0] || 'Policy',
                amount: policy.premiumAmount || 0,
                date: new Date(policy.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }));

            const policyTypes = dashboardData.recentApplications?.reduce((acc, app) => {
                const type = app.policyName?.includes('Health') ? 'Health' :
                    app.policyName?.includes('Life') ? 'Life' :
                        app.policyName?.includes('Car') ? 'Car' : 'Other';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, { Health: 0, Life: 0, Car: 0, Other: 0 });

            return [
                {
                    title: "Your Recent Payments (BDT)",
                    type: "bar",
                    data: paymentData || [],
                    dataKey: "amount",
                    xAxisKey: "name"
                },
                {
                    title: "Applied Policy Types Distribution",
                    type: "pie",
                    data: Object.keys(policyTypes || {}).map(type => ({
                        name: type,
                        value: policyTypes[type],
                        color: type === 'Health' ? '#2196F3' :
                            type === 'Life' ? '#673AB7' :
                                type === 'Car' ? '#4CAF50' :
                                    '#34699A'
                    })).filter(entry => entry.value > 0)
                }
            ];
        }

        return [];
    };

    const renderChart = (chart) => {
        if (!chart.data || chart.data.length === 0) {
            return (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                    No data available for this chart
                </div>
            );
        }

        switch (chart.type) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey={chart.dataKey === "earnings" ? "name" : chart.xAxisKey} stroke="#555" />
                            <YAxis stroke="#555" />
                            <Tooltip formatter={(value) => [`BDT ${value.toFixed(2)}`, chart.title.split('(')[0]]} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey={chart.dataKey}
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey={chart.xAxisKey || "name"} angle={-30} textAnchor="end" height={60} stroke="#555" />
                            <YAxis stroke="#555" />
                            <Tooltip formatter={(value, name) => {
                                if (name === "Amount (BDT)") return [`BDT ${value.toFixed(2)}`, name];
                                return [value, name];
                            }} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey={chart.dataKey} fill="#82ca9d" name={chart.dataKey === "amount" ? "Amount (BDT)" : "Count"} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chart.data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                dataKey="value"
                            >
                                {chart.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, "Count"]} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };
     const getIconComponent = (title) => {
        switch (title) {
            case 'Total Users': return <FaUsers className="text-2xl" />;
            case 'Total Policies': return <FaFileContract className="text-2xl" />;
            case 'Total Applications': return <FaFileSignature className="text-2xl" />;
            case 'Total Claims': return <FaHandHoldingMedical className="text-2xl" />;
            case 'Total Income': return <FaDollarSign className="text-2xl" />;
            case 'Assigned Customers': return <FaUserTie className="text-2xl" />;
            case 'Your Blogs': return <FaBlog className="text-2xl" />;
            case 'Assigned Applications': return <FaFileAlt className="text-2xl" />;
            case 'My Policies': return <FaUmbrellaBeach className="text-2xl" />;
            case 'Total Payments Made': return <FaCreditCard className="text-2xl" />;
            case 'Total Amount Paid': return <FaMoneyBillWave className="text-2xl" />;
            case 'Claim Requests': return <FaExclamationTriangle className="text-2xl" />;
            default: return <FaDollarSign className="text-2xl" />;
        }
    };
    const getIconColorClass = (title) => {
        switch (title) {
            case 'Total Users': return 'text-blue-500';
            case 'Total Policies': return 'text-green-500';
            case 'Total Applications': return 'text-purple-500';
            case 'Total Claims': return 'text-red-500';
            case 'Total Income': return 'text-yellow-500';
            case 'Assigned Customers': return 'text-indigo-500';
            case 'Your Blogs': return 'text-orange-500';
            case 'Assigned Applications': return 'text-teal-500';
            case 'My Policies': return 'text-blue-600';
            case 'Total Payments Made': return 'text-green-600';
            case 'Total Amount Paid': return 'text-purple-600';
            case 'Claim Requests': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };
    if (userLoading || loadingDashboard) {
        return <Spinner />;
    }
    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }
    if (!dashboardData || !role) {
        return (
            <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
                <p className="text-xl font-semibold mb-4">No dashboard data available.</p>
                <p>Please try refreshing the page or contact support.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8 min-h-screen bg-gray-50">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 pt-4">
                Welcome, <span className="text-sky-700">{user?.displayName?.split(' ')[0] || 'User'}!</span>
            </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {dashboardData.cards?.map((card, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${card.color} bg-opacity-10 mr-4`}>
                                {getIconComponent(card.title)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>
                                <p className="text-xl font-bold">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <hr className="my-8 border-gray-300" />
            {getChartData().length > 0 && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getChartData().map((chart, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{chart.title}</h3>
                            {renderChart(chart)}
                        </div>
                    ))}
                </section>
            )}
            <hr className="my-8 border-gray-300" />
            <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recent Activities 📊</h3>
                {role === 'admin' && dashboardData?.recentTransactions?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Latest Transactions</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentTransactions.map((tx, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.transactionId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BDT {tx.premiumAmount?.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(tx.paymentDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isSuccessStatus(tx.status) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {role === 'admin' && dashboardData?.recentApplications?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Latest Policy Applications (Admin)</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentApplications.map((app, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.fullName || app.applicantName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.policyName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
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
                {role === 'agent' && dashboardData?.recentBlogs?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Latest Blogs</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentBlogs.map((blog, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{blog.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{blog.createdBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {role === 'agent' && dashboardData?.recentAssignedCustomers?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Recently Assigned Customers</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentAssignedCustomers.map((customer, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{customer.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{customer.email || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(customer.assignedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {role === 'agent' && dashboardData?.recentAssignedApplications?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Recent Assigned Applications</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentAssignedApplications.map((app, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.fullName || app.applicantName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.policyName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
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
                {role === 'customer' && dashboardData?.recentApplications?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Recent Policy Applications</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentApplications.map((app, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.policyName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
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
                {role === 'customer' && dashboardData?.recentPaidPolicies?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Recent Paid Policies</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentPaidPolicies.map((policy, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{policy.policyName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">BDT {policy.premiumAmount?.toFixed(2) || '0.00'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(policy.paymentDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isSuccessStatus(policy.status) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {policy.status || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {dashboardData?.recentPolicies?.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Recently Added Policies (All Users)</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.recentPolicies.map((policy, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{policy.policyTitle || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{policy.category || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(policy.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {dashboardData?.recentBlogs?.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Latest Blogs (All Users)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardData.recentBlogs.map((blog, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <h5 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h5>
                                        <p className="text-sm text-gray-500 mb-4">
                                            By {blog.createdBy} • {new Date(blog.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600 line-clamp-3">{blog.description || 'No content available'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {((role === 'admin' && !(dashboardData?.recentTransactions?.length > 0) && !(dashboardData?.recentApplications?.length > 0)) ||
                    (role === 'agent' && !(dashboardData?.recentBlogs?.length > 0) && !(dashboardData?.recentAssignedCustomers?.length > 0) && !(dashboardData?.recentAssignedApplications?.length > 0)) ||
                    (role === 'customer' && !(dashboardData?.recentApplications?.length > 0) && !(dashboardData?.recentPaidPolicies?.length > 0))) &&
                    (!(dashboardData?.recentPolicies?.length > 0) && !(dashboardData?.recentBlogs?.length > 0)) && (
                        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                            No specific recent activity to display for your role. Please check general activities below.
                        </div>
                    )}
            </section>
        </div>
    );
};

export default DashboardOverview;