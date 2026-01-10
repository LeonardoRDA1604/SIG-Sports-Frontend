import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { IoClose } from "react-icons/io5";

export default function ModalCadastroResponsavel({ aberto, onClose }) {
  // Definindo o estado inicial para facilitar o reset
  const estadoInicial = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    nomeAtleta: '',
    parentesco: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    logradouro: '',
    complemento: '',
  };

  const [formData, setFormData] = useState(estadoInicial); // Utiliza o estado inicial do formulário para iniciar o estado dos campos
  const [emailErro, setEmailErro] = useState(false); // Estado de erro do email

  // Função que valida se todos os campos com * estão preenchidos e o email é válido
  const validarCampos = () => {
    const camposObrigatorios = [
      'nome', 'cpf', 'email', 'telefone', 'nomeAtleta', 
      'parentesco', 'cep', 'bairro', 'cidade', 'uf', 'logradouro', 'complemento'
    ];
    
    // Verifica se todos os campos obrigatórios têm conteúdo (removendo espaços vazios)
    const todosPreenchidos = camposObrigatorios.every(campo => formData[campo]?.trim() !== '');
    
    // O botão só habilita se tudo estiver preenchido E não houver erro de formato de email
    return todosPreenchidos && !emailErro;
  };
  
  // Função para fechar o modal e resetar os campos
  const handleClose = () => {
    setFormData(estadoInicial); // Reseta os inputs
    setEmailErro(false);         // Reseta o estado de erro do email
    onClose();                   // Chama a função de fechar vinda do componente pai
  };

  // Máscara para CPF
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Máscaras para os campos Telefone e CEP
  const maskTelefone = (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);
  const maskCEP = (value) => value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);

  // Validação de email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Lida com mudanças nos campos que contém máscara ou validação, para atualizar suas funções
  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'cpf') maskedValue = maskCPF(value);
    if (name === 'telefone') maskedValue = maskTelefone(value);
    if (name === 'cep') maskedValue = maskCEP(value);

    if (name === 'email') {
      setEmailErro(!validarEmail(value) && value !== '');
    }

    setFormData({ ...formData, [name]: maskedValue });
  };

  // Padronização dos estilos dos inputs
  const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm placeholder:text-gray-400";
  const selectStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm cursor-pointer";

  if (!aberto) return null; // Não renderiza nada quando estiver fechado

  return (
    // z-99999 (z-index: 99999) para o modal aparecer acima de tudo, independente de onde esteja no código
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
        
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-[#101944]">Novo Responsável</h2>
          <button className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Nome Completo <span className="text-red-500">*</span></label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputStyle} />
          </div>
          
          {/* CPF (com máscara) */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">CPF <span className="text-red-500">*</span></label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className={inputStyle} />
          </div>
          
          {/* Email com Validação Visual */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`${inputStyle} ${emailErro ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`} 
            />
            {emailErro && <span className="text-xs text-red-500 mt-1">Por favor, insira um e-mail válido.</span>}
          </div>
          
          {/* Telefone (com máscara) */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Telefone <span className="text-red-500">*</span></label>
            <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className={inputStyle} />
          </div>

          {/* Atleta */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Nome completo do atleta <span className="text-red-500">*</span></label>
            <input type="text" name="nomeAtleta" value={formData.nomeAtleta} onChange={handleChange} className={inputStyle} />
          </div>

          {/* Grau de Parentesco */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Grau de parentesco <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="parentesco" value={formData.parentesco} onChange={handleChange} className={selectStyle}>
                <option value="" disabled selected>Selecione</option>
                <option value="mae">Mãe</option>
                <option value="pai">Pai</option>
                <option value="avo_f">Avó</option>
                <option value="avo_m">Avô</option>
                <option value="irmao">Irmão/Irmã</option>
                <option value="tio">Tio/Tia</option>
                <option value="outro">Outro</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Divisor Endereço */}
          <h3 className="text-lg font-bold text-[#101944] pt-4 border-t border-gray-50">Endereço</h3>

          {/* CEP (com máscara) e Bairro */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="block text-sm font-semibold text-slate-600 mb-1">CEP <span className="text-red-500">*</span></label>
              <input name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" className={inputStyle} />
            </div>
            <div className="col-span-7">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Bairro <span className="text-red-500">*</span></label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* Cidade e UF */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Cidade <span className="text-red-500">*</span></label>
              <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className={inputStyle} />
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">UF <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="uf" value={formData.uf} onChange={handleChange} className={selectStyle}>
                  <option value="" disabled selected>Selecione</option>
                  {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Logradouro <span className="text-red-500">*</span></label>
            <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} className={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Complemento <span className="text-red-500">*</span></label>
            <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} className={inputStyle} />
          </div>

        </div>

        {/* Rodapé Fixo */}
        <div className="flex items-center justify-end space-x-6 px-6 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
          <button 
            type="button" 
            className="text-[#101944] font-bold hover:underline transition-all cursor-pointer text-sm"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className={`px-10 py-2.5 font-bold rounded-full transition-colors shadow-md text-sm ${
              validarCampos() 
              ? 'bg-[#003366] text-white hover:bg-[#002850] cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
            disabled={!validarCampos()}
            onClick={handleClose}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}