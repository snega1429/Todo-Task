import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuthStore } from "../store/authStore";
import CreateTodo from "./CreateTodo";
import TodoList from "./TodoList";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

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
        const res = await API.get("/profile"); // backend GET /profile
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
      await API.put("/profile", { email }); // backend PUT /profile
      setProfileMessage("Profile updated successfully!");
    } catch (err: any) {
      setProfileMessage(
        err.response?.data.detail || "Error updating profile"
      );
    }
  };
return (
    <div className="dashboard" >

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard Page</h1>
      <p>Current theme: {theme}</p>

      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
     
      <button onClick={handleLogout}>
        Logout
      </button>

      {/* Change Password Button */}

      <button onClick={() =>
        navigate("/change-password")
      }
    >
      change password
    </button>
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
      <button type="submit">Update</button>
    </form>
     {profileMessage && <p>{profileMessage}</p>}

    </div>

      {/* TODO SECTION */}
      
      <CreateTodo onCreateTodoSuccess={reload} />
      <TodoList refresh={refresh} />

    </div>
  );
}