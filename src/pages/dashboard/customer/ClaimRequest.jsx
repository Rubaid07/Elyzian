import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
const ClaimRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    applicationId: '',
    policyId: '',     
    reason: '',
    documents: ''
  });
 useEffect(() => {
  const fetchPolicyName = async () => {
    if (formData.policyId) {
      const res = await axiosSecure.get(`/api/policies/${formData.policyId}`);
      setFormData(prev => ({
        ...prev,
        policyName: res.data?.name || ''
      }));
    }
  };
  fetchPolicyName();
}, [formData.policyId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`2. handleChange triggered: name=${name}, value=${value}`);

    if (name === "applicationId") {
      const selectedApplication = policies.find(p => p._id === value);
      console.log('3. Selected Application found:', selectedApplication);

      setFormData(prev => {
        const newFormData = {
          ...prev,
          applicationId: value,
          policyId: selectedApplication ? selectedApplication.policyId : '',
        };
        console.log('4. formData after handleChange (applicationId):', newFormData);
        return newFormData;
      });
    } else {
      setFormData(prev => {
        const newFormData = { ...prev, [name]: value };
        console.log('5. formData after handleChange (other fields):', newFormData);
        return newFormData;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const claim = {
      applicationId: formData.applicationId,
      policyId: formData.policyId,          
      reason: formData.reason,
      documents: formData.documents,
      userEmail: user.email,
      status: 'pending',
      appliedAt: new Date()
    };

    console.log('6. Submitting claim object to backend:', claim); 
    console.log('   Is policyId empty?', !claim.policyId);

    try {
      await axiosSecure.post('/claims', claim);
      toast.success('Claim request submitted successfully!');
      setFormData({ applicationId: '', policyId: '', reason: '', documents: '' });
    } catch (error) {
      console.error('Claim submission error:', error);
      toast.error(`Failed to submit claim: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Claim Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Policy</label>
          <select
            name="applicationId"
            value={formData.applicationId} 
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select your policy</option>
            {policies.map(policy => ( 
              <option key={policy._id} value={policy._id}>
                {policy.policyName} ({policy.policyNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reason for Claim</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={4}
            className="textarea textarea-bordered w-full"
            placeholder="Describe the reason for your claim"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Supporting Documents (Optional)</label>
          <input
            type="url"
            name="documents"
            value={formData.documents}
            onChange={handleChange}
            placeholder="Link to documents (Google Drive, etc)"
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn bg-sky-700 hover:bg-sky-800 text-white w-full mt-4 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span> Submitting...
            </>
          ) : (
            'Submit Claim'
          )}
        </button>
      </form>
    </div>
  );
};

export default ClaimRequest;