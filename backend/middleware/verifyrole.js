// Middleware to verify user role
// This middleware should be used AFTER verifyToken

// Middleware to check if user is a Student
const verifyStudent = (req, res, next) => {
  try {
    // req.user comes from verifyToken middleware
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Students only." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error in role verification." });
  }
};

// Middleware to check if user is a Tutor
const verifyTutor = (req, res, next) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied. Tutors only." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error in role verification." });
  }
};

// Middleware to check if user is an Admin
const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error in role verification." });
  }
};

// Middleware to check if user is either Student or Tutor (not admin)
const verifyStudentOrTutor = (req, res, next) => {
  try {
    if (req.user.role !== "student" && req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error in role verification." });
  }
};

module.exports = {
  verifyStudent,
  verifyTutor,
  verifyAdmin,
  verifyStudentOrTutor,
};
