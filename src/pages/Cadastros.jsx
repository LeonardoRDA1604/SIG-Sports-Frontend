import { useState, useEffect } from "react";

import { FaUser } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaPersonChalkboard } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaTableList } from "react-icons/fa6";
import { FaRunning } from "react-icons/fa";
import { MdPersonAdd, MdAdd, MdSportsSoccer } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import BotaoAdicionar from "../components/BotaoAdicionar/BotaoAdicionar";
import { list, update, remove, create } from "../data/api";
import Layout from "../components/Navbar/Navbar";
import ModalCadastroInteressado from "../modals/forms/ModalCadastroInteressado";
import ModalCadastroAtleta from "../modals/forms/PlayerTemplateModal";
import EditPlayersModal from "../modals/views/EditPlayersModal";
import ModalCadastroResponsavel from "../modals/forms/ModalCadastroResponsavel";
import ModalCadastroTreinador from "../modals/forms/ModalCadastroTreinador";
import ModalCadastroTurma from "../modals/forms/ModalCadastroTurma";
import ModalCadastroCategoria from "../modals/forms/ModalCadastroCategoria";
import ModalCadastroModalidade from "../modals/forms/ModalCadastroModalidade";
import ModalCadastroUsuario from "../modals/forms/ModalCadastroUsuario";
import { temAcessoBloqueado } from "../utils/permissoes";
import DataTable from "../components/DataTable/DataTable";

import AnimatedTitle from "../modals/AnimatedTitle";
// Dados dos atletas
const athletesData = [];

// Dados dos responsáveis
const responsibleData = [];

// Dados dos treinadores
const coachData = [];

// Dados das Turmas
const classesData = [];

// Dados das Categorias
const categoriesData = [];

// Dados dos Interessados
const interestedData = [];

// Mapeamento das abas
const abas = [
  {
    id: "players",
    label: "Atletas",
    labelSingular: "Atleta",
    icon: <FaRunning />,
  },
  {
    id: "guardians",
    label: "Responsáveis",
    labelSingular: "Responsável",
    icon: <FaUserFriends />,
  },
  {
    id: "trainers",
    label: "Treinadores",
    labelSingular: "Treinador",
    icon: <FaPersonChalkboard />,
  },
  {
    id: "classes",
    label: "Turmas",
    labelSingular: "Turma",
    icon: <HiMiniUserGroup />,
  },
  {
    id: "categories",
    label: "Categorias",
    labelSingular: "Categoria",
    icon: <FaTableList />,
  },
  {
    id: "modalities",
    label: "Modalidades",
    labelSingular: "Modalidade",
    icon: <MdSportsSoccer />,
  },
  {
    id: "leads",
    label: "Interessados",
    labelSingular: "Interessado",
    icon: <MdPersonAdd />,
  },
  {
    id: "usuarios",
    label: "Usuários",
    labelSingular: "Usuário",
    icon: <FaUser />,
  },
];

