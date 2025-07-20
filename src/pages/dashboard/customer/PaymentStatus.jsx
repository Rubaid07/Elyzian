import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { useNavigate } from 'react-router';

const PaymentStatus = () => {
  const { user, loading: userLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(transactions);

 useEffect(() => {
    if (user?.email) {
        axiosSecure.get(`/payments/status?email=${user.email}`)
            .then(res => {
                console.log("Payments status data from API:", res.data); 
                setTransactions(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching payment status:", error); 
                setLoading(false);
            });
    } else {
        setLoading(false);
    }
}, [axiosSecure, user]);


  const handleMakePayment = (transaction) => {
    navigate(`/dashboard/payment-status/payment/${transaction._id}`, {
      state: {
        policyId: transaction.policyId,
        premiumAmount: transaction.premiumAmount,
        paymentFrequency: transaction.paymentFrequency,
        policyName: transaction.policyName
      }
    });
  };

  if (userLoading || loading) return <Spinner />;
  if (error) {
    return (
      <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
        <p className="text-lg mb-4">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
        <p className="text-xl font-semibold mb-4">No payment information found.</p>
        <p>It looks like you don't have any transactions yet.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Payment Status</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th>#</th>
              <th>Policy Title</th>
              <th>Premium Amount</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction._id} className="hover:bg-gray-50 text-sm">
                <td>{index + 1}</td>
                <td>{transaction.policyName || 'N/A'}</td>
                <td>
                  {transaction.premiumAmount
                    ? `BDT ${transaction.premiumAmount.toLocaleString()}`
                    : 'N/A'}
                </td>
                <td>{transaction.paymentFrequency || 'N/A'}</td>
                 <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.paymentStatus?.toLowerCase() === 'paid'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {transaction.paymentStatus}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleMakePayment(transaction)}
                    className="btn btn-xs btn-primary bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={transaction.paymentStatus === 'Paid'} 
                  >
                    {transaction.paymentStatus === 'Paid' ? 'Paid' : 'Make Payment'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStatus;