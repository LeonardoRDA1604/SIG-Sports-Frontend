import { useState, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

export default function ModalCadastroAtleta({
	aberto,
	onClose,
	onSave,
	atleta,
	responsavelContexto, // Dados do responsável atual
	turmasGlobais = [],
    categoriasGlobais = [],
}) {
	const [step, setStep] = useState(1); // Controle da página (1 ou 2)
	const [enderecoMesmoAtleta, setEnderecoMesmoAtleta] = useState(true); // Boolean de Mesmo Endereço do Atleta
	const [emailErro, setEmailErro] = useState(false); // Estado de erro do email
	const [atletaEmailErro, setAtletaEmailErro] = useState(false);
	const [respEmailErro, setRespEmailErro] = useState(false);

	const estadoInicial = {
		// Dados Atleta (Pág 1)
		nome: '',
		nascimento: '',
		cpf: '',
		rg: '',
		email: '',
		escola: '',
		modalidade: '',
		category: '',
		classes: '',
		cep: '',
		bairro: '',
		cidade: '',
		uf: '',
		logradouro: '',
		complemento: '',
		observacoes: '',
		// Dados Responsável (Pág 2)
		respCpf: '',
		respNome: '',
		respEmail: '',
		respTelefone: '',
		respParentesco: '',
		respCep: '',
		respBairro: '',
		respCidade: '',
		respUf: '',
		respLogradouro: '',
		respComplemento: '',
	};

	const [formData, setFormData] = useState(estadoInicial); // Utiliza o estado inicial do formulário para iniciar o estado dos campos


	// Preencher dados quando estiver editando
	useEffect(() => {
		if (aberto) {
			if (atleta) {
				// Modo Edição de Atleta Existente
				setFormData(atleta);
			} else if (responsavelContexto) {
				// Modo Novo Atleta vinculado a um Responsável já aberto
				setFormData({
					...estadoInicial,
					respCpf: responsavelContexto.cpf || '',
					respNome: responsavelContexto.name || '',
					respEmail: responsavelContexto.email || '',
					respTelefone:
						responsavelContexto.phoneNumber || responsavelContexto.phone || '',
					respParentesco: responsavelContexto.kinship || '',
					// Herda o endereço do responsável para o atleta inicialmente
					cep: responsavelContexto.cep || '',
					bairro: responsavelContexto.bairro || '',
					cidade: responsavelContexto.cidade || '',
					uf: responsavelContexto.uf || '',
					logradouro: responsavelContexto.logradouro || responsavelContexto.street || '',
					complemento: responsavelContexto.complemento || '',
					// Dados fixos do responsável na pág 2
					respCep: responsavelContexto.cep || '',
					respBairro: responsavelContexto.bairro || '',
					respCidade: responsavelContexto.city || responsavelContexto.cidade || '',
					respUf: responsavelContexto.uf || '',
					respLogradouro:
						responsavelContexto.logradouro || responsavelContexto.street || '',
					respComplemento: responsavelContexto.complemento || '',
				});
			} else {
				setFormData(estadoInicial);
			}
			setStep(1);
		}
	}, [aberto, atleta, responsavelContexto]);

	// Validação de formato de Email
	const validarEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	// Capitalizar nomes (primeira letra maiúscula em cada palavra)
	const capitalizarNome = (nome) => {
		if (!nome) return '';
		return nome
			.toLowerCase()
			.split(' ')
			.map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
			.join(' ');
	};

	// Função para validar campos obrigatórios de acordo com o Step
	const validarCampos = () => {
    if (step === 1) {
        const obrigatoriosStep1 = [
            'nome', 'nascimento', 'escola', 'modalidade', 
            'category', 'classes', 'cep', 'bairro', 'cidade', 'logradouro'
        ];
        // Verifica se os campos obrigatórios estão preenchidos
        const preenchidos = obrigatoriosStep1.every((campo) => formData[campo]?.trim() !== '');
        
        // SÓ permite continuar se estiver preenchido E o e-mail (se digitado) não tiver erro
        return preenchidos && !atletaEmailErro;
    } else {
        const obrigatoriosStep2Base = ['respCpf', 'respNome', 'respEmail', 'respTelefone', 'respParentesco'];
        
        // Valida campos base do responsável + erro de e-mail
        const baseValida = obrigatoriosStep2Base.every((campo) => formData[campo]?.trim() !== '') && !respEmailErro;

        if (enderecoMesmoAtleta) return baseValida;

        // Se o endereço for diferente, valida os campos de endereço do responsável
        const obrigatoriosEnderecoResp = ['respCep', 'respBairro', 'respCidade', 'respLogradouro'];
        return baseValida && obrigatoriosEnderecoResp.every((campo) => formData[campo]?.trim() !== '');
    }
};

	// Reset do modal ao fechar
	const handleClose = () => {
		setFormData(estadoInicial);
		setStep(1);
		setEnderecoMesmoAtleta(true);
		setEmailErro(false);
		onClose();
	};

	const calcularIdade = (nasc) => {
		try {
			const [dia, mes, ano] = nasc.split('/');
			const d = new Date(`${ano}-${mes}-${dia}`);
			const diff = Date.now() - d.getTime();
			const ageDt = new Date(diff);
			return Math.abs(ageDt.getUTCFullYear() - 1970);
		} catch {
			return null;
		}
	};

	const handleSalvar = () => {
		if (!validarCampos()) return;
		const payload = {
			name: capitalizarNome(formData.nome),
			nascimento: formData.nascimento,
			cpf: formData.cpf,
			rg: formData.rg,
			email: formData.email,
			escola: capitalizarNome(formData.escola),
			modalidade: formData.modalidade,
			age: formData.nascimento ? calcularIdade(formData.nascimento) : null,
			category: (formData.category || '').replace(/^sub-/i, 'Sub-'),
			classes: formData.classes || '',
			cep: formData.cep,
			bairro: capitalizarNome(formData.bairro),
			cidade: capitalizarNome(formData.cidade),
			uf: formData.uf || '',
			logradouro: capitalizarNome(formData.logradouro),
			complemento: capitalizarNome(formData.complemento),
			observacoes: formData.observacoes,
			respCpf: formData.respCpf,
			respNome: capitalizarNome(formData.respNome),
			respEmail: formData.respEmail,
			respTelefone: formData.respTelefone,
			respParentesco: formData.respParentesco,
			respCep: formData.respCep,
			respBairro: capitalizarNome(formData.respBairro),
			respCidade: capitalizarNome(formData.respCidade),
			respUf: formData.respUf || '',
			respLogradouro: capitalizarNome(formData.respLogradouro),
			respComplemento: capitalizarNome(formData.respComplemento),
		};
		onSave?.(payload);
		handleClose();
	};

	// Máscaras
	const maskCPF = (v) =>
		v
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.substring(0, 14);
	const maskRG = (v) =>
		v
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
			.substring(0, 12);
	const maskData = (v) =>
		v
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d)/, '$1/$2')
			.replace(/(\d{2})(\d)/, '$1/$2')
			.substring(0, 10);
	const maskCEP = (v) =>
		v
			.replace(/\D/g, '')
			.replace(/(\d{5})(\d{3})/, '$1-$2')
			.substring(0, 9);
	const maskTelefone = (v) =>
		v
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
			.substring(0, 15);

	// Buscar endereço pela API ViaCEP
	const buscarEnderecoPorCEP = async (cep, isResp = false) => {
		const cepLimpo = cep.replace(/\D/g, '');
		if (cepLimpo.length !== 8) return;

		try {
			const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
			const data = await response.json();

			if (!data.erro) {
				const prefix = isResp ? 'resp' : '';
				setFormData((prev) => ({
					...prev,
					[prefix + 'logradouro']: data.logradouro || '',
					[prefix + 'bairro']: data.bairro || '',
					[prefix + 'cidade']: data.localidade || '',
					[prefix + 'uf']: data.uf || '',
				}));
			}
		} catch (error) {
			console.error('Erro ao buscar CEP:', error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		let maskedValue = value;

		if (name.toLowerCase().includes('cpf')) maskedValue = maskCPF(value);
		if (name.toLowerCase().includes('rg')) maskedValue = maskRG(value);
		if (name.toLowerCase().includes('nascimento')) maskedValue = maskData(value);
		if (name.toLowerCase().includes('cep')) {
			maskedValue = maskCEP(value);
			// Buscar endereço quando o CEP estiver completo
			const cepLimpo = maskedValue.replace(/\D/g, '');
			if (cepLimpo.length === 8) {
				const isResp = name.toLowerCase().includes('resp');
				buscarEnderecoPorCEP(maskedValue, isResp);
			}
		}
		if (name.toLowerCase().includes('telefone')) maskedValue = maskTelefone(value);

		if (name === 'email') {
			setAtletaEmailErro(!validarEmail(value) && value !== '');
		}
		if (name === 'respEmail') {
			setRespEmailErro(!validarEmail(value) && value !== '');
		}

		// Se mudar a categoria, reseta a turma selecionada para evitar inconsistência
		if (name === 'category') {
			const primeiraTurma = turmasGlobais?.find((t) => t.category === value);
			setFormData((prev) => ({
				...prev,
            	category: value,
            	classes: primeiraTurma ? primeiraTurma.nomeTurma : '',
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: maskedValue }));
		}
	};

	// Padronização dos estilos dos inputs
	const inputStyle =
		'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm placeholder:text-gray-400';
	// Estilo para Selects normais (Categoria, Modalidade)
	const selectStyle =
		'w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm cursor-pointer';
	// Estilo específico para a Turma (com lógica de cinza)
	const turmaSelectStyle = `w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm transition-colors ${
		!formData.category
			? 'bg-gray-100 text-gray-400 cursor-not-allowed'
			: 'bg-white text-gray-900 cursor-pointer'
	}`;

	if (!aberto) return null; // Não renderiza nada quando estiver fechado

	return (
		// z-99999 (z-index: 110000) para o modal aparecer acima de tudo (principalmente acima do modal de visualização de responsável), independente de onde esteja no código
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center min-h-screen z-110000">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
				{/* Cabeçalho */}
				<div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
					<h2 className="text-xl font-bold text-[#101944]">Novo Atleta</h2>
					<div className="flex items-center gap-4">
						{/* Oculta "Pág 1/2" se houver contexto de responsável */}
						{!responsavelContexto && (
							<span className="text-xs text-gray-400 font-bold">Pág {step}/2</span>
						)}
						<button
							onClick={onClose}
							className="text-[#101944] hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer"
						>
							<IoClose size={24} />
						</button>
					</div>
				</div>

				{/* Conteúdo Scrollável */}
				<div className="overflow-y-auto custom-scrollbar p-6 space-y-5 flex-1">
					{step === 1 ? (
						<>
							{/* --- PÁGINA 1 --- */}
							<h3 className="text-lg font-bold text-[#101944]">Dados do atleta</h3>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Nome Completo <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="nome"
									value={formData.nome}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Data de nascimento <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="nascimento"
									placeholder="DD/MM/AAAA"
									value={formData.nascimento}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-slate-600 mb-1">
										CPF
									</label>
									<input
										type="text"
										name="cpf"
										value={formData.cpf}
										onChange={handleChange}
										placeholder="000.000.000-00"
										className={inputStyle}
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-slate-600 mb-1">
										RG
									</label>
									<input
										type="text"
										name="rg"
										value={formData.rg}
										onChange={handleChange}
										placeholder="00.000.000-0"
										className={inputStyle}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="exemplo@email.com"
									className={`${inputStyle} ${atletaEmailErro ? 'border-red-500 focus:ring-red-500/20' : ''}`}
								/>
								{atletaEmailErro && (
									<span className="text-[10px] text-red-500 font-bold mt-1 block px-1">
										Formato de e-mail inválido.
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Nome da escola <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="escola"
									value={formData.escola}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Modalidade <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										name="modalidade"
										value={formData.modalidade}
										onChange={handleChange}
										className={selectStyle}
									>
										<option value="" disabled>
											Selecione
										</option>
										<option value="futebol">Futebol</option>
										<option value="futsal">Futsal</option>
										<option value="beach-soccer">Beach Soccer</option>
										<option value="fut7">Fut7</option>
									</select>
									<HiChevronDown
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
										size={20}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Categoria <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										name="category"
										value={formData.category}
										onChange={handleChange}
										className={selectStyle}
									>
										<option value="" disabled>
											Selecione
										</option>
										{categoriasGlobais?.map((cat) => (
											<option key={cat.id} value={cat.name}>
												{cat.name}
											</option>
										))}
									</select>
									<HiChevronDown
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
										size={20}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Turma <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										name="classes"
										value={formData.classes}
										onChange={handleChange}
										className={turmaSelectStyle}
										disabled={!formData.category}
									>
										<option value="" disabled>
											Selecione a turma
										</option>
										{turmasGlobais
											?.filter((t) => t.category === formData.category)
											.map((t) => (
												<option key={t.id} value={t.nomeTurma}>
													{t.nomeTurma}
												</option>
											))}
									</select>
									<HiChevronDown
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
										size={20}
									/>
								</div>
							</div>
							<h3 className="text-lg font-bold text-[#101944] pt-4 border-t border-gray-50">
								Endereço do atleta
							</h3>
							<div className="grid grid-cols-12 gap-4">
								<div className="col-span-5">
									<label className="block text-sm font-semibold text-slate-600 mb-1">
										CEP <span className="text-red-500">*</span>
									</label>
									<input
										name="cep"
										value={formData.cep}
										onChange={handleChange}
										placeholder="00000-000"
										className={inputStyle}
									/>
								</div>
								<div className="col-span-7">
									<label className="block text-sm font-semibold text-slate-600 mb-1">
										Bairro <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="bairro"
										value={formData.bairro}
										onChange={handleChange}
										className={inputStyle}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Cidade <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="cidade"
									value={formData.cidade}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div className="relative">
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Estado (UF) <span className="text-red-500">*</span>
								</label>
								<select
									name="uf"
									value={formData.uf}
									onChange={handleChange}
									className={`${selectStyle} appearance-none`}
								>
									<option value="" disabled>
										Selecione o Estado
									</option>
									<option value="AC">Acre</option>
									<option value="AL">Alagoas</option>
									<option value="AP">Amapá</option>
									<option value="AM">Amazonas</option>
									<option value="BA">Bahia</option>
									<option value="CE">Ceará</option>
									<option value="DF">Distrito Federal</option>
									<option value="ES">Espírito Santo</option>
									<option value="GO">Goiás</option>
									<option value="MA">Maranhão</option>
									<option value="MT">Mato Grosso</option>
									<option value="MS">Mato Grosso do Sul</option>
									<option value="MG">Minas Gerais</option>
									<option value="PA">Pará</option>
									<option value="PB">Paraíba</option>
									<option value="PR">Paraná</option>
									<option value="PE">Pernambuco</option>
									<option value="PI">Piauí</option>
									<option value="RJ">Rio de Janeiro</option>
									<option value="RN">Rio Grande do Norte</option>
									<option value="RS">Rio Grande do Sul</option>
									<option value="RO">Rondônia</option>
									<option value="RR">Roraima</option>
									<option value="SC">Santa Catarina</option>
									<option value="SP">São Paulo</option>
									<option value="SE">Sergipe</option>
									<option value="TO">Tocantins</option>
								</select>
								<HiChevronDown
									className="absolute right-4 top-8 text-gray-400 pointer-events-none"
									size={20}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Logradouro <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="logradouro"
									value={formData.logradouro}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Complemento
								</label>
								<input
									type="text"
									name="complemento"
									value={formData.complemento}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div className="pt-4">
								<h3 className="text-lg font-bold text-[#101944]">Observações</h3>
								<p className="text-xs text-gray-500 mb-2">
									Insira as informações complementares sobre o aluno.
								</p>
								<textarea
									name="observacoes"
									value={formData.observacoes}
									onChange={handleChange}
									placeholder="Digite aqui..."
									className={`${inputStyle} min-h-32 resize-none pt-3`}
								/>
							</div>
						</>
					) : (
						<>
							{/* --- PÁGINA 2 --- */}
							<h3 className="text-lg font-bold text-[#101944]">
								Dados do responsável
							</h3>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									CPF <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="respCpf"
									value={formData.respCpf}
									onChange={handleChange}
									placeholder="000.000.000-00"
									className={inputStyle}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Nome completo <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="respNome"
									value={formData.respNome}
									onChange={handleChange}
									className={inputStyle}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									E-mail <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									name="respEmail"
									value={formData.respEmail}
									onChange={handleChange}
									className={`${inputStyle} ${respEmailErro ? 'border-red-500 focus:ring-red-500/20' : ''}`}
								/>
								{respEmailErro && (
									<span className="text-[10px] text-red-500 font-bold mt-1 block px-1">
										Por favor, insira um e-mail válido para o responsável.
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Telefone <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="respTelefone"
									value={formData.respTelefone}
									onChange={handleChange}
									placeholder="(00) 00000-0000"
									className={inputStyle}
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-600 mb-1">
									Grau de parentesco <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										name="respParentesco"
										value={formData.respParentesco}
										onChange={handleChange}
										className={selectStyle}
									>
										<option value="" disabled>
											Selecione
										</option>
										<option value="mae">Mãe</option>
										<option value="pai">Pai</option>
										<option value="avo_f">Avó</option>
										<option value="avo_m">Avô</option>
										<option value="irmao">Irmão/Irmã</option>
										<option value="tio">Tio/Tia</option>
										<option value="outro">Outro</option>
									</select>
									<HiChevronDown
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
										size={20}
									/>
								</div>
							</div>

							<div className="pt-4">
								<label className="block text-sm font-semibold text-slate-600 mb-3">
									Endereço Responsável é o mesmo do atleta ?{' '}
									<span className="text-red-500">*</span>
								</label>
								<div className="flex gap-6">
									<label
										className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#101944]"
										onClick={() => setEnderecoMesmoAtleta(true)}
									>
										<div
											className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
												enderecoMesmoAtleta
													? 'bg-[#003366] border-[#003366]'
													: 'border-gray-300'
											}`}
										>
											{enderecoMesmoAtleta && (
												<div className="w-2 h-2 bg-white rounded-full"></div>
											)}
										</div>
										Sim
									</label>
									<label
										className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#101944]"
										onClick={() => setEnderecoMesmoAtleta(false)}
									>
										<div
											className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
												!enderecoMesmoAtleta
													? 'bg-[#003366] border-[#003366]'
													: 'border-gray-300'
											}`}
										>
											{!enderecoMesmoAtleta && (
												<div className="w-2 h-2 bg-white rounded-full"></div>
											)}
										</div>
										Não
									</label>
								</div>
							</div>

							{!enderecoMesmoAtleta && (
								<div className="pt-4 space-y-4">
									<h3 className="text-lg font-bold text-[#101944]">
										Endereço do Responsável
									</h3>
									<div className="grid grid-cols-12 gap-4">
										<div className="col-span-5">
											<label className="block text-sm font-semibold text-slate-600 mb-1">
												CEP <span className="text-red-500">*</span>
											</label>
											<input
												name="respCep"
												value={formData.respCep}
												onChange={handleChange}
												placeholder="00000-000"
												className={inputStyle}
											/>
										</div>
										<div className="col-span-7">
											<label className="block text-sm font-semibold text-slate-600 mb-1">
												Bairro <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												name="respBairro"
												value={formData.respBairro}
												onChange={handleChange}
												className={inputStyle}
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-semibold text-slate-600 mb-1">
											Cidade <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											name="respCidade"
											value={formData.respCidade}
											onChange={handleChange}
											className={inputStyle}
										/>
									</div>
									<div className="relative">
										<label className="block text-sm font-semibold text-slate-600 mb-1">
											Estado (UF) <span className="text-red-500">*</span>
										</label>
										<select
											name="respUf"
											value={formData.respUf}
											onChange={handleChange}
											className={`${selectStyle} appearance-none`}
										>
											<option value="">Selecione o Estado</option>
											<option value="AC">Acre</option>
											<option value="AL">Alagoas</option>
											<option value="AP">Amapá</option>
											<option value="AM">Amazonas</option>
											<option value="BA">Bahia</option>
											<option value="CE">Ceará</option>
											<option value="DF">Distrito Federal</option>
											<option value="ES">Espírito Santo</option>
											<option value="GO">Goiás</option>
											<option value="MA">Maranhão</option>
											<option value="MT">Mato Grosso</option>
											<option value="MS">Mato Grosso do Sul</option>
											<option value="MG">Minas Gerais</option>
											<option value="PA">Pará</option>
											<option value="PB">Paraíba</option>
											<option value="PR">Paraná</option>
											<option value="PE">Pernambuco</option>
											<option value="PI">Piauí</option>
											<option value="RJ">Rio de Janeiro</option>
											<option value="RN">Rio Grande do Norte</option>
											<option value="RS">Rio Grande do Sul</option>
											<option value="RO">Rondônia</option>
											<option value="RR">Roraima</option>
											<option value="SC">Santa Catarina</option>
											<option value="SP">São Paulo</option>
											<option value="SE">Sergipe</option>
											<option value="TO">Tocantins</option>
										</select>
										<HiChevronDown
											className="absolute right-4 top-8 text-gray-400 pointer-events-none"
											size={20}
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-slate-600 mb-1">
											Logradouro <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											name="respLogradouro"
											value={formData.respLogradouro}
											onChange={handleChange}
											className={inputStyle}
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-slate-600 mb-1">
											Complemento
										</label>
										<input
											type="text"
											name="respComplemento"
											value={formData.respComplemento}
											onChange={handleChange}
											className={inputStyle}
										/>
									</div>
								</div>
							)}
						</>
					)}
				</div>

				{/* Rodapé */}
				<div className="p-6 border-t border-gray-100 flex justify-end gap-4 bg-gray-50 rounded-b-2xl">
					<button
						onClick={onClose}
						className="text-[#101944] font-bold text-sm hover:underline"
					>
						Cancelar
					</button>

					<button
						onClick={() => {
							// Se houver contexto de responsável ou já estivermos no step 2, salva.
							// Caso contrário, continua para o step 2.
							if (responsavelContexto || step === 2) {
								handleSalvar();
							} else {
								setStep(2);
							}
						}}
						disabled={!validarCampos()}
						className={`px-10 py-2.5 rounded-full font-bold shadow-md transition-all ${
							validarCampos()
								? 'bg-[#003366] text-white hover:bg-blue-900'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}
					>
						{/* O botão vira "Salvar" imediatamente se houver contexto */}
						{responsavelContexto || step === 2 ? 'Salvar' : 'Continuar'}
					</button>
				</div>
			</div>
		</div>
	);
}
