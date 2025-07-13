import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const ManageAgents = () => {
  const axiosSecure = useAxiosSecure();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = () => {
    axiosSecure.get('/admin/agents')
      .then(res => setAgents(res.data || []))
      .catch(err => console.error('Failed to fetch agents:', err))
      .finally(() => setLoading(false));
  };

  const handleApprove = (id) => {
    Swal.fire({
      title: 'Approve this agent?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/admin/agents/approve/${id}`)
          .then(res => {
            if (res.data.modifiedCount > 0) {
              fetchAgents();
              Swal.fire({
                title: 'Approved!',
                text: 'Agent has been approved.',
                icon: 'success'
              })
            }
          })
          .catch(() => {
            Swal.fire('Failed', 'Could not approve agent.', 'error');
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Remove this agent?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/admin/agents/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              setAgents(prev => prev.filter(agent => agent._id !== id));
              Swal.fire('Removed!', 'Agent has been removed.', 'success');
            }
          })
          .catch(() => {
            Swal.fire('Failed', 'Could not remove agent.', 'error');
          });
      }
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Manage Agents</h2>

      {agents.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => (
                <tr key={agent._id}>
                  <td>{i + 1}</td>
                  <td>{agent.name || 'N/A'}</td>
                  <td>{agent.email}</td>
                  <td>
                    {agent.status === 'approved' ? (
                      <span className="text-green-600 font-medium">Approved</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="flex gap-2">
                    {agent.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(agent._id)}
                        className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      <FaTrashAlt /> Remove
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

export default ManageAgents;