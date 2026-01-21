import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Seus módulos
import { login } from "../../data/api";
import { MdLogin } from "react-icons/md";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // Limpar o formulário ao carregar o componente
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
    setMensagem("");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setCarregando(true);

    // Validar força da senha
    if (!validarSenha(formData.password)) {
      setMensagem(
        "Senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial",
      );
      setCarregando(false);
      return;
    }

    try {
      // Chama a rota de login no backend
      const response = await login(formData.email, formData.password);

      // SALVA INFORMAÇÕES DO USUÁRIO NO localStorage

      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          status: response.status,
          role: response.role,
        }),
      );

      setMensagem("Login realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const mensagemErro =
        error.message || "Erro ao conectar. Tente novamente.";
      setMensagem(mensagemErro);
      console.error("Erro de login:", error);
      setCarregando(false);
    }
  };

  return (
    // Fundo gradiente escuro com brilho centralizado, simulando o estilo da imagem
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at 50% 80%, #00b5ff, #03054b)",
      }}
    >
      {/* Fundo do formulário transparente */}
      <div className="bg-black border-solid border-2 border-white bg-opacity-60 backdrop-blur-lg rounded-2xl shadow-lg p-10 w-full max-w-md">
        <img
          src="/src/assets/SigSports.png"
          alt="Logo da Aplicação"
          className=" object-contain mb-10 mx-auto w-3/4 h-auto"
        />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Campo E-mail */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Endereço de Email"
              autoComplete="email"
              className="w-full p-3 pr-10 border-none rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
            {/* Ícone de Email (Envelope) */}
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"
                />
              </svg>
            </span>
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
              autoComplete="current-password"
              className="w-full p-3 pr-10 border-none rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
            {/* Ícone de Senha (Cadeado) */}
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 9V5a2 2 0 00-2-2H8a2 2 0 00-2 2v4"
                />
              </svg>
            </span>
          </div>

          {/* Mensagem de Erro */}
          {mensagem && (
            <p
              className={`text-center font-medium text-sm ${
                mensagem.includes("sucesso") ? "text-green-400" : "text-red-400"
              }`}
            >
              {mensagem}
            </p>
          )}

          {/* Botão de Login: Estilo azul primário da imagem */}
          <button
            className="cursor-pointer w-full bg-blue-500 text-white font-semibold py-3 rounded-lg mt-1 hover:bg-blue-600 disabled:bg-blue-400 transition duration-300 ease-in-out shadow-md transform hover:scale-[1.01]"
            type="submit"
            disabled={carregando}
          >
            <div className="flex items-center justify-center gap-2">
              <MdLogin size={24} />
              <span className="text-lg">
                {carregando ? "Conectando..." : "Entrar"}
              </span>
            </div>
          </button>

          <div className="flex flex-row justify-between mt-3 gap-2">
            {/* Link "Esqueci minha senha" */}
            <button
              type="button"
              onClick={() => navigate("/esqueci-senha")}
              className="text-gray-200 hover:text-blue-400 hover:underline text-center text-sm cursor-pointer flex-1"
            >
              Esqueci a senha
            </button>
            {/* Link Cadastre-se */}
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-gray-200 hover:text-blue-400 hover:underline text-center text-sm cursor-pointer flex-1"
            >
              Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
