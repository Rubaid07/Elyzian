import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
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

const ManageTransactions = () => {
    const axiosSecure = useAxiosSecure();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [totalIncome, setTotalIncome] = useState(0);
    const isSuccessStatus = (status) => {
        return ['completed', 'paid', 'success', 'succeeded'].includes(status?.toLowerCase());
    };
    const isFailedStatus = (status) => {
        return ['failed', 'canceled', 'rejected'].includes(status?.toLowerCase());
    };

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            const res = await axiosSecure.get('/admin/transactions', { params });
            const fetchedTransactions = res.data || [];
            setTransactions(fetchedTransactions);

            const income = fetchedTransactions.reduce((sum, tx) => {
                return sum + (isSuccessStatus(tx.status) ? (tx.premiumAmount || 0) : 0);
            }, 0);
            setTotalIncome(income);

        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transactions. Please try again.");
            toast.error("Error loading transactions.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTransactions();
    }, [axiosSecure]);
    const openDetailsModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };
    const closeDetailsModal = () => {
        setSelectedTransaction(null);
        setIsModalOpen(false);
    };
    const getEarningsOverTimeData = () => {
        const dailyEarnings = transactions.reduce((acc, tx) => {
            if (isSuccessStatus(tx.status) && tx.paymentDate && tx.premiumAmount) {
                const date = new Date(tx.paymentDate).toLocaleDateString();
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
    if (loading) {
        return <Spinner />;
    }
    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Manage All Transactions 💳</h1>

            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 shadow-md rounded-lg text-center">
                <p className="text-2xl font-semibold">Total Income from Policy Sales: <span className="font-bold text-green-800">BDT {totalIncome.toFixed(2)}</span></p>
            </div>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Total Earnings Over Time 📈</h2>
            {earningsChartData.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 mb-8" style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={earningsChartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `BDT ${value.toFixed(2)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="earnings" stroke="#82ca9d" activeDot={{ r: 8 }} name="Earnings" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center text-gray-500 mb-8 p-4 bg-gray-50 rounded-lg">
                    No data available for earnings chart based on current filters.
                </div>
            )}

            <hr className="my-8 border-gray-300" />

            {transactions.length === 0 ? (
                <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
                    <p className="text-xl font-semibold mb-4">No transactions found with applied filters.</p>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>User Email</th>
                                <th>Policy Name</th>
                                <th>Paid Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={tx._id}>
                                    <th>{index + 1}</th>
                                    <td>{tx.transactionId || 'N/A'}</td>
                                    <td>{tx.email || 'N/A'}</td>
                                    <td>{tx.policyName || 'N/A'}</td>
                                    <td>BDT {tx.premiumAmount ? tx.premiumAmount.toFixed(2) : '0.00'}</td>
                                    <td>{new Date(tx.paymentDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${
                                            isSuccessStatus(tx.status) ? 'badge-success' : isFailedStatus(tx.status) ? 'badge-error' : 'badge-info'
                                        }`}>
                                            {isSuccessStatus(tx.status) ? 'Success' :
                                            isFailedStatus(tx.status) ? 'Failed' : tx.status
                                            }
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => openDetailsModal(tx)}
                                            className="btn btn-sm btn-outline btn-info"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && selectedTransaction && (
                <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Transaction Details</h2>
                        <div className="space-y-3 text-gray-700">
                            <p><strong>Transaction ID:</strong> {selectedTransaction.transactionId || 'N/A'}</p>
                            <p><strong>User Email:</strong> {selectedTransaction.email || 'N/A'}</p>
                            <p><strong>Policy Name:</strong> {selectedTransaction.policyName || 'N/A'}</p>
                            <p><strong>Paid Amount:</strong> BDT {selectedTransaction.premiumAmount ? selectedTransaction.premiumAmount.toFixed(2) : '0.00'}</p>
                            <p><strong>Date:</strong> {new Date(selectedTransaction.paymentDate).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span className={`badge ${
                                isSuccessStatus(selectedTransaction.status) ? 'badge-success' :
                                isFailedStatus(selectedTransaction.status) ? 'badge-error' :
                                'badge-info'
                            }`}>
                                {isSuccessStatus(selectedTransaction.status) ? 'Success' :
                                isFailedStatus(selectedTransaction.status) ? 'Failed' :
                                selectedTransaction.status
                                }
                            </span></p>
                            <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod || 'Stripe'}</p>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={closeDetailsModal}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTransactions;