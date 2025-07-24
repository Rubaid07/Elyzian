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
    const [summaryValue, setSummaryValue] = useState(''); 
    const maxSummaryChars = 300; 
    useEffect(() => {
        axiosSecure.get(`/blog/${id}`)
            .then(res => {
                setBlog(res.data);
                setPreview(res.data.imageUrl); 
                setSummaryValue(res.data.summary || ''); 
            })
            .catch((err) => {
                console.error("Failed to load blog:", err);
                toast.error('Failed to load blog data.');
            })
            .finally(() => setLoading(false));
    }, [id, axiosSecure]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleSummary = (e) => {
        const text = e.target.value;
        if (text.length <= maxSummaryChars) {
            setSummaryValue(text);
            setBlog(prev => ({ ...prev, summary: text })); 
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        let imageUrl = blog.imageUrl;
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = res.data.imageUrl;
            } catch (err) {
                console.error("Image upload failed:", err);
                toast.error("Image upload failed. Please try again.");
                setUpdating(false);
                return;
            }
        }

        const updatedData = {
            title: blog.title,
            summary: blog.summary,
            content: blog.content, 
            imageUrl: imageUrl 
        };

        try {
            await axiosSecure.patch(`/blog/${id}`, updatedData);
            toast.success('Blog updated successfully!');
            navigate('/dashboard/manage-blogs');
        } catch (err) {
            console.error("Error updating blog:", err.response ? err.response.data : err.message);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to update blog.';
            toast.error(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !blog) return <Spinner />;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Blog Post</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={blog.title || ''} 
                        onChange={handleInputChange}
                        className="input input-bordered w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter blog title"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">Summary (for blog card)</label>
                    <textarea
                        id="summary"
                        name="summary"
                        value={summaryValue}
                        onChange={handleSummary}
                        rows="3"
                        className="textarea textarea-bordered w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Provide a brief summary for the blog card (max ${maxSummaryChars} characters)`}
                        required
                    />
                    <p className="text-right text-sm text-gray-500 mt-1">
                        {summaryValue.length}/{maxSummaryChars} characters
                    </p>
                </div>

                <div>
                    <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={blog.content || ''}
                        onChange={handleInputChange}
                        rows="10"
                        className="textarea textarea-bordered w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your blog content here..."
                        required
                    />
                </div>

                <div>
                    <label className="font-medium">Upload New Image (optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="file-input w-full" />
                    {preview && <img src={preview} alt="Preview" className="mt-2 w-32 rounded shadow" />}
                </div>

                <button
                    type="submit"
                    className="btn bg-sky-700 hover:bg-sky-800 text-white w-full py-3 rounded-md transition duration-300 ease-in-out flex justify-center items-center gap-2"
                    disabled={updating}
                >
                    {updating ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span> Updating Blog...
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