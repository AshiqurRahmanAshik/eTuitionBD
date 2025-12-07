// Import required packages and models
const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplicationsByTuitionId,
  getApplicationsByTutorId,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  checkExistingApplication,
} = require("../models/application");
const { getTuitionById } = require("../models/tuition");
const verifyToken = require("../middleware/verifytoken");
const { verifyStudent, verifyTutor } = require("../middleware/verifyrole");

// Route 1: POST /api/applications - Tutor applies to a tuition
router.post("/", verifyToken, verifyTutor, async (req, res) => {
  try {
    const { tuition_id, qualifications, experience, expectedSalary } = req.body;

    // Validate required fields
    if (!tuition_id || !qualifications || !experience || !expectedSalary) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Check if tuition exists
    const tuition = await getTuitionById(tuition_id);
    if (!tuition) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    // Check if tuition is approved
    if (tuition.status !== "approved") {
      return res
        .status(400)
        .json({ message: "You can only apply to approved tuitions." });
    }

    // Check if tutor already applied
    const existingApplication = await checkExistingApplication(
      req.user.userId,
      tuition_id
    );
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this tuition." });
    }

    // Create application
    const applicationData = {
      tuition_id,
      tutor_id: req.user.userId,
      qualifications,
      experience,
      expectedSalary: parseFloat(expectedSalary),
    };

    const result = await createApplication(applicationData);

    res.status(201).json({
      message: "Application submitted successfully.",
      applicationId: result.insertedId,
    });
  } catch (error) {
    console.error("Create application error:", error);
    res
      .status(500)
      .json({ message: "Server error while submitting application." });
  }
});

// Route 2: GET /api/applications/tuition/:id - Get all applications for a tuition (Student only)
router.get("/tuition/:id", verifyToken, verifyStudent, async (req, res) => {
  try {
    // First check if tuition belongs to this student
    const tuition = await getTuitionById(req.params.id);

    if (!tuition) {
      return res.status(404).json({ message: "Tuition not found." });
    }

    if (tuition.student_id !== req.user.userId) {
      return res
        .status(403)
        .json({
          message: "You can only view applications for your own tuitions.",
        });
    }

    // Get applications
    const applications = await getApplicationsByTuitionId(req.params.id);

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get applications by tuition error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching applications." });
  }
});

// Route 3: GET /api/applications/my-applications - Get tutor's own applications
router.get("/my-applications", verifyToken, verifyTutor, async (req, res) => {
  try {
    const applications = await getApplicationsByTutorId(req.user.userId);

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching your applications." });
  }
});

// Route 4: GET /api/applications/:id - Get single application by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const application = await getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Check if user is the tutor who applied or the student who owns the tuition
    const tuition = await getTuitionById(application.tuition_id);

    if (
      application.tutor_id !== req.user.userId &&
      tuition.student_id !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Get application error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching application." });
  }
});

// Route 5: PUT /api/applications/:id - Update application (Tutor only - own applications, only if pending)
router.put("/:id", verifyToken, verifyTutor, async (req, res) => {
  try {
    const { qualifications, experience, expectedSalary } = req.body;

    // Get application
    const application = await getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Check ownership
    if (application.tutor_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own applications." });
    }

    // Check if status is pending
    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ message: "You can only update pending applications." });
    }

    // Prepare update data
    const updateData = {};
    if (qualifications) updateData.qualifications = qualifications;
    if (experience) updateData.experience = experience;
    if (expectedSalary) updateData.expectedSalary = parseFloat(expectedSalary);

    // Update application
    const result = await updateApplication(req.params.id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application updated successfully." });
  } catch (error) {
    console.error("Update application error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating application." });
  }
});

// Route 6: DELETE /api/applications/:id - Delete application (Tutor only - own applications, only if pending)
router.delete("/:id", verifyToken, verifyTutor, async (req, res) => {
  try {
    // Get application
    const application = await getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Check ownership
    if (application.tutor_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own applications." });
    }

    // Check if status is pending
    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ message: "You can only delete pending applications." });
    }

    // Delete application
    const result = await deleteApplication(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Delete application error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting application." });
  }
});

// Route 7: PATCH /api/applications/:id/approve - Approve application (Student only - after payment)
router.patch("/:id/approve", verifyToken, verifyStudent, async (req, res) => {
  try {
    // Get application
    const application = await getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Check if tuition belongs to this student
    const tuition = await getTuitionById(application.tuition_id);
    if (tuition.student_id !== req.user.userId) {
      return res
        .status(403)
        .json({
          message: "You can only approve applications for your own tuitions.",
        });
    }

    // Check if already approved or rejected
    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Application has already been processed." });
    }

    // Update status to approved
    await updateApplicationStatus(req.params.id, "approved");

    res.status(200).json({ message: "Application approved successfully." });
  } catch (error) {
    console.error("Approve application error:", error);
    res
      .status(500)
      .json({ message: "Server error while approving application." });
  }
});

// Route 8: PATCH /api/applications/:id/reject - Reject application (Student only)
router.patch("/:id/reject", verifyToken, verifyStudent, async (req, res) => {
  try {
    // Get application
    const application = await getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Check if tuition belongs to this student
    const tuition = await getTuitionById(application.tuition_id);
    if (tuition.student_id !== req.user.userId) {
      return res
        .status(403)
        .json({
          message: "You can only reject applications for your own tuitions.",
        });
    }

    // Check if already approved or rejected
    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Application has already been processed." });
    }

    // Update status to rejected
    await updateApplicationStatus(req.params.id, "rejected");

    res.status(200).json({ message: "Application rejected successfully." });
  } catch (error) {
    console.error("Reject application error:", error);
    res
      .status(500)
      .json({ message: "Server error while rejecting application." });
  }
});

// Export router
module.exports = router;