const Cadastros = () => {
  // Função para formatar telefone para exibição: (XX) XXXXX-XXXX
  const formatarTelefoneExibicao = (telefone) => {
    if (!telefone) return "—";
    const apenasNumeros = telefone.replace(/\D/g, "");

    if (apenasNumeros.length !== 11) return telefone;

    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
      2,
      7,
    )}-${apenasNumeros.slice(7)}`;
  };

  const [abaAtiva, setAbaAtiva] = useState(() => {
    // Recuperar aba ativa do localStorage ou usar padrão
    return localStorage.getItem("abaPrincipalAtiva") || "players";
  });
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [buscarMobileAberto, setBuscarMobileAberto] = useState(false);
  const [players, setPlayers] = useState(athletesData);
  const [guardians, setGuardians] = useState(responsibleData);
  const [trainers, setTrainers] = useState(coachData);
  const [classes, setClasses] = useState(classesData);
  const [categories, setCategories] = useState(categoriesData);
  const [modalities, setModalities] = useState([]);
  const [leads, setLeads] = useState(interestedData);
  const [usuarios, setUsuarios] = useState([]);
  const [abrirModalUsuario, setAbrirModalUsuario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [formDataUsuario, setFormDataUsuario] = useState({
    name: "",
    email: "",
    birthDate: "",
    cpf: "",
    rg: "",
    role: "",
    status: "Ativo",
    password: "",
    phone: "",
  });
  const [confirmDeleteUsuario, setConfirmDeleteUsuario] = useState({
    aberto: false,
    usuarioId: null,
    usuarioNome: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    aberto: false,
    recurso: null,
    id: null,
    nome: null,
  });

  // Estados para abrir os modais de edição
  const [abrirCadastroAtleta, setAbrirCadastroAtleta] = useState(false);
  const [abrirCadastroResponsavel, setAbrirCadastroResponsavel] =
    useState(false);
  const [abrirCadastroTreinador, setAbrirCadastroTreinador] = useState(false);
  const [abrirCadastroTurma, setAbrirCadastroTurma] = useState(false);
  const [abrirCadastroCategoria, setAbrirCadastroCategoria] = useState(false);
  const [abrirCadastroModalidade, setAbrirCadastroModalidade] = useState(false);
  const [abrirCadastroInteressado, setAbrirCadastroInteressado] =
    useState(false);

  // Estado para armazenar o item sendo editado
  const [itemEditando, setItemEditando] = useState(null);

  // Estado para visualizar atleta
  const [abrirVisualizarAtleta, setAbrirVisualizarAtleta] = useState(false);
  const [atletaSelecionado, setAtletaSelecionado] = useState(null);

  // Verificar se o usuário é administrador
  const usuarioAtual = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isAdmin = usuarioAtual.role === "Administrador";

  // Carregar dados do servidor ao montar
  useEffect(() => {
    Promise.all([
      list("players"),
      list("guardians"),
      list("trainers"),
      list("classes"),
      list("categories"),
      list("leads"),
      list("modalities"),
      list("users"),
    ])
      .then(([a, r, t, tu, c, i, m, u]) => {
        if (Array.isArray(a) && a.length) {
          console.log("[DEBUG] Atletas carregados:", a);
          setPlayers(a);
        }
        if (Array.isArray(r) && r.length) setGuardians(r);
        if (Array.isArray(t) && t.length) setTrainers(t);
        if (Array.isArray(tu) && tu.length) setClasses(tu);
        if (Array.isArray(c) && c.length) setCategories(c);
        if (Array.isArray(i) && i.length) setLeads(i);
        if (Array.isArray(m) && m.length) setModalities(m);
        if (Array.isArray(u) && u.length) {
          console.log("[DEBUG] Usuários carregados:", u);
          setUsuarios(u);
        }
      })
      .catch(() => {});
  }, []);

  // Salvar aba ativa no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("abaPrincipalAtiva", abaAtiva);
  }, [abaAtiva]);

  // Lógica de Filtragem de Atletas
  const athletesFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "players"
      ? players.filter((athlete) =>
          athlete.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : players;

  // Lógica de Filtragem de Responsáveis
  const responsibleFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "guardians"
      ? guardians.filter((responsible) =>
          responsible.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : guardians;

  // Lógica de Filtragem de Treinadores
  const coachFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "trainers"
      ? trainers.filter((coach) =>
          coach.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : trainers;

  // Lógica de Filtragem de Turmas
  const classesFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "classes"
      ? classes.filter((classe) =>
          classe.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : classes;

  // Lógica de Filtragem de Categorias
  const categoriesFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "categories"
      ? categories.filter((category) =>
          category.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : categories;

  // Lógica de Filtragem de Modalidades
  const modalitiesFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "modalities"
      ? modalities.filter((modality) =>
          modality.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : modalities;

  // Lógica de Filtragem de Interessados
  const interessadosFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "leads"
      ? leads.filter((interested) =>
          interested.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : leads;

  // Lógica de Filtragem de Usuários
  const usuariosFiltrados =
    termoPesquisa.length > 0 && abaAtiva === "usuarios"
      ? usuarios.filter((user) =>
          user.name.toLowerCase().includes(termoPesquisa.toLowerCase()),
        )
      : usuarios;

  const handleCreated = async (resource, data) => {
    try {
      console.log(`Salvando ${resource}:`, data);
      // Adiciona datas ao cadastrar qualquer recurso
      let dataToSend = { ...data };
      const now = new Date().toISOString();
      if (!data.entry_date) dataToSend.entry_date = now;
      dataToSend.updated_at = now;
      const saved = await create(resource, dataToSend);
      console.log(`${resource} salvo com sucesso:`, saved);

      if (resource === "players") setPlayers((prev) => [...prev, saved]);
      if (resource === "guardians") setGuardians((prev) => [...prev, saved]);
      if (resource === "trainers")
        setTrainers((prev) => [
          ...prev.filter((t) => t.id !== saved.id),
          saved,
        ]);
      if (resource === "classes") setClasses((prev) => [...prev, saved]);
      if (resource === "categories") setCategories((prev) => [...prev, saved]);
      if (resource === "modalities") setModalities((prev) => [...prev, saved]);
      if (resource === "leads") setLeads((prev) => [...prev, saved]);

      alert(`${resource} cadastrado com sucesso!`);
    } catch (e) {
      console.error("Erro ao salvar", resource, e);
      alert(`Erro ao cadastrar: ${e.message}`);
    }
  };

  const handleDeleteClick = (recurso, id, nome) => {
    if (!isAdmin) {
      alert("Apenas administradores podem deletar itens");
      return;
    }
    setConfirmDelete({
      aberto: true,
      recurso,
      id,
      nome,
    });
  };

  const handleConfirmDelete = async () => {
    const { recurso, id } = confirmDelete;

    // Mapear nomes do frontend para nomes do backend
    const recursoMap = {
      players: "players",
      guardians: "guardians",
      trainers: "trainers",
      classes: "classes",
      categories: "categories",
      modalities: "modalities",
      leads: "leads",
    };

    const recursoBackend = recursoMap[recurso] || recurso;

    if (!id) {
      alert("Erro: ID não encontrado. Tente novamente.");
      setConfirmDelete({ aberto: false, recurso: null, id: null, nome: null });
      return;
    }

    try {
      console.log(`Deletando ${recurso} (${recursoBackend}) com ID:`, id);
      await remove(recursoBackend, id);
      console.log(`${recurso} deletado com sucesso`);

      if (recurso === "players")
        setPlayers((prev) => prev.filter((item) => item.id !== id));
      if (recurso === "guardians")
        setGuardians((prev) => prev.filter((item) => item.id !== id));
      if (recurso === "trainers")
        setTrainers((prev) => prev.filter((item) => item.id !== id));
      if (recurso === "classes")
        setClasses((prev) => prev.filter((item) => item.id !== id));
      if (recurso === "categories")
        setCategories((prev) => prev.filter((item) => item.id !== id));
      if (recurso === "modalities")
        setModalities((prev) => prev.filter((item) => item.id !== id));
      if (recurso === "leads") {
        // Atualiza a lista de leads do backend para garantir sincronização
        const leadsAtualizados = await list("leads");
        setLeads(Array.isArray(leadsAtualizados) ? leadsAtualizados : []);
      }

      alert(`${recurso} deletado com sucesso!`);
      setConfirmDelete({ aberto: false, recurso: null, id: null, nome: null });
    } catch (e) {
      console.error("Erro ao deletar", recurso, e);
      alert(`Erro ao deletar: ${e.message}`);
    }
  };

  // Funções para gerenciar Usuários
  const abrirModalAdicionarUsuario = () => {
    if (!isAdmin) {
      alert("Apenas administradores podem gerenciar usuários");
      return;
    }
    setEditandoUsuario(null);
    setFormDataUsuario({
      name: "",
      email: "",
      birthDate: "",
      cpf: "",
      rg: "",
      role: "",
      status: "Ativo",
      password: "",
      phone: "",
    });
    setAbrirModalUsuario(true);
  };

  const abrirModalEditarUsuario = (usuario) => {
    if (!isAdmin) {
      alert("Apenas administradores podem editar usuários");
      return;
    }
    console.log("Usuário selecionado para edição:", usuario);
    setEditandoUsuario(usuario);
    setFormDataUsuario({
      name: usuario.name,
      email: usuario.email,
      birthDate: usuario.birthDate || usuario.birth_date || "",
      cpf: usuario.cpf || "",
      rg: usuario.rg || "",
      role: usuario.role,
      status: usuario.status || "Ativo",
      password: "",
      phone: usuario.phone || "",
    });
    console.log("FormData setado:", { phone: usuario.phone || "" });
    setAbrirModalUsuario(true);
  };

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    // Formatar CPF
    if (name === "cpf") {
      // Remove tudo que não é número
      const apenasNumeros = value.replace(/\D/g, "");

      // Limita a 11 dígitos
      if (apenasNumeros.length > 11) {
        return;
      }

      // Formata conforme vai digitando: XXX.XXX.XXX-XX
      if (apenasNumeros.length <= 3) {
        novoValor = apenasNumeros;
      } else if (apenasNumeros.length <= 6) {
        novoValor = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
      } else if (apenasNumeros.length <= 9) {
        novoValor = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(
          3,
          6,
        )}.${apenasNumeros.slice(6)}`;
      } else {
        novoValor = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(
          3,
          6,
        )}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
      }
    }

    // Formatar RG
    if (name === "rg") {
      // Remove tudo que não é número
      const apenasNumeros = value.replace(/\D/g, "");

      // Limita a 7 dígitos
      if (apenasNumeros.length > 7) {
        return;
      }

      // Formata conforme vai digitando: XXX.XXX.X
      if (apenasNumeros.length <= 3) {
        novoValor = apenasNumeros;
      } else if (apenasNumeros.length <= 6) {
        novoValor = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
      } else {
        novoValor = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(
          3,
          6,
        )}.${apenasNumeros.slice(6)}`;
      }
    }

    // Formatar telefone
    if (name === "phone") {
      // Remove tudo que não é número
      const apenasNumeros = value.replace(/\D/g, "");

      // Limita a 11 dígitos (padrão brasileiro)
      if (apenasNumeros.length > 11) {
        return;
      }

      // Formata conforme vai digitando
      if (apenasNumeros.length <= 2) {
        novoValor = apenasNumeros;
      } else if (apenasNumeros.length <= 7) {
        novoValor = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
      } else {
        novoValor = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
          2,
          7,
        )}-${apenasNumeros.slice(7, 11)}`;
      }
    }

    setFormDataUsuario((prev) => ({
      ...prev,
      [name]: novoValor,
    }));
  };

  // Validar força da senha
  const validarSenha = (senha) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
    const temComprimento = senha.length >= 8;

    return (
      temMaiuscula && temMinuscula && temNumero && temEspecial && temComprimento
    );
  };

  const handleSalvarUsuario = async () => {
    console.log("Valor de birthDate ao salvar:", formDataUsuario.birthDate);
    if (
      !formDataUsuario.name ||
      !formDataUsuario.email ||
      !formDataUsuario.birthDate ||
      !formDataUsuario.cpf ||
      !formDataUsuario.role ||
      !formDataUsuario.status
    ) {
      alert(
        "Nome, email, data de nascimento, CPF, função e status são obrigatórios",
      );
      return;
    }

    if (!editandoUsuario && !formDataUsuario.password) {
      alert("Senha é obrigatória para criar novo usuário");
      return;
    }

    // Validar força da senha apenas para novo usuário
    if (!editandoUsuario && formDataUsuario.password) {
      if (!validarSenha(formDataUsuario.password)) {
        alert(
          "Senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial",
        );
        return;
      }
    }

    // Se está editando e mudou a senha, validar a nova senha
    if (editandoUsuario && formDataUsuario.password) {
      if (!validarSenha(formDataUsuario.password)) {
        alert(
          "Senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial",
        );
        return;
      }
    }

    try {
      if (editandoUsuario) {
        // Atualizar usuário
        const dataToUpdate = {
          name: formDataUsuario.name,
          email: formDataUsuario.email,
          birthDate: formDataUsuario.birthDate,
          cpf: formDataUsuario.cpf.replace(/\D/g, ""), // Remove formatação
          rg: formDataUsuario.rg.replace(/\D/g, ""), // Remove formatação
          role: formDataUsuario.role,
          status: formDataUsuario.status,
          phone: formDataUsuario.phone.replace(/\D/g, ""), // Remove formatação
        };
        if (formDataUsuario.password) {
          dataToUpdate.password = formDataUsuario.password;
        }
        const updated = await update("users", editandoUsuario.id, dataToUpdate);
        // Mapear os dados retornados da API para o formato esperado
        const usuarioMapeado = {
          id: updated.id || editandoUsuario.id,
          name: updated.name,
          email: updated.email,
          birth_date: updated.birth_date || updated.birthDate,
          birthDate: updated.birth_date || updated.birthDate,
          cpf: updated.cpf,
          rg: updated.rg,
          role: updated.role,
          status: updated.status,
          phone: updated.phone,
          entry_date: updated.entry_date,
          created_at: updated.created_at,
          updated_at: updated.updated_at,
        };
        console.log("Usuário mapeado:", usuarioMapeado);
        setUsuarios((prev) => {
          const updated_array = prev.map((u) =>
            u.id === editandoUsuario.id ? usuarioMapeado : u,
          );
          console.log("Array após update:", updated_array);
          return updated_array;
        });
        alert("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        const now = new Date().toISOString();
        const dataToCreate = {
          name: formDataUsuario.name,
          email: formDataUsuario.email,
          birthDate: formDataUsuario.birthDate,
          cpf: formDataUsuario.cpf.replace(/\D/g, ""), // Remove formatação
          rg: formDataUsuario.rg.replace(/\D/g, ""), // Remove formatação
          role: formDataUsuario.role,
          status: formDataUsuario.status,
          password: formDataUsuario.password,
          phone: formDataUsuario.phone.replace(/\D/g, ""), // Remove formatação
          entry_date: now,
          updated_at: now,
        };
        console.log("Enviando dados para criar usuário:", dataToCreate);
        await create("users", dataToCreate);
        const usuariosAtualizados = await list("users");
        setUsuarios(usuariosAtualizados);
        alert("Usuário criado com sucesso!");
      }
      setAbrirModalUsuario(false);
      setFormDataUsuario({
        name: "",
        email: "",
        birthDate: "",
        cpf: "",
        rg: "",
        role: "",
        status: "Ativo",
        password: "",
        phone: "",
      });
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert(`Erro ao salvar usuário: ${error.message}`);
    }
  };

  const handleDeleteClickUsuario = (usuarioId, usuarioNome) => {
    if (!isAdmin) {
      alert("Apenas administradores podem deletar usuários");
      return;
    }
    setConfirmDeleteUsuario({
      aberto: true,
      usuarioId,
      usuarioNome,
    });
  };

  const handleConfirmDeleteUsuario = async () => {
    try {
      await remove("users", confirmDeleteUsuario.usuarioId);
      setUsuarios((prev) =>
        prev.filter((u) => u.id !== confirmDeleteUsuario.usuarioId),
      );
      alert("Usuário deletado com sucesso!");
      setConfirmDeleteUsuario({
        aberto: false,
        usuarioId: null,
        usuarioNome: "",
      });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert(`Erro ao deletar usuário: ${error.message}`);
    }
  };

  // Funções de mapeamento para transformar dados da tabela no formato esperado pelos modais
  const mapearDados = (recurso, item) => {
    switch (recurso) {
      case "usuarios":
        return {
          id: item.id,
          name: item.name || "",
          email: item.email || "",
          cpf: item.cpf || "",
          rg: item.rg || "",
          role: item.role || "",
          status: item.status || "",
          phone: item.phone || "",
          birthDate: item.birthDate || item.birth_date || "",
          entry_date: item.entry_date || item.created_at || "",
          updated_at: item.updated_at || "",
        };
      case "players":
        return {
          id: item.id,
          nome: item.name || "",
          nascimento: item.nascimento || "",
          cpf: item.cpf || "",
          rg: item.rg || "",
          escola: item.escola || "",
          modalidade: item.modalidade || "",
          categoria: item.category || "",
          turma: item.classes || "",
          cep: item.cep || "",
          bairro: item.bairro || "",
          cidade: item.cidade || "",
          uf: item.uf || "",
          logradouro: item.logradouro || "",
          complemento: item.complemento || "",
          observacoes: item.observacoes || "",
          respCpf: item.respCpf || "",
          respNome: item.respNome || "",
          respEmail: item.respEmail || "",
          respTelefone: item.respTelefone || "",
          respParentesco: item.respParentesco || "",
          respCep: item.respCep || "",
          respBairro: item.respBairro || "",
          respCidade: item.respCidade || "",
          respUf: item.respUf || "",
          respLogradouro: item.respLogradouro || "",
          respComplemento: item.respComplemento || "",
        };
      case "guardians":
        return {
          id: item.id,
          nome: item.name || "",
          cpf: item.cpf || "",
          email: item.email || "",
          telefone: item.phoneNumber || "",
          nomeAtleta: item.athletes?.[0] || "",
          parentesco: item.kinship || "",
          cep: item.cep || "",
          bairro: item.bairro || "",
          cidade: item.cidade || "",
          uf: item.uf || "",
          logradouro: item.logradouro || "",
          complemento: item.complemento || "",
        };
      case "trainers":
        return {
          id: item.id,
          nome: item.name || "",
          cpf: item.cpf || "",
          email: item.email || "",
          telefone: item.PhoneNumber || item.phoneNumber || "",
          cep: item.cep || "",
          bairro: item.bairro || "",
          cidade: item.cidade || "",
          uf: item.uf || "",
          logradouro: item.logradouro || "",
          complemento: item.complemento || "",
          turmas: item.classes || [],
          horarios: item.workTimes || [],
        };
      case "classes":
        return {
          id: item.id,
          nomeTurma: item.name || "",
          categoria: item.category || "",
          modalidade: item.modality || "",
          treinador: item.coach || "",
          horarios: item.workTimes || [],
        };
      case "categories":
        return {
          id: item.id,
          nomeCategoria: item.name || "",
        };
      case "modalities":
        return {
          id: item.id,
          nomeModalidade: item.name || "",
        };
      case "leads":
        return {
          id: item.id,
          nome: item.name || "",
          email: item.email || "",
          telefone: item.phone || item.phoneNumber || "",
          modalidade: item.source || "",
          dataInsercao: item.dataInsercao || "",
        };
      default:
        return item;
    }
  };

  const handleEditClick = (recurso, item) => {
    if (!isAdmin) {
      alert("Apenas administradores podem editar itens");
      return;
    }
    const dadosMapeados = mapearDados(recurso, item);
    setItemEditando(dadosMapeados);
    if (recurso === "players") setAbrirCadastroAtleta(true);
    else if (recurso === "guardians") setAbrirCadastroResponsavel(true);
    else if (recurso === "trainers") setAbrirCadastroTreinador(true);
    else if (recurso === "classes") setAbrirCadastroTurma(true);
    else if (recurso === "categories") setAbrirCadastroCategoria(true);
    else if (recurso === "modalities") setAbrirCadastroModalidade(true);
    else if (recurso === "leads") setAbrirCadastroInteressado(true);
  };

  // Componente para Itens de Aba
  const TabItem = ({ id, label, icon }) => {
    const isActive = abaAtiva === id;
    const activeClasses = "text-white bg-blue-600 font-semibold ";
    const inactiveClasses =
      "text-white hover:bg-primary-800 hover:text-primary-200 cursor-pointer";

    return (
      <button
        key={id}
        className={`w-full flex flex-col sm:flex-row items-center justify-center space-y-0 sm:space-y-0 sm:space-x-2 px-1 sm:px-2 md:px-3 py-2 sm:py-3 md:py-4 text-xs sm:text-sm whitespace-nowrap transition duration-150 ${
          isActive ? activeClasses : inactiveClasses
        }`}
        onClick={() => {
          setAbaAtiva(id); // Muda a aba ativa
          setTermoPesquisa(""); // Reseta o termo de pesquisa ao mudar de aba
          window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll para o topo
        }}
      >
        <span className="text-2xl sm:text-lg md:text-xl">{icon}</span>
        <span className="hidden lg:inline">{label}</span>
      </button>
    );
  };

  return (
    <Layout
      title="Cadastros"
      subtitle="Gerencie atletas, responsáveis, treinadores, turmas, categorias e modalidades."
    >
      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Abas Fixas - Apenas Desktop */}
        <div className="hidden lg:flex flex-col flex-1 overflow-hidden w-full max-h-max relative z-10 ">
          {/* Navegação por Abas */}
          <div className="flex bg-primary-900 border-b border-gray-200 scrollbar-hide min-h-min relative z-20 w-full overflow-x-hidden overflow-y-hidden">
            {abas.map((aba, index) => (
              <div key={aba.id} className="flex flex-1 items-stretch">
                <TabItem {...aba} />
                {index < abas.length - 1 && (
                  <div className="w-px bg-white/20"></div>
                )}
              </div>
            ))}
          </div>

          {/* Área de Ações (Pesquisa e Novo Item) */}
          <div className="flex flex-col gap-1.5 sm:gap-2.5 px-6 sm:px-8 md:px-10 lg:px-20 py-2 sm:py-2.5 md:py-3 bg-white shadow-lg sm:flex-row sm:justify-between sm:items-center lg:grid lg:grid-cols-[minmax(0,1.5fr)_auto] lg:items-center relative z-20 w-full">
            {/* Barra de Pesquisa */}
            <div className="relative w-full sm:max-w-sm order-2 sm:order-1 lg:order-0 lg:justify-self-stretch">
              <input
                type="text"
                placeholder={`Buscar ${
                  abas.find((a) => a.id === abaAtiva)?.label
                }...`}
                className="w-full pl-10 sm:pl-11 pr-12 sm:pr-13 py-2.5 sm:py-3 border-2 border-gray-200 bg-white focus:outline-none focus:border-primary-400 text-xs sm:text-sm font-medium placeholder:text-gray-400 transition-all duration-300 rounded-full shadow-sm hover:shadow-md focus:shadow-md focus:shadow-primary-100 hover:border-gray-300"
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
              />
              {/* Ícone de Busca (Lupa) */}
              <svg
                className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              {/* Botão de Pesquisar */}
              <button
                className="absolute right-2 top-2 bottom-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2.5 rounded-full transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center"
                title="Pesquisar"
              >
                Pesquisar
              </button>
            </div>

            {/* Botão Adicionar Novo Item */}
            {abaAtiva === "usuarios" ? (
              isAdmin ? (
                <button
                  onClick={abrirModalAdicionarUsuario}
                  className={`w-full sm:w-auto flex items-center justify-center space-x-2 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 order-1 sm:order-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer text-xs sm:text-sm`}
                >
                  <MdAdd className="text-3xl" />
                  <span>Adicionar Usuário</span>
                </button>
              ) : (
                <div className="text-xs text-gray-500 italic p-2">
                  Apenas administradores podem adicionar itens
                </div>
              )
            ) : isAdmin ? (
              <BotaoAdicionar
                aba={abaAtiva}
                label={abas.find((a) => a.id === abaAtiva)?.labelSingular}
                onCreated={handleCreated}
                modalidades={modalities}
              />
            ) : (
              <div className="text-xs text-gray-500 italic p-2">
                Apenas administradores podem adicionar itens
              </div>
            )}
          </div>
        </div>

        {/* 4. CONTEÚDO: Tabela/Dados */}
        <div className="flex-1 overflow-hidden flex flex-col w-full">
          {/* Título da Aba Ativa - Mobile até 1023px */}
          <div className="lg:hidden pt-5 pb-3 px-6 bg-primary-100 flex items-center justify-between gap-6">
            {!buscarMobileAberto ? (
              <>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-3xl text-primary-900 shrink-0">
                    {abas.find((a) => a.id === abaAtiva)?.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-primary-900 truncate">
                    {abas.find((a) => a.id === abaAtiva)?.label || "Cadastros"}
                  </h2>
                </div>

                <button
                  onClick={() => setBuscarMobileAberto(true)}
                  className="flex items-center justify-center text-primary-900 hover:text-primary-700 transition shrink-0"
                  title="Buscar"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>

                {/* Botão Adicionar - Mobile */}
                {abaAtiva === "usuarios" ? (
                  isAdmin ? (
                    <button
                      onClick={abrirModalAdicionarUsuario}
                      className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded p-2.5 transition shrink-0"
                      title="Adicionar Usuário"
                    >
                      <MdAdd className="text-2xl" />
                    </button>
                  ) : null
                ) : isAdmin ? (
                  <button
                    onClick={() => {
                      if (abaAtiva === "players") setAbrirCadastroAtleta(true);
                      else if (abaAtiva === "guardians")
                        setAbrirCadastroResponsavel(true);
                      else if (abaAtiva === "trainers")
                        setAbrirCadastroTreinador(true);
                      else if (abaAtiva === "classes")
                        setAbrirCadastroTurma(true);
                      else if (abaAtiva === "categories")
                        setAbrirCadastroCategoria(true);
                      else if (abaAtiva === "modalities")
                        setAbrirCadastroModalidade(true);
                      else if (abaAtiva === "leads")
                        setAbrirCadastroInteressado(true);
                    }}
                    className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded p-2.5 transition shrink-0"
                    title={`Adicionar ${
                      abas.find((a) => a.id === abaAtiva)?.labelSingular
                    }`}
                  >
                    <MdAdd className="text-2xl" />
                  </button>
                ) : null}
              </>
            ) : (
              <div className="relative w-full flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Buscar ${
                      abas.find((a) => a.id === abaAtiva)?.label
                    }...`}
                    className="w-full pl-12 pr-14 py-3.5 bg-white border-2 border-gray-200 focus:outline-none focus:border-primary-400 text-sm font-medium placeholder:text-gray-400 transition-all duration-300 rounded-full shadow-sm hover:shadow-md focus:shadow-md focus:shadow-primary-100 hover:border-gray-300"
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    autoFocus
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  {/* Botão de Pesquisar */}
                  <button
                    className="absolute right-2 top-2 bottom-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2.5 rounded-full transition-colors duration-200 text-sm font-medium flex items-center"
                    title="Pesquisar"
                  >
                    Pesquisar
                  </button>
                </div>
                <button
                  onClick={() => {
                    setBuscarMobileAberto(false);
                    setTermoPesquisa("");
                  }}
                  className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition shrink-0"
                  title="Fechar busca"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="shadow-xl w-full">
            <div className="overflow-x-auto w-full">
              {/* Tabela Atletas */}
              {abaAtiva === "players" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                      render: (value, row) => (
                        <button
                          onClick={async () => {
                            // Buscar dados completos do atleta no backend
                            try {
                              const atletaBackend = await list(
                                `players/${row.id}`,
                              );
                              setAtletaSelecionado(atletaBackend);
                              setAbrirVisualizarAtleta(true);
                            } catch (e) {
                              alert("Erro ao buscar dados do atleta");
                            }
                          }}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {value}
                        </button>
                      ),
                    },
                    { key: "age", label: "Idade" },
                    {
                      key: "responsaveis",
                      label: "Responsáveis",
                      render: (value, row) => {
                        if (
                          Array.isArray(row.responsaveis) &&
                          row.responsaveis.length > 0
                        ) {
                          return (
                            <ul className="space-y-1">
                              {row.responsaveis.map((resp, idx) => (
                                <li key={idx} className="text-xs text-gray-700">
                                  <span className="font-semibold">
                                    {resp.respNome}
                                  </span>
                                  {resp.respParentesco && (
                                    <span className="ml-1 text-gray-500">
                                      ({resp.respParentesco})
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        // fallback para dados antigos
                        if (row.respNome) {
                          return (
                            <span className="text-xs text-gray-700 font-semibold">
                              {row.respNome}
                            </span>
                          );
                        }
                        return <span className="text-gray-400">—</span>;
                      },
                    },
                    {
                      key: "modalidade",
                      label: "Modalidade",
                      render: (value) => {
                        const modalidade = modalities.find(
                          (m) =>
                            String(m.id) === String(value) ||
                            m.nome === value ||
                            m.name === value,
                        );
                        return modalidade
                          ? modalidade.nome || modalidade.name
                          : value || "—";
                      },
                    },
                    {
                      key: "weigth",
                      label: "Peso (kg)",
                    },
                    {
                      key: "heigth",
                      label: "Altura (cm)",
                    },
                    {
                      key: "primary_position",
                      label: "Posição Primária",
                    },
                    {
                      key: "second_position",
                      label: "Posição Secundária",
                    },
                    {
                      key: "dominant_foot",
                      label: "Pé Dominante",
                    },
                    {
                      key: "sport_status",
                      label: "Status",
                    },
                    {
                      key: "user_id",
                      label: "Usuário Responsável",
                      render: (value, row) => {
                        // Busca sempre pelo id do usuário
                        const usuario = usuarios.find(
                          (u) => String(u.id) === String(row.user_id),
                        );
                        return usuario
                          ? usuario.nome || usuario.name || usuario.email
                          : row.user_id || "—";
                      },
                    },
                    {
                      key: "category",
                      label: "Categoria",
                      render: (value, row) => {
                        const categoria = categories.find(
                          (c) =>
                            String(c.id) === String(row.category) ||
                            c.nome === row.category ||
                            c.name === row.category,
                        );
                        return categoria
                          ? categoria.nome || categoria.name
                          : row.category || "—";
                      },
                    },
                    {
                      key: "classes",
                      label: "Turma",
                      render: (value) => {
                        const turma = classes.find(
                          (t) =>
                            String(t.id) === String(value) ||
                            t.nome === value ||
                            t.name === value,
                        );
                        return turma ? turma.nome || turma.name : value || "—";
                      },
                    },
                    {
                      key: "updated_at",
                      label: "Modificado em",
                      render: (value, row) =>
                        row.updated_at
                          ? new Date(row.updated_at).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "America/Recife",
                            })
                          : "—",
                    },
                    {
                      key: "entry_date",
                      label: "Cadastrado em",
                      render: (value, row) =>
                        row.entry_date
                          ? new Date(row.entry_date).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "America/Recife",
                            })
                          : "—",
                    },
                  ]}
                  data={athletesFiltrados.map((a) => {
                    let responsaveis = a.responsaveis;
                    // Se vier como string JSON, faz o parse
                    if (typeof responsaveis === "string") {
                      try {
                        responsaveis = JSON.parse(responsaveis);
                      } catch {
                        responsaveis = [];
                      }
                    }
                    return {
                      ...a,
                      responsaveis,
                      entry_date: a.entry_date,
                      updated_at: a.updated_at,
                      age:
                        a.age ??
                        (a.nascimento
                          ? Math.floor(
                              (new Date() - new Date(a.nascimento)) /
                                (365.25 * 24 * 60 * 60 * 1000),
                            )
                          : "—"),
                      modalidade: a.modalidade || a.modality || "—",
                      user_id: a.user_id || a.userId || "—",
                      category: a.category || a.categoria || "—",
                      respNome: a.respNome || a.responsavel || "—",
                      weigth: a.weigth ?? "—",
                      heigth: a.heigth ?? "—",
                      primary_position: a.primary_position || "—",
                      second_position: a.second_position || "—",
                      dominant_foot: a.dominant_foot || "—",
                      sport_status: a.sport_status || "—",
                    };
                  })}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("players", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhum atleta encontrado com o termo "${termoPesquisa}".`
                      : "Nenhum atleta cadastrado."
                  }
                />
              )}

              {/* Conteúdo para Abas RESPONSAVEIS */}
              {abaAtiva === "guardians" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                      render: (value) => (
                        <a href="#" className="text-blue-600 hover:underline">
                          {value}
                        </a>
                      ),
                    },
                    {
                      key: "athletes",
                      label: "Atletas",
                      render: (value) => value.join(", "),
                    },
                    {
                      key: "kinship",
                      label: "Parentesco",
                    },
                    {
                      key: "phoneNumber",
                      label: "Telefone",
                      render: (value) => (
                        <a href="#" className="text-blue-600 hover:underline">
                          {value}
                        </a>
                      ),
                    },
                  ]}
                  data={responsibleFiltrados}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("guardians", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhum responsável encontrado com o termo "${termoPesquisa}".`
                      : "Nenhum responsável cadastrado."
                  }
                />
              )}

              {/* Conteúdo para Aba Treinador */}
              {abaAtiva === "trainers" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                      render: (value, row) => (
                        <button
                          onClick={() => {
                            setItemEditando(row);
                            setAbrirCadastroTreinador(true);
                          }}
                          className="text-blue-600 hover:underline cursor-pointer font-medium"
                        >
                          {value || "-"}
                        </button>
                      ),
                    },
                    {
                      key: "phone",
                      label: "Telefone",
                    },
                    {
                      key: "license_level",
                      label: "Nível",
                      render: (value) => (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {value || "-"}
                        </span>
                      ),
                    },
                    {
                      key: "specialty",
                      label: "Especialidade",
                    },
                  ]}
                  data={coachFiltrados.map((t) => {
                    const usuario = usuarios.find(
                      (u) => String(u.id) === String(t.user_id),
                    );
                    return {
                      ...t,
                      name: usuario?.name || usuario?.nome || "-",
                      phone: usuario?.phone || "-",
                    };
                  })}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("trainers", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhum treinador encontrado com o termo "${termoPesquisa}".`
                      : "Nenhum treinador cadastrado."
                  }
                />
              )}

              {/* Conteúdo para Abas TURMAS */}
              {abaAtiva === "classes" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                    },
                    {
                      key: "weekdays",
                      label: "Dias da Semana",
                    },
                    {
                      key: "schedule",
                      label: "Horário",
                      render: (value) =>
                        value
                          ? new Date(value).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-",
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (value) => (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            value === "Ativa"
                              ? "bg-green-100 text-green-800"
                              : value === "Inativa"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {value}
                        </span>
                      ),
                    },
                    {
                      key: "modality",
                      label: "Modalidade",
                      render: (value) => value || "-",
                    },
                    {
                      key: "category",
                      label: "Categoria",
                      render: (value) => value || "-",
                    },
                    {
                      key: "trainer",
                      label: "Treinador",
                      render: (value) => value || "-",
                    },
                  ]}
                  data={classesFiltrados}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("classes", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhuma turma encontrada com o termo "${termoPesquisa}".`
                      : "Nenhuma turma cadastrada."
                  }
                />
              )}

              {/* Conteúdo para Abas CATEGORIAS */}
              {abaAtiva === "categories" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                      render: (value) => (
                        <a
                          href="#"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {value}
                        </a>
                      ),
                    },
                    {
                      key: "min_age",
                      label: "Idade Mínima",
                      render: (value) => value ?? "-",
                    },
                    {
                      key: "max_age",
                      label: "Idade Máxima",
                      render: (value) => value ?? "-",
                    },
                  ]}
                  data={categoriesFiltrados}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("categories", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhuma categoria encontrada com o termo "${termoPesquisa}".`
                      : "Nenhuma categoria cadastrada."
                  }
                />
              )}

              {/* Conteúdo para Abas MODALIDADES */}
              {abaAtiva === "modalities" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                      render: (value, row) => (
                        <button
                          onClick={() => {
                            setItemEditando(row);
                            setAbrirCadastroModalidade(true);
                          }}
                          className="text-blue-600 hover:underline cursor-pointer font-medium bg-none border-none p-0"
                        >
                          {value}
                        </button>
                      ),
                    },
                  ]}
                  data={modalitiesFiltrados}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("modalities", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhuma modalidade encontrada com o termo "${termoPesquisa}".`
                      : "Nenhuma modalidade cadastrada."
                  }
                />
              )}

              {/* Conteúdo para Abas INTERESSADOS */}
              {abaAtiva === "leads" && (
                <DataTable
                  columns={[
                    {
                      key: "name",
                      label: "Nome",
                      isNameColumn: true,
                      render: (value, row) => (
                        <button
                          onClick={() => handleEditClick("leads", row)}
                          className="text-blue-600 hover:underline cursor-pointer font-medium"
                        >
                          {value}
                        </button>
                      ),
                    },
                    {
                      key: "email",
                      label: "E-mail",
                    },
                    {
                      key: "phone",
                      label: "Telefone",
                      render: (value, row) => (
                        <a href="#" className="text-blue-600 hover:underline">
                          {value || row.phoneNumber}
                        </a>
                      ),
                    },
                    {
                      key: "source",
                      label: "Modalidade",
                    },
                    {
                      key: "entry_date",
                      label: "Data de Entrada",
                      render: (value) =>
                        value ? new Date(value).toLocaleString("pt-BR") : "-",
                    },
                    {
                      key: "status",
                      label: "Status",
                    },
                  ]}
                  data={interessadosFiltrados}
                  renderActions={(row) => (
                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        handleDeleteClick("leads", row.id, row.name)
                      }
                      className={`transition-colors cursor-pointer ${
                        !isAdmin
                          ? "opacity-50 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title={
                        isAdmin
                          ? "Deletar"
                          : "Apenas administradores podem deletar"
                      }
                    >
                      {!isAdmin ? (
                        <IoLockClosed size={18} />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </button>
                  )}
                  emptyMessage={
                    termoPesquisa.length > 0
                      ? `Nenhum interessado encontrado com o termo "${termoPesquisa}".`
                      : "Nenhum interessado cadastrado."
                  }
                />
              )}

              {/* Conteúdo para Abas USUÁRIOS */}
              {abaAtiva === "usuarios" && (
                <>
                  {!isAdmin ? (
                    <div className="p-8 text-center bg-yellow-50 rounded-lg border border-yellow-200 mt-5">
                      <p className="text-gray-700">
                        <IoLockClosed className="inline mr-2" size={20} />
                        Apenas administradores podem gerenciar usuários
                      </p>
                    </div>
                  ) : (
                    <DataTable
                      columns={[
                        {
                          key: "name",
                          label: "Nome",
                          isNameColumn: true,
                          render: (value, row) => (
                            <button
                              onClick={() => abrirModalEditarUsuario(row)}
                              className="text-blue-600 hover:underline cursor-pointer font-medium bg-none border-none p-0"
                            >
                              {value}
                            </button>
                          ),
                        },
                        {
                          key: "phone",
                          label: "Telefone",
                          render: (value) => formatarTelefoneExibicao(value),
                        },
                        {
                          key: "role",
                          label: "Função",
                          render: (value) => (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                value === "Administrador"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {value}
                            </span>
                          ),
                        },
                        {
                          key: "status",
                          label: "Status",
                          render: (value) => (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                value === "Ativo"
                                  ? "bg-green-100 text-green-800"
                                  : value === "Inativo"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {value}
                            </span>
                          ),
                        },
                        {
                          key: "entry_date",
                          label: "Criado em",
                          render: (value) =>
                            value
                              ? new Date(value).toLocaleString("pt-BR")
                              : "-",
                        },
                        {
                          key: "updated_at",
                          label: "Atualizado em",
                          render: (value) =>
                            value
                              ? new Date(value).toLocaleString("pt-BR")
                              : "-",
                        },
                      ]}
                      data={usuariosFiltrados}
                      renderActions={(row) => (
                        <button
                          onClick={() =>
                            handleDeleteClickUsuario(row.id, row.name)
                          }
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          title="Deletar"
                        >
                          <MdDelete size={18} />
                        </button>
                      )}
                      emptyMessage={
                        termoPesquisa.length > 0
                          ? `Nenhum usuário encontrado com o termo "${termoPesquisa}".`
                          : "Nenhum usuário cadastrado."
                      }
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {confirmDelete.aberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar{" "}
                <strong>{confirmDelete.nome}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() =>
                    setConfirmDelete({
                      aberto: false,
                      recurso: null,
                      id: null,
                      nome: null,
                    })
                  }
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão de Usuário */}
        {confirmDeleteUsuario.aberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar o usuário{" "}
                <strong>{confirmDeleteUsuario.usuarioNome}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() =>
                    setConfirmDeleteUsuario({
                      aberto: false,
                      usuarioId: null,
                      usuarioNome: "",
                    })
                  }
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteUsuario}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Criar/Editar Usuário */}
        <ModalCadastroUsuario
          aberto={abrirModalUsuario}
          editandoUsuario={editandoUsuario}
          formDataUsuario={formDataUsuario}
          onChange={handleChangeUsuario}
          onSalvar={handleSalvarUsuario}
          onCancelar={() => {
            setAbrirModalUsuario(false);
            setEditandoUsuario(null);
            setFormDataUsuario({
              name: "",
              email: "",
              birthDate: "",
              cpf: "",
              rg: "",
              role: "",
              status: "Ativo",
              password: "",
              phone: "",
            });
          }}
        />

        {/* Modais de Cadastro/Edição */}

        {/* Modal de edição de atleta */}
        <EditPlayersModal
          aberto={abrirVisualizarAtleta}
          atleta={atletaSelecionado || {}}
          onClose={() => {
            setAbrirVisualizarAtleta(false);
            setAtletaSelecionado(null);
          }}
          onSave={async (data) => {
            try {
              if (atletaSelecionado?.id) {
                // Remover campos de responsável individuais do objeto enviado
                const {
                  id,
                  respCpf,
                  respNome,
                  respEmail,
                  respTelefone,
                  respParentesco,
                  respCep,
                  respBairro,
                  respCidade,
                  respUf,
                  respLogradouro,
                  respComplemento,
                  ...dataLimpo
                } = data;
                // Corrigir formato da data para yyyy-MM-dd
                if (dataLimpo.nascimento) {
                  const d = dataLimpo.nascimento;
                  if (typeof d === "string" && d.length > 10) {
                    dataLimpo.nascimento = d.slice(0, 10);
                  }
                }
                await update("players", atletaSelecionado.id, dataLimpo);
                // Após editar, recarrega toda a lista de atletas do backend para garantir consistência dos campos de data
                const atletasAtualizados = await list("players");
                setPlayers(
                  Array.isArray(atletasAtualizados) ? atletasAtualizados : [],
                );
              }
            } catch (e) {
              alert(
                "Erro ao salvar alterações do atleta: " + (e?.message || e),
              );
            }
          }}
        />

        <ModalCadastroResponsavel
          aberto={abrirCadastroResponsavel}
          onClose={() => {
            setAbrirCadastroResponsavel(false);
            setItemEditando(null);
          }}
          onSave={(data) => {
            if (itemEditando?.id) {
              setResponsaveis((prev) =>
                prev.map((r) =>
                  r.id === itemEditando.id ? { ...r, ...data } : r,
                ),
              );
            } else {
              const newId = Math.max(...responsaveis.map((r) => r.id), 0) + 1;
              setResponsaveis((prev) => [...prev, { id: newId, ...data }]);
            }
            setItemEditando(null);
            setAbrirCadastroResponsavel(false);
          }}
          responsavel={itemEditando}
        />

        <ModalCadastroTreinador
          aberto={abrirCadastroTreinador}
          onClose={() => {
            setAbrirCadastroTreinador(false);
            setItemEditando(null);
          }}
          onSave={(data) => {
            console.log("onSave do modal de treinador recebeu:", data);
            if (itemEditando?.id) {
              // Atualizar treinador existente
              console.log("Atualizando treinador existente:", itemEditando.id);
              setTreinadores((prev) =>
                prev.map((t) =>
                  t.id === itemEditando.id ? { ...t, ...data } : t,
                ),
              );
            } else {
              // Adicionar novo treinador com dados retornados do backend
              console.log("Adicionando novo treinador:", data);
              setTreinadores((prev) => [...prev, data]);
            }
            setItemEditando(null);
            setAbrirCadastroTreinador(false);
          }}
          treinador={itemEditando}
        />

        <ModalCadastroTurma
          aberto={abrirCadastroTurma}
          onClose={() => {
            setAbrirCadastroTurma(false);
            setItemEditando(null);
          }}
          onSave={async (data) => {
            try {
              if (itemEditando?.id) {
                await update("classes", itemEditando.id, data);
                setClasses((prev) =>
                  prev.map((t) =>
                    t.id === itemEditando.id ? { ...t, ...data } : t,
                  ),
                );
              } else {
                const saved = await create("classes", data);
                setClasses((prev) => [...prev, saved]);
              }
              alert("Turma salva com sucesso!");
              setItemEditando(null);
              setAbrirCadastroTurma(false);
            } catch (e) {
              alert(`Erro ao salvar turma: ${e.message}`);
            }
          }}
          turma={itemEditando}
        />

        <ModalCadastroCategoria
          aberto={abrirCadastroCategoria}
          onClose={() => {
            setAbrirCadastroCategoria(false);
            setItemEditando(null);
          }}
          onSave={async (data) => {
            try {
              if (itemEditando?.id) {
                await update("categories", itemEditando.id, data);
                setCategories((prev) =>
                  prev.map((c) =>
                    c.id === itemEditando.id ? { ...c, ...data } : c,
                  ),
                );
              } else {
                const saved = await create("categories", data);
                setCategories((prev) => [...prev, saved]);
              }
              alert("Categoria salva com sucesso!");
              setItemEditando(null);
              setAbrirCadastroCategoria(false);
            } catch (e) {
              alert(`Erro ao salvar categoria: ${e.message}`);
            }
          }}
          categoria={itemEditando}
        />

        <ModalCadastroModalidade
          aberto={abrirCadastroModalidade}
          onClose={() => {
            setAbrirCadastroModalidade(false);
            setItemEditando(null);
          }}
          onSave={async (data) => {
            try {
              if (itemEditando?.id) {
                await update("modalities", itemEditando.id, data);
                setModalities((prev) =>
                  prev.map((m) =>
                    m.id === itemEditando.id ? { ...m, ...data } : m,
                  ),
                );
              } else {
                const saved = await create("modalities", data);
                setModalities((prev) => [...prev, saved]);
              }
              alert("Modalidade salva com sucesso!");
              setItemEditando(null);
              setAbrirCadastroModalidade(false);
            } catch (e) {
              alert(`Erro ao salvar modalidade: ${e.message}`);
            }
          }}
          modalidade={itemEditando}
        />

        <ModalCadastroInteressado
          aberto={abrirCadastroInteressado}
          onClose={() => {
            setAbrirCadastroInteressado(false);
            setItemEditando(null);
          }}
          onSave={async (data) => {
            try {
              if (itemEditando?.id) {
                await update("leads", itemEditando.id, data);
                // Atualiza a lista de leads do backend para garantir sincronização
                const leadsAtualizados = await list("leads");
                setLeads(
                  Array.isArray(leadsAtualizados) ? leadsAtualizados : [],
                );
              } else {
                const saved = await create("leads", data);
                setLeads((prev) => [...prev, saved]);
              }
              alert("Interessado salvo com sucesso!");
              setItemEditando(null);
              setAbrirCadastroInteressado(false);
            } catch (e) {
              alert(`Erro ao salvar interessado: ${e.message}`);
            }
          }}
          interessado={itemEditando}
          modalidades={modalities}
        />

        {/* Modal Visualizar Atleta */}
        <ModalCadastroAtleta
          aberto={abrirVisualizarAtleta}
          formDataAtleta={atletaSelecionado || {}}
          onClose={() => {
            setAbrirVisualizarAtleta(false);
            setAtletaSelecionado(null);
          }}
          onSave={async (data) => {
            try {
              if (atletaSelecionado?.id) {
                // Atualizar atleta existente
                const atualizado = await update(
                  "players",
                  atletaSelecionado.id,
                  data,
                );
                setAtletaSelecionado(atualizado);
                setAbrirVisualizarAtleta(false);
                // Atualizar lista de atletas se necessário
              }
            } catch (e) {
              alert("Erro ao salvar alterações do atleta");
            }
          }}
        />

        {/* Footer com Abas - Apenas Mobile até 1023px */}
        <div className="fixed bottom-0 left-0 right-0 flex lg:hidden bg-primary-900 border-t border-gray-200 overflow-x-hidden z-30 h-16">
          {abas.map((aba) => (
            <TabItem key={aba.id} {...aba} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Cadastros;
