import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AssignedCustomers = () => { 
    const { user, loading: userLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [assignedApplications, setAssignedApplications] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null); 

    useEffect(() => {
        if (userLoading) {
            return;
        }
        if (!user || !user.email) {
            setLoading(false);
            return;
        }

        const fetchAssignedApplications = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosSecure.get(`/agent/assigned-applications`);
                setAssignedApplications(res.data || []);
            } catch (err) {
                console.error("Error fetching assigned applications:", err);
                setError("Failed to load assigned applications. Please try again.");
                toast.error("Failed to load assigned applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedApplications();
    }, [user, userLoading, axiosSecure]);

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        Swal.fire({
            title: `<span style="color: #1a202c;">Application Details</span>`,
            html: `
                <div style="text-align: left; font-size: 1.1em; color: #4a5568;">
                    <p><strong>Applicant Name:</strong> ${application.applicantName || 'N/A'}</p>
                    <p><strong>Email:</strong> ${application.email || 'N/A'}</p>
                    <p><strong>Policy ID:</strong> ${application.policyId || 'N/A'}</p>
                    <p><strong>Address:</strong> ${application.address || 'N/A'}</p>
                    <p><strong>NID/SSN:</strong> ${application.nidSsn || 'N/A'}</p>
                    <p><strong>Nominee Name:</strong> ${application.nomineeName || 'N/A'}</p>
                    <p><strong>Nominee Relation:</strong> ${application.nomineeRelationship || 'N/A'}</p>
                    <p><strong>Pre-Existing Conditions:</strong> ${application.hasPreExistingConditions ? 'Yes' : 'No'}</p>
                    <p><strong>Been Hospitalized:</strong> ${application.hasBeenHospitalized ? 'Yes' : 'No'}</p>
                    <p><strong>Consumes Alcohol:</strong> ${application.consumesAlcohol ? 'Yes' : 'No'}</p>
                    <p><strong>Applied Date:</strong> ${new Date(application.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span style="font-weight: bold; color: ${
                        application.status === 'pending' ? '#3182ce' :
                        application.status === 'approved' ? '#38a169' :
                        application.status === 'rejected' ? '#e53e3e' :
                        '#718096'
                    };">${application.status || 'N/A'}</span></p>
                    <p><strong>Assigned Agent:</strong> ${application.assignedAgent || 'N/A'}</p>
                </div>
            `,
            icon: 'info',
            showConfirmButton: true,
            confirmButtonText: 'Got It',
            customClass: {
                popup: 'shadow-lg rounded-lg',
                title: 'text-2xl font-bold mb-4',
                content: 'text-left',
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            },
            width: 600,
            padding: '2em',
            background: '#ffffff',
        }).then(() => {
            setSelectedApplication(null);
        });
    };

    const handleEmailCustomer = (email) => {
        window.location.href = `mailto:${email}?subject=Regarding Your Policy Application&body=Dear Customer,`;
    };

    if (userLoading || loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
            </div>
        );
    }

    if (assignedApplications.length === 0) {
        return (
            <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
                <p className="text-xl font-semibold mb-4">No policy applications have been assigned to you yet.</p>
                <p>New applications will appear here once assigned by an admin.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Assigned Policy Applications</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Applicant Name</th>
                            <th>Applicant Email</th>
                            <th>Policy Title</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedApplications.map((app, index) => (
                            <tr key={app._id}>
                                <th>{index + 1}</th>
                                <td>{app.applicantName || 'N/A'}</td>
                                <td>{app.email || 'N/A'}</td>
                                <td>{app.policyName || 'N/A'}</td>
                                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${
                                        app.status === 'pending' ? 'badge-info' :
                                        app.status === 'approved' ? 'badge-success' :
                                        app.status === 'rejected' ? 'badge-error' :
                                        'badge-neutral'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => handleViewDetails(app)}
                                        className="btn btn-sm btn-outline btn-info"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleEmailCustomer(app.email)}
                                        className="btn btn-sm btn-outline btn-primary" 
                                    >
                                        Email
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedCustomers;