import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroInstrutor from "./pages/CadastroInstrutor";
import CadastroCondutor from "./pages/CadastroCondutor";
import DashboardInstrutor from "./pages/DashboardInstrutor";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/dashboard-instrutor' element={<DashboardInstrutor />} />
          <Route path="/cadastrar-instrutor" element={<CadastroInstrutor />} />
          <Route path="/cadastrar-condutor" element={<CadastroCondutor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
