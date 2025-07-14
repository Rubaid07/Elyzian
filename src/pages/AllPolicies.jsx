import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Spinner from '../component/Loader/Spinner';

const AllPolicies = () => {
    const axiosPublic = useAxiosPublic();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPolicies = () => {
        setLoading(true);
        setError(null);
        axiosPublic.get('/policies')
            .then(res => {
                setPolicies(res.data || []);
            })
            .catch(err => {
                console.error('Error fetching policies:', err);
                setError('Failed to load policies. Please try again later.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPolicies();
    }, [axiosPublic]);

    if (loading) {
        return <Spinner />; 
    }

    if (error) {
        return <div className="text-center text-red-600 p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Available Policies</h1>

            {policies.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No policies are available at the moment. Please check back later!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map(policy => (
                        <div key={policy._id} className="bg-sky-50 border border-sky-200 rounded-lg shadow-sm ">
                            {policy.policyImage && (
                                <img
                                    src={policy.policyImage}
                                    alt={policy.policyTitle}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-5">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{policy.policyTitle}</h2>
                                <p className="text-sm text-sky-700 font-medium mb-2">Category: {policy.category}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{policy.description}</p>
                                <div className="text-gray-700 text-sm space-y-1">
                                    <p><strong>Age Range:</strong> {policy.minimumAge} - {policy.maximumAge} years</p>
                                    <p><strong>Coverage:</strong> ${policy.coverageRange}</p>
                                    <p><strong>Duration Options:</strong> {policy.durationOptions}</p>
                                    <p><strong>Base Premium:</strong> ${policy.basePremiumRate}</p>
                                </div>
                                <div className="mt-5 text-right">
                                    <Link
                                        to={`/policies/${policy._id}`}
                                        className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full text-xs transition duration-200"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllPolicies;