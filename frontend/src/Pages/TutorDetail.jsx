import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEnvelope, FaPhone, FaUserGraduate, FaCalendar } from "react-icons/fa";

const TutorDetail = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorDetails();
  }, [id]);

  const fetchTutorDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`
      );
      setTutor(response.data);
    } catch (error) {
      console.error("Error fetching tutor:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!tutor || tutor.role !== "tutor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tutor not found</h2>
          <Link to="/tutors" className="btn btn-primary">
            Back to Tutors
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
        <Link to="/tutors" className="btn btn-ghost mb-4">
          ← Back to Tutors
        </Link>

        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img
                    src={tutor.photoURL || "https://via.placeholder.com/150"}
                    alt={tutor.name}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{tutor.name}</h1>
                <div className="badge badge-primary mb-4">Verified Tutor</div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <FaEnvelope className="text-primary" />
                    <span>{tutor.email}</span>
                  </div>

                  {tutor.phone && (
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <FaPhone className="text-primary" />
                      <span>{tutor.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <FaUserGraduate className="text-primary" />
                    <span className="capitalize">{tutor.role}</span>
                  </div>

                  {tutor.createdAt && (
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <FaCalendar className="text-primary" />
                      <span>
                        Joined{" "}
                        {new Date(tutor.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700">
                {tutor.name} is a verified tutor on eTuitionBD. With expertise
                in various subjects, they are dedicated to helping students
                achieve their academic goals. Contact them directly to discuss
                your educational needs and schedule.
              </p>
            </div>

            <div className="divider"></div>

            {/* Stats Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Experience</div>
                  <div className="stat-value text-primary">Professional</div>
                  <div className="stat-desc">Verified Educator</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Availability</div>
                  <div className="stat-value text-secondary">Active</div>
                  <div className="stat-desc">Ready to teach</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Rating</div>
                  <div className="stat-value text-accent">4.8</div>
                  <div className="stat-desc">Average rating</div>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="card-actions justify-center mt-6">
              <a
                href={`mailto:${tutor.email}`}
                className="btn btn-primary btn-lg"
              >
                Contact Tutor
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorDetail;