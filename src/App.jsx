import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroInstrutor from "./pages/CadastroInstrutor";
import CadastroCondutor from "./pages/CadastroCondutor";
import DashboardInstrutor from "./pages/DashboardInstrutor";
import { AnimatePresence } from "framer-motion";
import DashboardAgendamentos from "./pages/DashboardAgendamentos";
import DashboardMarcar from "./pages/DashboardMarcar";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/dashboard-instrutor' element={<DashboardInstrutor />} />
          <Route path="/cadastrar-instrutor" element={<CadastroInstrutor />} />
        <Route path="/cadastrar-condutor" element={<CadastroCondutor />} />
        <Route path="/dashboard-aulas" element={<DashboardAgendamentos />}></Route>
        <Route path="/dashboard-marcar" element={<DashboardMarcar/>}></Route>
        </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
