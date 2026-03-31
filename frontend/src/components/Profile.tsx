import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // OPTIONAL: Load current user email if you have GET /profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile"); // Optional
        setEmail(res.data.email);
      } catch (err) {
        console.log("Fetch profile error", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put("/profile", { email });
      setMessage("Profile updated successfully!");

      // Redirect after 1.5s
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err: any) {
      setMessage(err.response?.data.detail || "Error updating profile");
    }
  };

  return (
    <div className="form-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="email"
          placeholder="Enter new email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}