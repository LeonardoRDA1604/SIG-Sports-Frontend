import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoLockClosed } from "react-icons/io5";
import { temAcessoBloqueado } from "../../utils/permissoes";

import ModalCadastroAtleta from "../../modals/forms/ModalCadastroAtleta";
import ModalCadastroResponsavel from "../../modals/forms/ModalCadastroResponsavel";
import ModalCadastroTurma from "../../modals/forms/ModalCadastroTurma";
import ModalCadastroCategoria from "../../modals/forms/ModalCadastroCategoria";
import ModalCadastroModalidade from "../../modals/forms/ModalCadastroModalidade";
import ModalCadastroTreinador from "../../modals/forms/ModalCadastroTreinador";
import ModalCadastroInteressado from "../../modals/forms/ModalCadastroInteressado";

export default function BotaoAdicionar({ aba, label, onCreated, turmasGlobais = [], categoriasGlobais = []}) {
  // Estados para cada popup de novo cadastro (a partir do botão "Adicionar ...")
  const [abrirCadastroAtleta, setAbrirCadastroAtleta] = useState(false); // Adicionar Atleta
  const [abrirCadastroResponsavel, setAbrirCadastroResponsavel] =
    useState(false); // Adicionar Responsavel
  const [abrirCadastroTurma, setAbrirCadastroTurma] = useState(false); // Adicionar Turma
  const [abrirCadastroCategoria, setAbrirCadastroCategoria] = useState(false); // Adicionar Categoria
  const [abrirCadastroModalidade, setAbrirCadastroModalidade] = useState(false); // Adicionar Modalidade
  const [abrirCadastroTreinador, setAbrirCadastroTreinador] = useState(false); // Adicionar Treinador
  const [abrirCadastroInteressado, setAbrirCadastroInteressado] =
    useState(false); // Adicionar Interessado

  // Função para identificar a aba ativa para o botão "Adicionar ..." acessar o popup respectivo
  function abrirCadastro() {
    switch (aba) {
      case "atletas":
        setAbrirCadastroAtleta(true);
        break;
      case "responsaveis":
        setAbrirCadastroResponsavel(true);
        break;
      case "turmas":
        setAbrirCadastroTurma(true);
        break;
      case "categorias":
        setAbrirCadastroCategoria(true);
        break;
      case "modalidades":
        setAbrirCadastroModalidade(true);
        break;
      case "treinadores":
        setAbrirCadastroTreinador(true);
        break;
      case "interessados":
        setAbrirCadastroInteressado(true);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <button
        onClick={() => !temAcessoBloqueado() && abrirCadastro()}
        disabled={temAcessoBloqueado()}
        className={`w-full sm:w-auto flex items-center justify-center space-x-2 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 order-1 sm:order-2 ${
          temAcessoBloqueado()
            ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
            : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        }`}
        title={temAcessoBloqueado() ? "Treinadores não podem adicionar" : ""}
      >
        {temAcessoBloqueado() ? (
          <IoLockClosed className="text-3xl" />
        ) : (
          <IoIosAddCircleOutline className="text-3xl" />
        )}
        <span className="text-sm sm:text-base">Adicionar {label}</span>
      </button>

      <ModalCadastroAtleta
        aberto={abrirCadastroAtleta}
        onClose={() => setAbrirCadastroAtleta(false)}
        onSave={(data) => {
          onCreated?.("atletas", data);
        }}
        turmasGlobais={turmasGlobais}
    		categoriasGlobais={categoriasGlobais}
      />

      <ModalCadastroResponsavel
        aberto={abrirCadastroResponsavel}
        onClose={() => setAbrirCadastroResponsavel(false)}
        onSave={(data) => {
          onCreated?.("responsaveis", data);
        }}
      />

      <ModalCadastroTurma
        aberto={abrirCadastroTurma}
        onClose={() => setAbrirCadastroTurma(false)}
        onSave={(data) => {
          onCreated?.("turmas", data);
        }}
      />

      <ModalCadastroCategoria
        aberto={abrirCadastroCategoria}
        onClose={() => setAbrirCadastroCategoria(false)}
        onSave={(data) => {
          onCreated?.("categorias", data);
        }}
      />

      <ModalCadastroModalidade
        aberto={abrirCadastroModalidade}
        onClose={() => setAbrirCadastroModalidade(false)}
        onSave={(data) => {
          onCreated?.("modalidades", data);
        }}
      />

      <ModalCadastroTreinador
        aberto={abrirCadastroTreinador}
        onClose={() => setAbrirCadastroTreinador(false)}
        onSave={(data) => {
          onCreated?.("treinadores", data);
        }}
      />

      <ModalCadastroInteressado
        aberto={abrirCadastroInteressado}
        onClose={() => setAbrirCadastroInteressado(false)}
        onSave={(data) => {
          onCreated?.("interessados", data);
        }}
      />
    </>
  );
}
