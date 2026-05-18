import { useState } from "react";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import axios from "axios";

function SubscriptionModal({ isOpen, onClose, articleId }) {
  const purchaseArticle = useAuth((state) => state.purchaseArticle);
  const [selectedMethod, setSelectedMethod] = useState("upi");

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    const subscribeToast = toast.loading(`Connecting to ${selectedMethod.toUpperCase()}...`);
    
    try {
      // 1. Record purchase in Database
      await axios.post("http://localhost:4000/user-api/purchase", { articleId }, { withCredentials: true });
      
      // 2. Update Local Store for instant UI reaction
      purchaseArticle(articleId);
      
      toast.success("Payment successful! Article Unlocked.", { id: subscribeToast });
      onClose();
    } catch (err) {
      toast.error("Payment sync failed. Please try again.", { id: subscribeToast });
    }
  };

  const paymentMethods = [
    { id: "upi", name: "UPI Transfer", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 7l5-5 5 5M7 17l5 5 5-5M2 12h20" /></svg> },
    { id: "card", name: "Credit/Debit Card", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg> },
    { id: "net", name: "Net Banking", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M11 10v11M15 10v11M20 10v11" /></svg> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#0b0f19] w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors p-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Unlock Premium Content</h2>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5"></p>
            </div>
          </div>
          
          <div className="space-y-3 mb-12">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4 px-1">Secure Payment Gateways</p>
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
                  selectedMethod === method.id 
                    ? "border-blue-500 bg-blue-500/5" 
                    : "border-slate-100 dark:border-white/5 bg-transparent hover:border-slate-200 dark:hover:border-white/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${selectedMethod === method.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                  {method.icon}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-bold ${selectedMethod === method.id ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                    {method.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium"></p>
                </div>
                {selectedMethod === method.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95 mb-8"
          >
            Authorize Payment
          </button>
          
          <div className="flex items-center justify-center gap-4 opacity-30">
             <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Secured with SSL</span>
             <div className="h-4 w-px bg-slate-400"></div>
             <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionModal;
