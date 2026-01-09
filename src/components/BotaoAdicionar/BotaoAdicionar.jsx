import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

import ModalCadastroTurma from "../../modals/forms/ModalCadastroTurma";
/* import ModalCadastroCategoria from "../../modals/forms/ModalCadastroCategoria";
import ModalCadastroModalidade from "../../modals/forms/ModalCadastroModalidade"; */

export default function BotaoAdicionar({ aba, label }) {
  // Estados para cada popup de novo cadastro (a partir do botão "Adicionar ...")
  const [abrirCadastroTurma, setAbrirCadastroTurma] = useState(false); // Adicionar Turma
  /* const [abrirCadastroCategoria, setAbrirCadastroCategoria] = useState(false); // Adicionar Categoria
  const [abrirCadastroModalidade, setAbrirCadastroModalidade] = useState(false); // Adicionar Modalidade */

  // Função para identificar a aba ativa para o botão "Adicionar ..." acessar o popup respectivo
  function abrirCadastro() {
    switch(aba){
      case "turmas":
        setAbrirCadastroTurma(true);
        break;
      /* case "categorias":
        setAbrirCadastroCategoria(true);
        break;
      case "modalidades":
        setAbrirCadastroModalidade(true);
        break; */
      default:
        break;
    }
  };

  return (
    <>
      <button onClick={() => abrirCadastro()} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 order-1 sm:order-2 cursor-pointer">
        <IoIosAddCircleOutline className="text-3xl" />
        <span className="text-sm sm:text-base">Adicionar {label}</span>
      </button>

      <ModalCadastroTurma
        aberto={abrirCadastroTurma}
        onClose={() => setAbrirCadastroTurma(false)}
      />

      {/* <ModalCadastroCategoria
        aberto={abrirCadastroCategoria}
        onClose={() => setAbrirCadastroCategoria(false)}
      />

      <ModalCadastroModalidade
        aberto={abrirCadastroModalidade}
        onClose={() => setAbrirCadastroModalidade(false)}
      /> */}
    </>
  );
}