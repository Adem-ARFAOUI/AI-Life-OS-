import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import { ROUTES } from "./config/routes";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FutureTwins from "./pages/FutureTwins";
import TradeOff from "./pages/TradeOff";
import Simulator from "./pages/Simulator";
import Insight from "./pages/Insight";
import Roadmap from "./pages/Roadmap";
import DecisionZone from "./pages/DecisionZone";
import ResponsibleAI from "./pages/ResponsibleAI";
import Settings from "./pages/Settings";
import { AIPlanProvider } from "./context/AIPlanContext";

function App() {
  return (
    <AIPlanProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Landing />} />
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />

          {/* Protected Routes */}
          <Route path='/register' element={<Register />} />
          <Route path='/complete-profile' element={<CompleteProfile />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.FUTURE_TWINS} element={<FutureTwins />} />
          <Route path={ROUTES.TRADE_OFF} element={<TradeOff />} />
          <Route path={ROUTES.SIMULATOR} element={<Simulator />} />
          <Route path={ROUTES.INSIGHT} element={<Insight />} />
          <Route path={ROUTES.ROADMAP} element={<Roadmap />} />
          <Route path={ROUTES.DECISION_ZONE} element={<DecisionZone />} />
          <Route path={ROUTES.RESPONSIBLE_AI} element={<ResponsibleAI />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />

          {/* Catch all - redirect to landing */}
          <Route path='*' element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Router>
    </AIPlanProvider>
  );
}

export default App;
