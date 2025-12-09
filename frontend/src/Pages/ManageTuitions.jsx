import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

const ManageTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [filteredTuitions, setFilteredTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState(null);

  useEffect(() => {
    fetchTuitions();
  }, []);

  useEffect(() => {
    filterTuitions();
  }, [tuitions, statusFilter]);

  const fetchTuitions = async () => {
    try {
      const response = await api.get("/api/admin/tuitions");
      setTuitions(response.data.tuitions);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTuitions = () => {
    if (statusFilter) {
      setFilteredTuitions(
        tuitions.filter((tuition) => tuition.status === statusFilter)
      );
    } else {
      setFilteredTuitions(tuitions);
    }
  };

  const handleApprove = async (tuitionId) => {
    if (!confirm("Are you sure you want to approve this tuition?")) return;

    try {
      await api.patch(`/api/tuitions/${tuitionId}/status`, {
        status: "approved",
      });
      alert("Tuition approved successfully!");
      fetchTuitions();
    } catch (error) {
      console.error("Error approving tuition:", error);
      alert(error.response?.data?.message || "Failed to approve tuition");
    }
  };

  const handleReject = async (tuitionId) => {
    if (!confirm("Are you sure you want to reject this tuition?")) return;

    try {
      await api.patch(`/api/tuitions/${tuitionId}/status`, {
        status: "rejected",
      });
      alert("Tuition rejected successfully!");
      fetchTuitions();
    } catch (error) {
      console.error("Error rejecting tuition:", error);
      alert(error.response?.data?.message || "Failed to reject tuition");
    }
  };

  const viewDetails = (tuition) => {
    setSelectedTuition(tuition);
    setShowDetailModal(true);
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
        <h1 className="text-4xl font-bold mb-2">Manage Tuitions</h1>
        <p className="text-gray-600">
          Review and approve tuition posts from students
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{tuitions.length}</div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {tuitions.filter((t) => t.status === "pending").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">
            {tuitions.filter((t) => t.status === "approved").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-lg">
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">
            {tuitions.filter((t) => t.status === "rejected").length}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Filter by Status</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tuitions List */}
      {filteredTuitions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No tuitions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTuitions.map((tuition) => (
            <motion.div
              key={tuition._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
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
                      <p className="text-xs text-gray-500">
                        Posted on{" "}
                        {new Date(tuition.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`badge ${getStatusBadge(tuition.status)}`}>
                    {tuition.status}
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    onClick={() => viewDetails(tuition)}
                    className="btn btn-sm btn-info"
                  >
                    <FaEye className="mr-1" />
                    View Details
                  </button>
                  {tuition.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(tuition._id)}
                        className="btn btn-sm btn-success"
                      >
                        <FaCheck className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(tuition._id)}
                        className="btn btn-sm btn-error"
                      >
                        <FaTimes className="mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTuition && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Tuition Details</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Subject:</p>
                <p>{selectedTuition.subject}</p>
              </div>
              <div>
                <p className="font-semibold">Class:</p>
                <p>{selectedTuition.class}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p>{selectedTuition.location}</p>
              </div>
              <div>
                <p className="font-semibold">Budget:</p>
                <p className="text-lg text-primary font-bold">
                  ৳{selectedTuition.budget}/month
                </p>
              </div>
              <div>
                <p className="font-semibold">Description:</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedTuition.description || "No description provided"}
                </p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <div className={`badge ${getStatusBadge(selectedTuition.status)}`}>
                  {selectedTuition.status}
                </div>
              </div>
              <div>
                <p className="font-semibold">Posted on:</p>
                <p>
                  {new Date(selectedTuition.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="modal-action">
              {selectedTuition.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedTuition._id);
                      setShowDetailModal(false);
                    }}
                    className="btn btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedTuition._id);
                      setShowDetailModal(false);
                    }}
                    className="btn btn-error"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                className="btn"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTuitions;