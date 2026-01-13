import { useState, useEffect } from "react";
import { HiOutlineCalendar, HiChevronDown, HiOutlineClock } from "react-icons/hi";
import { IoClose, IoInformationCircle, IoPeople, IoTrash, IoAddCircle } from "react-icons/io5";

export default function ModalVisualizarTurma({ aberto, onClose, turma, onSave, atletasGlobais }) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const [formData, setFormData] = useState(null);
    const [atletaParaAdicionar, setAtletaParaAdicionar] = useState("");

    // Estados dos Menus Interativos
    const [showDiasMenu, setShowDiasMenu] = useState(false);
    const [showHorarioMenu, setShowHorarioMenu] = useState(false);
    const [horarioInicio, setHorarioInicio] = useState("");
    const [horarioFim, setHorarioFim] = useState("");

    const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

    useEffect(() => {
        if (turma && aberto) {
            setFormData({ ...turma, athletes: turma.athletes || [] });
            const [inicio, fim] = (turma.workTimes || "00:00 - 00:00").split(" - ");
            setHorarioInicio(inicio); setHorarioFim(fim);
            setIsEditing(false); setActiveTab("info");
        }
    }, [turma, aberto]);

    if (!aberto || !formData) return null;

    const handleDiscard = () => {
        setFormData({ ...turma, athletes: turma.athletes || [] });
        const [inicio, fim] = (turma.workTimes || "00:00 - 00:00").split(" - ");
        setHorarioInicio(inicio); setHorarioFim(fim);
        setIsEditing(false); setShowDiasMenu(false); setShowHorarioMenu(false);
    };

    const toggleDia = (dia) => {
        const atuais = formData.days ? formData.days.split(", ") : [];
        const novos = atuais.includes(dia) ? atuais.filter(d => d !== dia) : [...atuais, dia];
        setFormData({ ...formData, days: novos.join(", ") });
    };

