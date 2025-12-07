const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const getUsersCollection = () => {
  return client.db("tuitionDB").collection("users");
};

const createUser = async (userData) => {
  try {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.insertOne(userData);
    return result;
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ email: email });
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const usersCollection = getUsersCollection();

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, updateData) => {
  try {
    const usersCollection = getUsersCollection();

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const usersCollection = getUsersCollection();

    const users = await usersCollection.find().toArray();
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
