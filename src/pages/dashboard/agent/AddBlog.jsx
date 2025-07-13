import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import axios from 'axios';

const AddBlog = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
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
        toast.error("Image upload failed");
        return;
      }
    }

    const blogData = {
      title: data.title,
      category: data.category,
      description: data.description,
      premium: parseFloat(data.premium),
      coverageAmount: parseFloat(data.coverageAmount),
      image: imageUrl,
    };

    try {
      const res = await axiosSecure.post('/blog', blogData);
      if (res.data.insertedId || res.data.acknowledged) {
        toast.success('Policy created successfully!');
        reset();
        setImageFile(null);
        navigate('/dashboard/manage-blogs');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Create New Blog</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-medium">Title</label>
          <input {...register('title', { required: true })} className="input input-bordered w-full" />
        </div>

        <select
          {...register('category', { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Category</option>
          <option value="Life">Life</option>
          <option value="Health">Health</option>
          <option value="Retirement">Retirement</option>
          <option value="Investment">Investment</option>
        </select>


        <div>
          <label className="font-medium">Description</label>
          <textarea {...register('description', { required: true })} rows="4" className="textarea textarea-bordered w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Premium (৳)</label>
            <input {...register('premium', { required: true })} type="number" className="input input-bordered w-full" />
          </div>

          <div>
            <label className="font-medium">Coverage Amount (৳)</label>
            <input {...register('coverageAmount', { required: true })} type="number" className="input input-bordered w-full" />
          </div>
        </div>

        <div>
          <label className="font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input w-full" />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-32 rounded shadow" />}
        </div>

        <button
          type="submit"
          className="btn bg-sky-700 hover:bg-sky-800 text-white w-full mt-4 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span> Publishing...
            </>
          ) : (
            'Publish'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
