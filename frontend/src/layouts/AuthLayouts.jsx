import React from "react";
import { Outlet } from "react-router";
import joinNow from "../assets/joinNow.png";
import Navbar from "../components/Navbar";

const AuthLayouts = () => {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center">
        <Outlet />
        <img className="w-[500px]" src={joinNow} alt="join now" />
      </div>
    </>
  );
};

export default AuthLayouts;
