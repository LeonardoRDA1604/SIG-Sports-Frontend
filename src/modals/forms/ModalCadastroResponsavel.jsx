import { useState, useEffect } from "react";
import AutocompleteAtleta from "../../components/AutocompleteAtleta";
import { list } from "../../data/api";
import { createPortal } from "react-dom";
import { HiChevronDown } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default function ModalCadastroResponsavel({
  aberto,
  onClose,
  onSave,
  responsavel,
}) {
  // Definindo o estado inicial para facilitar o reset
  const estadoInicial = {
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    nomeAtleta: "",
    parentesco: "",
    cep: "",
    bairro: "",
    cidade: "",
    numero: "",
    uf: "",
    logradouro: "",
    complemento: "",
  };

  const [formData, setFormData] = useState(estadoInicial); // Utiliza o estado inicial do formulário para iniciar o estado dos campos
  const [emailErro, setEmailErro] = useState(false); // Estado de erro do email
  const [atletas, setAtletas] = useState([]);
  const [atletasAdicionados, setAtletasAdicionados] = useState([]);
  // Buscar atletas cadastrados ao abrir o modal
  useEffect(() => {
    if (aberto) {
      list("players")
        .then((data) => setAtletas(data))
        .catch(() => setAtletas([]));
    }
  }, [aberto]);

  // Preencher dados quando estiver editando
  useEffect(() => {
    if (aberto && responsavel) {
      setFormData(responsavel);
    } else {
      setFormData(estadoInicial);
    }
  }, [aberto, responsavel]);

  // Função que valida se todos os campos com * estão preenchidos e o email é válido
  const validarCampos = () => {
    const camposObrigatorios = [
      "nome",
      "cpf",
      "email",
      "telefone",
      "parentesco",
      "cep",
      "bairro",
      "cidade",
      "numero",
      "uf",
      "logradouro",
      "complemento",
    ];

    // Verifica se todos os campos obrigatórios têm conteúdo (removendo espaços vazios)
    const todosPreenchidos = camposObrigatorios.every(
      (campo) => formData[campo]?.trim() !== "",
    );

    // Pelo menos um atleta deve ser adicionado
    const temAtleta = atletasAdicionados.length > 0;

    // O botão só habilita se tudo estiver preenchido, tem atleta e não houver erro de formato de email
    return todosPreenchidos && temAtleta && !emailErro;
  };

  // Função para fechar o modal e resetar os campos
  const handleClose = () => {
    setFormData(estadoInicial); // Reseta os inputs
    setEmailErro(false); // Reseta o estado de erro do email
    onClose(); // Chama a função de fechar vinda do componente pai
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;
    const payload = {
      name: formData.nome,
      cpf: formData.cpf,
      email: formData.email,
      phoneNumber: formData.telefone,
      athletes: atletasAdicionados.map((a) => a.nome),
      kinship: formData.parentesco,
      cep: formData.cep,
      bairro: formData.bairro,
      cidade: formData.cidade,
      numero: formData.numero,
      uf: formData.uf,
      logradouro: formData.logradouro,
      complemento: formData.complemento,
    };
    onSave?.(payload);
    handleClose();
  };

  // Máscara para CPF
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  // Máscaras para os campos Telefone e CEP
  const maskTelefone = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      .substring(0, 15);
  const maskCEP = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d{3})/, "$1-$2")
      .substring(0, 9);

  // Validação de email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Buscar endereço pela API ViaCEP
  const buscarEnderecoPorCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Lida com mudanças nos campos que contém máscara ou validação, para atualizar suas funções
  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "cpf") maskedValue = maskCPF(value);
    if (name === "telefone") maskedValue = maskTelefone(value);
    if (name === "cep") {
      maskedValue = maskCEP(value);
      // Buscar endereço quando o CEP estiver completo
      const cepLimpo = maskedValue.replace(/\D/g, "");
      if (cepLimpo.length === 8) {
        buscarEnderecoPorCEP(maskedValue);
      }
    }

    if (name === "email") {
      setEmailErro(!validarEmail(value) && value !== "");
    }

    setFormData({ ...formData, [name]: maskedValue });
  };

  // Padronização dos estilos dos inputs
  const inputStyle =
    "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white";
  const selectStyle =
    "w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer";

  if (!aberto) return null; // Não renderiza nada quando estiver fechado

  return createPortal(
    // z-99999 (z-index: 99999) para o modal aparecer acima de tudo, independente de onde esteja no código
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-screen sm:w-full sm:max-w-md h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[80vh]">
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-primary-900 z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-primary-50">
            Novo Responsável
          </h2>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              className={inputStyle}
            />
          </div>

          {/* CPF (com máscara) */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className={inputStyle}
            />
          </div>

          {/* Email com Validação Visual */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o email"
              className={`${inputStyle} ${
                emailErro
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              }`}
            />
            {emailErro && (
              <span className="text-xs text-red-500 mt-1">
                Por favor, insira um e-mail válido.
              </span>
            )}
          </div>

          {/* Telefone (com máscara) */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className={inputStyle}
            />
          </div>

          {/* Atleta */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Selecionar atleta já cadastrado{" "}
                <span className="text-red-500">*</span>
              </label>
              <AutocompleteAtleta
                atletas={atletas}
                value={formData.nomeAtleta}
                onChange={(nome) =>
                  setFormData((prev) => ({ ...prev, nomeAtleta: nome }))
                }
                placeholder="Buscar atleta..."
              />
            </div>
            <button
              type="button"
              className="bg-primary-900 hover:bg-primary-800 text-white rounded-full px-3 py-2 flex items-center shadow-md transition-all duration-150 cursor-pointer"
              title="Adicionar atleta à lista"
              disabled={!formData.nomeAtleta}
              onClick={() => {
                if (!formData.nomeAtleta) return;
                // Evitar duplicados
                if (
                  atletasAdicionados.some((a) => a.nome === formData.nomeAtleta)
                )
                  return;
                // Buscar o atleta selecionado
                const atletaObj = atletas.find(
                  (a) =>
                    (a.user_name || a.nome || a.name) === formData.nomeAtleta,
                );
                if (atletaObj) {
                  setAtletasAdicionados([
                    ...atletasAdicionados,
                    {
                      id: atletaObj.id,
                      nome:
                        atletaObj.user_name || atletaObj.nome || atletaObj.name,
                    },
                  ]);
                  setFormData({ ...formData, nomeAtleta: "" });
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Lista de atletas adicionados */}
          {atletasAdicionados.length > 0 && (
            <div className="mt-3">
              <label className="block text-sm font-semibold text-primary-900 mb-2">
                Atletas adicionados:
              </label>
              <ul className="rounded-xl bg-primary-50 p-4 space-y-3 shadow-md">
                {atletasAdicionados.map((a, idx) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary-100 hover:bg-primary-200 transition-all"
                  >
                    <span className="font-semibold text-primary-900 text-base tracking-wide">
                      <span className="inline-block bg-primary-900 text-white rounded px-2 py-0.5 mr-2 text-xs font-bold">
                        ID:{a.id}
                      </span>
                      {a.nome}
                    </span>
                    <button
                      type="button"
                      className="ml-2 bg-white border border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white rounded-full p-2 shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer"
                      title="Remover atleta"
                      onClick={() => {
                        setAtletasAdicionados(
                          atletasAdicionados.filter((item, i) => i !== idx),
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="currentColor"
                          className="opacity-10"
                        />
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
            </div>
          )}

          {/* Grau de Parentesco */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Grau de parentesco <span className="text-red-500">*</span>
            </label>
            <select
              name="parentesco"
              value={formData.parentesco}
              onChange={handleChange}
              className={
                selectStyle +
                " bg-white text-gray-700 text-sm pl-3 pr-8 py-2 rounded-lg focus:ring-1 focus:ring-primary-300 outline-none border border-gray-300 appearance-none w-full"
              }
            >
              <option value="" className="text-gray-400 font-normal">
                Selecione o grau
              </option>
              <option value="Pai">Pai</option>
              <option value="Mãe">Mãe</option>
              <option value="Avô">Avô</option>
              <option value="Avó">Avó</option>
              <option value="Tio">Tio</option>
              <option value="Tia">Tia</option>
              <option value="Irmão">Irmão</option>
              <option value="Irmã">Irmã</option>
              <option value="Responsável legal">Responsável legal</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                CEP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
                className={inputStyle}
              />
            </div>
            <div className="col-span-8">
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Bairro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Digite o bairro"
                className={inputStyle}
              />
            </div>
          </div>

          {/* Cidade e UF */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Digite a cidade"
                className={inputStyle}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                UF <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="uf"
                  value={formData.uf}
                  onChange={handleChange}
                  className={
                    selectStyle +
                    " bg-white text-gray-700 text-sm pl-3 pr-8 py-2 rounded-lg focus:ring-1 focus:ring-primary-300 outline-none border border-gray-300 appearance-none w-full"
                  }
                  style={{
                    minHeight: "40px",
                    paddingRight: "1rem",
                    minWidth: "90px",
                  }}
                >
                  <option value="" className="text-gray-400 font-normal">
                    Estado
                  </option>
                  {[
                    "AC",
                    "AL",
                    "AP",
                    "AM",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MT",
                    "MS",
                    "MG",
                    "PA",
                    "PB",
                    "PR",
                    "PE",
                    "PI",
                    "RJ",
                    "RN",
                    "RS",
                    "RO",
                    "RR",
                    "SC",
                    "SP",
                    "SE",
                    "TO",
                  ].map((uf) => (
                    <option
                      key={uf}
                      value={uf}
                      className="text-gray-700 text-sm"
                    >
                      {uf}
                    </option>
                  ))}
                </select>
                <HiChevronDown
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={15}
                />
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Nº"
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Logradouro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              placeholder="Digite o logradouro"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Complemento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              placeholder="Digite o complemento (opcional)"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end px-6 py-5 border-t border-gray-100 bg-primary-50 rounded-b-2xl">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            onClick={handleClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSalvar}
            disabled={!validarCampos()}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors shadow-sm disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none text-sm cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
