import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import toast from 'react-hot-toast';

const MyApplications = () => {
    const { user, loading: loadingUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || loadingUser) {
            setLoadingApplications(false);
            return;
        }

        const fetchMyApplications = async () => {
            setLoadingApplications(true);
            setError(null);
            try {
                const res = await axiosSecure.get(`/applications/my-applications?email=${user.email}`);
                setApplications(res.data);
            } catch (err) {
                console.error("Error fetching my applications:", err);
                setError("Failed to load your applications. Please try again.");
                toast.error("Failed to load your applications.");
            } finally {
                setLoadingApplications(false);
            }
        };

        fetchMyApplications();
    }, [user, loadingUser, axiosSecure]);

    if (loadingUser || loadingApplications) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
                <p className="text-xl font-semibold mb-4">You haven't submitted any policy applications yet.</p>
                <p>Click "Get Quote" on a policy details page to start an application.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Policy Applications</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Policy Title</th>
                            <th>Application Date</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={app._id}>
                                <th>{index + 1}</th>
                                <td>{app.policyTitle || 'N/A'}</td>
                                <td>{new Date(app.submissionDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${
                                        app.status === 'Pending' ? 'badge-info' :
                                        app.status === 'Approved' ? 'badge-success' :
                                        app.status === 'Rejected' ? 'badge-error' :
                                        'badge-neutral'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => alert(`Application Details for ${app._id}:\nStatus: ${app.status}\nName: ${app.fullName}\nEmail: ${app.email}\nPolicy: ${app.policyTitle || 'N/A'}`)}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        View
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

export default MyApplications;