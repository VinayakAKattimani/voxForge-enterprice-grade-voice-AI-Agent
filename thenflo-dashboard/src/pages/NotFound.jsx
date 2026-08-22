import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-center">
      <Compass size={28} className="text-ink3" />
      <div className="text-lg font-bold text-ink">Page not found</div>
      <div className="max-w-xs text-[13px] text-ink2">The page you're looking for doesn't exist or may have moved.</div>
      <Link to="/dashboard">
        <Button variant="primary">Back to dashboard</Button>
      </Link>
    </div>
  );
}
