import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedUserRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Auth check hone tak wait
  if (loading) {
    return <div>Loading...</div>;
  }

  // Login nahi hai
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin ko student routes par mat aane do
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedUserRoute;