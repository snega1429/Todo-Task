import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuthStore } from "../store/authStore";
import CreateTodo from "./CreateTodo";
import TodoList from "./TodoList";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="dashboard">

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

      {/* CONTENT */}
      
      <CreateTodo onCreateTodoSuccess={reload} />
      <TodoList refresh={refresh} />

    </div>
  );
}