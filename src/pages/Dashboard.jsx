import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import AnimatedTitle from "../modals/AnimatedTitle";
import { Card } from "../components/Card";
import { AcaoRapida } from "../components/AcaoRapida/index";

export default function Dashboard({ expanded }) {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "Ativo",
  });

  // 🔵 Buscar usuários quando abrir a página
  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  const gerarDataHora = () => {
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${data} ${hora}`;
  };

  // 🔵 CADASTRAR (POST no json-server)
  const cadastrar = async (e) => {
    e.preventDefault();

    const novoUsuario = {
      ...form,
      criadoEm: gerarDataHora(),
    };

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const usuarioSalvo = await res.json();

      setUsuarios((prev) => [...prev, usuarioSalvo]);

      setForm({
        nome: "",
        cpf: "",
        cargo: "",
        status: "Ativo",
      });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  // 🔵 REMOVER (DELETE)
  const remover = async (id) => {
    try {
      await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: "DELETE",
      });

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const total = usuarios.length;
  const ativos = usuarios.filter((u) => u.status === "Ativo").length;
  const novosHoje = usuarios.filter((u) =>
    u.criadoEm?.startsWith(new Date().toLocaleDateString("pt-BR"))
  ).length;

  return (
    <div className="min-h-screen bg-primary-50 flex overflow-x-hidden">

      <Navbar expanded={expanded} />

      {/* MAIN */}
      <main
        className={`
          flex-1 p-6 transition-all duration-300
        `}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <AnimatedTitle text="Dashboard" />       
        </div>

        <div className="text-xs sm:text-base text-gray-500 mb-4">
          <p>Visão geral do PS Sport’s</p>                 
        </div>
        
        <section className="cards">
        {/* CARDS */}
          <div className="acoes-rapidas mt-10">
            
            <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-6">
              <AcaoRapida subTitle="Cadastrar Atleta" />
              <AcaoRapida subTitle="Cadastrar Responsável" />
              <AcaoRapida subTitle="Cadastrar Treinador" />
              <AcaoRapida subTitle="Cadastrar Turma" />
              <AcaoRapida subTitle="Cadastrar Modalidade" />
              <AcaoRapida subTitle="Cadastrar Categoria" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            <Card title="Atletas" value={total} />
            <Card title="Responsáveis" value={ativos} />
            <Card title="Interessados" value={novosHoje} />
            <Card title="Treinadores" value={ativos} />
            <Card title="Modalidades" value={ativos} />
            <Card title="Turmas" value={ativos} />
            <Card title="Categorias" value={ativos} />
          </div>         
        </section>        
      </main>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <input
      type="text"
      placeholder={label}
      className="border p-2 rounded w-full"
      {...props}
      required
    />
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}