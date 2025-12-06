import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const AuthLayouts = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayouts;
