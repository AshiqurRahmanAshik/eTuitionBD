const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../models/user"); 

// Route 1: GET /api/users - Get public listing of Tutors
// No middleware needed: This route is PUBLIC
router.get("/", async (req, res) => {
  try {
    const { role } = req.query; 

    // Safety check: Only allow fetching users with role 'tutor' publicly
    if (role !== 'tutor') {
      // If no role is specified, we can return a list of all users or an error. 
      // For Home page, we specifically look for 'role=tutor'.
      // For the tutor listing page, you might adjust this logic.
      return res.status(400).json({ message: "Invalid query. Use ?role=tutor for public access." });
    }

    let users = await getAllUsers();
    
    // Filter by role: tutor
    users = users.filter((user) => user.role === 'tutor');

    // Remove sensitive data (like password) before sending
    users = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get public tutors error:", error);
    res.status(500).json({ message: "Server error while fetching tutors." });
  }
});

// Export router
module.exports = router;