import React from "react";
import { Outlet } from "react-router";
import joinNow from "../assets/joinNow.png";

const AuthLayouts = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <img className="w-80" src={joinNow} alt="join now" />
      <Outlet />
    </div>
  );
};

export default AuthLayouts;
