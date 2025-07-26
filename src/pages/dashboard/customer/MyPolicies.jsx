import React, { use, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaEye, FaFileDownload, FaStar, FaCalendarAlt, FaUser, FaIdCard, FaHome, FaFileAlt } from 'react-icons/fa';
import { MdEmail, MdAssignment, MdMedicalServices } from "react-icons/md";
import { useForm } from 'react-hook-form';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ReviewModal = ({ closeModal, onSubmitReview, modalRef }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [selectedRating, setSelectedRating] = useState(null);

  const feedbackValue = watch('feedback', '');
  const charCount = feedbackValue.length;
  const maxChars = 200;

  const handleRating = (value) => {
    setSelectedRating(value);
    setValue('rating', value);
  };

  const handleFormSubmit = (data) => {
    onSubmitReview(data);
    reset();
    setSelectedRating(null);
  };

  return (
    <dialog id="review_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Leave a Review</h3>
          <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="rating rating-lg">
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name="rating"
                  value={value}
                  className="mask mask-star-2 bg-orange-400"
                  checked={selectedRating === value}
                  onChange={() => handleRating(value)}
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
            <label className="block font-medium text-gray-700 mb-2">Feedback</label>
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
          <div className="modal-action">
            <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white">Submit Review</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const PolicyDetailsModal = ({ policy, onClose }) => {
  if (!policy) return null;

  return (
    <dialog open className="modal sm:modal-middle">
      <div className="modal-box max-w-3xl w-full max-h-[90vh] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h3 className="font-bold text-xl">Policy Application Details</h3>
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2 bg-white/10 border-none hover:bg-white/20"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Applicant Information
              </h4>
              <div className="space-y-3">
                <Details icon={<FaUser />} label="Name" value={policy.applicantName || 'N/A'} />
                <Details icon={<MdEmail />} label="Email" value={policy.email || 'N/A'} />
                <Details icon={<FaHome />} label="Address" value={policy.address || 'N/A'} />
                <Details icon={<FaIdCard />} label="NID/SSN" value={policy.nidSsn || 'N/A'} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" />
                Policy Information
              </h4>
              <div className="space-y-3">
                <Details icon={<FaFileAlt />} label="Policy Name" value={policy.policyName || 'N/A'} />
                <Details icon={<FaFileAlt />} label="Policy ID" value={policy.policyId || 'N/A'} />
                <Details icon={<FaCalendarAlt />} label="Applied On" 
                  value={new Date(policy.appliedAt).toLocaleString()} />
                <Details icon={<MdAssignment />} label="Assigned Agent" 
                  value={policy.assignedAgent || 'N/A'} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <MdMedicalServices className="mr-2 text-blue-500" />
                Health Information
              </h4>
              <div className="space-y-3">
                <Details icon={<MdMedicalServices />} label="Consumes Alcohol" 
                  value={policy.consumesAlcohol ? 'Yes' : 'No'} />
                <Details icon={<MdMedicalServices />} label="Hospitalized Before" 
                  value={policy.hasBeenHospitalized ? 'Yes' : 'No'} />
                <Details icon={<MdMedicalServices />} label="Pre-existing Conditions" 
                  value={policy.hasPreExistingConditions ? 'Yes' : 'No'} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Nominee Information
              </h4>
              <div className="space-y-3">
                <Details icon={<FaUser />} label="Nominee Name" 
                  value={policy.nomineeName || 'N/A'} />
                <Details icon={<FaUser />} label="Nominee Relationship" 
                  value={policy.nomineeRelationship || 'N/A'} />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-gray-800 mb-4">Application Status</h4>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                policy.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                policy.status === 'approved' ? 'bg-green-100 text-green-800' :
                policy.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {policy.status}
              </span>
              {policy.paymentStatus?.toLowerCase() === 'paid' && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Payment: Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-action sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="btn btn-ghost hover:bg-gray-100">Close</button>
        </div>
      </div>
    </dialog>
  );
};

const Details = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const MyPolicies = () => {
  const { user, loading: userLoading } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedPolicyForReview, setSelectedPolicyForReview] = useState(null);
  const reviewModalRef = useRef(null);

  useEffect(() => {
    if (!user || userLoading) {
      setLoadingApp(false);
      return;
    }

    const myApplicationsData = async () => {
      try {
        const res = await axiosSecure.get(`/applications/my-applications?email=${user.email}`);
        setApplications(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingApp(false);
      }
    };

    myApplicationsData();
  }, [user, userLoading, axiosSecure]);

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
        Swal.fire({
          title: 'Success!', 
          text: 'Review submitted successfully!', 
          icon: 'success'
        });
        reviewModalRef.current.close();
        setSelectedPolicyForReview(null);
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: 'Error!', 
        text: 'Failed to submit review.', 
        icon: 'error'
      });
    }
  };

  const handleDownloadPolicy = (policy) => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Policy Document', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Company Name', 20, 30); 
    doc.text('Date: ' + new Date().toLocaleDateString(), 160, 30);
    doc.setFontSize(14);
    doc.text('Policy Holder Information:', 20, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${policy.applicantName || 'N/A'}`, 20, 60);
    doc.text(`Email: ${policy.email || 'N/A'}`, 20, 68);
    doc.text(`Address: ${policy.address || 'N/A'}`, 20, 76);
    doc.text(`NID/SSN: ${policy.nidSsn || 'N/A'}`, 20, 84);
    doc.setFontSize(14);
    doc.text('Policy Details:', 20, 100);
    doc.setFontSize(12);
    doc.text(`Policy Name: ${policy.policyName || 'N/A'}`, 20, 110);
    doc.text(`Policy ID: ${policy.policyId || 'N/A'}`, 20, 118);
    doc.text(`Policy Number: ${policy.policyNumber || 'N/A'}`, 20, 126);
    doc.text(`Applied On: ${new Date(policy.appliedAt).toLocaleDateString()}`, 20, 134);
    doc.text(`Status: ${policy.status || 'N/A'}`, 20, 142);
    doc.text(`Assigned Agent: ${policy.assignedAgent || 'N/A'}`, 20, 150);
    doc.setFontSize(14);
    doc.text('Payment Information:', 20, 166);
    doc.setFontSize(12);
    doc.text(`Premium Amount: BDT ${policy.premiumAmount?.toLocaleString() || 'N/A'}`, 20, 176);
    doc.text(`Payment Frequency: ${policy.paymentFrequency || 'N/A'}`, 20, 184);
    doc.text(`Payment Status: ${policy.paymentStatus || 'N/A'}`, 20, 192);
    doc.text(`Transaction ID: ${policy.transactionId || 'N/A'}`, 20, 200);
    doc.text(`Payment Date: ${policy.paymentDate ? new Date(policy.paymentDate).toLocaleDateString() : 'N/A'}`, 20, 208);
    doc.setFontSize(14);
    doc.text('Nominee Details:', 20, 224);
    doc.setFontSize(12);
    doc.text(`Nominee Name: ${policy.nomineeName || 'N/A'}`, 20, 234);
    doc.text(`Nominee Relationship: ${policy.nomineeRelationship || 'N/A'}`, 20, 242);
    doc.setFontSize(14);
    doc.text('Health Information:', 20, 258);
    doc.setFontSize(12);
    doc.text(`Consumes Alcohol: ${policy.consumesAlcohol ? 'Yes' : 'No'}`, 20, 268);
    doc.text(`Hospitalized Before: ${policy.hasBeenHospitalized ? 'Yes' : 'No'}`, 20, 276);
    doc.text(`Pre-existing Conditions: ${policy.hasPreExistingConditions ? 'Yes' : 'No'}`, 20, 284);
    doc.save(`Policy_${policy.policyName.replace(/\s/g, '_')}_${policy.applicantName.replace(/\s/g, '_')}.pdf`);
    toast.success('Policy document downloaded!')
  };

  if (userLoading || loadingApp) return <Spinner />;

  if (applications.length === 0) {
    return (
      <div className="md:p-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaFileAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policy applications found</h3>
            <p className="text-gray-500">Click "Get Quote" on a policy to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Policy Applications</h2>
            <p className="text-gray-600">View and manage all your applied policies</p>
          </div>
          <div className="text-sm text-gray-500">
            Total Applications: <span className="font-semibold">{applications.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.policyName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <FaCalendarAlt className="inline mr-1 text-gray-400" />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedPolicy(app)}
                        className="flex items-center gap-2 btn px-3 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <FaEye /> <span>View</span>
                      </button>
                      {app.status === 'approved' && (
                        <>
                          <button
                            onClick={() => handleGiveReview(app)}
                            className="flex items-center gap-2 btn px-3 bg-green-500 hover:bg-green-600 text-white"
                          >
                            <FaStar /> <span>Review</span>
                          </button>
                          <button
                            onClick={() => handleDownloadPolicy(app)}
                            className="flex items-center gap-2 btn px-3 bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            <FaFileDownload /> <span>Download</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewModal
        modalRef={reviewModalRef}
        closeModal={() => reviewModalRef.current.close()}
        onSubmitReview={onSubmitReview}
      />

      {selectedPolicy && (
        <PolicyDetailsModal 
          policy={selectedPolicy} 
          onClose={() => setSelectedPolicy(null)} 
        />
      )}
    </div>
  );
};

export default MyPolicies;