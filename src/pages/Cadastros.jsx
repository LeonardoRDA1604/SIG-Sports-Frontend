import { useState, useEffect } from 'react';

import { FaUser } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
import { FaPersonChalkboard } from 'react-icons/fa6';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaTableList } from 'react-icons/fa6';
import { FaRunning } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoLockClosed } from 'react-icons/io5';
import BotaoAdicionar from '../components/BotaoAdicionar/BotaoAdicionar';
import { list, create, remove, update } from '../data/api';
import Layout from '../components/Navbar/Navbar';
import ModalCadastroInteressado from '../modals/forms/ModalCadastroInteressado';
import ModalCadastroAtleta from '../modals/forms/ModalCadastroAtleta';
import ModalCadastroResponsavel from '../modals/forms/ModalCadastroResponsavel';
import ModalCadastroTreinador from '../modals/forms/ModalCadastroTreinador';
import ModalCadastroTurma from '../modals/forms/ModalCadastroTurma';
import ModalCadastroCategoria from '../modals/forms/ModalCadastroCategoria';
import ModalCadastroModalidade from '../modals/forms/ModalCadastroModalidade';
import ModalVisualizarAtleta from '../modals/views/ModalVisualizarAtleta';
import { temAcessoBloqueado } from '../utils/permissoes';
import ModalVisualizarResp from '../modals/views/ModalVisualizarResp';
import ModalVisualizarTurma from '../modals/views/ModalVisualizarTurma';
import ModalVisualizarCategoria from '../modals/views/ModalVisualizarCategoria';

// Dados dos Atletas
const athletesData = [
	{
		id: '1',
		name: 'Mateus Alexander da Silva',
		nascimento: '13/05/2013',
		cpf: '123.456.789-10',
		rg: '15.828.876-0',
		email: 'mateusinho@email.com',
		escola: 'Escola Municipal Recife',
		modalidade: 'futebol',
		age: 12,
		category: 'Sub-12',
		classes: 'B12',
		cep: '50.968-305',
		bairro: 'Recife Antigo',
		cidade: 'Recife',
		uf: 'PE',
		logradouro: 'Rua do Bom Jesus, 123',
		complemento: 'Casa D',
		observacoes: 'Atleta com excelente drible.',
		respCpf: '111.222.333-44',
		respNome: 'Roberto Carlos da Silva',
		respEmail: 'roberto.silva@email.com',
		respTelefone: '(81) 98877-6655',
		respParentesco: 'pai',
	},
	{
		id: '2',
		name: 'Gabriel Amaral Bezerra de Menezes',
		nascimento: '20/10/2012',
		cpf: '987.654.321-00',
		rg: '12.345.678-9',
		email: 'gabriel.b@email.com',
		escola: 'Colégio Boa Viagem',
		modalidade: 'futsal',
		age: 13,
		category: 'Sub-14',
		classes: 'A14',
		cep: '51.020-000',
		bairro: 'Boa Viagem',
		cidade: 'Recife',
		uf: 'PE',
		logradouro: 'Av. Boa Viagem, 500',
		complemento: 'Apto 101',
		observacoes: '',
		respCpf: '222.333.444-55',
		respNome: 'Ronaldo Ferreira Bezerra',
		respEmail: 'ronaldo.f@gmail.com',
		respTelefone: '(81) 99988-7766',
		respParentesco: 'pai',
	},
	{
		id: '3',
		name: 'Enzo Gabriel dos Santos',
		nascimento: '05/02/2010',
		cpf: '111.222.333-44',
		rg: '87.654.321-0',
		email: 'enzo.g@hotmail.com',
		escola: 'Escola Santo Amaro',
		modalidade: 'beach soccer',
		age: 15,
		category: 'Sub-16',
		classes: 'A16',
		cep: '50050-000',
		bairro: 'Santo Amaro',
		cidade: 'Recife',
		uf: 'PE',
		logradouro: 'Rua da Aurora, 10',
		complemento: 'Casa',
		observacoes: 'Líder de equipe.',
		respCpf: '333.444.555-66',
		respNome: 'Miraildes Maria Mota dos Santos',
		respEmail: 'miraildes.m@email.com',
		respTelefone: '(81) 98765-4321',
		respParentesco: 'mãe',
	},
	{
		id: '4',
		name: 'Thiago Pereira Lima',
		nascimento: '15/08/2009',
		cpf: '555.666.777-88',
		rg: '11.222.333-4',
		email: 'thiago.p@uol.com.br',
		escola: 'Escola Graças',
		modalidade: 'fut7',
		age: 16,
		category: 'Sub-16',
		classes: 'B16',
		cep: '52.011-050',
		bairro: 'Graças',
		cidade: 'Recife',
		uf: 'PE',
		logradouro: 'Rua Amélia, 45',
		complemento: 'Bloco B',
		observacoes: '',
		respCpf: '444.555.666-77',
		respNome: 'Thiago Souza Lima',
		respEmail: 'thiago.souza@email.com',
		respTelefone: '(81) 97766-5544',
		respParentesco: 'pai',
	},
	{
		id: '5',
		name: 'Nathan Josué Albuquerque Cavalcanti',
		nascimento: '30/12/2009',
		cpf: '444.333.222-11',
		rg: '99.888.777-6',
		email: 'nathan.j@gmail.com',
		escola: 'Colégio Aflitos',
		modalidade: 'fut7',
		age: 16,
		category: 'Sub-16',
		classes: 'B16',
		cep: '52.050-000',
		bairro: 'Aflitos',
		cidade: 'Recife',
		uf: 'PE',
		logradouro: 'Rua do Futuro, 200',
		complemento: '',
		observacoes: '',
		respCpf: '555.444.333-22',
		respNome: 'Marta Vieira de Albuquerque',
		respEmail: 'marta.alb@email.com',
		respTelefone: '(81) 98811-2233',
		respParentesco: 'mãe',
	},
	{
		id: '6',
		name: 'Wesley Santana de Oliveira Neto',
		nascimento: '12/04/2008',
		cpf: '777.888.999-00',
		rg: '44.555.666-7',
		email: 'wesley.s@outlook.com',
		escola: 'Escola Casa Amarela',
		modalidade: 'futebol',
		age: 17,
		category: 'Sub-18',
		classes: 'B18',
		cep: '52.051-380',
		bairro: 'Casa Amarela',
		cidade: 'Recife',
		uf: 'PE',
		logradouro: 'Estrada do Arraial, 1000',
		complemento: 'Casa 2',
		observacoes: '',
		respCpf: '666.777.888-99',
		respNome: 'Lionel Messi de Oliveira Neto',
		respEmail: 'lionel.neto@email.com',
		respTelefone: '(81) 99900-1122',
		respParentesco: 'pai',
	},
	{
		id: '7',
		name: 'Leandro Wilke Alves De Melo',
		nascimento: '07/05/1985',
		cpf: '999.999.999-99',
		rg: '99.999.999-9',
		email: 'leandro@aponti.com',
		escola: 'Aponti',
		modalidade: 'futebol',
		age: 16,
		category: 'Sub-16',
		classes: 'A16',
		cep: '54310-302',
		bairro: 'Prazeres',
		cidade: 'Jaboatão Dos Guararapes',
		uf: 'PE',
		logradouro: '1ª Travessa Arão Lins De Andrade 45',
		complemento: 'Casa',
		observacoes: 'Atleta federado.',
		respCpf: '888.777.666-55',
		respNome: 'Adelmo Bezerra De Melo',
		respEmail: 'adelmo@aponti.com',
		respTelefone: '(81) 97766-5544',
		respParentesco: 'pai',
	},
];

