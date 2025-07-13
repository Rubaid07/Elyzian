import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';

const AssignedCustomers = () => {
  const axiosSecure = useAxiosSecure();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get('/agent/assigned-customers')
      .then(res => setCustomers(res.data || []))
      .catch(err => console.error('Failed to fetch customers:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Assigned Customers</h2>

      {customers.length === 0 ? (
        <p>No customers assigned to you yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-sky-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{customer.name || 'N/A'}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>{new Date(customer.assignedAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedCustomers;
