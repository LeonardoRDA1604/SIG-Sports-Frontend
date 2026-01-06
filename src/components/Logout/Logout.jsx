import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

import ModalConfirmarSaida from "../../modals/ModalConfirmarSaida";

export default function Logout() {
  const [abrirModal, setAbrirModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbrirModal(true)}
        className=" px-4 py-2 cursor-pointer"
      >
       <FiLogOut  size={28} className="text-primary-50 transition-transform duration-200 hover:scale-115 hover:text-red-600 " />
       <p className="text-primary-50 ">Sair</p>
      </button>

      <ModalConfirmarSaida
        aberto={abrirModal}
        onClose={() => setAbrirModal(false)}
      />
    </>
  );
}