import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "../src/components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { Navigate } from "react-router-dom";
import ChangePassword from "../src/components/ChangePassword";
import "./index.css";

function App() {
  return (
   
    <ThemeProvider>
      <Router>

        {/* BUBBLES IN BACKGROUND */}
          <div className="bubble b1"></div>
          <div className="bubble b2"></div>
          <div className="bubble b3"></div>
          <div className="bubble b4"></div>
          <div className="bubble b5"></div>
          <div className="bubble b6"></div>
          <div className="bubble b7"></div>
          <div className="bubble b8"></div>
          <div className="bubble b9"></div>
          <div className="bubble b10"></div>
          <div className="bubble b11"></div>
          <div className="bubble b12"></div>
           {/* APP CONTAINER (FORMS AND DASHBOARD) */}
        <div className="app-container">
          <h1 className="app-title">Todo App</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* ADD THIS */}
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                  <ChangePassword />
              </PrivateRoute>
            }
          />
        </Routes>
        </div>
        
      </Router>
    </ThemeProvider>
  );
}

export default App;