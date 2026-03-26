import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface PrivateRouteProps {
    children: ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = useAuthStore((state) => state.token);

  const storedToken = localStorage.getItem("token")

  if (!token && !storedToken) {
    return <Navigate to="/login" replace/>;
  }
  

  return <>{children}</>;
};