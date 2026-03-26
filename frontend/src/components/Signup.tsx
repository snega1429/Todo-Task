import { useState } from "react";
import API from "../api/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";

interface SignupResponse {
  token: string; 
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post<SignupResponse>("/signup", { email, password });

      localStorage.setItem("token", res.data.token);

      login(res.data.token);
      navigate("/dashboard");

    } catch (err: unknown) {
      const error = err as AxiosError<{ detail?: string }>;
      setMessage(error.response?.data.detail || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Signup</button>
      {message && <p>{message}</p>}

      {/* NEW LINK ADDED */}

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </form>
  );
}