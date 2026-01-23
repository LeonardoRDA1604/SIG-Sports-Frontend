import React from "react";
// Ícone SVG do WhatsApp
const WhatsappIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="inline align-text-bottom mx-1"
  >
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="#fff"
    />
  </svg>
);

export default function RedirectWhatsapp({ aberto, nome, telefone, onClose }) {
  if (!aberto) return null;

  function handleWhatsapp() {
    const numero = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo negro translúcido corrigido */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 0.6, zIndex: 0 }}
      ></div>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center z-10"
        style={{ zIndex: 1 }}
      >
        <h2 className="text-lg font-semibold mb-4">Contato via WhatsApp</h2>
        <p className="mb-4">
          <span className="flex items-center justify-center gap-2 mb-1">
            <WhatsappIcon />
            <span className="font-bold">{nome}</span>
          </span>
          Deseja entrar em contato?
          <br />
          <span className="font-bold">{telefone}</span>
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleWhatsapp}
            className="bg-[#128C7E] text-white py-2 px-4 rounded hover:bg-[#23d366]"
          >
            Sim
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-red-400 hover:text-white"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}
