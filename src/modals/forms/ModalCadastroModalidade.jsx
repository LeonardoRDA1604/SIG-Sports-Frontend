import { useState } from 'react';
import { IoClose } from "react-icons/io5";

export default function ModalCadastroModalidade({ aberto, onClose }) {
  if (!aberto) return null; // Não renderiza nada quando estiver fechado

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
        
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-[#101944]">Nova Modalidade</h2>
          <button className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          
          {/* Nome da Modalidade */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Nome da Modalidade <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm"
            />
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