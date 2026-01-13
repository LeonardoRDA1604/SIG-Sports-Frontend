import { useState, useEffect } from "react";
import { IoClose, IoInformationCircle, IoChevronDown, IoCheckmark } from "react-icons/io5";
import { HiOutlineTable } from "react-icons/hi";

export default function ModalVisualizarCategoria({ aberto, onClose, categoria, onSave, turmasGlobais, modalidadesGlobais }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showTurmasMenu, setShowTurmasMenu] = useState(false);
    const [showModalityMenu, setShowModalityMenu] = useState(false);

    useEffect(() => {
        if (categoria && aberto) {
            const turmasArray = categoria.classes ? categoria.classes.split(", ").filter(t => t !== "") : [];
            setFormData({ ...categoria, classesArray: turmasArray });
            setIsEditing(false);
            setShowTurmasMenu(false);
            setShowModalityMenu(false);
        }
    }, [categoria, aberto]);

    if (!aberto || !formData) return null;

    const handleDiscard = () => {
        const turmasArray = categoria.classes ? categoria.classes.split(", ").filter(t => t !== "") : [];
        setFormData({ ...categoria, classesArray: turmasArray });
        setIsEditing(false);
        setShowTurmasMenu(false);
        setShowModalityMenu(false);
    };

    const toggleTurma = (nomeTurma) => {
        const atuais = [...formData.classesArray];
        const novos = atuais.includes(nomeTurma) ? atuais.filter(t => t !== nomeTurma) : [...atuais, nomeTurma];
        setFormData({ ...formData, classesArray: novos });
    };

    const labelStyle = "text-[10px] font-bold uppercase text-[#101944] px-1 mb-1 block";
    const getFieldStyle = (editing) => `w-full px-4 py-2.5 h-[42px] rounded-xl font-medium transition-all outline-none border text-sm shadow-sm flex items-center justify-between ${editing ? "bg-white text-gray-800 border-blue-500 ring-2 ring-blue-500/10 cursor-pointer" : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none"}`;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
            <div className="w-full max-w-lg bg-[#050a24] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold truncate">{formData.name}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"><IoClose size={28} /></button>
                </div>

                <div className="bg-[#d9d9d9] flex-1 flex flex-col overflow-hidden text-[#101944]">
                    <div className="flex px-4 bg-black/5 text-sm border-b border-black/10 shrink-0">
                        <div className="px-4 py-3 border-b-2 border-blue-600 font-bold flex items-center gap-2">
                            <IoInformationCircle /> Informações
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Nome da Categoria */}
                        <div>
                            <label className={labelStyle}>Nome da Categoria:</label>
                            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className={getFieldStyle(isEditing)} />
                        </div>

                        {/* Menu de Turmas (Multiseleção) */}
                        <div className="relative">
                            <label className={labelStyle}>Turmas Vinculadas:</label>
                            <div onClick={() => isEditing && setShowTurmasMenu(!showTurmasMenu)} className={getFieldStyle(isEditing)}>
                                <span className="truncate">{formData.classesArray.length > 0 ? formData.classesArray.join(", ") : "Nenhuma turma selecionada"}</span>
                                <HiOutlineTable className="text-gray-400" size={18} />
                            </div>
                            {showTurmasMenu && isEditing && (
                                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {turmasGlobais.map(t => (
                                        <div key={t.id} onClick={() => toggleTurma(t.nomeTurma)} className={`px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 flex justify-between items-center ${formData.classesArray.includes(t.nomeTurma) ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>
                                            {t.nomeTurma} {formData.classesArray.includes(t.nomeTurma) && <IoCheckmark />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Menu de Modalidade (Seleção Única) */}
                        <div className="relative">
                            <label className={labelStyle}>Modalidade:</label>
                            <div onClick={() => isEditing && setShowModalityMenu(!showModalityMenu)} className={getFieldStyle(isEditing)}>
                                <span>{formData.modality || "Selecione"}</span>
                                <IoChevronDown className="text-gray-400" size={18} />
                            </div>
                            {showModalityMenu && isEditing && (
                                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2">
                                    {modalidadesGlobais.map(m => (
                                        <div key={m.id} onClick={() => { setFormData({...formData, modality: m.name}); setShowModalityMenu(false); }} className={`px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 ${formData.modality === m.name ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>
                                            {m.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <div className="p-6 border-t border-black/10 flex gap-3 justify-end items-center bg-black/5">
                        <button onClick={isEditing ? handleDiscard : onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all">
                            {isEditing ? "Descartar" : "Voltar"}
                        </button>
                        <button onClick={() => isEditing ? onSave({...formData, classes: formData.classesArray.join(", ")}) : setIsEditing(true)} className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#050a24] hover:bg-[#101944]'} text-white px-8 py-2.5 rounded-xl font-bold text-xs shadow-lg cursor-pointer transition-all`}>
                            {isEditing ? "Salvar Alterações" : "Editar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}