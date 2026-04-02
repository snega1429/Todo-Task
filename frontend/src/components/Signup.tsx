import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import Logo from "./Logo";
import Notification from "./Notification";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"success"|"error"|"info">("info");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setNotifMessage("Password must be at least 6 characters");
      setNotifType("error");
      return;
    }

    try {
      await API.post("/signup", { username, email, password });
      setNotifMessage("Signup successful! Please login.");
      setNotifType("success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ detail?: string }>;
      if (Array.isArray(error.response?.data?.detail)) {
        setNotifMessage(error.response?.data?.detail[0]?.msg || "Signup failed");
      } else {
        setNotifMessage(error.response?.data.detail || "Signup failed");
      }
      setNotifType("error");
    }
  };

  return (
    <>
      <Logo size={115}/>
      <div className="form-container">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input type="text" value={username} placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" value={email} placeholder="Email"
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" value={password}
            placeholder="Password (min 6 characters)" minLength={6}
            onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Signup</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>

        {notifMessage && (
          <Notification
            message={notifMessage} type={notifType}
            onClose={() => setNotifMessage("")}
          />
        )}
      </div>
    </>
  );
}