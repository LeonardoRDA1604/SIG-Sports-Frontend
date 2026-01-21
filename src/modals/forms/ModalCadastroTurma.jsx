import { useState, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { create, update, list } from "../../data/api";
import { createPortal } from "react-dom";

export default function ModalCadastroTurma({ aberto, onClose, onSave, turma }) {
  const [loading, setLoading] = useState(false);
  const [modalidades, setModalidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [treinadores, setTreinadores] = useState([]);

  const estadoInicial = {
    name: "",
    weekdays: "",
    schedule: "",
    status: "Ativa",
    modality: "",
    category: "",
    trainer: "",
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    if (aberto) {
      carregarOpcoes();
      if (turma) {
        setFormData(turma);
      } else {
        setFormData(estadoInicial);
      }
    }
  }, [aberto, turma]);

  const carregarOpcoes = async () => {
    try {
      const [modalidadesData, categoriasData, treinadoresData, usuariosData] =
        await Promise.all([
          list("modalities"),
          list("categories"),
          list("trainers"),
          list("users"),
        ]);
      setModalidades(modalidadesData || []);
      setCategorias(categoriasData || []);
      // Faz join para adicionar nome do usuário ao treinador
      const treinadoresComNome = (treinadoresData || []).map((t) => {
        const usuario = (usuariosData || []).find(
          (u) => String(u.id) === String(t.user_id),
        );
        return {
          ...t,
          name: usuario?.name || usuario?.nome || "-",
        };
      });
      setTreinadores(treinadoresComNome);
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
    }
  };

  const validarCampos = () => {
    const obrigatorios = [
      "name",
      "weekdays",
      "schedule",
      "status",
      "modality",
      "category",
      "trainer",
    ];
    return obrigatorios.every((campo) => {
      const valor = formData[campo];
      return valor && valor.toString().trim() !== "";
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = async () => {
    if (!validarCampos()) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      // Converter horário (HH:mm) para datetime completo
      const scheduleDateTime = formData.schedule.includes("T")
        ? formData.schedule
        : `${new Date().toISOString().split("T")[0]}T${formData.schedule}:00`;

      const payload = {
        name: formData.name.trim(),
        weekdays: formData.weekdays.trim(),
        schedule: scheduleDateTime,
        status: formData.status,
        modality: formData.modality,
        category: formData.category,
        trainer: formData.trainer,
      };

      onSave?.(payload);
      handleClose();
    } catch (error) {
      console.error("Erro ao preparar turma:", error);
      alert(`Erro ao preparar turma: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(estadoInicial);
    onClose();
  };

  const inputStyle =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white";

  const selectStyle =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer";

  if (!aberto) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-screen sm:w-full sm:max-w-lg h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-5 border-b border-gray-100 sticky top-0 z-10 rounded-t-2xl bg-primary-900">
          <div>
            <h2 className="text-xl font-bold text-primary-50">
              {turma?.id ? "Editar Turma" : "Nova Turma"}
            </h2>
            <p className="text-xs text-primary-100/80 mt-1">
              Preencha os dados da turma
            </p>
          </div>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
            onClick={handleClose}
            disabled={loading}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Nome da Turma <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Turma A12"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Dias da Semana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="weekdays"
              value={formData.weekdays}
              onChange={handleChange}
              placeholder="Ex: Segunda, Quarta, Sexta"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Horário <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="">Selecione o status</option>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
                <option value="Pausada">Pausada</option>
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Modalidade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="">Selecione a modalidade</option>
                {modalidades.map((mod) => (
                  <option key={mod.id} value={mod.name || mod.modalidade}>
                    {mod.name || mod.modalidade}
                  </option>
                ))}
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="">Selecione a categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.name || cat.categoria}>
                    {cat.name || cat.categoria}
                  </option>
                ))}
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Treinador <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="">Selecione o treinador</option>
                {treinadores.map((trainer) => (
                  <option key={trainer.id} value={trainer.name || trainer.nome}>
                    {trainer.name || trainer.nome}
                  </option>
                ))}
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-6 px-6 py-5 border-t border-gray-100 bg-primary-50 rounded-b-2xl">
          <button
            type="button"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`px-10 py-2.5 font-bold rounded-full transition-colors shadow-md text-sm ${
              validarCampos() && !loading
                ? "bg-primary-900 text-white hover:bg-primary-800 cursor-pointer shadow-blue-900/20"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            }`}
            disabled={!validarCampos() || loading}
            onClick={handleSalvar}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
