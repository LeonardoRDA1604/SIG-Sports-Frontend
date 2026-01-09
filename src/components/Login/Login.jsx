import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Seus módulos
import { carregarUsuarios } from "../../data/dadosUsuarios";
import { MdLogin } from "react-icons/md";

export default function Login() {
  const [formData, setFormData] = useState({
    tipoUsuario: "",
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem("");

    // CARREGA TODOS OS USUÁRIOS DO 'BANCO DE DADOS FAKE'
    const todosUsuarios = carregarUsuarios();

    const usuario = todosUsuarios.find(
      (u) =>
        u.email === formData.email &&
        u.senha === formData.senha &&
        u.tipoUsuario === formData.tipoUsuario
    );

    if (!usuario) {
      setMensagem("Credenciais inválidas ou tipo de usuário incorreto.");
      return;
    }

    // SALVA INFORMAÇÕES DO USUÁRIO NO localStorage
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
      })
    );

    navigate("/dashboard");
  };

  return (
    // Fundo gradiente escuro com brilho centralizado, simulando o estilo da imagem
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'radial-gradient(circle at 50% 50%, #0036cc, #000125)' }}>
      
      {/* Cartão de Login: Fundo escuro, bordas arredondadas e sombra forte */}
      <div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row bg-opacity-90">

        {/* FORMULÁRIO (Lado Esquerdo) */}
        {/* Fundo do formulário claro para contraste com o dark-mode do cartão */}
        <div className="w-full md:w-1/2 p-10 bg-gray-900 rounded-l-2xl flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-8 text-center text-white tracking-wider">
            Acessar Conta
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Campo Tipo de Usuário (Select) */}
            <div className="relative">
              <select
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                autocomplete="off"
                // Estilo do campo: Branco, arredondado e com padding
                className="w-full p-3 border-none rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
                required
              >
                <option value="">Quem está acessando?</option>
                <option value="administrador">Administrador</option>
                <option value="treinador">Treinador</option>
                
              </select>
              {/* Ícone para o Select */}
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
            
            {/* Campo E-mail */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Endereço de Email"
                autocomplete="new-email"
                // Estilo do campo: Branco, arredondado e com padding
                className="w-full p-3 pr-10 border-none rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
              {/* Ícone de Email (Envelope) */}
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" />
                </svg>
              </span>
            </div>

            {/* Campo Senha */}
            <div className="relative">
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Senha"
                autocomplete="new-password"
                // Estilo do campo: Branco, arredondado e com padding
                className="w-full p-3 pr-10 border-none rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
              {/* Ícone de Senha (Cadeado) */}
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a2 2 0 00-2-2H8a2 2 0 00-2 2v4" />
                </svg>
              </span>
            </div>

            {/* Mensagem de Erro */}
            {mensagem && (
              <p className="text-center text-red-400 font-medium text-sm">
                {mensagem}
              </p>
            )}

            {/* Botão de Login: Estilo azul primário da imagem */}
            <button
              className="cursor-pointer w-full bg-blue-500 text-white font-semibold py-3 rounded-lg mt-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md transform hover:scale-[1.01]"
              type="submit"
            >
              <div className="flex items-center justify-center gap-2">
                <MdLogin  size={30} />
                <span className="text-2xl">Entrar</span>
              </div>
            </button>
            
            <div className="flex flex-row justify-between mt-4">
            {/* Link "Esqueci minha senha" */}
            <button
              type="button"
              onClick={() => navigate("/esqueci-senha")}
              className="text-gray-200 hover:text-blue-400 hover:underline mt-2 text-center text-md cursor-pointer"
            >
              Esqueci a senha
            </button>
            {/* Link Cadastre-se */}
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-gray-200 hover:text-blue-400 hover:underline mt-2 text-center text-md cursor-pointer"
            >
              Cadastre-se
            </button>
            </div>
          </form>
        </div>

        {/* IMAGEM (Lado Direito) - Mantido com o seu caminho original */}
        <div className="hidden md:block md:w-1/2 rounded-r-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 via-white to-gray-900 p-8">
                {/* O background-image foi substituído por uma cor sólida para manter o esquema dark-mode, e a logo centralizada */}
                <img
                    src="/src/assets/icons/ps-sports-logo-color.svg"
                    alt="Logo da Aplicação"
                    className="w-3/4 h-auto object-contain"
                />
            </div>
        </div>

      </div>
    </div>
  );
}