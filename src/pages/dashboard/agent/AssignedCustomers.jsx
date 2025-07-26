import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaEye, FaCheck, FaTimes, FaEnvelope, FaCalendarAlt, FaUser, FaFileAlt } from 'react-icons/fa';
import { MdEmail, MdAssignment } from "react-icons/md";
import Swal from 'sweetalert2';

const AssignedCustomers = () => {
    const { user, loading: userLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [assignedApplications, setAssignedApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    useEffect(() => {
        if (userLoading) return;
        if (!user?.email) {
            setLoading(false);
            return;
        }

        const assignedApplicationData = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get('/agent/assigned-applications');
                setAssignedApplications(res.data || []);
            } catch (err) {
                console.log(err);
                Swal.fire({
                    title: 'Error', 
                    text: 'Failed to load assigned applications',
                    icon: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        assignedApplicationData();
    }, [user, userLoading, axiosSecure]);

    const handleStatusChange = async (appId, newStatus) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${newStatus} this application?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${newStatus}!`
        });

        if (!result.isConfirmed) return;

        setUpdatingStatusId(appId);
        try {
            const response = await axiosSecure.patch(`/applications/status/${appId}`, { status: newStatus });

            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    title: 'Success!', 
                    text: `Application ${newStatus} successfully!`, icon: 'success'
                });
                setAssignedApplications(prev => prev.map(app =>
                    app._id === appId ? { ...app, status: newStatus } : app
                ));
            } else {
                Swal.fire('Info', 'No changes were made to the application', 'info');
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: 'Error', 
                text: `Failed to ${newStatus} application`, 
                icon: 'error'
            });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleEmailCustomer = (email) => {
        window.location.href = `mailto:${email}?subject=Regarding Your Policy Application&body=Dear Customer,`;
    };

    if (userLoading || loading) return <Spinner />;

    return (
        <div className="md:p-6 bg-gray-50">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Assigned Applications</h2>
                        <p className="text-gray-600">Manage your assigned policy applications</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total Assigned: <span className="font-semibold">{assignedApplications.length}</span>
                    </div>
                </div>

                {assignedApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaFileAlt className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications assigned</h3>
                        <p className="text-gray-500">New applications will appear here when assigned</p>
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
                                        Applied On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {assignedApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{app.applicantName || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <MdEmail className="mr-1 text-gray-400" />
                                                        {app.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.policyName || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <FaCalendarAlt className="inline mr-1 text-gray-400" />
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            app.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setSelectedApplication(app)}
                                                    className="flex items-center gap-2 btn px-3 bg-blue-500 hover:bg-blue-600 text-white"
                                                >
                                                    <FaEye /> <span>View</span>
                                                </button>
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(app._id, 'approved')}
                                                            className="flex items-center gap-2 btn px-3 bg-green-500 hover:bg-green-600 text-white"
                                                            disabled={updatingStatusId === app._id}
                                                        >
                                                            <FaCheck /> <span>{updatingStatusId === app._id ? 'Processing...' : 'Approve'}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(app._id, 'rejected')}
                                                            className="flex items-center gap-2 btn px-3 bg-red-500 hover:bg-red-600 text-white"
                                                            disabled={updatingStatusId === app._id}
                                                        >
                                                            <FaTimes /> <span>{updatingStatusId === app._id ? 'Processing...' : 'Reject'}</span>
                                                        </button>
                                                    </>
                                                )}
                                                {(app.status === 'approved' || app.status === 'paid' || app.status === 'rejected') && (
                                                    <button
                                                        onClick={() => handleEmailCustomer(app.email)}
                                                        className="flex items-center gap-2 btn px-3 bg-purple-500 hover:bg-purple-600 text-white"
                                                    >
                                                        <FaEnvelope /> <span>Email</span>
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
            </div>

            {selectedApplication && (
                <dialog open className="modal sm:modal-middle">
                    <div className="modal-box max-w-3xl w-full max-h-[90vh] p-0 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                            <h3 className="font-bold text-xl">Application Details</h3>
                            <button
                                className="btn btn-sm btn-circle absolute right-2 top-2 bg-white/10 border-none hover:bg-white/20"
                                onClick={() => setSelectedApplication(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                        <FaUser className="mr-2 text-blue-500" />
                                        Applicant Information
                                    </h4>
                                    <div className="space-y-3">
                                        <Details icon={<FaUser />} label="Name" value={selectedApplication.applicantName || 'N/A'} />
                                        <Details icon={<MdEmail />} label="Email" value={selectedApplication.email || 'N/A'} />
                                        <Details icon={<FaCalendarAlt />} label="Applied On"
                                            value={new Date(selectedApplication.appliedAt).toLocaleString()} />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                        <FaFileAlt className="mr-2 text-blue-500" />
                                        Policy Information
                                    </h4>
                                    <div className="space-y-3">
                                        <Details icon={<FaFileAlt />} label="Policy Name" value={selectedApplication.policyName || 'N/A'} />
                                        <Details icon={<FaFileAlt />} label="Policy ID" value={selectedApplication.policyId || 'N/A'} />
                                        <Details icon={<MdAssignment />} label="Assigned Agent"
                                            value={selectedApplication.assignedAgent || 'N/A'} />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4">Application Status</h4>
                                    <div className="flex items-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        selectedApplication.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {selectedApplication.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="btn btn-ghost hover:bg-gray-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
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

export default AssignedCustomers;