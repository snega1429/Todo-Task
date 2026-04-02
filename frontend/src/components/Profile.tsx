import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if(newPassword.length < 6) {
      setMessage("New password must be at least 6 characters");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // JWT token

      await API.put(
        "/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      setMessage("Password changed successfully");

      // Redirect to dashboard after 1.5s
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err: any) {
        setMessage(err.response?.data.detail || "Error changing password");
    }
  };

  return (
    <>
    <Logo size={115}/>
    <div className="form-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="New Password (min 6 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Change Password</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  </>
  );
}


  