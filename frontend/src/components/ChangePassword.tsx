import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Notification from "./Notification";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"success"|"error"|"info">("info");
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setNotifMessage("New password must be at least 6 characters");
      setNotifType("error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.put("/change-password",
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifMessage("Password changed successfully!");
      setNotifType("success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setNotifMessage(err.response?.data.detail || "Error changing password");
      setNotifType("error");
    }
  };

  return (
    <>
      <Logo size={115}/>
      <div className="form-container">
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input type="password" placeholder="Old Password" value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)} required />
          <input type="password" placeholder="New Password (min 6 characters)"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            required />
          <button type="submit">Change Password</button>
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