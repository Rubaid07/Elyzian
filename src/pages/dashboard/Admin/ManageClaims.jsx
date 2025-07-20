import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageClaims = () => {
    const { user, loading } = useAuth();
    const [claims, setClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const backendUrl = import.meta.env.VITE_API_URL; 
    console.log(claims);

    useEffect(() => {
        if (!user || loading) return;

        const fetchClaims = async () => {
            try {
                const token = localStorage.getItem('access-token');
                if (!token) {
                    setError('No authentication token found. Please log in.');
                    setIsLoading(false);
                    return;
                }

                const res = await axios.get(`${backendUrl}/admin/claims`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClaims(res.data);
            } catch (err) {
                console.error('Error fetching claims:', err);
                if (err.response && err.response.status === 403) {
                    setError('You are not authorized to view claims.');
                } else {
                    setError('Failed to load claims. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchClaims();
    }, [user, loading, backendUrl]);

    // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার
    const handleStatusChange = async (claimId, newStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to change this claim status to ${newStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, change to ${newStatus}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('access-token');
                    await axios.patch(`${backendUrl}/admin/claims/${claimId}/status`,
                        { status: newStatus },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                        }
                    );
                    setClaims(claims.map(claim =>
                        claim._id === claimId ? { ...claim, status: newStatus } : claim
                    ));
                    Swal.fire(
                        'Updated!',
                        `Claim status has been changed to ${newStatus}.`,
                        'success'
                    );
                    setIsModalOpen(false); // স্ট্যাটাস আপডেটের পর মোডাল বন্ধ করুন
                } catch (err) {
                    console.error('Error updating claim status:', err);
                    Swal.fire(
                        'Failed!',
                        'Could not update claim status. Please try again.',
                        'error'
                    );
                }
            }
        });
    };

    // Modal ওপেন করার জন্য
    const handleViewDetails = (claim) => {
        setSelectedClaim(claim);
        setIsModalOpen(true);
    };

    // Modal বন্ধ করার জন্য
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClaim(null);
    };

    // স্ট্যাটাস ব্যাজ কালার
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'badge-warning'; // Yellow
            case 'approved':
                return 'badge-success'; // Green
            case 'rejected':
                return 'badge-error';   // Red
            case 'under_review':
                return 'badge-info';    // Blue
            default:
                return 'badge-ghost';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10 text-xl">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* <Helmet>
                <title>Admin Dashboard | Manage Claims</title>
            </Helmet> */}
            <h2 className="text-3xl font-bold text-center mb-6">Manage All Claims</h2>

            {claims.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-lg">No claims found.</div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="table w-full">
                        {/* head */}
                        <thead>
                            <tr className="bg-base-200">
                                <th>#</th>
                                <th>Claimant Email</th>
                                <th>Policy Name</th>
                                <th>Reason</th>
                                <th>Applied At</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim, index) => (
                                <tr key={claim._id}>
                                    <th>{index + 1}</th>
                                    <td>{claim.email}</td>
                                    <td>{claim.policyName || 'N/A'}</td> 
                                    <td>{claim.reason.substring(0, 50)}{claim.reason.length > 50 ? '...' : ''}</td>
                                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(claim.status)} badge-lg text-white`}>
                                            {claim.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleViewDetails(claim)}
                                            className="btn btn-sm btn-info text-white mr-2"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Claim Details Modal */}
            {isModalOpen && selectedClaim && (
                <dialog id="claim_details_modal" className="modal modal-open" open>
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-2xl mb-4">Claim Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                            <p><strong>Claim ID:</strong> {selectedClaim._id}</p>
                            <p><strong>Claimant Email:</strong> {selectedClaim.userEmail}</p>
                            <p><strong>Policy Name:</strong> {selectedClaim.policyName || 'N/A'}</p>
                            <p><strong>Policy Number:</strong> {selectedClaim.policyNumber || 'N/A'}</p> {/* যদি থাকে */}
                            <p><strong>Applied At:</strong> {new Date(selectedClaim.appliedAt).toLocaleString()}</p>
                            <p><strong>Current Status:</strong>
                                <span className={`badge ${getStatusColor(selectedClaim.status)} badge-lg ml-2 text-white`}>
                                    {selectedClaim.status.replace(/_/g, ' ')}
                                </span>
                            </p>
                            {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                                <p className="col-span-1 md:col-span-2">
                                    <strong>Documents:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                        {selectedClaim.documents.map((doc, idx) => (
                                            <li key={idx}>
                                                <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    {doc.length > 60 ? `${doc.substring(0, 60)}...` : doc}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </p>
                            )}
                            <p className="col-span-1 md:col-span-2">
                                <strong>Reason for Claim:</strong> <br />
                                <span className="text-gray-700 whitespace-pre-wrap">{selectedClaim.reason}</span>
                            </p>
                        </div>

                        <div className="modal-action flex flex-col md:flex-row justify-between items-center mt-6">
                            <div className="flex gap-2 mb-4 md:mb-0">
                                <button onClick={() => handleStatusChange(selectedClaim._id, 'approved')} className="btn btn-success text-white">Approve</button>
                                <button onClick={() => handleStatusChange(selectedClaim._id, 'rejected')} className="btn btn-error text-white">Reject</button>
                                <button onClick={() => handleStatusChange(selectedClaim._id, 'under_review')} className="btn btn-info text-white">Under Review</button>
                                <button onClick={() => handleStatusChange(selectedClaim._id, 'pending')} className="btn btn-warning text-white">Set to Pending</button>
                            </div>
                            <button onClick={handleCloseModal} className="btn">Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default ManageClaims;