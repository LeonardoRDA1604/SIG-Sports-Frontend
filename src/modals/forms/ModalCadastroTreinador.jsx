import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { HiChevronDown } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FiAlertCircle } from "react-icons/fi";
import { create, update, list } from "../../data/api";

export default function ModalCadastroTreinador({
  aberto,
  onClose,
  onSave,
  treinador,
}) {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [erro, setErro] = useState("");

  const estadoInicial = {
    license_level: "",
    specialty: "",
    user_id: "",
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    if (aberto) {
      setErro("");
      carregarOpcoes();
      if (treinador) {
        setFormData({
          license_level: treinador.license_level || "",
          specialty: treinador.specialty || "",
          user_id: treinador.user_id || "",
        });
        // Procurar o usuário selecionado após carregar
        const userSelecionado = usuarios.find(
          (u) => u.id === treinador.user_id,
        );
        if (userSelecionado) {
          setUsuarioSelecionado(userSelecionado);
        }
      } else {
        setFormData(estadoInicial);
        setUsuarioSelecionado(null);
      }
    }
  }, [aberto]);

  // Atualizar usuarioSelecionado quando formData.user_id muda
  useEffect(() => {
    if (formData.user_id && usuarios.length > 0) {
      const usuario = usuarios.find((u) => u.id === formData.user_id);
      setUsuarioSelecionado(usuario || null);
    }
  }, [formData.user_id, usuarios]);

  const carregarOpcoes = async () => {
    try {
      const usuariosData = await list("users");
      console.log("✓ Usuários carregados:", usuariosData?.length);
      if (usuariosData?.length > 0) {
        console.log(
          "📞 Primeiro usuário com dados:",
          JSON.stringify(usuariosData[0], null, 2),
        );
      }
      setUsuarios(usuariosData || []);
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
      setErro("Erro ao carregar usuários");
    }
  };

  const handleClose = () => {
    setFormData(estadoInicial);
    setUsuarioSelecionado(null);
    setErro("");
    onClose();
  };

  const validarCampos = () => {
    const isLicenseLevelValid =
      formData.license_level && formData.license_level.trim().length > 0;
    const isSpecialtyValid =
      formData.specialty && formData.specialty.trim().length > 0;
    const isUserIdValid =
      formData.user_id && formData.user_id.trim().length > 0;

    return isLicenseLevelValid && isSpecialtyValid && isUserIdValid;
  };

  // Usar useMemo para evitar recalcular a validade a cada render
  const camposValidos = useMemo(() => validarCampos(), [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Se mudou o usuário, atualiza o usuarioSelecionado
    if (name === "user_id") {
      const usuario = usuarios.find((u) => u.id === value);
      setUsuarioSelecionado(usuario || null);
      console.log("✓ Usuário selecionado:", usuario?.name);
    }

    // Limpar erro ao digitar
    if (erro) setErro("");
  };

  const handleSalvar = async () => {
    if (loading) return;
    if (!camposValidos) {
      setErro("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!usuarioSelecionado?.id) {
      setErro("Nenhum usuário foi selecionado corretamente");
      return;
    }

    setLoading(true);
    try {
      // Função para gerar data/hora atual no timezone de Recife
      const getRecifeDateISOString = () => {
        const now = new Date();
        // Ajusta para -03:00 (Recife)
        const offsetMs = -3 * 60 * 60 * 1000;
        const localDate = new Date(now.getTime() + offsetMs);
        // Retorna string ISO com offset
        return localDate.toISOString().replace("Z", "-03:00");
      };

      const payload = {
        license_level: formData.license_level.trim(),
        specialty: formData.specialty.trim(),
        user_id: formData.user_id.trim(),
      };

      console.log("====== CADASTRANDO TREINADOR ======");
      console.log("📝 Dados enviados:", payload);
      console.log("👤 Usuário:", usuarioSelecionado?.name);
      console.log("====================================");

      let resultado;
      if (treinador?.id) {
        console.log("🔄 Atualizando treinador ID:", treinador.id);
        const atualizado = {
          id: treinador.id,
          ...payload,
          updated_at: getRecifeDateISOString(),
        };
        onSave?.(atualizado);
        setErro("");
      } else {
        // Gera id único para o novo treinador
        const uniqueId = Math.random().toString(36).substring(2, 8);
        const novoTreinador = {
          id: uniqueId,
          ...payload,
          entry_date: getRecifeDateISOString(),
          updated_at: getRecifeDateISOString(),
        };
        console.log("✨ Criando novo treinador", novoTreinador);
        onSave?.(novoTreinador);
        setErro("");
      }

      console.log("✅ Resposta da API:", resultado);
      handleClose();
    } catch (error) {
      console.error("❌ Erro ao salvar treinador:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao salvar treinador";
      setErro(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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
              {treinador?.id ? "Editar Treinador" : "Novo Treinador"}
            </h2>
            <p className="text-xs text-primary-100/80 mt-1">
              {treinador?.id
                ? "Atualize os dados do treinador"
                : "Preencha os dados do novo treinador"}
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
          {/* Mensagem de Erro */}
          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <FiAlertCircle
                className="text-red-500 flex-shrink-0 mt-0.5"
                size={18}
              />
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          {/* Selecionar Usuário */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Usuário <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="">
                  {usuarios.length > 0
                    ? "Selecione o usuário"
                    : "Carregando usuários..."}
                </option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.name} ({usuario.email})
                  </option>
                ))}
              </select>
              <HiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
            {usuarios.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ Nenhum usuário disponível. Crie um usuário primeiro.
              </p>
            )}
          </div>

          {/* Dados do Usuário Selecionado (readonly) */}
          {usuarioSelecionado && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                📋 Dados do usuário
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={usuarioSelecionado.name || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={usuarioSelecionado.email || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={usuarioSelecionado.phone || ""}
                  readOnly
                  placeholder="Nenhum telefone cadastrado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-xs font-medium text-slate-700 cursor-not-allowed placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              📚 Dados Profissionais
            </h3>

            {/* Nível de Licença */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Nível de Licença <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="license_level"
                  value={formData.license_level}
                  onChange={handleChange}
                  className={selectStyle}
                >
                  <option value="">Selecione o nível de licença</option>
                  <option value="A">Nível A</option>
                  <option value="B">Nível B</option>
                  <option value="C">Nível C</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Certificado">Certificado</option>
                  <option value="Mestrado">Mestrado</option>
                  <option value="Doutorado">Doutorado</option>
                </select>
                <HiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Certificação ou nível de qualificação do treinador
              </p>
            </div>

            {/* Especialidade */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Especialidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Ex: Futebol, Basquete, Natação..."
                className={inputStyle}
              />
              <p className="text-xs text-gray-500 mt-1">
                Esporte ou área de especialização do treinador
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 px-6 py-5 border-t border-gray-100 bg-primary-50 rounded-b-2xl sticky bottom-0">
          <button
            type="button"
            className="px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors text-sm"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`px-8 py-2.5 font-semibold rounded-full transition-all text-sm ${
              camposValidos && !loading
                ? "bg-primary-900 text-white hover:bg-primary-800 shadow-lg cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!camposValidos || loading}
            onClick={handleSalvar}
          >
            {loading ? "Salvando..." : treinador?.id ? "Atualizar" : "Criar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
