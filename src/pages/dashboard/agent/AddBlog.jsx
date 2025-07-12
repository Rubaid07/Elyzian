import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddBlog = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const policyData = {
      title: data.title,
      description: data.description,
      premium: parseFloat(data.premium),
      coverageAmount: parseFloat(data.coverageAmount),
      image: data.image,
    };

    try {
      const res = await axiosSecure.post('/policies', policyData);
      if (res.data.insertedId || res.data.acknowledged) {
        toast.success('Policy created successfully!');
        reset();
        navigate('/dashboard/manage-policies');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create policy');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Policy</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-medium">Title</label>
          <input
            {...register('title', { required: true })}
            type="text"
            className="input input-bordered w-full"
            placeholder="Policy Title"
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            {...register('description', { required: true })}
            className="textarea textarea-bordered w-full"
            rows="4"
            placeholder="Policy Description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Premium (৳)</label>
            <input
              {...register('premium', { required: true })}
              type="number"
              className="input input-bordered w-full"
              placeholder="Monthly Premium"
            />
          </div>

          <div>
            <label className="font-medium">Coverage Amount (৳)</label>
            <input
              {...register('coverageAmount', { required: true })}
              type="number"
              className="input input-bordered w-full"
              placeholder="Coverage Amount"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Image URL</label>
          <input
            {...register('image', { required: true })}
            type="text"
            className="input input-bordered w-full"
            placeholder="Image URL"
          />
        </div>

        <button type="submit" className="btn bg-sky-700 hover:bg-sky-800 text-white w-full mt-4">
          Create Policy
        </button>
      </form>
    </div>
  );
};

export default AddBlog;