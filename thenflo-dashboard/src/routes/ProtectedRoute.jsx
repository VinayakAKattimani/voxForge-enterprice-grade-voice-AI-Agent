import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import LoadingState from "../components/ui/LoadingState.jsx";

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <LoadingState label={"Checking your session\u2026"} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
