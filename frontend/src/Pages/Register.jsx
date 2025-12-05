import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch("password", "");

  const handleRegistration = (data) => {
    console.log(data);
  };

  // Password conditions
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasDigit = /\d/.test(passwordValue);
  const hasSpecial = /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(
    passwordValue
  );

  // Show checklist only if NOT all conditions matched
  const showChecklist =
    passwordValue && !(hasUpper && hasLower && hasDigit && hasSpecial);

  return (
    <div className="mt-10 border p-10 rounded-2xl">
      <form onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset ">
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
          <button className="btn btn-neutral w-full mt-6">Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
