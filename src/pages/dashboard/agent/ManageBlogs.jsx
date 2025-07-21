import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/agent/my-blogs/${id}`)
          .then(res => {
            if (res.data?.deletedCount > 0) {
              setBlogs(prev => prev.filter(blog => blog._id !== id));
              Swal.fire({
                title: "Deleted!",
                text: "Your blog has been deleted.",
                icon: "success"
              });
            } else {
                Swal.fire({
                    title: 'Failed',
                    text: 'Failed to delete blog: No blog found or already deleted.',
                    icon: 'error'
                });
            }
          })
          .catch(err => {
            console.error(err);
            Swal.fire({
              title: 'Failed',
              text: 'Failed to delete blog. An error occurred.',
              icon: 'error'
            });
          });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/manage-blogs/edit-blog/${id}`);
  };

  const handleAddBlog = () => {
    navigate('/dashboard/add-blog');
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Your Blogs</h2>
        <button
          onClick={handleAddBlog}
          className="btn bg-sky-700 hover:bg-sky-800 text-white flex items-center gap-2"
        >
          <FaPlus /> Add New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs found. Click "Add New Blog" to create one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, i) => (
                <tr key={blog._id}>
                  <td>{i + 1}</td>
                  <td>{blog.title}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="btn btn-sm bg-sky-400 text-white hover:bg-sky-500"
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