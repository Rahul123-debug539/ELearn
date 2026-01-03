import { useState } from "react";
import api from "../api/api";
import "./ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    await api.post("/auth/forgot-password", { email });
    setMsg("OTP sent to email");
    setStep(2);
  };

  const resetPassword = async () => {
    await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    setMsg("Password updated successfully");
    setStep(3);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        {msg && <p className="auth-success">{msg}</p>}

        {step === 1 && (
          <>
            <input
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}

        {step === 3 && <p>You can now login.</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
