import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuthStore } from "../store/authStore";
import CreateTodo from "./CreateTodo";
import TodoList from "./TodoList";

export default function Dashboard() {
  const logout = useAuthStore((state) => state.logout);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { theme, toggleTheme } = themeCtx;

  const [refresh, setRefresh] = useState(false);

  
  const onCreateTodoSuccess = () => {
    setRefresh(!refresh); 
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={logout}>Logout</button>

      {/* Pass function as a prop correctly */}
      <CreateTodo onCreateTodoSuccess={onCreateTodoSuccess} />
      <TodoList refresh={refresh} />
    </div>
  );
}