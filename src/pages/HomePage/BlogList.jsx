import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Spinner from '../../component/Loader/Spinner';
import { FaCalendarAlt, FaArrowRight, FaEye } from 'react-icons/fa';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(blogs);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/latest-blogs`);
                setBlogs(response.data);
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner className="w-16 h-16" />
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Blogs Found</h3>
                    <p className="text-gray-600">Check back later for new articles!</p>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Latest <span className="text-sky-600">Blog Articles</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover insightful articles and stay updated with our latest insurance tips and news.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {blogs.map(blog => (
                        <div 
                            key={blog._id} 
                            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                        >
                            {blog.imageUrl && (
                                <div className="h-60 overflow-hidden">
                                    <img 
                                        src={blog.imageUrl} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            )}
                            
                            <div className="p-6">
                                <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                                   <div className='flex items-center'>
                                     <FaCalendarAlt className="mr-2 text-blue-500" />
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                   </div>
                                    <div className="flex items-center">
                                                        <FaEye className="mr-1 text-blue-500" />
                                                        <span>{blog.totalVisits || 0} views</span>
                                                      </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-gray-600 mb-5 line-clamp-3">
                                    {blog.summary}
                                </p>
                                
                                <Link 
                                    to={`/blog-details/${blog._id}`}
                                    className="inline-flex items-center text-sky-600 font-medium hover:text-sky-700 transition-colors"
                                >
                                    Read More <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                    <div className="text-center mt-12">
                        <Link 
                            to="/blogs" 
                            className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition shadow-md hover:shadow-lg"
                        >
                            View All Articles
                        </Link>
                    </div>
            </div>
        </section>
    );
};

export default BlogList;