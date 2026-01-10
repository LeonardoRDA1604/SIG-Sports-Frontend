import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { IoClose } from "react-icons/io5";

export default function ModalCadastroTreinador({ aberto, onClose }) {
  const estadoInicial = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    logradouro: '',
    complemento: '',
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [emailErro, setEmailErro] = useState(false);

  // Função para fechar e resetar
  const handleClose = () => {
    setFormData(estadoInicial);
    setEmailErro(false);
    onClose();
  };

  // Máscaras
  const maskCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
  const maskTelefone = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);
  const maskCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);

  // Validação de formato de Email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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

  // Verificação de campos obrigatórios
  const validarCampos = () => {
    const obrigatorios = [
      'nome', 'cpf', 'email', 'telefone', 'cep', 
      'bairro', 'cidade', 'uf', 'logradouro'
    ];
    const preenchidos = obrigatorios.every(campo => formData[campo].trim() !== '');
    return preenchidos && !emailErro;
  };

  // Estilos padronizados
  const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm placeholder:text-gray-400";
  const selectStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm cursor-pointer";

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-[#101944]">Novo Treinador</h2>
          <button className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Nome <span className="text-red-500">*</span></label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">CPF <span className="text-red-500">*</span></label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">E-mail <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`${inputStyle} ${emailErro ? 'border-red-500 focus:border-red-500' : ''}`} 
            />
            {emailErro && <span className="text-[10px] text-red-500 mt-1">E-mail inválido</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Telefone <span className="text-red-500">*</span></label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className={inputStyle} />
          </div>

          <h3 className="text-lg font-bold text-[#101944] pt-4 border-t border-gray-50">Endereço</h3>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">CEP <span className="text-red-500">*</span></label>
            <input name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" className={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Bairro <span className="text-red-500">*</span></label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Cidade <span className="text-red-500">*</span></label>
              <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">UF <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="uf" value={formData.uf} onChange={handleChange} className={selectStyle}>
                <option value="" disabled>Selecione</option>
                {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Logradouro <span className="text-red-500">*</span></label>
            <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} className={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Complemento</label>
            <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} className={inputStyle} />
          </div>
        </div>

        {/* Rodapé Dinâmico */}
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
            disabled={!validarCampos()}
            className={`px-10 py-2.5 font-bold rounded-full transition-colors shadow-md text-sm ${
              validarCampos() 
              ? 'bg-[#003366] text-white hover:bg-[#002850] cursor-pointer shadow-blue-900/20' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleClose}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}