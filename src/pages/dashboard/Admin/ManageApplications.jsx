import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaTimes, FaEye } from 'react-icons/fa'; 
import Swal from 'sweetalert2';

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplicationsAndAgents = async () => {
    setLoading(true);
    try {
      const [appsRes, agentsRes] = await Promise.all([
        axiosSecure.get('/admin/policy-applications'),
        axiosSecure.get('/admin/agents')
      ]);
      setApplications(appsRes.data || []);
      setAgents(agentsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      Swal.fire('Error', 'Failed to load applications. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsAndAgents();
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
        const res = await axiosSecure.patch(`/admin/policy-applications/${id}`, { status: 'rejected' });
        if(res.data.modifiedCount > 0) {
            setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
            Swal.fire({
              title: 'Rejected!',
              text: 'The application has been rejected.',
              icon: 'success'
            });
        } else {
            Swal.fire('Info', 'Application already rejected or no changes made.', 'info');
        }
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
    if (!agentEmail) {
      Swal.fire('Warning', 'Please select an agent to assign.', 'warning');
      return;
    }
    try {
      const res = await axiosSecure.patch(`/admin/policy-applications/${appId}`, {
        assignedAgent: agentEmail
      });
      if(res.data.modifiedCount > 0) {
          setApplications(prev =>
            prev.map(app => app._id === appId ? { ...app, assignedAgent: agentEmail } : app)
          );
          Swal.fire('Assigned!', 'Agent assigned successfully.', 'success');
      } else {
          Swal.fire('Info', 'Agent already assigned or no changes made.', 'info');
      }
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
                    <td className="capitalize">
                      <span className={`badge ${
                          app.status === 'pending' ? 'badge-info' :
                          app.status === 'approved' ? 'badge-success' :
                          app.status === 'rejected' ? 'badge-error' :
                          app.status === 'paid' ? 'badge-primary' :
                          'badge-neutral'
                      }`}>
                          {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'pending' || !app.assignedAgent ? (
                        <select
                          className="select select-sm select-bordered"
                          defaultValue={app.assignedAgent || ""} 
                          onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                        >
                          <option disabled value="">Select agent</option>
                          {agents.map(agent => (
                            <option key={agent._id} value={agent.email}>{agent.name}</option>
                          ))}
                        </select>
                      ) : (
                        agents.find(agent => agent.email === app.assignedAgent)?.name || app.assignedAgent
                      )}
                    </td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn btn-sm bg-sky-600 text-white hover:bg-sky-700"
                      >
                        <FaEye /> View
                      </button>
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleReject(app._id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          <FaTimes /> Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
      {selectedApp && (
        <dialog open className="modal modal-open">
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