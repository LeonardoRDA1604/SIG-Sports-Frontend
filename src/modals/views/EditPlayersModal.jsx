import { useState } from "react";
import ModalCadastroAtleta from "../forms/PlayerTemplateModal";

export default function EditPlayersModal(props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  function handleSave(data) {
    const result = props.onSave?.(data);
    if (result && typeof result.then === "function") {
      result.then(() => {
        setShowSuccess(true);
        // Não fecha o modal aqui!
      });
    } else {
      setShowSuccess(true);
      // Não fecha o modal aqui!
    }
  }

  function handleCloseAll() {
    setShowSuccess(false);
    setModalOpen(false);
    props.onClose?.();
  }

  return (
    <>
      {modalOpen && (
        <ModalCadastroAtleta
          {...props}
          editandoAtleta
          onSave={handleSave}
          onClose={handleCloseAll}
        />
      )}
      {showSuccess && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22c55e" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-green-700">
              Cadastro atualizado!
            </h2>
            <p className="text-gray-600 mt-2 mb-6 text-center">
              As informações do atleta foram salvas com sucesso.
            </p>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
              onClick={handleCloseAll}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
