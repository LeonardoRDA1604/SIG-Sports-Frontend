import React, { useState } from "react";

export default function AutocompleteAtleta({
  atletas,
  value,
  onChange,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [showList, setShowList] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setShowList(true);
  };

  const handleSelect = (nome) => {
    setInputValue(nome);
    onChange(nome);
    setShowList(false);
  };

  const atletasArray = Array.isArray(atletas) ? atletas : [];
  const filtered = atletasArray.filter((a) => {
    const nome = a.user_name || a.nome || a.name || "";
    return nome.toLowerCase().includes(inputValue.toLowerCase());
  });

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)}
        placeholder={placeholder || "Buscar atleta..."}
        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-700 outline-none text-sm placeholder:text-gray-400 bg-white"
      />
      {showList && inputValue.length > 0 && filtered.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-auto shadow-lg">
          {filtered.map((a) => {
            const nome = a.user_name || a.nome || a.name;
            return (
              <li
                key={a.id}
                className="px-4 py-2 cursor-pointer hover:bg-primary-100"
                onMouseDown={() => handleSelect(nome)}
              >
                {nome}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
