import { useState, useEffect } from "react";
import { IoClose, IoInformationCircle, IoChevronDown, IoCheckmark } from "react-icons/io5";
import { HiOutlineTable } from "react-icons/hi";

export default function ModalVisualizarModalidade({ aberto, onClose, modalidade, onSave, categoriasGlobais, turmasGlobais }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showCategoriasMenu, setShowCategoriasMenu] = useState(false);
    const [showTurmasMenu, setShowTurmasMenu] = useState(false);

    useEffect(() => {
        if (modalidade && aberto) {
            const catsArray = modalidade.category ? modalidade.category.split(", ").filter(c => c !== "") : [];
            const turmasArray = modalidade.classes ? modalidade.classes.split(", ").filter(t => t !== "") : [];
            setFormData({ ...modalidade, categoriesArray: catsArray, classesArray: turmasArray });
            setIsEditing(false);
        }
    }, [modalidade, aberto]);

    if (!aberto || !formData) return null;

    const handleDiscard = () => {
        const catsArray = modalidade.category ? modalidade.category.split(", ").filter(c => c !== "") : [];
        const turmasArray = modalidade.classes ? modalidade.classes.split(", ").filter(t => t !== "") : [];
        setFormData({ ...modalidade, categoriesArray: catsArray, classesArray: turmasArray });
        setIsEditing(false);
        setShowCategoriasMenu(false);
        setShowTurmasMenu(false);
    };

    const toggleItem = (item, arrayName) => {
        const atuais = [...formData[arrayName]];
        const novos = atuais.includes(item) ? atuais.filter(i => i !== item) : [...atuais, item];
        setFormData({ ...formData, [arrayName]: novos });
    };

    const labelStyle = "text-[10px] font-bold uppercase text-[#101944] px-1 mb-1 block";
    const getFieldStyle = (editing) => {
        const base = "w-full px-4 py-2.5 h-[42px] rounded-xl font-medium transition-all outline-none border text-sm shadow-sm flex items-center justify-between";
        return editing 
            ? `${base} bg-white text-gray-800 border-blue-500 ring-2 ring-blue-500/10` 
            : `${base} bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
            <div className="w-full max-w-lg bg-[#050a24] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold truncate">{formData.name}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"><IoClose size={28} /></button>
                </div>

                <div className="bg-[#d9d9d9] flex-1 flex flex-col overflow-hidden text-[#101944]">
                    <div className="flex px-4 bg-black/5 text-sm border-b border-black/10 shrink-0">
                        <div className="px-4 py-3 border-b-2 border-blue-600 font-bold text-[#101944] flex items-center gap-2 hover:bg-black/5 transition-colors cursor-default">
                            <IoInformationCircle /> Informações
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
                        <div>
                            <label className={labelStyle}>Nome da Modalidade:</label>
                            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className={`${getFieldStyle(isEditing)} ${isEditing ? 'cursor-text' : ''}`} />
                        </div>

                        <div className="relative">
                            <label className={labelStyle}>Categorias:</label>
                            <div onClick={() => isEditing && setShowCategoriasMenu(!showCategoriasMenu)} className={`${getFieldStyle(isEditing)} ${isEditing ? 'cursor-pointer' : ''}`}>
                                <span className="truncate">{formData.categoriesArray.length > 0 ? formData.categoriesArray.join(", ") : "Nenhuma"}</span>
                                <IoChevronDown className="text-gray-400" size={18} />
                            </div>
                            {showCategoriasMenu && isEditing && (
                                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-2 max-h-40 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1">
                                    {categoriasGlobais.map(c => (
                                        <div key={c.id} onClick={() => toggleItem(c.name, 'categoriesArray')} className={`px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 flex justify-between items-center ${formData.categoriesArray.includes(c.name) ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>
                                            {c.name} {formData.categoriesArray.includes(c.name) && <IoCheckmark />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className={labelStyle}>Turmas:</label>
                            <div onClick={() => isEditing && setShowTurmasMenu(!showTurmasMenu)} className={`${getFieldStyle(isEditing)} ${isEditing ? 'cursor-pointer' : ''}`}>
                                <span className="truncate">{formData.classesArray.length > 0 ? formData.classesArray.join(", ") : "Nenhuma"}</span>
                                <HiOutlineTable className="text-gray-400" size={18} />
                            </div>
                            {showTurmasMenu && isEditing && (
                                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-2 max-h-40 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1">
                                    {turmasGlobais.map(t => (
                                        <div key={t.id} onClick={() => toggleItem(t.nomeTurma, 'classesArray')} className={`px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 flex justify-between items-center ${formData.classesArray.includes(t.nomeTurma) ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>
                                            {t.nomeTurma} {formData.classesArray.includes(t.nomeTurma) && <IoCheckmark />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-black/10 flex gap-3 justify-end items-center bg-black/5">
                        <button onClick={isEditing ? handleDiscard : onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer">
                            {isEditing ? "Descartar" : "Voltar"}
                        </button>
                        <button onClick={() => isEditing ? onSave({...formData, category: formData.categoriesArray.join(", "), classes: formData.classesArray.join(", ")}) : setIsEditing(true)} className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#050a24] hover:bg-[#101944]'} text-white px-8 py-2.5 rounded-xl font-bold text-xs shadow-lg cursor-pointer transition-all`}>
                            {isEditing ? "Salvar Alterações" : "Editar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}