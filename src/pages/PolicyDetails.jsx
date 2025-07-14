import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Spinner from '../component/Loader/Spinner';

const PolicyDetails = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolicyDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosPublic.get(`/policies/${id}`);
                setPolicy(res.data);
            } catch (err) {
                console.error('Error fetching policy details:', err);
                setError('Failed to load policy details. It might not exist or there was a server error.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPolicyDetails();
        } else {
            setLoading(false);
            setError('No policy ID provided.');
        }
    }, [id, axiosPublic]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
                <Link to="/policies" className="btn btn-primary bg-sky-600 hover:bg-sky-700 text-white">
                    Back to All Policies
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-3xl mt-8 mb-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{policy.policyTitle}</h1>
                <p className="text-lg text-sky-700 font-semibold">Category: {policy.category}</p>
            </div>

            {policy.policyImage && (
                <div className="mb-8 flex justify-center">
                    <img
                        src={policy.policyImage}
                        alt={policy.policyTitle}
                        className="w-full max-h-96 object-cover rounded-lg shadow-lg"
                    />
                </div>
            )}

            <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
                <p>{policy.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 mb-8">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Minimum Age:</strong> {policy.minimumAge} years</li>
                        <li><strong>Maximum Age:</strong> {policy.maximumAge} years</li>
                        <li><strong>Coverage Range:</strong> ${policy.coverageRange}</li>
                        <li><strong>Duration Options:</strong> {policy.durationOptions}</li>
                        <li><strong>Base Premium Rate:</strong> ${policy.basePremiumRate}</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Link
                    to={`/quote/${policy._id}`}
                    className="btn bg-sky-600 hover:bg-sky-700 text-white text-lg px-6 py-3 rounded-full transition duration-200"
                >
                    Get Quote
                </Link>
                <button
                    onClick={() => alert('Agent consultation feature coming soon!')}
                    className="btn btn-outline btn-secondary border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white text-lg px-6 py-3 rounded-full  transition duration-200"
                >
                    Book Agent Consultation
                </button>
            </div>

            <div className="text-center mt-8">
                <Link to="/policies" className="btn btn-ghost">
                    Back to All Policies
                </Link>
            </div>
        </div>
    );
};

export default PolicyDetails;