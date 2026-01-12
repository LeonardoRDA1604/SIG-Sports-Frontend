import React, { useState, useEffect } from 'react';
import Layout from "../components/Navbar/Navbar"; 
import { Bell, User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import ModalFalta from "../modals/modalFalta";

// Dados preparados com novos campos para o Backend
const DADOS_ALUNOS_MOCK = [
  { id: 1, nome: 'José dos Anjos', status: 'presente', justificativa: "", nota: "" },
  { id: 2, nome: 'Alan Henrique Santos', status: 'ausente', justificativa: "", nota: "" },
  { id: 3, nome: 'Maria Eduarda Costa', status: 'presente', justificativa: "", nota: "" },
  { id: 4, nome: 'Pedro Lucas Oliveira', status: 'presente', justificativa: "", nota: "" },
  { id: 5, nome: 'Carla Cristina Souza', status: 'ausente', justificativa: "", nota: "" },
];

const Presencas = () => {
  const [turmaSelecionada, setTurmaSelecionada] = useState('Turma 33');
  const [dataSelecionada, setDataSelecionada] = useState('2026-01-10');
  const [listaAlunos, setListaAlunos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [modalFaltaAberto, setModalFaltaAberto] = useState(false);
  const [alunoParaJustificar, setAlunoParaJustificar] = useState(null);

  useEffect(() => {
    setListaAlunos(DADOS_ALUNOS_MOCK);
  }, [turmaSelecionada, dataSelecionada]);

  const totalAlunos = listaAlunos.length;
  const presentes = listaAlunos.filter(a => a.status === 'presente').length;
  const ausentes = totalAlunos - presentes;

  const togglePresenca = (id) => {
    setListaAlunos(prev => prev.map(aluno => 
      aluno.id === id ? { 
        ...aluno, 
        status: aluno.status === 'presente' ? 'ausente' : 'presente',
        justificativa: aluno.status === 'presente' ? aluno.justificativa : "" 
      } : aluno
    ));
  };

  // Lógica para atualizar a nota no estado do aluno
  const atualizarNota = (id, valor) => {
    setListaAlunos(prev => prev.map(aluno => 
      aluno.id === id ? { ...aluno, nota: valor } : aluno
    ));
  };

  const salvarJustificativa = (idAluno, textoMotivo) => {
    setListaAlunos(prev => prev.map(aluno => 
      aluno.id === idAluno ? { ...aluno, justificativa: textoMotivo } : aluno
    ));
    setModalFaltaAberto(false);
  };

  const handleSalvar = async () => {
    setSalvando(true);

    // ESTRUTURA PARA O BACKEND: Este objeto contém tudo o que será salvo
    const payload = {
      turma: turmaSelecionada,
      data: dataSelecionada,
      atendimentos: listaAlunos.map(aluno => ({
        aluno_id: aluno.id,
        status: aluno.status,
        justificativa: aluno.justificativa,
        nota: aluno.nota || 0 // Envia 0 se não houver nota
      }))
    };

    console.log("JSON pronto para o Backend:", JSON.stringify(payload, null, 2));

    // Simulação de chamada de API
    setTimeout(() => {
      setSalvando(false);
      alert("Dados salvos com sucesso!");
    }, 1500);
  };

  const abrirModalJustificativa = (aluno) => {
    setAlunoParaJustificar(aluno);
    setModalFaltaAberto(true);
  };

  return (
    <Layout title="Presenças" subtitle="Registre a presença dos atletas nas aulas">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
        <h2 className="font-bold text-xl text-indigo-950 mb-1">Controle de Presença</h2>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end mt-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Turma</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
            >
              <option value="Turma 33">Turma 33</option>
              <option value="Turma 34">Turma 34</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data da Aula</label>
            <input 
              type="date" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>

          <button className="bg-indigo-900 hover:bg-black text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md cursor-pointer">
            Carregar Presenças
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl text-center">
            <p className="text-gray-500 text-xs font-bold uppercase">Total de Atletas</p>
            <p className="text-3xl font-black text-slate-800">{totalAlunos}</p>
          </div>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
            <p className="text-green-600 text-xs font-bold uppercase">Presentes</p>
            <p className="text-3xl font-black text-green-600">{presentes}</p>
          </div>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
            <p className="text-red-600 text-xs font-bold uppercase">Ausentes</p>
            <p className="text-3xl font-black text-red-600">{ausentes}</p>
          </div>
        </div>

        {/* Lista de Alunos */}
        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {listaAlunos.map(aluno => (
            <div key={aluno.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                  <User size={20} className="text-gray-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-800 block">{aluno.nome}</span>
                  {aluno.justificativa && (
                    <span className="text-[10px] text-blue-600 font-bold italic">Justificativa anexada</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Switch Toggle */}
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => togglePresenca(aluno.id)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${aluno.status === 'presente' ? 'bg-indigo-900' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${aluno.status === 'presente' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-bold w-16 inline-block">
                    <span className={aluno.status === 'presente' ? 'text-green-600' : 'text-red-500'}>
                      {aluno.status === 'presente' ? 'Presente' : 'Ausente'}
                    </span>
                  </span>
                </div>

                {/* Justificar */}
                <div className="w-24 flex justify-end"> 
                  {aluno.status === 'ausente' && (
                    <button 
                      onClick={() => abrirModalJustificativa(aluno)} 
                      className="text-indigo-900 font-bold text-sm hover:underline cursor-pointer whitespace-nowrap"
                    >
                      {aluno.justificativa ? "Editar Just." : "Justificar"}
                    </button>
                  )}
                </div>

                {/* CAMPO DE NOTA */}
                <div className="flex flex-col items-center">
                  <label className={`text-[10px] uppercase font-bold transition-colors ${aluno.status === 'ausente' ? 'text-gray-300' : 'text-gray-400'}`}>
                    Nota
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="10" 
                    step="0.1"
                    placeholder="0.0"
                    disabled={aluno.status === 'ausente'} // Desabilita o campo se estiver ausente
                    value={aluno.nota}
                    onChange={(e) => atualizarNota(aluno.id, e.target.value)}
                    className={`w-16 p-1 text-center border rounded-lg outline-none font-bold transition-all
                      ${aluno.status === 'ausente' 
                        ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50' 
                        : 'bg-white border-gray-200 text-indigo-900 focus:ring-2 focus:ring-indigo-500 cursor-text'
                      }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ações Finais */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
          <button className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">Cancelar</button>
          <button 
            onClick={handleSalvar}
            disabled={salvando}
            className="bg-indigo-900 hover:bg-black text-white px-10 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-70 cursor-pointer"
          >
            {salvando ? <Loader2 className="animate-spin" /> : "Salvar Presença"}
          </button>
        </div>
      </div>

      <ModalFalta 
        isOpen={modalFaltaAberto}
        onClose={() => setModalFaltaAberto(false)}
        nomeAluno={alunoParaJustificar?.nome}
        valorAtual={alunoParaJustificar?.justificativa}
        onSalvar={(texto) => salvarJustificativa(alunoParaJustificar.id, texto)}
      />
    </Layout>
  );
};

export default Presencas;