import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import {
  FaUsers,
  FaBook,
  FaMoneyBillWave,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/api/admin/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Failed to load analytics</p>
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
        <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-gray-600">
          Comprehensive overview of platform statistics
        </p>
      </motion.div>

      {/* User Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat bg-gradient-to-br from-primary to-primary-focus text-white rounded-lg shadow-xl">
            <div className="stat-figure">
              <FaUsers className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-white">Total Users</div>
            <div className="stat-value">{analytics.users.total}</div>
            <div className="stat-desc text-white">All registered users</div>
          </div>

          <div className="stat bg-gradient-to-br from-secondary to-secondary-focus text-white rounded-lg shadow-xl">
            <div className="stat-figure">
              <FaUsers className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-white">Students</div>
            <div className="stat-value">{analytics.users.students}</div>
            <div className="stat-desc text-white">Active students</div>
          </div>

          <div className="stat bg-gradient-to-br from-accent to-accent-focus text-white rounded-lg shadow-xl">
            <div className="stat-figure">
              <FaUsers className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-white">Tutors</div>
            <div className="stat-value">{analytics.users.tutors}</div>
            <div className="stat-desc text-white">Verified tutors</div>
          </div>

          <div className="stat bg-gradient-to-br from-info to-info-focus text-white rounded-lg shadow-xl">
            <div className="stat-figure">
              <FaUsers className="text-4xl opacity-50" />
            </div>
            <div className="stat-title text-white">Admins</div>
            <div className="stat-value">{analytics.users.admins}</div>
            <div className="stat-desc text-white">Platform admins</div>
          </div>
        </div>
      </motion.div>

      {/* Tuition Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Tuition Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat bg-base-100 shadow-xl rounded-lg">
            <div className="stat-figure text-primary">
              <FaBook className="text-3xl" />
            </div>
            <div className="stat-title">Total Tuitions</div>
            <div className="stat-value text-primary">
              {analytics.tuitions.total}
            </div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-lg">
            <div className="stat-figure text-warning">
              <FaBook className="text-3xl" />
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">
              {analytics.tuitions.pending}
            </div>
            <div className="stat-desc">Awaiting approval</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-lg">
            <div className="stat-figure text-success">
              <FaCheckCircle className="text-3xl" />
            </div>
            <div className="stat-title">Approved</div>
            <div className="stat-value text-success">
              {analytics.tuitions.approved}
            </div>
            <div className="stat-desc">Live on platform</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-lg">
            <div className="stat-figure text-error">
              <FaBook className="text-3xl" />
            </div>
            <div className="stat-title">Rejected</div>
            <div className="stat-value text-error">
              {analytics.tuitions.rejected}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Revenue Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Revenue Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stat bg-gradient-to-r from-success to-success-focus text-white rounded-lg shadow-xl">
            <div className="stat-figure">
              <FaMoneyBillWave className="text-5xl opacity-50" />
            </div>
            <div className="stat-title text-white">Total Revenue</div>
            <div className="stat-value">৳{analytics.payments.totalRevenue}</div>
            <div className="stat-desc text-white">From all transactions</div>
          </div>

          <div className="stat bg-gradient-to-r from-info to-info-focus text-white rounded-lg shadow-xl">
            <div className="stat-figure">
              <FaChartLine className="text-5xl opacity-50" />
            </div>
            <div className="stat-title text-white">Total Transactions</div>
            <div className="stat-value">
              {analytics.payments.totalTransactions}
            </div>
            <div className="stat-desc text-white">Completed payments</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Payments</h2>
          {analytics.payments.recentPayments.length === 0 ? (
            <p className="text-gray-500">No payments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.payments.recentPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        {new Date(payment.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="font-mono text-sm">
                        {payment.transactionId}
                      </td>
                      <td className="font-bold text-success">
                        ৳{payment.amount}
                      </td>
                      <td>
                        <div className="badge badge-success">
                          {payment.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Platform Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-base-100 shadow-xl mt-8"
      >
        <div className="card-body">
          <h2 className="card-title mb-4">Platform Health</h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Approval Rate</div>
              <div className="stat-value text-success">
                {analytics.tuitions.total > 0
                  ? Math.round(
                      (analytics.tuitions.approved / analytics.tuitions.total) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="stat-desc">Tuitions approved</div>
            </div>

            <div className="stat">
              <div className="stat-title">Avg Revenue per Transaction</div>
              <div className="stat-value text-primary">
                ৳
                {analytics.payments.totalTransactions > 0
                  ? Math.round(
                      analytics.payments.totalRevenue /
                        analytics.payments.totalTransactions
                    )
                  : 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">User Distribution</div>
              <div className="stat-value text-secondary">
                {analytics.users.total > 0
                  ? Math.round(
                      (analytics.users.tutors / analytics.users.total) * 100
                    )
                  : 0}
                %
              </div>
              <div className="stat-desc">Tutors vs Students</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
