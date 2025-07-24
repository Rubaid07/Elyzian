import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaFileAlt, FaCalendarAlt, FaUser, FaIdCard } from 'react-icons/fa';
import { MdDescription, MdEmail } from "react-icons/md";
import Spinner from '../../../component/Loader/Spinner';

const ManageClaims = () => {
    const { user, loading } = useAuth();
    const [claims, setClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const backendUrl = import.meta.env.VITE_API_URL;
    console.log(claims);

    useEffect(() => {
        if (!user || loading) return;
        const ClaimsData = async () => {
            try {
                const token = localStorage.getItem('access-token');
                const res = await axios.get(`${backendUrl}/admin/claims`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClaims(res.data || []);
            } catch (err) {
                console.error('Error fetching claims:', err);
                Swal.fire(
                    'Error',
                    err.response?.status === 403
                        ? 'You are not authorized to view claims.'
                        : 'Failed to load claims. Please try again later.',
                    'error'
                );
            } finally {
                setIsLoading(false);
            }
        };

        ClaimsData();
    }, [user, loading, backendUrl]);

    const handleStatusChange = async (claimId, newStatus) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to change this claim status to ${newStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, change to ${newStatus}!`
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('access-token');
                await axios.patch(
                    `${backendUrl}/admin/claims/${claimId}/status`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setClaims(claims.map(claim =>
                    claim._id === claimId ? { ...claim, status: newStatus } : claim
                ));

                Swal.fire('Updated!', `Claim status has been changed to ${newStatus}.`, 'success');
                setSelectedClaim(null);
            } catch (err) {
                console.error('Error updating claim status:', err);
                Swal.fire('Failed!', 'Could not update claim status. Please try again.', 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="md:p-6 bg-gray-50">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Claims Management</h2>
                        <p className="text-gray-600">Review and process insurance claims</p>
                    </div>
                </div>

                {claims.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaFileAlt className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
                        <p className="text-gray-500">When claims are submitted, they will appear here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Claimant
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
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {claims.map((claim) => (
                                    <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{claim.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{claim.policyName || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">ID: {claim.
                                                policyId
                                                || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <FaCalendarAlt className="inline mr-1 text-gray-400" />
                                                {new Date(claim.appliedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setSelectedClaim(claim)}
                                                    className="flex items-center gap-2 btn px-3 bg-blue-500 hover:bg-blue-600 text-white"
                                                >
                                                    <FaEye /> <span>View</span>
                                                </button>
                                                {claim.status.toLowerCase() === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(claim._id, 'approved')}
                                                            className="flex items-center gap-2 btn px-3 bg-green-500 hover:bg-green-600 text-white"
                                                        >
                                                            <FaCheck /> <span>Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(claim._id, 'rejected')}
                                                            className="flex items-center gap-2 btn px-3 bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            <FaTimes /> <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedClaim && (
                    <dialog open className="modal sm:modal-middle">
                        <div className="modal-box max-w-3xl w-full max-h-[90vh] p-0 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                <h3 className="font-bold text-xl">Claim Details</h3>
                                <button
                                    className="btn btn-sm btn-circle absolute right-2 top-2 bg-white/10 border-none hover:bg-white/20"
                                    onClick={() => setSelectedClaim(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                            <FaUser className="mr-2 text-blue-500" />
                                            Claimant Information
                                        </h4>
                                        <div className="space-y-3">
                                            <Details icon={<MdEmail />} label="Email" value={selectedClaim.userEmail} />
                                            <Details icon={<FaIdCard />} label="Policy Id" value={selectedClaim.
                                                policyId
                                                || 'N/A'} />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                            <FaFileAlt className="mr-2 text-blue-500" />
                                            Claim Details
                                        </h4>
                                        <div className="space-y-3">
                                            <Details icon={<FaFileAlt />} label="Policy Name" value={selectedClaim.policyName || 'N/A'} />
                                            <Details icon={<FaCalendarAlt />} label="Applied On"
                                                value={new Date(selectedClaim.appliedAt).toLocaleString()} />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                            <MdDescription className="mr-2 text-blue-500" />
                                            Claim Reason
                                        </h4>
                                        <div className="p-3 bg-white rounded-md border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedClaim.reason}</p>
                                        </div>
                                    </div>

                                    {selectedClaim.documents?.length > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                                <FaFileAlt className="mr-2 text-blue-500" />
                                                Supporting Documents
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {selectedClaim.documents.map((doc, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={doc}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 truncate flex items-center"
                                                    >
                                                        <FaFileAlt className="mr-2 text-gray-400 flex-shrink-0" />
                                                        <span className="truncate">Document {idx + 1}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4">Claim Status</h4>
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)}`}>
                                            {selectedClaim.status}
                                        </span>
                                        {selectedClaim.status.toLowerCase() === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleStatusChange(selectedClaim._id, 'approved')}
                                                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                                                >
                                                    Approve Claim
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(selectedClaim._id, 'rejected')}
                                                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                                >
                                                    Reject Claim
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-action sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={() => setSelectedClaim(null)}
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

export default ManageClaims;