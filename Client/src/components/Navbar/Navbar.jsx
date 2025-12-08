import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";

function Navbar({ onLoginClick }) {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [photo, setPhoto] = useState(
    () => localStorage.getItem("user_photo") || null
  );

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    categories: [],
    topics: [],
    subtopics: [],
    content: [],
  });
  const [loading, setLoading] = useState(false);

  const profileRef = useRef(null);
  const drawerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!searchOpen || query.trim() === "") {
      setResults({
        categories: [],
        topics: [],
        subtopics: [],
        content: [],
      });
      return;
    }

    const timer = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function fetchResults(q) {
    setLoading(true);
    try {
      const res = await api.get(`/api/search?q=${encodeURIComponent(q)}`);
      const data = res.data;

      setResults({
        categories: data.categories || [],
        topics: data.topics || [],
        subtopics: data.subtopics || [],
        content: data.content || [],
      });
    } catch (err) {
      localFallback(q);
    }
    setLoading(false);
  }

  function localFallback(q) {
    const dummy = {
      courses: [
        { id: 1, title: "React Basics" },
        { id: 2, title: "JavaScript Mastery" },
      ],
    };

    const ql = q.toLowerCase();

    setResults({
      categories: [],
      topics: [],
      subtopics: [],
      content: dummy.courses.filter((c) =>
        c.title.toLowerCase().includes(ql)
      ),
    });
  }

  // ✅ OUTSIDE CLICK FIX
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        if (!e.target.closest(".hamburger")) {
          setDrawerOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("user_photo", reader.result);
      setPhoto(reader.result);

      if (setUser) setUser({ ...user, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    localStorage.removeItem("user_photo");
    setPhoto(null);
    if (setUser) setUser({ ...user, photo: null });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-left">
          {/* ✅ TOGGLE FIX */}
          <button className="hamburger" onClick={() => setDrawerOpen(!drawerOpen)}>
            ☰
          </button>

          <div className="nav-logo">
            <img src="/favicon1.png" alt="logo" />
          </div>
          <span className="nav-brand">ELearning</span>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/About" className="nav-link">About</Link>
          <Link to="/Contact" className="nav-link">Contact</Link>
          <Link to="/Courses" className="nav-link">Courses</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
        </div>

        <div className="nav-right">

          {!user && (
            <button className="nav-btn" onClick={onLoginClick}>
              Login / Signup
            </button>
          )}

          {user && (
            <div className="profile-area" ref={profileRef}>
              <div className="avatar" onClick={() => setProfileOpen((p) => !p)}>
                {photo ? <img src={photo} alt="" /> : user.name?.charAt(0)?.toUpperCase()}
              </div>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-photo-box">
                      {photo ? <img src={photo} alt="profile" /> : (
                        <div className="photo-fallback">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <p className="p-name">{user.name}</p>
                    <p className="p-email">{user.email}</p>
                    <p className="p-role">{user.role}</p>
                  </div>

                  <label className="upload-btn">
                    Change Photo
                    <input type="file" hidden accept="image/*" onChange={uploadPhoto} />
                  </label>

                  <button className="dropdown-btn" onClick={removePhoto}>
                    Remove Photo
                  </button>

                  <button className="dropdown-btn logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ✅ MOBILE DRAWER AUTO CLOSE FIX */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`} ref={drawerRef}>
        <div className="drawer-inner">
          <button className="close-drawer" onClick={() => setDrawerOpen(false)}>
            ✖
          </button>

          <Link to="/" className="drawer-link" onClick={() => setDrawerOpen(false)}>Home</Link>
          <Link to="/About" className="drawer-link" onClick={() => setDrawerOpen(false)}>About</Link>
          <Link to="/Contact" className="drawer-link" onClick={() => setDrawerOpen(false)}>Contact</Link>
          <Link to="/Courses" className="drawer-link" onClick={() => setDrawerOpen(false)}>Courses</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="drawer-link" onClick={() => setDrawerOpen(false)}>Admin</Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
