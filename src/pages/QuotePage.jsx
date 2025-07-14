import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'; 
import { useNavigate, useParams } from 'react-router';
import Spinner from '../component/Loader/Spinner';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';

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
        const fetchPolicyDetails = async () => {
            if (id) {
                try {
                    const res = await axiosSecure.get(`/policies/${id}`);
                    setPolicyTitle(res.data.policyTitle || 'Selected Policy');
                } catch (error) {
                    console.error('Error fetching policy for quote:', error);
                    toast.error('Failed to load policy details for quote.');
                    setPolicyTitle('Unknown Policy');
                } finally {
                    setLoadingPolicy(false);
                }
            } else {
                setLoadingPolicy(false);
            }
        };
        fetchPolicyDetails();
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
        return <Spinner />;
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl mt-8 mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Get a Quote for {policyTitle}</h1>
            <p className="text-center text-gray-600 mb-8">
                Get an estimated price for your policy. Fill in the details below.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                    <input
                        type="number"
                        {...register('age', {
                            required: 'Age is required',
                            min: { value: 18, message: 'Minimum age is 18' },
                            max: { value: 99, message: 'Maximum age is 99' },
                        })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 30"
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <select
                        {...register('gender', { required: 'Gender is required' })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Coverage Amount ($)</label>
                    <input
                        type="number"
                        {...register('coverageAmount', {
                            required: 'Coverage Amount is required',
                            min: { value: 100000, message: 'Minimum coverage is $100,000' },
                        })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 500000"
                    />
                    {errors.coverageAmount && <p className="text-red-500 text-xs mt-1">{errors.coverageAmount.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Duration (Years)</label>
                    <input
                        type="number"
                        {...register('duration', {
                            required: 'Duration is required',
                            min: { value: 5, message: 'Minimum duration is 5 years' },
                            max: { value: 50, message: 'Maximum duration is 50 years' },
                        })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 20"
                    />
                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Smoker?</label>
                    <select
                        {...register('smoker', { required: 'Please select if you are a smoker' })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    {errors.smoker && <p className="text-red-500 text-xs mt-1">{errors.smoker.message}</p>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary bg-green-600 hover:bg-green-700 text-white w-full text-lg py-3 rounded-lg shadow-md transition duration-200"
                >
                    Get Estimated Premium
                </button>
            </form>

            {estimatedPremium && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-green-800 mb-3">Estimated Monthly Premium:</h3>
                    <p className="text-4xl font-extrabold text-green-900">${estimatedPremium}</p>
                    <p className="text-sm text-gray-600 mt-2">This is an estimate. Actual premium may vary.</p>
                    <button
                        onClick={handleApplyClick}
                        className="btn btn-secondary bg-blue-600 hover:bg-blue-700 text-white text-lg mt-6 px-8 py-3 rounded-full shadow-lg transition duration-200"
                        disabled={loadingUser || loadingUserRole}
                    >
                        {loadingUser || loadingUserRole ? 'Checking Role...' : 'Apply for Policy'}
                    </button>
                </div>
            )}
            <dialog id="role_restriction_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-red-600">Access Denied!</h3>
                    <p className="py-4">As an Admin or Agent, you cannot apply for a policy directly from here. Please use a regular user account or the appropriate administrative tools.</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default QuotePage;