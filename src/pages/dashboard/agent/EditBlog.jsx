import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import axios from 'axios';
import Spinner from '../../../component/Loader/Spinner';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        axiosSecure.get(`/blog/${id}`)
            .then(res => {
                setBlog(res.data);
                setPreview(res.data.image);
            })
            .catch(() => toast.error('Failed to load blog'))
            .finally(() => setLoading(false));
    }, [id, axiosSecure]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        let imageUrl = blog.image;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = res.data.imageUrl;
            } catch (err) {
                toast.error("Image upload failed");
                return;
            }
        }

        const updatedData = {
            title: blog.title,
            category: blog.category,
            description: blog.description,
            premium: parseFloat(blog.premium),
            coverageAmount: parseFloat(blog.coverageAmount),
            image: imageUrl
        };

        try {
            await axiosSecure.patch(`/blog/${id}`, updatedData);
            toast.success('Blog updated successfully!');
            navigate('/dashboard/manage-blogs');
        } catch (err) {
            toast.error('Failed to update blog');
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !blog) return <Spinner></Spinner>

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6">Edit Blog</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={blog.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <select
                    className="select select-bordered w-full"
                    value={blog.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option value="Life">Life</option>
                    <option value="Health">Health</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Investment">Investment</option>
                </select>


                <div>
                    <label className="font-medium">Description</label>
                    <textarea
                        name="description"
                        value={blog.description}
                        onChange={handleChange}
                        rows="4"
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium">Premium (৳)</label>
                        <input
                            type="number"
                            name="premium"
                            value={blog.premium}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-medium">Coverage Amount (৳)</label>
                        <input
                            type="number"
                            name="coverageAmount"
                            value={blog.coverageAmount}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="font-medium">Upload New Image (optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="file-input w-full" />
                    {preview && <img src={preview} alt="Preview" className="mt-2 w-32 rounded shadow" />}
                </div>

                <button
                    type="submit"
                    className="btn bg-sky-700 hover:bg-sky-800 text-white w-full mt-4 flex justify-center items-center gap-2"
                    disabled={updating}
                >
                    {updating ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span> Updating...
                        </>
                    ) : (
                        'Update Blog'
                    )}
                </button>
            </form>
        </div>
    );
};

export default EditBlog;
