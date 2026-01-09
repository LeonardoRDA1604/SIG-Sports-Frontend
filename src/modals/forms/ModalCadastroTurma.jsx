import React, { useState } from 'react';
import { HiOutlineCalendar, HiChevronDown, HiOutlineClock } from 'react-icons/hi';
import { IoClose } from "react-icons/io5";

export default function ModalCadastroTurma({ aberto, onClose }) {
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [showDiasMenu, setShowDiasMenu] = useState(false);
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [showHorarioMenu, setShowHorarioMenu] = useState(false);

  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const toggleDia = (dia) => {
    setDiasSelecionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };
  
  if (!aberto) return null; // Não renderiza nada quando estiver fechado

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
        
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-[#101944]">Nova Turma</h2>
          <button className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          
          {/* Nome da Turma */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Nome da Turma <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm"
            />
          </div>

          {/* Modalidade */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Modalidade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:border-blue-600 outline-none cursor-pointer text-sm">
                <option value="" disabled selected>Selecione</option>
                <option value="futebol">Futebol</option>
                <option value="futsal">Futsal</option>
                <option value="beach-soccer">Beach Soccer</option>
                <option value="fut7">Fut7</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:border-blue-600 outline-none cursor-pointer text-sm">
                <option value="" disabled selected>Selecione</option>
                <option value="sub-12">Sub-12</option>
                <option value="sub-14">Sub-14</option>
                <option value="sub-16">Sub-16</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Dias da Semana <span className="text-red-500">*</span>
            </label>
            <div 
              onClick={() => setShowDiasMenu(!showDiasMenu)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl flex justify-between items-center cursor-pointer bg-white hover:border-gray-400 transition-all"
            >
              <span className={`text-sm truncate pr-2 ${diasSelecionados.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                {diasSelecionados.length > 0 ? diasSelecionados.join(", ") : "Selecione os dias"}
              </span>
              <HiOutlineCalendar className="text-gray-400 shrink-0" size={20} />
            </div>
            
            {showDiasMenu && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in duration-200">
                {diasDaSemana.map(dia => (
                  <div 
                    key={dia}
                    onClick={() => toggleDia(dia)}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 last:mb-0 transition-colors ${diasSelecionados.includes(dia) ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    {dia}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Horário */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Horário <span className="text-red-500">*</span>
            </label>
            <div 
              onClick={() => setShowHorarioMenu(!showHorarioMenu)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl flex justify-between items-center cursor-pointer bg-white hover:border-gray-400 transition-all"
            >
              <span className={`text-sm ${horarioInicio ? 'text-gray-900' : 'text-gray-400'}`}>
                {horarioInicio ? `${horarioInicio} até ${horarioFim || '--:--'}` : "Definir horário"}
              </span>
              <HiOutlineClock className="text-gray-400 shrink-0" size={20} />
            </div>

            {showHorarioMenu && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Início</label>
                    <input 
                      type="time" 
                      value={horarioInicio}
                      onChange={(e) => setHorarioInicio(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Fim</label>
                    <input 
                      type="time" 
                      value={horarioFim}
                      onChange={(e) => setHorarioFim(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowHorarioMenu(false); }}
                  className="w-full py-2 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-[#002850]"
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>

          {/* Treinador */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Treinador
            </label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:border-blue-600 outline-none text-sm">
                <option value=""></option>
                <option value="1">João Silva</option>
                <option value="2">Maria Souza</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="flex items-center justify-end space-x-6 px-6 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
          <button 
            type="button" 
            className="text-[#101944] font-bold hover:underline transition-all cursor-pointer"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-10 py-2.5 bg-[#003366] text-white font-bold rounded-full hover:bg-[#002850] transition-colors shadow-md shadow-blue-900/20  cursor-pointer"
            onClick={onClose}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}