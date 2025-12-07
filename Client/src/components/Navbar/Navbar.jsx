import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";

function Navbar({ onLoginClick }) {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  // States
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

  // Refs
  const profileRef = useRef(null);
  const drawerRef = useRef(null);
  const searchInputRef = useRef(null);

  // ==============================
  // 🔍 Debounced Search
  // ==============================
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

  // ==============================
  // 🔍 Fetch Results (Backend)
  // ==============================
  async function fetchResults(q) {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/search?q=${encodeURIComponent(q)}`
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      setResults({
        categories: data.categories || [],
        topics: data.topics || [],
        subtopics: data.subtopics || [],
        content: data.content || [],
      });
    } catch (err) {
      console.log("Search backend failed — using fallback");
      localFallback(q);
    }
    setLoading(false);
  }

  // ==============================
  // 🔄 Local fallback
  // ==============================
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

  // ==============================
  // ✋ Outside click close
  // ==============================
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

  // ==============================
  // 📸 Upload photo
  // ==============================
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

  // ==============================
  // ❌ Remove photo
  // ==============================
  const removePhoto = () => {
    localStorage.removeItem("user_photo");
    setPhoto(null);
    if (setUser) setUser({ ...user, photo: null });
  };

  // ==============================
  // 🚪 Logout
  // ==============================
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* ==========================
          NAVBAR
      ========================== */}
      <nav className="nav">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setDrawerOpen(true)}>
            ☰
          </button>

          <div className="nav-logo">LE</div>
          <span className="nav-brand">LearnEase</span>
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
          <button
            className="icon-btn"
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 200);
            }}
          >
            🔍
          </button>

          {!user && (
            <button className="nav-btn" onClick={onLoginClick}>
              Login / Signup
            </button>
          )}

          {user && (
            <div className="profile-area" ref={profileRef}>
              <div
                className="avatar"
                onClick={() => setProfileOpen((p) => !p)}
              >
                {photo ? (
                  <img src={photo} alt="" />
                ) : (
                  user.name?.charAt(0)?.toUpperCase()
                )}
              </div>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-photo-box">
                      {photo ? (
                        <img src={photo} alt="profile" />
                      ) : (
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

      {/* ==========================
          MOBILE DRAWER
      ========================== */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`} ref={drawerRef}>
        <div className="drawer-inner">
          <button className="close-drawer" onClick={() => setDrawerOpen(false)}>
            ✖
          </button>

          <Link to="/" className="drawer-link">Home</Link>
          <Link to="/About" className="drawer-link">About</Link>
          <Link to="/Contact" className="drawer-link">Contact</Link>
          <Link to="/Courses" className="drawer-link">Courses</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="drawer-link">Admin</Link>
          )}
        </div>
      </div>

      {/* ==========================
          SEARCH OVERLAY
      ========================== */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-top">
            <button className="back-btn" onClick={() => setSearchOpen(false)}>
              ✖
            </button>

            <input
              ref={searchInputRef}
              className="search-input"
              placeholder="Search courses, categories, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query && (
              <button className="clear-btn" onClick={() => setQuery("")}>
                ✖
              </button>
            )}
          </div>

          <div className="search-body">
            {loading && <p>Searching...</p>}

            {/* RENDER EACH SECTION */}
            {Object.keys(results).map((section) =>
              results[section].length > 0 ? (
                <div key={section} className="search-section">
                  <h3>{section.toUpperCase()}</h3>
                  <ul>
                    {results[section].map((item) => (
                      <li
                        key={item._id || item.id}
                        className="search-item"
                        onClick={() => {
                          setSearchOpen(false);
                          if (section === "categories") navigate(`/category/${item._id}`);
                          if (section === "topics") navigate(`/topic/${item._id}`);
                          if (section === "content") navigate(`/content/${item._id}`);

                        }}
                      >
                        {item.title || item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}

            {!loading &&
              query &&
              Object.values(results).every((arr) => arr.length === 0) && (
                <p>No results found</p>
              )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
