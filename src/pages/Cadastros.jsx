import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import AnimatedTitle from "../modals/AnimatedTitle";

import { FaUser } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaPersonChalkboard } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaTableList } from "react-icons/fa6";
import { FaRunning } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";

// Dados dos atletas
const athletesData = [
  { id: 1, name: 'Mateus A.', age: 12, category: 'Sub-12', classes: 'B12' },
  { id: 2, name: 'Gabriel A.', age: 13, category: 'Sub-14', classes: 'A14' },
  { id: 3, name: 'Enzo G.', age: 15, category: 'Sub-16', classes: 'A16' },
  { id: 4, name: 'Thiago P.', age: 16, category: 'Sub-16', classes: 'B16' },
  { id: 5, name: 'Nathan J.', age: 16, category: 'Sub-16', classes: 'B16' },
  { id: 6, name: 'Wesley S.', age: 17, category: 'Sub-18', classes: 'B17' },
];

// Dados dos responsáveis
const responsibleData = [
  // Exemplo de responsável por MÚLTIPLOS atletas
  { id: 1, name: 'Roberto C', athletes: ['Mateus A', 'João A'], kinship: 'Pai', phoneNumber: '(00) 0.0000-0000 ' },
  { id: 2, name: 'Ronaldo F', athletes: ['Gabriel A'], kinship: 'Pai', phoneNumber: '(00) 0.0000-0000' },
  // Exemplo de responsável por MÚLTIPLOS atletas
  { id: 3, name: 'Miraildes M', athletes: ['Enzo G', 'Thiago P', 'Nathan J'], kinship: 'Mãe', phoneNumber: '(00) 0.0000-0000' },
  { id: 4, name: 'Thiago S', athletes: ['Thiago P'], kinship: 'Pai', phoneNumber: '(00) 0.0000-0000' },
  { id: 5, name: 'Marta', athletes: ['Nathan J'], kinship: 'Mãe', phoneNumber: '(00) 8.8888-8888' },
  { id: 6, name: 'Lionel M', athletes: ['Wesley S'], kinship: 'Pai', phoneNumber: '(00) 9.9999-9999' },
];

// Dados dos treinadores
const coachData = [
  { id: 1, name: 'Pep Guardiola', classes: 'Sub-12', workTimes: '06:00 - 12:00', PhoneNumber: '(00) 0.0000-0000' },
  { id: 2, name: 'Carlo Ancelotti', classes: 'Sub-14', workTimes: '06:00 - 12:00', PhoneNumber: '(00) 0.0000-0000' },
  { id: 3, name: 'Xabi Alonso', classes: 'Sub-16', workTimes: '06:00 - 12:00', PhoneNumber: '(00) 0.0000-000' },
  { id: 4, name: 'Mikel Arteta', classes: 'Sub-16', workTimes: '12:35 - 18:35', PhoneNumber: '(99) 9.9999-9999' },
  { id: 5, name: 'Luis Enrique', classes: 'Sub-16', workTimes: '12:35 - 18:35', PhoneNumber: '(88) 8.8888-8888' },
];

// Dados das Turmas
const classesData = [
  { id: 1, classes: 'A12', workTimes: '06:00 - 12:00', coach: 'Pep Guardiola', category: 'Sub-12', modality: 'Futebol'},
  { id: 2, classes: 'B14', workTimes: '06:00 - 12:00', coach: 'Carlo Ancelotti', category: 'Sub-14', modality: 'Futsal'},
  { id: 3, classes: 'A16', workTimes: '06:00 - 12:00', coach: 'Xabi Alonso', category: 'Sub-16', modality: 'Beach Soccer'},
  { id: 4, classes: 'B16', workTimes: '12:35 - 18:35', coach: 'Mikel Arteta', category: 'Sub-16', modality: 'Fut7'},
  { id: 5, classes: 'C16', workTimes: '12:35 - 18:35', coach:'Luis Enrique', category:'Sub-16', modality:'Futebol'},
];

// Dados das Categorias
const categoriesData = [
  { id: 1, name: 'Sub-12', classes: 'A12', modality: 'Futebol'},
  { id: 2, name: 'Sub-14', classes: 'B14', modality: 'Futsal'},
  { id: 3, name: 'Sub-16', classes: 'A16', modality: 'Beach Soccer'},
  { id: 4, name: 'Sub-16', classes: 'B16', modality: 'Fut7'},
  { id: 5, name: 'Sub-16', classes: 'C16', modality: 'Futebol'},
];

