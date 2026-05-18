import { NavLink, Outlet } from "react-router";
import { useAuth } from "../store/authStore";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  pageWrapper,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common";

import { Newspaper, Activity, Camera } from "lucide-react";

function AuthorProfile() {
  const user = useAuth((state) => state.currentUser);
  const updateProfilePic = useAuth((state) => state.updateProfilePic);
  const fileInputRef = useRef(null);

  const [articles, setArticles] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/author-api/articles`, { withCredentials: true });
        setArticles(res.data?.payload || []);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  // Calculate reach: Sum of comments as a proxy for engagement/reach if viewCount isn't available
  const totalReach = articles.reduce((acc, art) => acc + (art.comments?.length || 0), 0);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Author Info Header */}
      {user && (
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20 bg-white dark:bg-slate-800/40 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10"></div>
          
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user?.firstName}
                className="w-44 h-44 rounded-[2.5rem] object-cover shadow-2xl border-4 border-slate-100 dark:border-white/10 transition-all duration-500 group-hover:rotate-2 group-hover:scale-105"
              />
            ) : (
              <div className="w-44 h-44 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-6xl font-bold border-4 border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105">
                {user?.firstName?.[0] || "A"}
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
              <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm transition-colors duration-300">
                {user?.firstName} {user?.lastName}
              </h1>
              <span className="inline-block w-fit px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-bold tracking-[0.15em]">
                {user?.role}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-xl leading-relaxed transition-colors duration-300 mb-10">
             Passionate about writing and storytelling.
            </p>

            {/* Author Stats Row (Dynamic) */}
            <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-slate-100 dark:border-white/5">
              <div className="flex flex-col gap-1 text-slate-900 dark:text-white">
                 <span className="text-[12px] text-slate-400 font-medium tracking-wide">Total Articles</span>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold transition-colors duration-300">{loadingStats ? "..." : articles.length}</span>
                 </div>
              </div>
              <div className="flex flex-col gap-1 text-slate-900 dark:text-white">
                 <span className="text-[12px] text-slate-400 font-medium tracking-wide">Reach</span>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold transition-colors duration-300">{loadingStats ? "..." : totalReach}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Author Navigation */}
      <div className="flex gap-6 mb-6">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* Nested route content */}
      <Outlet />
    </div>
  );
}

export default AuthorProfile;