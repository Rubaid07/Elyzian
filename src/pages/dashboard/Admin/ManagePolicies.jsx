import React, { useEffect, useState, useRef } from 'react';
import { FaTrashAlt, FaEdit, FaPlus, FaSearch, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import axios from 'axios';

const ManagePolicies = () => {
    const axiosSecure = useAxiosSecure();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);

    const modalRef = useRef(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const PoliciesData = () => {
        setLoading(true);
        axiosSecure.get('/admin/policies')
            .then(res => setPolicies(res.data || []))
            .catch(err => {
                console.log(err);
                toast.error('Failed to load policies.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        PoliciesData();
    }, [axiosSecure]);

    const filterPolicy = policies.filter(policy => {
        const matchSarch = policy.policyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
        return matchSarch && matchesCategory;
    });

    const categories = [
        'Term Life', 'Endowment Plan', 'Education',
        'Senior Plan', 'Accidental', 'Health',
        'Investment', 'Retirement'
    ];

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
            if (policy.policyImage) {
                setPreview(policy.policyImage);
            } else {
                setPreview(null);
            }
            setImageFile(null);
        } else {
            reset();
            setPreview(null);
            setImageFile(null);
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
        setPreview(null);
        setImageFile(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const onSubmit = async (data) => {
        setImageUploadLoading(true);
        let imageUrl = editingPolicy?.policyImage || null;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = res.data.imageUrl;
            } catch (err) {
                console.log(err);
                toast.error("Image upload failed.");
                setImageUploadLoading(false);
                return;
            }
        } else if (!imageUrl && !editingPolicy) {
            toast.error('Please upload an image for the policy.');
            setImageUploadLoading(false);
            return;
        }

        const policyData = {
            ...data,
            policyImage: imageUrl,
        };

        try {
            if (editingPolicy) {
                await axiosSecure.patch(`/admin/policies/${editingPolicy._id}`, policyData);
                toast.success('Policy updated successfully!');
            } else {
                await axiosSecure.post('/admin/policies', policyData);
                toast.success('Policy added successfully!');
            }
            closeModal();
            PoliciesData();
        } catch (err) {
            console.log(err);
            toast.error(`Failed to ${editingPolicy ? 'update' : 'add'} policy.`);
        } finally {
            setImageUploadLoading(false);
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
        <div className="md:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Manage Insurance Policies</h2>
                        <p className="text-gray-600">Create, update, and manage your insurance products</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="btn bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                    >
                        <FaPlus className="mr-2" /> Add New Policy
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search policies..."
                            className="input input-bordered w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="select select-bordered w-full"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {filterPolicy.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaSearch className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                        <p className="text-gray-500">
                            {searchTerm || filterCategory !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Click "Add New Policy" to create your first policy'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Policy
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Age Range
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Coverage
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Premium
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filterPolicy.map((policy, index) => (
                                    <tr key={policy._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">

                                            <div className="font-medium text-gray-900">{policy.policyTitle}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {policy.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {policy.minimumAge} - {policy.maximumAge} yrs
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            BDT {policy.coverageRange}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {policy.durationOptions}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            BDT {policy.basePremiumRate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => openModal(policy)}
                                                    className="text-sky-600 hover:text-sky-900 p-1 rounded hover:bg-sky-50"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(policy._id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <dialog id="policy_modal" className="modal  sm:modal-middle" ref={modalRef}>
                <div className="modal-box max-w-full sm:max-w-4xl w-full p-0 overflow-visible max-h-[90vh]">
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-white">
                        <h3 className="font-bold text-xl">
                            {editingPolicy ? 'Edit Insurance Policy' : 'Create New Insurance Policy'}
                        </h3>
                        <p className="text-sky-100 text-sm mt-1">
                            {editingPolicy ? 'Update the policy details below' : 'Fill in the details to create a new policy'}
                        </p>
                        <button
                            onClick={closeModal}
                            className="btn btn-sm btn-circle absolute right-2 top-2 bg-white/10 border-none hover:bg-white/20"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
                        <div className='space-y-6'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Title*</label>
                                    <input
                                        type="text"
                                        {...register('policyTitle', { required: 'Policy Title is required' })}
                                        className="input input-bordered w-full"
                                        placeholder="e.g., Comprehensive Health Insurance"
                                    />
                                    {errors.policyTitle && <p className="mt-1 text-sm text-red-600">{errors.policyTitle.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                                    <select
                                        {...register('category', { required: 'Category is required' })}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    rows="4"
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Detailed description of the policy coverage and benefits..."
                                ></textarea>
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Age*</label>
                                    <input
                                        type="number"
                                        {...register('minimumAge', {
                                            required: 'Minimum Age is required',
                                            min: { value: 0, message: 'Minimum Age cannot be negative' }
                                        })}
                                        className="input input-bordered w-full"
                                        placeholder="e.g., 18"
                                    />
                                    {errors.minimumAge && <p className="mt-1 text-sm text-red-600">{errors.minimumAge.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Age*</label>
                                    <input
                                        type="number"
                                        {...register('maximumAge', {
                                            required: 'Maximum Age is required',
                                            min: { value: 0, message: 'Maximum Age cannot be negative' }
                                        })}
                                        className="input input-bordered w-full"
                                        placeholder="e.g., 65"
                                    />
                                    {errors.maximumAge && <p className="mt-1 text-sm text-red-600">{errors.maximumAge.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Range*</label>
                                    <input
                                        type="text"
                                        {...register('coverageRange', { required: 'Coverage Range is required' })}
                                        className="input input-bordered w-full"
                                        placeholder="e.g., 50,000 - 1,000,000"
                                    />
                                    {errors.coverageRange && <p className="mt-1 text-sm text-red-600">{errors.coverageRange.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration Options*</label>
                                    <input
                                        type="text"
                                        {...register('durationOptions', { required: 'Duration Options is required' })}
                                        className="input input-bordered w-full"
                                        placeholder="e.g., 10 years, 20 years, Till 65"
                                    />
                                    {errors.durationOptions && <p className="mt-1 text-sm text-red-600">{errors.durationOptions.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Premium Rate (BDT)*</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">BDT</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('basePremiumRate', {
                                            required: 'Base Premium Rate is required',
                                            min: { value: 0, message: 'Premium cannot be negative' }
                                        })}
                                        className="input input-bordered w-full pl-12"
                                        placeholder="e.g., 5000"
                                    />
                                </div>
                                {errors.basePremiumRate && <p className="mt-1 text-sm text-red-600">{errors.basePremiumRate.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Image</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaImage className="text-3xl text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500">Click to upload</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {preview && (
                                        <div className="relative">
                                            <img
                                                src={preview}
                                                alt="Policy Preview"
                                                className="w-32 h-32 object-cover rounded-lg shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreview(null);
                                                    setImageFile(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {(!imageFile && !editingPolicy?.policyImage) && (
                                    <p className="mt-1 text-sm text-red-600">Policy Image is required</p>
                                )}
                            </div>
                        </div>

                        <div className="modal-action flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn btn-ghost hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                                disabled={imageUploadLoading}
                            >
                                {imageUploadLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        {editingPolicy ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    editingPolicy ? 'Update Policy' : 'Create Policy'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                 <form method="dialog" className="modal-backdrop">
                    <button onClick={closeModal}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ManagePolicies;