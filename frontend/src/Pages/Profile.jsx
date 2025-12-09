import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    photoURL: "",
  });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        phone: response.data.phone || "",
        photoURL: response.data.photoURL || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let photoURL = formData.photoURL;

      // Upload new photo if selected
      if (photoFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", photoFile);
        const imageResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`,
          imageFormData
        );
        photoURL = imageResponse.data.data.url;
      }

      // Update backend
      await api.put("/api/auth/profile", {
        name: formData.name,
        phone: formData.phone,
        photoURL: photoURL,
      });

      // Update Firebase profile
      await updateUserProfile({
        displayName: formData.name,
        photoURL: photoURL,
      });

      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body items-center text-center">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={profile?.photoURL || "https://via.placeholder.com/150"}
                  alt={profile?.name}
                />
              </div>
            </div>
            <h2 className="card-title mt-4">{profile?.name}</h2>
            <div className="badge badge-primary capitalize">{profile?.role}</div>
            <p className="text-sm text-gray-500 mt-2">{profile?.email}</p>
            <p className="text-sm text-gray-500">{profile?.phone}</p>
            <div className="text-xs text-gray-400 mt-4">
              Member since{" "}
              {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={profile?.email}
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Email cannot be changed
                  </span>
                </label>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="input input-bordered"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered capitalize"
                  value={profile?.role}
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Role cannot be changed
                  </span>
                </label>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Profile Photo</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Upload a new profile picture
                  </span>
                </label>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${updating ? "loading" : ""}`}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;