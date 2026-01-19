import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export default function ModalCadastroModalidade({
  aberto,
  onClose,
  onSave,
  modalidade,
}) {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (aberto && modalidade) {
      setFormData({
        name: modalidade.name || "",
      });
    } else {
      setFormData({ name: "" });
    }
  }, [aberto, modalidade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      setFormData({ name: "" });
    }
  };

  const handleClose = () => {
    setFormData({ name: "" });
    onClose();
  };

  if (!aberto) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-screen sm:w-full sm:max-w-lg h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[80vh] mx-0 sm:mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 z-10 rounded-t-2xl bg-primary-900">
          <div>
            <h2 className="text-xl font-bold text-primary-50">
              Cadastrar Modalidade
            </h2>
            <p className="text-sm text-primary-100/80 mt-1">
              Preencha os dados da nova modalidade
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 flex-1 flex flex-col"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
              Nome da Modalidade
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Futebol"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 mt-auto">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors text-sm shadow-sm"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
