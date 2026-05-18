import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  pageBackground,
  pageWrapper,
  loadingClass,
  errorClass,
  articleCardClass,
  articleTitle,
  tagClass,
  articleMeta,
  divider,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";
import { 
  User, 
  Eye, 
  MessageSquare, 
  Clock, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Maximize, 
  Plus, 
  Crown,
  X,
  ShieldCheck,
  Send
} from "lucide-react";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);
  const purchasedArticleIds = useAuth((state) => state.purchasedArticleIds);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingCommentId, setPendingCommentId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fullImage, setFullImage] = useState(null);
  const imageInputRef = useRef(null);

  // ACCESS LOGIC
  const userRole = user?.role?.toUpperCase();
  const isAuthor = (userRole === "AUTHOR" || userRole === "ADMIN") && (
    String(user?._id) === String(article?.author?._id) || 
    String(user?.userId) === String(article?.author?._id)
  );

  const isPremiumArticle = String(article?.isPremium) === "true" || article?.category === "Technology";
  
  const isPurchased = Array.isArray(purchasedArticleIds) && purchasedArticleIds.some(pId => 
    String(pId) === String(article?._id) || 
    String(pId) === String(article?.id) ||
    String(pId) === String(id)
  );

  // Admins see everything, authors see their own, others check purchase
  const hasAccess = userRole === "ADMIN" || isAuthor || isPurchased;
  
  // A guest is always locked if it's premium
  const isLocked = isPremiumArticle && !hasAccess;
  
  // Stats logic
  const wordCount = article?.content?.trim().split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const views = article?.views || 0;

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/user-api/article/${id}`, { withCredentials: true });
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [id, article]);

  const formatDate = (date) => {
    if (!date) return "Just now";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Just now";
    return d.toLocaleString("en-IN", { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) { toast.error("Please login to comment"); return; }

    setSubmittingComment(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/user-api/articles`, {
        user: user._id || user.userId,
        articleId: id,
        comment: commentText
      }, { withCredentials: true });
      setArticle(res.data.payload);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setPendingCommentId(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPendingCommentId(null);
  };

  const confirmDeleteComment = async () => {
    if (!pendingCommentId) return;
    
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/user-api/articles/${id}/comments/${pendingCommentId}`, {}, { withCredentials: true });
      setArticle(res.data.payload);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const toggleArticleStatus = async (status) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/author-api/articles/${id}/status`, { isArticleActive: status }, { withCredentials: true });
      setArticle(res.data.payload);
      toast.success(status ? "Restored" : "Deleted");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const [replaceIndex, setReplaceIndex] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const isReplacing = replaceIndex !== null;
    const uploadToast = toast.loading(isReplacing ? "Replacing image..." : "Adding image to gallery...");

    try {
      let res;
      if (isReplacing) {
        res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/author-api/articles/${id}/images/${replaceIndex}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
      } else {
        res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/author-api/articles/${id}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
      }
      
      setArticle(res.data.payload);
      toast.success(isReplacing ? "Image replaced!" : "Image added!", { id: uploadToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: uploadToast });
    } finally {
      setUploadingImage(false);
      setReplaceIndex(null);
      if (e.target) e.target.value = ""; // reset input
    }
  };

  const handleImageDelete = async (idx) => {
    if (!window.confirm("Are you sure you want to remove this image from the storyboard?")) return;
    
    const deleteToast = toast.loading("Removing image...");
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/author-api/articles/${id}/images/${idx}`, { withCredentials: true });
      setArticle(res.data.payload);
      toast.success("Image removed", { id: deleteToast });
    } catch (err) {
      toast.error("Failed to remove image", { id: deleteToast });
    }
  };

  const triggerReplace = (idx) => {
    setReplaceIndex(idx);
    imageInputRef.current?.click();
  };

  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center p-6"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-slate-400 font-medium">Loading article...</p></div>;

  if (error || !article) {
    return (
      <div className={pageBackground}>
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
          <div className={errorClass}>{error || "Post not found"}</div>
          <button onClick={() => navigate("/")} className="mt-8 font-bold text-blue-600 hover:text-blue-500 transition-colors">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageBackground}>
      <div className="max-w-6xl mx-auto px-6 py-14">
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className={backBtn}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: MAIN CONTENT AREA */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-300">
            
            <header className="p-8 md:p-12 pb-0">
              <div className="flex items-center gap-3 mb-6">
                <span className={`${tagClass} bg-blue-500/10 text-blue-600 px-3 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest text-[10px] font-bold`}>{article.category}</span>
                {isPremiumArticle && (
                  <div className="premium-badge-elite flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg">
                     <Crown className="w-3.5 h-3.5 text-white fill-current" />
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] mb-8 tracking-tight">
                {article.title}
              </h1>

              {/* STATS ROW */}
              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5 group cursor-default">
                  <div className="p-2 rounded-xl bg-blue-500/5 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 leading-none mb-1">Views</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{views.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group cursor-default">
                  <div className="p-2 rounded-xl bg-emerald-500/5 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 leading-none mb-1">Comments</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{article.comments?.length || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group cursor-default">
                  <div className="p-2 rounded-xl bg-amber-500/5 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 leading-none mb-1">Time</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{readTime} <span className="text-slate-400 font-bold">Min Read</span></span>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-8 md:p-12 pt-10">
              {(article.ArticleImage || article.images?.[0]) && (
                <img src={article.ArticleImage || article.images[0]} alt="" className="w-full h-auto aspect-video object-cover rounded-[2rem] shadow-2xl mb-12 border border-slate-100 dark:border-white/5" />
              )}

              <section className="relative">
                <div className={`${articleContent} font-sans text-[1.1rem] leading-[2] text-slate-700 dark:text-slate-300 relative ${isLocked ? "blur-xl select-none pointer-events-none opacity-50 max-h-[450px] overflow-hidden rounded-3xl transition-all duration-700" : ""}`}>
                  {/* Visual separation of content */}
                  {article.content?.split("\n\n").map((para, i) => (
                    <div key={i} className={i > 0 ? "mt-8" : ""}>
                      {i === 0 && <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 drop-shadow-sm">Context & Details</span>}
                      {i === 1 && <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-12 mb-6 drop-shadow-sm">Key Insights</span>}
                      <p className="whitespace-pre-wrap">{para}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* GALLERY SECTION */}
              {!isLocked && (
                <div className="mt-20 pt-20 border-t border-slate-100 dark:border-white/5">
                  <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase tracking-[0.25em] mb-10">
                    <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
                    Visuals
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {article.images?.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setFullImage(img)}
                        className="relative group rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 aspect-video shadow-lg cursor-pointer"
                      >
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Storyboard ${idx}`} />
                        
                        {/* IMAGE CONTROLS FOR AUTHOR - SOFTENED UI */}
                        {isAuthor && (
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                            <button 
                              onClick={(e) => { e.stopPropagation(); triggerReplace(idx); }}
                              className="w-32 py-2.5 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 text-white border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Replace
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleImageDelete(idx); }}
                              className="w-32 py-2.5 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/30 text-red-200 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        )}
                        {!isAuthor && (
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                             <div className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md">
                                <Maximize className="w-5 h-5" />
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Placeholder for authors to add more */}
                    {isAuthor && (
                      <div 
                        onClick={() => imageInputRef.current?.click()}
                        className="aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-2xl"><Plus className="w-6 h-6" /></div>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Another</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SIDEBAR INFO PANEL */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* ARTICLE INFO BLOCK */}
            <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Article Metadata</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-slate-500">Category</span>
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{article.category}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-slate-500">Type</span>
                  {article.isPremium ? (
                    <span className="premium-badge-elite flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg">
                      <Crown className="w-3 h-3 text-white fill-current" />
                      Premium
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-black uppercase text-emerald-500 bg-emerald-500/10">
                      Free Access
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-slate-500">Status</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase ${article.isArticleActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {article.isArticleActive ? 'Live & Active' : 'Hidden / Draft'}
                  </span>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Updated</span>
                  <span className="text-xs font-black dark:text-white uppercase tracking-tighter">{formatDate(article.updatedAt)}</span>
                </div>
              </div>

              {isAuthor && (
                <div className="mt-8 flex flex-col gap-3">
                  <button className={`${editBtn} w-full justify-center`} onClick={() => editArticle(article)}>Edit This Story</button>
                  {article.isArticleActive ? (
                    <button className={`${deleteBtn} w-full justify-center`} onClick={() => toggleArticleStatus(false)}>Archive Post</button>
                  ) : (
                    <button className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold text-xs" onClick={() => toggleArticleStatus(true)}>Restore to Live</button>
                  )}
                </div>
              )}
            </div>

            {/* AUTHOR MINI-PROFILE */}
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Published By</h4>
               <div className="bg-white dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60 group">
                  <div className="flex items-center gap-4">
                    <img src={article.author?.profileImageUrl || "https://via.placeholder.com/150"} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform duration-500" />
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{article.author?.firstName} {article.author?.lastName}</p>
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Account</div>
                    </div>
                  </div>
                </div>

                {/* ELITE ACCESS SIDEBAR WIDGET */}
                {isLocked && (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl animate-in slide-in-from-right-10 duration-700 relative overflow-hidden group mt-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-all duration-700"></div>
                    
                    <div className="relative text-center">
                      <div className="premium-badge-elite w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-900/40">
                        <Crown className="w-7 h-7 text-white fill-current" />
                      </div>
                      
                      <h3 className="text-lg font-black text-white mb-2 tracking-tight">Unlock Elite Access</h3>
                      <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed">
                        {!user 
                          ? "Join our community to read the full story and engage with our writers." 
                          : "This premium story is reserved for our Elite members. Unlock it now to keep reading."}
                      </p>

                      <button 
                        onClick={() => !user ? navigate("/login") : setIsModalOpen(true)}
                        className="w-full py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[9px] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95"
                      >
                        {!user ? "Sign In Now" : "Unlock Story — ₹99"}
                      </button>

                      <div className="mt-6 flex items-center justify-center gap-3 opacity-20">
                        <div className="h-px w-8 bg-slate-400"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">Secure Access</span>
                        <div className="h-px w-8 bg-slate-400"></div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION - Full Width Bottom */}
        <div className="mt-20">
          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-12 tracking-tight">Conversations ({article.comments?.length || 0})</h2>
          
          {/* Only show comment form if logged in AND NOT the author */}
          {user && (user?._id !== article.author?._id && user?.userId !== article.author?._id) && (
            <form onSubmit={handleCommentSubmit} className="mb-20 flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl text-white shadow-lg overflow-hidden border-2 border-slate-100 dark:border-white/10">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-grow">
                <textarea
                  placeholder="Share your perspective..."
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-3xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none min-h-[120px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={600}
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{commentText.length} / 600</span>
                  <button type="submit" disabled={submittingComment || !commentText.trim()} className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">
                    {submittingComment ? "Posting..." : <div className="flex items-center gap-2">Post Comment <Send className="w-3.5 h-3.5" /></div>}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-12">
            {article.comments?.length > 0 && (
              [...article.comments].reverse().map((c) => (
                <div key={c._id} className="flex gap-6 animate-in fade-in duration-500">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xl text-slate-400 border border-slate-200 dark:border-white/5 overflow-hidden">
                    {c.user?.profileImageUrl ? (
                      <img src={c.user.profileImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                              {c.user?.firstName} {c.user?.lastName}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${c.user?.role === 'AUTHOR' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)] border border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                              {c.user?.role || "Member"}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{formatDate(c.createdAt)}</span>
                       </div>
                       {((user?.role === 'ADMIN') || (user?.role === 'USER' && (user?._id === c.user?._id || user?.userId === c.user?._id))) && (
                        <button onClick={() => handleDeleteComment(c._id)} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1.5"><Trash2 className="w-3 h-3" /> Delete</button>
                       )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mt-2 italic">
                      "{c.comment}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} articleId={article._id} title={article.title} />
      
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={confirmDeleteComment}
        title="Delete Comment?"
        message="Are you sure you want to remove this comment? This action is permanent."
        confirmText="Yes, Delete"
      />
      {/* FULL-SCREEN IMAGE VIEWER */}
      {fullImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setFullImage(null)}
        >
          <button className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all text-xl font-bold"><X className="w-6 h-6" /></button>
          <img 
            src={fullImage} 
            className="max-w-full max-h-full rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-500 cursor-default" 
            onClick={(e) => e.stopPropagation()}
            alt="Full view" 
          />
        </div>
      )}
    </div>
  );
}

export default ArticleByID;