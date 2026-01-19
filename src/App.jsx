import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import Cadastros from "./pages/Cadastros";
import Cadastro from "./components/Auth/Cadastro";
import EsqueciSenha from "./components/Auth/EsqueciSenha";
import Financeiro from "./pages/Financeiro";
import Presencas from "./pages/Presencas";
import Interessados from "./pages/Interessados";
import Relatorios from "./pages/Relatorios";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-panel" element={<AdminPanel />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cadastros" element={<Cadastros />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/financeiro" element={<Financeiro />} />
      <Route path="/presencas" element={<Presencas />} />
      <Route path="/interessados" element={<Interessados />} />
      <Route path="/relatorios" element={<Relatorios />} />
    </Routes>
  );
}

export default App;