// Dados dos Responsáveis
const responsibleData = [
	{
		id: '1',
		name: 'Roberto Carlos da Silva',
		cpf: '111.222.333-44',
		email: 'roberto.silva@email.com',
		phoneNumber: '(81) 98877-6655',
		birthDate: '15/06/1982',
		kinship: 'Pai',
		athletes: ['Mateus Alexander da Silva'],
		address: {
			street: 'Rua do Bom Jesus, 123',
			neighborhood: 'Recife Antigo',
			city: 'Recife',
			uf: 'PE',
			cep: '50.968-305',
			complemento: 'Casa D',
		},
	},
	{
		id: '2',
		name: 'Ronaldo Ferreira Bezerra',
		cpf: '222.333.444-55',
		email: 'ronaldo.f@gmail.com',
		phoneNumber: '(81) 99988-7766',
		birthDate: '20/10/1985',
		kinship: 'Pai',
		athletes: ['Gabriel Amaral Bezerra de Menezes'],
		address: {
			street: 'Av. Boa Viagem, 500',
			neighborhood: 'Boa Viagem',
			city: 'Recife',
			uf: 'PE',
			cep: '51.020-000',
			complemento: 'Apto 101',
		},
	},
	{
		id: '3',
		name: 'Miraildes Maria Mota dos Santos',
		cpf: '333.444.555-66',
		email: 'miraildes.m@email.com',
		phoneNumber: '(81) 98765-4321',
		birthDate: '12/03/1978',
		kinship: 'Mãe',
		athletes: [
			'Enzo Gabriel dos Santos',
			'Thiago Pereira Lima',
			'Nathan Josué Albuquerque Cavalcanti',
		],
		address: {
			street: 'Rua da Aurora, 10',
			neighborhood: 'Santo Amaro',
			city: 'Recife',
			uf: 'PE',
			cep: '50050-000',
			complemento: 'Casa',
		},
	},
	{
		id: '4',
		name: 'Thiago Souza Lima',
		cpf: '444.555.666-77',
		email: 'thiago.souza@email.com',
		phoneNumber: '(81) 97766-5544',
		birthDate: '25/11/1980',
		kinship: 'Pai',
		athletes: ['Thiago Pereira Lima'],
		address: {
			street: 'Rua Amélia, 45',
			neighborhood: 'Graças',
			city: 'Recife',
			uf: 'PE',
			cep: '52.011-050',
			complemento: 'Bloco B',
		},
	},
	{
		id: '5',
		name: 'Marta Vieira de Albuquerque',
		cpf: '555.444.333-22',
		email: 'marta.alb@email.com',
		phoneNumber: '(81) 98811-2233',
		birthDate: '08/09/1984',
		kinship: 'Mãe',
		athletes: ['Nathan Josué Albuquerque Cavalcanti'],
		address: {
			street: 'Rua do Futuro, 200',
			neighborhood: 'Aflitos',
			city: 'Recife',
			uf: 'PE',
			cep: '52.050-000',
			complemento: '',
		},
	},
	{
		id: '6',
		name: 'Lionel Messi de Oliveira Neto',
		cpf: '666.777.888-99',
		email: 'lionel.neto@email.com',
		phoneNumber: '(81) 99900-1122',
		birthDate: '24/06/1987',
		kinship: 'Pai',
		athletes: ['Wesley Santana de Oliveira Neto'],
		address: {
			street: 'Estrada do Arraial, 1000',
			neighborhood: 'Casa Amarela',
			city: 'Recife',
			uf: 'PE',
			cep: '52.051-380',
			complemento: 'Casa 2',
		},
	},
	{
		id: '7',
		name: 'Adelmo Bezerra De Melo',
		cpf: '888.777.666-55',
		email: 'adelmo@aponti.com',
		phoneNumber: '(81) 97766-5544',
		birthDate: '01/01/1960',
		kinship: 'Pai',
		athletes: ['Leandro Wilke Alves De Melo'],
		address: {
			street: 'Rua Nova, 10',
			neighborhood: 'Centro',
			city: 'Recife',
			uf: 'PE',
			cep: '50000-000',
			complemento: '',
		},
	},
];

// Dados dos Treinadores
const coachData = [
	{ id: 1, name: 'Pep Guardiola', workTimes: '06:00 - 12:00', phoneNumber: '(81) 91111-1111' },
	{ id: 2, name: 'Carlo Ancelotti', workTimes: '06:00 - 12:00', phoneNumber: '(81) 92222-2222' },
	{ id: 3, name: 'Xabi Alonso', workTimes: '14:00 - 20:00', phoneNumber: '(81) 93333-3333' },
	{ id: 4, name: 'Mikel Arteta', workTimes: '14:00 - 20:00', phoneNumber: '(81) 94444-4444' },
];

