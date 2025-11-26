import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const submit = (e) => {
    e.preventDefault();
    alert("Message sent! (Frontend only)");
  };

  return (
    <div style={{
      padding: "3rem",
      background: "#020617",
      minHeight: "calc(100vh - 120px)",
      color: "#e5e7eb",
      display: "flex",
      justifyContent: "center"
    }}>

      <form onSubmit={submit}
        style={{
          background: "#0f172a",
          padding: "2rem",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
          width: "380px"
        }}
      >
        <h1 style={{ color: "#38bdf8", marginBottom: "1rem", textAlign: "center" }}>
          Contact Us
        </h1>

        <input
          type="text"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />

        <textarea
          placeholder="Your Message"
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={textAreaStyle}
        />

        <button type="submit" style={buttonStyle}>
          Send Message
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "0.8rem",
  borderRadius: "0.5rem",
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#e5e7eb",
};

const textAreaStyle = {
  width: "100%",
  height: "110px",
  padding: "0.8rem",
  marginBottom: "1rem",
  borderRadius: "0.5rem",
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#e5e7eb",
};

const buttonStyle = {
  width: "100%",
  padding: "0.8rem",
  background: "linear-gradient(135deg, #22d3ee, #6366f1)",
  border: "none",
  borderRadius: "0.5rem",
  color: "white",
  cursor: "pointer",
};

export default Contact;
