import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import SecondaryNavbar from "./components/SecondaryNavbar/SecondaryNavbar";
import LoginModal from "./components/LoginModal/LoginModal";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageTopics from "./pages/admin/ManageTopics";
import ManageSubtopics from "./pages/admin/ManageSubtopics";
import ManageContent from "./pages/admin/ManageContent";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";




function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Auto popup after 10 sec for non-logged in user
  useEffect(() => {
    if (!user) {
      const dismissed = sessionStorage.getItem("le_login_dismissed");
      if (dismissed) return;

      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCloseModal = () => {
    setShowLogin(false);
    sessionStorage.setItem("le_login_dismissed", "1");
  };

  const isLearningPage =
    location.pathname.startsWith("/category") ||
    location.pathname.startsWith("/learn");

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <SecondaryNavbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About/>}/>
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
      
        <Route path="/admin/create" element={<AdminRegister />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedAdminRoute>
              <ManageCategories />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/topics"
          element={
            <ProtectedAdminRoute>
              <ManageTopics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/subtopics"
          element={
            <ProtectedAdminRoute>
              <ManageSubtopics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedAdminRoute>
              <ManageContent />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <Footer/>

      <LoginModal visible={showLogin} onClose={handleCloseModal} />
    </>
  );
}

export default App;
