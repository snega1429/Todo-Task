import React, { useState } from "react";
import API from "../api/api";
import '../App.css';

type LoginProps = {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void; 
};

export default function Login({ onLoginSuccess, onSwitchToSignup} : LoginProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  

    try {

      const res = await API.post("/login", {email,password});

      console.log(res.data);

      if(res.data.message === "Login successful") {
        console.log("Login success, going to Todo");
        onLoginSuccess();
      }

    } catch (error: any) {
      if (error.response)
        setMessage(error.response.data.detail || "Login failed");
      else 
        setMessage("Something went wrong");
    }
  };
      
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />

        <button type="submit">Login</button>

      </form>
      <p>
          Don't have an account?{" "}
         <button type="button" onClick={onSwitchToSignup}>
          Signup
        </button>
      </p>

      {message && <p>{message}</p>}

    </div>
  );
}