// Import the database client and ObjectId
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

// Helper function to get the applications collection
const getApplicationsCollection = () => {
  return client.db("tuitionDB").collection("applications");
};

// Function 1: CREATE a new application (tutor applies to a tuition)
const createApplication = async (applicationData) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    // Add creation timestamp and default status
    const application = {
      ...applicationData,
      status: "pending", // Default status is pending
      createdAt: new Date(),
    };
    const result = await applicationsCollection.insertOne(application);
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 2: GET all applications for a specific tuition
// This is used by students to see who applied to their tuition
const getApplicationsByTuitionId = async (tuitionId) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const applications = await applicationsCollection
      .find({ tuition_id: tuitionId })
      .toArray();
    return applications;
  } catch (error) {
    throw error;
  }
};

// Function 3: GET all applications by a specific tutor
// This is used by tutors to see their own applications
const getApplicationsByTutorId = async (tutorId) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const applications = await applicationsCollection
      .find({ tutor_id: tutorId })
      .toArray();
    return applications;
  } catch (error) {
    throw error;
  }
};

// Function 4: GET a single application by ID
const getApplicationById = async (id) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const application = await applicationsCollection.findOne({
      _id: new ObjectId(id),
    });
    return application;
  } catch (error) {
    throw error;
  }
};

// Function 5: UPDATE an application
const updateApplication = async (id, updateData) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 6: UPDATE application status (approve/reject)
// Status changes to 'approved' after payment or 'rejected' by student
const updateApplicationStatus = async (id, status) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } } // status can be: 'pending', 'approved', 'rejected'
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 7: DELETE an application
const deleteApplication = async (id) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const result = await applicationsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Function 8: Check if tutor already applied to a tuition
// Prevents duplicate applications
const checkExistingApplication = async (tutorId, tuitionId) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const application = await applicationsCollection.findOne({
      tutor_id: tutorId,
      tuition_id: tuitionId,
    });
    return application; // Returns null if no existing application
  } catch (error) {
    throw error;
  }
};

// Export all functions
module.exports = {
  createApplication,
  getApplicationsByTuitionId,
  getApplicationsByTutorId,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  checkExistingApplication,
};
