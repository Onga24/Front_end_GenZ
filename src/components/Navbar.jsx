import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const SunIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/signin"); };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -64 }} animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <NavLink to="/" className="navbar-brand">
        Message<span>Board</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>About</NavLink>
        {user && (
          <NavLink
            to={isAdmin ? "/admin" : "/dashboard"}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            {isAdmin ? "Dashboard" : "My Post"}
          </NavLink>
        )}
        {user && (
          <NavLink to="/settings" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Settings
          </NavLink>
        )}
      </div>

      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"} aria-label="toggle theme">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
        ) : (
          <NavLink to="/signin" className="btn btn-primary btn-sm">Sign in</NavLink>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;