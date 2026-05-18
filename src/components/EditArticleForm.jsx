import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  secondaryBtn,
} from "../styles/common";

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

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const article = location.state;

  const [previewUrl, setPreviewUrl] = useState(article?.ArticleImage || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // prefill form
  useEffect(() => {
    if (!article) {
      const savedDraft = localStorage.getItem(`edit_draft_${id}`);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        Object.keys(draft).forEach(key => {
          if (key !== 'image') setValue(key, draft[key]);
        });
      }
      return;
    }

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
    setValue("isArticleActive", article.isArticleActive);
    setValue("isPremium", article.isPremium);
    setValue("ArticleImage", article.ArticleImage);
    setPreviewUrl(article.ArticleImage);
  }, [article, id, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setValue("ArticleImage", "");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto-save draft
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentValues = watch();
      if (currentValues.title || currentValues.content) {
        const { image, ...serializable } = currentValues;
        localStorage.setItem(`edit_draft_${id}`, JSON.stringify(serializable));
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [watch, id]);

  const updateArticle = async (data) => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key]) {
          form.append('image', data[key]);
        } else if (data[key] !== undefined) {
          form.append(key, data[key]);
        }
      });

      const res = await axios.put(
        `http://localhost:4000/author-api/articles/${article._id}`,
        form,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (res.status === 200) {
        toast.success("Article updated successfully");
        localStorage.removeItem(`edit_draft_${id}`);
        navigate("/author-profile/articles");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update article");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>
          <input className={inputClass} {...register("title", { required: "Title required" })} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category & Premium Toggle Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              className={`${inputClass} appearance-none cursor-pointer`}
              {...register("category", { required: "Category required" })}
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
          <textarea rows="14" className={inputClass} {...register("content", { required: "Content required" })} />
          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        {/* Image Upload Component */}
        <div className={formGroup}>
          <label className={labelClass}>Cover Image</label>
          <div className="flex flex-col gap-4">
            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-500/5 cursor-pointer transition-all duration-300"
              >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
                <p className="text-xs font-bold uppercase tracking-widest">Upload New Cover Photo</p>
              </div>
            ) : (
              <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold">Change</button>
                  <button type="button" onClick={removeImage} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold">Remove</button>
                </div>
              </div>
            )}
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            <input
              type="url"
              className={inputClass}
              placeholder="Or keep existing URL: https://..."
              {...register("ArticleImage")}
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-5 rounded-2xl backdrop-blur-md mb-8">
          <input
            type="checkbox"
            id="isArticleActive"
            className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
            {...register("isArticleActive")}
          />
          <label htmlFor="isArticleActive" className="text-sm font-medium text-slate-300 cursor-pointer">
            Visible to readers
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button disabled={loading} className={`${submitBtn} py-3 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all`}>
            {loading ? "Saving Changes..." : "Save Article Updates"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`${secondaryBtn} w-full py-3 mt-0`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditArticle;