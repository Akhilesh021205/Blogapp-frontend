import { useEffect } from "react";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)] p-8 sm:p-10 overflow-hidden animate-in zoom-in fade-in duration-300">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center text-center">
          {/* Warning Icon Container */}
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            {title || "Confirm Action"}
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 max-w-[280px]">
            {message || "Are you sure you want to proceed? This action cannot be undone."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-[0.98] tracking-widest text-[10px]"
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 active:scale-[0.98] tracking-widest text-[10px]"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
