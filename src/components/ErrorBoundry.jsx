import { useRouteError, useNavigate } from "react-router";

function ErrorBoundry() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { status, statusText } = error || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] p-6 font-sans antialiased text-slate-100">
      <div className="max-w-lg w-full bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] p-12 border border-white/5 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center">
          
          {/* Visual Element: Pulsing Hazard Icon */}
          <div className="relative mb-8">
             <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
             <div className="relative w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center border border-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Oops! Something went wrong</h1>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg max-w-[340px]">
            {status === 404 
              ? "We couldn't find the page you're looking for. It may have expired or never existed." 
              : "We've encountered a small hitch in the story. Try refreshing or head back home."}
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-10"></div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Primary Action */}
            <button
              onClick={() => window.location.href = "/"}
              className="group relative flex-1 inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-blue-600 rounded-2xl transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Back to Home</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => window.location.reload()}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-300 border border-white/10 rounded-2xl hover:bg-white/5 active:scale-[0.98]"
            >
              Refresh Page
            </button>
          </div>
          
          {error && (
            <div className="mt-8 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
              Debug Logic: {status || "Runtime"} {statusText || "Critical Exception"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundry;