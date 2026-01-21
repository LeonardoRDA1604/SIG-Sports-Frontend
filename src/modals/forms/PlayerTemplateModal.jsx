import { useRef, useEffect, useState } from "react";
import { list } from "../../data/api";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

// Utilitários de máscara e tratamento
function formatCPF(value = "") {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}
function formatCEP(value = "") {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2")
    .slice(0, 9);
}
function formatPhone(value = "") {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15);
}
function onlyLetters(value = "") {
  return value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
}
function capitalizeWords(str = "") {
  return str.replace(/\b(\w)/g, (m) => m.toUpperCase());
}

export default function ModalCadastroAtleta({
  // ...existing code...
  aberto,
  editandoAtleta,
  formDataAtleta = {},
  onChange,
  onSave,
  onClose,
  atleta,
}) {
  // Mensagem de sucesso ao salvar
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(formDataAtleta || {});
  const [categorias, setCategorias] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  // Estado e handlers para múltiplos responsáveis
  const [responsavelForm, setResponsavelForm] = useState({});
  const [editingResponsavel, setEditingResponsavel] = useState(null);

  function handleResponsavelChange(e) {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "respNome") {
      // Permite apenas letras e espaços
      newValue = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
    }
    if (name === "respTelefone") {
      // Máscara para telefone brasileiro (celular)
      newValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 15);
    }
    if (name === "respCpf") {
      // Máscara para CPF
      newValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    // Validação de email
    let emailError = "";
    if (name === "respEmail") {
      if (!newValue) {
        emailError = "O e-mail é obrigatório.";
      } else if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(newValue)) {
        emailError = "E-mail inválido.";
      }
    }
    setResponsavelForm((prev) => ({
      ...prev,
      [name]: newValue,
      respEmailError: name === "respEmail" ? emailError : prev.respEmailError,
    }));
  }

  function handleAddResponsavel() {
    // Validação do nome: não pode conter números ou caracteres especiais
    const nomeValido =
      responsavelForm.respNome &&
      /^[A-Za-zÀ-ÿ\s]+$/.test(responsavelForm.respNome);
    // Validação do email: obrigatório e formato válido
    const emailValido =
      responsavelForm.respEmail &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responsavelForm.respEmail);
    if (
      !nomeValido ||
      !responsavelForm.respCpf ||
      !responsavelForm.respTelefone ||
      !emailValido
    ) {
      let msg = "Preencha corretamente os campos obrigatórios do responsável:";
      if (!nomeValido) msg += "\n- Nome sem números ou caracteres especiais";
      if (!responsavelForm.respCpf) msg += "\n- CPF";
      if (!responsavelForm.respTelefone) msg += "\n- Telefone";
      if (!emailValido) msg += "\n- Email válido e obrigatório";
      alert(msg);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      responsaveis: [...(prev.responsaveis || []), responsavelForm],
    }));
    setResponsavelForm({});
  }

  function handleRemoveResponsavel(idx) {
    setFormData((prev) => ({
      ...prev,
      responsaveis: (prev.responsaveis || []).filter((_, i) => i !== idx),
    }));
    if (editingResponsavel === idx) {
      setEditingResponsavel(null);
      setResponsavelForm({});
    }
  }

  function handleUpdateResponsavel() {
    setFormData((prev) => {
      const novosResponsaveis = (prev.responsaveis || []).map((r, i) =>
        i === editingResponsavel ? { ...responsavelForm } : r,
      );
      // Força atualização do array para garantir sincronização
      return {
        ...prev,
        responsaveis: [...novosResponsaveis],
      };
    });
    setEditingResponsavel(null);
    setResponsavelForm({});
  }

  function handleCancelEditResponsavel() {
    setEditingResponsavel(null);
    setResponsavelForm({});
  }
  // Buscar dados do backend ao abrir modal
  useEffect(() => {
    if (aberto) {
      list("categories")
        .then(setCategorias)
        .catch(() => setCategorias([]));
      list("modalities")
        .then(setModalidades)
        .catch(() => setModalidades([]));
      list("classes")
        .then(setTurmas)
        .catch(() => setTurmas([]));
      list("users")
        .then(setUsuarios)
        .catch(() => setUsuarios([]));
    }
  }, [aberto]);
  const [step, setStep] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const steps = [
    "Dados Pessoais",
    "Dados Esportivos",
    "Endereço",
    "Responsável",
    "Observações e Notas",
  ];
  const modalRef = useRef(null);
  const lastActiveElement = useRef(null);

  // Limpa step e dirty ao abrir/fechar
  useEffect(() => {
    if (aberto) {
      setStep(0);
      setIsDirty(false);
      setIsLoading(false);
      setFormData(formDataAtleta || {});
    }
  }, [aberto]);

  // Detecta se o formulário está sujo
  useEffect(() => {
    if (aberto) {
      setIsDirty(true);
    }
  }, [formData, aberto]);

  // Prevenção de fechamento acidental ao clicar fora
  function handleOverlayClick(e) {
    if (e.target === modalRef.current) {
      if (isDirty) {
        if (
          window.confirm(
            "Você perderá os dados preenchidos. Deseja realmente sair?",
          ) === false
        ) {
          return;
        }
      }
      onClose();
    }
  }

  // Limpa step ao abrir/fechar
  useEffect(() => {
    if (aberto) {
      setStep(0);
    }
  }, [aberto]);

  useEffect(() => {
    if (aberto) {
      lastActiveElement.current = document.activeElement;
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 0);
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
        if (e.key === "Tab") {
          const focusableEls = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const focusable = Array.from(focusableEls).filter(
            (el) => !el.disabled && el.offsetParent !== null,
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (lastActiveElement.current) {
          lastActiveElement.current.focus();
        }
      };
    }
  }, [aberto, onClose]);

  // Validação por etapa
  function validateStep(currentStep) {
    if (currentStep === 0) {
      if (!formDataAtleta.name || formDataAtleta.name.trim().length < 2)
        return false;
      if (!formDataAtleta.cpf || formDataAtleta.cpf.length < 14) return false;
      if (!formDataAtleta.rg || formDataAtleta.rg.length < 9) return false;
      if (!formDataAtleta.nascimento) return false;
      return true;
    }
    if (currentStep === 1) {
      if (!formDataAtleta.category) return false;
      if (!formDataAtleta.modalidade) return false;
      return true;
    }
    if (currentStep === 2) {
      if (!formDataAtleta.cep || formDataAtleta.cep.length < 9) return false;
      if (!formDataAtleta.bairro) return false;
      if (!formDataAtleta.cidade) return false;
      if (!formDataAtleta.uf || formDataAtleta.uf.length < 2) return false;
      if (!formDataAtleta.logradouro) return false;
      return true;
    }
    if (currentStep === 3) {
      if (!formDataAtleta.respNome) return false;
      if (!formDataAtleta.respCpf || formDataAtleta.respCpf.length < 14)
        return false;
      if (
        !formDataAtleta.respTelefone ||
        formDataAtleta.respTelefone.length < 15
      )
        return false;
      return true;
    }
    return true;
  }

  // handleChange com máscaras em tempo real
  function handleChange(e) {
    const { name, value } = e.target;
    let newValue = value;
    switch (name) {
      case "name":
      case "respNome":
        newValue = onlyLetters(value);
        break;
      case "cpf":
      case "respCpf":
        newValue = formatCPF(value);
        break;
      case "cep":
        newValue = formatCEP(value);
        break;
      case "respTelefone":
        newValue = formatPhone(value);
        break;
      case "rg":
        newValue = value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
          .slice(0, 12); // Ex: 12.345.678-9
        break;
      default:
        break;
    }
    const updated = { ...formData, [name]: newValue };
    setFormData(updated);
    if (onChange) onChange(updated);
  }

  // Navegação bloqueada se etapa não válida
  function handleStepChange(idx) {
    if (idx <= step || validateStep(step)) {
      setStep(idx);
    }
  }

  if (!aberto) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={modalRef}
      onClick={handleOverlayClick}
    >
      <div className="w-screen sm:w-full sm:max-w-2xl h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[90vh]">
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 z-10 rounded-t-2xl bg-primary-900">
          <h2 id="modal-title" className="text-xl font-bold text-primary-50">
            {editandoAtleta ? "Editar Atleta" : "Novo Atleta"}
          </h2>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="p-3 mb-2 rounded bg-green-100 text-green-800 text-center font-semibold animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Etapas do formulário */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          {/* Navegação das etapas */}
          <div className="flex justify-center mb-6">
            {steps.map((label, idx) => (
              <button
                key={label}
                type="button"
                className={`px-3 py-1 rounded-full mx-1 text-xs font-semibold transition-colors ${
                  step === idx
                    ? "bg-primary-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-primary-200"
                }`}
                onClick={() => handleStepChange(idx)}
                disabled={step === idx}
                aria-current={step === idx ? "step" : undefined}
              >
                {label}
              </button>
            ))}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!validateStep(step)) return;
              if (step < steps.length - 1) {
                // Força atualização do formData para garantir que alterações em responsáveis não se percam
                setFormData((prev) => ({
                  ...prev,
                  responsaveis: [...(prev.responsaveis || [])],
                }));
                setStep(step + 1);
                return;
              }
              setIsLoading(true);
              // Remove campos individuais de responsável do payload
              const {
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
                ...dataToSend
              } = formData;
              dataToSend.user_id = formData.user_id || null;
              // Corrigir formato da data para yyyy-MM-dd
              if (dataToSend.nascimento) {
                const d = dataToSend.nascimento;
                if (typeof d === "string" && d.length > 10) {
                  dataToSend.nascimento = d.slice(0, 10);
                }
              }
              // Garante que só o array de responsáveis será enviado
              if (Array.isArray(formData.responsaveis)) {
                dataToSend.responsaveis = formData.responsaveis;
              }
              try {
                await onSave(dataToSend);
                setSuccessMessage("Atleta atualizado com sucesso!");
                setIsLoading(false);
                // Em modo de edição, não fecha o modal automaticamente. O controle fica com o componente pai (EditPlayersModal)
                if (!editandoAtleta) {
                  setTimeout(() => {
                    setSuccessMessage("");
                    onClose();
                  }, 1200);
                }
              } catch (error) {
                setIsLoading(false);
                // Aqui você pode adicionar lógica para exibir erro, se desejar
              }
            }}
            className="space-y-6"
          >
            {/* Conteúdo de cada etapa */}
            {step === 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="nome@exemplo.com"
                    />
                  </div>
                  {/* CPF */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf || ""}
                      onChange={handleChange}
                      maxLength="14"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="XXX.XXX.XXX-XX"
                      required
                    />
                  </div>
                  {/* RG */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      RG
                    </label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg || ""}
                      onChange={handleChange}
                      maxLength="9"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="XXX.XXX.X"
                    />
                  </div>
                  {/* Data de Nascimento */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Nascimento
                    </label>
                    <input
                      type="date"
                      name="nascimento"
                      value={
                        formData.nascimento
                          ? typeof formData.nascimento === "string" &&
                            formData.nascimento.length > 10
                            ? formData.nascimento.slice(0, 10)
                            : formData.nascimento
                          : ""
                      }
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm bg-white"
                    />
                  </div>
                  {/* Idade (calculada) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Idade
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={
                        formData.nascimento
                          ? Math.floor(
                              (new Date() -
                                new Date(formDataAtleta.nascimento)) /
                                (365.25 * 24 * 60 * 60 * 1000),
                            )
                          : ""
                      }
                      readOnly
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-sm"
                      placeholder="Idade"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Dados Esportivos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Categoria */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Categoria
                    </label>
                    <select
                      name="category"
                      value={formData.category || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {categorias.map((cat) => (
                        <option
                          key={cat.id || cat._id || cat.value || cat.nome}
                          value={cat.id || cat._id || cat.value || cat.nome}
                        >
                          {cat.nome || cat.name || cat.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Modalidade */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Modalidade
                    </label>
                    <select
                      name="modalidade"
                      value={formData.modalidade || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {modalidades.map((mod) => (
                        <option
                          key={mod.id || mod._id || mod.value || mod.nome}
                          value={mod.id || mod._id || mod.value || mod.nome}
                        >
                          {mod.nome || mod.name || mod.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Turma */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Turma
                    </label>
                    <select
                      name="classes"
                      value={formData.classes || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {turmas.map((turma) => (
                        <option
                          key={
                            turma.id || turma._id || turma.value || turma.nome
                          }
                          value={
                            turma.id || turma._id || turma.value || turma.nome
                          }
                        >
                          {turma.nome || turma.name || turma.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Usuário Responsável */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Usuário Responsável
                    </label>
                    <select
                      name="user_id"
                      value={formData.user_id || ""}
                      onChange={(e) => {
                        // Sempre salva o id do usuário
                        setFormData({ ...formData, user_id: e.target.value });
                        if (onChange)
                          onChange({ ...formData, user_id: e.target.value });
                      }}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {usuarios.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nome || user.name || user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Peso */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      name="weigth"
                      value={formData.weigth || ""}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Peso"
                    />
                  </div>
                  {/* Altura */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Altura (m)
                    </label>
                    <input
                      type="number"
                      name="heigth"
                      value={formData.heigth || ""}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Altura"
                    />
                  </div>
                  {/* Posição Primária */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Posição Primária
                    </label>
                    <select
                      name="primary_position"
                      value={
                        typeof formData.primary_position === "string"
                          ? formData.primary_position
                          : formData.primary_position
                            ? String(formData.primary_position)
                            : ""
                      }
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="Goleiro">Goleiro</option>
                      <option value="Zagueiro">Zagueiro</option>
                      <option value="Lateral Direito">Lateral Direito</option>
                      <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                      <option value="Volante">Volante</option>
                      <option value="Meio-campista">Meio-campista</option>
                      <option value="Meia Ofensivo">Meia Ofensivo</option>
                      <option value="Meia Defensivo">Meia Defensivo</option>
                      <option value="Ponta Direita">Ponta Direita</option>
                      <option value="Ponta Esquerda">Ponta Esquerda</option>
                      <option value="Atacante">Atacante</option>
                      <option value="Centroavante">Centroavante</option>
                      <option value="Segundo Atacante">Segundo Atacante</option>
                      <option value="Ala Direito">Ala Direito</option>
                      <option value="Ala Esquerdo">Ala Esquerdo</option>
                    </select>
                  </div>
                  {/* Posição Secundária */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Posição Secundária
                    </label>
                    <select
                      name="second_position"
                      value={
                        typeof formData.second_position === "string"
                          ? formData.second_position
                          : formData.second_position
                            ? String(formData.second_position)
                            : ""
                      }
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="Goleiro">Goleiro</option>
                      <option value="Zagueiro">Zagueiro</option>
                      <option value="Lateral Direito">Lateral Direito</option>
                      <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                      <option value="Volante">Volante</option>
                      <option value="Meio-campista">Meio-campista</option>
                      <option value="Meia Ofensivo">Meia Ofensivo</option>
                      <option value="Meia Defensivo">Meia Defensivo</option>
                      <option value="Ponta Direita">Ponta Direita</option>
                      <option value="Ponta Esquerda">Ponta Esquerda</option>
                      <option value="Atacante">Atacante</option>
                      <option value="Centroavante">Centroavante</option>
                      <option value="Segundo Atacante">Segundo Atacante</option>
                      <option value="Ala Direito">Ala Direito</option>
                      <option value="Ala Esquerdo">Ala Esquerdo</option>
                    </select>
                  </div>
                  {/* Pé Dominante */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Pé Dominante
                    </label>
                    <select
                      name="dominant_foot"
                      value={formData.dominant_foot || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="Destro">Destro</option>
                      <option value="Canhoto">Canhoto</option>
                      <option value="Ambidestro">Ambidestro</option>
                    </select>
                  </div>
                  {/* Status Esportivo */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Status Esportivo
                    </label>
                    <select
                      name="sport_status"
                      value={formData.sport_status || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Afastado">Afastado</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Endereço
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CEP com busca automática */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      CEP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep || ""}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                        placeholder="CEP"
                        maxLength={9}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors text-xs font-semibold"
                        onClick={async () => {
                          const cep = (formData.cep || "").replace(/\D/g, "");
                          if (cep.length !== 8) {
                            alert("CEP inválido");
                            return;
                          }
                          try {
                            const res = await fetch(
                              `https://viacep.com.br/ws/${cep}/json/`,
                            );
                            const data = await res.json();
                            if (data.erro) {
                              alert("CEP não encontrado");
                              return;
                            }
                            setFormData((prev) => ({
                              ...prev,
                              bairro: data.bairro || "",
                              cidade: data.localidade || "",
                              uf: data.uf || "",
                              logradouro: data.logradouro || "",
                              complemento: data.complemento || "",
                            }));
                          } catch {
                            alert("Erro ao buscar CEP");
                          }
                        }}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                  {/* Bairro */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Bairro"
                    />
                  </div>
                  {/* Cidade */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Cidade"
                    />
                  </div>
                  {/* UF */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      UF
                    </label>
                    <input
                      type="text"
                      name="uf"
                      value={formData.uf || ""}
                      onChange={handleChange}
                      maxLength="2"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="UF"
                    />
                  </div>
                  {/* Logradouro */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Logradouro
                    </label>
                    <input
                      type="text"
                      name="logradouro"
                      value={formData.logradouro || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Logradouro"
                    />
                  </div>
                  {/* Complemento */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      value={formData.complemento || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Complemento"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Responsáveis
                </h3>
                {/* Lista de responsáveis adicionados */}
                <ul className="mb-4 space-y-2">
                  {(formData.responsaveis || []).map((resp, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm transition hover:shadow-md group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary-900 truncate">
                            {resp.respNome}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                            {resp.respParentesco}
                          </span>
                        </div>
                        {/* Apenas nome e parentesco */}
                      </div>
                      <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 bg-linear-to-tr from-blue-50 to-blue-100 text-blue-700 shadow-sm hover:from-blue-100 hover:to-blue-200 hover:border-blue-400 hover:text-blue-900 transition-all duration-200 group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Editar"
                        onClick={() => {
                          setEditingResponsavel(idx);
                          setResponsavelForm(resp);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-red-200 bg-linear-to-tr from-red-50 to-red-100 text-red-700 shadow-sm hover:from-red-100 hover:to-red-200 hover:border-red-400 hover:text-red-900 transition-all duration-200 group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
                        title="Excluir"
                        onClick={() => handleRemoveResponsavel(idx)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Formulário de responsável */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="respNome"
                      value={responsavelForm.respNome || ""}
                      onChange={handleResponsavelChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Parentesco
                    </label>
                    <div className="relative">
                      <select
                        name="respParentesco"
                        value={responsavelForm.respParentesco || ""}
                        onChange={handleResponsavelChange}
                        className="w-full appearance-none px-3.5 py-2.5 border border-primary-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-400/30 focus:border-primary-700 outline-none text-sm cursor-pointer transition-all pr-10 hover:border-primary-400"
                        style={{ backgroundImage: "none" }}
                        onMouseOver={(e) => {
                          if (e.target.tagName === "OPTION")
                            e.target.style.transform = "scale(1.08)";
                        }}
                        onMouseOut={(e) => {
                          if (e.target.tagName === "OPTION")
                            e.target.style.transform = "";
                        }}
                      >
                        <option value="">Selecione</option>
                        <option value="Pai">Pai</option>
                        <option value="Mãe">Mãe</option>
                        <option value="Padrasto">Padrasto</option>
                        <option value="Madrasta">Madrasta</option>
                        <option value="Avô">Avô</option>
                        <option value="Avó">Avó</option>
                        <option value="Tio">Tio</option>
                        <option value="Tia">Tia</option>
                        <option value="Irmão">Irmão</option>
                        <option value="Irmã">Irmã</option>
                        <option value="Outro">Outro</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-primary-700">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M7 10l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="respCpf"
                      value={responsavelForm.respCpf || ""}
                      onChange={handleResponsavelChange}
                      maxLength="14"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="XXX.XXX.XXX-XX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="respTelefone"
                      value={responsavelForm.respTelefone || ""}
                      onChange={handleResponsavelChange}
                      maxLength="15"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="respEmail"
                      value={responsavelForm.respEmail || ""}
                      onChange={handleResponsavelChange}
                      className={`w-full px-3.5 py-2.5 border ${responsavelForm.respEmailError ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white`}
                      placeholder="email@exemplo.com"
                    />
                    {responsavelForm.respEmailError && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {responsavelForm.respEmailError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {editingResponsavel !== null ? (
                    <button
                      type="button"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      onClick={handleUpdateResponsavel}
                    >
                      Atualizar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                      onClick={handleAddResponsavel}
                    >
                      + Responsável
                    </button>
                  )}
                  {editingResponsavel !== null && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      onClick={handleCancelEditResponsavel}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Observações e Notas
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Observações */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes || ""}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Observações gerais"
                    />
                  </div>
                  {/* Notas */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Notas
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes || ""}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Notas adicionais"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Botões de navegação */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full sm:w-auto px-6 py-2.5 border border-primary-900 text-primary-900 font-medium rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
                >
                  Voltar
                </button>
              )}
              {step === steps.length - 1 ? (
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors shadow-sm flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Salvando...
                    </span>
                  ) : (
                    "Salvar"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(step + 1);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors shadow-sm flex items-center justify-center"
                >
                  Próximo
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
