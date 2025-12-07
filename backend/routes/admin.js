// Import required packages and models
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} = require("../models/user");
const { getAllTuitions } = require("../models/tuition");
const {
  calculateTotalRevenue,
  getTotalTransactions,
  getAllPayments,
} = require("../models/payment");
const verifyToken = require("../middleware/verifytoken");
const { verifyAdmin } = require("../middleware/verifyrole");

// All routes require admin authentication
router.use(verifyToken, verifyAdmin);

// Route 1: GET /api/admin/users - Get all users
router.get("/users", async (req, res) => {
  try {
    const { role, search } = req.query;

    let users = await getAllUsers();

    // Filter by role if provided
    if (role) {
      users = users.filter((user) => user.role === role);
    }

    // Search by name or email
    if (search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Remove passwords from response
    users = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
});

// Route 2: GET /api/admin/users/:id - Get single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error while fetching user." });
  }
});

// Route 3: PUT /api/admin/users/:id - Update user (role, info, etc.)
router.put("/users/:id", async (req, res) => {
  try {
    const { name, role, phone, photoURL } = req.body;

    // Check if user exists
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (role) {
      // Validate role
      if (!["student", "tutor", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role." });
      }
      updateData.role = role;
    }
    if (phone) updateData.phone = phone;
    if (photoURL) updateData.photoURL = photoURL;

    // Update user
    const result = await updateUser(req.params.id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error while updating user." });
  }
});

// Route 4: DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    // Check if user exists
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user.userId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    // Delete user
    const result = await deleteUser(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error while deleting user." });
  }
});

// Route 5: GET /api/admin/tuitions - Get all tuitions (including pending)
router.get("/tuitions", async (req, res) => {
  try {
    const { status } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;

    const tuitions = await getAllTuitions(filters);

    res.status(200).json({
      count: tuitions.length,
      tuitions,
    });
  } catch (error) {
    console.error("Get all tuitions error:", error);
    res.status(500).json({ message: "Server error while fetching tuitions." });
  }
});

// Route 6: GET /api/admin/analytics - Get platform statistics
router.get("/analytics", async (req, res) => {
  try {
    // Get all users
    const allUsers = await getAllUsers();

    // Count users by role
    const studentCount = allUsers.filter((u) => u.role === "student").length;
    const tutorCount = allUsers.filter((u) => u.role === "tutor").length;
    const adminCount = allUsers.filter((u) => u.role === "admin").length;

    // Get all tuitions
    const allTuitions = await getAllTuitions({});

    // Count tuitions by status
    const pendingTuitions = allTuitions.filter(
      (t) => t.status === "pending"
    ).length;
    const approvedTuitions = allTuitions.filter(
      (t) => t.status === "approved"
    ).length;
    const rejectedTuitions = allTuitions.filter(
      (t) => t.status === "rejected"
    ).length;

    // Get payment statistics
    const totalRevenue = await calculateTotalRevenue();
    const totalTransactions = await getTotalTransactions();
    const allPayments = await getAllPayments();

    res.status(200).json({
      users: {
        total: allUsers.length,
        students: studentCount,
        tutors: tutorCount,
        admins: adminCount,
      },
      tuitions: {
        total: allTuitions.length,
        pending: pendingTuitions,
        approved: approvedTuitions,
        rejected: rejectedTuitions,
      },
      payments: {
        totalRevenue,
        totalTransactions,
        recentPayments: allPayments.slice(0, 10), // Last 10 payments
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Server error while fetching analytics." });
  }
});

// Export router
module.exports = router;
