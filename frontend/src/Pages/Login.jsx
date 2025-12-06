import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import welcomeBack from "../assets/welcomeback.png";
import SocialLogin from "../components/SocialLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const naviagate = useNavigate();
  const { signInUser } = useAuth();

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        console.log("Logged in:", result.user);
        Navigate(location?.state || "/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <img
        className="w-[300px] lg:w-[500px]"
        src={welcomeBack}
        alt="join now"
      />
      <div className="border p-10 rounded-2xl text-primary font-semibold">
        <form onSubmit={handleSubmit(handleLogin)}>
          <fieldset className="fieldset">
            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input w-full"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            {/* Password */}
            <label className="label mt-3">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="input w-full pr-16"
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-600"
              >
                {showPassword ? <FaEye /> : <IoEyeOff />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500">Password is required</p>
            )}

            {/* Submit */}
            <button className="btn text-white bg-primary w-full mt-6">
              Login
            </button>
          </fieldset>

          <p className="text-sm text-center mt-1 text-black">
            Don't have an account?
            <Link
              to="/register"
              state={location.state}
              className="text-primary"
            >
              {" "}
              Register Now
            </Link>
          </p>
        </form>
        <div>
          <SocialLogin />
        </div>
      </div>
    </>
  );
};

export default Login;
