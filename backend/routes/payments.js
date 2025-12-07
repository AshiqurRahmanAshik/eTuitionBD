// Import required packages and models
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  createPayment,
  getAllPayments,
  getPaymentsByStudentId,
  getPaymentsByTutorId,
  getPaymentById,
  calculateTutorRevenue,
  calculateTotalRevenue,
  getTotalTransactions,
} = require("../models/payment");
const { updateApplicationStatus } = require("../models/application");
const { getApplicationById } = require("../models/application");
const verifyToken = require("../middleware/verifytoken");
const {
  verifyStudent,
  verifyTutor,
  verifyAdmin,
} = require("../middleware/verifyrole");

// Route 1: POST /api/payments/create-intent - Create Stripe payment intent (Student only)
router.post("/create-intent", verifyToken, verifyStudent, async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: "bdt", // Bangladeshi Taka
      metadata: {
        student_id: req.user.userId,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating payment intent." });
  }
});

// Route 2: POST /api/payments/confirm - Confirm payment and update application (Student only)
router.post("/confirm", verifyToken, verifyStudent, async (req, res) => {
  try {
    const { application_id, tuition_id, tutor_id, amount, transactionId } =
      req.body;

    // Validate required fields
    if (
      !application_id ||
      !tuition_id ||
      !tutor_id ||
      !amount ||
      !transactionId
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Verify application exists
    const application = await getApplicationById(application_id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Create payment record
    const paymentData = {
      student_id: req.user.userId,
      tutor_id,
      tuition_id,
      amount: parseFloat(amount),
      transactionId,
      status: "completed",
    };

    const paymentResult = await createPayment(paymentData);

    // Update application status to approved
    await updateApplicationStatus(application_id, "approved");

    res.status(201).json({
      message: "Payment successful. Application approved.",
      paymentId: paymentResult.insertedId,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ message: "Server error while confirming payment." });
  }
});

// Route 3: GET /api/payments/history - Get student's payment history (Student only)
router.get("/history", verifyToken, verifyStudent, async (req, res) => {
  try {
    const payments = await getPaymentsByStudentId(req.user.userId);

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching payment history." });
  }
});

// Route 4: GET /api/payments/revenue - Get tutor's revenue (Tutor only)
router.get("/revenue", verifyToken, verifyTutor, async (req, res) => {
  try {
    // Get all payments for this tutor
    const payments = await getPaymentsByTutorId(req.user.userId);

    // Calculate total revenue
    const totalRevenue = await calculateTutorRevenue(req.user.userId);

    res.status(200).json({
      totalRevenue,
      totalTransactions: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get tutor revenue error:", error);
    res.status(500).json({ message: "Server error while fetching revenue." });
  }
});

// Route 5: GET /api/payments/all - Get all payments (Admin only)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await getAllPayments();

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ message: "Server error while fetching payments." });
  }
});

// Route 6: GET /api/payments/:id - Get single payment by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const payment = await getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    // Check if user is authorized to view this payment
    if (
      payment.student_id !== req.user.userId &&
      payment.tutor_id !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Server error while fetching payment." });
  }
});

// Export router
module.exports = router;
