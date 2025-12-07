// Import the database client and ObjectId
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

// Helper function to get the tuitions collection
const getTuitionsCollection = () => {
  return client.db("tuitionDB").collection("tuitions");
};

// Function 1: CREATE a new tuition post
const createTuition = async (tuitionData) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    // Add creation timestamp and default status
    const tuition = {
      ...tuitionData,
      status: "pending", // Default status is pending (waiting for admin approval)
      createdAt: new Date(),
    };
    const result = await tuitionsCollection.insertOne(tuition);
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 2: GET all tuitions (with optional filters)
// filters can include: status, subject, class, location, etc.
const getAllTuitions = async (filters = {}) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const tuitions = await tuitionsCollection.find(filters).toArray();
    return tuitions;
  } catch (error) {
    throw error;
  }
};

// Function 3: GET a single tuition by ID
const getTuitionById = async (id) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const tuition = await tuitionsCollection.findOne({ _id: new ObjectId(id) });
    return tuition;
  } catch (error) {
    throw error;
  }
};

// Function 4: GET tuitions by student ID (my tuitions for a specific student)
const getTuitionsByStudentId = async (studentId) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const tuitions = await tuitionsCollection
      .find({ student_id: studentId })
      .toArray();
    return tuitions;
  } catch (error) {
    throw error;
  }
};

// Function 5: UPDATE a tuition
const updateTuition = async (id, updateData) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const result = await tuitionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 6: UPDATE tuition status (approve/reject by admin)
const updateTuitionStatus = async (id, status) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const result = await tuitionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } } // status can be: 'pending', 'approved', 'rejected'
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 7: DELETE a tuition
const deleteTuition = async (id) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const result = await tuitionsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 8: GET tuitions with pagination and sorting
// Example: page=1, limit=10, sortBy='createdAt', sortOrder='desc'
const getTuitionsWithPagination = async (
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  try {
    const tuitionsCollection = getTuitionsCollection();
    const skip = (page - 1) * limit; // Calculate how many to skip
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 }; // -1 for descending, 1 for ascending

    const tuitions = await tuitionsCollection
      .find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Also get total count for pagination info
    const total = await tuitionsCollection.countDocuments();

    return {
      tuitions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalTuitions: total,
    };
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createTuition,
  getAllTuitions,
  getTuitionById,
  getTuitionsByStudentId,
  updateTuition,
  updateTuitionStatus,
  deleteTuition,
  getTuitionsWithPagination,
};
