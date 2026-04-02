import { useState, useEffect } from "react";
import API from "../api/api";
import Logo from "../components/Logo";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        console.log("PROFILE DATA:", res.data);

        setUsername(res.data.username || "");
        setEmail(res.data.email || "");

      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
    };

    fetchProfile();
  }, []);

  // Update profile
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SENDING DATA:", {
      username,
      email,
    });

    if (!username.trim()) {
      setMessage("Username is required");
      return;
    }
    try {
      await API.put("/profile", {
        username: username.trim(),
        email: email.trim(),
      });

  

      //  Always show success if no error thrown
      setMessage("Profile updated successfully");

    } catch (err: any) {
      console.log(
        "PROFILE ERROR:",
        JSON.stringify(err.response?.data, null, 2)
      );

      // Handle FastAPI validation errors
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setMessage(err.response.data.detail[0].msg);
        } else {
          setMessage(err.response.data.detail);
        }
      } else {
        setMessage("Error updating profile");
      }
    }
  };

  return (
    <>
      <Logo size={115} />

      <div className="form-container">
        <h2>Profile</h2>

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <br /><br />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <br /><br />

          <button type="submit">
            Update Profile
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </>
  );
}
