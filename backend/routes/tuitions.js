// Import required packages and models
const express = require("express");
const router = express.Router();
const {
  createTuition,
  getAllTuitions,
  getTuitionById,
  getTuitionsByStudentId,
  updateTuition,
  updateTuitionStatus,
  deleteTuition,
  getTuitionsWithPagination,
} = require("../models/tuition");
const verifyToken = require("../middleware/verifytoken");
const { verifyStudent, verifyAdmin } = require("../middleware/verifyrole");

// Route 1: POST /api/tuitions - Create a new tuition (Student only)
router.post("/", verifyToken, verifyStudent, async (req, res) => {
  try {
    const {
      subject,
      class: className,
      location,
      budget,
      description,
    } = req.body;

    // Validate required fields
    if (!subject || !className || !location || !budget) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Create tuition object
    const tuitionData = {
      student_id: req.user.userId, // From JWT token
      subject,
      class: className,
      location,
      budget: parseFloat(budget),
      description: description || "",
    };

    // Save to database
    const result = await createTuition(tuitionData);

    res.status(201).json({
      message: "Tuition created successfully. Waiting for admin approval.",
      tuitionId: result.insertedId,
    });
  } catch (error) {
    console.error("Create tuition error:", error);
    res.status(500).json({ message: "Server error while creating tuition." });
  }
});

// Route 2: GET /api/tuitions - Get all approved tuitions (Public - with filters)
router.get("/", async (req, res) => {
  try {
    const {
      subject,
      class: className,
      location,
      status,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    // If pagination is requested
    if (page && limit) {
      const result = await getTuitionsWithPagination(
        parseInt(page),
        parseInt(limit),
        sortBy || "createdAt",
        sortOrder || "desc"
      );
      return res.status(200).json(result);
    }

    // Build filters
    const filters = {};
    if (subject) filters.subject = subject;
    if (className) filters.class = className;
    if (location) filters.location = location;
    if (status) filters.status = status;
    else filters.status = "approved"; // Default: only show approved tuitions

    // Get tuitions
    const tuitions = await getAllTuitions(filters);

    res.status(200).json({
      count: tuitions.length,
      tuitions,
    });
  } catch (error) {
    console.error("Get tuitions error:", error);
    res.status(500).json({ message: "Server error while fetching tuitions." });
  }
});

// Route 3: GET /api/tuitions/:id - Get single tuition by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const tuition = await getTuitionById(req.params.id);

    if (!tuition) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    res.status(200).json(tuition);
  } catch (error) {
    console.error("Get tuition by ID error:", error);
    res.status(500).json({ message: "Server error while fetching tuition." });
  }
});

// Route 4: GET /api/tuitions/my-tuitions - Get logged-in student's tuitions (Protected)
router.get(
  "/student/my-tuitions",
  verifyToken,
  verifyStudent,
  async (req, res) => {
    try {
      const tuitions = await getTuitionsByStudentId(req.user.userId);

      res.status(200).json({
        count: tuitions.length,
        tuitions,
      });
    } catch (error) {
      console.error("Get my tuitions error:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching your tuitions." });
    }
  }
);

// Route 5: PUT /api/tuitions/:id - Update tuition (Student only - own tuitions)
router.put("/:id", verifyToken, verifyStudent, async (req, res) => {
  try {
    const {
      subject,
      class: className,
      location,
      budget,
      description,
    } = req.body;

    // First, check if tuition exists and belongs to this student
    const tuition = await getTuitionById(req.params.id);

    if (!tuition) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    // Check ownership
    if (tuition.student_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own tuitions." });
    }

    // Prepare update data
    const updateData = {};
    if (subject) updateData.subject = subject;
    if (className) updateData.class = className;
    if (location) updateData.location = location;
    if (budget) updateData.budget = parseFloat(budget);
    if (description !== undefined) updateData.description = description;

    // Update tuition
    const result = await updateTuition(req.params.id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    res.status(200).json({ message: "Tuition updated successfully." });
  } catch (error) {
    console.error("Update tuition error:", error);
    res.status(500).json({ message: "Server error while updating tuition." });
  }
});

// Route 6: DELETE /api/tuitions/:id - Delete tuition (Student only - own tuitions)
router.delete("/:id", verifyToken, verifyStudent, async (req, res) => {
  try {
    // First, check if tuition exists and belongs to this student
    const tuition = await getTuitionById(req.params.id);

    if (!tuition) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    // Check ownership
    if (tuition.student_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own tuitions." });
    }

    // Delete tuition
    const result = await deleteTuition(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    res.status(200).json({ message: "Tuition deleted successfully." });
  } catch (error) {
    console.error("Delete tuition error:", error);
    res.status(500).json({ message: "Server error while deleting tuition." });
  }
});

// Route 7: PATCH /api/tuitions/:id/status - Update tuition status (Admin only)
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({
          message: "Invalid status. Must be: pending, approved, or rejected.",
        });
    }

    // Update status
    const result = await updateTuitionStatus(req.params.id, status);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    res.status(200).json({ message: `Tuition ${status} successfully.` });
  } catch (error) {
    console.error("Update tuition status error:", error);
    res.status(500).json({ message: "Server error while updating status." });
  }
});

// Export router
module.exports = router;
