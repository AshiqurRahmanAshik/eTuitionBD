import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";

const TuitionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tuition, setTuition] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    qualifications: "",
    experience: "",
    expectedSalary: "",
  });

  useEffect(() => {
    fetchTuitionDetails();
  }, [id]);

  const fetchTuitionDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tuitions/${id}`
      );
      setTuition(response.data);

      // Fetch student details
      const studentResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${response.data.student_id}`
      );
      setStudent(studentResponse.data);
    } catch (error) {
      console.error("Error fetching tuition:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to apply");
      navigate("/login", { state: `/tuitions/${id}` });
      return;
    }

    try {
      await api.post("/api/applications", {
        tuition_id: id,
        qualifications: applicationData.qualifications,
        experience: applicationData.experience,
        expectedSalary: parseFloat(applicationData.expectedSalary),
      });

      alert("Application submitted successfully!");
      setShowApplyModal(false);
      setApplicationData({
        qualifications: "",
        experience: "",
        expectedSalary: "",
      });
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.response?.data?.message || "Failed to submit application");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tuition not found</h2>
          <Link to="/tuitions" className="btn btn-primary">
            Back to Tuitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <Link to="/tuitions" className="btn btn-ghost mb-4">
          ← Back to Tuitions
        </Link>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="card-title text-3xl mb-2">{tuition.subject}</h1>
                <div className="badge badge-primary">{tuition.status}</div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-secondary">
                  ৳{tuition.budget}
                </p>
                <p className="text-sm text-gray-500">Monthly Budget</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-2xl text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-semibold">{tuition.class}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-2xl text-secondary" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{tuition.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaBook className="text-2xl text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-semibold">{tuition.subject}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-2xl text-secondary" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">৳{tuition.budget}/month</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="divider"></div>
            <div>
              <h3 className="text-xl font-bold mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {tuition.description || "No description provided"}
              </p>
            </div>

            {/* Student Info */}
            {student && (
              <>
                <div className="divider"></div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Posted By</h3>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img
                          src={student.photoURL || "https://via.placeholder.com/150"}
                          alt={student.name}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Apply Button */}
            <div className="card-actions justify-end mt-6">
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn btn-primary btn-lg"
              >
                Apply for This Tuition
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Apply for Tuition</h3>
            <form onSubmit={handleApply}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Qualifications</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Enter your educational qualifications"
                  value={applicationData.qualifications}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      qualifications: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Experience</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Describe your teaching experience"
                  value={applicationData.experience}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      experience: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Expected Salary (৳/month)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  placeholder="Enter your expected salary"
                  value={applicationData.expectedSalary}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      expectedSalary: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowApplyModal(false)}
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

export default TuitionDetail;