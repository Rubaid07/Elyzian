import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Spinner from '../../../component/Loader/Spinner';

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get('/admin/agent-applications')
      .then(res => setApplications(res.data || []))
      .catch(err => console.error('Failed to load applications:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosSecure.patch(`/admin/agent-applications/${id}`, { status });
      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'}`);
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Spinner></Spinner>

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Manage Agent Applications</h2>

      {applications.length === 0 ? (
        <p>No agent applications available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Applied At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="">
                  <td>
                    <img
                      src={app.photo || 'https://i.ibb.co/5GzXkwq/user.png'}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td className="capitalize">{app.status}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'approved')}
                      disabled={app.status !== 'pending'}
                      className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      disabled={app.status !== 'pending'}
                      className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                    >
                      <FaTimesCircle /> Reject
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

export default ManageApplications;
