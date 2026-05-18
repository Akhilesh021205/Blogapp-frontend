import { useForm } from "react-hook-form";
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
  divider,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

const shakeAnimation = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
`;

function Register() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    const endpoint =
      (newUser.role || "").toLowerCase() === "author"
        ? "http://localhost:4000/author-api/users"
        : "http://localhost:4000/user-api/users";

    try {
      const formData = new FormData();
      const { profilePic, ...userObj } = newUser;

      Object.entries(userObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (profilePic && profilePic[0]) {
        formData.append("profilePic", profilePic[0]);
      }


      const resObj = await axios.post(endpoint, formData);

      if (resObj.status === 201) {
        navigate("/login");
        return;
      }

      setError(`Unexpected status: ${resObj.status}`);
    } catch (err) {
      console.error("Register error:", err.response || err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading === true) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-violet-600 font-medium animate-pulse text-lg">Creating your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
       <style>{shakeAnimation}</style>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {error && (
          <p className={`${errorClass} mb-6 tracking-tight`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onUserRegister)}>
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  {...register("role", { required: "this field is required" })}
                  value="user"
                  className="accent-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-slate-300 font-medium group-hover:text-blue-400 transition-colors">User</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  {...register("role", { required: "this field is required" })}
                  value="author"
                  className="accent-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-slate-300 font-medium group-hover:text-blue-400 transition-colors">Author</span>
              </label>
            </div>
            {errors.role && <p className="text-[11px] text-red-400 font-medium mt-1 lowercase">{errors.role.message}</p>}
          </div>

          <div className={divider} />

          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                {...register("firstName", { required: "this field is required" })}
                placeholder="First name"
                className={`${inputClass} ${errors.firstName ? 'border-red-500 bg-red-50/10' : ''}`}
              />
              {errors.firstName && <p className="text-[11px] text-red-500 font-medium mt-1 lowercase">{errors.firstName.message}</p>}
            </div>

            <div className="flex-1 mt-4 sm:mt-0">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                {...register("lastName", { required: "this field is required" })}
                placeholder="Last name"
                className={`${inputClass} ${errors.lastName ? 'border-red-500 bg-red-50/10' : ''}`}
              />
              {errors.lastName && <p className="text-[11px] text-red-500 font-medium mt-1 lowercase">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register("email", { required: "this field is required" })}
              placeholder="you@example.com"
              className={`${inputClass} ${errors.email ? 'border-red-500 bg-red-50/10' : ''}`}
            />
            {errors.email && <p className="text-[11px] text-red-500 font-medium mt-1 lowercase">{errors.email.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              {...register("password", { 
                required: "this field is required",
                minLength: { value: 6, message: "min 6 characters" }
              })}
              placeholder="Min. 6 characters"
              className={`${inputClass} ${errors.password ? 'border-red-500 bg-red-50/10' : ''}`}
            />
            {errors.password && <p className="text-[11px] text-red-500 font-medium mt-1 lowercase">{errors.password.message}</p>}
          </div>

          <div className={formGroup}>
             <label className={labelClass}>Profile Picture</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("profilePic")}
              className="text-xs file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition-all block w-full text-stone-400"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setError("Only JPG or PNG allowed");
                    return;
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    setError("File size must be less than 2MB");
                    return;
                  }

                  const previewUrl = URL.createObjectURL(file);
                  setPreview(previewUrl);
                  setError(null);
                }
              }}
            />
          </div>

          {preview && (
            <div className="mb-6 flex justify-center">
              <img
                src={preview}
                alt="preview"
                  className="w-24 h-24 object-cover rounded-2xl cursor-pointer shadow-xl border-2 border-white/10 ring-4 ring-blue-500/10"
                />
              </div>
            )}

            <button type="submit" className={`${submitBtn} mt-2 bg-blue-600 hover:bg-blue-500`}>
              Create Account
            </button>
          </form>

          <p className={`${mutedText} text-center mt-6`}>
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-bold hover:underline"
            >
              Sign in
            </NavLink>
          </p>
      </div>
    </div>
  );
}

export default Register;