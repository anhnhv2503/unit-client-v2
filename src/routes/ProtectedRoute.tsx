import { Navigate, Outlet } from "react-router-dom";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const isAuthenticated = () => {
  return !!getAccessToken();
};

export const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
