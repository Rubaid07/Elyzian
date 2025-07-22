import React, { useEffect, useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { Link } from 'react-router';
import Spinner from '../../component/Loader/Spinner';

const PopularPolicies = () => {
    const [popularPolicies, setPopularPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchPopularPolicies = async () => {
            try {
                const response = await axiosPublic.get('/policies/popular');
                setPopularPolicies(response.data);
            } catch (err) {
                console.error("Error fetching popular policies:", err);
                setError("Failed to load popular policies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPopularPolicies();
    }, [axiosPublic]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10">
                <p className="text-lg mb-4">{error}</p>
            </div>
        );
    }

    if (popularPolicies.length === 0) {
        return (
            <div className="text-center text-gray-600 p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-10">
                <p className="text-xl font-semibold mb-4">No popular policies found yet.</p>
                <p>Stay tuned for our most sought-after policies!</p>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Our Popular<span className="text-sky-600"> Policies</span> 
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the most trusted insurance solutions chosen by our customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularPolicies.map((policy) => (
                        <div 
                            key={policy._id} 
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="relative h-48 overflow-hidden">
                                {policy.policyImage ? (
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        src={policy.policyImage}
                                        alt={policy.policyTitle}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                )}
                                {policy.purchaseCount !== undefined && (
                                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-sky-700 px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                        {policy.purchaseCount} Purchased
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{policy.policyTitle}</h3>
                                
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Coverage: <span className="font-semibold">BDT {policy.coverageRange?.toLocaleString()}</span></span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Term: <span className="font-semibold">{policy.durationOptions?.split(',')[0]}</span></span>
                                    </div>
                                </div>

                                <Link
                                    to={`/policies/${policy._id}`}
                                    className="w-full text-center bg-sky-700 hover:bg-sky-800 text-white py-3 rounded-lg transition duration-300 font-medium flex items-center justify-center"
                                >
                                    View Details
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularPolicies;