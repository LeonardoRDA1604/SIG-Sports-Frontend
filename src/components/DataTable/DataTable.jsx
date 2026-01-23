import React from "react";

/**
 * Componente de tabela reutilizável baseado em template moderno
 * @param {Array} columns - Array de objetos com {key, label, hidden, render, isNameColumn}
 * @param {Array} data - Array de dados para exibir
 * @param {Function} renderActions - Função para renderizar ações customizadas
 * @param {String} emptyMessage - Mensagem quando não há dados
 * @param {Boolean} showCheckbox - Mostrar checkbox nas linhas
 * @param {String} nameSubtextKey - Chave do subtexto exibido embaixo do nome (ex: email)
 */
const DataTable = ({
  columns = [],
  data = [],
  renderActions,
  emptyMessage = "Nenhum dado disponível",
  showCheckbox = false,
  nameSubtextKey = "email",
}) => {
  return (
    <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
      <table className="w-full min-w-max text-sm text-left text-gray-700">
        <thead className="text-sm text-gray-600 bg-gray-100 border-b border-t border-gray-200">
          <tr>
            {showCheckbox && (
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-primary-500"
                  />
                  <label className="sr-only">Selecionar todos</label>
                </div>
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                scope="col"
                className="px-6 py-3 font-medium whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
            {renderActions && (
              <th scope="col" className="px-6 py-3 font-medium">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ? `${row.id}-${rowIndex}` : rowIndex}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                {showCheckbox && (
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-primary-500"
                      />
                      <label className="sr-only">Selecionar</label>
                    </div>
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.isNameColumn ? (
                      <div className="flex items-center">
                        {row.avatar && (
                          <img
                            src={row.avatar}
                            alt={row[column.key]}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="text-base font-bold text-blue-700">
                            {column.render
                              ? column.render(row[column.key], row)
                              : row[column.key] || "-"}
                          </div>
                          {row[nameSubtextKey] && (
                            <div className="text-sm text-gray-600">
                              {row[nameSubtextKey]}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key] || "-"}
                      </>
                    )}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-6 py-4">{renderActions(row)}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (showCheckbox ? 1 : 0) +
                  (renderActions ? 1 : 0)
                }
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
