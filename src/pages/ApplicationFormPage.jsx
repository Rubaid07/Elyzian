import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Spinner from '../component/Loader/Spinner';
import { AuthContext } from '../context/AuthContext';
import { FaUser,  FaHome, FaIdCard, FaUserFriends, FaHeartbeat, FaPaperPlane } from 'react-icons/fa';

const ApplicationFormPage = () => {
    const { user } = React.useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [policy, setPolicy] = useState(null);
    const [loadingPolicy, setLoadingPolicy] = useState(true);

    useEffect(() => {
        const fetchPolicyDetails = async () => {
            try {
                setLoadingPolicy(true);
                const res = await axiosSecure.get(`/policies/${id}`);
                setPolicy(res.data);
            } catch (err) {
                console.error('Failed to fetch policy details:', err);
                toast.error('Failed to load policy details.');
                navigate('/');
            } finally {
                setLoadingPolicy(false);
            }
        };
        if (id) {
            fetchPolicyDetails();
        }
    }, [id, axiosSecure, navigate]);

    const onSubmit = async (data) => {
        if (!policy) {
            toast.error('Policy details not loaded. Please try again.');
            return;
        }

        try {
            const applicationData = {
                policyId: id, 
                policyName: policy.policyTitle, 
                policyNumber: policy.policyNumber || 'N/A',
                applicantName: data.fullName,
                email: data.email,
                photo: data.photo,
                address: data.address,
                nidSsn: data.nidSsn,
                nomineeName: data.nomineeName,
                nomineeRelationship: data.nomineeRelationship,
                hasPreExistingConditions: data.hasPreExistingConditions || false,
                hasBeenHospitalized: data.hasBeenHospitalized || false,
                consumesAlcohol: data.consumesAlcohol || false,
                status: 'pending',
                appliedAt: new Date(),
            };
            const res = await axiosSecure.post('/applications', applicationData);

            if (res.data.insertedId) {
                toast.success('Your application has been submitted successfully! We will contact you soon.');
                reset();
                navigate('/dashboard/my-policies');
            } else {
                toast.error('Failed to submit application. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            toast.error('An error occurred while submitting your application.');
        }
    };

    if (loadingPolicy) return <Spinner></Spinner>

    if (!policy) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Policy Not Found</h2>
                    <p className="text-gray-600 mb-6">The policy you're trying to apply for could not be loaded.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn bg-sky-600 hover:bg-sky-700 text-white"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-16 md:px-4 ">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Apply for <span className="text-sky-600">{policy.policyTitle}</span>
                            </h1>
                            <p className="text-gray-600">
                                Complete the form below to submit your application
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="bg-sky-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaUser className="text-sky-500 mr-2" /> Personal Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={user?.displayName || ''}
                                                {...register('fullName', { required: 'Full Name is required' })}
                                                className="input input-bordered w-full bg-gray-100"
                                                disabled
                                            />
                                        </div>
                                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                {...register('email', { 
                                                    required: 'Email is required', 
                                                    pattern: {
                                                        value: /^\S+@\S+$/i,
                                                        message: 'Please enter a valid email'
                                                    }
                                                })}
                                                className="input input-bordered w-full bg-gray-100"
                                                disabled
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-gray-700 font-medium mb-2 flex items-center">
                                            <FaHome className="mr-2 text-sky-500" /> Address
                                        </label>
                                        <textarea
                                            {...register('address', { required: 'Address is required' })}
                                            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-sky-500 focus:outline-none focus:border-0"
                                            rows="3"
                                            placeholder="Your full address"
                                        ></textarea>
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-gray-700 font-medium mb-2 flex items-center">
                                            <FaIdCard className="mr-2 text-sky-500" /> NID/SSN
                                        </label>
                                        <input
                                            type="text"
                                            {...register('nidSsn', { required: 'NID/SSN is required' })}
                                            className="input input-bordered w-full focus:ring-2 focus:ring-sky-500 focus:outline-none focus:border-0"
                                            placeholder="Your national ID or social security number"
                                        />
                                        {errors.nidSsn && <p className="text-red-500 text-sm mt-1">{errors.nidSsn.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-sky-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaUserFriends className="text-sky-500 mr-2" /> Nominee Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Nominee Name</label>
                                        <input
                                            type="text"
                                            {...register('nomineeName', { required: 'Nominee Name is required' })}
                                            className="input input-bordered w-full focus:ring-2 focus:ring-sky-500 focus:outline-none focus:border-0"
                                            placeholder="Full name of your nominee"
                                        />
                                        {errors.nomineeName && <p className="text-red-500 text-sm mt-1">{errors.nomineeName.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Relationship to Nominee</label>
                                        <input
                                            type="text"
                                            {...register('nomineeRelationship', { required: 'Relationship is required' })}
                                            className="input input-bordered w-full focus:ring-2 focus:ring-sky-500 focus:outline-none focus:border-0"
                                            placeholder="e.g., Spouse, Child, Parent"
                                        />
                                        {errors.nomineeRelationship && <p className="text-red-500 text-sm mt-1">{errors.nomineeRelationship.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-sky-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaHeartbeat className="text-sky-500 mr-2" /> Health Disclosure
                                </h2>
                                
                                <div className="space-y-3 max-w-md">
    <div className="form-control">
        <label className="label cursor-pointer flex items-start ">
            <input
                type="checkbox"
                {...register('hasPreExistingConditions')}
                className="checkbox checkbox-primary"
            />
            <span className="label-text break-words whitespace-normal">
                Do you have any pre-existing medical conditions?
            </span>
        </label>
    </div>

    <div className="form-control">
        <label className="label cursor-pointer flex items-start">
            <input
                type="checkbox"
                {...register('hasBeenHospitalized')}
                className="checkbox checkbox-primary"
            />
            <span className="label-text break-words whitespace-normal">
                Have you been hospitalized in the last 5 years?
            </span>
        </label>
    </div>

    <div className="form-control">
        <label className="label cursor-pointer flex items-start">
            <input
                type="checkbox"
                {...register('consumesAlcohol')}
                className="checkbox checkbox-primary"
            />
            <span className="label-text">
                Do you consume alcohol regularly?
            </span>
        </label>
    </div>
</div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center py-3 px-6 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-6"
                            >
                                <FaPaperPlane className="mr-2" /> Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationFormPage;