import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Spinner from '../component/Loader/Spinner';
import { FaShieldAlt, FaUserClock, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

const AllPolicies = () => {
    const axiosPublic = useAxiosPublic();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 
    const policiesPerPage = 6;
    const fetchPolicies = () => {
        setLoading(true);
        setError(null);
        axiosPublic.get(`/policies?page=${currentPage}&limit=${policiesPerPage}`)
            .then(res => {
                setPolicies(res.data.policies || []);
                setTotalPages(res.data.totalPages || 1); 
            })
            .catch(err => {
                console.error('Error fetching policies:', err);
                setError('Failed to load policies. Please try again later.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPolicies();
    }, [currentPage, axiosPublic]); 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="w-16 h-16 text-sky-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md rounded-lg">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-sky-600">Insurance Policies</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose from our comprehensive range of insurance policies designed to protect what matters most to you
                    </p>
                </div>

                {policies.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto text-center">
                        <p className="text-gray-600 text-lg mb-4">No policies available at the moment</p>
                        <p className="text-gray-500">We're working on adding new policies. Please check back later!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {policies.map(policy => (
                                <div 
                                    key={policy._id} 
                                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
                                >
                                    {policy.policyImage && (
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={policy.policyImage}
                                                alt={policy.policyTitle}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                            <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                {policy.category}
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{policy.policyTitle}</h2>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{policy.description}</p>
                                        
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-gray-700">
                                                <FaUserClock className="w-5 h-5 text-sky-500 mr-2" />
                                                <span>Age: {policy.minimumAge}-{policy.maximumAge} years</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FaShieldAlt className="w-5 h-5 text-sky-500 mr-2" />
                                                <span>Coverage: BDT {policy.coverageRange?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FaCalendarAlt className="w-5 h-5 text-sky-500 mr-2" />
                                                <span>Term: {policy.durationOptions?.split(',')[0]}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FaMoneyBillWave className="w-5 h-5 text-sky-500 mr-2" />
                                                <span>From BDT {policy.basePremiumRate}/month</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/policies/${policy._id}`}
                                            className="block w-full text-center bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg transition duration-300 font-medium shadow-md hover:shadow-lg"
                                        >
                                            Policy Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {pageNumbers.map(number => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                            currentPage === number ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default AllPolicies;