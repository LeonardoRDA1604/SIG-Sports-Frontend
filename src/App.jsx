import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import Cadastros from "./pages/Cadastros";
import Cadastro from "./components/Auth/Cadastro"; // O novo componente
import EsqueciSenha from "./components/Auth/EsqueciSenha"; // O novo componente
import VisualizarImagens from "./pages/VisualizarImagens";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Cadastros" element={<Cadastros />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/VisualizarImagens" element={<VisualizarImagens />} />
    </Routes>
  );
}

export default App;
