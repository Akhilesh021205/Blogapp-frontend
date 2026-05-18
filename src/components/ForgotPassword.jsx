import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";

function ForgotPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Direct Reset logic
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/common-api/direct-reset`, data);
      toast.success(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found or update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-20 px-4`}>
      <div className={`${formCard} w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(37,99,235,0.2)] transition-all duration-300`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className={formTitle}>Password Reset</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Enter your registered email and your new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formGroup}>
            <label className={labelClass}>Registered Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className={`${inputClass} hover:border-blue-400/50 transition-colors`}
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass} pr-12`}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a10.704 10.704 0 014.58-5.584m.001 0a10.717 10.717 0 014.288-1.747m3.116 1.121a10.219 10.219 0 011.758 1.121M12 9a3 3 0 00-3 3m3-3a3 3 0 013 3m-3-3l.01-.01m-.01 3.01l.01-.01M21 21l-4-4m-8-8L4 4m5 5a3 3 0 003 3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass} pr-12 ${errors.confirmPassword ? 'border-red-500 bg-red-50/5' : ''}`}
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a10.704 10.704 0 014.58-5.584m.001 0a10.717 10.717 0 014.288-1.747m3.116 1.121a10.219 10.219 0 011.758 1.121M12 9a3 3 0 00-3 3m3-3a3 3 0 013 3m-3-3l.01-.01m-.01 3.01l.01-.01M21 21l-4-4m-8-8L4 4m5 5a3 3 0 003 3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Updating Account..." : "Reset Password Now"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
          <NavLink to="/login" className={`${linkClass} text-sm font-semibold flex items-center justify-center gap-2 transition-transform hover:-translate-x-1`}>
            Back to login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
