import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonAdd } from "react-icons/io5";
import {
  FaUser,
  FaLock,
  FaIdCard,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaUserShield } from "react-icons/fa6";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { list, create } from "../../data/api";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    rg: "",
    telefone: "",
    dataNascimento: "",
    senha: "",
    repetirSenha: "",
    tipoUsuario: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepetirSenha, setMostrarRepetirSenha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Formatação de CPF: 000.000.000-00
    if (name === "cpf") {
      // Remove tudo que não é dígito
      value = value.replace(/\D/g, "");

      // Limita a 11 dígitos
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      // Aplica a formatação
      if (value.length > 0) {
        if (value.length <= 3) {
          // 000
          value = value;
        } else if (value.length <= 6) {
          // 000.000
          value = `${value.slice(0, 3)}.${value.slice(3)}`;
        } else if (value.length <= 9) {
          // 000.000.000
          value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        } else {
          // 000.000.000-00
          value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
            6,
            9
          )}-${value.slice(9)}`;
        }
      }
    }

    // Formatação de RG: 00.000.000-0
    if (name === "rg") {
      // Remove tudo que não é dígito
      value = value.replace(/\D/g, "");

      // Limita a 9 dígitos
      if (value.length > 9) {
        value = value.slice(0, 9);
      }

      // Aplica a formatação
      if (value.length > 0) {
        if (value.length <= 2) {
          // 00
          value = value;
        } else if (value.length <= 5) {
          // 00.000
          value = `${value.slice(0, 2)}.${value.slice(2)}`;
        } else if (value.length <= 8) {
          // 00.000.000
          value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
        } else {
          // 00.000.000-0
          value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
            5,
            8
          )}-${value.slice(8)}`;
        }
      }
    }

    // Formatação de Data: DD/MM/YYYY
    if (name === "dataNascimento") {
      // Remove tudo que não é dígito
      value = value.replace(/\D/g, "");

      // Limita a 8 dígitos
      if (value.length > 8) {
        value = value.slice(0, 8);
      }

      // Aplica a formatação
      if (value.length > 0) {
        if (value.length <= 2) {
          // DD
          value = value;
        } else if (value.length <= 4) {
          // DD/MM
          value = `${value.slice(0, 2)}/${value.slice(2)}`;
        } else {
          // DD/MM/YYYY
          value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        }
      }
    }

    // Formatação de Telefone: (11) 99999-9999
    if (name === "telefone") {
      // Remove tudo que não é dígito
      value = value.replace(/\D/g, "");

      // Limita a 11 dígitos
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      // Aplica a formatação
      if (value.length > 0) {
        if (value.length <= 2) {
          // 11
          value = `(${value}`;
        } else if (value.length <= 7) {
          // (11) 9999
          value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
          // (11) 99999-9999
          value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(
            7
          )}`;
        }
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const validarSenha = (senha) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
    const temComprimento = senha.length >= 8;

    return (
      temMaiuscula && temMinuscula && temNumero && temEspecial && temComprimento
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!validarSenha(formData.senha)) {
      setMensagem(
        "Senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial"
      );
      return;
    }

    if (formData.senha !== formData.repetirSenha) {
      setMensagem("As senhas digitadas não são iguais.");
      return;
    }

    if (!formData.tipoUsuario) {
      setMensagem("Selecione o tipo de usuário.");
      return;
    }

    if (!formData.cpf || formData.cpf.replace(/\D/g, "").length !== 11) {
      setMensagem("CPF inválido. Deve conter 11 dígitos.");
      return;
    }

    if (!formData.dataNascimento) {
      setMensagem("Data de nascimento é obrigatória.");
      return;
    }

    if (formData.dataNascimento.length !== 10) {
      setMensagem("Data de nascimento inválida. Use o formato DD/MM/YYYY.");
      return;
    }

    if (
      !formData.telefone ||
      formData.telefone.replace(/\D/g, "").length !== 11
    ) {
      setMensagem("Telefone inválido. Deve conter 11 dígitos (DDD + número).");
      return;
    }

    try {
      // Converte data de DD/MM/YYYY para YYYY-MM-DD
      const [dia, mes, ano] = formData.dataNascimento.split("/");

      // Valida os valores
      const diaNum = parseInt(dia);
      const mesNum = parseInt(mes);
      const anoNum = parseInt(ano);

      if (
        diaNum < 1 ||
        diaNum > 31 ||
        mesNum < 1 ||
        mesNum > 12 ||
        anoNum < 1900
      ) {
        setMensagem("Data de nascimento inválida.");
        return;
      }

      const dataFormatada = `${ano}-${mes}-${dia}`;

      // Cria novo usuário com os campos esperados pelo backend
      const novoUsuario = {
        name: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação antes de enviar
        rg: formData.rg.replace(/\D/g, ""), // Remove formatação antes de enviar
        birth_date: dataFormatada,
        phone: formData.telefone.replace(/\D/g, ""), // Remove formatação antes de enviar
        password: formData.senha,
        status: "Ativo",
        role: formData.tipoUsuario,
      };

      console.log("Dados enviados:", novoUsuario);
      await create("users", novoUsuario);

      setMensagem("Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const mensagemErro =
        error.message || "Erro ao cadastrar. Tente novamente.";
      setMensagem(mensagemErro);
      console.error("Erro completo:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at 50% 80%, #00b5ff, #03054b)",
      }}
    >

        {/* FORMULÁRIO */}
        <div className="bg-black bg-opacity-90 border-solid border-2 border-white p-8 rounded-2xl shadow-lg w-full max-w-md">
           <img
              src="/src/assets/SigSports.png"
              alt="Logo da Aplicação"
              className=" object-contain mb-10 mx-auto w-2/4 h-auto"
            />
          
          <form
            className="flex flex-col gap-3 sm:gap-4"
            onSubmit={handleSubmit}
          >
            {/* Nome e Email */}
            <div className="grid grid-cols-1 gap-3">
              {/* Nome */}
              <div className="relative">
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome Completo"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm sm:text-base">
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
                  placeholder="E-mail"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm sm:text-base">
                  <MdEmail />
                </span>
              </div>
            </div>

            {/* CPF e RG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* CPF */}
              <div className="relative">
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="CPF"
                  maxLength="14"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm sm:text-base">
                  <FaIdCard />
                </span>
              </div>

              {/* RG */}
              <div className="relative">
                <input
                  type="text"
                  name="rg"
                  value={formData.rg}
                  onChange={handleChange}
                  placeholder="RG"
                  maxLength="12"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm sm:text-base">
                  <FaIdCard />
                </span>
              </div>
            </div>

            {/* Telefone e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Telefone */}
              <div className="relative">
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="Telefone"
                  maxLength="15"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm sm:text-base">
                  <FaPhone />
                </span>
              </div>

              {/* Data de Nascimento */}
              <div className="relative">
                <input
                  type="text"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  placeholder="Nascimento (dia/mês/ano)"
                  maxLength="10"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm sm:text-base">
                  <FaCalendarAlt />
                </span>
              </div>
            </div>

            {/* Tipo de Usuário */}
            <div className="relative">
              <select
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                className="cursor-pointer w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none transition"
                required
              >
                <option value="" disabled>
                  Tipo de usuário
                </option>
                <option value="Treinador">Treinador</option>
                <option value="Administrador">Administrador</option>
              </select>

              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none text-sm sm:text-base">
                <FaUserShield />
              </span>
            </div>

            {/* Senha e Confirmar Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Senha */}
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Senha"
                  autoComplete="new-password"
                  maxLength="8"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {mostrarSenha ? (
                    <AiOutlineEyeInvisible size={16} />
                  ) : (
                    <AiOutlineEye size={16} />
                  )}
                </button>
              </div>

              {/* Confirmar Senha */}
              <div className="relative">
                <input
                  type={mostrarRepetirSenha ? "text" : "password"}
                  name="repetirSenha"
                  value={formData.repetirSenha}
                  onChange={handleChange}
                  placeholder="Confirmar Senha"
                  maxLength="8"
                  className="w-full p-3 sm:p-3.5 pr-8 rounded-lg bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarRepetirSenha(!mostrarRepetirSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {mostrarRepetirSenha ? (
                    <AiOutlineEyeInvisible size={16} />
                  ) : (
                    <AiOutlineEye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem */}
            {mensagem && (
              <p
                className={`text-center text-sm sm:text-base font-medium mt-3 p-3 rounded-lg ${
                  mensagem.includes("sucesso")
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                }`}
              >
                {mensagem}
              </p>
            )}

            {/* Botão */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition shadow-md mt-3 text-sm sm:text-base active:scale-95"
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
              className="text-gray-300 hover:text-blue-400 text-xs sm:text-sm mt-3 font-medium"
            >
              Já tem uma conta? Voltar para o login
            </button>
          </form>
        </div>
    </div>
  );
}
