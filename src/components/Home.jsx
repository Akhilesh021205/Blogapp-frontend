import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import {
  pageBackground,
  pageWrapper,
  pageTitleClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  tagClass,
  mutedText,
  loadingClass,
  divider
} from '../styles/common';

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

const blobAnimation = `
  @keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }
`;

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedArticles, setRecommendedArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/user-api/articles`);
        const allArticles = res.data?.payload;
        
        if (Array.isArray(allArticles)) {
          // display top 6 recent articles
          setArticles(allArticles.slice(0, 6));

          // AI Recommendations logic
          const activity = JSON.parse(localStorage.getItem("user_activity") || "{}");
          const topCategories = Object.entries(activity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat]) => cat);

          if (topCategories.length > 0) {
            const recommended = allArticles
              .filter(a => topCategories.includes(a.category))
              .slice(0, 3);
            setRecommendedArticles(recommended);
          }
        }
      } catch (err) {
        console.error("error fetching articles", err);
        // fallback mock data for colorful display
        setArticles([
          { _id: '1', title: 'The Future of AI in Blogging', category: 'Technology', content: 'Explore how artificial intelligence is changing the way we create content and engage with readers.', createdAt: new Date().toISOString() },
          { _id: '2', title: 'Healthy Living: 10 Simple Habits', category: 'Lifestyle', content: 'Consistency is key. Learn how small daily changes can lead to a long-term improvement in your overall well-being.', createdAt: new Date().toISOString() },
          { _id: '3', title: 'Minimalist Office Setup Guide', category: 'Business', content: 'A clean workspace leads to a clean mind. Here is our curation of the best minimalist setups for productivity.', createdAt: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={pageBackground}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className={`${pageTitleClass} text-5xl sm:text-7xl mb-8 tracking-tight leading-tight`}>
              Where ideas find <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">their voice.</span>
            </h1>
            <p className={`${bodyText} text-xl mb-12 max-w-xl mx-auto`}>
              Join a community of writers and readers exploring insights on technology,
              business, lifestyle, and everything in between.
            </p>
            <div className="flex items-center justify-center gap-x-6">
              {!isAuthenticated ? (
                <>
                  <NavLink to="/register" className={`${primaryBtn} py-4 px-10 text-base shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-transform`}>
                    Start writing today
                  </NavLink>
                  <NavLink to="/login" className={`${secondaryBtn} py-4 px-10 text-base border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5`}>
                    Sign in to explore
                  </NavLink>
                </>
              ) : (
                <NavLink
                  to={currentUser?.role === 'AUTHOR' ? "/author-profile" : "/user-profile"}
                  className={`${primaryBtn} py-3.5 px-8 text-base`}
                >
                  Go to Dashboard
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Optimized Decorative Gradient background */}
        <div className="absolute top-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
          <div
            className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[80px] opacity-60"
          ></div>
          <div
            className="absolute -bottom-24 -left-24 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[80px] opacity-60"
          ></div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-sm py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 gap-y-6">
            {CATEGORIES.slice(0, 10).map((cat) => (
              <button
                key={cat}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors relative group whitespace-nowrap"
                onClick={() => navigate(`/articles?category=${cat}`)}
              >
                {cat}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {recommendedArticles.length > 0 && (
        <div className={`${pageWrapper} pb-0`}>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">Recommended for You</h2>
            <p className={mutedText}>Personalized feed based on your interests</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {recommendedArticles.map((article) => (
              <div
                key={`rec-${article._id}`}
                className={`${articleCardClass}`}
                onClick={() => navigate(`/article/${article._id}`, { state: article })}
              >
                <div className="flex flex-col h-full">
                  <span className={`${tagClass} mb-4 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20`}>
                    {article.category}
                  </span>
                  <h3 className={`${articleTitle} text-xl group-hover:text-blue-500 transition-colors mb-4 line-clamp-2`}>
                    {article.title}
                  </h3>
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
                    <span className={articleMeta}>
                      {article.author?.firstName || 'Community Writer'}
                    </span>
                    <span className={mutedText}>
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={divider}></div>
        </div>
      )}

      {/* Articles Feed */}
      <div className={pageWrapper}>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">Editor's Choice</h2>
            <p className={mutedText}>Insights from our top writers</p>
          </div>
          <NavLink to="/articles" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
            See all stories →
          </NavLink>
        </div>

        {loading ? (
          <div className={loadingClass}>Fetching latest stories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article._id}
                  className={`${articleCardClass}`}
                  onClick={() => navigate(`/article/${article._id}`, { state: article })}
                >
                  <div className="flex flex-col h-full">
                    <span className={`${tagClass} mb-4 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20`}>
                      {article.category}
                    </span>

                    <h3 className={`${articleTitle} text-xl group-hover:text-blue-500 transition-colors mb-4 line-clamp-2`}>
                      {article.title}
                    </h3>

                    <p className={`${articleExcerpt} mb-6 line-clamp-3`}>
                      {article.content}
                    </p>

                    <div className="mt-auto pt-6 flex flex-col gap-6 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <span className={articleMeta}>
                          {article.author?.firstName || 'Community Writer'}
                        </span>
                        <span className={mutedText}>
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                      <button className={`${primaryBtn} w-full py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-[0.98] shadow-md`}>
                        Read Full Story
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500">
                No articles found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Newsletter / CTA */}
      <section className="relative py-24 sm:py-32 mt-20 overflow-hidden bg-slate-50 dark:bg-transparent transition-colors duration-300">
        <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-slate-900 dark:text-white relative">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
            {isAuthenticated ? `Welcome back, ${currentUser?.firstName || 'Storyteller'}!` : "Stay curious."}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            {isAuthenticated
              ? "Ready to share your next big idea? Or explore what others have been writing lately."
              : "Discover stories, thinking, and expertise from writers on any topic. Join 1,000+ readers today."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            {!isAuthenticated ? (
              <>
                <NavLink to="/register" className={`${primaryBtn} py-4 px-10 text-base shadow-2xl shadow-blue-500/20`}>
                  Join for free
                </NavLink>
                <NavLink to="/login" className={`${secondaryBtn} bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 px-10 py-4`}>
                  Learn more
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/articles"
                  className={`${primaryBtn} py-4 px-10 text-base shadow-2xl shadow-blue-500/20`}
                >
                  Browse Articles
                </NavLink>
                {currentUser?.role === 'AUTHOR' && (
                  <NavLink
                    to="/author-profile/write-article"
                    className={`${secondaryBtn} bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 px-10 py-4`}
                  >
                    Write a Story
                  </NavLink>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;