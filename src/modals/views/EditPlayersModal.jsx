import { useRef, useEffect, useState } from "react";
import { list } from "../../data/api";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

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

export default function EditPlayersModal({
  aberto,
  atleta = {},
  onChange,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(atleta || {});
  const [categorias, setCategorias] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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

  useEffect(() => {
    if (aberto) {
      setStep(0);
      setIsDirty(false);
      setIsLoading(false);
      setFormData(atleta || {});
    }
  }, [aberto, atleta]);

  useEffect(() => {
    if (aberto) {
      setIsDirty(true);
    }
  }, [formData, aberto]);

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
          .slice(0, 12);
        break;
      default:
        break;
    }
    const updated = { ...formData, [name]: newValue };
    setFormData(updated);
    if (onChange) onChange(updated);
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
            Editar Atleta
          </h2>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <IoClose size={24} />
          </button>
        </div>
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
                onClick={() => setStep(idx)}
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
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                setIsLoading(true);
                const dataToSend = {
                  ...formData,
                  user_id: formData.user_id ? Number(formData.user_id) : null,
                };
                await onSave(dataToSend);
                setIsLoading(false);
              }
            }}
            className="space-y-6"
          >
            {/* Conteúdo de cada etapa - igual ao PlayerTemplateModal */}
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
                      value={formData.nascimento || ""}
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
                      value={formData.age || ""}
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
                  Responsável
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome do Responsável */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="respNome"
                      value={formData.respNome || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Nome do responsável"
                    />
                  </div>
                  {/* Parentesco */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Parentesco
                    </label>
                    <input
                      type="text"
                      name="respParentesco"
                      value={formData.respParentesco || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="Parentesco"
                    />
                  </div>
                  {/* CPF do Responsável */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="respCpf"
                      value={formData.respCpf || ""}
                      onChange={handleChange}
                      maxLength="14"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="XXX.XXX.XXX-XX"
                    />
                  </div>
                  {/* Telefone do Responsável */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="respTelefone"
                      value={formData.respTelefone || ""}
                      onChange={handleChange}
                      maxLength="15"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  {/* Email do Responsável */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="respEmail"
                      value={formData.respEmail || ""}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                      placeholder="email@exemplo.com"
                    />
                  </div>
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
