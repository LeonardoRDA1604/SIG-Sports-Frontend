import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { IoClose } from "react-icons/io5";

export default function ModalCadastroAtleta({ aberto, onClose }) {
  const [step, setStep] = useState(1); // Controle da página (1 ou 2)
  const [enderecoMesmoAtleta, setEnderecoMesmoAtleta] = useState(true); // Boolean de Mesmo Endereço do Atleta
  const [emailErro, setEmailErro] = useState(false); // Estado de erro do email

  const estadoInicial = {
    // Dados Atleta (Pág 1)
    nome: '', nascimento: '', cpf: '', rg: '', escola: '',
    modalidade: '', categoria: '', turma: '', cep: '',
    bairro: '', cidade: '', logradouro: '', complemento: '', observacoes: '',
    // Dados Responsável (Pág 2)
    respCpf: '', respNome: '', respEmail: '', respTelefone: '', respParentesco: '',
    respCep: '', respBairro: '', respCidade: '', respLogradouro: '', respComplemento: ''
  };

  const [formData, setFormData] = useState(estadoInicial); // Utiliza o estado inicial do formulário para iniciar o estado dos campos

  // Mapeamento de turmas por categoria
  const opcoesTurmas = {
    "sub-12": ["A12", "B12", "C12"],
    "sub-14": ["A14", "B14", "C14"],
    "sub-16": ["A16", "B16", "C16"],
  };
  
  // Validação de formato de Email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para validar campos obrigatórios de acordo com o Step
  const validarCampos = () => {
    if (step === 1) {
      const obrigatoriosStep1 = [
        'nome', 'nascimento', 'escola', 'modalidade', 
        'categoria', 'turma', 'cep', 'bairro', 'cidade', 'logradouro'
      ];
      return obrigatoriosStep1.every(campo => formData[campo].trim() !== '');
    } else {
      const obrigatoriosStep2Base = ['respCpf', 'respNome', 'respEmail', 'respTelefone', 'respParentesco'];
      // Verifica preenchimento E se não há erro de formato de email
      const baseValida = obrigatoriosStep2Base.every(campo => formData[campo].trim() !== '') && !emailErro;
      
      if (enderecoMesmoAtleta) return baseValida;

      const obrigatoriosEnderecoResp = ['respCep', 'respBairro', 'respCidade', 'respLogradouro'];
      return baseValida && obrigatoriosEnderecoResp.every(campo => formData[campo].trim() !== '');
    }
  };

  // Reset do modal ao fechar
  const handleClose = () => {
    setFormData(estadoInicial);
    setStep(1);
    setEnderecoMesmoAtleta(true);
    setEmailErro(false);
    onClose();
  };

  // Máscaras
  const maskCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
  const maskRG = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4').substring(0, 12);
  const maskData = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 10);
  const maskCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);
  const maskTelefone = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name.toLowerCase().includes('cpf')) maskedValue = maskCPF(value);
    if (name.toLowerCase().includes('rg')) maskedValue = maskRG(value);
    if (name.toLowerCase().includes('nascimento')) maskedValue = maskData(value);
    if (name.toLowerCase().includes('cep')) maskedValue = maskCEP(value);
    if (name.toLowerCase().includes('telefone')) maskedValue = maskTelefone(value);

    if (name === 'respEmail') {
      setEmailErro(!validarEmail(value) && value !== '');
    }

    // Se mudar a categoria, reseta a turma selecionada para evitar inconsistência
    if (name === 'categoria') {
      setFormData(prev => ({ ...prev, [name]: value, turma: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: maskedValue }));
    }
  };

  // Padronização dos estilos dos inputs
  const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm placeholder:text-gray-400";
  // Estilo para Selects normais (Categoria, Modalidade)
  const selectStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm cursor-pointer";
  // Estilo específico para a Turma (com lógica de cinza)
  const turmaSelectStyle = `w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm transition-colors ${!formData.categoria ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 cursor-pointer'}`;

  if (!aberto) return null; // Não renderiza nada quando estiver fechado

  return (
    // z-99999 (z-index: 99999) para o modal aparecer acima de tudo, independente de onde esteja no código
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-start px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#101944]">Novo Atleta</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium">Pág {step}/2</span>
            <button className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" onClick={handleClose}>
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5 flex-1">
          {step === 1 ? (
            <>
              {/* --- PÁGINA 1 --- */}
              <h3 className="text-lg font-bold text-[#101944]">Dados do atleta</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Nome Completo <span className="text-red-500">*</span></label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Data de nascimento <span className="text-red-500">*</span></label>
                <input type="text" name="nascimento" placeholder="DD/MM/AAAA" value={formData.nascimento} onChange={handleChange} className={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">CPF</label>
                  <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">RG</label>
                  <input type="text" name="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-0" className={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Nome da escola <span className="text-red-500">*</span></label>
                <input type="text" name="escola" value={formData.escola} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Modalidade <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="modalidade" value={formData.modalidade} onChange={handleChange} className={selectStyle}>
                    <option value="" disabled>Selecione</option>
                    <option value="futebol">Futebol</option>
                    <option value="futsal">Futsal</option>
                    <option value="beach-soccer">Beach Soccer</option>
                    <option value="fut7">Fut7</option>
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Categoria <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="categoria" value={formData.categoria} onChange={handleChange} className={selectStyle}>
                    <option value="" disabled>Selecione</option>
                    <option value="sub-12">Sub-12</option>
                    <option value="sub-14">Sub-14</option>
                    <option value="sub-16">Sub-16</option>
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Turma <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="turma" value={formData.turma} onChange={handleChange} className={turmaSelectStyle} disabled={!formData.categoria}>
                    <option value="" disabled>Selecione a turma</option>
                    {formData.categoria && opcoesTurmas[formData.categoria]?.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#101944] pt-4 border-t border-gray-50">Endereço do atleta</h3>
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
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Cidade <span className="text-red-500">*</span></label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Logradouro <span className="text-red-500">*</span></label>
                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} className={inputStyle} />
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-bold text-[#101944]">Observações</h3>
                <p className="text-xs text-gray-500 mb-2">Insira as informações complementares sobre o aluno.</p>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Digite aqui..." className={`${inputStyle} min-h-32 resize-none pt-3`} />
              </div>
            </>
          ) : (
            <>
              {/* --- PÁGINA 2 --- */}
              <h3 className="text-lg font-bold text-[#101944]">Dados do responsável</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">CPF <span className="text-red-500">*</span></label>
                <input type="text" name="respCpf" value={formData.respCpf} onChange={handleChange} placeholder="000.000.000-00" className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Nome completo <span className="text-red-500">*</span></label>
                <input type="text" name="respNome" value={formData.respNome} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">E-mail <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="respEmail" 
                  value={formData.respEmail} 
                  onChange={handleChange} 
                  className={`${inputStyle} ${emailErro ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`} 
                />
                {emailErro && <span className="text-xs text-red-500 mt-1">Por favor, insira um e-mail válido.</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Telefone <span className="text-red-500">*</span></label>
                <input type="text" name="respTelefone" value={formData.respTelefone} onChange={handleChange} placeholder="(00) 00000-0000" className={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Grau de parentesco <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="respParentesco" value={formData.respParentesco} onChange={handleChange} className={selectStyle}>
                    <option value="" disabled>Selecione</option>
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

              <div className="pt-4">
                <label className="block text-sm font-semibold text-slate-600 mb-3">Endereço Responsável é o mesmo do atleta ? <span className="text-red-500">*</span></label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#101944]" onClick={() => setEnderecoMesmoAtleta(true)}>
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${enderecoMesmoAtleta ? 'bg-[#003366] border-[#003366]' : 'border-gray-300'}`}>
                      {enderecoMesmoAtleta && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    Sim
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#101944]" onClick={() => setEnderecoMesmoAtleta(false)}>
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${!enderecoMesmoAtleta ? 'bg-[#003366] border-[#003366]' : 'border-gray-300'}`}>
                      {!enderecoMesmoAtleta && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    Não
                  </label>
                </div>
              </div>

              {!enderecoMesmoAtleta && (
                <div className="pt-4 space-y-4">
                  <h3 className="text-lg font-bold text-[#101944]">Endereço do Responsável</h3>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                      <label className="block text-sm font-semibold text-slate-600 mb-1">CEP <span className="text-red-500">*</span></label>
                      <input name="respCep" value={formData.respCep} onChange={handleChange} placeholder="00000-000" className={inputStyle} />
                    </div>
                    <div className="col-span-7">
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Bairro <span className="text-red-500">*</span></label>
                      <input type="text" name="respBairro" value={formData.respBairro} onChange={handleChange} className={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Cidade <span className="text-red-500">*</span></label>
                    <input type="text" name="respCidade" value={formData.respCidade} onChange={handleChange} className={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Logradouro <span className="text-red-500">*</span></label>
                    <input type="text" name="respLogradouro" value={formData.respLogradouro} onChange={handleChange} className={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Complemento</label>
                    <input type="text" name="respComplemento" value={formData.respComplemento} onChange={handleChange} className={inputStyle} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="flex items-center justify-end space-x-6 px-6 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
          <button 
            type="button" 
            className="text-[#101944] font-bold hover:underline transition-all cursor-pointer text-sm"
            onClick={step === 1 ? handleClose : () => setStep(1)}
          >
            {step === 1 ? 'Cancelar' : 'Voltar'}
          </button>
          
          <button 
            type="button" 
            className={`px-10 py-2.5 font-bold rounded-full transition-colors shadow-md text-sm ${
              validarCampos() 
              ? 'bg-[#003366] text-white hover:bg-[#002850] cursor-pointer shadow-blue-900/20' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
            disabled={!validarCampos()}
            onClick={() => step === 1 ? setStep(2) : handleClose()}
          >
            {step === 1 ? 'Continuar' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}