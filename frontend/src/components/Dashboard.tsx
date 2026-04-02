import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuthStore } from "../store/authStore";
import CreateTodo from "./CreateTodo";
import TodoList from "./TodoList";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Logo from "../components/Logo";

export default function Dashboard() {

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;

  const { theme, toggleTheme } = themeCtx;
  const [refresh, setRefresh] = useState(false);

  const reload = () => {
    setRefresh(!refresh);
  };

  const [email, setEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setEmail(res.data.email);
      } catch (err) {
        console.log("Fetch profile error", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put("/profile", { email });
      setProfileMessage("Profile updated successfully!");
    } catch (err: any) {
      setProfileMessage(
        typeof err.response?.data?.detail === "string"
          ? err.response?.data.detail
          : "Error updating profile"
      );
    }
  };

  return (
  <>
    <Logo size={200} />
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">

        <h1>Dashboard Page</h1>
        <p>Current theme: {theme}</p>

        {/* BUTTON GROUP WITH SPACE */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "10px",
          flexWrap: "wrap"
        }}>

          <button onClick={toggleTheme}>
            Toggle Theme
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

          <button onClick={() => navigate("/change-password")}>
            Change Password
          </button>

        </div>

      </div>

      {/* PROFILE UPDATE */}
      <div className="form-container">
        <h2>Update Profile</h2>

        <form onSubmit={handleProfileUpdate}>
          <input
            type="email"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <br /><br />

          <button type="submit">
            Update
          </button>
        </form>

        {profileMessage && <p>{profileMessage}</p>}

      </div>

      {/* TODO SECTION */}
      <CreateTodo onCreateTodoSuccess={reload} />
      <TodoList refresh={refresh} />

    </div>
  </>
  );
}