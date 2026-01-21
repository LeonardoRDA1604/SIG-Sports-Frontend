export default function UsuariosTable({ usuarios }) {
  if (!usuarios || usuarios.length === 0)
    return <div>Nenhum usuário cadastrado.</div>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">CPF</th>
            <th className="px-4 py-2">Telefone</th>
            <th className="px-4 py-2">Nascimento</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Criado em</th>
            <th className="px-4 py-2">Atualizado em</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => {
            console.log("[UsuariosTable] user:", user);
            return (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.cpf}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">
                  {user.birthDate || user.birth_date || "-"}
                </td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td className="px-4 py-2">
                  {user.entry_date && !isNaN(Date.parse(user.entry_date))
                    ? new Date(user.entry_date).toLocaleString("pt-BR")
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {user.updated_at && !isNaN(Date.parse(user.updated_at))
                    ? new Date(user.updated_at).toLocaleString("pt-BR")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
