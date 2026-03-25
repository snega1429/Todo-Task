import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CreateTodo from "./components/CreateTodo";
import TodoList from "./components/TodoList";
import "./index.css";

function App() {
  const [step, setStep] = useState(() => {
    
    const token = localStorage.getItem("token");
    return token ? "todo" : "login";
  });
  const [refresh, setRefresh] = useState(false);

  const handleLoginSuccess = () => setStep("todo");
  const handleSignupSuccess = () => setStep("todo");

  const handleCreateTodoSuccess = () => {
    setRefresh(prev => !prev); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setStep("login");
  };

  return (
    <div className="container">
      <div className="card">
        <h1>
          {step === "login"}
          {step === "signup"}
          {step === "todo" && "Todo App"}
        </h1>

        {step === "login" && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setStep("signup")}
          />
        )}

        {step === "signup" && (
          <Signup 
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setStep("login")}
          />
        )}

        {step === "todo" && (
          <>

            {/* Create Todo */}
            <CreateTodo onCreateTodoSuccess={handleCreateTodoSuccess} />

            {/*  Todo List */}
            <TodoList refresh={refresh} />
            {/* Logout button */}
            <button 
              onClick={handleLogout}
              style={{ marginBottom: "10px" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;