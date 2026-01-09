import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonAdd } from "react-icons/io5";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaUserShield } from "react-icons/fa6";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    repetirSenha: "",
    tipoUsuario: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem("");

    if (formData.senha !== formData.repetirSenha) {
      setMensagem("As senhas digitadas não são iguais.");
      return;
    }

    if (!formData.tipoUsuario) {
      setMensagem("Selecione o tipo de usuário.");
      return;
    }

    try {
      console.log("Novo Usuário Cadastrado:", {
        nome: formData.nome,
        email: formData.email,
        tipoUsuario: formData.tipoUsuario,
      });

      setMensagem("Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMensagem("Erro ao cadastrar. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "radial-gradient(circle at 50% 50%, #0036cc, #000125)" }}
    >
      <div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row bg-opacity-90">

        {/* FORMULÁRIO */}
        <div className="w-full md:w-1/2 p-10 bg-gray-900 rounded-l-2xl flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-8 text-center text-white tracking-wider">
            Criar Nova Conta
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Nome */}
            <div className="relative">
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome Completo"
                className="w-full p-3 pr-10 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaUser />
              </span>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Endereço de E-mail"
                className="w-full p-3 pr-10 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <MdEmail />
              </span>
            </div>

            {/* Tipo de Usuário */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300 font-medium">
                Selecione o tipo de usuário
              </label>

              <p className="text-xs text-gray-400">
                Escolha <span className="text-white font-medium">Treinador</span>{" "}
                para gerenciar atletas e treinos ou{" "}
                <span className="text-white font-medium">Administrador</span>{" "}
                para acessar configurações e controles do sistema.
              </p>

              <div className="relative mt-1">
                <select
                  name="tipoUsuario"
                  value={formData.tipoUsuario}
                  onChange={handleChange}
                  className="cursor-pointer w-full p-3 pr-10 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="treinador">Treinador</option>
                  <option value="administrador">Administrador</option>
                </select>

                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">
                  <FaUserShield />
                </span>
              </div>
            </div>

            {/* Senha */}
            <div className="relative">
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Defina uma senha"
                autoComplete="new-password"
                className="w-full p-3 pr-10 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaLock />
              </span>
            </div>

            {/* Repetir Senha */}
            <div className="relative">
              <input
                type="password"
                name="repetirSenha"
                value={formData.repetirSenha}
                onChange={handleChange}
                placeholder="Repita a senha"
                className="w-full p-3 pr-10 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaLock />
              </span>
            </div>

            {/* Mensagem */}
            {mensagem && (
              <p
                className={`text-center text-sm font-medium ${
                  mensagem.includes("sucesso")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {mensagem}
              </p>
            )}

            {/* Botão */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <IoPersonAdd size={20} />
                Cadastrar
              </div>
            </button>

            {/* Voltar */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-200 hover:text-blue-400 text-sm mt-4"
            >
              Já tem uma conta? Voltar para o login
            </button>
          </form>
        </div>

        {/* IMAGEM */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-gray-800 via-white to-gray-900 p-8">
          <img
            src="/src/assets/icons/ps-sports-logo-color.svg"
            alt="Logo da aplicação"
            className="w-3/4"
          />
        </div>
      </div>
    </div>
  );
}
