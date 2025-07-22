import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { format } from 'date-fns';
import { FaCalendarAlt, FaUser, FaEye, FaArrowLeft } from 'react-icons/fa';
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

        const fetchBlog = async () => {
            try {
                const res = await axiosSecure.get(`/blog/${id}`);
                setBlog(res.data);
            } catch (err) {
                console.error("Error fetching blog details:", err);
                setError("Failed to load blog details.");
                toast.error("Failed to load blog details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, axiosSecure]);

    if (loading) return <Spinner></Spinner>

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
                    <p className="text-red-700 font-medium text-xl">{error}</p>
                    <Link to="/blogs" className="mt-4 inline-flex items-center text-dky-600 hover:text-sky-700">
                        <FaArrowLeft className="mr-2" /> Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-sky-50 border-l-4 border-sky-500 p-4 max-w-md">
                    <p className="text-sky-700 font-medium text-xl">Blog not found</p>
                    <Link to="/blogs" className="mt-4 inline-flex items-center text-sky-600 hover:text-sky-700">
                        <FaArrowLeft className="mr-2" /> Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white md:py-16 py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link 
                        to="/blogs" 
                        className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> All Articles
                    </Link>
                </div>

                <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {blog.imageUrl && (
                        <div className="relative h-96 w-full overflow-hidden">
                            <img 
                                src={blog.imageUrl} 
                                alt={blog.title} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                    {blog.title}
                                </h1>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-gray-600">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 mr-3">
                                    <img 
                                        src={blog.creatorImage || 'https://i.ibb.co/VtWn3mS/user.png'} 
                                        alt={blog.creatorName} 
                                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {blog.creatorName || 'Unknown Author'}
                                    </p>
                                    <div className="flex items-center text-sm">
                                        <FaCalendarAlt className="mr-1 text-sky-500" />
                                        <span>
                                            {blog.createdAt ? format(new Date(blog.createdAt), 'MMMM d, yyyy') : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center text-sm">
                                <FaEye className="mr-1 text-sky-500" />
                                <span>{blog.totalVisits || 0} views</span>
                            </div>
                        </div>

                        {blog.summary && (
                            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg mb-8">
                                <p className="text-lg text-gray-800 leading-relaxed">
                                    <strong className="font-semibold">Summary:</strong> {blog.summary}
                                </p>
                            </div>
                        )}

                        <div className="prose max-w-none text-gray-700 leading-relaxed">
                            {blog.content.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </article>

                <div className="mt-12 text-center">
                    <Link 
                        to="/blogs" 
                        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition shadow-md hover:shadow-lg"
                    >
                        <FaArrowLeft className="mr-2" /> Back to All Articles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;