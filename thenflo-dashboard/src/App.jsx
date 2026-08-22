import React from "react";
import { AuthProvider } from "./store/AuthContext.jsx";
import { ToastProvider } from "./store/ToastContext.jsx";
import { ThemeProvider } from "./hooks/useTheme.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