// Dados das Turmas
const classesData = [
	// SUB-12 (Treinador: Pep Guardiola - Manhã)
	{
		id: 1,
		nomeTurma: 'A12',
		workTimes: '06:00 - 08:00',
		coach: 'Pep Guardiola',
		category: 'Sub-12',
		modality: 'Futebol',
		days: 'Segunda, Quarta e Sexta',
		athletes: [],
	},
	{
		id: 2,
		nomeTurma: 'B12',
		workTimes: '08:00 - 10:00',
		coach: 'Pep Guardiola',
		category: 'Sub-12',
		modality: 'Futebol',
		days: 'Terça e Quinta',
		athletes: ['Mateus Alexander da Silva'],
	},
	{
		id: 3,
		nomeTurma: 'C12',
		workTimes: '10:00 - 12:00',
		coach: 'Pep Guardiola',
		category: 'Sub-12',
		modality: 'Futebol',
		days: 'Segunda, Quarta e Sexta',
		athletes: [],
	},

	// SUB-14 (Treinador: Carlo Ancelotti - Manhã)
	{
		id: 4,
		nomeTurma: 'A14',
		workTimes: '06:00 - 08:00',
		coach: 'Carlo Ancelotti',
		category: 'Sub-14',
		modality: 'Futsal',
		days: 'Segunda, Quarta e Sexta',
		athletes: ['Gabriel Amaral Bezerra de Menezes'],
	},
	{
		id: 5,
		nomeTurma: 'B14',
		workTimes: '08:00 - 10:00',
		coach: 'Carlo Ancelotti',
		category: 'Sub-14',
		modality: 'Futsal',
		days: 'Terça e Quinta',
		athletes: [],
	},
	{
		id: 6,
		nomeTurma: 'C14',
		workTimes: '10:00 - 12:00',
		coach: 'Carlo Ancelotti',
		category: 'Sub-14',
		modality: 'Futsal',
		days: 'Segunda, Quarta e Sexta',
		athletes: [],
	},

	// SUB-16 (Treinador: Xabi Alonso - Tarde/Noite)
	{
		id: 7,
		nomeTurma: 'A16',
		workTimes: '14:00 - 16:00',
		coach: 'Xabi Alonso',
		category: 'Sub-16',
		modality: 'Futebol',
		days: 'Segunda, Quarta e Sexta',
		athletes: ['Enzo Gabriel dos Santos', 'Leandro Wilke Alves De Melo'],
	},
	{
		id: 8,
		nomeTurma: 'B16',
		workTimes: '16:00 - 18:00',
		coach: 'Xabi Alonso',
		category: 'Sub-16',
		modality: 'Fut7',
		days: 'Terça e Quinta',
		athletes: ['Thiago Pereira Lima', 'Nathan Josué Albuquerque Cavalcanti'],
	},
	{
		id: 9,
		nomeTurma: 'C16',
		workTimes: '18:00 - 20:00',
		coach: 'Xabi Alonso',
		category: 'Sub-16',
		modality: 'Futebol',
		days: 'Segunda, Quarta e Sexta',
		athletes: [],
	},

	// SUB-18 (Treinador: Mikel Arteta - Tarde/Noite)
	{
		id: 10,
		nomeTurma: 'A18',
		workTimes: '14:00 - 16:00',
		coach: 'Mikel Arteta',
		category: 'Sub-18',
		modality: 'Futebol',
		days: 'Segunda, Quarta e Sexta',
		athletes: [],
	},
	{
		id: 11,
		nomeTurma: 'B18',
		workTimes: '16:00 - 18:00',
		coach: 'Mikel Arteta',
		category: 'Sub-18',
		modality: 'Futebol',
		days: 'Terça e Quinta',
		athletes: ['Wesley Santana de Oliveira Neto'],
	},
	{
		id: 12,
		nomeTurma: 'C18',
		workTimes: '18:00 - 20:00',
		coach: 'Mikel Arteta',
		category: 'Sub-18',
		modality: 'Futebol',
		days: 'Segunda, Quarta e Sexta',
		athletes: [],
	},
];

// Dados das Categorias
const categoriesData = [
    { id: 1, name: 'Sub-12', classes: 'A12, B12, C12', modality: 'Futebol' },
    { id: 2, name: 'Sub-14', classes: 'A14, B14, C14', modality: 'Futsal' },
    { id: 3, name: 'Sub-16', classes: 'A16, B16, C16', modality: 'Futebol' },
    { id: 4, name: 'Sub-18', classes: 'A18, B18, C18', modality: 'Futebol' },
];

// Dados das Modalidades
const modalitiesData = [
	{ id: 1, name: 'Futebol', category: 'Sub-12', classes: 'A12' },
	{ id: 2, name: 'Futsal', category: 'Sub-14', classes: 'B14' },
	{ id: 3, name: 'Beach Soccer', category: 'Sub-16', classes: 'A16' },
	{ id: 4, name: 'Fut7', category: 'Sub-16', classes: 'B16' },
];

// Dados dos Interessados
const interestedData = [
	{
		id: 1,
		name: 'João Silva',
		modality: 'Futebol',
		phoneNumber: '(11) 99999-8888',
	},
	{
		id: 2,
		name: 'Maria Santos',
		modality: 'Futsal',
		phoneNumber: '(21) 98888-7777',
	},
];

// Mapeamento das abas
const abas = [
	{
		id: 'atletas',
		label: 'Atletas',
		labelSingular: 'Atleta',
		icon: <FaUser />,
	},
	{
		id: 'responsaveis',
		label: 'Responsáveis',
		labelSingular: 'Responsável',
		icon: <FaUserFriends />,
	},
	{
		id: 'treinadores',
		label: 'Treinadores',
		labelSingular: 'Treinador',
		icon: <FaPersonChalkboard />,
	},
	{
		id: 'turmas',
		label: 'Turmas',
		labelSingular: 'Turma',
		icon: <HiMiniUserGroup />,
	},
	{
		id: 'categorias',
		label: 'Categorias',
		labelSingular: 'Categoria',
		icon: <FaTableList />,
	},
	{
		id: 'modalidades',
		label: 'Modalidades',
		labelSingular: 'Modalidade',
		icon: <FaRunning />,
	},
	{
		id: 'interessados',
		label: 'Interessados',
		labelSingular: 'Interessado',
		icon: <MdPersonAdd />,
	},
];

