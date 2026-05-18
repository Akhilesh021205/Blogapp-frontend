import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink, useSearchParams } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  tagClass,
  mutedText,
  loadingClass,
  errorClass,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";

import { 
  BookOpen, 
  PenTool, 
  FileText, 
  Crown,
  Search,
  ArrowRight
} from "lucide-react";

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

function ArticlesFeed() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/user-api/articles`);
        if (Array.isArray(res.data?.payload)) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        console.error("error fetching stories", err);
        if (err.code === "ERR_NETWORK") {
          setError("Server is offline. Showing offline stories.");
          // Fallback mocks
          setArticles([
            { _id: '1', title: 'The Future of AI in Blogging', category: 'Technology', content: 'Explore how artificial intelligence is changing the way we create content and engage with readers.', createdAt: new Date().toISOString() },
            { _id: '2', title: 'Healthy Living: 10 Simple Habits', category: 'Lifestyle', content: 'Consistency is key. Learn how small daily changes can lead to a long-term improvement in your overall well-being.', createdAt: new Date().toISOString() },
            { _id: '3', title: 'Minimalist Office Setup Guide', category: 'Business', content: 'A clean workspace leads to a clean mind. Here is our curation of the best minimalist setups for productivity.', createdAt: new Date().toISOString() },
            { _id: '4', title: 'Coffee Brew Guides: Pour Over Basics', category: 'Art', content: 'The coffee culture is growing fast. Here is why you should start with the basics of brewing coffee.', createdAt: new Date().toISOString() }
          ]);
        } else {
          setError(err.response?.data?.error || "Failed to fetch stories");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(a => a.category === selectedCategory));
    }
  }, [selectedCategory, articles]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  // Helper to get category images
  const getCategoryImage = (category) => {
    const images = {
      "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      "Web Development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      "Business": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      "Lifestyle": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      "Science": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop",
      "Travel": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
    };
    return images[category] || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop";
  };

  if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center p-6"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-slate-400 font-medium">Exploring stories...</p></div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-20 transition-all duration-500">
      <header className="mb-10 text-center relative overflow-hidden py-16 rounded-[4rem] bg-gradient-to-b from-blue-600/5 to-transparent border border-white/5">
        <h1 className="text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">The Story Feed</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">Discover deep insights and expert perspectives from our creative community of writers.</p>

        {/* Category Filter Bar */}
        <div className="mt-14 flex flex-wrap gap-3 justify-center items-center max-w-5xl mx-auto">
          <button 
            onClick={() => handleCategoryChange('All')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 border ${
              selectedCategory === 'All' 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] scale-105' 
                : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            All Collections
          </button>
          {CATEGORIES.slice(0, 8).map(cat => (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border ${
                selectedCategory === cat 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] scale-105' 
                : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Oops! Something went wrong</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-xs leading-relaxed">{error}</p>
        </div>
      )}

      {!isAuthenticated && !loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">Login Required</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-12 max-w-sm mx-auto leading-relaxed">
            Please sign in to your account to explore our complete collection of stories and insights.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-bold text-sm transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 uppercase tracking-widest"
          >
            Login
          </button>
        </div>
      )}

      {isAuthenticated && !loading && filteredArticles.length > 0 && (
        <div className="space-y-32">
          {/* Featured Article Section */}
          {selectedCategory === 'All' && featuredArticle && (
            <section 
              className="group relative cursor-pointer"
              onClick={() => navigate(`/article/${featuredArticle._id}`, { state: featuredArticle })}
            >
              <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-800/40 backdrop-blur-2xl rounded-[4rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-blue-500/10 hover:-translate-y-2">
                <div className="lg:w-3/5 h-[500px] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {(featuredArticle.ArticleImage || featuredArticle.images?.[0]) ? (
                    <img 
                      src={featuredArticle.ArticleImage || featuredArticle.images[0]} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-6xl opacity-20"><BookOpen className="w-20 h-20" /></div>
                  )}
                  {featuredArticle.isPremium && (
                    <div className="absolute top-10 left-10 z-20">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-2.5 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md crown-glow">
                        <Crown className="w-5 h-5 text-white fill-current" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="lg:w-2/5 p-16 flex flex-col justify-center">
                  <span className="text-blue-500 font-bold uppercase tracking-[0.3em] mb-6 text-xs drop-shadow-sm">Featured Selection</span>
                  <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className={`text-slate-500 dark:text-slate-400 text-lg font-medium line-clamp-4 mb-10 leading-relaxed transition-all duration-700 ${featuredArticle.isPremium && !useAuth.getState().purchasedArticleIds?.includes(featuredArticle._id) ? 'blur-[8px] select-none opacity-40' : ''}`}>
                    {featuredArticle.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-xl text-blue-600"><PenTool className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{featuredArticle.author?.firstName || 'Community'}</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">{formatDate(featuredArticle.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Regular Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {(selectedCategory === 'All' ? regularArticles : filteredArticles).map((article) => {
               const isPremium = article.title?.includes("[Premium]") || article.category === "Technology" || article.isPremium;
               const isPurchased = useAuth.getState().purchasedArticleIds?.includes(article._id);
               
               return (
                <div
                  key={article._id}
                  className="group relative flex flex-col bg-white dark:bg-slate-800/20 backdrop-blur-xl rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] hover:-translate-y-4 hover:rotate-1 cursor-pointer"
                  onClick={() => navigate(`/article/${article._id}`, { state: article })}
                >
                  <div className="h-64 overflow-hidden relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {(article.ArticleImage || article.images?.[0]) ? (
                      <img 
                        src={article.ArticleImage || article.images[0]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-4xl opacity-20"><FileText className="w-12 h-12" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    
                    {isPremium && (
                      <div className="absolute top-6 right-6">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-2 rounded-xl shadow-lg border border-white/20 backdrop-blur-md crown-glow">
                           <Crown className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-6 left-8">
                      <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 uppercase tracking-widest">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    <p className={`text-slate-500 dark:text-slate-400 font-medium mb-8 line-clamp-3 leading-relaxed transition-all duration-700 ${isPremium && !isPurchased ? 'blur-[8px] select-none opacity-40' : ''}`}>
                      {article.content}
                    </p>

                    <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(article.createdAt)}</span>
                       <div className="flex items-center gap-3">
                         <span className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">{article.author?.firstName || 'User'}</span>
                         <PenTool className="w-4 h-4 text-blue-500" />
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticlesFeed;
