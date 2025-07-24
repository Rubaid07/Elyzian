import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Spinner from '../component/Loader/Spinner';
import { FaShieldAlt, FaUserClock, FaMoneyBillWave, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const AllPolicies = () => {
    const axiosPublic = useAxiosPublic();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [totalPages, setTotalPages] = useState(1);
    const policiesPerPage = 6;
    const search = useRef(null);
    const prevSearch = useRef('');
    const categories = [
        'Term Life', 'Endowment Plan', 'Education',
        'Senior Plan', 'Accidental', 'Health',
        'Investment', 'Retirement'
    ];
    const policiesPromise = async () => {
        try {
            setLoading(true);
            setError(null);
            const categoryQuery = filterCategory !== 'all' ? `&category=${filterCategory}` : '';
            const res = await axiosPublic.get(`/policies?page=${currentPage}&limit=${policiesPerPage}&search=${searchTerm}${categoryQuery}`);
            setPolicies(res.data.policies || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Error fetching policies:', err);
            setError('Failed to load policies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setFilterCategory('all');
        policiesPromise();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e);
        }
    };

    const handleCategoryChange = (e) => {
        setFilterCategory(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        policiesPromise();
    }, [currentPage, filterCategory]);

    useEffect(() => {
        prevSearch.current = searchTerm;
    }, [searchTerm]);

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
        <section className="bg-gradient-to-b from-gray-50 to-white md:py-16 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center md:mb-16 mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-sky-600">Insurance Policies</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose from our comprehensive range of insurance policies designed to protect what matters most to you
                    </p>
                </div>
                
                <div className='flex flex-col md:flex-row gap-4 mb-8 max-w-7xl mx-auto items-center'>
                    <form onSubmit={handleSearch} className="md:w-auto flex-grow">
                        <div className="flex items-center gap-3">
                            <input
                                ref={search}
                                type="text"
                                placeholder="Search policies"
                                className="input input-bordered pl-5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button 
                                type="submit" 
                                className="border-none cursor-pointer "
                                aria-label="Search"
                            >
                                <div className='flex items-center gap-2 btn bg-sky-600 hover:bg-sky-700 text-white'>
                                    <FaSearch />
                                    Search
                                </div>
                            </button>
                        </div>
                    </form>

                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <select
                            className="select select-bordered w-full"
                            value={filterCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {policies.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto text-center">
                        <p className="text-gray-600 text-lg mb-4">
                            {(searchTerm || filterCategory !== 'all') ? 'No policies match your criteria' : 'No policies available at the moment'}
                        </p>
                        <p className="text-gray-500">
                            {(searchTerm || filterCategory !== 'all') ? 'Try different search terms or categories' : 'We\'re working on adding new policies. Please check back later!'}
                        </p>
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