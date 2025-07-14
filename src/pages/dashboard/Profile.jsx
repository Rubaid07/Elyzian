import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaEnvelope, FaPhoneAlt, FaUser, FaBuilding, FaWallet, FaFileContract, FaBlog, FaUsers } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../../component/Loader/Spinner';
import axios from 'axios';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [dashboardCards, setDashboardCards] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProfileAndDashboardData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          axiosSecure.get(`/users/${user.email}`),
          axiosSecure.get(`/dashboard-overview?email=${user.email}`)
        ]);
        setUserInfo(profileRes.data);
        setFormData(profileRes.data);
        setDashboardCards(dashboardRes.data.cards || []);
        setImagePreview(profileRes.data.photo || 'https://i.ibb.co/5GzXkwq/user.png');
      } catch (err) {
        console.error("Failed to fetch profile or dashboard data:", err);
        Swal.fire('Error', 'Failed to load profile or dashboard data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndDashboardData();
  }, [user, axiosSecure]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(userInfo.photo || 'https://i.ibb.co/5GzXkwq/user.png');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUploadingImage(true);

    let photo = userInfo.photo;

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photo = res.data.imageUrl;
        Swal.fire('Uploaded!', 'New photo uploaded successfully.', 'success');
      } catch (err) {
        console.error("Image upload failed:", err);
        Swal.fire('Error', 'Failed to upload new photo.', 'error');
        setUploadingImage(false);
        return;
      }
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: formData.name, photoURL: photo });

        await auth.currentUser.reload();
        const updatedFirebaseUser = auth.currentUser;
        if (typeof setUser === 'function') {
          setUser((prev) => ({
            ...prev,
            displayName: updatedFirebaseUser.displayName,
            photoURL: updatedFirebaseUser.photoURL,
          }));
        }
      } else {
        console.error("No authenticated user found for Firebase profile update.");
        Swal.fire('Error', 'User not authenticated for Firebase profile update.', 'error');
        setUploadingImage(false);
        return;
      }

      await axiosSecure.put(`/users/${user.email}`, {
        name: formData.name,
        email: user.email,
        photo: photo,
      });

      setUserInfo(prev => ({ ...prev, name: formData.name, photo }));
      
      setEditMode(false);
      Swal.fire('Updated!', 'Profile information updated.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };


  if (loading || !userInfo) return <Spinner />;

  const getCardIcon = (title) => {
    switch (title) {
      case 'Total Users':
        return <FaUsers className="text-purple-600 text-3xl" />;
      case 'Total Policies':
        return <FaFileContract className="text-green-600 text-3xl" />;
      case 'Total Transactions':
        return <FaWallet className="text-blue-600 text-3xl" />;
      case 'Assigned Customers':
        return <FaUser className="text-yellow-600 text-3xl" />;
      case 'Your Blogs':
        return <FaBlog className="text-red-600 text-3xl" />;
      case 'My Policies':
        return <FaFileContract className="text-green-600 text-3xl" />;
      case 'Claim Requests':
        return <FaBuilding className="text-orange-600 text-3xl" />;
      default:
        return <FaUser className="text-gray-600 text-3xl" />;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <img
            src={userInfo.photo || 'https://i.ibb.co/5GzXkwq/user.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-600" /> {userInfo.name}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <FaEnvelope className="text-blue-500" /> {userInfo.email}
            </p>
            {userInfo.phone && (
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <FaPhoneAlt className="text-green-500" /> {userInfo.phone}
              </p>
            )}
            <p className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block text-sm capitalize">
              Role: {userInfo.role}
            </p>
          </div>
          <button
            onClick={() => {
              setEditMode(true);
              setImageFile(null);
              setImagePreview(userInfo.photo || 'https://i.ibb.co/5GzXkwq/user.png');
            }}
            className="btn w-max border-sky-700 bg-transparent text-sky-700 mt-4 md:mt-0 hover:bg-sky-700 hover:text-white"
          >
            <FaEdit className="mr-1" /> Edit Profile
          </button>
        </div>
        {dashboardCards.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
                >
                  <div className="flex-shrink-0">
                    {getCardIcon(card.title)}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {editMode && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="input input-bordered w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>

              <div>
                <label className="label">Upload New Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Profile Preview" className="mt-2 w-32 h-32 rounded-full object-cover shadow border-2 border-gray-200" />
                )}
              </div>
              <div className="modal-action flex justify-between items-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button onClick={() => setEditMode(false)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
      )}

    </div>
  );
};

export default Profile;
