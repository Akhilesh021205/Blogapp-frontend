import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { pageBackground } from "../styles/common";
import { useAuth } from "../store/authStore";
import { useTheme } from "../store/themeStore";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const loading = useAuth((state) => state.loading);
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  //wait untill the auth check completes
  if(loading) {
    return <p className="text-center mt-10 text-slate-400">Loading...</p>
  }

  return (
    <div className={`flex flex-col min-h-screen ${pageBackground}`}>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


export default RootLayout;