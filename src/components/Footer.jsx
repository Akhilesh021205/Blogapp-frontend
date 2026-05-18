import { NavLink } from 'react-router';
import Logo from './Logo';
import { 
  navLinkClass, 
  navLinkActiveClass 
} from "../styles/common";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-white/5 pt-20 pb-10 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="col-span-2 lg:col-span-2">
            <NavLink to="/" className="flex items-center gap-3 mb-6">
              <Logo className="w-10 h-10 opacity-100 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="text-xl font-bold text-white tracking-tight">BLOG APP</span>
            </NavLink>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering independent voices to share their stories with the world. 
              Our mission is to foster a platform where ideas can flourish.
            </p>
          </div>

          {/* Site Links */}
          <div>
            <h4 className="font-bold text-slate-100 uppercase tracking-[0.2em] mb-8 text-[10px]">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => (isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-white transition-colors")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/articles" 
                  className={({ isActive }) => (isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-white transition-colors")}
                >
                  Articles
                </NavLink>
              </li>
            </ul>
          </div>
          </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} BLOG APP Inc. All rights reserved.
          </p>
          <div className="flex gap-10 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;