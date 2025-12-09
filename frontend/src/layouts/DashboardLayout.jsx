import { Link, Outlet, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import api from "../utils/api";
import {
  FaHome,
  FaUser,
  FaBook,
  FaFileAlt,
  FaMoneyBill,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
      { path: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
    ];

    if (userRole === "student") {
      return [
        ...commonItems,
        {
          path: "/dashboard/my-tuitions",
          icon: <FaBook />,
          label: "My Tuitions",
        },
        {
          path: "/dashboard/applications",
          icon: <FaFileAlt />,
          label: "Applications",
        },
        {
          path: "/dashboard/payments",
          icon: <FaMoneyBill />,
          label: "Payment History",
        },
      ];
    }

    if (userRole === "tutor") {
      return [
        ...commonItems,
        {
          path: "/dashboard/my-applications",
          icon: <FaFileAlt />,
          label: "My Applications",
        },
        { path: "/dashboard/revenue", icon: <FaMoneyBill />, label: "Revenue" },
      ];
    }

    if (userRole === "admin") {
      return [
        ...commonItems,
        { path: "/dashboard/users", icon: <FaUsers />, label: "Manage Users" },
        {
          path: "/dashboard/all-tuitions",
          icon: <FaBook />,
          label: "Manage Tuitions",
        },
        {
          path: "/dashboard/analytics",
          icon: <FaChartBar />,
          label: "Analytics",
        },
      ];
    }

    return commonItems;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const menuItems = getMenuItems();

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for mobile */}
        <div className="navbar bg-base-100 lg:hidden shadow-md">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl">
              <span className="text-primary">eTuition</span>
              <span className="text-secondary">BD</span>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar header */}
          <div className="mb-8">
            <Link to="/" className="btn btn-ghost text-xl">
              <span className="text-primary">eTuition</span>
              <span className="text-secondary">BD</span>
            </Link>
          </div>

          {/* User info */}
          <div className="mb-6 px-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/150"}
                    alt={user?.displayName}
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold">{user?.displayName}</p>
                <p className="text-sm text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Menu items */}
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 hover:bg-primary hover:text-white"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="divider"></div>

          {/* Home and Logout buttons */}
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 hover:bg-secondary hover:text-white"
              >
                <FaHome />
                <span>Back to Home</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 hover:bg-error hover:text-white w-full"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
