import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export default function ModalCadastroUsuario({
  aberto,
  editandoUsuario,
  formDataUsuario,
  onChange,
  onSalvar,
  onCancelar,
}) {
  if (!aberto) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-99999">
      <div className="w-screen sm:w-full sm:max-w-lg h-screen sm:h-auto bg-primary-50 rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 flex flex-col max-h-screen sm:max-h-[80vh]">
        {/* Cabeçalho Fixo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 z-10 rounded-t-2xl bg-primary-900">
          <h2 className="text-xl font-bold text-primary-50">
            {editandoUsuario ? "Editar Usuário" : "Novo Usuário"}
          </h2>
          <button
            className="text-primary-50 hover:bg-primary-800/60 p-1 rounded-full transition-colors cursor-pointer"
            onClick={onCancelar}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário Scrollável */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSalvar();
            }}
            className="space-y-6"
          >
            {/* Seção: Dados pessoais */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Dados pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campo Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formDataUsuario.name}
                    onChange={onChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                {/* Campo Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formDataUsuario.email}
                    onChange={onChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                    placeholder="nome@exemplo.com"
                    required
                  />
                </div>

                {/* Campo CPF */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formDataUsuario.cpf}
                    onChange={onChange}
                    maxLength="14"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                    placeholder="XXX.XXX.XXX-XX"
                    required
                  />
                </div>

                {/* Campo RG */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    RG
                  </label>
                  <input
                    type="text"
                    name="rg"
                    value={formDataUsuario.rg}
                    onChange={onChange}
                    maxLength="9"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                    placeholder="XXX.XXX.X"
                  />
                </div>

                {/* Campo Data de Nascimento */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formDataUsuario.birthDate}
                    onChange={onChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm bg-white"
                    required
                  />
                </div>

                {/* Campo Telefone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formDataUsuario.phone}
                    onChange={onChange}
                    maxLength="15"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Acesso e permissão */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">
                Acesso e permissão
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campo Função */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Função
                  </label>
                  <select
                    name="role"
                    value={formDataUsuario.role}
                    onChange={onChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                  >
                    <option value="">Selecione uma função</option>
                    <option value="Treinador">Treinador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                {/* Campo Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formDataUsuario.status}
                    onChange={onChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm cursor-pointer"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Suspenso">Suspenso</option>
                  </select>
                </div>

                {/* Campo Senha */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                    Senha
                    {editandoUsuario && (
                      <span className="text-[11px] text-gray-500 font-normal normal-case ml-1">
                        (deixe em branco para não alterar)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formDataUsuario.password}
                    onChange={onChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                    placeholder="Min. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial"
                    required={!editandoUsuario}
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    Requisitos: mínimo de 8 caracteres, incluindo letra
                    maiúscula (A-Z), minúscula (a-z), número (0-9) e caractere
                    especial (!@#$%^&*...).
                  </p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancelar}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors shadow-sm"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
