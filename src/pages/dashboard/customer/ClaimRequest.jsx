import React, { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../component/Loader/Spinner';
import { FaFileContract, FaRegLightbulb, FaCloudUploadAlt, FaPaperPlane, FaListAlt, FaInfoCircle } from 'react-icons/fa';

const ClaimRequest = () => {
  const { user, loading: userLoading } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [componentLoading, setComponentLoading] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    applicationId: '',
    policyId: '',
    policyName: '',
    policyNumber: '',
    reason: '',
    documents: ''
  });

  useEffect(() => {
    const approvePolicyAndClaim = async () => {
      if (!user?.email) {
        setComponentLoading(false);
        return;
      }
      try {
        const policiesRes = await axiosSecure.get(`/policies/my?email=${user.email}`);
        setPolicies(policiesRes.data || []);
        const claimsRes = await axiosSecure.get(`/claims/my?email=${user.email}`);
        setUserClaims(claimsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch user policies or claims:', error);
        toast.error('Failed to load your data.');
      } finally {
        setComponentLoading(false);
      }
    };

    if (!userLoading) {
      approvePolicyAndClaim();
    }
  }, [user, userLoading, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "applicationId") {
      const selectedApplication = policies.find(p => p._id.toString() === value);
      setFormData(prev => ({
        ...prev,
        applicationId: value,
        policyId: selectedApplication?.policyId?.toString() || '',
        policyName: selectedApplication?.policyName || '',
        policyNumber: selectedApplication?.policyNumber || '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setComponentLoading(true);

    if (!formData.applicationId || !formData.policyId || !formData.reason) {
      toast.error('Please select a policy and provide a reason for the claim.');
      setComponentLoading(false);
      return;
    }

    const claim = {
      applicationId: formData.applicationId,
      policyId: formData.policyId,
      policyName: formData.policyName,
      policyNumber: formData.policyNumber,
      reason: formData.reason,
      documents: formData.documents,
      userEmail: user.email,
      status: 'pending',
      appliedAt: new Date()
    };

    try {
      const res = await axiosSecure.post('/claims', claim);
      toast.success('Claim request submitted successfully!');
      setFormData({ applicationId: '', policyId: '', policyName: '', policyNumber: '', reason: '', documents: '' });
      setUserClaims(prevClaims => [{ ...claim, _id: res.data.insertedId }, ...prevClaims]);
    } catch (error) {
      console.error('Claim submission error:', error);
      toast.error(`Failed to submit claim: ${error.response?.data?.message || error.message}`);
    } finally {
      setComponentLoading(false);
    }
  };

  if (userLoading || componentLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Submit a Claim Request</h2>
        <p className="text-gray-600 text-center mb-8">Please fill out the form below to submit your claim.</p>

        {policies.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <FaFileContract className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-700 font-semibold mb-2">No approved policies found.</p>
            <p className="text-gray-500">You can only request claims for approved policies.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <div>
              <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
                <FaFileContract className="inline mr-2 text-blue-500" /> Select Your Policy
              </label>
              <select
                id="applicationId"
                name="applicationId"
                value={formData.applicationId}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="" disabled>Select an approved policy</option>
                {policies.map(policy => (
                  <option key={policy._id} value={policy._id.toString()}>
                    {policy.policyName} {policy.policyNumber ? `(${policy.policyNumber})` : ''} - ID: {policy._id.toString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                <FaRegLightbulb className="inline mr-2 text-orange-500" /> Reason for Claim
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={5}
                className="textarea textarea-bordered w-full"
                placeholder="Describe the incident or reason for your claim in detail."
              />
            </div>

            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-2">
                <FaCloudUploadAlt className="inline mr-2 text-green-500" /> Supporting Documents (Optional)
              </label>
              <input
                id="documents"
                type="url"
                name="documents"
                value={formData.documents}
                onChange={handleChange}
                placeholder="Paste Google Drive / Dropbox link"
                className="input input-bordered w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload documents like medical/police reports to cloud storage and paste the shareable link here.
              </p>
            </div>

            <button
              type="submit"
              className="btn bg-sky-700 hover:bg-sky-800 text-white w-full py-3 text-lg font-semibold shadow-md"
              disabled={componentLoading}
            >
              {componentLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span> Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Submit Claim
                </>
              )}
            </button>
          </form>
        )}
      </div>
      <div className='mt-10 max-w-6xl mx-auto'>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          <FaListAlt className="inline mr-2 text-purple-600" /> Your Claim History
        </h3>

        {userClaims.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-lg text-gray-700 font-semibold mb-2">No claims submitted yet.</p>
            <p className="text-gray-500">Submit a claim using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th>Policy Name</th>
                  <th>Status</th>
                  <th>Applied At</th>
                  <th>Documents</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userClaims.map(claim => (
                  <tr key={claim._id} className="hover:bg-gray-50 text-sm">
                    <td className="font-semibold">{claim.policyName}</td>
                    <td>
                      <span className={`badge ${
                        claim.status === 'pending' ? 'badge-info' :
                        claim.status === 'approved' ? 'badge-success' :
                        'badge-error'
                      } text-white`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>{new Date(claim.appliedAt).toLocaleDateString()}</td>
                    <td>
                      {claim.documents ? (
                        <a href={claim.documents} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Docs</a>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() => setSelectedClaim(claim)}
                      >
                        <FaInfoCircle className="mr-1" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedClaim && (
        <dialog id="claim_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-xl">
            <h3 className="font-bold text-lg mb-2 text-sky-700">Claim Details</h3>
            <p><strong>Policy Name:</strong> {selectedClaim.policyName}</p>
            <p><strong>Status:</strong> {selectedClaim.status}</p>
            <p><strong>Applied At:</strong> {new Date(selectedClaim.appliedAt).toLocaleString()}</p>
            <p className="mt-3"><strong>Reason:</strong><br />{selectedClaim.reason}</p>
            <p className="mt-3"><strong>Documents:</strong><br />
              {selectedClaim.documents ? (
                <a href={selectedClaim.documents} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Documents</a>
              ) : 'N/A'}
            </p>
            <div className="modal-action">
              <button onClick={() => setSelectedClaim(null)} className="btn btn-sm btn-error text-white">Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ClaimRequest;
