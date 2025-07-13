import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaTrashAlt, FaUserCheck, FaEnvelope, FaTimes, FaUserTie } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import Swal from 'sweetalert2';

const ManageAgents = () => {
  const axiosSecure = useAxiosSecure();
  const [agents, setAgents] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchAgentData = () => {
    Promise.all([
      axiosSecure.get('/admin/agents'), 
      axiosSecure.get('/admin/agent-applications')
    ])
      .then(([agentsRes, applicationsRes]) => {
        setAgents(agentsRes.data || []);
        setPendingApplications(applicationsRes.data.filter(app => app.status === 'pending') || []);
      })
      .catch(err => console.error('Failed to load agent data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  const handleApproveAgent = async (id, email) => {
    const confirm = await Swal.fire({
      title: 'Approve Agent Application',
      text: "This will grant agent privileges to this user.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.1)'
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/agent-applications/${id}`, { status: 'approved' });
        await axiosSecure.patch(`/users/${email}/role`, { role: 'agent' });
        
        Swal.fire({
          title: 'Approved!',
          text: 'Agent application has been approved.',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
        fetchAgentData();
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to approve agent application.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleRejectAgent = async (id) => { 
    const confirm = await Swal.fire({
      title: 'Reject Application',
      text: "This will reject the agent application.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel',
      background: '#ffffff'
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/agent-applications/${id}`, { status: 'rejected' });
        Swal.fire({
          title: 'Rejected!',
          text: 'Application has been rejected.',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
        fetchAgentData(); 
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to reject application.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleDeleteAgent = (email) => { 
    Swal.fire({
      title: 'Demote Agent',
      text: 'This will remove agent privileges from this user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, demote',
      cancelButtonText: 'Cancel',
      background: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/users/${email}/role`, { role: 'customer' });
          fetchAgentData();
          Swal.fire({
            title: 'Demoted!',
            text: 'User has been demoted to customer.',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: 'Failed to demote user.',
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
        }
      }
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agent Management</h2>
          <p className="text-gray-500">Manage agent applications and existing agents</p>
        </div>
        <div className="flex mt-4 md:mt-0">
          <div className="stats shadow bg-white">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FaUserTie className="text-xl" />
              </div>
              <div className="stat-title">Active Agents</div>
              <div className="stat-value text-primary">{agents.length}</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary">
                <MdPendingActions className="text-xl" />
              </div>
              <div className="stat-title">Pending Applications</div>
              <div className="stat-value text-secondary">{pendingApplications.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs tabs-boxed bg-gray-100 p-1 rounded-lg mb-6">
        <button
          className={`tab ${activeTab === 'pending' ? 'tab-active bg-white shadow-sm' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <MdPendingActions className="mr-2" />
          Pending Applications ({pendingApplications.length})
        </button> 
        <button
          className={`tab ${activeTab === 'agents' ? 'tab-active bg-white shadow-sm' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          <FaUserTie className="mr-2" />
          Active Agents ({agents.length})
        </button>
      </div>

      {activeTab === 'pending' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {pendingApplications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaUserTie className="inline-block text-4xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No pending applications</h3>
              <p className="text-gray-500">When users apply to become agents, their applications will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="font-medium">Applicant</th>
                    <th className="font-medium">Email</th>
                    <th className="font-medium">Applied On</th>
                    <th className="font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingApplications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <img src={app.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="Avatar" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{app.name || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-600">{app.email}</td>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 
                           app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApproveAgent(app._id, app.email)}
                            className="btn btn-sm btn-success text-white"
                          >
                            <FaUserCheck className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectAgent(app._id)}
                            className="btn btn-sm btn-error text-white"
                          >
                            <FaTimes className="mr-1" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {agents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaUserTie className="inline-block text-4xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No active agents</h3>
              <p className="text-gray-500">Approved agents will appear in this list.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="font-medium">Agent</th>
                    <th className="font-medium">Email</th>
                    <th className="font-medium">Joined</th>
                    <th className="font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agents.map(agent => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <img src={agent.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="Avatar" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{agent.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">Agent</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-600">{agent.email}</td>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {new Date(agent.createdAt || agent._id?.getTimestamp?.()).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end space-x-2">
                          <a 
                            href={`mailto:${agent.email}`} 
                            className="btn btn-sm btn-primary text-white"
                          >
                            <FaEnvelope className="mr-1" /> Email
                          </a>
                          <button
                            onClick={() => handleDeleteAgent(agent.email)}
                            className="btn btn-sm btn-error text-white"
                          >
                            <FaTrashAlt className="mr-1" /> Demote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAgents;