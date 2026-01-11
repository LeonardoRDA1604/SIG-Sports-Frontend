import { useState } from "react";

import { FaUser, FaUserFriends, FaRunning } from "react-icons/fa";
import { FaPersonChalkboard, FaTableList } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";

import BotaoAdicionar from "../components/BotaoAdicionar/BotaoAdicionar";
import Layout from "../components/Navbar/Navbar";

import ModalVisualizarAtleta from "../modals/views/ModalVisualizarAtleta";
import ModalVisualizarCadastroResponsavel from "../modals/views/ModalVisualizarCadastroResponsavel";

const Cadastros = () => {
  // --- ESTADOS DE NAVEGAÇÃO E BUSCA ---
  const [abaAtiva, setAbaAtiva] = useState('atletas');
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // --- ESTADOS DE CONTROLE DE MODAIS ---
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalVerAtletaAberto, setModalVerAtletaAberto] = useState(false);
  const [modalNovoResponsavelAberto, setModalNovoResponsavelAberto] = useState(false);

  // --- ESTADO: DADOS DOS ATLETAS ---
  const [athletesData, setAthletesData] = useState([
    { 
      id: 1, name: 'Mateus Alexander da Silva', age: 12, category: 'Sub-12', classes: 'B12',
      email: 'mateusinho123@gmail.com', cpf: '123.456.789-10', rg: '15.828.876-0', 
      birthDate: '13/05/2013', responsible: 'Luciana Alves da Silva', modality: 'Futebol de Campo',
      responsiblesList: ['Luciana Alves da Silva', 'João Henrique Campos', 'Miguel Felipe de Freitas'],
      observations: "Atleta com bom desempenho técnico, focado em finalizações.",
      address: { street: 'Rua do Bom Jesus, 123', complement: 'Casa D', neighborhood: 'Recife Antigo', city: 'Recife', uf: 'PE', cep: '50.968-305' }
    },
    { 
      id: 2, name: 'Gabriel Amaral Bezerra de Menezes', age: 13, category: 'Sub-14', classes: 'A14',
      email: 'gabriel.bezerra@gmail.com', cpf: '987.654.321-00', rg: '12.345.678-9', 
      birthDate: '20/10/2012', responsible: 'Ronaldo Ferreira Bezerra', modality: 'Futsal',
      responsiblesList: ['Ronaldo Ferreira Bezerra', 'Sandra Amaral Menezes'],
      observations: "Necessita melhorar o condicionamento físico.",
      address: { street: 'Av. Boa Viagem, 500', complement: 'Apto 101', neighborhood: 'Boa Viagem', city: 'Recife', uf: 'PE', cep: '51.020-000' }
    },
    { 
        id: 3, name: 'Enzo Gabriel dos Santos', age: 15, category: 'Sub-16', classes: 'A16',
        email: 'enzo.g@hotmail.com', cpf: '111.222.333-44', rg: '87.654.321-0', 
        birthDate: '05/02/2010', responsible: 'Miraildes Maria Mota dos Santos', modality: 'Beach Soccer',
        responsiblesList: ['Miraildes Maria Mota dos Santos'],
        observations: "Demonstra grande liderança dentro de campo.",
        address: { street: 'Rua da Aurora, 10', complement: '', neighborhood: 'Santo Amaro', city: 'Recife', uf: 'PE', cep: '50.050-000' }
      },
      { 
        id: 4, name: 'Thiago Pereira Lima', age: 16, category: 'Sub-16', classes: 'B16',
        email: 'thiago.p@uol.com.br', cpf: '555.666.777-88', rg: '11.222.333-4', 
        birthDate: '15/08/2009', responsible: 'Thiago Souza', modality: 'Fut7',
        responsiblesList: ['Thiago Souza', 'Patrícia Lima Pereira', 'Carlos Alberto Lima'],
        observations: "",
        address: { street: 'Rua Amélia, 45', complement: 'Bloco B', neighborhood: 'Graças', city: 'Recife', uf: 'PE', cep: '52.011-050' }
      },
      { 
        id: 5, name: 'Nathan Josué Albuquerque Cavalcanti', age: 16, category: 'Sub-16', classes: 'B16',
        email: 'nathan.j@gmail.com', cpf: '444.333.222-11', rg: '99.888.777-6', 
        birthDate: '30/12/2009', responsible: 'Marta de Albuquerque', modality: 'Fut7',
        responsiblesList: ['Marta de Albuquerque'],
        observations: "Atleta federado por outro clube anteriormente.",
        address: { street: 'Rua do Futuro, 200', complement: '', neighborhood: 'Aflitos', city: 'Recife', uf: 'PE', cep: '52.050-000' }
      },
      { 
        id: 6, name: 'Wesley Santana de Oliveira Neto', age: 17, category: 'Sub-18', classes: 'B17',
        email: 'wesley.s@outlook.com', cpf: '777.888.999-00', rg: '44.555.666-7', 
        birthDate: '12/04/2008', responsible: 'Lionel Messi de Oliveira', modality: 'Futebol de Campo',
        responsiblesList: ['Lionel Messi de Oliveira', 'Antonela Roccuzzo Santana'],
        observations: "Excelente visão de jogo e passe curto.",
        address: { street: 'Estrada do Arraial, 1000', complement: 'Casa 2', neighborhood: 'Casa Amarela', city: 'Recife', uf: 'PE', cep: '52.051-380' }
      },
  ]);

  // --- ESTADO: DADOS DOS RESPONSÁVEIS ---
  const [responsibleData, setResponsibleData] = useState([
    { id: 1, name: 'Roberto Carlos da Silva Santos', athletes: ['Mateus Alexander da Silva', 'João Alexander da Silva'], kinship: 'Pai', phoneNumber: '(81) 9.8877-6655' },
    { id: 2, name: 'Ronaldo Ferreira Bezerra', athletes: ['Gabriel Amaral Bezerra de Menezes'], kinship: 'Pai', phoneNumber: '(81) 9.9988-7766' },
    { id: 3, name: 'Miraildes Maria Mota dos Santos', athletes: ['Enzo Gabriel dos Santos', 'Thiago Pereira Lima', 'Nathan Josué Albuquerque'], kinship: 'Mãe', phoneNumber: '(81) 9.8765-4321' },
    { id: 4, name: 'Thiago Souza Lima', athletes: ['Thiago Pereira Lima'], kinship: 'Pai', phoneNumber: '(81) 9.7766-5544' },
    { id: 5, name: 'Marta Vieira de Albuquerque', athletes: ['Nathan Josué Albuquerque Cavalcanti'], kinship: 'Mãe', phoneNumber: '(81) 9.8811-2233' },
    { id: 6, name: 'Lionel Messi de Oliveira Neto', athletes: ['Wesley Santana de Oliveira Neto'], kinship: 'Pai', phoneNumber: '(81) 9.9900-1122' },
  ]);

  // --- DADOS ESTÁTICOS ---
  const coachData = [
    { id: 1, name: 'Pep Guardiola', classes: 'Sub-12', workTimes: '06:00 - 12:00', PhoneNumber: '(00) 0.0000-0000' },
    { id: 2, name: 'Carlo Ancelotti', classes: 'Sub-14', workTimes: '06:00 - 12:00', PhoneNumber: '(00) 0.0000-0000' },
    { id: 3, name: 'Xabi Alonso', classes: 'Sub-16', workTimes: '06:00 - 12:00', PhoneNumber: '(00) 0.0000-000' },
    { id: 4, name: 'Mikel Arteta', classes: 'Sub-16', workTimes: '12:35 - 18:35', PhoneNumber: '(99) 9.9999-9999' },
    { id: 5, name: 'Luis Enrique', classes: 'Sub-16', workTimes: '12:35 - 18:35', PhoneNumber: '(88) 8.8888-8888' },
  ];

  const classesData = [
    { id: 1, classes: 'A12', workTimes: '06:00 - 12:00', coach: 'Pep Guardiola', category: 'Sub-12', modality: 'Futebol de Campo'},
    { id: 2, classes: 'B14', workTimes: '06:00 - 12:00', coach: 'Carlo Ancelotti', category: 'Sub-14', modality: 'Futsal'},
    { id: 3, classes: 'A16', workTimes: '06:00 - 12:00', coach: 'Xabi Alonso', category: 'Sub-16', modality: 'Beach Soccer'},
    { id: 4, classes: 'B16', workTimes: '12:35 - 18:35', coach: 'Mikel Arteta', category: 'Sub-16', modality: 'Fut7'},
    { id: 5, classes: 'C16', workTimes: '12:35 - 18:35', coach:'Luis Enrique', category:'Sub-16', modality:'Futebol de Campo'},
  ];

  const categoriesData = [
    { id: 1, name: 'Sub-12', classes: 'A12', modality: 'Futebol de Campo'},
    { id: 2, name: 'Sub-14', classes: 'B14', modality: 'Futsal'},
    { id: 3, name: 'Sub-16', classes: 'A16', modality: 'Beach Soccer'},
    { id: 4, name: 'Sub-16', classes: 'B16', modality: 'Fut7'},
    { id: 5, name: 'Sub-18', classes: 'B18', modality: 'Futebol de Campo'},
  ];

  const modalitiesData = [
    { id: 1, name: 'Futebol de Campo', category: 'Sub-12', classes: 'A12' },
    { id: 2, name: 'Futsal', category: 'Sub-14', classes: 'B14' },
    { id: 3, name: 'Beach Soccer', category: 'Sub-16', classes: 'A16' },
    { id: 4, name: 'Fut7', category: 'Sub-16', classes: 'B16' },
  ];

  // --- FUNÇÕES DE ATUALIZAÇÃO ---
  const handleUpdateAthlete = (updatedAthlete) => {
    setAthletesData(prev => prev.map(a => a.id === updatedAthlete.id ? updatedAthlete : a));
    setItemSelecionado(updatedAthlete); 
  };

  const handleSaveNewResponsible = (newResp) => {
    const formattedNewResp = {
      id: responsibleData.length + 1,
      name: newResp.respNome,
      athletes: [itemSelecionado.name],
      kinship: newResp.respParentesco,
      phoneNumber: newResp.respTelefone
    };
    setResponsibleData(prev => [...prev, formattedNewResp]);

    const updatedAthlete = {
      ...itemSelecionado,
      responsiblesList: [...(itemSelecionado.responsiblesList || []), newResp.respNome]
    };
    
    handleUpdateAthlete(updatedAthlete);
    setModalNovoResponsavelAberto(false);
  };

  const handleLinhaClick = (item) => {
    setItemSelecionado(item);
    if (abaAtiva === 'atletas') setModalVerAtletaAberto(true);
  };

  // --- LÓGICA DE FILTRAGEM (TODAS AS VARIÁVEIS DEFINIDAS AQUI) ---
  const athletesFiltrados = athletesData.filter(athlete =>
    athlete.name.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const responsibleFiltrados = responsibleData.filter(responsible =>
    responsible.name.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const coachFiltrados = coachData.filter(coach =>
    coach.name.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const classesFiltrados = classesData.filter(item =>
    item.classes.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const categoriesFiltrados = categoriesData.filter(cat =>
    cat.name.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const modalitiesFiltrados = modalitiesData.filter(mod =>
    mod.name.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // Mapeamento das abas 
  const abas = [
    { id: 'atletas', label: 'Atletas', labelSingular: 'Atleta', icon: <FaUser /> },
    { id: 'responsaveis', label: 'Responsáveis', labelSingular: 'Responsável', icon: <FaUserFriends /> },
    { id: 'treinadores', label: 'Treinadores', labelSingular: 'Treinador', icon: <FaPersonChalkboard /> }, 
    { id: 'turmas', label: 'Turmas', labelSingular: 'Turma', icon: <HiMiniUserGroup /> },
    { id: 'categorias', label: 'Categorias', labelSingular: 'Categoria', icon: <FaTableList /> },
    { id: 'modalidades', label: 'Modalidades', labelSingular: 'Modalidade', icon: <FaRunning /> },
  ];

  const TabItem = ({ id, label, icon }) => {
    const isActive = abaAtiva === id;
    return (
      <button
        key={id}
        className={`flex items-center space-x-2 px-4 py-2 text-sm whitespace-nowrap transition duration-150 ${
          isActive ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
        }`}
        onClick={() => { setAbaAtiva(id); setTermoPesquisa(''); }}
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <Layout title="Cadastros" subtitle="Gerencie atletas, responsáveis, treinadores turmas, categorias e modalidades." >
      <div className="min-h-screen overflow-auto flex-1 p-6 bg-primary-50">
        <div className="mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {abas.map((aba) => (
              <TabItem key={aba.id} {...aba} />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs order-2 sm:order-1 ">
            <input
              type="text"
              placeholder={`Buscar ${abas.find(a => a.id === abaAtiva)?.label}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <BotaoAdicionar aba={abaAtiva} label={abas.find(a => a.id === abaAtiva)?.labelSingular} />
        </div>

        <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 border border-gray-100">
          
          {abaAtiva === 'atletas' && ( 
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {athletesFiltrados.map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => handleLinhaClick(athlete)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{athlete.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{athlete.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{athlete.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{athlete.classes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {abaAtiva === 'responsaveis' && (
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atletas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parentesco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responsibleFiltrados.map((responsible) => (
                    <tr key={responsible.id} className="hover:bg-blue-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">{responsible.name}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-wrap text-sm text-primary-900 font-medium max-w-xs">
                        <div className="flex flex-wrap gap-x-1">
                          {responsible.athletes.map((atleta, index) => (
                            <span key={index}>
                              <a href="#" className="text-blue-600 hover:underline">{atleta}</a>
                              {index < responsible.athletes.length - 1 && <span className="text-gray-500 mr-1">,</span>}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{responsible.kinship}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{responsible.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {abaAtiva === 'treinadores' && (
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turmas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horários</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coachFiltrados.map((coach) => (
                    <tr key={coach.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">{coach.name}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">{coach.classes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{coach.workTimes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">{coach.PhoneNumber}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {abaAtiva === 'turmas' && (
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treinador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classesFiltrados.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">{item.classes}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">{item.workTimes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:underline">{item.coach}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{item.modality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {abaAtiva === 'categorias' && (
            <div className="bg-white rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turmas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriesFiltrados.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">{category.name}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{category.classes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{category.modality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {abaAtiva === 'modalidades' && (
            <div className="bg-white rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turmas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modalitiesFiltrados.map((modality) => (
                    <tr key={modality.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">{modality.name}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{modality.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{modality.classes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ModalVisualizarAtleta
        aberto={modalVerAtletaAberto} 
        onClose={() => setModalVerAtletaAberto(false)} 
        atleta={itemSelecionado}
        onSave={handleUpdateAthlete}
        onOpenAddResponsible={() => setModalNovoResponsavelAberto(true)}
      />
      <ModalVisualizarCadastroResponsavel
        aberto={modalNovoResponsavelAberto}
        onClose={() => setModalNovoResponsavelAberto(false)}
        onSave={handleSaveNewResponsible}
        atletaContexto={itemSelecionado}
      />
    </Layout>
  );
};

export default Cadastros;