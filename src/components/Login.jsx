import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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

import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

const shakeAnimation = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
`;

function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const error = useAuth((state) => state.error);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onUserLogin = async (userCredObj) => {
    const user = await login(userCredObj);
    
    if (user) {
      toast.success("Logged in successfully");

      if (user.role === "USER") {
        navigate("/user-profile");
      } else if (user.role === "AUTHOR") {
        navigate("/author-profile");
      }
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <style>{shakeAnimation}</style>
      <div className={formCard + " w-full max-w-lg"}>
        <h2 className={formTitle}>Login</h2>

        {error && (
          <p className={`${errorClass} mb-6 tracking-tight`}>
            {/* Warning Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}


      <form onSubmit={handleSubmit(onUserLogin)}>

        {/* Email */}
        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            {...register("email", { required: "this field is required" })}
            placeholder="enter email"
            className={`${inputClass} ${errors.email ? 'border-red-500 bg-red-50/10' : ''}`}
          />
          {errors.email && <p className="text-[11px] text-red-500 font-medium mt-1 lowercase">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className={`${formGroup} relative`}>
          <label className={labelClass}>Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "this field is required" })}
              placeholder="enter password"
              className={`${inputClass} ${errors.password ? 'border-red-500 bg-red-50/10' : ''}`}
            />
            {/* ... eyes svg ... */}


            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                /* Eye Slash */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a20.42 20.42 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.31 21.31 0 0 1-2.34 3.94M1 1l22 22" />
                </svg>
              ) : (
                /* Eye */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.password.message}</p>}
        </div>

        {/* Forgot Password */}
        <div className="text-right -mt-2 mb-4">
          <NavLink to="/forgot-password" className={`${linkClass} text-xs`}>
            Forgot password?
          </NavLink>
        </div>

        {/* Submit */}
        <button type="submit" className={submitBtn}>
          Login
        </button>

        {/* Divider */}
        <div className="relative my-6">
            
            <span className="w-full border-t border-slate-700/50"></span>
          
          <div className="relative flex justify-center  uppercase">
            <span className="px-3  font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => window.location.href = "http://localhost:4000/auth/google"}
          className="w-full h-11 flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-white/5 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
            />
            <path
              fill="#34A853"
              d="M16.04 18.013c-1.09.593-2.325.896-3.618.896a7.077 7.077 0 0 1-6.73-4.909l-4.026 3.115C3.198 21.302 7.27 24 12 24c3.055 0 5.782-1.145 7.91-3l-3.87-2.987z"
            />
            <path
              fill="#4285F4"
              d="M19.91 21c2.128-1.855 3.59-4.704 3.59-8.182 0-.618-.046-1.166-.145-1.706h-11.355v4.545h6.4c-.276 1.488-1.1 2.742-2.36 3.585l3.87 2.958z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235A7.077 7.077 0 0 1 4.909 12c0-.783.128-1.53.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.454 3.723 1.24 5.35l4.026-3.115z"
            />
          </svg>
          Sign in with Google
        </button>
      </form>


      <p className={`${mutedText} text-center mt-5`}>
        Don't have an account?{" "}
        <NavLink to="/register" className={linkClass}>
          Create one
        </NavLink>
      </p>
    </div>
    </div>


  );
}

export default Login;
