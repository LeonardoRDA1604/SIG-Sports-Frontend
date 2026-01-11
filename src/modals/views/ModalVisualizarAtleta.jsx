import { useState, useEffect } from "react";
import { IoClose, IoPerson, IoChevronDown, IoDocumentText, IoPeople, IoAddCircle, IoTrash } from "react-icons/io5";

export default function ModalVisualizarAtleta({ aberto, onClose, atleta, onSave, onOpenAddResponsible }) {
    // --- ESTADOS DE CONTROLE ---
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'obs', 'resp'
    const [formData, setFormData] = useState(null);
    const [emailErro, setEmailErro] = useState(false);
    const [novoResponsavel, setNovoResponsavel] = useState("");

    // --- ESTILIZAÇÃO PADRONIZADA (VARIÁVEIS) ---
    const labelStyle = "text-[10px] font-bold uppercase text-[#101944] px-1 mb-1 block";
    const tabStyleActive = "px-4 py-3 border-b-2 border-blue-600 font-bold text-[#101944] flex items-center gap-2 transition-all shrink-0";
    const tabStyleInactive = "px-4 py-3 text-[#101944]/60 font-semibold hover:text-[#101944] hover:bg-black/5 flex items-center gap-2 transition-all cursor-pointer shrink-0";
    
    // Função que define visual do input baseado no estado de edição e erro
    const getFieldStyle = (editing, hasError = false, isTextArea = false) => {
        // CORREÇÃO: A altura h-[42px] só é aplicada se NÃO for TextArea
        const base = `w-full p-2.5 rounded-xl font-medium transition-all outline-none border text-sm shadow-sm appearance-none ${isTextArea ? '' : 'h-[42px]'}`;
        if (!editing) return `${base} bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none`;
        if (hasError) return `${base} bg-white text-red-600 border-red-500 ring-2 ring-red-500/10`;
        return `${base} bg-white text-gray-800 border-blue-500 ring-2 ring-blue-500/10 focus:border-blue-600 cursor-text`;
    };

    const inputStyle = getFieldStyle(isEditing);

    // --- MAPEAMENTO DE DADOS (SELECTS) ---
    const opcoesTurmas = {
        "Sub-12": ["A12", "B12", "C12"],
        "Sub-14": ["A14", "B14", "C14"],
        "Sub-16": ["A16", "B16", "C16"],
        "Sub-18": ["A18", "B18", "C18"],
    };

    const listaUFs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    // --- MÁSCARAS ---
    const maskCPF = (v) => {
        const nums = v.replace(/\D/g, "").substring(0, 11);
        return nums.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };
    const maskRG = (v) => {
        const nums = v.replace(/\D/g, "").substring(0, 9);
        return nums.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };
    const maskCEP = (v) => v.replace(/\D/g, "").substring(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    const maskData = (v) => v.replace(/\D/g, "").substring(0, 8).replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
    
    // Validação de E-mail
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // --- CICLO DE VIDA (CARREGAMENTO DE DADOS) ---
    useEffect(() => {
        if (atleta) {
            const listaInicial = Array.isArray(atleta.responsiblesList) 
                ? [...atleta.responsiblesList] 
                : (atleta.responsible ? [atleta.responsible] : []);

            setFormData({ 
                ...atleta, 
                observations: atleta.observations || "", 
                responsiblesList: listaInicial 
            });
            setIsEditing(false);
            setActiveTab('info');
        }
    }, [atleta, aberto]);

    // --- MANIPULADORES DE EVENTOS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        let maskedValue = value;

        if (isEditing) {
            if (name === 'cpf') maskedValue = maskCPF(value);
            if (name === 'rg') maskedValue = maskRG(value);
            if (name === 'address.cep') maskedValue = maskCEP(value);
            if (name === 'birthDate') maskedValue = maskData(value);
            if (name === 'email') setEmailErro(!validarEmail(value) && value !== '');
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: maskedValue } }));
        } else {
            if (name === 'category') {
                setFormData(prev => ({ ...prev, [name]: value, classes: opcoesTurmas[value][0] }));
            } else {
                setFormData(prev => ({ ...prev, [name]: maskedValue }));
            }
        }
    };

    const addResponsavel = () => {
        if (novoResponsavel.trim() !== "") {
            setFormData(prev => ({
                ...prev,
                responsiblesList: [...(prev.responsiblesList || []), novoResponsavel.trim()]
            }));
            setNovoResponsavel("");
        }
    };

    const removerResponsavel = (index) => {
        setFormData(prev => ({
            ...prev,
            responsiblesList: prev.responsiblesList.filter((_, i) => i !== index)
        }));
    };

    const handleAction = () => {
        if (isEditing) {
            if (emailErro) return;
            onSave(formData);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleDiscard = () => {
        const listaOriginal = Array.isArray(atleta.responsiblesList) 
            ? [...atleta.responsiblesList] 
            : (atleta.responsible ? [atleta.responsible] : []);
        setFormData({ ...atleta, responsiblesList: listaOriginal }); 
        setEmailErro(false); 
        setIsEditing(false); 
    };

    if (!aberto || !formData) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
            <div className="w-full max-w-lg bg-[#050a24] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* --- SEÇÃO: HEADER --- */}
                <div className="p-6 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold truncate">{isEditing ? "Modo Edição" : `${formData.name} - Atleta`}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors">
                        <IoClose size={28} />
                    </button>
                </div>

                <div className="bg-[#d9d9d9] flex-1 flex flex-col overflow-hidden">
                    
                    {/* --- SEÇÃO: NAVEGAÇÃO DE TABS --- */}
                    <div className="flex px-4 bg-black/5 text-sm border-b border-black/10 shrink-0">
                        <button onClick={() => setActiveTab('info')} className={activeTab === 'info' ? tabStyleActive : tabStyleInactive}><IoPerson /> Informações</button>
                        <button onClick={() => setActiveTab('obs')} className={activeTab === 'obs' ? tabStyleActive : tabStyleInactive}><IoDocumentText /> Observações</button>
                        <button onClick={() => setActiveTab('resp')} className={activeTab === 'resp' ? tabStyleActive : tabStyleInactive}><IoPeople /> Responsáveis</button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col p-6">
                        
                        {/* --- CONTEÚDO TAB: INFORMAÇÕES --- */}
                        {activeTab === 'info' && (
                            <div className="overflow-y-auto space-y-4 custom-scrollbar pr-1">
                                <div><label className={labelStyle}>Nome Completo:</label><input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                <div><label className={labelStyle}>E-mail:</label><input name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className={getFieldStyle(isEditing, emailErro)} /></div>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    <div><label className={labelStyle}>CPF:</label><input name="cpf" value={formData.cpf} onChange={handleChange} disabled={!isEditing} className={inputStyle} placeholder="000.000.000-00" /></div>
                                    <div><label className={labelStyle}>RG:</label><input name="rg" value={formData.rg} onChange={handleChange} disabled={!isEditing} className={inputStyle} placeholder="00.000.000-0" /></div>
                                    <div><label className={labelStyle}>Data Nasc:</label><input name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                </div>

                                <div><label className={labelStyle}>Responsável Principal:</label><input name="responsible" value={formData.responsible} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-6 relative"><label className={labelStyle}>Modalidade:</label>
                                        <select name="modality" value={formData.modality} onChange={handleChange} disabled={!isEditing} className={inputStyle}>
                                            <option>Futebol de Campo</option><option>Futsal</option><option>Beach Soccer</option><option>Fut7</option>
                                        </select>
                                        {isEditing && <IoChevronDown className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" size={18} />}
                                    </div>
                                    <div className="col-span-3 relative"><label className={labelStyle}>Categoria:</label>
                                        <select name="category" value={formData.category} onChange={handleChange} disabled={!isEditing} className={inputStyle}>
                                            {Object.keys(opcoesTurmas).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                        {isEditing && <IoChevronDown className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" size={18} />}
                                    </div>
                                    <div className="col-span-3 relative"><label className={labelStyle}>Turma:</label>
                                        <select name="classes" value={formData.classes} onChange={handleChange} disabled={!isEditing} className={inputStyle}>
                                            {formData.category && opcoesTurmas[formData.category]?.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        {isEditing && <IoChevronDown className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" size={18} />}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-black/10">
                                    <h3 className="text-lg font-bold text-[#101944] mb-3 uppercase tracking-wide">Endereço</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2"><label className={labelStyle}>Logradouro:</label><input name="address.street" value={formData.address.street} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                        <div><label className={labelStyle}>Bairro:</label><input name="address.neighborhood" value={formData.address.neighborhood} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                        <div><label className={labelStyle}>Cidade:</label><input name="address.city" value={formData.address.city} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                        <div className="relative"><label className={labelStyle}>UF:</label>
                                            <select name="address.uf" value={formData.address.uf} onChange={handleChange} disabled={!isEditing} className={inputStyle}>
                                                {listaUFs.map(uf => <option key={uf}>{uf}</option>)}
                                            </select>
                                            {isEditing && <IoChevronDown className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" size={18} />}
                                        </div>
                                        <div><label className={labelStyle}>CEP:</label><input name="address.cep" value={formData.address.cep} onChange={handleChange} disabled={!isEditing} className={inputStyle} /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- CONTEÚDO TAB: OBSERVAÇÕES --- */}
                        {activeTab === 'obs' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <label className={labelStyle}>Notas e Observações:</label>
                                <textarea 
                                    name="observations" 
                                    value={formData.observations} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    /* CORREÇÃO: Chamamos getFieldStyle passando 'true' para isTextArea.
                                       Isso remove o 'h-[42px]' permitindo que o flex-1 e o !h-full funcionem.
                                    */
                                    className={`${getFieldStyle(isEditing, false, true)} flex-1 h-full! resize-none p-4 leading-relaxed custom-scrollbar`}
                                    placeholder="Nenhuma observação registrada..."
                                />
                            </div>
                        )}

                        {/* --- CONTEÚDO TAB: RESPONSÁVEIS --- */}
                        {activeTab === 'resp' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <h3 className="text-lg font-bold text-[#101944] mb-3 uppercase tracking-wide">Lista de Responsáveis:</h3>
                                {isEditing && (
                                    <div className="flex gap-2 mb-4 shrink-0">
                                        <input type="text" value={novoResponsavel} onChange={(e) => setNovoResponsavel(e.target.value)} className={`${inputStyle} flex-1`} placeholder="Novo responsável..." />
                                        <button onClick={addResponsavel} className="bg-[#050a24] text-white p-2.5 rounded-xl hover:bg-[#101944] transition-all shadow-md cursor-pointer"><IoAddCircle size={22} /></button>
                                    </div>
                                )}
                                <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-y-auto custom-scrollbar">
                                    {(formData.responsiblesList || []).map((resp, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 border-b border-black/5 last:border-0 hover:bg-gray-50 transition-colors">
                                            <span className="text-sm font-bold text-[#101944]">{index + 1}. {resp}</span>
                                            {isEditing && (
                                                <button onClick={() => removerResponsavel(index)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                                                    <IoTrash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {(!formData.responsiblesList || formData.responsiblesList.length === 0) && (
                                        <div className="p-8 text-center text-gray-400 text-sm font-medium italic">Nenhum responsável vinculado.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- SEÇÃO: RODAPÉ FIXO --- */}
                    <div className="p-6 border-t border-black/10 flex gap-3 justify-end items-center bg-black/5 shrink-0">
                        {activeTab === 'info' && !isEditing && (
                            <button 
                                onClick={onOpenAddResponsible} 
                                className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
                            >
                                Adicionar Responsável
                            </button>
                        )}
                        <button onClick={isEditing ? handleDiscard : onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer">{isEditing ? "Descartar" : "Voltar"}</button>
                        <button onClick={handleAction} className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#050a24] hover:bg-[#101944]'} text-white px-8 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer disabled:opacity-50`} disabled={isEditing && emailErro}>{isEditing ? "Salvar Alterações" : "Editar"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}