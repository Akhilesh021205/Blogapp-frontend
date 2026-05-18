import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { useTheme } from "../store/themeStore";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";
import Logo from "./Logo";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    console.log("current user", user);
    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
            BLOG<span className="text-blue-500">APP</span>
          </span>
        </NavLink>

        <ul className={navLinksClass}>
          {/* Always visible */}
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/articles" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
              Articles
            </NavLink>
          </li>

          {/* Not logged in */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* Logged in */}
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to={getProfilePath()}
                  className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}
                >
                  Profile
                </NavLink>
              </li>

              {user?.role === "AUTHOR" && (
                <li>
                  <NavLink
                    to="/author-profile/write-article"
                    className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}
                  >
                    Write
                  </NavLink>
                </li>
              )}

              <li>
                <button className={navLinkClass} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Theme Toggle */}
          <li>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-100"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;