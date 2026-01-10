import { HiChevronDown } from 'react-icons/hi';
import { IoClose } from "react-icons/io5";


export default function ModalCadastroTreinador({ aberto, onClose }) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
            
            {/* Cabeçalho Fixo */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-[#101944]">Novo Treinador</h2>
              <button className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" onClick={onClose}>
                <IoClose size={24} />
              </button>
            </div>
    
            {/* Formulário Scrollável */}
            <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
              
                {/* Nome do Treinador */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                        Nome <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm"
                    />
                </div>
    
                {/* CPF */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                        CPF <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm"
                        />
                </div>

                {/* E-Mail */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                        E-Mail <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 
                        outline-none transition-all text-sm"
                      />
                    </div>

                {/* Telefone */}

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Telefone <span className="text-red-500">*</span>
                        </label>
                        <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm"
                        />
                    </div>

                {/* Título Endereço */}
                <div className="pt-4">
                  <h2 className="text-2xl font-bold text-[#101944]">Endereço</h2>
                </div>



                {/* CEP */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    CEP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 
                    outline-none transition-all text-sm"
                  />
                </div>

              {/* Linha: Bairro e Cidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Bairro */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Bairro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 
                    outline-none transition-all text-sm"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 
                    outline-none transition-all text-sm"
                  />
                </div>

              </div>

              {/* UF */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  UF <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <select
                    className="w-full appearance-none px-4 py-2.5 border border-gray-300 
                    rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20 
                    focus:border-blue-600 outline-none transition-all text-sm"
                  >
                    <option value="">Selecione</option>
                    <option>AC</option><option>AL</option><option>AP</option>
                    <option>AM</option><option>BA</option><option>CE</option>
                    <option>DF</option><option>ES</option><option>GO</option>
                    <option>MA</option><option>MT</option><option>MS</option>
                    <option>MG</option><option>PA</option><option>PB</option>
                    <option>PR</option><option>PE</option><option>PI</option>
                    <option>RJ</option><option>RN</option><option>RS</option>
                    <option>RO</option><option>RR</option><option>SC</option>
                    <option>SP</option><option>SE</option><option>TO</option>
                  </select>

                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Logradouro */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Logradouro <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 
                  outline-none transition-all text-sm"
                />
              </div>

              {/* Complemento */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 
                  outline-none transition-all text-sm"
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