// Dados das Modalidades
const modalitiesData = [
  { id: 1, name: 'Futebol', category: 'Sub-12', classes: 'A12' },
  { id: 2, name: 'Futsal', category: 'Sub-14', classes: 'B14' },
  { id: 3, name: 'Beach Soccer', category: 'Sub-16', classes: 'A16' },
  { id: 4, name: 'Fut7', category: 'Sub-16', classes: 'B16' },
];

// Mapeamento das abas 
const abas = [
  { id: 'atletas', label: 'Atletas', labelSingular: 'Atleta', icon: <FaUser /> },
  { id: 'responsaveis', label: 'Responsáveis', labelSingular: 'Responsável', icon: <FaUserFriends /> },
  { id: 'treinadores', label: 'Treinadores', labelSingular: 'Treinador', icon: <FaPersonChalkboard /> }, 
  { id: 'turmas', label: 'Turmas', labelSingular: 'Turma', icon: <HiMiniUserGroup /> },
  { id: 'categorias', label: 'Categorias', labelSingular: 'Categoria', icon: <FaTableList /> },
  { id: 'modalidades', label: 'Modalidades', labelSingular: 'Modalidade', icon: <FaRunning /> },
];

const Cadastros = () => {
  const [abaAtiva, setAbaAtiva] = useState('atletas');
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // Lógica de Filtragem de Atletas
  const athletesFiltrados = termoPesquisa.length > 0 && abaAtiva === 'atletas'
    ? athletesData.filter(athlete =>
        athlete.name.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : athletesData;

  // Lógica de Filtragem de Responsáveis
  const responsibleFiltrados = termoPesquisa.length > 0 && abaAtiva === 'responsaveis'
    ? responsibleData.filter(responsible =>
        responsible.name.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : responsibleData;

  // Lógica de Filtragem de Treinadores
  const coachFiltrados = termoPesquisa.length > 0 && abaAtiva === 'treinadores'
    ? coachData.filter(coach =>
        coach.name.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : coachData;
  
    // Lógica de Filtragem de Turmas
  const classesFiltrados = termoPesquisa.length > 0 && abaAtiva === 'turmas'
    ? classesData.filter(classes =>
        classes.classes.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : classesData;

    // Lógica de Filtragem de Categorias
  const categoriesFiltrados = termoPesquisa.length > 0 && abaAtiva === 'categorias'
    ? categoriesData.filter(categories =>
        categories.name.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : categoriesData;

    // Lógica de Filtragem de Modalidades
  const modalitiesFiltrados = termoPesquisa.length > 0 && abaAtiva === 'modalidades'
    ? modalitiesData.filter(modalities =>
        modalities.name.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : modalitiesData;

  // Componente para Itens de Aba
  const TabItem = ({ id, label, icon }) => {
    const isActive = abaAtiva === id;
    const activeClasses = 'text-blue-600 border-b-2 border-blue-600 font-semibold ';
    const inactiveClasses = 'text-gray-500 hover:text-gray-700 cursor-pointer';

    return (
      <button
        key={id}
        className={`flex items-center space-x-2 px-4 py-2 text-sm whitespace-nowrap transition duration-150 ${
          isActive ? activeClasses : inactiveClasses
        }`}
        
        onClick={() => {
          setAbaAtiva(id); // Muda a aba ativa
          setTermoPesquisa(''); // Reseta o termo de pesquisa ao mudar de aba
        }}
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex overflow-x-hidden">  
      <Navbar />
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="min-h-screen mt-15 overflow-auto flex-1 p-2 bg-primary-50">
          
        {/* Cabeçalho */}
        <div className="mb-6">
          <AnimatedTitle text="Cadastros" />
          <p className="text-xs sm:text-base text-gray-500 mb-4">
            Gerencie atletas, responsáveis, treinadores turmas, categorias e modalidades.
          </p>
          
          {/* Navegação por Abas */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {abas.map((aba) => (
              <TabItem key={aba.id} {...aba} />
            ))}
          </div>
        </div>

        {/* Área de Ações (Pesquisa e Novo Item) */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
          
          {/* Barra de Pesquisa */}
          <div className="relative w-full sm:max-w-xs order-2 sm:order-1 ">
            <input
              type="text"
              placeholder={`Buscar ${abas.find(a => a.id === abaAtiva)?.label}...`}
              className="
              w-full pl-10 pr-4 py-2 border border-gray-300 bg-white
              rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            {/* Ícone de Busca (Lupa) */}
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          {/* Botão Adicionar Novo Item */}
          <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 order-1 sm:order-2">
            <IoIosAddCircleOutline className="text-3xl" />
            <span className="text-sm sm:text-base">Adicionar {abas.find(a => a.id === abaAtiva)?.labelSingular}</span>
          </button>
        </div>

        {/* 4. CONTEÚDO: Tabela/Dados */}
        <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 border border-gray-100">
          
          {/* Tabela Atletas */}
          {abaAtiva === 'atletas' && ( 
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Idade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Categoria
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Turma
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {athletesFiltrados.map((athletes) => (
                    <tr key={athletes.id} className="hover:bg-blue-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">
                          {athletes.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                        {athletes.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {athletes.category}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {athletes.classes}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mensagem de "Nenhum resultado" */}
              {athletesFiltrados.length === 0 && termoPesquisa.length > 0 && (
                  <div className="p-6 text-center text-gray-500 ">
                      Nenhum atleta encontrado com o termo "{termoPesquisa}".
                  </div>
              )}
            </div>
          )}

          {/* Conteúdo para Abas RESPONSAVEIS */}
          {abaAtiva === 'responsaveis' && (
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Atletas
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Parentesco
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Telefone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responsibleFiltrados.map((responsible) => (
                    <tr key={responsible.id} className="hover:bg-blue-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">
                          {responsible.name}
                        </a>
                      </td>
                      
                      {/* exibi múltiplos atletas */}
                      <td className="px-6 py-4 whitespace-wrap text-sm text-primary-900 font-medium max-w-xs">
                        {responsible.athletes.join(', ')}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {responsible.kinship}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {responsible.phoneNumber}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mensagem de "Nenhum resultado" */}
              {responsibleFiltrados.length === 0 && termoPesquisa.length > 0 && (
                  <div className="p-6 text-center text-gray-500">
                      Nenhum responsável encontrado com o termo "{termoPesquisa}".
                  </div>
              )}
            </div>
          )}

          {/* Conteúdo para Aba Treinador */}
          {abaAtiva === 'treinadores' && (
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Turmas
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Horários
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Telefone
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {coachFiltrados.map((coach) => (
                    <tr key={coach.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">
                          {coach.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                        {coach.classes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {coach.workTimes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {coach.PhoneNumber}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mensagem de "Nenhum resultado" */}
              {coachFiltrados.length === 0 && termoPesquisa.length > 0 && (
                  <div className="p-6 text-center text-gray-500">
                      Nenhum treinador encontrado com o termo "{termoPesquisa}".
                  </div>
              )}
            </div>
          )}
          {/* Conteúdo para Abas TURMAS */}
          {abaAtiva === 'turmas' && (
            <div className="bg-white rounded-lg overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Turma
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Horário
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Treinador
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Categoria
                    </th>
                     <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Modalidade
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {classesFiltrados.map((classes) => (
                    <tr key={classes.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">
                          {classes.classes}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                        {classes.workTimes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:underline">
                          {classes.coach}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {classes.category}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {classes.modality}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mensagem de "Nenhum resultado" */}
              {coachFiltrados.length === 0 && termoPesquisa.length > 0 && (
                  <div className="p-6 text-center text-gray-500">
                      Nenhum treinador encontrado com o termo "{termoPesquisa}".
                  </div>
              )}
            </div>
          )}

          {/* Conteúdo para Abas CATEGORIAS */}
          {abaAtiva === 'categorias' && (
            <div className="bg-white rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Categoria
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Turmas
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Modalidade
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriesFiltrados.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">
                          {category.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {category.classes}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:underline">
                          {category.modality}
                          </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mensagem de "Nenhum resultado" */}
              {categoriesFiltrados.length === 0 && termoPesquisa.length > 0 && (
                  <div className="p-6 text-center text-gray-500">
                      Nenhuma categoria encontrada com o termo "{termoPesquisa}".
                  </div>
              )}
            </div>
          )}

          {/* Conteúdo para Abas MODALIDADES */}
          {abaAtiva === 'modalidades' && (
            <div className="bg-white rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Modalidade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Categoria
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Turmas
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {modalitiesFiltrados.map((modality) => (
                    <tr key={modality.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <a href="#" className="text-blue-600 hover:underline">
                          {modality.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {modality.category}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:underline">
                          {modality.classes}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mensagem de "Nenhum resultado" */}
              {modalitiesFiltrados.length === 0 && termoPesquisa.length > 0 && (
                  <div className="p-6 text-center text-gray-500">
                      Nenhuma modalidade encontrada com o termo "{termoPesquisa}".
                  </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Cadastros;