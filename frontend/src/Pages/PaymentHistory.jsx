import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get("/api/payments/history");
      setPayments(response.data.payments);
      
      // Calculate total
      const total = response.data.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      setTotalSpent(total);
    } catch (error) {
      console.error("Error fetching payment history:", error);
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
        <h1 className="text-4xl font-bold mb-2">Payment History</h1>
        <p className="text-gray-600">View all your payment transactions</p>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card bg-gradient-to-r from-primary to-secondary text-white shadow-xl mb-8"
      >
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title mb-2">Total Spent</h2>
              <p className="text-4xl font-bold">৳{totalSpent}</p>
              <p className="text-sm opacity-80 mt-2">
                {payments.length} transaction{payments.length !== 1 ? "s" : ""}
              </p>
            </div>
            <FaMoneyBillWave className="text-6xl opacity-50" />
          </div>
        </div>
      </motion.div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No payment history</p>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Transaction History</h2>
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
                  {payments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;