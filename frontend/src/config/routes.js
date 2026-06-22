// App routes configuration
export const ROUTES = {
  HOME: "/",
  LANDING: "/landing",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  FUTURE_TWINS: "/future-twins",
  TRADE_OFF: "/trade-off",
  SIMULATOR: "/simulator",
  INSIGHT: "/insight",
  ROADMAP: "/roadmap",
  DECISION_ZONE: "/decision-zone",
  RESPONSIBLE_AI: "/responsible-ai",
  SETTINGS: "/settings",
};

// Route groups
export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LANDING, ROUTES.LOGIN];
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.FUTURE_TWINS,
  ROUTES.TRADE_OFF,
  ROUTES.SIMULATOR,
  ROUTES.INSIGHT,
  ROUTES.ROADMAP,
  ROUTES.DECISION_ZONE,
  ROUTES.RESPONSIBLE_AI,
  ROUTES.SETTINGS,
];
