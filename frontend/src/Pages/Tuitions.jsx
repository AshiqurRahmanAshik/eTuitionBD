import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch, FaFilter } from "react-icons/fa";

const Tuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    class: "",
    location: "",
  });

  useEffect(() => {
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tuitions?status=approved`
      );
      setTuitions(response.data.tuitions);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tuitions based on search and filters
  const filteredTuitions = tuitions.filter((tuition) => {
    const matchesSearch =
      tuition.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      !filters.subject || tuition.subject === filters.subject;
    const matchesClass = !filters.class || tuition.class === filters.class;
    const matchesLocation =
      !filters.location || tuition.location === filters.location;

    return matchesSearch && matchesSubject && matchesClass && matchesLocation;
  });

  // Get unique values for filters
  const subjects = [...new Set(tuitions.map((t) => t.subject))];
  const classes = [...new Set(tuitions.map((t) => t.class))];
  const locations = [...new Set(tuitions.map((t) => t.location))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ subject: "", class: "", location: "" });
    setSearchTerm("");
  };

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
        <h1 className="text-4xl font-bold mb-4">Browse Tuitions</h1>
        <p className="text-lg text-gray-600">
          Find the perfect teaching opportunity
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          {/* Search Bar */}
          <div className="form-control mb-4">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search by subject, class, or location..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square btn-primary">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              name="subject"
              className="select select-bordered"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              name="class"
              className="select select-bordered"
              value={filters.class}
              onChange={handleFilterChange}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              name="location"
              className="select select-bordered"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <button onClick={clearFilters} className="btn btn-outline">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-lg font-semibold">
          {filteredTuitions.length} tuition
          {filteredTuitions.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Tuitions Grid */}
      {filteredTuitions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No tuitions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTuitions.map((tuition) => (
            <motion.div
              key={tuition._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-primary">{tuition.subject}</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Class:</span>{" "}
                    {tuition.class}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Location:</span>{" "}
                    {tuition.location}
                  </p>
                  <p className="text-lg font-bold text-secondary">
                    Budget: ৳{tuition.budget}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {tuition.description}
                  </p>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/tuitions/${tuition._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
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

export default Tuitions;
