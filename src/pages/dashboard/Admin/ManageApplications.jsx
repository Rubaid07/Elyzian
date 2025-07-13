import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaTimes, FaUserCheck, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    Promise.all([
      axiosSecure.get('/admin/policy-applications'),
      axiosSecure.get('/admin/agents')
    ])
      .then(([appsRes, agentsRes]) => {
        setApplications(appsRes.data || []);
        setAgents(agentsRes.data || []);
      })
      .catch(err => console.error('Failed to fetch data:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This will reject the application.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, reject it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/policy-applications/${id}`, { status: 'rejected' });
        setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
        Swal.fire({
          title: 'Rejected!',
          text: 'The application has been rejected.', 
          icon: 'success'
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error', 
          text: 'Failed to reject application', 
          icon: 'error'
        });
      }
    }
  };

  const handleAssignAgent = async (appId, agentEmail) => {
    try {
      await axiosSecure.patch(`/admin/policy-applications/${appId}`, {
        status: 'approved',
        assignedAgent: agentEmail
      });
      setApplications(prev =>
        prev.map(app => app._id === appId ? { ...app, status: 'approved', assignedAgent: agentEmail } : app)
      );
      Swal.fire('Assigned!', 'Agent assigned and application approved.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to assign agent', 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 bg-white rounded shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Manage Policy Applications</h2>
      {applications.length === 0 ? (
        <p>No Application found.</p>
      ) : (
         <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>Applicant</th>
              <th>Email</th>
              <th>Policy</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Assign Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.applicantName}</td>
                <td>{app.email}</td>
                <td>{app.policyName}</td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td className="capitalize">{app.status}</td>
                <td>
                  {app.status === 'pending' ? (
                    <select
                      className="select select-sm select-bordered"
                      defaultValue=""
                      onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                    >
                      <option disabled value="">Select agent</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent.email}>{agent.name}</option>
                      ))}
                    </select>
                  ) : (
                    app.assignedAgent || '—'
                  )}
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="btn btn-sm bg-sky-600 text-white hover:bg-sky-700"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => handleReject(app._id)}
                    disabled={app.status !== 'pending'}
                    className="btn btn-sm btn-error text-white"
                  >
                    <FaTimes /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {selectedApp && (
        <dialog open className="modal">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Application Details</h3>
            <p><strong>Name:</strong> {selectedApp.applicantName}</p>
            <p><strong>Email:</strong> {selectedApp.email}</p>
            <p><strong>Policy:</strong> {selectedApp.policyName}</p>
            <p><strong>Applied On:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedApp.status}</p>
            <p><strong>Assigned Agent:</strong> {selectedApp.assignedAgent || '—'}</p>
            <p><strong>Additional Info:</strong> {selectedApp.additionalInfo || 'N/A'}</p>

            <div className="modal-action">
              <form method="dialog">
                <button onClick={() => setSelectedApp(null)} className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageApplications;
