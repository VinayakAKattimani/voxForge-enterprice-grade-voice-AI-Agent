export const SESSION_STATUSES = ["Completed", "In Progress", "Failed", "Abandoned"];
export const DOC_STATUSES = ["Processing", "Ready", "Failed"];
export const TEAM_ROLES = ["Owner", "Admin", "Editor", "Viewer"];

export const NAV_SECTIONS = [
  {
    section: "Main",
    items: [
      { key: "overview", label: "Home", path: "/dashboard", icon: "Home" },
      { key: "sessions", label: "Demo Sessions", path: "/dashboard/sessions", icon: "Mic" },
      { key: "analytics", label: "Analytics", path: "/dashboard/analytics", icon: "BarChart3" },
    ],
  },
  {
    section: "Build",
    items: [
      { key: "knowledge", label: "Knowledge", path: "/dashboard/knowledge", icon: "BookOpen" },
      { key: "flows", label: "Demo Flows", path: "/dashboard/demo-flows", icon: "Workflow" },
      { key: "automation", label: "Automation", path: "/dashboard/automation", icon: "Bot" },
    ],
  },
  {
    section: "Manage",
    items: [
      { key: "config", label: "Configuration", path: "/dashboard/configuration", icon: "Sliders" },
      { key: "team", label: "Users & Team", path: "/dashboard/team", icon: "Users" },
      { key: "billing", label: "Billing", path: "/dashboard/billing", icon: "CreditCard" },
      { key: "settings", label: "Settings", path: "/dashboard/settings", icon: "Settings2" },
    ],
  },
];
