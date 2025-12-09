import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    qualifications: "",
    experience: "",
    expectedSalary: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/api/applications/my-applications");
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (application) => {
    setEditingApp(application);
    setFormData({
      qualifications: application.qualifications,
      experience: application.experience,
      expectedSalary: application.expectedSalary,
    });
    setShowModal(true);
  };

  const handleUpdateApplication = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/applications/${editingApp._id}`, formData);
      alert("Application updated successfully!");
      setShowModal(false);
      setEditingApp(null);
      fetchApplications();
    } catch (error) {
      console.error("Error updating application:", error);
      alert(error.response?.data?.message || "Failed to update application");
    }
  };

  const handleDeleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await api.delete(`/api/applications/${id}`);
      alert("Application deleted successfully!");
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert(error.response?.data?.message || "Failed to delete application");
    }
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
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-gray-600">Manage your tuition applications</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{applications.length}</div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {applications.filter((a) => a.status === "pending").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">
            {applications.filter((a) => a.status === "approved").length}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">
            You haven't applied to any tuitions yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="card-title">Application</h2>
                    <p className="text-sm text-gray-500">
                      Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`badge ${getStatusBadge(application.status)}`}>
                    {application.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Qualifications:</p>
                    <p className="text-gray-700">{application.qualifications}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Experience:</p>
                    <p className="text-gray-700">{application.experience}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Expected Salary:</p>
                    <p className="text-lg text-primary font-bold">
                      ৳{application.expectedSalary}/month
                    </p>
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => openEditModal(application)}
                      className="btn btn-sm btn-warning"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteApplication(application._id)}
                      className="btn btn-sm btn-error"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingApp && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit Application</h3>
            <form onSubmit={handleUpdateApplication}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Qualifications</span>
                </label>
                <textarea
                  name="qualifications"
                  className="textarea textarea-bordered h-24"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Experience</span>
                </label>
                <textarea
                  name="experience"
                  className="textarea textarea-bordered h-24"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Expected Salary (৳/month)</span>
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  className="input input-bordered"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Update
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

export default MyApplications;