import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import axios from 'axios';

const AddBlog = () => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const summaryValue = watch('summary', '');
  const maxSummaryChars = 300; 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };
  const handleSummary = (e) => {
    const text = e.target.value;
    if (text.length <= maxSummaryChars) {
      setValue('summary', text, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let imageUrl = null;

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
        setLoading(false);
        return;
      }
    }

    const blogData = {
      title: data.title,
      content: data.content,
      summary: data.summary,
      imageUrl: imageUrl,
    };

    try {
      const res = await axiosSecure.post('/blog', blogData);
      if (res.data.insertedId) {
        toast.success('Blog published successfully!');
        reset();
        setImageFile(null);
        setPreview(null);
        navigate('/dashboard/manage-blogs');
      } else {
        toast.error('Failed to publish blog. Please check your inputs.');
      }
    } catch (err) {
      console.error("Error publishing blog:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to publish blog.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create New Blog Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input input-bordered w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">Summary (for blog card)</label>
          <textarea
            id="summary"
            {...register('summary', { 
              required: 'Summary is required',
              maxLength: { value: maxSummaryChars, message: `Summary cannot exceed ${maxSummaryChars} characters.` } 
            })}
            value={summaryValue}
            onChange={handleSummary}
            rows="3"
            className="textarea textarea-bordered w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Provide a brief summary for the blog card (max ${maxSummaryChars} characters)`}
          />
          <p className="text-right text-sm text-gray-500 mt-1">
            {summaryValue.length}/{maxSummaryChars} characters
          </p>
          {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>}
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
          <textarea
            id="content"
            {...register('content', { required: 'Content is required' })}
            rows="10"
            className="textarea textarea-bordered w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog content here..."
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>
        <div>
          <label className="font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input w-full" />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-32 rounded shadow" />}
        </div>

        <button
          type="submit"
          className="btn bg-sky-700 hover:bg-sky-800 text-white w-full py-3 rounded-md transition duration-300 ease-in-out flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span> Publishing Blog...
            </>
          ) : (
            'Publish Blog'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;