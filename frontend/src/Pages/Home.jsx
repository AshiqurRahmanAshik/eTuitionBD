import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import axios from "axios";
import {
  FaSearch,
  FaUserGraduate,
  FaCheckCircle,
  FaStar,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const Home = () => {
  const [latestTuitions, setLatestTuitions] = useState([]);
  const [latestTutors, setLatestTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      // Fetch latest approved tuitions
      const tuitionsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tuitions?status=approved`
      );
      setLatestTuitions(tuitionsRes.data.tuitions.slice(0, 6));

      // Fetch latest tutors (users with role: tutor)
      const tutorsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users?role=tutor`
      );
      setLatestTutors(tutorsRes.data.users.slice(0, 6));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div>
      {/* Hero Section with Animation */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8 }}
        className="bg-linear-to-r from-primary to-secondary text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Find Your Perfect Tutor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8"
          >
            Connect with qualified tutors across Bangladesh
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <Link
              to="/tuitions"
              className="btn btn-lg bg-white text-primary hover:bg-gray-100"
            >
              Browse Tuitions
            </Link>
            <Link
              to="/tutors"
              className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              Find Tutors
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Tuitions Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Latest Tuition Posts</h2>
            <p className="text-lg text-gray-600">
              Find the perfect teaching opportunity
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {latestTuitions.map((tuition) => (
                <motion.div
                  key={tuition._id}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="card bg-base-100 shadow-xl"
                >
                  <div className="card-body">
                    <h3 className="card-title">{tuition.subject}</h3>
                    <p className="text-gray-600">Class: {tuition.class}</p>
                    <p className="text-gray-600">
                      Location: {tuition.location}
                    </p>
                    <p className="font-bold text-primary">
                      Budget: ৳{tuition.budget}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {tuition.description}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/tuitions/${tuition._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-8">
            <Link to="/tuitions" className="btn btn-primary">
              View All Tuitions
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Tutors Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Expert Tutors</h2>
            <p className="text-lg text-gray-600">
              Learn from the best educators
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {latestTutors.map((tutor) => (
                <motion.div
                  key={tutor._id}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="card bg-base-100 shadow-xl"
                >
                  <figure className="px-10 pt-10">
                    <div className="avatar">
                      <div className="w-24 rounded-full">
                        <img
                          src={
                            tutor.photoURL || "https://via.placeholder.com/150"
                          }
                          alt={tutor.name}
                        />
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h3 className="card-title">{tutor.name}</h3>
                    <p className="text-gray-600">{tutor.email}</p>
                    <p className="text-sm text-gray-500">{tutor.phone}</p>
                    <div className="card-actions mt-4">
                      <Link
                        to={`/tutors/${tutor._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-8">
            <Link to="/tutors" className="btn btn-primary">
              View All Tutors
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Get started in 3 simple steps
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl">
                  <FaSearch />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Search</h3>
              <p className="text-gray-600">
                Browse through tuitions or tutors based on your requirements
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-secondary text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl">
                  <FaUserGraduate />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">2. Connect</h3>
              <p className="text-gray-600">
                Apply for tuitions or contact tutors directly through our
                platform
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl">
                  <FaCheckCircle />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Start Learning</h3>
              <p className="text-gray-600">
                Begin your educational journey with qualified tutors
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose eTuitionBD</h2>
            <p className="text-lg text-gray-600">
              Your trusted platform for quality education
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <FaStar className="text-5xl text-yellow-500 mb-4" />
                <h3 className="card-title">Verified Tutors</h3>
                <p className="text-gray-600">
                  All tutors are verified and qualified professionals
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <FaShieldAlt className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Safe & Secure</h3>
                <p className="text-gray-600">
                  Your data is protected with advanced security measures
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <FaHeadset className="text-5xl text-secondary mb-4" />
                <h3 className="card-title">24/7 Support</h3>
                <p className="text-gray-600">
                  Our team is always ready to help you
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
