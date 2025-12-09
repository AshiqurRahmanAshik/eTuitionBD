import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Tuitions from "../pages/Tuitions";
import TuitionDetail from "../pages/TuitionDetail";
import Tutors from "../pages/Tutors";
import TutorDetail from "../pages/TutorDetail";
import DashboardHome from "../pages/DashboardHome";
import Profile from "../pages/Profile";
import MyTuitions from "../pages/MyTuitions";
//import ApplicationsStudent from "../pages/ApplicationsStudent";
import PaymentHistory from "../pages/PaymentHistory";
import MyApplications from "../pages/MyApplications";
import TutorRevenue from "../pages/TutorRevenue";
import ManageUsers from "../pages/ManageUsers";
import ManageTuitions from "../pages/ManageTuitions";
import Analytics from "../pages/Analytics";
import PrivateRoutes from "./PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/tuitions",
        element: <Tuitions />,
      },
      {
        path: "/tuitions/:id",
        element: <TuitionDetail />,
      },
      {
        path: "/tutors",
        element: <Tutors />,
      },
      {
        path: "/tutors/:id",
        element: <TutorDetail />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardHome />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      // Student Routes
      {
        path: "/dashboard/my-tuitions",
        element: <MyTuitions />,
      },
      // {
      //   path: "/dashboard/applications",
      //   element: <ApplicationsStudent />,
      // },
      {
        path: "/dashboard/payments",
        element: <PaymentHistory />,
      },
      // Tutor Routes
      {
        path: "/dashboard/my-applications",
        element: <MyApplications />,
      },
      {
        path: "/dashboard/revenue",
        element: <TutorRevenue />,
      },
      // Admin Routes
      {
        path: "/dashboard/users",
        element: <ManageUsers />,
      },
      {
        path: "/dashboard/all-tuitions",
        element: <ManageTuitions />,
      },
      {
        path: "/dashboard/analytics",
        element: <Analytics />,
      },
    ],
  },
]);