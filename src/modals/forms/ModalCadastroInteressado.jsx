import { useState, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default function ModalCadastroInteressado({
  aberto,
  onClose,
  onSave,
  interessado,
}) {
  const estadoInicial = {
    nome: "",
    modalidade: "",
    telefone: "",
    email: "",
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [emailErro, setEmailErro] = useState(false); // Estado de erro do email

  // Preencher dados quando estiver editando
  useEffect(() => {
    if (aberto && interessado) {
      setFormData(interessado);
    } else {
      setFormData(estadoInicial);
    }
  }, [aberto, interessado]);

  const handleClose = () => {
    setFormData(estadoInicial);
    setEmailErro(false); // Reseta o estado de erro do email
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "telefone") {
      maskedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
        .substring(0, 15);
    }

    if (name === "email") {
      setEmailErro(!validarEmail(value) && value !== "");
    }

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const validarCampos = () => {
    const camposObrigatorios = [
      "nome",
      "email",
      "telefone",
      "modalidade"
    ];

    // Verifica se todos os campos obrigatórios têm conteúdo (removendo espaços vazios)
    const todosPreenchidos = camposObrigatorios.every(
      (campo) => formData[campo]?.trim() !== ""
    );

    // O botão só habilita se tudo estiver preenchido E não houver erro de formato de email
    return todosPreenchidos && !emailErro;
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;
    const payload = {
      name: formData.nome,
      email: formData.email,
      modality: formData.modalidade,
      phoneNumber: formData.telefone,
      dataInsercao: formData.dataInsercao,
    };
    onSave?.(payload);
    handleClose();
  };

  // Validação de email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const inputStyle =
    "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm placeholder:text-gray-400";
  const selectStyle =
    "w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm cursor-pointer";

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-[#101944]">Novo Interessado</h2>
          <button
            className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Email com Validação Visual */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputStyle} ${
                emailErro
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              }`}
            />
            {emailErro && (
              <span className="text-xs text-red-500 mt-1">
                Por favor, insira um e-mail válido.
              </span>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className={inputStyle}
            />
          </div>

          {/* Modalidade */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Modalidade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="modalidade"
                value={formData.modalidade}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="Futebol">Futebol</option>
                <option value="Futsal">Futsal</option>
                <option value="Beach Soccer">Beach Soccer</option>
                <option value="Fut7">Fut7</option>
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="flex items-center justify-end space-x-6 px-6 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
          <button
            type="button"
            className="text-[#101944] font-bold hover:underline transition-all cursor-pointer text-sm"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!validarCampos()}
            className={`px-10 py-2.5 font-bold rounded-full transition-colors shadow-md text-sm ${
              validarCampos()
                ? "bg-[#003366] text-white hover:bg-[#002850] cursor-pointer shadow-blue-900/20"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            }`}
            onClick={handleSalvar}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
