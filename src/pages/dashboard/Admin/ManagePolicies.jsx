import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManagePolicies = () => {
  const axiosSecure = useAxiosSecure();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get('/admin/policies')
      .then(res => setPolicies(res.data || []))
      .catch(err => console.error('Error fetching policies:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this policy?');
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/admin/policies/${id}`);
      setPolicies(prev => prev.filter(policy => policy._id !== id));
      toast.success('Policy deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete policy');
    }
  };

  if (loading) return <div className="text-center py-10">Loading policies...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Manage Policies</h2>

      {policies.length === 0 ? (
        <p>No policies available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="bg-sky-100 text-gray-700">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Premium</th>
                <th>Coverage</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(policy => (
                <tr key={policy._id} className="hover:bg-gray-50">
                  <td>{policy.name}</td>
                  <td>{policy.type}</td>
                  <td>${policy.premium}</td>
                  <td>${policy.coverage}</td>
                  <td>{policy.duration} years</td>
                  <td>{policy.status}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs bg-yellow-500 hover:bg-yellow-600 text-white">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(policy._id)}
                      className="btn btn-xs bg-red-500 hover:bg-red-600 text-white"
                    >
                      <FaTrashAlt />
                    </button>
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

export default ManagePolicies;