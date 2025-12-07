// Import required packages and models
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} = require("../models/user");
const verifyToken = require("../middleware/verifytoken");

// Route 1: POST /api/auth/register - Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, photoURL } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role, // 'student', 'tutor', or 'admin'
      phone: phone || "",
      photoURL: photoURL || "",
      createdAt: new Date(),
    };

    // Save user to database
    const result = await createUser(newUser);

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email: email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response (don't send password)
    res.status(201).json({
      message: "User registered successfully.",
      token: token,
      user: {
        _id: result.insertedId,
        name,
        email,
        role,
        phone,
        photoURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// Route 2: POST /api/auth/login - Login with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response (don't send password)
    res.status(200).json({
      message: "Login successful.",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// Route 3: GET /api/auth/profile - Get user profile (Protected)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // req.user comes from verifyToken middleware
    const user = await findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send user data (without password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
});

// Route 4: PUT /api/auth/profile - Update user profile (Protected)
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phone, photoURL } = req.body;

    // Prepare update data (only allow name, phone, photoURL to be updated)
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (photoURL) updateData.photoURL = photoURL;

    // Update user
    const result = await updateUser(req.user.userId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get updated user data
    const updatedUser = await findUserById(req.user.userId);

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        photoURL: updatedUser.photoURL,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
});

// Export router
module.exports = router;
