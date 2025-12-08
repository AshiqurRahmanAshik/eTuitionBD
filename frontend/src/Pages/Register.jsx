import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../components/SocialLogin";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();

  const passwordValue = watch("password", "");

  const location = useLocation();
  const navigate = useNavigate();

  const handleRegistration = async (data) => {
    try {
      // 1. Register in Firebase
      const result = await registerUser(data.email, data.password);
      console.log("Firebase user created:", result.user);

      // 2. Upload photo to ImgBB
      let photoURL = "";
      if (data.photo && data.photo[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imageResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGE_HOST_KEY
          }`,
          formData
        );
        photoURL = imageResponse.data.data.url;
        console.log("Photo uploaded:", photoURL);
      }

      // 3. Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });
      console.log("Firebase profile updated");

      // 4. Register in Backend
      const backendResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          phone: data.phone,
          photoURL: photoURL,
        }
      );

      // 5. Save token
      localStorage.setItem("token", backendResponse.data.token);
      console.log("Backend registration successful");

      alert("Registration successful!");
      navigate(location?.state || "/");
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  // Password conditions
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasDigit = /\d/.test(passwordValue);
  const hasSpecial = /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(
    passwordValue
  );

  const showChecklist =
    passwordValue && !(hasUpper && hasLower && hasDigit && hasSpecial);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(handleRegistration)}>
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input input-bordered"
                placeholder="Your name"
              />
              {errors?.name && (
                <p className="text-red-500 text-sm mt-1">Name is required</p>
              )}
            </div>

            {/* Photo */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Profile Photo</span>
              </label>
              <input
                type="file"
                {...register("photo")}
                className="file-input file-input-bordered w-full"
                accept="image/*"
              />
            </div>

            {/* Email */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input input-bordered"
                placeholder="Your email"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>

            {/* Phone */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                {...register("phone", { required: true })}
                className="input input-bordered"
                placeholder="Your phone number"
              />
              {errors?.phone && (
                <p className="text-red-500 text-sm mt-1">Phone is required</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Register As</span>
              </label>
              <select
                {...register("role", { required: true })}
                className="select select-bordered"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    pattern:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
                  })}
                  className="input input-bordered w-full"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <FaEye /> : <IoEyeOff />}
                </button>
              </div>

              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required
                </p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 text-sm mt-1">
                  Must be at least 6 characters
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500 text-sm mt-1">
                  Must include uppercase, lowercase, digit & special character
                </p>
              )}

              {/* Password Checklist */}
              {showChecklist && (
                <div className="bg-gray-100 p-3 rounded-lg space-y-1 text-sm mt-2">
                  <p className={hasUpper ? "text-green-600" : "text-gray-700"}>
                    ✓ At least one uppercase letter
                  </p>
                  <p className={hasLower ? "text-green-600" : "text-gray-700"}>
                    ✓ At least one lowercase letter
                  </p>
                  <p className={hasDigit ? "text-green-600" : "text-gray-700"}>
                    ✓ At least one digit
                  </p>
                  <p
                    className={hasSpecial ? "text-green-600" : "text-gray-700"}
                  >
                    ✓ At least one special character
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  className="input input-bordered w-full"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? <FaEye /> : <IoEyeOff />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              className="link link-primary font-semibold"
            >
              Login Now
            </Link>
          </p>

          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
