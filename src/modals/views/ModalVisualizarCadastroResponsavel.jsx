import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { HiChevronDown } from 'react-icons/hi';

export default function ModalVisualizarCadastroResponsavel({ aberto, onClose, onSave, atletaContexto }) {
    // --- ESTADOS DO FORMULÁRIO ---
    const [enderecoMesmoAtleta, setEnderecoMesmoAtleta] = useState(true);
    const [formData, setFormData] = useState({
        respCpf: '',
        respNome: '',
        respEmail: '',
        respTelefone: '',
        respParentesco: '',
        respCep: '',
        respBairro: '',
        respCidade: '',
        respLogradouro: '',
        respComplemento: ''
    });

    // --- MÁSCARAS DE ENTRADA ---
    const maskCPF = (v) => v.replace(/\D/g, "").substring(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    const maskTelefone = (v) => v.replace(/\D/g, "").substring(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    const maskCEP = (v) => v.replace(/\D/g, "").substring(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

    // --- MANIPULAÇÃO DE DADOS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        let maskedValue = value;

        if (name === 'respCpf') maskedValue = maskCPF(value);
        if (name === 'respTelefone') maskedValue = maskTelefone(value);
        if (name === 'respCep') maskedValue = maskCEP(value);

        setFormData(prev => ({ ...prev, [name]: maskedValue }));
    };

    const handleFinalSave = () => {
        // Validação básica de campos obrigatórios
        if (!formData.respNome || !formData.respCpf || !formData.respTelefone) {
            alert("Por favor, preencha os campos obrigatórios.");
            return;
        }

        // Se o endereço for o mesmo, injeta os dados do atletaContexto antes de salvar
        const dataToSave = enderecoMesmoAtleta ? {
            ...formData,
            respCep: atletaContexto?.address?.cep || '',
            respBairro: atletaContexto?.address?.neighborhood || '',
            respCidade: atletaContexto?.address?.city || '',
            respLogradouro: atletaContexto?.address?.street || '',
            respComplemento: atletaContexto?.address?.complement || ''
        } : formData;

        onSave(dataToSave);
        // Resetar o formulário após salvar
        setFormData({ respCpf: '', respNome: '', respEmail: '', respTelefone: '', respParentesco: '', respCep: '', respBairro: '', respCidade: '', respLogradouro: '', respComplemento: '' });
        setEnderecoMesmoAtleta(true);
    };

    if (!aberto) return null;

    // --- ESTILOS REUTILIZÁVEIS ---
    const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm placeholder:text-gray-400 text-gray-800 font-medium";
    const labelStyle = "block text-sm font-bold text-[#101944] mb-1";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-110000 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-[#101944]">Dados do responsável</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                        <IoClose size={24} />
                    </button>
                </div>

                {/* --- CONTEÚDO SCROLLÁVEL --- */}
                <div className="overflow-y-auto p-6 space-y-5 custom-scrollbar bg-white">
                    {/* Campos Básicos */}
                    <div>
                        <label className={labelStyle}>CPF *</label>
                        <input name="respCpf" value={formData.respCpf} onChange={handleChange} className={inputStyle} placeholder="000.000.000-00" />
                    </div>

                    <div>
                        <label className={labelStyle}>Nome completo *</label>
                        <input name="respNome" value={formData.respNome} onChange={handleChange} className={inputStyle} placeholder="Digite o nome completo" />
                    </div>

                    <div>
                        <label className={labelStyle}>E-mail *</label>
                        <input name="respEmail" type="email" value={formData.respEmail} onChange={handleChange} className={inputStyle} placeholder="exemplo@email.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Telefone *</label>
                            <input name="respTelefone" value={formData.respTelefone} onChange={handleChange} className={inputStyle} placeholder="(00) 00000-0000" />
                        </div>
                        <div className="relative">
                            <label className={labelStyle}>Parentesco *</label>
                            <select name="respParentesco" value={formData.respParentesco} onChange={handleChange} className={`${inputStyle} appearance-none bg-white cursor-pointer`}>
                                <option value="">Selecione</option>
                                <option value="Pai">Pai</option>
                                <option value="Mãe">Mãe</option>
                                <option value="Avô/Avó">Avô/Avó</option>
                                <option value="Tio/Tia">Tio/Tia</option>
                                <option value="Outro">Outro</option>
                            </select>
                            <HiChevronDown className="absolute right-3 bottom-3 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    {/* Toggle de Endereço */}
                    <div className="pt-2">
                        <label className="text-sm font-bold text-[#101944]">Endereço Responsável é o mesmo do atleta? *</label>
                        <div className="flex gap-6 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#101944]" onClick={() => setEnderecoMesmoAtleta(true)}>
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${enderecoMesmoAtleta ? 'bg-[#003366] border-[#003366]' : 'border-gray-300'}`}>
                                    {enderecoMesmoAtleta && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                Sim
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#101944]" onClick={() => setEnderecoMesmoAtleta(false)}>
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${!enderecoMesmoAtleta ? 'bg-[#003366] border-[#003366]' : 'border-gray-300'}`}>
                                    {!enderecoMesmoAtleta && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                Não
                            </label>
                        </div>
                    </div>

                    {/* Seção de Endereço Manual */}
                    {!enderecoMesmoAtleta && (
                        <div className="space-y-4 pt-4 border-t border-gray-100 animate-fadeIn">
                            <h3 className="text-base font-bold text-[#101944] uppercase tracking-wide">Endereço do Responsável</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>CEP *</label>
                                    <input name="respCep" value={formData.respCep} onChange={handleChange} className={inputStyle} placeholder="00000-000" />
                                </div>
                                <div>
                                    <label className={labelStyle}>Bairro *</label>
                                    <input name="respBairro" value={formData.respBairro} onChange={handleChange} className={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Cidade *</label>
                                <input name="respCidade" value={formData.respCidade} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Logradouro *</label>
                                <input name="respLogradouro" value={formData.respLogradouro} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Complemento</label>
                                <input name="respComplemento" value={formData.respComplemento} onChange={handleChange} className={inputStyle} />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- FOOTER FIXO --- */}
                <div className="p-6 border-t border-gray-100 flex gap-4 justify-end bg-gray-50 shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-8 py-2.5 bg-gray-400 text-white font-bold rounded-full hover:bg-gray-500 transition-colors shadow-sm"
                    >
                        Voltar
                    </button>
                    <button 
                        onClick={handleFinalSave} 
                        className="px-10 py-2.5 bg-[#003366] text-white font-bold rounded-full hover:bg-[#050a24] transition-all shadow-md active:scale-95"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}