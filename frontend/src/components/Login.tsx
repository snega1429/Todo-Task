import { useState } from "react";
import API from "../api/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";

interface LoginResponse {
  token: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post<LoginResponse>("/login", {
        email,
        password,
      });

      login(res.data.token);
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err: unknown) {
      const error = err as AxiosError<{ detail?: string }>;
      setMessage(error.response?.data.detail || "Login failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Login</button>

        {message && <p>{message}</p>}

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Signup</Link>
        </p>

      </form>
    </div>
  );
}