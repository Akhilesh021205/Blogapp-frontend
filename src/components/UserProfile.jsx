import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { 
  User, 
  Crown, 
  LogOut, 
  PenTool, 
  AlertTriangle, 
  Camera, 
  Clock, 
  Unlock 
} from "lucide-react";

import {
  articleGrid,
  loadingClass,
  errorClass,
  tagClass,
} from "../styles/common.js";

function UserProfile() {
  const logout = useAuth((state) => state.logout);
  const updateProfilePic = useAuth((state) => state.updateProfilePic);
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);
  const purchasedArticleIds = useAuth((state) => state.purchasedArticleIds);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/user-api/articles", {
          withCredentials: true,
        });

        setArticles(res.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    const uploadToast = toast.loading("Updating profile picture...");

    try {
      await updateProfilePic(formData);
      toast.success("Profile picture updated!", { id: uploadToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update image", {
        id: uploadToast,
      });
    }
  };

  const formatDateIST = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {error && (
        <div className="mb-10 p-6 bg-red-500/10 text-red-400 rounded-3xl border border-red-500/20 font-medium backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* User Info Hero Section */}
      {user && (
        <div className="relative mb-24 group">
          {/* High-end Glow Backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[3.5rem] p-12 flex flex-col lg:flex-row items-center gap-14 shadow-2xl transition-all duration-700 hover:-translate-y-2 group/card overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[100px] -z-10 rounded-full"></div>
            
            {/* Premium Avatar Container */}
            <div className="relative group/avatar cursor-pointer shrink-0" onClick={handleImageClick}>
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover/avatar:opacity-40 transition-all duration-700 animate-pulse"></div>
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user?.firstName}
                  className="relative w-44 h-44 rounded-[2.8rem] object-cover ring-4 ring-white dark:ring-slate-800 shadow-2xl"
                />
              ) : (
                <div className="relative w-44 h-44 rounded-[2.8rem] bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-6xl font-bold">
                  <User className="w-16 h-16" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-slate-900/60 rounded-[2.8rem] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 backdrop-blur-sm z-10">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Greeting & Info */}
            <div className="flex-grow text-center lg:text-left">
              <div className="mb-6 flex flex-wrap justify-center lg:justify-start gap-3">
                {purchasedArticleIds.length > 0 ? (
                  <span className="px-5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-orange-950/20 flex items-center gap-2">
                    Premium Member <Crown className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="px-5 py-2 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-xl uppercase tracking-widest border border-slate-200 dark:border-white/5">
                    Free Plan
                  </span>
                )}
                <span className="px-5 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-xl uppercase tracking-widest border border-blue-500/20">
                  {user?.role}
                </span>
              </div>
              
              <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">
                Hi, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                  {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()}
                </span> 
              </h1>
              
              <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-12 tracking-tight">{user?.email}</p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">My Stories</span>
                  <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter transition-all duration-300 group-hover/card:text-blue-600">{articles.length}</span>
                </div>
                <div className="w-px h-12 bg-slate-100 dark:bg-white/5 hidden sm:block"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Unlocked</span>
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-amber-500" />
                    <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter transition-all duration-300 group-hover/card:text-amber-500">{purchasedArticleIds.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subdued Logout Action */}
            <div className="lg:ml-auto select-none">
              <button
                onClick={onLogout}
                className="group/logout flex items-center gap-3 px-10 py-4 bg-slate-100 dark:bg-white/5 dark:hover:bg-red-500/10 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-full font-bold text-sm transition-all duration-500 shadow-sm hover:shadow-red-500/10 border border-transparent hover:border-red-500/20 active:scale-95"
              >
                <span>Logout</span>
                <LogOut className="w-5 h-5 group-hover/logout:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Feed */}
      <div className="mb-12 flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-8 transition-colors duration-300">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Explore Stories</h2>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></span>
          {articles.length} Stories Available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((articleObj) => {
          const isPremium = articleObj.isPremium || articleObj.title?.includes("[Premium]") || articleObj.category === "Technology";
          const isPurchased = Array.isArray(purchasedArticleIds) && purchasedArticleIds.includes(articleObj._id);
          
          return (
            <div 
              key={articleObj._id}
              className={`group flex flex-col bg-white dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative cursor-pointer ${isPremium ? 'border-amber-500/40 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.1)] hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.4)] hover:-translate-y-2' : 'border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2'}`}
              onClick={() => navigateToArticleByID(articleObj)}
            >
              {isPremium && (
                <div className="absolute top-6 right-8 z-10">
                  <span className="px-5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-orange-900/20 border border-white/20 flex items-center gap-2">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                </div>
              )}

              <div className="p-10 flex flex-col h-full cursor-pointer">
                <div className="mb-6">
                  <span className={`${tagClass} px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20`}>
                    {articleObj.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                  {articleObj.title}
                </h3>
                
                <p className={`text-slate-500 dark:text-slate-400 font-medium line-clamp-3 mb-8 leading-relaxed transition-all duration-700 ${isPremium && !isPurchased ? 'blur-[5px] select-none opacity-40' : ''}`}>
                  {articleObj.content}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5 mt-auto">
                   <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{articleObj.author?.firstName || "Storyteller"}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {formatDateIST(articleObj.createdAt)}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserProfile;