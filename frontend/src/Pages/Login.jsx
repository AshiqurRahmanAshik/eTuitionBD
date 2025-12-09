import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../components/SocialLogin";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      // 1. Login with Firebase
      const result = await signInUser(data.email, data.password);
      console.log("Firebase login successful:", result.user);

      // 2. Login to backend to get JWT token
      const backendResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      // 3. Save token
      localStorage.setItem("token", backendResponse.data.token);
      console.log("Backend login successful");

      alert("Login successful!");
      navigate(location?.state || "/");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(handleLogin)}>
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input input-bordered"
                placeholder="Enter your email"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <FaEye /> : <IoEyeOff />}
                </button>
              </div>
              {errors?.password && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              className="link link-primary font-semibold"
            >
              Register here
            </Link>
          </p>

          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
