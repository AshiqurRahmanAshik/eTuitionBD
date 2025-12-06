import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import joinNow from "../assets/joinNow.png";
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

  const handleRegistration = (data) => {
    const profileImg = data.photo[0];

    registerUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        const formData = new FormData();
        formData.append("image", profileImg);
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOST_KEY
        }`;
        axios.post(image_API_URL, formData).then((res) => {
          console.log("after image upload", res.data.data.url);

          const userProfile = {
            displayName: data.name,
            photoURL: res.data.data.url,
          };
          updateUserProfile(userProfile)
            .then(() => {
              console.log("user profile updated done");
              navigate(location?.state || "/");
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
    <>
      <img className="w-[300px] lg:w-[500px]" src={joinNow} alt="join now" />

      <div className="border p-10 rounded-2xl text-primary font-semibold">
        <form onSubmit={handleSubmit(handleRegistration)}>
          <fieldset className="fieldset ">
            {/* Name */}
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input w-full"
              placeholder="Your name"
            />
            {errors?.name && <p className="text-red-500">Name is required</p>}

            {/* Photo Field */}
            <label className="label">Photo</label>
            <input
              type="file"
              {...register("photo", { required: true })}
              className="file-input w-full"
              placeholder="Your Photo"
            />
            {errors?.photo && <p className="text-red-500">Photo is required</p>}

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input w-full"
              placeholder="Email"
            />
            {errors?.email && <p className="text-red-500">Email is required</p>}

            {/* Password */}
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
                })}
                className="input w-full pr-16"
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-sm text-gray-600"
              >
                {showPassword ? <FaEye /> : <IoEyeOff />}
              </button>
            </div>

            {/* Password Errors */}
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Must be at least 6 characters</p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="text-red-500">
                Must include uppercase, lowercase, digit & special character
              </p>
            )}

            {/* LIVE CHECKLIST */}
            {showChecklist && (
              <div className="bg-gray-100 p-3 rounded-lg space-y-1 text-sm">
                <p className={hasUpper ? "text-green-600" : "text-gray-700"}>
                  ✓ At least one uppercase letter
                </p>
                <p className={hasLower ? "text-green-600" : "text-gray-700"}>
                  ✓ At least one lowercase letter
                </p>
                <p className={hasDigit ? "text-green-600" : "text-gray-700"}>
                  ✓ At least one digit
                </p>
                <p className={hasSpecial ? "text-green-600" : "text-gray-700"}>
                  ✓ At least one special character
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <label className="label mt-3">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
                className="input w-full pr-16"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-3 right-3 text-sm text-gray-600"
              >
                {showConfirm ? <FaEye /> : <IoEyeOff />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}

            {/* Submit */}
            <button className="btn text-white bg-primary w-full mt-6">
              Register
            </button>
          </fieldset>

          <p className="text-sm text-center mt-1 text-black">
            Already have an account?
            <Link to="/login" state={location.state} className="text-primary">
              {" "}
              Login Now
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

export default Register;
