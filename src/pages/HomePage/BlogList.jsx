import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';
import Spinner from '../../component/Loader/Spinner';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(blogs);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/latest-blogs`)
            .then(res => {
                setBlogs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blogs for homepage:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spinner></Spinner>
    }

    if (blogs.length === 0) {
        return <p>No blogs to display at the moment.</p>;
    }

    return (
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {blog.imageUrl && (
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{blog.summary}</p>
                            <p className="text-gray-500 text-xs">Published on: {new Date(blog.createdAt).toLocaleDateString()}</p>
                            <Link to={`/blog-details/${blog._id}`} className="btn btn-sm mt-3 bg-blue-500 text-white hover:bg-blue-600">Read More</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;