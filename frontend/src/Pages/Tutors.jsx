import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch, FaEnvelope, FaPhone } from "react-icons/fa";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users?role=tutor`
      );
      setTutors(response.data.users);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tutors based on search
  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Find Expert Tutors</h1>
        <p className="text-lg text-gray-600">
          Connect with qualified educators across Bangladesh
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search tutors by name or email..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square btn-primary">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-lg font-semibold">
          {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No tutors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <motion.div
              key={tutor._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="card bg-base-100 shadow-xl"
            >
              <figure className="px-10 pt-10">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={tutor.photoURL || "https://via.placeholder.com/150"}
                      alt={tutor.name}
                    />
                  </div>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{tutor.name}</h2>
                
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <FaEnvelope />
                    <span className="truncate">{tutor.email}</span>
                  </div>
                  {tutor.phone && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <FaPhone />
                      <span>{tutor.phone}</span>
                    </div>
                  )}
                </div>

                <div className="badge badge-primary mt-2">Verified Tutor</div>

                <div className="card-actions mt-4">
                  <Link
                    to={`/tutors/${tutor._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutors;