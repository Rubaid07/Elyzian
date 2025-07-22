import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaTimes, FaEye, FaCalendarAlt, FaUserTie, FaIdCard, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa'; 
import Swal from 'sweetalert2';
import { RiFileUserFill } from 'react-icons/ri';
import { MdAttachMoney, MdEmail, MdHome, MdMedicalServices } from "react-icons/md";
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
    <div className="md:p-6 bg-gray-50 ">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Policy Applications</h2>
            <p className="text-gray-600">Review and manage all policy applications</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaFileAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">When applications are submitted, they will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <RiFileUserFill className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.policyName}</div>
                      <div className="text-sm text-gray-500">ID: {app.policyId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <FaCalendarAlt className="inline mr-1 text-gray-400" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        app.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(app.status === 'pending' || !app.assignedAgent) && app.status !== 'rejected' ? (
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          defaultValue={app.assignedAgent || ""}
                          onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                        >
                          <option disabled value="">Select agent</option>
                          {agents.map(agent => (
                            <option key={agent._id} value={agent.email}>
                              <div className="flex items-center">
                                <FaUserTie className="mr-2" />
                                {agent.name}
                              </div>
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <FaUserTie className="text-gray-400 mr-2" />
                          {agents.find(agent => agent.email === app.assignedAgent)?.name || app.assignedAgent || '—'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {app.status === 'pending' && (
                          <button
                            onClick={() => handleReject(app._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Reject Application"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedApp && (
          <dialog open className="modal sm:modal-middle">
            <div className="modal-box max-w-3xl w-full max-h-[90vh] p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-white">
                <h3 className="font-bold text-xl">Application Details</h3>
                <button 
                  className="btn btn-sm btn-circle absolute right-2 top-2 bg-white/10 border-none hover:bg-white/20"
                  onClick={() => setSelectedApp(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
                <div className="grid grid-cols-1  gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                      <RiFileUserFill className="mr-2 text-blue-500" />
                      Applicant Information
                    </h4>
                    <div className="space-y-3">
                      <Details icon={<RiFileUserFill />} label="Name" value={selectedApp.applicantName} />
                      <Details icon={<MdEmail />} label="Email" value={selectedApp.email} />
                      <Details icon={<MdHome />} label="Address" value={selectedApp.address || 'N/A'} />
                      <Details icon={<FaIdCard />} label="NID/SSN" value={selectedApp.nidSsn || 'N/A'} />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-500" />
                      Policy Information
                    </h4>
                    <div className="space-y-3">
                      <Details icon={<FaFileAlt />} label="Policy Name" value={selectedApp.policyName} />
                      <Details icon={<FaFileAlt />} label="Policy ID" value={selectedApp.policyId} />
                      <Details icon={<FaCalendarAlt />} label="Applied On" 
                        value={new Date(selectedApp.appliedAt).toLocaleString()} />
                      <Details icon={<FaCalendarAlt />} label="Last Updated" 
                        value={selectedApp.updatedAt ? new Date(selectedApp.updatedAt).toLocaleString() : 'N/A'} />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                      <MdMedicalServices className="mr-2 text-blue-500" />
                      Health Information
                    </h4>
                    <div className="space-y-3">
                      <Details icon={<MdMedicalServices />} label="Consumes Alcohol" 
                        value={selectedApp.consumesAlcohol ? 'Yes' : 'No'} />
                      <Details icon={<MdMedicalServices />} label="Hospitalized Before" 
                        value={selectedApp.hasBeenHospitalized ? 'Yes' : 'No'} />
                      <Details icon={<MdMedicalServices />} label="Pre-existing Conditions" 
                        value={selectedApp.hasPreExistingConditions ? 'Yes' : 'No'} />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                      <MdAttachMoney className="mr-2 text-blue-500" />
                      Payment & Nominee
                    </h4>
                    <div className="space-y-3">
                      <Details icon={<RiFileUserFill />} label="Nominee Name" 
                        value={selectedApp.nomineeName || 'N/A'} />
                      <Details icon={<RiFileUserFill />} label="Nominee Relationship" 
                        value={selectedApp.nomineeRelationship || 'N/A'} />
                      <Details icon={<FaMoneyBillWave />} label="Premium Amount" 
                        value={`BDT ${selectedApp.premiumAmount?.toLocaleString()}`} />
                      <Details icon={<FaMoneyBillWave />} label="Payment Frequency" 
                        value={selectedApp.paymentFrequency} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Application Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Current Status</span>
                      <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedApp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedApp.status === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedApp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        selectedApp.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedApp.status}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Assigned Agent</span>
                      <div className="mt-1 flex items-center">
                        <FaUserTie className="text-gray-400 mr-2" />
                        <span>{selectedApp.assignedAgent || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="btn btn-ghost hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

const Details = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

export default ManageApplications;