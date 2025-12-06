import React from "react";
import Logo from "./Logo";
import MyContainer from "./MyContainer";
import MyLink from "./MyLink";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then()
      .catch((error) => [console.log(error)]);
  };

  return (
    <MyContainer className="sticky top-0">
      <div className="navbar bg-base-100 shadow-sm  ">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7297d6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              <li>
                <MyLink to="/">Home</MyLink>
              </li>
              <li>
                <MyLink to="/tuitions">Tuitions</MyLink>
              </li>
              <li>
                <MyLink to="/tutors">Tutors</MyLink>
              </li>
              <li>
                <MyLink to="/about">About Us</MyLink>
              </li>
              <li>
                <MyLink to="/teacher">Be a Teacher</MyLink>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <h2 className="font-bold text-xl -ms-1 text-primary">eTuitionBD</h2>
          </div>
        </div>

        {/* Navbar Center - Desktop Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <MyLink to="/">Home</MyLink>
            </li>
            <li>
              <MyLink to="/Tuitions">Tuitions</MyLink>
            </li>
            <li>
              <MyLink to="/about">About Us</MyLink>
            </li>
            <li>
              <MyLink to="/tutors">Tutors</MyLink>
            </li>
            <li>
              <MyLink to="/teacher">Be a Teacher</MyLink>
            </li>
          </ul>
        </div>

        {/* Navbar End*/}
        {user ? (
          // When user is logged in
          <div className="navbar-end gap-3">
            <button
              onClick={handleLogOut}
              className="btn btn-outline border-primary text-primary"
            >
              Sign Out
            </button>
          </div>
        ) : (
          // When no user logged in
          <div className="navbar-end gap-3">
            <Link
              to="/register"
              className="btn btn-outline border-primary text-primary"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn btn-outline border-primary text-primary"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </MyContainer>
  );
};

export default Navbar;
