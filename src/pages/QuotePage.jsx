import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import Spinner from '../component/Loader/Spinner';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { FaUser, FaVenusMars, FaShieldAlt, FaCalendarAlt, FaSmoking, FaCalculator, FaArrowRight } from 'react-icons/fa';

const QuotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [estimatedPremium, setEstimatedPremium] = useState(null);
    const [policyTitle, setPolicyTitle] = useState('Selected Policy');
    const [loadingPolicy, setLoadingPolicy] = useState(true);

    const { user, loading: loadingUser } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [loadingUserRole, setLoadingUserRole] = useState(true);

    useEffect(() => {
        const policyDetails = async () => {
            if (id) {
                try {
                    const res = await axiosSecure.get(`/policies/${id}`);
                    setPolicyTitle(res.data.policyTitle || 'Selected Policy');
                } catch (error) {
                    console.log(error);
                    toast.error('Failed to load policy details for quote.');
                    setPolicyTitle('Unknown Policy');
                } finally {
                    setLoadingPolicy(false);
                }
            } else {
                setLoadingPolicy(false);
            }
        };
        policyDetails();
    }, [id, axiosSecure]);

    useEffect(() => {
        if (user && user.email) {
            setLoadingUserRole(true);
            axiosSecure.get(`/users/${user.email}`)
                .then(res => {
                    setUserRole(res.data.role);
                })
                .catch(err => {
                    console.error('Error fetching user role from DB:', err);
                    setUserRole(null);
                })
                .finally(() => {
                    setLoadingUserRole(false);
                });
        } else {
            setUserRole(null);
            setLoadingUserRole(false);
        }
    }, [user, axiosSecure]);

    const onSubmit = async (data) => {
        const basePremium = 100;
        let calculatedPremium = basePremium;

        if (data.gender === 'Female') calculatedPremium *= 0.95;
        if (data.smoker === 'Yes') calculatedPremium *= 1.5;
        calculatedPremium += (data.age - 20) * 2;
        calculatedPremium += (data.coverageAmount / 100000) * 5;
        calculatedPremium *= (data.duration / 5);

        setEstimatedPremium(calculatedPremium.toFixed(2));
        toast.success('Premium estimated successfully!');
    };

    const handleApplyClick = () => {
        if (loadingUser || loadingUserRole) {
            toast.info("Checking user role. Please wait...");
            return;
        }

        if (userRole === 'admin' || userRole === 'agent') {
            if (document.getElementById('role_restriction_modal')) {
                document.getElementById('role_restriction_modal').showModal();
            }
        } else if (user) {
            navigate(`/apply/${id}`);
        } else {
            toast.info("Please log in to apply for a policy.");
            navigate('/login');
        }
    };

    if (loadingPolicy || loadingUser || loadingUserRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="w-16 h-16 text-sky-600" />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-16">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Get a Quote for <span className="text-sky-600">{policyTitle}</span>
                            </h1>
                            <p className="text-gray-600">
                                Fill in your details to get an estimated premium for your policy
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium">
                                    <FaUser className="inline mr-2 text-sky-500" /> Age
                                </label>
                                <input
                                    type="number"
                                    {...register('age', {
                                        required: 'Age is required',
                                        min: { value: 18, message: 'Minimum age is 18' },
                                        max: { value: 99, message: 'Maximum age is 99' },
                                    })}
                                    className="input input-bordered w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                    placeholder="e.g., 30"
                                />
                                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium">
                                    <FaVenusMars className="inline mr-2 text-sky-500" /> Gender
                                </label>
                                <select
                                    {...register('gender', { required: 'Gender is required' })}
                                    className="select select-bordered w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium">
                                    <FaShieldAlt className="inline mr-2 text-sky-500" /> Coverage Amount (BDT)
                                </label>
                                <input
                                    type="number"
                                    {...register('coverageAmount', {
                                        required: 'Coverage Amount is required',
                                        min: { value: 100000, message: 'Minimum coverage is BDT 100,000' },
                                    })}
                                    className="input input-bordered w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                    placeholder="e.g., 500000"
                                />
                                {errors.coverageAmount && <p className="text-red-500 text-sm mt-1">{errors.coverageAmount.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium">
                                    <FaCalendarAlt className="inline mr-2 text-sky-500" /> Duration (Years)
                                </label>
                                <input
                                    type="number"
                                    {...register('duration', {
                                        required: 'Duration is required',
                                        min: { value: 5, message: 'Minimum duration is 5 years' },
                                        max: { value: 50, message: 'Maximum duration is 50 years' },
                                    })}
                                    className="input input-bordered w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                    placeholder="e.g., 20"
                                />
                                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium">
                                    <FaSmoking className="inline mr-2 text-sky-500" /> Smoker?
                                </label>
                                <select
                                    {...register('smoker', { required: 'Please select if you are a smoker' })}
                                    className="select select-bordered w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                >
                                    <option value="">Select Option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                {errors.smoker && <p className="text-red-500 text-sm mt-1">{errors.smoker.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center py-3 px-6 bg-sky-600  hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <FaCalculator className="mr-2" /> Calculate Premium
                            </button>
                        </form>

                        {estimatedPremium && (
                            <div className="mt-8 p-6 bg-sky-50 border border-sky-200 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Your Estimated Premium</h3>
                                <div className="text-center mb-4">
                                    <span className="text-4xl font-extrabold text-sky-600">BDT {estimatedPremium}</span>
                                    <span className="text-gray-600"> / month</span>
                                </div>
                                <p className="text-sm text-gray-600 text-center mb-6">
                                    This is an estimate. Your final premium may vary based on additional factors.
                                </p>
                                <button
                                    onClick={handleApplyClick}
                                    className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    disabled={loadingUser || loadingUserRole}
                                >
                                    {loadingUser || loadingUserRole ? 'Checking...' : (
                                        <>
                                            Apply Now <FaArrowRight className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <dialog id="role_restriction_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-red-600">Access Restricted</h3>
                    <p className="py-4">
                        As an {userRole}, you cannot apply for a policy directly. Please use a regular user account or the appropriate administrative tools.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default QuotePage;