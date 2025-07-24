import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Spinner from '../component/Loader/Spinner';
import { FaShieldAlt, FaUser, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft, FaPhoneAlt, FaChartLine } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { GiHealthIncrease } from 'react-icons/gi';

const PolicyDetails = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const policyDetailsData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosPublic.get(`/policies/${id}`);
                setPolicy(res.data);
            } catch (err) {
                console.error('Error fetching policy details:', err);
                setError('Failed to load policy details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            policyDetailsData();
        } else {
            setLoading(false);
            setError('No policy ID provided.');
        }
    }, [id, axiosPublic]);

    if (loading) return <Spinner></Spinner>

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                        <h3 className="text-xl font-bold mb-2">Error Loading Policy</h3>
                        <p>{error}</p>
                    </div>
                    <Link
                        to="/policies"
                        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <FaArrowLeft className="mr-2" /> Back to All Policies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        to="/policies"
                        className="inline-flex items-center text-sky-600 hover:text-sky-800 font-medium transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> All Policies
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {policy.policyImage && (
                        <div className="relative h-80 w-full overflow-hidden">
                            <img
                                src={policy.policyImage}
                                alt={policy.policyTitle}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                {policy.category}
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{policy.policyTitle}</h1>
                            <p className="text-lg text-sky-600 font-medium">{policy.category} Insurance</p>
                        </div>

                        <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaShieldAlt className="text-sky-500 mr-2" /> Policy Overview
                            </h2>
                            <p className="text-lg">{policy.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-sky-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <GiHealthIncrease className="text-sky-500 mr-2" /> Coverage Details
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <FaUser className="text-sky-500 mt-1 mr-2 flex-shrink-0" />
                                        <span><strong>Age Range:</strong> {policy.minimumAge} - {policy.maximumAge} years</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaShieldAlt className="text-sky-500 mt-1 mr-2 flex-shrink-0" />
                                        <span><strong>Coverage Amount:</strong> ${policy.coverageRange?.toLocaleString()}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaChartLine className="text-sky-500 mt-1 mr-2 flex-shrink-0" />
                                        <span><strong>Premium Rate:</strong> ${policy.basePremiumRate}/month</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-sky-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <IoMdTime className="text-sky-500 mr-2" /> Policy Terms
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <FaCalendarAlt className="text-sky-500 mt-1 mr-2 flex-shrink-0" />
                                        <span><strong>Duration Options:</strong> {policy.durationOptions}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaMoneyBillWave className="text-sky-500 mt-1 mr-2 flex-shrink-0" />
                                        <span><strong>Payment Frequency:</strong> Monthly/Annual</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                            <Link
                                to={`/quote/${policy._id}`}
                                className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Get Instant Quote
                            </Link>
                            <label
                                htmlFor="agent-modal"
                                className="flex-1 text-center border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer"
                            >
                                <FaPhoneAlt className="mr-2" /> Talk to Agent
                            </label>
                        </div>
                    </div>
                </div>
                <input type="checkbox" id="agent-modal" className="modal-toggle" />
                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl text-sky-700 mb-4">Talk to an Agent</h3>
                        <p className="py-2 text-gray-700">
                            Our professional agents are available to assist you. Please call us at:
                        </p>
                        <div className="text-lg font-semibold text-sky-600 mb-4">📞 +8801111111111</div>
                        <div className="modal-action">
                            <label htmlFor="agent-modal" className="btn btn-sm bg-sky-600 text-white hover:bg-sky-700">
                                Close
                            </label>
                        </div>
                    </div>
                </div>


                <div className="text-center mt-12">
                    <Link
                        to="/policies"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    >
                        <FaArrowLeft className="mr-2" /> Back to All Policies
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;