const Cadastros = () => {
	const [abaAtiva, setAbaAtiva] = useState('atletas');
	const [termoPesquisa, setTermoPesquisa] = useState('');
	const [athletes, setAthletes] = useState(athletesData);
	const [responsaveis, setResponsaveis] = useState(responsibleData);
	const [treinadores, setTreinadores] = useState(coachData);
	const [turmas, setTurmas] = useState(classesData);
	const [categorias, setCategorias] = useState(categoriesData);
	const [modalidades, setModalidades] = useState(modalitiesData);
	const [interessados, setInteressados] = useState(interestedData);
	const [confirmDelete, setConfirmDelete] = useState({
		aberto: false,
		recurso: null,
		id: null,
		nome: null,
	});

	// Estados para abrir os modais de edição
	const [abrirCadastroAtleta, setAbrirCadastroAtleta] = useState(false);
	const [abrirCadastroResponsavel, setAbrirCadastroResponsavel] = useState(false);
	const [abrirCadastroTreinador, setAbrirCadastroTreinador] = useState(false);
	const [abrirCadastroTurma, setAbrirCadastroTurma] = useState(false);
	const [abrirCadastroCategoria, setAbrirCadastroCategoria] = useState(false);
	const [abrirCadastroModalidade, setAbrirCadastroModalidade] = useState(false);
	const [abrirCadastroInteressado, setAbrirCadastroInteressado] = useState(false);

	// Estado para armazenar o item sendo editado
	const [itemEditando, setItemEditando] = useState(null);

	// Estados para abrir os modais de visualização
	const [abrirVisualizarAtleta, setAbrirVisualizarAtleta] = useState(false);
	const [atletaSelecionado, setAtletaSelecionado] = useState(null);
	const [abrirVisualizarResp, setAbrirVisualizarResp] = useState(false);
	const [responsavelSelecionado, setResponsavelSelecionado] = useState(null);
	const [abrirVisualizarTurma, setAbrirVisualizarTurma] = useState(false);
	const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [abrirVisualizarCategoria, setAbrirVisualizarCategoria] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

	// Verificar se o usuário é administrador
	const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
	const isAdmin = usuarioAtual.tipoUsuario === 'administrador';

	// Carregar dados do servidor ao montar
	useEffect(() => {
		Promise.all([
			list('atletas'),
			list('responsaveis'),
			list('treinadores'),
			list('turmas'),
			list('categorias'),
			list('modalidades'),
			list('interessados'),
		])
			.then(([a, r, t, tu, c, m, i]) => {
				if (Array.isArray(a) && a.length) setAthletes(a);
				if (Array.isArray(r) && r.length) setResponsaveis(r);
				if (Array.isArray(t) && t.length) setTreinadores(t);
				if (Array.isArray(tu) && tu.length) setTurmas(tu);
				if (Array.isArray(c) && c.length) setCategorias(c);
				if (Array.isArray(m) && m.length) setModalidades(m);
				if (Array.isArray(i) && i.length) setInteressados(i);
			})
			.catch(() => {});
	}, []);

	// Lógica de Filtragem de Atletas
	const athletesFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'atletas'
			? athletes.filter((athlete) =>
					athlete.name.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: athletes;

	// Lógica de Filtragem de Responsáveis
	const responsibleFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'responsaveis'
			? responsaveis.filter((responsible) =>
					responsible.name.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: responsaveis;

	// Lógica de Filtragem de Treinadores
	const coachFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'treinadores'
			? treinadores.filter((coach) =>
					coach.name.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: treinadores;

	// Lógica de Filtragem de Turmas
	const classesFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'turmas'
			? turmas.filter((classes) =>
					classes.classes.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: turmas;

	// Lógica de Filtragem de Categorias
	const categoriesFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'categorias'
			? categorias.filter((categories) =>
					categories.name.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: categorias;

	// Lógica de Filtragem de Modalidades
	const modalitiesFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'modalidades'
			? modalidades.filter((modalities) =>
					modalities.name.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: modalidades;

	// Lógica de Filtragem de Interessados
	const interessadosFiltrados =
		termoPesquisa.length > 0 && abaAtiva === 'interessados'
			? interessados.filter((interested) =>
					interested.name.toLowerCase().includes(termoPesquisa.toLowerCase())
			  )
			: interessados;

	const handleCreated = async (resource, data) => {
		try {
			const saved = await create(resource, data);
			if (resource === 'atletas') setAthletes((prev) => [...prev, saved]);
			if (resource === 'responsaveis') setResponsaveis((prev) => [...prev, saved]);
			if (resource === 'treinadores') setTreinadores((prev) => [...prev, saved]);
			if (resource === 'turmas') setTurmas((prev) => [...prev, saved]);
			if (resource === 'categorias') setCategorias((prev) => [...prev, saved]);
			if (resource === 'modalidades') setModalidades((prev) => [...prev, saved]);
			if (resource === 'interessados') setInteressados((prev) => [...prev, saved]);
		} catch (e) {
			console.error('Erro ao salvar', resource, e);
		}
	};

	const handleDeleteClick = (recurso, id, nome) => {
		if (!isAdmin) {
			alert('Apenas administradores podem deletar itens');
			return;
		}
		setConfirmDelete({
			aberto: true,
			recurso,
			id,
			nome,
		});
	};

	const handleConfirmDelete = async () => {
		const { recurso, id } = confirmDelete;
		try {
			await remove(recurso, id);
			if (recurso === 'atletas') setAthletes((prev) => prev.filter((item) => item.id !== id));
			if (recurso === 'responsaveis')
				setResponsaveis((prev) => prev.filter((item) => item.id !== id));
			if (recurso === 'treinadores')
				setTreinadores((prev) => prev.filter((item) => item.id !== id));
			if (recurso === 'turmas') setTurmas((prev) => prev.filter((item) => item.id !== id));
			if (recurso === 'categorias')
				setCategorias((prev) => prev.filter((item) => item.id !== id));
			if (recurso === 'modalidades')
				setModalidades((prev) => prev.filter((item) => item.id !== id));
			if (recurso === 'interessados')
				setInteressados((prev) => prev.filter((item) => item.id !== id));
			setConfirmDelete({ aberto: false, recurso: null, id: null, nome: null });
		} catch (e) {
			console.error('Erro ao deletar', recurso, e);
		}
	};

	// Funções de mapeamento para transformar dados da tabela no formato esperado pelos modais
	const mapearDados = (recurso, item) => {
		switch (recurso) {
			case 'atletas':
				return {
					id: item.id,
					nome: item.name || '',
					nascimento: item.nascimento || '',
					cpf: item.cpf || '',
					rg: item.rg || '',
					escola: item.escola || '',
					modalidade: item.modalidade || '',
					categoria: item.category || '',
					turma: item.classes || '',
					cep: item.cep || '',
					bairro: item.bairro || '',
					cidade: item.cidade || '',
					uf: item.uf || '',
					logradouro: item.logradouro || '',
					complemento: item.complemento || '',
					observacoes: item.observacoes || '',
					respCpf: item.respCpf || '',
					respNome: item.respNome || '',
					respEmail: item.respEmail || '',
					respTelefone: item.respTelefone || '',
					respParentesco: item.respParentesco || '',
					respCep: item.respCep || '',
					respBairro: item.respBairro || '',
					respCidade: item.respCidade || '',
					respUf: item.respUf || '',
					respLogradouro: item.respLogradouro || '',
					respComplemento: item.respComplemento || '',
				};
			case 'responsaveis':
				return {
					id: item.id,
					nome: item.name || '',
					cpf: item.cpf || '',
					email: item.email || '',
					telefone: item.phoneNumber || '',
					nomeAtleta: item.athletes?.[0] || '',
					parentesco: item.kinship || '',
					cep: item.cep || '',
					bairro: item.bairro || '',
					cidade: item.cidade || '',
					uf: item.uf || '',
					logradouro: item.logradouro || '',
					complemento: item.complemento || '',
				};
			case 'treinadores':
				return {
					id: item.id,
					nome: item.name || '',
					cpf: item.cpf || '',
					email: item.email || '',
					telefone: item.PhoneNumber || item.phoneNumber || '',
					cep: item.cep || '',
					bairro: item.bairro || '',
					cidade: item.cidade || '',
					uf: item.uf || '',
					logradouro: item.logradouro || '',
					complemento: item.complemento || '',
					turmas: item.classes || [],
					horarios: item.workTimes || [],
				};
			case 'turmas':
				return {
					id: item.id,
					nomeTurma: item.name || item.classes || '',
					categoria: item.category || '',
					modalidade: item.modality || '',
					treinador: item.coach || '',
					horarios: item.workTimes || [],
				};
			case 'categorias':
				return {
					id: item.id,
					nomeCategoria: item.name || '',
				};
			case 'modalidades':
				return {
					id: item.id,
					nomeModalidade: item.name || '',
				};
			case 'interessados':
				return {
					id: item.id,
					nome: item.name || '',
					email: item.email || '',
					telefone: item.phoneNumber || '',
					modalidade: item.modality || '',
					dataInsercao: item.dataInsercao || '',
				};
			default:
				return item;
		}
	};

	const handleEditClick = (recurso, item) => {
		if (!isAdmin) {
			alert('Apenas administradores podem editar itens');
			return;
		}
		const dadosMapeados = mapearDados(recurso, item);
		setItemEditando(dadosMapeados);
		if (recurso === 'atletas') setAbrirCadastroAtleta(true);
		else if (recurso === 'responsaveis') setAbrirCadastroResponsavel(true);
		else if (recurso === 'treinadores') setAbrirCadastroTreinador(true);
		else if (recurso === 'turmas') setAbrirCadastroTurma(true);
		else if (recurso === 'categorias') setAbrirCadastroCategoria(true);
		else if (recurso === 'modalidades') setAbrirCadastroModalidade(true);
		else if (recurso === 'interessados') setAbrirCadastroInteressado(true);
	};

	// Componente para Itens de Aba
	const TabItem = ({ id, label, icon }) => {
		const isActive = abaAtiva === id;
		const activeClasses = 'text-blue-600 border-b-2 border-blue-600 font-semibold ';
		const inactiveClasses = 'text-gray-500 hover:text-gray-700 cursor-pointer';

		return (
			<button
				key={id}
				className={`flex items-center space-x-2 px-7 py-5 text-sm whitespace-nowrap transition duration-150 ${
					isActive ? activeClasses : inactiveClasses
				}`}
				onClick={() => {
					setAbaAtiva(id); // Muda a aba ativa
					setTermoPesquisa(''); // Reseta o termo de pesquisa ao mudar de aba
					window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll para o topo
				}}
			>
				<span className="text-xl">{icon}</span>
				<span>{label}</span>
			</button>
		);
	};

	// Permite que modais aninhados acessem a criação de recursos
	useEffect(() => {
		window.handleCreatedExternal = handleCreated;
		return () => delete window.handleCreatedExternal;
	}, [handleCreated]);

	return (
		<Layout
			title="Cadastros"
			subtitle="Gerencie atletas, responsáveis, treinadores turmas, categorias e modalidades."
		>
			{/* CONTEÚDO PRINCIPAL */}
			<div className="min-h-screen overflow-auto flex-1 ">
				{/* Cabeçalho */}
				<div className="mb-6">
					{/* Navegação por Abas */}
					<div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
						{abas.map((aba) => (
							<TabItem key={aba.id} {...aba} />
						))}
					</div>
				</div>

				{/* Área de Ações (Pesquisa e Novo Item) */}
				<div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
					{/* Barra de Pesquisa */}
					<div className="relative w-full sm:max-w-xs order-2 sm:order-1 ">
						<input
							type="text"
							placeholder={`Buscar ${abas.find((a) => a.id === abaAtiva)?.label}...`}
							className="
              w-full pl-10 pr-4 py-2 border border-gray-300 bg-white
              rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-xs sm:text-sm"
							value={termoPesquisa}
							onChange={(e) => setTermoPesquisa(e.target.value)}
						/>
						{/* Ícone de Busca (Lupa) */}
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400"
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
					{isAdmin ? (
						<BotaoAdicionar
							aba={abaAtiva}
							label={abas.find((a) => a.id === abaAtiva)?.labelSingular}
							onCreated={handleCreated}
						/>
					) : (
						<div className="text-xs sm:text-sm text-gray-500 italic">
							Apenas administradores podem adicionar itens
						</div>
					)}
				</div>

				{/* 4. CONTEÚDO: Tabela/Dados */}
				<div className="shadow-xl rounded-lg p-3 sm:p-4 md:p-6 border border-gray-100 overflow-x-auto -mx-4 sm:mx-0">
					{/* Tabela Atletas */}
					{abaAtiva === 'atletas' && (
						<div className="rounded-lg overflow-x-auto">
							<table className="w-full divide-y divide-gray-200">
								<thead className="bg-white">
									<tr>
										<th
											scope="col"
											className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Nome
										</th>
										<th
											scope="col"
											className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Idade
										</th>
										<th
											scope="col"
											className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Categoria
										</th>
										<th
											scope="col"
											className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Turma
										</th>
										<th
											scope="col"
											className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{athletesFiltrados.map((athletes) => (
										<tr key={athletes.id} className="hover:bg-blue-100">
											<td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-primary-900 truncate">
												<button
													onClick={() => {
														setAtletaSelecionado(athletes);
														setAbrirVisualizarAtleta(true);
													}}
													className="text-blue-600 hover:underline cursor-pointer"
												>
													{athletes.name}
												</button>
											</td>
											<td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-primary-900 font-medium">
												{athletes.age}
											</td>
											<td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{athletes.category}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{athletes.classes}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
												<button
													disabled={!isAdmin}
													onClick={() =>
														handleDeleteClick(
															'atletas',
															athletes.id,
															athletes.name
														)
													}
													className={`transition-colors cursor-pointer ${
														!isAdmin
															? 'opacity-50 cursor-not-allowed'
															: 'text-red-600 hover:text-red-800'
													}`}
													title={
														isAdmin
															? 'Deletar'
															: 'Apenas administradores podem deletar'
													}
												>
													{!isAdmin ? (
														<IoLockClosed size={20} />
													) : (
														<MdDelete size={20} />
													)}
												</button>
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
							<table className="w-full divide-y divide-gray-200">
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
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
										>
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{responsibleFiltrados.map((item) => (
										<tr key={item.id} className="hover:bg-blue-100">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
												<button
													onClick={() => {
														setResponsavelSelecionado(item);
														setAbrirVisualizarResp(true);
													}}
													className="text-blue-600 hover:underline cursor-pointer"
												>
													{item.name}
												</button>
											</td>

											<td className="px-6 py-4 whitespace-wrap text-sm text-primary-900 font-medium max-w-xs">
												<div className="flex flex-wrap gap-x-1">
													{/* Mapeando cada atleta para torná-los azuis com underline no hover */}
													{(item.athletes || []).map((atleta, index) => (
														<span key={index}>
															<span className="text-blue-600 hover:underline cursor-pointer text-sm">
																{atleta}
															</span>
															{index < item.athletes.length - 1 && (
																<span className="text-gray-500">
																	,
																</span>
															)}
														</span>
													))}
												</div>
											</td>

											<td className="px-6 py-4 text-sm text-primary-900">
												{item.kinship}
											</td>
											<td className="px-6 py-4 text-sm text-primary-900 font-medium">
												{item.phoneNumber}
											</td>
											<td className="px-6 py-4 flex gap-3 items-center">
												<button
													onClick={() =>
														handleDeleteClick(
															'responsaveis',
															item.id,
															item.name
														)
													}
													className="text-red-600"
												>
													<MdDelete size={20} />
												</button>
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
							<table className="w-full divide-y divide-gray-200">
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
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
										>
											Ações
										</th>
									</tr>
								</thead>

								<tbody className="bg-white divide-y divide-gray-200">
									{coachFiltrados.map((coach) => (
										<tr key={coach.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
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
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{coach.PhoneNumber}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
												<button
													disabled={!isAdmin}
													onClick={() =>
														handleDeleteClick(
															'treinadores',
															coach.id,
															coach.name
														)
													}
													className={`transition-colors cursor-pointer ${
														!isAdmin
															? 'opacity-50 cursor-not-allowed'
															: 'text-red-600 hover:text-red-800'
													}`}
													title={
														isAdmin
															? 'Deletar'
															: 'Apenas administradores podem deletar'
													}
												>
													{!isAdmin ? (
														<IoLockClosed size={20} />
													) : (
														<MdDelete size={20} />
													)}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{/* Mensagem de "Nenhum resultado" */}
							{classesFiltrados.length === 0 && termoPesquisa.length > 0 && (
								<div className="p-6 text-center text-gray-500">
									Nenhuma turma encontrada com o termo "{termoPesquisa}".
								</div>
							)}
						</div>
					)}

					{/* Conteúdo para Abas TURMAS */}
					{abaAtiva === 'turmas' && (
						<div className="bg-white rounded-lg overflow-x-auto">
							<table className="w-full divide-y divide-gray-200">
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
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
										>
											Ações
										</th>
									</tr>
								</thead>

								<tbody className="bg-white divide-y divide-gray-200">
									{classesFiltrados.map((item) => (
										<tr key={item.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
												<button
													onClick={() => {
														setTurmaSelecionada(item);
														setAbrirVisualizarTurma(true);
													}}
													className="text-blue-600 hover:underline font-medium text-sm cursor-pointer"
												>
													{item.nomeTurma}
												</button>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
												{item.workTimes}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{item.coach}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{item.category}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{item.modality}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
												<button
													disabled={!isAdmin}
													onClick={() =>
														handleDeleteClick(
															'turmas',
															item.id,
															item.classes
														)
													}
													className={`transition-colors cursor-pointer ${
														!isAdmin
															? 'opacity-50 cursor-not-allowed'
															: 'text-red-600 hover:text-red-800'
													}`}
													title={
														isAdmin
															? 'Deletar'
															: 'Apenas administradores podem deletar'
													}
												>
													{!isAdmin ? (
														<IoLockClosed size={20} />
													) : (
														<MdDelete size={20} />
													)}
												</button>
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
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turmas</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriesFiltrados.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        <button
                          onClick={() => {
                            setCategoriaSelecionada(category);
                            setAbrirVisualizarCategoria(true);
                          }}
                          className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                          {category.name}
                        </button>
                      </td>
                      
                      {/* COLUNA TURMAS SEPARADAS (Estilo similar aos Atletas nos Responsáveis) */}
                      <td className="px-6 py-4 whitespace-wrap text-sm text-primary-900 font-medium max-w-xs">
                        <div className="flex flex-wrap gap-x-1">
                          {category.classes?.split(", ").map((turma, index, array) => (
                            <span key={index}>
                              <span 
                                className="text-blue-600 hover:underline cursor-pointer text-sm"
                                onClick={() => {
                                  // Opcional: Lógica para abrir o modal da turma específica aqui
                                  const turmaObj = turmas.find(t => t.nomeTurma === turma);
                                  if (turmaObj) {
                                    setTurmaSelecionada(turmaObj);
                                    setAbrirVisualizarTurma(true);
                                  }
                                }}
                              >
                                {turma}
                              </span>
                              {index < array.length - 1 && <span className="text-gray-500">, </span>}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {category.modality}
                      </td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
												<button
													disabled={!isAdmin}
													onClick={() =>
														handleDeleteClick(
															'categorias',
															category.id,
															category.name
														)
													}
													className={`transition-colors cursor-pointer ${
														!isAdmin
															? 'opacity-50 cursor-not-allowed'
															: 'text-red-600 hover:text-red-800'
													}`}
													title={
														isAdmin
															? 'Deletar'
															: 'Apenas administradores podem deletar'
													}
												>
													{!isAdmin ? (
														<IoLockClosed size={20} />
													) : (
														<MdDelete size={20} />
													)}
												</button>
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
							<table className="w-full divide-y divide-gray-200">
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
										</th>{' '}
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
										>
											Ações
										</th>{' '}
									</tr>
								</thead>

								<tbody className="bg-white divide-y divide-gray-200">
									{modalitiesFiltrados.map((modality) => (
										<tr key={modality.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{modality.name}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{modality.category}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{modality.classes}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
												<button
													disabled={!isAdmin}
													onClick={() =>
														handleDeleteClick(
															'modalidades',
															modality.id,
															modality.name
														)
													}
													className={`transition-colors cursor-pointer ${
														!isAdmin
															? 'opacity-50 cursor-not-allowed'
															: 'text-red-600 hover:text-red-800'
													}`}
													title={
														isAdmin
															? 'Deletar'
															: 'Apenas administradores podem deletar'
													}
												>
													{!isAdmin ? (
														<IoLockClosed size={20} />
													) : (
														<MdDelete size={20} />
													)}
												</button>
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

					{/* Conteúdo para Abas INTERESSADOS */}
					{abaAtiva === 'interessados' && (
						<div className="bg-white rounded-lg overflow-x-auto">
							<table className="w-full divide-y divide-gray-200">
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
											Modalidade
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
										>
											Telefone
										</th>{' '}
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
										>
											Ações
										</th>{' '}
									</tr>
								</thead>

								<tbody className="bg-white divide-y divide-gray-200">
									{interessadosFiltrados.map((interested) => (
										<tr key={interested.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{interested.name}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a
													href="#"
													className="text-blue-600 hover:underline"
												>
													{interested.modality}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<a className="text-primary-900">
													{interested.phoneNumber}
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
												<button
													disabled={!isAdmin}
													onClick={() =>
														handleDeleteClick(
															'interessados',
															interested.id,
															interested.name
														)
													}
													className={`transition-colors cursor-pointer ${
														!isAdmin
															? 'opacity-50 cursor-not-allowed'
															: 'text-red-600 hover:text-red-800'
													}`}
													title={
														isAdmin
															? 'Deletar'
															: 'Apenas administradores podem deletar'
													}
												>
													{!isAdmin ? (
														<IoLockClosed size={20} />
													) : (
														<MdDelete size={20} />
													)}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{/* Mensagem de "Nenhum resultado" */}
							{interessadosFiltrados.length === 0 && termoPesquisa.length > 0 && (
								<div className="p-6 text-center text-gray-500">
									Nenhum interessado encontrado com o termo "{termoPesquisa}".
								</div>
							)}
						</div>
					)}
				</div>

				{/* Modal de Confirmação de Exclusão */}
				{confirmDelete.aberto && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999">
						<div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
							<h3 className="text-lg font-bold text-gray-800 mb-4">
								Confirmar Exclusão
							</h3>
							<p className="text-gray-600 mb-6">
								Tem certeza que deseja deletar <strong>{confirmDelete.nome}</strong>
								?
							</p>
							<p className="text-sm text-gray-500 mb-6">
								Esta ação não pode ser desfeita.
							</p>
							<div className="flex gap-4 justify-end">
								<button
									onClick={() =>
										setConfirmDelete({
											aberto: false,
											recurso: null,
											id: null,
											nome: null,
										})
									}
									className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
								>
									Cancelar
								</button>
								<button
									onClick={handleConfirmDelete}
									className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
								>
									Deletar
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Modais de Cadastro/Edição */}
				<ModalCadastroAtleta
					aberto={abrirCadastroAtleta}
					onClose={() => {
						setAbrirCadastroAtleta(false);
						setItemEditando(null);
					}}
          turmasGlobais={turmas}
          categoriasGlobais={categorias}
					onSave={async (atletaEditado) => {
						try {
							const numTurma = atletaEditado.classes.replace(/\D/g, '');
							const categoriaNova = numTurma
								? `Sub-${numTurma}`
								: atletaEditado.category;
							const dadosAtleta = { ...atletaEditado, category: categoriaNova };

							// 1. Atualiza o Atleta globalmente
							await update('atletas', dadosAtleta.id, dadosAtleta);
							setAthletes((prev) =>
								prev.map((a) => (a.id === dadosAtleta.id ? dadosAtleta : a))
							);

							// 2. SINCRONIZAÇÃO ENTRE TURMAS: Garante que ele só esteja na turma nova
							const novasTurmas = turmas.map((t) => {
								let listaAtletas = [...(t.athletes || [])];

								if (t.nomeTurma === dadosAtleta.classes) {
									// Adiciona na turma nova se não estiver lá
									if (!listaAtletas.includes(dadosAtleta.name))
										listaAtletas.push(dadosAtleta.name);
								} else {
									// Remove de TODAS as outras turmas
									listaAtletas = listaAtletas.filter(
										(name) => name !== dadosAtleta.name
									);
								}
								return { ...t, athletes: listaAtletas };
							});

							// Persiste as mudanças em todas as turmas afetadas
							for (const t of novasTurmas) {
								await update('turmas', t.id, t);
							}
							setTurmas(novasTurmas);
							setAtletaSelecionado(dadosAtleta);
						} catch (e) {
							console.error(e);
						}
					}}
					atleta={itemEditando}
				/>

				<ModalCadastroResponsavel
					aberto={abrirCadastroResponsavel}
					onClose={() => {
						setAbrirCadastroResponsavel(false);
						setItemEditando(null);
					}}
					onSave={(data) => {
						if (itemEditando?.id) {
							setResponsaveis((prev) =>
								prev.map((r) => (r.id === itemEditando.id ? { ...r, ...data } : r))
							);
						} else {
							const newId = Math.max(...responsaveis.map((r) => r.id), 0) + 1;
							setResponsaveis((prev) => [...prev, { id: newId, ...data }]);
						}
						setItemEditando(null);
						setAbrirCadastroResponsavel(false);
					}}
					responsavel={itemEditando}
				/>

				<ModalCadastroTreinador
					aberto={abrirCadastroTreinador}
					onClose={() => {
						setAbrirCadastroTreinador(false);
						setItemEditando(null);
					}}
					onSave={(data) => {
						if (itemEditando?.id) {
							setTreinadores((prev) =>
								prev.map((t) => (t.id === itemEditando.id ? { ...t, ...data } : t))
							);
						} else {
							const newId = Math.max(...treinadores.map((t) => t.id), 0) + 1;
							setTreinadores((prev) => [...prev, { id: newId, ...data }]);
						}
						setItemEditando(null);
						setAbrirCadastroTreinador(false);
					}}
					treinador={itemEditando}
				/>

				<ModalCadastroTurma
					aberto={abrirCadastroTurma}
					onClose={() => {
						setAbrirCadastroTurma(false);
						setItemEditando(null);
					}}
					onSave={async (turmaEditada) => {
						try {
							// 1. Atualiza a Turma atual no banco e no estado
							await update('turmas', turmaEditada.id, turmaEditada);

							// 2. SINCRONIZAÇÃO ENTRE TURMAS: Se um atleta foi adicionado aqui,
							// ele deve ser removido de qualquer outra turma automaticamente.
							const turmasSincronizadas = turmas.map((t) => {
								if (t.id === turmaEditada.id) return turmaEditada;

								// Remove das outras turmas qualquer atleta que agora pertence à turmaEditada
								const atletasLimpas = (t.athletes || []).filter(
									(nomeAtleta) => !turmaEditada.athletes.includes(nomeAtleta)
								);
								return { ...t, athletes: atletasLimpas };
							});

							for (const t of turmasSincronizadas) {
								await update('turmas', t.id, t);
							}
							setTurmas(turmasSincronizadas);

							// 3. Atualiza os Atletas: muda 'classes' e 'category' de quem entrou ou saiu
							const novosAtletas = athletes.map((a) => {
								if (turmaEditada.athletes.includes(a.name)) {
									return {
										...a,
										classes: turmaEditada.nomeTurma,
										category: turmaEditada.category,
									};
								}
								// Se o atleta constava como dessa turma mas não está mais na lista, limpa o campo
								if (
									a.classes === turmaEditada.nomeTurma &&
									!turmaEditada.athletes.includes(a.name)
								) {
									return { ...a, classes: '', category: '' };
								}
								return a;
							});

							for (const a of novosAtletas) {
								await update('atletas', a.id, a);
							}
							setAthletes(novosAtletas);
							setTurmaSelecionada(turmaEditada);
							setAbrirVisualizarTurma(false);
						} catch (e) {
							console.error(e);
						}
					}}
					turma={itemEditando}
				/>

				<ModalCadastroCategoria
					aberto={abrirCadastroCategoria}
					onClose={() => {
						setAbrirCadastroCategoria(false);
						setItemEditando(null);
					}}
					onSave={(data) => {
						if (itemEditando?.id) {
							setCategorias((prev) =>
								prev.map((c) => (c.id === itemEditando.id ? { ...c, ...data } : c))
							);
						} else {
							const newId = Math.max(...categorias.map((c) => c.id), 0) + 1;
							setCategorias((prev) => [...prev, { id: newId, ...data }]);
						}
						setItemEditando(null);
						setAbrirCadastroCategoria(false);
					}}
					categoria={itemEditando}
				/>

				<ModalCadastroModalidade
					aberto={abrirCadastroModalidade}
					onClose={() => {
						setAbrirCadastroModalidade(false);
						setItemEditando(null);
					}}
					onSave={(data) => {
						if (itemEditando?.id) {
							setModalidades((prev) =>
								prev.map((m) => (m.id === itemEditando.id ? { ...m, ...data } : m))
							);
						} else {
							const newId = Math.max(...modalidades.map((m) => m.id), 0) + 1;
							setModalidades((prev) => [...prev, { id: newId, ...data }]);
						}
						setItemEditando(null);
						setAbrirCadastroModalidade(false);
					}}
					modalidade={itemEditando}
				/>

				<ModalCadastroInteressado
					aberto={abrirCadastroInteressado}
					onClose={() => {
						setAbrirCadastroInteressado(false);
						setItemEditando(null);
					}}
					onSave={(data) => {
						if (itemEditando?.id) {
							setInteressados((prev) =>
								prev.map((i) => (i.id === itemEditando.id ? { ...i, ...data } : i))
							);
						} else {
							const newId = Math.max(...interessados.map((i) => i.id), 0) + 1;
							setInteressados((prev) => [...prev, { id: newId, ...data }]);
						}
						setItemEditando(null);
						setAbrirCadastroInteressado(false);
					}}
					interessado={itemEditando}
				/>

				{/* Modal Visualizar Atleta */}
				<ModalVisualizarAtleta
					aberto={abrirVisualizarAtleta}
					onClose={() => setAbrirVisualizarAtleta(false)}
					atleta={atletaSelecionado}
          turmasGlobais={turmas}
          categoriasGlobais={categorias}
					onSave={async (atletaEditado) => {
						try {
							const numTurma = atletaEditado.classes.replace(/\D/g, '');
							const categoriaNova = numTurma
								? `Sub-${numTurma}`
								: atletaEditado.category;
							const dadosAtleta = { ...atletaEditado, category: categoriaNova };

							// Atualiza Atleta no Banco e no Estado
							await update('atletas', dadosAtleta.id, dadosAtleta);
							setAthletes((prev) =>
								prev.map((a) => (a.id === dadosAtleta.id ? dadosAtleta : a))
							);

							// LIMPEZA GLOBAL: Garante que o nome só exista na turma atual
							const turmasAtualizadas = turmas.map((t) => {
								let lista = [...(t.athletes || [])];
								if (t.nomeTurma === dadosAtleta.classes) {
									if (!lista.includes(dadosAtleta.name))
										lista.push(dadosAtleta.name);
								} else {
									// Remove de qualquer outra turma que não seja a selecionada
									lista = lista.filter((n) => n !== dadosAtleta.name);
								}
								return { ...t, athletes: lista };
							});

							for (const t of turmasAtualizadas) await update('turmas', t.id, t);
							setTurmas(turmasAtualizadas);
							setAtletaSelecionado(dadosAtleta);
							setAbrirVisualizarAtleta(false);
						} catch (e) {
							console.error(e);
						}
					}}
				/>

				{/* Modal Visualizar Responsável */}
				<ModalVisualizarResp
					aberto={abrirVisualizarResp}
					onClose={() => {
						setAbrirVisualizarResp(false);
						setResponsavelSelecionado(null);
					}}
					responsavel={responsavelSelecionado}
					onSave={async (dadosAtualizados) => {
						try {
							// 1. Atualiza o responsável
							await update('responsaveis', dadosAtualizados.id, dadosAtualizados);
							setResponsaveis((prev) =>
								prev.map((r) =>
									r.id === dadosAtualizados.id ? dadosAtualizados : r
								)
							);

							// 2. Lógica Adicional: Se o nome do atleta novo não existir na lista global de atletas,
							// você precisará garantir que ele foi criado via handleCreatedExternal
							// ou atualizar o estado manualmente aqui se necessário.

							setAbrirVisualizarResp(false);
						} catch (e) {
							console.error('Erro ao atualizar responsável', e);
						}
					}}
				/>

				{/* Modal Visualizar Turma */}
				<ModalVisualizarTurma
					aberto={abrirVisualizarTurma}
					onClose={() => setAbrirVisualizarTurma(false)}
					turma={turmaSelecionada}
					atletasGlobais={athletes}
					onSave={async (turmaEditada) => {
						try {
							// LIMPEZA GLOBAL: Remove os atletas adicionados aqui de qualquer outra turma
							const turmasSincronizadas = turmas.map((t) => {
								if (t.id === turmaEditada.id) return turmaEditada;
								// Se o atleta está na lista da turma que estamos salvando agora,
								// ele deve ser removido desta outra turma 't'
								const atletasRestantes = (t.athletes || []).filter(
									(nome) => !turmaEditada.athletes.includes(nome)
								);
								return { ...t, athletes: atletasRestantes };
							});

							// Persiste todas as turmas alteradas
							for (const t of turmasSincronizadas) await update('turmas', t.id, t);
							setTurmas(turmasSincronizadas);

							// Atualiza o cadastro individual de cada atleta (Turma e Categoria)
							const atletasAtualizados = athletes.map((a) => {
								if (turmaEditada.athletes.includes(a.name)) {
									return {
										...a,
										classes: turmaEditada.nomeTurma,
										category: turmaEditada.category,
									};
								}
								// Se o atleta estava nesta turma mas foi removido, limpa os campos dele
								if (
									a.classes === turmaSelecionada.nomeTurma &&
									!turmaEditada.athletes.includes(a.name)
								) {
									return { ...a, classes: '', category: '' };
								}
								return a;
							});

							for (const a of atletasAtualizados) await update('atletas', a.id, a);
							setAthletes(atletasAtualizados);
							setAbrirVisualizarTurma(false);
						} catch (e) {
							console.error(e);
						}
					}}
				/>

        <ModalVisualizarCategoria
          aberto={abrirVisualizarCategoria}
          onClose={() => setAbrirVisualizarCategoria(false)}
          categoria={categoriaSelecionada}
          turmasGlobais={turmas}
          modalidadesGlobais={modalidades}
          onSave={async (categoriaEditada) => {
              try {
                  // 1. Atualiza a Categoria no Banco e no Estado
                  await update('categorias', categoriaEditada.id, categoriaEditada);
                  setCategorias(prev => prev.map(c => c.id === categoriaEditada.id ? categoriaEditada : c));

                  // 2. SINCRONIZAR TURMAS: Atualiza o campo 'category' de cada turma
                  const nomesTurmasNaCategoria = categoriaEditada.classes.split(", ");
                  
                  const novasTurmas = turmas.map(t => {
                      // Se a turma foi incluída nesta categoria, atualiza o vínculo
                      if (nomesTurmasNaCategoria.includes(t.nomeTurma)) {
                          return { ...t, category: categoriaEditada.name };
                      }
                      // Se a turma pertencia a esta categoria mas foi removida no modal, limpa o vínculo
                      if (t.category === categoriaEditada.name && !nomesTurmasNaCategoria.includes(t.nomeTurma)) {
                          return { ...t, category: "" };
                      }
                      return t;
                  });

                  for (const t of novasTurmas) {
                      await update('turmas', t.id, t);
                  }
                  setTurmas(novasTurmas);

                  // 3. SINCRONIZAR ATLETAS: Atualiza a categoria do aluno baseada na sua Turma
                  const novosAtletas = athletes.map(a => {
                      // Encontra a turma atual do atleta na lista recém-atualizada
                      const turmaDoAtleta = novasTurmas.find(t => t.nomeTurma === a.classes);
                      if (turmaDoAtleta) {
                          return { ...a, category: turmaDoAtleta.category };
                      }
                      return a;
                  });

                  for (const a of novosAtletas) {
                      await update('atletas', a.id, a);
                  }
                  setAthletes(novosAtletas);

                  setAbrirVisualizarCategoria(false);
              } catch (e) { console.error("Erro na sincronização de categoria:", e); }
          }}
      />
			</div>
		</Layout>
	);
};

export default Cadastros;
