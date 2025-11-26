import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          background: "#020617",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    // not logged in
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    // logged in but not admin
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
