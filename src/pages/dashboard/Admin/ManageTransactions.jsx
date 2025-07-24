import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaMoneyBillWave, FaInfoCircle, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { MdPayment, MdEmail, MdAssignment } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import Swal from 'sweetalert2';
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
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const [stats, setStats] = useState({
    totalIncome: 0,
    successfulCount: 0,
    failedCount: 0
  });

  const successStatus = (status) => ['completed', 'paid', 'success', 'succeeded'].includes(status?.toLowerCase());
  const isFailedStatus = (status) => ['failed', 'canceled', 'rejected'].includes(status?.toLowerCase());

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get('/admin/transactions');
      const TransactionsData = res.data || [];
      setTransactions(TransactionsData);
      const income = TransactionsData.reduce((sum, tx) => 
        successStatus(tx.status) ? sum + (Number(tx.premiumAmount) || 0) : sum, 0);
      const successCount = TransactionsData.filter(tx => successStatus(tx.status)).length;
      const failCount = TransactionsData.filter(tx => isFailedStatus(tx.status)).length;

      setStats({
        totalIncome: income,
        successfulCount: successCount,
        failedCount: failCount
      });

    } catch (err) {
      console.error("Error fetching transactions:", err);
      Swal.fire('Error', 'Failed to load transactions. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openDetailsModal = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const earningTimeData = () => {
    const dailyEarnings = transactions.reduce((acc, tx) => {
      if (successStatus(tx.status) && tx.paymentDate && tx.premiumAmount) {
        const date = new Date(tx.paymentDate).toLocaleDateString();
        const amount = Number(tx.premiumAmount) || 0;
        acc[date] = (acc[date] || 0) + amount;
      }
      return acc;
    }, {});

    return Object.keys(dailyEarnings).map(date => ({
      date,
      earnings: dailyEarnings[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  if (loading) return <Spinner />;

  return (
    <div className="md:p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Transaction Management</h2>
            <p className="text-gray-600">View and analyze all payment transactions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaMoneyBillWave className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="text-2xl font-semibold text-gray-800">
                  BDT {stats.totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <MdPayment className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Successful Payments</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.successfulCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <RiRefund2Fill className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Failed Payments</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.failedCount}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-blue-500 mr-2 text-xl" />
            <h3 className="text-xl font-semibold text-gray-800">Earnings Over Time</h3>
          </div>
          
          {earningTimeData().length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningTimeData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    tickFormatter={(value) => `BDT ${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`BDT ${value.toFixed(2)}`, "Earnings"]}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }}
                    name="Earnings" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No transaction data available for the chart</p>
            </div>
          )}
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MdPayment className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">When transactions occur, they will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tx.transactionId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tx.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tx.policyName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        BDT {tx.premiumAmount ? tx.premiumAmount.toFixed(2) : '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <FaCalendarAlt className="inline mr-1 text-gray-400" />
                        {new Date(tx.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        successStatus(tx.status) ? 'bg-green-100 text-green-800' :
                        isFailedStatus(tx.status) ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {successStatus(tx.status) ? 'Success' :
                         isFailedStatus(tx.status) ? 'Failed' : tx.status}
                      </span>
                    </td>
                    <td className="py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openDetailsModal(tx)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-2 btn"
                      >
                        <FaInfoCircle className="text-lg" /> <p>Details</p>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTransaction && (
          <dialog open className="modal sm:modal-middle">
            <div className="modal-box max-w-2xl w-full max-h-[90vh] p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h3 className="font-bold text-xl">Transaction Details</h3>
                <button
                  className="btn btn-sm btn-circle absolute right-2 top-2 bg-white/10 border-none hover:bg-white/20"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                      <MdAssignment className="mr-2 text-blue-500" />
                      Transaction Info
                    </h4>
                    <div className="space-y-3">
                      <Details icon={<MdAssignment />} label="Transaction ID" value={selectedTransaction.transactionId || 'N/A'} />
                      <Details icon={<MdPayment />} label="Amount" value={`BDT ${selectedTransaction.premiumAmount?.toFixed(2) || '0.00'}`} />
                      <Details icon={<FaCalendarAlt />} label="Date" value={new Date(selectedTransaction.paymentDate).toLocaleString()} />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                      <MdEmail className="mr-2 text-blue-500" />
                      User & Policy
                    </h4>
                    <div className="space-y-3">
                      <Details icon={<MdEmail />} label="User Email" value={selectedTransaction.email || 'N/A'} />
                      <Details icon={<MdAssignment />} label="Policy Name" value={selectedTransaction.policyName || 'N/A'} />
                      <Details icon={<MdPayment />} label="Payment Method" value={selectedTransaction.paymentMethod || 'Stripe'} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Status</h4>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      successStatus(selectedTransaction.status) ? 'bg-green-100 text-green-800' :
                      isFailedStatus(selectedTransaction.status) ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {successStatus(selectedTransaction.status) ? 'Success' :
                       isFailedStatus(selectedTransaction.status) ? 'Failed' : 
                       selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-action sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="btn btn-ghost hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

const Details = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

export default ManageTransactions;