import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import api from "../utils/api";
import {
  FaBook,
  FaFileAlt,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

const DashboardHome = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const profileRes = await api.get("/api/auth/profile");
      setUserProfile(profileRes.data);

      // Fetch role-specific stats
      if (profileRes.data.role === "student") {
        const tuitionsRes = await api.get("/api/tuitions/student/my-tuitions");
        setStats({
          myTuitions: tuitionsRes.data.count,
        });
      } else if (profileRes.data.role === "tutor") {
        const appsRes = await api.get("/api/applications/my-applications");
        setStats({
          myApplications: appsRes.data.count,
        });
      } else if (profileRes.data.role === "admin") {
        const analyticsRes = await api.get("/api/admin/analytics");
        setStats(analyticsRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {userProfile?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your account today.
        </p>
      </motion.div>

      {/* Stats Grid for Student */}
      {userProfile?.role === "student" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="stat bg-primary text-primary-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaBook className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-primary-content">My Tuitions</div>
            <div className="stat-value">{stats.myTuitions || 0}</div>
            <div className="stat-desc text-primary-content">
              <Link to="/dashboard/my-tuitions" className="link">
                View all →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="stat bg-secondary text-secondary-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaFileAlt className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-secondary-content">
              Applications
            </div>
            <div className="stat-value">New</div>
            <div className="stat-desc text-secondary-content">
              <Link to="/dashboard/applications" className="link">
                Check now →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="stat bg-accent text-accent-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaMoneyBillWave className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-accent-content">Payments</div>
            <div className="stat-value">Track</div>
            <div className="stat-desc text-accent-content">
              <Link to="/dashboard/payments" className="link">
                View history →
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats Grid for Tutor */}
      {userProfile?.role === "tutor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="stat bg-primary text-primary-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaFileAlt className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-primary-content">
              My Applications
            </div>
            <div className="stat-value">{stats.myApplications || 0}</div>
            <div className="stat-desc text-primary-content">
              <Link to="/dashboard/my-applications" className="link">
                View all →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="stat bg-secondary text-secondary-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaMoneyBillWave className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-secondary-content">Revenue</div>
            <div className="stat-value">Track</div>
            <div className="stat-desc text-secondary-content">
              <Link to="/dashboard/revenue" className="link">
                View earnings →
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats Grid for Admin */}
      {userProfile?.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="stat bg-primary text-primary-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaUsers className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-primary-content">Total Users</div>
            <div className="stat-value">{stats.users?.total || 0}</div>
            <div className="stat-desc text-primary-content">
              Students: {stats.users?.students || 0} | Tutors:{" "}
              {stats.users?.tutors || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="stat bg-secondary text-secondary-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaBook className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-secondary-content">Tuitions</div>
            <div className="stat-value">{stats.tuitions?.total || 0}</div>
            <div className="stat-desc text-secondary-content">
              Pending: {stats.tuitions?.pending || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="stat bg-accent text-accent-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaMoneyBillWave className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-accent-content">Revenue</div>
            <div className="stat-value">
              ৳{stats.payments?.totalRevenue || 0}
            </div>
            <div className="stat-desc text-accent-content">
              {stats.payments?.totalTransactions || 0} transactions
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="stat bg-info text-info-content rounded-lg shadow-lg"
          >
            <div className="stat-figure">
              <FaChartLine className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-info-content">Analytics</div>
            <div className="stat-value">View</div>
            <div className="stat-desc text-info-content">
              <Link to="/dashboard/analytics" className="link">
                Full report →
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProfile?.role === "student" && (
              <>
                <Link to="/tuitions" className="btn btn-primary">
                  Browse Tuitions
                </Link>
                <Link to="/dashboard/my-tuitions" className="btn btn-secondary">
                  Create Tuition Post
                </Link>
                <Link to="/dashboard/profile" className="btn btn-accent">
                  Update Profile
                </Link>
              </>
            )}

            {userProfile?.role === "tutor" && (
              <>
                <Link to="/tuitions" className="btn btn-primary">
                  Browse Tuitions
                </Link>
                <Link
                  to="/dashboard/my-applications"
                  className="btn btn-secondary"
                >
                  View Applications
                </Link>
                <Link to="/dashboard/profile" className="btn btn-accent">
                  Update Profile
                </Link>
              </>
            )}

            {userProfile?.role === "admin" && (
              <>
                <Link to="/dashboard/users" className="btn btn-primary">
                  Manage Users
                </Link>
                <Link to="/dashboard/all-tuitions" className="btn btn-secondary">
                  Manage Tuitions
                </Link>
                <Link to="/dashboard/analytics" className="btn btn-accent">
                  View Analytics
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;