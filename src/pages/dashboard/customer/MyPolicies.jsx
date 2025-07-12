import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';

const MyPolicies = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/policies/my?email=${user.email}`)
        .then(res => setPolicies(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, axiosSecure]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">My Policies</h2>

      {policies.length === 0 ? (
        <p className="text-gray-600">You haven't purchased any policies yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th>Policy Name</th>
                <th>Policy Number</th>
                <th>Coverage</th>
                <th>Premium</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-50 text-sm">
                  <td className="py-2">{policy.policyName}</td>
                  <td>{policy.policyNumber}</td>
                  <td>{policy.coverageAmount} ৳</td>
                  <td>{policy.premiumAmount} ৳</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : policy.status === 'expired'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
