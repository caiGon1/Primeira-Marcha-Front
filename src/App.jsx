import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroInstrutor from "./pages/CadastroInstrutor";
import CadastroCondutor from "./pages/CadastroCondutor";
import DashboardInstrutor from "./pages/DashboardInstrutor";
import { AnimatePresence } from "framer-motion";

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
