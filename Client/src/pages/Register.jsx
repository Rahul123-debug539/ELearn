import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // REGISTER USER
      const res = await api.post("/auth/register", {
        ...form,
        role: "user", // default role
      });

      if (res.data.status) {
        toast.success("Registration successful!");

        // AUTO LOGIN AFTER REGISTER
        const loginRes = await login(form.email, form.password);

        if (loginRes.success) {
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "calc(100vh - 120px)",
        padding: "2rem",
        color: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          background: "#0f172a",
          padding: "1.5rem",
          borderRadius: "0.8rem",
          width: "350px",
          border: "1px solid #1e293b",
        }}
      >
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Register
        </button>

        <p style={{ marginTop: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{ color: "#38bdf8", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  marginBottom: "0.8rem",
  borderRadius: "0.4rem",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#e5e7eb",
};

const buttonStyle = {
  width: "100%",
  padding: "0.7rem",
  background: "linear-gradient(135deg, #22d3ee, #6366f1)",
  border: "none",
  borderRadius: "0.5rem",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

export default Register;
