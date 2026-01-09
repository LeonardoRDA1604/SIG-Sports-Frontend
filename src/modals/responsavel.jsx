import React, { useState } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';

const ModalResponsavel = ({ isOpen, onClose }) => {
  const [mesmoEndereco, setMesmoEndereco] = useState(true);
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null; // Não renderiza nada se estiver fechado

  const handleSubmit = (e) => {
    e.preventDefault();
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      alert("Responsável cadastrado com sucesso!");
      onClose(); // Fecha o modal após salvar
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-8 text-slate-800">
        
        {/* Botão Fechar X */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="font-bold text-2xl text-indigo-950">Dados do responsável</h2>
          <span className="text-gray-400 text-sm">Pág 2/2</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">CPF *</label>
              <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">Nome completo *</label>
              <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">E-mail *</label>
              <input type="email" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">Telefone *</label>
              <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-1 font-semibold text-sm text-gray-700">Grau de parentesco *</label>
            <select required className="appearance-none w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione</option>
              <option value="pai">Pai</option>
              <option value="mae">Mãe</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Lógica do Endereço */}
          <div className="py-2">
            <p className="mb-2 font-semibold text-sm">Endereço do Responsável é o mesmo do atleta? *</p>
            <div className="flex gap-6">
              <button type="button" onClick={() => setMesmoEndereco(true)} className="flex items-center gap-2">
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${mesmoEndereco ? 'bg-indigo-900 border-indigo-900' : 'border-gray-400'}`}>
                  {mesmoEndereco && <div className="bg-white rounded-sm w-2 h-2"></div>}
                </div>
                <span className="text-sm">Sim</span>
              </button>
              <button type="button" onClick={() => setMesmoEndereco(false)} className="flex items-center gap-2">
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${!mesmoEndereco ? 'bg-indigo-900 border-indigo-900' : 'border-gray-400'}`}>
                  {!mesmoEndereco && <div className="bg-white rounded-sm w-2 h-2"></div>}
                </div>
                <span className="text-sm">Não</span>
              </button>
            </div>
          </div>

          {/* Seção Endereço do Responsável */}
          <div className={`space-y-4 ${mesmoEndereco ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
            <h3 className="font-bold text-indigo-950 mt-4 border-l-4 border-blue-500 pl-2">Endereço do Responsável</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="CEP *" disabled={mesmoEndereco} className="p-2 border border-gray-300 rounded-lg outline-none" />
              <input type="text" placeholder="Bairro *" disabled={mesmoEndereco} className="p-2 border border-gray-300 rounded-lg outline-none" />
            </div>
            <input type="text" placeholder="Logradouro *" disabled={mesmoEndereco} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600 px-8 py-2 rounded-xl font-bold text-white transition-colors">
              Voltar
            </button>
            <button type="submit" disabled={carregando} className="bg-indigo-950 hover:bg-black text-white px-8 py-2 rounded-xl font-bold transition-all flex items-center gap-2">
              {carregando ? <Loader2 className="animate-spin" /> : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalResponsavel;