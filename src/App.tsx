import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Overview } from "./pages/Overview";
import { Plant } from "./pages/Plant";
import { Calibration } from "./pages/Calibration";
import { Adaptive } from "./pages/Adaptive";
import { Policies } from "./pages/Policies";
import { Pareto } from "./pages/Pareto";
import { Algorithm } from "./pages/Algorithm";
import { Report } from "./pages/Report";
import { Methods } from "./pages/Methods";
import { Demo } from "./pages/Demo";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/plant" element={<Plant />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/adaptive" element={<Adaptive />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/pareto" element={<Pareto />} />
          <Route path="/algorithm" element={<Algorithm />} />
          <Route path="/report" element={<Report />} />
          <Route path="/methods" element={<Methods />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
