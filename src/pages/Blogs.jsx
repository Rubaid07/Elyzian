import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { FaCalendarAlt, FaEye, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import Spinner from '../component/Loader/Spinner';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`); 
        setBlogs(response.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateContent = (text, wordLimit = 20) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit 
      ? words.slice(0, wordLimit).join(' ') + '...' 
      : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-16 h-16 text-sky-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <p className="text-red-700 font-medium text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 max-w-md">
          <p className="text-sky-700 font-medium text-xl">No blogs available at the moment. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest <span className="text-sky-600">Articles</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insightful articles and stay updated with our latest insurance knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div 
              key={blog._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={blog.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {truncateContent(blog.content, 25)}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={blog.creatorImage || 'https://i.ibb.co/VtWn3mS/user.png'} 
                      alt={blog.creatorName} 
                      className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {blog.creatorName || 'Unknown Author'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaCalendarAlt className="mr-1 text-sky-500" />
                      <span>
                        {blog.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <FaEye className="mr-1 text-sky-500" />
                    <span>{blog.totalVisits || 0} views</span>
                  </div>
                  <Link 
                    to={`/blog-details/${blog._id}`}
                    className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
                  >
                    Read more <FaArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;