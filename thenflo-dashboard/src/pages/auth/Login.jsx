import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogIn, AlertTriangle } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("renee@thenflo.io");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password || "demo-password");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <div className="mb-1 text-[16px] font-bold text-ink">Sign in to your workspace</div>
      <div className="mb-5 text-[13px] text-ink2">Manage your ThenFLo AI Demo Engineer deployment.</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
        <FormField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" />
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-dangerDim px-3 py-2 text-[12.5px] font-medium text-danger">
            <AlertTriangle size={14} /> {error}
          </div>
        )}
        <Button type="submit" variant="primary" icon={LogIn} className="justify-center" disabled={submitting}>
          {submitting ? "Signing in\u2026" : "Sign in"}
        </Button>
      </form>
      <div className="mt-5 text-center text-[12px] text-ink3">
        Running in mock mode &mdash; any password will work. Set{" "}
        <code className="font-data">VITE_USE_MOCK=false</code> to connect a real backend.
      </div>
    </Card>
  );
}
