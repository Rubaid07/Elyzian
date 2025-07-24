import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaPhoneAlt, FaUser, FaSignInAlt } from 'react-icons/fa';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [lastSignInTime, setLastSignInTime] = useState(null);

  useEffect(() => {
    const profileData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const profileRes = await axiosSecure.get(`/users/${user.email}`);
        setUserInfo(profileRes.data);
        setFormData(profileRes.data);
        setImagePreview(profileRes.data.photo || 'https://i.ibb.co/5GzXkwq/user.png');

        if (auth.currentUser && auth.currentUser.metadata.lastSignInTime) {
          setLastSignInTime(auth.currentUser.metadata.lastSignInTime);
        }

      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        Swal.fire({
          title: 'Error', 
          text: 'Failed to load profile data.', 
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    profileData();
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
      
      setIsModalOpen(false);
      Swal.fire('Updated!', 'Profile information updated.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setImageFile(null);
    setImagePreview(userInfo.photo || 'https://i.ibb.co/5GzXkwq/user.png');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading || !userInfo) return <Spinner />;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
         
          <div className=" p-6 sm:p-8 bg-sky-50 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
            <p className="opacity-90 mt-2 text-sm sm:text-base">Manage your account information</p>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="mb-6">
                <img
                  src={userInfo.photo || 'https://i.ibb.co/5GzXkwq/user.png'}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                {userInfo.name}
              </h2>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-semibold capitalize">
                {userInfo.role}
              </div>

              {lastSignInTime && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center w-full">
                  <p className="text-gray-600 flex items-center gap-2 text-xs sm:text-sm justify-center">
                    <FaSignInAlt className="text-purple-500" /> 
                    <span>Last Login: {new Date(lastSignInTime).toLocaleString()}</span>
                  </p>
                </div>
              )}

              <button
                onClick={openModal}
                className="mt-6 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow transition-colors duration-300 text-sm sm:text-base cursor-pointer"
              >
                <FaEdit className="text-sm" /> Edit Profile
              </button>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Personal Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 text-gray-600 font-medium text-sm sm:text-base mb-1 sm:mb-0">Full Name</div>
                    <div className="w-full sm:w-2/3 text-gray-800 text-sm sm:text-base">{userInfo.name}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 text-gray-600 font-medium text-sm sm:text-base mb-1 sm:mb-0">Email</div>
                    <div className="w-full sm:w-2/3 text-gray-800 text-sm sm:text-base flex items-center gap-2">
                     {userInfo.email}
                    </div>
                  </div>
                  {userInfo.phone && (
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/3 text-gray-600 font-medium text-sm sm:text-base mb-1 sm:mb-0">Phone</div>
                      <div className="w-full sm:w-2/3 text-gray-800 text-sm sm:text-base flex items-center gap-2">
                        <FaPhoneAlt className="text-green-500 text-sm" /> {userInfo.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Edit Profile</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Photo</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={imagePreview} alt="Profile preview" />
                  </div>
                </div>
                <label className="cursor-pointer">
                  <div className="btn btn-outline">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;