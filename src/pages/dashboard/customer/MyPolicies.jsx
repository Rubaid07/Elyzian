import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const ReviewModal = ({ closeModal, onSubmitReview, modalRef }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [selectedRating, setSelectedRating] = useState(null);

  const feedbackValue = watch('feedback', '');

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value);
    setSelectedRating(value);
    setValue('rating', value);
  };

  const handleFormSubmit = (data) => {
    onSubmitReview(data);
    reset();
    setSelectedRating(null);
  };

  const charCount = feedbackValue.length;
  const maxChars = 200;

  return (
    <dialog id="review_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="text-2xl font-semibold text-center mb-6">Leave a Review</h3>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div>
            <label className="block font-medium mb-2">Your Rating</label>
            <div className="rating rating-lg">
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name="rating"
                  value={value}
                  className="mask mask-star-2 bg-orange-400"
                  checked={selectedRating === value}
                  onChange={handleRatingChange}
                />
              ))}
            </div>
            <input
              type="hidden"
              {...register('rating', { required: 'Please select a rating' })}
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
          </div>
          <div>
            <label className="block font-medium mb-2">Feedback</label>
            <textarea
              rows="4"
              maxLength={maxChars}
              className="textarea textarea-bordered w-full"
              placeholder="Share your experience..."
              {...register('feedback', {
                required: 'Feedback is required',
                maxLength: {
                  value: maxChars,
                  message: `Feedback must not exceed ${maxChars} characters.`,
                },
              })}
            />
            <p className="text-right text-sm text-gray-500 mt-1">
              {charCount}/{maxChars} characters
            </p>
            {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white">Submit</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};


const MyPolicies = () => {
  const { user, loading: userLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [error, setError] = useState(null);
  const reviewModalRef = useRef(null);
  const [selectedPolicyForReview, setSelectedPolicyForReview] = useState(null);

  useEffect(() => {
    if (!user || userLoading) {
      setLoadingApplications(false);
      return;
    }

    const fetchMyApplications = async () => {
      try {
        const res = await axiosSecure.get(`/applications/my-applications?email=${user.email}`);
        setApplications(res.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Unable to fetch your applications.");
        toast.error("Failed to load your policies.");
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchMyApplications();
  }, [user, userLoading, axiosSecure]);

  const handleViewDetails = (app) => {
    Swal.fire({
      title: `<span style="color: #1a202c;">Application Details</span>`,
      html: `
        <div style="text-align: left; font-size: 1.1em; color: #4a5568;">
          <p><strong>Applicant Name:</strong> ${app.applicantName || 'N/A'}</p>
          <p><strong>Email:</strong> ${app.email || 'N/A'}</p>
          <p><strong>Policy Title:</strong> ${app.policyName || 'N/A'}</p>
          <p><strong>Policy ID:</strong> ${app.policyId || 'N/A'}</p>
          <p><strong>Applied Date:</strong> ${new Date(app.appliedAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="font-weight: bold; color: ${app.status === 'pending' ? '#3182ce' : app.status === 'approved' ? '#38a169' : '#e53e3e'};">${app.status}</span></p>
          ${app.paymentStatus?.toLowerCase() === 'paid' ? `<p><strong>Payment Status:</strong> <span style="font-weight: bold; color: #38a169;">Paid</span></p>` : ''}
          ${app.transactionId ? `<p><strong>Transaction ID:</strong> ${app.transactionId}</p>` : ''}
          <p><strong>Address:</strong> ${app.address || 'N/A'}</p>
          <p><strong>NID/SSN:</strong> ${app.nidSsn || 'N/A'}</p>
          <p><strong>Nominee Name:</strong> ${app.nomineeName || 'N/A'}</p>
          <p><strong>Nominee Relation:</strong> ${app.nomineeRelationship || 'N/A'}</p>
          <p><strong>Pre-Existing Conditions:</strong> ${app.hasPreExistingConditions ? 'Yes' : 'No'}</p>
          <p><strong>Been Hospitalized:</strong> ${app.hasBeenHospitalized ? 'Yes' : 'No'}</p>
          <p><strong>Consumes Alcohol:</strong> ${app.consumesAlcohol ? 'Yes' : 'No'}</p>
          <p><strong>Assigned Agent:</strong> ${app.assignedAgent || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      width: 600,
      padding: '2em',
      background: '#fff',
    });
  };

  const handleGiveReview = (policy) => {
    setSelectedPolicyForReview(policy);
    if (reviewModalRef.current) {
      reviewModalRef.current.showModal();
    }
  };

  const onSubmitReview = async (reviewData) => {
    if (!selectedPolicyForReview) return;

    const reviewPayload = {
      policyId: selectedPolicyForReview.policyId || selectedPolicyForReview._id?.toString(),
      policyName: selectedPolicyForReview.policyName || 'N/A',
      reviewerName: user?.displayName || 'Anonymous',
      reviewerEmail: user?.email,
      reviewerImage: user?.photoURL || 'https://i.ibb.co/VtWn3mS/user.png',
      rating: reviewData.rating,
      feedback: reviewData.feedback,
      submittedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post('/reviews', reviewPayload);
      if (res.data.insertedId) {
        toast.success('Review submitted successfully!');
        reviewModalRef.current.close();
        setSelectedPolicyForReview(null);
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Something went wrong while submitting your review.');
    }
  };

  if (userLoading || loadingApplications) return <Spinner />;

  if (error) {
    return (
      <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
        <p className="text-lg mb-4">{error}</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
        <p className="text-xl font-semibold mb-4">No policy applications found.</p>
        <p>Click “Get Quote” on a policy to get started.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Applied Policies</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th>#</th>
              <th>Policy Title</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id} className="hover:bg-gray-50 text-sm">
                <td>{index + 1}</td>
                <td>{app.policyName || 'N/A'}</td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      app.status === 'approved' ? 'bg-green-100 text-green-600' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-gray-200 text-gray-600'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="flex flex-wrap gap-2">
                  <button onClick={() => handleViewDetails(app)} className="btn btn-xs btn-outline btn-info">
                    View
                  </button>
                  {app.status === 'approved' && (
                    <button onClick={() => handleGiveReview(app)} className="btn btn-xs btn-outline btn-success">
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewModal
        modalRef={reviewModalRef}
        closeModal={() => reviewModalRef.current.close()}
        onSubmitReview={onSubmitReview}
      />
    </div>
  );
};

export default MyPolicies;