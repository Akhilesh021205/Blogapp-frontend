import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

import { useAuth } from "../store/authStore";

const CATEGORIES = [
  "Technology",
  "Web Development",
  "Business",
  "Lifestyle",
  "Science",
  "Travel",
  "Art",
  "Education",
  "Health",
  "Fitness",
  "Food",
  "Entertainment",
  "Politics",
  "Sports",
  "Other"
];

function WriteArticle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const currentUser = useAuth((state) => state.currentUser);

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  // watch all fields for changes
  const formData = watch();

  // preview image logic
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file); // store file in form state
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Use a proper useEffect for loading draft
  useEffect(() => {
    const savedDraft = localStorage.getItem("article_draft");
    if (savedDraft) {
      setTimeout(() => {
        const draft = JSON.parse(savedDraft);
        if (window.confirm("Restore your unsaved draft?")) {
          Object.keys(draft).forEach(key => {
            // don't restore images from draft as they are non-serializable
             if(key !== 'image') setValue(key, draft[key]);
          });
          toast.success("Draft restored!");
        } else {
          localStorage.removeItem("article_draft");
        }
      }, 500);
    }
  }, [setValue]);

  // auto save effect
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentValues = watch();
      // only save if there is some content
      if (currentValues.title || currentValues.content) {
        // filter out file objects before saving to localStorage
        const { image, ...serializableValues } = currentValues;
        localStorage.setItem("article_draft", JSON.stringify(serializableValues));
      }
    }, 5000); // save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [watch]);

  const submitArticle = async (articleObj) => {
    // safety check
    if (!currentUser) {
      toast.error("Please login again");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      Object.keys(articleObj).forEach(key => {
        if (key === 'image' && articleObj[key]) {
          form.append('image', articleObj[key]);
        } else if (articleObj[key] !== undefined) {
          form.append(key, articleObj[key]);
        }
      });

      await axios.post(
        "http://localhost:4000/author-api/articles",
        form,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      toast.success("Article published successfully!");
      localStorage.removeItem("article_draft"); // Clear draft on success
      reset();
      setPreviewUrl(null);
      navigate("/author-profile");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to publish article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (<div className={formCard}> <h2 className={formTitle}>Write New Article</h2>

    <form onSubmit={handleSubmit(submitArticle)}>

      {/* Title */}
      <div className={formGroup}>
        <label className={labelClass}>Title</label>

        <input
          type="text"
          className={inputClass}
          placeholder="Enter article title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
          })}
        />

        {errors.title && (
          <p className={errorClass}>{errors.title.message}</p>
        )}
      </div>

      {/* Category & Premium Toggle Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={formGroup}>
          <label className={labelClass}>Category</label>
          <select
            className={`${inputClass} appearance-none cursor-pointer`}
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select category</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 px-5 rounded-2xl backdrop-blur-md">
          <input
            type="checkbox"
            id="isPremium"
            className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            {...register("isPremium")}
          />
          <label htmlFor="isPremium" className="text-[10px] font-bold text-amber-500 cursor-pointer uppercase tracking-widest">
            Mark as Premium
          </label>
        </div>
      </div>

      {/* Content */}
      <div className={formGroup}>
        <label className={labelClass}>Content</label>
        <textarea
          rows="10"
          className={inputClass}
          placeholder="Write your article content..."
          {...register("content", {
            required: "Content is required",
            minLength: { value: 50, message: "Content must be at least 50 characters" },
          })}
        />
        {errors.content && <p className={errorClass}>{errors.content.message}</p>}
      </div>

      {/* Article Image Upload */}
      <div className={formGroup}>
        <label className={labelClass}>Cover Image</label>
        
        <div className="flex flex-col gap-4">
          {!previewUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">Upload Cover Photo</p>
              <p className="text-[10px] opacity-70">PNG, JPG or WebP up to 5MB</p>
            </div>
          ) : (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition"
                >
                  Change
                </button>
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or use Image URL (Optional)</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://images.unsplash.com/..."
              {...register("ArticleImage")}
            />
          </div>
        </div>
      </div>

      {/* Active Checkbox */}
      <div className="flex items-center gap-3 mb-8">
        <input
          type="checkbox"
          id="isArticleActive"
          className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
          {...register("isArticleActive")}
          defaultChecked={true}
        />
        <label htmlFor="isArticleActive" className="text-xs font-medium text-slate-500 cursor-pointer">
          Draft mode (uncheck to keep private while writing)
        </label>
      </div>

      {/* Submit */}
      <button
        className={`${submitBtn} py-4`}
        type="submit"
        disabled={loading}
      >
        {loading ? "Publishing Story..." : "Publish Final Story"}
      </button>

      {loading && <p className={loadingClass}>Sending your story to the world...</p>}
    </form>
  </div>


  );
}

export default WriteArticle;
