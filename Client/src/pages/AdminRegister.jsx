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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/admin-register", form);

      if (res.data.status) {
        toast.success("Admin account created successfully!");
        navigate("/admin/AdminDashboard");
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
