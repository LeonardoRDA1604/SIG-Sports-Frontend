import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Navbar/Navbar";
import { list, create, update, remove } from "../data/api";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";

export default function Administracao() {
  const navigate = useNavigate();
  const usuarioAtual = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isAdmin = usuarioAtual.role === "Administrador";

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [abrirModal, setAbrirModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    aberto: false,
    usuarioId: null,
    usuarioNome: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Treinador",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAdmin) {
      alert("Acesso negado! Apenas administradores podem acessar esta página.");
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const data = await list("users");
      if (Array.isArray(data)) {
        setUsuarios(data);
      }
    } catch (e) {
      console.error("Erro ao carregar usuários:", e);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.name.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.role.toLowerCase().includes(filtro.toLowerCase()),
  );

  const abrirModalAdicionar = () => {
    setEditando(null);
    setFormData({
      name: "",
      email: "",
      role: "Treinador",
      password: "",
      phone: "",
    });
    setAbrirModal(true);
  };

  const abrirModalEditar = (usuario) => {
    setEditando(usuario);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      password: "",
      phone: usuario.phone || "",
    });
    setAbrirModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = async () => {
    if (!formData.name || !formData.email) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editando) {
        const dataToUpdate = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
        };
        if (formData.password) {
          dataToUpdate.password = formData.password;
        }
        await update("users", editando.id, dataToUpdate);
        alert("Usuário atualizado com sucesso!");
      } else {
        if (!formData.password) {
          alert("Senha é obrigatória para novo usuário");
          return;
        }
        await create("users", formData);
        alert("Usuário criado com sucesso!");
      }
      setAbrirModal(false);
      carregarUsuarios();
    } catch (e) {
      alert(`Erro ao salvar usuário: ${e.message}`);
    }
  };

  const handleDeleteClick = (usuarioId, usuarioNome) => {
    setConfirmDelete({
      aberto: true,
      usuarioId,
      usuarioNome,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await remove("users", confirmDelete.usuarioId);
      alert("Usuário deletado com sucesso!");
      setConfirmDelete({ aberto: false, usuarioId: null, usuarioNome: null });
      carregarUsuarios();
    } catch (e) {
      alert(`Erro ao deletar usuário: ${e.message}`);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout title="Administração" subtitle="Configurações e gestão do sistema.">
      <div className="flex-1 flex flex-col gap-6">
        {/* Seção de Gestão de Usuários */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-900">
                Gestão de Usuários
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Adicione, edite ou remova usuários do sistema
              </p>
            </div>

            <button
              onClick={abrirModalAdicionar}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <MdAdd size={20} />
              Novo Usuário
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="mb-6 relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar por nome, email ou cargo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-5 py-3 pr-12 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-400 bg-white text-gray-800 placeholder:text-gray-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-blue-200"
            />
            <button
              onClick={() => setFiltro(filtro)}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full transition-colors duration-200 text-sm font-medium flex items-center"
              title="Pesquisar"
            >
              Pesquisar
            </button>
          </div>

          {/* Tabela de Usuários */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-300">
              <thead className="bg-primary-900">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-primary-50 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-primary-50 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-primary-50 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-primary-50 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-primary-50 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-primary-900 border-r border-gray-300">
                        {usuario.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-300">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-300">
                        {usuario.phone || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium border-r border-gray-300">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.role === "Administrador"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {usuario.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium flex gap-3 items-center justify-center">
                        <button
                          onClick={() => abrirModalEditar(usuario)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(usuario.id, usuario.name)
                          }
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Deletar"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Adicionar/Editar Usuário */}
      {abrirModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editando ? "Editar Usuário" : "Novo Usuário"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do usuário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Treinador">Treinador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha {editando ? "(deixe em branco para não alterar)" : "*"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    editando ? "Deixe em branco para manter atual" : "Senha"
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setAbrirModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editando ? "Atualizar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {confirmDelete.aberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar{" "}
              <strong>{confirmDelete.usuarioNome}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() =>
                  setConfirmDelete({
                    aberto: false,
                    usuarioId: null,
                    usuarioNome: null,
                  })
                }
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