const labelStyle = "text-[10px] font-bold uppercase text-[#101944] px-1 mb-1 block";
    const tabStyleActive = "px-4 py-3 border-b-2 border-blue-600 font-bold text-[#101944] flex items-center gap-2 transition-all shrink-0 cursor-default";
    const tabStyleInactive = "px-4 py-3 text-[#101944]/60 font-semibold hover:text-[#101944] hover:bg-black/5 flex items-center gap-2 transition-all cursor-pointer shrink-0";

    const getFieldStyle = (editing) => `w-full px-4 py-2.5 h-[42px] rounded-xl font-medium transition-all outline-none border text-sm shadow-sm appearance-none ${editing ? "bg-white text-gray-800 border-blue-500 ring-2 ring-blue-500/10" : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none"}`;
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
            <div className="w-full max-w-lg bg-[#050a24] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold truncate">{isEditing ? "Modo Edição" : `Turma ${formData.nomeTurma}`}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"><IoClose size={28} /></button>
                </div>

                <div className="bg-[#d9d9d9] flex-1 flex flex-col overflow-hidden text-[#101944]">
                    <div className="flex px-4 bg-black/5 text-sm border-b border-black/10 shrink-0">
                        <button 
                            onClick={() => setActiveTab("info")} 
                            className={activeTab === "info" ? tabStyleActive : tabStyleInactive}
                        >
                            <IoInformationCircle /> Informações
                        </button>
                        <button 
                            onClick={() => setActiveTab("atletas")} 
                            className={activeTab === "atletas" ? tabStyleActive : tabStyleInactive}
                        >
                            <IoPeople /> Alunos
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col p-6">
                        {activeTab === "info" ? (
                            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1">
                                <div>
                                    <label className={labelStyle}>Nome da Turma:</label>
                                    <input 
                                        name="nomeTurma" 
                                        value={formData.nomeTurma} 
                                        onChange={(e) => setFormData({...formData, nomeTurma: e.target.value})} 
                                        disabled={!isEditing} 
                                        className={getFieldStyle(isEditing)} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative"><label className={labelStyle}>Modalidade:</label>
                                        <select value={formData.modality} onChange={(e) => setFormData({...formData, modality: e.target.value})} disabled={!isEditing} className={getFieldStyle(isEditing)}>
                                            <option>Futebol</option><option>Futsal</option><option>Beach Soccer</option><option>Fut7</option>
                                        </select>
                                        {isEditing && <HiChevronDown className="absolute right-3 bottom-3 text-gray-400 pointer-events-none" />}
                                    </div>
                                    <div className="relative"><label className={labelStyle}>Categoria:</label>
                                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={!isEditing} className={getFieldStyle(isEditing)}>
                                            <option>Sub-12</option><option>Sub-14</option><option>Sub-16</option><option>Sub-18</option>
                                        </select>
                                        {isEditing && <HiChevronDown className="absolute right-3 bottom-3 text-gray-400 pointer-events-none" />}
                                    </div>
                                </div>
                                
                                <div className="relative"><label className={labelStyle}>Dias da Semana:</label>
                                    <div onClick={() => isEditing && setShowDiasMenu(!showDiasMenu)} className={`${getFieldStyle(isEditing)} flex justify-between items-center ${isEditing && 'cursor-pointer'}`}><span className="truncate">{formData.days}</span><HiOutlineCalendar size={18} className="text-gray-400" /></div>
                                    {showDiasMenu && isEditing && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2">
                                            {diasDaSemana.map(dia => <div key={dia} onClick={() => toggleDia(dia)} className={`px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 ${formData.days.includes(dia) ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>{dia}</div>)}
                                        </div>
                                    )}
                                </div>

                                <div className="relative"><label className={labelStyle}>Horário:</label>
                                    <div onClick={() => isEditing && setShowHorarioMenu(!showHorarioMenu)} className={`${getFieldStyle(isEditing)} flex justify-between items-center ${isEditing && 'cursor-pointer'}`}><span>{horarioInicio} - {horarioFim}</span><HiOutlineClock size={18} className="text-gray-400" /></div>
                                    {showHorarioMenu && isEditing && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 space-y-3">
                                            <div className="flex gap-2"><input type="time" value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" /><input type="time" value={horarioFim} onChange={e => setHorarioFim(e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" /></div>
                                            <button onClick={() => setShowHorarioMenu(false)} className="w-full py-2 bg-blue-900 text-white rounded-lg text-xs font-bold cursor-pointer">Confirmar</button>
                                        </div>
                                    )}
                                </div>
                                <div><label className={labelStyle}>Treinador:</label><input value={formData.coach} onChange={(e) => setFormData({...formData, coach: e.target.value})} disabled={!isEditing} className={getFieldStyle(isEditing)} /></div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-semibold text-gray-500 italic px-1">Total: {formData.athletes?.length || 0}</span>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <select value={atletaParaAdicionar} onChange={e => setAtletaParaAdicionar(e.target.value)} className="px-3 h-10.5 border border-blue-500 ring-2 ring-blue-500/10 rounded-xl text-xs outline-none bg-white"><option value="">Selecionar aluno...</option>{atletasGlobais?.filter(a => !formData.athletes.includes(a.name)).map(a => <option key={a.id} value={a.name}>{a.name}</option>)}</select>
                                            <button onClick={() => { if(atletaParaAdicionar) setFormData({...formData, athletes: [...formData.athletes, atletaParaAdicionar]}); setAtletaParaAdicionar(""); }} className="bg-blue-900 hover:bg-blue-950 text-white px-6 h-10.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"><IoAddCircle size={18} /> Adicionar</button>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white rounded-2xl border border-black/10 overflow-y-auto custom-scrollbar">
                                    {formData.athletes.map((nome, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 border-b border-black/5 last:border-0 hover:bg-blue-50 transition-colors"><span className="text-sm font-bold">{idx + 1}. {nome}</span>{isEditing && <button onClick={() => setFormData({...formData, athletes: formData.athletes.filter((_, i) => i !== idx)})} className="text-red-500 p-1 cursor-pointer"><IoTrash size={18} /></button>}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t border-black/10 flex gap-3 justify-end items-center bg-black/5">
                        <button onClick={isEditing ? handleDiscard : onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer">{isEditing ? "Descartar" : "Voltar"}</button>
                        <button onClick={() => isEditing ? onSave({...formData, workTimes: `${horarioInicio} - ${horarioFim}`}) : setIsEditing(true)} className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#050a24]'} text-white px-8 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer`}>{isEditing ? "Salvar Alterações" : "Editar"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}