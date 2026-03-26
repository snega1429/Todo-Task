import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "../src/components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { Navigate } from "react-router-dom";

function App() {
  return (
   
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        
      </Router>
    </ThemeProvider>
  );
}

export default App;