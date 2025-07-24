import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
  const [tabIndex, setTabIndex] = useState(0);

  const AgentData = () => {
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
    AgentData();
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
        AgentData();
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
        AgentData();
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
          AgentData();
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
      <div className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agent Management</h2>
          <p className="text-gray-500">Manage agent applications and existing agents</p>
        </div>
      </div>

      <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <TabList className="flex bg-gray-100 p-1 rounded-lg mb-6 border-b border-gray-200 react-tabs__tab-list">
          <Tab
            className="text-center py-2 px-4 cursor-pointer flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-lg mr-1
                       hover:bg-gray-200 react-tabs__tab"
            selectedClassName="bg-white shadow-sm text-gray-800 react-tabs__tab--selected"
          >
            <MdPendingActions className="mr-2" />
            Pending Applications ({pendingApplications.length})
          </Tab>
          <Tab
            className="text-center py-2 px-4 cursor-pointer flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-lg
                       hover:bg-gray-200 react-tabs__tab"
            selectedClassName="bg-white shadow-sm text-gray-800 react-tabs__tab--selected"
          >
            <FaUserTie className="mr-2" />
            Active Agents ({agents.length})
          </Tab>
        </TabList>

        <TabPanel>
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
                <table className="table w-full">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="font-medium px-4 py-2">Applicant</th>
                      <th className="font-medium px-4 py-2">Email</th>
                      <th className="font-medium px-4 py-2">Applied On</th>
                      <th className="font-medium text-right px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingApplications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10">
                                <img src={app.photo || 'https://i.ibb.co/5GzXkwq/user.png'} alt="Avatar" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{app.name || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-gray-600 px-4 py-2">{app.email}</td>
                        <td className="px-4 py-2">
                          <span className="badge badge-ghost badge-sm">
                            {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() :
                              app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleApproveAgent(app._id, app.email)}
                              className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                            >
                              <FaUserCheck className="mr-1" /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectAgent(app._id)}
                              className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
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
        </TabPanel>

        <TabPanel>
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
                <table className="table w-full">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="font-medium px-4 py-2">Agent</th>
                      <th className="font-medium px-4 py-2">Email</th>
                      <th className="font-medium px-4 py-2">Joined</th>
                      <th className="font-medium text-right px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {agents.map(agent => (
                      <tr key={agent._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10">
                                <img src={agent.photo || 'https://i.ibb.co/5GzXkwq/user.png'} alt="Avatar" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{agent.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">Agent</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-gray-600 px-4 py-2">{agent.email}</td>
                        <td className="px-4 py-2">
                          <span className="badge badge-ghost badge-sm">
                            {new Date(agent.createdAt || agent._id?.getTimestamp?.()).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex justify-end space-x-2">
                            <a
                              href={`mailto:${agent.email}`}
                              className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                            >
                              <FaEnvelope className="mr-1" /> Email
                            </a>
                            <button
                              onClick={() => handleDeleteAgent(agent.email)}
                              className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
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
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ManageAgents;