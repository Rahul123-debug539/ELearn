import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-denied">
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <nav className="sidebar-menu">
          <Link to="/admin" className="menu-link">Dashboard</Link>
          <Link to="/admin/categories" className="menu-link">Categories</Link>
          <Link to="/admin/topics" className="menu-link">Topics</Link>
          <Link to="/admin/subtopics" className="menu-link">Subtopics</Link>
          <Link to="/admin/manage-content" className="menu-link">Content</Link>
          <Link to="/admin/manage-content" className="menu-link">Edit Content</Link>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h1 className="page-title">Welcome, Admin 👋</h1>
        <p className="page-subtitle">Manage your ELearning platform from here.</p>

        <div className="admin-cards">
          <Link to="/admin/categories" className="admin-card">
            <h3>Manage Categories</h3>
            <p>Create & organize main categories like Java, C++, Python.</p>
          </Link>

          <Link to="/admin/topics" className="admin-card">
            <h3>Manage Topics</h3>
            <p>Add topics inside categories: Basics, OOP, Data Types, etc.</p>
          </Link>

          <Link to="/admin/subtopics" className="admin-card">
            <h3>Manage Subtopics</h3>
            <p>Create subtopics for each topic with dropdown support.</p>
          </Link>

          <Link to="/admin/content/add" className="admin-card">
            <h3>Manage Content</h3>
            <p>Add images, code blocks, examples and main learning content.</p>
          </Link>

          <Link to="/admin/manage-content" className="admin-card">
            <h3>Edit & Delete Content</h3>
            <p>Edit & Delete images, code blocks, examples and main learning content.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
