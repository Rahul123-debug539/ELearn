import { useState } from "react";
import "./LoginModal.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginModal({ visible, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!visible) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      onClose();
    }
  };

  const goToRegister = () => {
    onClose();     // modal close
    navigate("/register"); // go to register page
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Login to LearnEase</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="modal-switch">
          Don't have an account?{" "}
          <span onClick={goToRegister} className="modal-link">
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
