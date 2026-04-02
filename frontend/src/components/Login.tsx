import { useState } from "react";
import API from "../api/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import Logo from "./Logo";
import Notification from "./Notification";

interface LoginResponse { 
  token: string;
  username?: string; 

}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"success"|"error"|"info">("info");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setNotifMessage("Password must be at least 6 characters");
      setNotifType("error");
      return;
    }

    try {
      const res = await API.post<LoginResponse>(
        "/login", 
        { 
          email: email.trim(). toLowerCase(), 
          password: password.trim() 
        }
      );
      login(res.data.token);
      localStorage.setItem("token", res.data.token);
      if (res.data.username) {
        localStorage.setItem("username", res.data.username);
      }

      setNotifMessage("Login successful!");
      setNotifType("success");
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<any>;
      console.log(
        "ERROR RESPONSE:",
      JSON.stringify(
        error.response?.data,
        null,
        2
    )
  );

  if (Array.isArray(error.response?.data?.detail)) {
    setNotifMessage(
      error.response?.data?.detail[0]?.msg
    );
  } else {
    setNotifMessage(
      error.response?.data?.detail ||
      "Login failed"
    );
  }

  setNotifType("error");
}
      
    
  };

  return (
    <>
      <Logo size={115}/>
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email" value={email} placeholder="Email"
            onChange={(e) => setEmail(e.target.value)} required
          />
          <input
            type="password" value={password}
            placeholder="Password (min 6 characters)" minLength={6}
            onChange={(e) => setPassword(e.target.value)} required
          />
          <button type="submit">Login</button>
          <p>Don't have an account? <Link to="/signup">Signup</Link></p>
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