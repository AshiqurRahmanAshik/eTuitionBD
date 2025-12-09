import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaMoneyBillWave, FaChartLine, FaCheckCircle } from "react-icons/fa";

const TutorRevenue = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    payments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await api.get("/api/payments/revenue");
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error fetching revenue:", error);
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Revenue Dashboard</h1>
        <p className="text-gray-600">Track your earnings and transactions</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-r from-primary to-secondary text-white shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title mb-2">Total Revenue</h2>
                <p className="text-4xl font-bold">৳{revenueData.totalRevenue}</p>
                <p className="text-sm opacity-80 mt-2">Total earnings</p>
              </div>
              <FaMoneyBillWave className="text-6xl opacity-50" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-r from-accent to-info text-white shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title mb-2">Transactions</h2>
                <p className="text-4xl font-bold">
                  {revenueData.totalTransactions}
                </p>
                <p className="text-sm opacity-80 mt-2">Completed payments</p>
              </div>
              <FaChartLine className="text-6xl opacity-50" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title mb-4">Payment History</h2>

          {revenueData.payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No payments received yet</p>
            </div>
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
                  {revenueData.payments.map((payment) => (
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
                      <td className="font-bold text-primary">
                        ৳{payment.amount}
                      </td>
                      <td>
                        <div className="badge badge-success gap-2">
                          <FaCheckCircle />
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

      {/* Average Earnings */}
      {revenueData.totalTransactions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-100 shadow-xl mt-6"
        >
          <div className="card-body">
            <h2 className="card-title mb-4">Statistics</h2>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Average per Transaction</div>
                <div className="stat-value text-primary">
                  ৳
                  {Math.round(
                    revenueData.totalRevenue / revenueData.totalTransactions
                  )}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Highest Payment</div>
                <div className="stat-value text-secondary">
                  ৳
                  {Math.max(...revenueData.payments.map((p) => p.amount), 0)}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Success Rate</div>
                <div className="stat-value text-accent">100%</div>
                <div className="stat-desc">All payments completed</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TutorRevenue;