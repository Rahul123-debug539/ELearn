import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import SecondaryNavbar from "./components/SecondaryNavbar/SecondaryNavbar";
import LoginModal from "./components/LoginModal/LoginModal";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";

import CategoryPage from "./pages/CategoryPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageTopics from "./pages/admin/ManageTopics";
import ManageSubtopics from "./pages/admin/ManageSubtopics";
import ManageContent from "./pages/admin/ManageContent";     // Add content
import ContentList from "./pages/admin/ContentList";         // List content
import EditContent from "./pages/admin/EditContent";         // Edit content

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import Footer from "./components/Footer";
import ViewContent from "./pages/ViewContent";
import NotFound from "./pages/NotFound";

import { useAuth } from "./context/AuthContext";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Auto popup after 10 sec
  useEffect(() => {
    if (!user) {
      const dismissed = sessionStorage.getItem("le_login_dismissed");
      if (dismissed) return;

      const timer = setTimeout(() => setShowLogin(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCloseModal = () => {
    setShowLogin(false);
    sessionStorage.setItem("le_login_dismissed", "1");
  };

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <SecondaryNavbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/create" element={<AdminRegister />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/content/:contentId" element={<ViewContent />} />



        {/* ADMIN ROUTES */}
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

        {/* LIST CONTENT PAGE */}
        <Route
          path="/admin/manage-content"
          element={
            <ProtectedAdminRoute>
              <ContentList />
            </ProtectedAdminRoute>
          }
        />


        {/* ADD NEW CONTENT PAGE */}
        <Route
          path="/admin/content/add"
          element={
            <ProtectedAdminRoute>
              <ManageContent />
            </ProtectedAdminRoute>
          }
        />

        {/* EDIT CONTENT PAGE */}
        <Route
          path="/admin/edit-content/:contentId"
          element={
            <ProtectedAdminRoute>
              <EditContent />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      <Footer />

      <LoginModal visible={showLogin} onClose={handleCloseModal} />
    </>
  );
}

export default App;
