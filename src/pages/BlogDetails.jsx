import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router'; 
import toast from 'react-hot-toast'; 
import useAxiosSecure from '../hooks/useAxiosSecure';
import Spinner from '../component/Loader/Spinner';

const BlogDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure(); 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError("Blog ID is missing.");
            toast.error("Blog ID is missing.");
            return;
        }

        setLoading(true);
        axiosSecure.get(`/blog/${id}`) 
            .then(res => {
                setBlog(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching blog details:", err);
                setError("Failed to load blog details.");
                toast.error("Failed to load blog details.");
                setLoading(false);
            });
    }, [id, axiosSecure]);

    if (loading) {
        return <Spinner />; 
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">Blog not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg my-10">
            {blog.imageUrl && (
                <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-full h-96 object-cover rounded-lg mb-6 shadow-md" 
                />
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
            </h1>

            <div className="flex items-center text-gray-600 text-sm mb-6">
                <span className="mr-4">By <strong className="text-sky-700">{blog.creatorName || 'Unknown Author'}</strong></span>
                <span>Published on {new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                <strong className="font-semibold">Summary:</strong> {blog.summary}
            </p>

            <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                <p>{blog.content}</p> 
            </div>
        </div>
    );
};

export default BlogDetails;