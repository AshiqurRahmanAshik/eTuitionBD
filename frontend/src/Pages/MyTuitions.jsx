import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const MyTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTuition, setEditingTuition] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    location: "",
    budget: "",
    description: "",
  });

  useEffect(() => {
    fetchMyTuitions();
  }, []);

  const fetchMyTuitions = async () => {
    try {
      const response = await api.get("/api/tuitions/student/my-tuitions");
      setTuitions(response.data.tuitions);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTuition = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/tuitions", formData);
      alert("Tuition created successfully! Waiting for admin approval.");
      setShowModal(false);
      setFormData({
        subject: "",
        class: "",
        location: "",
        budget: "",
        description: "",
      });
      fetchMyTuitions();
    } catch (error) {
      console.error("Error creating tuition:", error);
      alert(error.response?.data?.message || "Failed to create tuition");
    }
  };

  const handleUpdateTuition = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/tuitions/${editingTuition._id}`, formData);
      alert("Tuition updated successfully!");
      setShowModal(false);
      setEditingTuition(null);
      setFormData({
        subject: "",
        class: "",
        location: "",
        budget: "",
        description: "",
      });
      fetchMyTuitions();
    } catch (error) {
      console.error("Error updating tuition:", error);
      alert(error.response?.data?.message || "Failed to update tuition");
    }
  };

  const handleDeleteTuition = async (id) => {
    if (!confirm("Are you sure you want to delete this tuition?")) return;

    try {
      await api.delete(`/api/tuitions/${id}`);
      alert("Tuition deleted successfully!");
      fetchMyTuitions();
    } catch (error) {
      console.error("Error deleting tuition:", error);
      alert(error.response?.data?.message || "Failed to delete tuition");
    }
  };

  const openCreateModal = () => {
    setEditingTuition(null);
    setFormData({
      subject: "",
      class: "",
      location: "",
      budget: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (tuition) => {
    setEditingTuition(tuition);
    setFormData({
      subject: tuition.subject,
      class: tuition.class,
      location: tuition.location,
      budget: tuition.budget,
      description: tuition.description || "",
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      approved: "badge-success",
      rejected: "badge-error",
    };
    return badges[status] || "badge-ghost";
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">My Tuitions</h1>
          <p className="text-gray-600">Manage your tuition posts</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <FaPlus className="mr-2" />
          Create New Tuition
        </button>
      </motion.div>

      {/* Tuitions List */}
      {tuitions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">
            You haven't created any tuitions yet
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            Create Your First Tuition
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tuitions.map((tuition) => (
            <motion.div
              key={tuition._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="card-title">{tuition.subject}</h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-semibold">Class:</span>{" "}
                        {tuition.class}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Location:</span>{" "}
                        {tuition.location}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Budget:</span> ৳
                        {tuition.budget}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {tuition.description}
                      </p>
                    </div>
                  </div>
                  <div className={`badge ${getStatusBadge(tuition.status)}`}>
                    {tuition.status}
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/dashboard/applications?tuitionId=${tuition._id}`}
                    className="btn btn-sm btn-info"
                  >
                    <FaEye className="mr-1" />
                    Applications
                  </Link>
                  <button
                    onClick={() => openEditModal(tuition)}
                    className="btn btn-sm btn-warning"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTuition(tuition._id)}
                    className="btn btn-sm btn-error"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {editingTuition ? "Edit Tuition" : "Create New Tuition"}
            </h3>
            <form onSubmit={editingTuition ? handleUpdateTuition : handleCreateTuition}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  className="input input-bordered"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Class</span>
                </label>
                <input
                  type="text"
                  name="class"
                  className="input input-bordered"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="input input-bordered"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Budget (৳/month)</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  className="input input-bordered"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered h-24"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {editingTuition ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTuitions;