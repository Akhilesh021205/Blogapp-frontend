// src/styles/common.js
// Theme: Dynamic — using Tailwind's dark: prefix

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 antialiased selection:bg-blue-500/30 transition-colors duration-300";
export const pageWrapper = "max-w-5xl mx-auto px-6 py-16";
export const section = "mb-14";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-white border border-slate-200 rounded-3xl p-7 hover:bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700/50 dark:hover:bg-slate-800 transition duration-300 cursor-pointer shadow-xl";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass = "text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-2 transition-colors duration-300";
export const headingClass = "text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300";
export const subHeadingClass = "text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-tight transition-colors duration-300";
export const bodyText = "text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300";
export const mutedText = "text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300";
export const linkClass = "text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-blue-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition-all cursor-pointer text-sm tracking-tight shadow-lg hover:shadow-blue-900/20";
export const secondaryBtn =
  "border border-slate-200 text-slate-600 font-medium px-5 py-2 rounded-full hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm";
export const ghostBtn = "text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors cursor-pointer text-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard = "bg-white border border-slate-200 backdrop-blur-md rounded-2xl p-10 max-w-4xl mx-auto shadow-2xl dark:bg-slate-800/50 dark:border-slate-700/50 transition-all duration-300";
export const formTitle = "text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight text-center mb-7 transition-colors duration-300";
export const labelClass = "text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block transition-colors duration-300";
export const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-600 transition duration-300";
export const formGroup = "mb-4";
export const submitBtn =
  "w-full bg-blue-600 text-white font-semibold py-2.5 rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition-all cursor-pointer mt-2 text-sm tracking-tight shadow-lg";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 h-[60px] flex items-center sticky top-0 z-50 dark:bg-slate-950/80 dark:border-white/5 transition-colors duration-300";
export const navContainerClass = "max-w-5xl mx-auto w-full flex items-center justify-between";
export const navBrandClass = "text-base font-bold text-slate-900 dark:text-slate-100 tracking-widest transition-colors duration-300";
export const navLinksClass = "flex items-center gap-7";
export const navLinkClass = "text-[0.85rem] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium";
export const navLinkActiveClass = "text-[0.85rem] text-blue-600 dark:text-blue-400 font-semibold";

// ─── Article / Blog ───────────────────────────────────
export const articleGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
export const articleCardClass =
  "bg-white border border-slate-100 p-7 hover:bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700/50 dark:hover:bg-slate-800 transition duration-300 flex flex-col gap-2.5 cursor-pointer rounded-3xl shadow-xl";
export const articleTitle = "text-base font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight transition-colors duration-300";
export const articleExcerpt = "text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300";
export const articleMeta = "text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300";
export const articleBody = "text-slate-700 dark:text-slate-300 leading-[1.85] text-[0.95rem] max-w-2xl transition-colors duration-300";
export const timestampClass = "text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1.5 transition-colors duration-300";
export const tagClass = "text-[0.65rem] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest w-fit transition-colors duration-300";

// ─── Article Page ─────────────────────────────────────
export const articlePageWrapper = "max-w-3xl mx-auto px-6 py-14 bg-white rounded-3xl border border-slate-100 shadow-2xl mt-8 pb-20 dark:bg-slate-800/40 dark:border-slate-700/50 transition-all duration-300";

export const articleHeader = "mb-10 flex flex-col gap-4";
export const articleCategory = "text-[0.7rem] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400";
export const articleMainTitle = "text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight transition-colors duration-300";
export const articleAuthorRow =
  "flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-700/50 py-4 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300";
export const authorInfo = "flex items-center gap-2 font-medium text-slate-900 dark:text-slate-200 transition-colors duration-300";
export const articleContent = "text-slate-700 dark:text-slate-300 leading-[1.9] text-[1.05rem] whitespace-pre-line mt-8 transition-colors duration-300";
export const articleFooter = "border-t border-slate-100 dark:border-slate-700/50 mt-12 pt-6 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300";

// ─── Article Actions ─────────────────────────────
export const articleActions = "flex gap-3 mt-8";
export const editBtn = "bg-blue-600/10 text-blue-600 border border-blue-600/30 font-medium px-5 py-2 rounded-full hover:bg-blue-600/20 dark:bg-blue-600/20 dark:text-blue-400 transition";
export const deleteBtn = "bg-red-500/10 text-red-600 border border-red-500/30 font-medium px-5 py-2 rounded-full hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 transition";

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 shadow-lg";
export const successClass =
  "bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 shadow-lg";
export const loadingClass = "text-blue-600 dark:text-blue-500 text-sm animate-pulse text-center py-10 font-semibold tracking-wider";
export const emptyStateClass = "text-center text-slate-500 dark:text-slate-500 py-20 text-sm italic border border-slate-100 dark:border-slate-700/30 rounded-3xl bg-slate-50 dark:bg-slate-800/30 mx-4 transition-all duration-300";

// ─── Navigation ───────────────────────────────────────
export const backBtn = "group mb-12 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-500/5 hover:bg-blue-500/10 text-slate-500 hover:text-blue-600 dark:bg-white/5 dark:hover:bg-blue-400/10 dark:text-slate-400 dark:hover:text-blue-400 font-semibold text-[0.85rem] transition-all duration-300 w-fit cursor-pointer";

// ─── Divider ──────────────────────────────────────────
export const divider = "border-t border-slate-100 dark:border-slate-700/50 my-10 transition-colors duration-300";