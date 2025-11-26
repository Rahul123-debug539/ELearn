import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";

function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav__left">
        <div className="nav__logo">LE</div>
        <span className="nav__brand">LearnEase</span>
      </div>

      <div className="nav__links">
        <Link to="/" className="nav__link">Home</Link>
        <Link to="/About" className="nav__link">About</Link>
        <Link to="/Contact" className="nav__link">Contact</Link>
        <Link to="/Courses" className="nav__link">Courses</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="nav__link">Admin</Link>
        )}
      </div>

      <div className="nav__right">
        {!user && (
          <button className="nav__btn" onClick={onLoginClick}>
            Login / Signup
          </button>
        )}

        {user && (
          <div className="nav__profile" ref={dropdownRef}>
            <span className="nav__avatar" onClick={toggleDropdown}>
              {user.name?.charAt(0)?.toUpperCase()}
            </span>

            {open && (
              <div className="nav__dropdown">
                <p className="nav__dropdown-name">{user.name}</p>
                <p className="nav__dropdown-role">{user.role}</p>

                <button className="nav__dropdown-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
