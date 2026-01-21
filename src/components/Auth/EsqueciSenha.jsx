import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLockReset } from "react-icons/md"; // Ícones
import { list } from "../../data/api";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      // Carrega usuários do banco de dados
      const usuarios = await list("usuarios");

      // Verifica se o email existe
      const usuarioEncontrado = usuarios.find((u) => u.email === email);

      // Mensagem sempre igual para segurança (não revela se o email existe ou não)
      setMensagem(
        "Se o e-mail estiver cadastrado, um link de redefinição foi enviado!"
      );
      setEmail(""); // Limpa o campo após o envio

      // Aqui você poderia integrar um serviço de email real
      if (usuarioEncontrado) {
        console.log(`Token de redefinição enviado para: ${email}`);
      }
    } catch (error) {
      setMensagem("Erro ao processar solicitação. Tente novamente.");
      console.error(error);
    }
  };

  return (
    // Fundo gradiente escuro (igual ao Login)
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at 50% 80%, #00b5ff, #03054b)",
      }}
    >
      
        {/* FORMULÁRIO (Lado Esquerdo) - Adaptado para Esqueci a Senha */}
        <div className="bg-black bg-opacity-90 border-solid border-2 border-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <img
              src="/src/assets/SigSports.png"
              alt="Logo da Aplicação"
              className=" object-contain mb-10 mx-auto w-3/4 h-auto"
            />
          <h2 className="text-2xl font-bold mb-4 text-center text-white tracking-wider">
            Recuperar Senha
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Informe seu e-mail para receber as instruções de redefinição.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Campo E-mail */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Endereço de E-mail"
                className="w-full p-3 pr-10 border-none rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
              {/* Ícone de Email */}
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <MdEmail className="h-5 w-5" />
              </span>
            </div>

            {/* Mensagem de Erro/Sucesso */}
            {mensagem && (
              <p
                className={`text-center font-medium text-sm ${
                  mensagem.includes("enviado")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {mensagem}
              </p>
            )}

            {/* Botão de Envio: Estilo azul primário */}
            <button
              className="cursor-pointer w-full bg-blue-500 text-white font-semibold py-3 rounded-lg mt-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md transform hover:scale-[1.01]"
              type="submit"
            >
              <div className="flex items-center justify-center gap-2">
                <MdLockReset size={20} />
                <span>Enviar Link de Redefinição</span>
              </div>
            </button>

            {/* Link "Voltar ao Login" */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-200 hover:text-blue-400 hover:underline mt-4 text-center text-sm cursor-pointer"
            >
              Voltar para o Login
            </button>
          </form>
        </div>
    </div>
  );
}
