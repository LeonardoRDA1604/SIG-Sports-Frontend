import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export default function ModalCadastroCategoria({
  aberto,
  onClose,
  onSave,
  categoria,
}) {
  // Estado inicial para reset
  const estadoInicial = {
    name: "",
    min_age: "",
    max_age: "",
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [erros, setErros] = useState({});

  // Preencher dados quando estiver editando
  useEffect(() => {
    if (aberto && categoria) {
      setFormData({
        name: categoria.name || "",
        min_age: categoria.min_age || "",
        max_age: categoria.max_age || "",
      });
    } else {
      setFormData(estadoInicial);
      setErros({});
    }
  }, [aberto, categoria]);

  // Função para fechar o modal e resetar os campos
  const handleClose = () => {
    setFormData(estadoInicial);
    setErros({});
    onClose();
  };

  // Validação de campos
  const validarCampos = () => {
    const novoErros = {};

    if (!formData.name || formData.name.trim().length === 0) {
      novoErros.name = "O nome é obrigatório";
    }

    if (!formData.min_age || formData.min_age === "") {
      novoErros.min_age = "Idade mínima é obrigatória";
    } else if (Number(formData.min_age) < 0) {
      novoErros.min_age = "Idade deve ser maior que 0";
    }

    if (!formData.max_age || formData.max_age === "") {
      novoErros.max_age = "Idade máxima é obrigatória";
    } else if (Number(formData.max_age) < 0) {
      novoErros.max_age = "Idade deve ser maior que 0";
    }

    if (
      formData.min_age &&
      formData.max_age &&
      Number(formData.min_age) > Number(formData.max_age)
    ) {
      novoErros.max_age = "Idade máxima deve ser maior que mínima";
    }

    setErros(novoErros);
    return Object.keys(novoErros).length === 0;
  };

  const handleSalvar = () => {
    if (!validarCampos()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      min_age: Number(formData.min_age),
      max_age: Number(formData.max_age),
    };

    console.log("Enviando categoria:", payload);
    onSave?.(payload);
    handleClose();
  };

  // Lida com mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao digitar
    if (erros[name]) {
      setErros((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Estilos padronizados
  const inputStyle = (hasError) =>
    `w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 outline-none transition-all text-sm placeholder:text-gray-400 bg-white ${
      hasError
        ? "border-red-500 focus:ring-red-500/20 focus:border-red-600"
        : "border-gray-300 focus:ring-primary-500/20 focus:border-primary-700"
    }`;

  if (!aberto) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-screen sm:w-full sm:max-w-lg h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[80vh]">
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 z-10 rounded-t-2xl bg-primary-900">
          <h2 className="text-xl font-bold text-primary-50">Nova Categoria</h2>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          {/* Nome da Categoria */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Nome da Categoria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Sub-12, Iniciantes"
              className={inputStyle(!!erros.name)}
            />
            {erros.name && (
              <p className="text-red-500 text-xs mt-1">{erros.name}</p>
            )}
          </div>

          {/* Idade Mínima */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Idade Mínima <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="min_age"
              value={formData.min_age}
              onChange={handleChange}
              placeholder="Ex: 10"
              min="0"
              max="120"
              className={inputStyle(!!erros.min_age)}
            />
            {erros.min_age && (
              <p className="text-red-500 text-xs mt-1">{erros.min_age}</p>
            )}
          </div>

          {/* Idade Máxima */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Idade Máxima <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="max_age"
              value={formData.max_age}
              onChange={handleChange}
              placeholder="Ex: 12"
              min="0"
              max="120"
              className={inputStyle(!!erros.max_age)}
            />
            {erros.max_age && (
              <p className="text-red-500 text-xs mt-1">{erros.max_age}</p>
            )}
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="flex items-center justify-end space-x-6 px-6 py-5 border-t border-gray-100 bg-primary-50 rounded-b-2xl">
          <button
            type="button"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={Object.keys(erros).length > 0}
            className={`px-10 py-2.5 font-semibold rounded-full transition-colors shadow-md text-sm ${
              Object.keys(erros).length === 0
                ? "bg-primary-900 text-white hover:bg-primary-800 cursor-pointer shadow-blue-900/20"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            }`}
            onClick={handleSalvar}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
