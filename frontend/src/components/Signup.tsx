import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await API.post("/signup", {
        email,
        password,
      });

      // Show success message
      setMessage("Signup successful! Please login.");

      // Redirect to login page after 1 second
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err: unknown) {
      const error = err as AxiosError<{ detail?: string }>;
      setMessage(
        error.response?.data.detail || "Signup failed"
      );
    }
  };

  return (
    <div className="form-container">
      <div className="auth-box">

        <h2>Signup</h2>

        <form onSubmit={handleSignup}>

          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <br /><br />

          <button type="submit">
            Signup
          </button>

          {message && <p>{message}</p>}

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}