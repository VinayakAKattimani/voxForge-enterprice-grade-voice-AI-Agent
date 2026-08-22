import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Login from "../pages/auth/Login.jsx";
import Overview from "../pages/Overview.jsx";
import SessionsList from "../pages/sessions/SessionsList.jsx";
import SessionDetail from "../pages/sessions/SessionDetail.jsx";
import Analytics from "../pages/Analytics.jsx";
import Knowledge from "../pages/knowledge/Knowledge.jsx";
import DemoFlowsList from "../pages/flows/DemoFlowsList.jsx";
import DemoFlowDetail from "../pages/flows/DemoFlowDetail.jsx";
import Automation from "../pages/Automation.jsx";
import Configuration from "../pages/Configuration.jsx";
import Team from "../pages/Team.jsx";
import Billing from "../pages/billing/Billing.jsx";
import Settings from "../pages/Settings.jsx";
import NotFound from "../pages/NotFound.jsx";

/**
 * Route map. This is the single place that knows the dashboard's URL
 * structure -- pages themselves are unaware of their route.
 *
 *   /login
 *   /dashboard
 *   /dashboard/sessions
 *   /dashboard/sessions/:id
 *   /dashboard/analytics
 *   /dashboard/knowledge
 *   /dashboard/demo-flows
 *   /dashboard/demo-flows/:id
 *   /dashboard/automation
 *   /dashboard/configuration
 *   /dashboard/team
 *   /dashboard/billing
 *   /dashboard/settings
 *
 * The public demo experience (/demo/:workspace) is intentionally a
 * separate application and is not routed here.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="sessions" element={<SessionsList />} />
        <Route path="sessions/:id" element={<SessionDetail />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="demo-flows" element={<DemoFlowsList />} />
        <Route path="demo-flows/:id" element={<DemoFlowDetail />} />
        <Route path="automation" element={<Automation />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="team" element={<Team />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
