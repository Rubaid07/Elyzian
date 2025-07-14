import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../hooks/useAxiosSecure'; 

const ApplicationFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const applicationData = {
                policyId: id,
                status: 'Pending',
                submissionDate: new Date(),
                ...data, 
            };
            const res = await axiosSecure.post('/applications', applicationData);

            if (res.data.insertedId) {
                toast.success('Your application has been submitted successfully! We will contact you soon.');
                reset();
                navigate('/dashboard/my-applications');
            } else {
                toast.error('Failed to submit application. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            toast.error('An error occurred while submitting your application.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-3xl mt-8 mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Apply for Policy</h1>
            <p className="text-center text-gray-600 mb-8">
                Please provide your details to apply for the policy (Policy ID: {id}).
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input
                        type="text"
                        {...register('fullName', { required: 'Full Name is required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                        className="input input-bordered w-full"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                    <textarea
                        {...register('address', { required: 'Address is required' })}
                        className="textarea textarea-bordered w-full"
                        rows="3"
                    ></textarea>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">NID/SSN</label>
                    <input
                        type="text"
                        {...register('nidSsn', { required: 'NID/SSN is required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.nidSsn && <p className="text-red-500 text-xs mt-1">{errors.nidSsn.message}</p>}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Nominee Information</h2>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nominee Name</label>
                    <input
                        type="text"
                        {...register('nomineeName', { required: 'Nominee Name is required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.nomineeName && <p className="text-red-500 text-xs mt-1">{errors.nomineeName.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Relationship to Nominee</label>
                    <input
                        type="text"
                        {...register('nomineeRelationship', { required: 'Relationship is required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.nomineeRelationship && <p className="text-red-500 text-xs mt-1">{errors.nomineeRelationship.message}</p>}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Health Disclosure</h2>
                <div className="space-y-2">
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Do you have any pre-existing medical conditions?</span>
                            <input
                                type="checkbox"
                                {...register('hasPreExistingConditions')}
                                className="checkbox checkbox-primary"
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Have you been hospitalized in the last 5 years?</span>
                            <input
                                type="checkbox"
                                {...register('hasBeenHospitalized')}
                                className="checkbox checkbox-primary"
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Do you consume alcohol regularly?</span>
                            <input
                                type="checkbox"
                                {...register('consumesAlcohol')}
                                className="checkbox checkbox-primary"
                            />
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white w-full text-lg py-3 rounded-lg shadow-md transition duration-200 mt-8"
                >
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default ApplicationFormPage;