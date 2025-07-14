import React, { useEffect, useState, useRef } from 'react';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';

const ManagePolicies = () => {
    const axiosSecure = useAxiosSecure();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPolicy, setEditingPolicy] = useState(null); 

    const modalRef = useRef(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchPolicies = () => {
        setLoading(true);
        axiosSecure.get('/admin/policies')
            .then(res => setPolicies(res.data || []))
            .catch(err => {
                console.error('Error fetching policies:', err);
                toast.error('Failed to load policies.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPolicies();
    }, [axiosSecure]);

    const openModal = (policy = null) => {
        setEditingPolicy(policy);
        if (policy) {
            setValue('policyTitle', policy.policyTitle || '');
            setValue('category', policy.category || '');
            setValue('description', policy.description || '');
            setValue('minimumAge', policy.minimumAge || '');
            setValue('maximumAge', policy.maximumAge || '');
            setValue('coverageRange', policy.coverageRange || '');
            setValue('durationOptions', policy.durationOptions || '');
            setValue('basePremiumRate', policy.basePremiumRate || '');
            setValue('policyImage', policy.policyImage || '');
        } else {
            reset();
        }
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
        setEditingPolicy(null);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (editingPolicy) {
                await axiosSecure.patch(`/admin/policies/${editingPolicy._id}`, data);
                toast.success('Policy updated successfully!');
            } else {
                await axiosSecure.post('/admin/policies', data);
                toast.success('Policy added successfully!');
            }
            closeModal();
            fetchPolicies();
        } catch (err) {
            console.error('Error saving policy:', err);
            toast.error(`Failed to ${editingPolicy ? 'update' : 'add'} policy.`);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this policy?');
        if (!confirmDelete) return;

        try {
            await axiosSecure.delete(`/admin/policies/${id}`);
            setPolicies(prev => prev.filter(policy => policy._id !== id));
            toast.success('Policy deleted successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete policy.');
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Manage Policies</h2>
                <button
                    onClick={() => openModal()}
                    className="btn border-sky-700 bg-transparent text-sky-700 hover:bg-sky-700 hover:text-white"
                >
                    <FaPlus className="mr-2" /> Add New Policy
                </button>
            </div>

            {policies.length === 0 ? (
                <p className="text-center text-gray-500">No policies available. Click "Add New Policy" to add one.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full text-sm">
                        <thead className="bg-sky-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Min Age</th>
                                <th className="p-3 text-left">Max Age</th>
                                <th className="p-3 text-left">Coverage</th>
                                <th className="p-3 text-left">Duration</th>
                                <th className="p-3 text-left">Premium</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map(policy => (
                                <tr key={policy._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3">{policy.policyTitle}</td>
                                    <td className="p-3">{policy.category}</td>
                                    <td className="p-3">{policy.minimumAge}</td>
                                    <td className="p-3">{policy.maximumAge}</td>
                                    <td className="p-3">${policy.coverageRange}</td>
                                    <td className="p-3">{policy.durationOptions}</td>
                                    <td className="p-3">${policy.basePremiumRate}</td>
                                    <td className="p-3 flex gap-2 items-center">
                                        <button
                                            onClick={() => openModal(policy)}
                                            className="btn btn-xs bg-yellow-500 hover:bg-yellow-600 text-white tooltip tooltip-top" data-tip="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(policy._id)}
                                            className="btn btn-xs bg-red-500 hover:bg-red-600 text-white tooltip tooltip-top" data-tip="Delete"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <dialog id="policy_modal" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-center mb-4">
                        {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Policy Title</label>
                            <input
                                type="text"
                                {...register('policyTitle', { required: 'Policy Title is required' })}
                                className="input input-bordered w-full"
                            />
                            {errors.policyTitle && <p className="text-red-500 text-xs mt-1">{errors.policyTitle.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Category</option>
                                <option value="Term Life">Term Life</option>
                                <option value="Senior Plan">Senior Plan</option>
                                <option value="Health">Health</option>
                                <option value="Investment">Investment</option>
                                <option value="Retirement">Retirement</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                rows="4"
                                className="textarea textarea-bordered w-full"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Minimum Age</label>
                                <input
                                    type="number"
                                    {...register('minimumAge', {
                                        required: 'Minimum Age is required',
                                        min: { value: 0, message: 'Minimum Age cannot be negative' }
                                    })}
                                    className="input input-bordered w-full"
                                />
                                {errors.minimumAge && <p className="text-red-500 text-xs mt-1">{errors.minimumAge.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Age</label>
                                <input
                                    type="number"
                                    {...register('maximumAge', {
                                        required: 'Maximum Age is required',
                                        min: { value: 0, message: 'Maximum Age cannot be negative' }
                                    })}
                                    className="input input-bordered w-full"
                                />
                                {errors.maximumAge && <p className="text-red-500 text-xs mt-1">{errors.maximumAge.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Coverage Range</label>
                                <input
                                    type="text"
                                    {...register('coverageRange', { required: 'Coverage Range is required' })}
                                    placeholder="e.g., $50,000 - $1,000,000"
                                    className="input input-bordered w-full"
                                />
                                {errors.coverageRange && <p className="text-red-500 text-xs mt-1">{errors.coverageRange.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Duration Options</label>
                                <input
                                    type="text"
                                    {...register('durationOptions', { required: 'Duration Options is required' })}
                                    placeholder="e.g., 10 years, 20 years, Till 65"
                                    className="input input-bordered w-full"
                                />
                                {errors.durationOptions && <p className="text-red-500 text-xs mt-1">{errors.durationOptions.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Base Premium Rate</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('basePremiumRate', {
                                    required: 'Base Premium Rate is required',
                                    min: { value: 0, message: 'Premium cannot be negative' }
                                })}
                                className="input input-bordered w-full"
                            />
                            {errors.basePremiumRate && <p className="text-red-500 text-xs mt-1">{errors.basePremiumRate.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Policy Image URL</label>
                            <input
                                type="url"
                                {...register('policyImage', { required: 'Policy Image URL is required' })}
                                className="input input-bordered w-full"
                            />
                            {errors.policyImage && <p className="text-red-500 text-xs mt-1">{errors.policyImage.message}</p>}
                        </div>

                        <div className="modal-action">
                            <button
                                type="submit"
                                className="btn btn-block btn-primary bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {editingPolicy ? 'Update Policy' : 'Add Policy'}
                            </button>
                            <button type="button" onClick={closeModal} className="btn btn-ghost mt-2">Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManagePolicies;