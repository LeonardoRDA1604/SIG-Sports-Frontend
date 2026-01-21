import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiChevronDown } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default function ModalCadastroInteressado({
  aberto,
  onClose,
  onSave,
  interessado,
  modalidades = [],
}) {
  function getLocalDateTimeString() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
  const estadoInicial = {
    name: "",
    email: "",
    source: "",
    phone: "",
    entry_date: getLocalDateTimeString(),
    status: "Novo",
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Preencher dados quando estiver editando
  useEffect(() => {
    if (aberto && interessado) {
      setFormData({
        name: interessado.name || "",
        email: interessado.email || "",
        source: interessado.source || "",
        phone: interessado.phone || "",
        entry_date: interessado.entry_date
          ? interessado.entry_date.slice(0, 16)
          : getLocalDateTimeString(),
        status: interessado.status || "Novo",
      });
    } else {
      setFormData(estadoInicial);
    }
  }, [aberto, interessado]);

  const handleClose = () => {
    setFormData(estadoInicial);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "phone") {
      maskedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
        .substring(0, 15);
    }

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const validarCampos = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.source !== "" &&
      formData.phone.trim() !== "" &&
      formData.entry_date !== "" &&
      formData.status !== ""
    );
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: formData.source,
      entry_date: formData.entry_date,
      status: formData.status,
    };
    onSave?.(payload);
    handleClose();
  };

  const inputStyle =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white";
  const selectStyle =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer";

  if (!aberto) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-screen sm:w-full sm:max-w-lg h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[80vh]">
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 z-10 rounded-t-2xl bg-primary-900">
          <h2 className="text-xl font-bold text-primary-50">
            Novo Interessado
          </h2>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
              placeholder="email@exemplo.com"
            />
          </div>

          {/* Modalidade */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Modalidade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="" disabled>
                  Selecione uma modalidade
                </option>
                {modalidades && modalidades.length > 0
                  ? modalidades.map((mod) => (
                      <option key={mod.id || mod.name} value={mod.name}>
                        {mod.name}
                      </option>
                    ))
                  : null}
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          {/* Data de Entrada removida do formulário, mas será salva automaticamente */}

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={selectStyle}
            >
              <option value="Novo">Novo</option>
              <option value="Em contato">Em contato</option>
              <option value="Agendado">Agendado</option>
              <option value="Convertido">Convertido</option>
              <option value="Desqualificado">Desqualificado</option>
            </select>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className={inputStyle}
            />
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
            disabled={!validarCampos()}
            className={`px-10 py-2.5 font-semibold rounded-full transition-colors shadow-md text-sm ${
              validarCampos()
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
