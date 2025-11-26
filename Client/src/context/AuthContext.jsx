import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("le_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.status) {
        const { token, role, name } = res.data;
        localStorage.setItem("le_token", token);
        localStorage.setItem("le_user", JSON.stringify({ name, role }));
        setUser({ name, role });
        toast.success(res.data.message || "Login successful");
        return { success: true, role };
      } else {
        toast.error(res.data.message || "Login failed");
        return { success: false };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("le_token");
    localStorage.removeItem("le_user");
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
