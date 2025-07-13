import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const ManageBlogs = () => {
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = () => {
    axiosSecure.get('/agent/my-blogs')
      .then(res => setBlogs(res.data || []))
      .catch(err => console.error('Failed to fetch blogs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    axiosSecure.delete(`/agent/my-blogs/${id}`)
      .then(res => {
        if (res.data?.deletedCount > 0) {
          toast.success('Blog deleted');
          setBlogs(prev => prev.filter(blog => blog._id !== id));
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to delete blog');
      });
  };
  const handleEdit = (id) => {
  navigate(`/dashboard/manage-blogs/edit-blog/${id}`);
};

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Manage Your Blogs</h2>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-sky-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, i) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td>{i + 1}</td>
                  <td>{blog.title}</td>
                  <td>{blog.category || 'N/A'}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
  <button
    onClick={() => handleEdit(blog._id)}
    className="btn btn-sm bg-yellow-400 text-white hover:bg-yellow-500"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(blog._id)}
    className="btn btn-sm btn-error text-white"
  >
    <FaTrashAlt /> Delete
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;