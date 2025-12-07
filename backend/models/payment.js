// Import the database client and ObjectId
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

// Helper function to get the payments collection
const getPaymentsCollection = () => {
  return client.db("tuitionDB").collection("payments");
};

// Function 1: CREATE a new payment record
const createPayment = async (paymentData) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    // Add payment date
    const payment = {
      ...paymentData,
      date: new Date(),
      status: "completed", // Payment status: completed, pending, failed
    };
    const result = await paymentsCollection.insertOne(payment);
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 2: GET all payments (for admin - platform revenue)
const getAllPayments = async () => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const payments = await paymentsCollection.find().toArray();
    return payments;
  } catch (error) {
    throw error;
  }
};

// Function 3: GET payments by student ID (student's payment history)
const getPaymentsByStudentId = async (studentId) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const payments = await paymentsCollection
      .find({ student_id: studentId })
      .toArray();
    return payments;
  } catch (error) {
    throw error;
  }
};

// Function 4: GET payments by tutor ID (tutor's revenue/earnings)
const getPaymentsByTutorId = async (tutorId) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const payments = await paymentsCollection
      .find({ tutor_id: tutorId })
      .toArray();
    return payments;
  } catch (error) {
    throw error;
  }
};

// Function 5: GET a single payment by ID
const getPaymentById = async (id) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const payment = await paymentsCollection.findOne({ _id: new ObjectId(id) });
    return payment;
  } catch (error) {
    throw error;
  }
};

// Function 6: GET payment by transaction ID (for verification)
const getPaymentByTransactionId = async (transactionId) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const payment = await paymentsCollection.findOne({
      transactionId: transactionId,
    });
    return payment;
  } catch (error) {
    throw error;
  }
};

// Function 7: Calculate total revenue for a tutor
const calculateTutorRevenue = async (tutorId) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    // Use MongoDB aggregation to sum all payments
    const result = await paymentsCollection
      .aggregate([
        { $match: { tutor_id: tutorId, status: "completed" } }, // Filter by tutor and completed payments
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }, // Sum all amounts
      ])
      .toArray();

    return result.length > 0 ? result[0].totalRevenue : 0;
  } catch (error) {
    throw error;
  }
};

// Function 8: Calculate total platform revenue (for admin analytics)
const calculateTotalRevenue = async () => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const result = await paymentsCollection
      .aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ])
      .toArray();

    return result.length > 0 ? result[0].totalRevenue : 0;
  } catch (error) {
    throw error;
  }
};

// Function 9: Get total number of transactions
const getTotalTransactions = async () => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const count = await paymentsCollection.countDocuments({
      status: "completed",
    });
    return count;
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createPayment,
  getAllPayments,
  getPaymentsByStudentId,
  getPaymentsByTutorId,
  getPaymentById,
  getPaymentByTransactionId,
  calculateTutorRevenue,
  calculateTotalRevenue,
  getTotalTransactions,
};
