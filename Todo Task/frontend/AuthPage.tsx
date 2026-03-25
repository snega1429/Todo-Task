import { useState } from "react";
import api from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); 

  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { username, password });
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/signup", { username, email, password });
      alert(res.data.message);
      setIsLogin(true); 
    } catch (err: any) {
      alert(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="auth-card">
      <div className="tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin} className="auth-form">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="auth-form">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
}