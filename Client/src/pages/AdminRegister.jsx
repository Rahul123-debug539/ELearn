import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminRegister.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    key: "",
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!form.key.trim()) {
      toast.error("Admin Secret Key is required");
      return false;
    }

    if (form.key.length < 6) {
      toast.error("Secret Key must be at least 6 characters");
      return false;
    }

    if (!form.name.trim()) {
      toast.error("Full Name is required");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await api.post("/api/auth/admin-register", form);

      if (res.data.status) {
        toast.success("Admin account created successfully!");
        navigate("/admin");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="admin-register-bg">
      <form className="admin-register-form" onSubmit={handleSubmit}>
        <h2 className="admin-register-title">Admin Registration</h2>

        <input
          type="password"
          placeholder="Enter Admin Secret Key"
          value={form.key}
          onChange={(e) => setForm({ ...form, key: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
}

export default AdminRegister;
