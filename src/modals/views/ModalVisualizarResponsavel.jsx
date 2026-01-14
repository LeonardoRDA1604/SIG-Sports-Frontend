import { useState, useEffect } from 'react';
import {
	IoClose,
	IoPerson,
	IoChevronDown,
	IoDocumentText,
	IoPeople,
	IoAddCircle,
	IoTrash,
} from 'react-icons/io5';
import { temAcessoBloqueado } from '../../utils/permissoes';
import ModalCadastroAtleta from '../forms/ModalCadastroAtleta';

export default function ModalVisualizarResponsavel({
	aberto,
	onClose,
	responsavel,
	onSave,
	turmasGlobais,
    categoriasGlobais
}) {
	// ========================
	// ESTADOS DE CONTROLE
	// ========================
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState('info'); // 'info', 'obs', 'atletas'
	const [formData, setFormData] = useState({
		id: '',
		name: '',
		email: '',
		cpf: '',
		birthDate: '',
		kinship: 'Mãe',
		phoneNumber: '',
		primaryAthlete: '', // Campo "Aluno" do print
		observations: '',
		athletes: [],
		address: {
			street: '',
			neighborhood: '',
			city: '',
			uf: 'PE',
			cep: '',
			complement: '',
		},
	});
	const [emailErro, setEmailErro] = useState(false);
	const [abrirNovoAtleta, setAbrirNovoAtleta] = useState(false);

	// ========================
	// ESTILOS REUTILIZÁVEIS
	// ========================
	const labelStyle = 'text-[10px] font-bold uppercase text-[#101944] px-1 mb-1 block';
	const tabStyleActive =
		'px-4 py-3 border-b-2 border-blue-600 font-bold text-[#101944] flex items-center gap-2 transition-all shrink-0';
	const tabStyleInactive =
		'px-4 py-3 text-[#101944]/60 font-semibold hover:text-[#101944] hover:bg-black/5 flex items-center gap-2 transition-all cursor-pointer shrink-0';

	const getFieldStyle = (editing, hasError = false, isTextArea = false) => {
		const base = `w-full p-2.5 rounded-xl font-medium transition-all outline-none border text-sm shadow-sm appearance-none ${
			isTextArea ? '' : 'h-[42px]'
		}`;
		if (!editing)
			return `${base} bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none`;
		if (hasError) return `${base} bg-white text-red-600 border-red-500 ring-2 ring-red-500/10`;
		return `${base} bg-white text-gray-800 border-blue-500 ring-2 ring-blue-500/10 focus:border-blue-600 cursor-text`;
	};

	const inputStyle = getFieldStyle(isEditing);

	const listaUFs = [
		'AC',
		'AL',
		'AP',
		'AM',
		'BA',
		'CE',
		'DF',
		'ES',
		'GO',
		'MA',
		'MT',
		'MS',
		'MG',
		'PA',
		'PB',
		'PR',
		'PE',
		'PI',
		'RJ',
		'RN',
		'RS',
		'RO',
		'RR',
		'SC',
		'SP',
		'SE',
		'TO',
	];

	// ========================
	// FUNÇÕES DE MÁSCARA
	// ========================
	const maskCPF = (v) => {
		const nums = v.replace(/\D/g, '').substring(0, 11);
		return nums
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
	};
	const maskCEP = (v) =>
		v
			.replace(/\D/g, '')
			.substring(0, 8)
			.replace(/(\d{5})(\d)/, '$1-$2');
	const maskData = (v) =>
		v
			.replace(/\D/g, '')
			.substring(0, 8)
			.replace(/(\d{2})(\d)/, '$1/$2')
			.replace(/(\d{2})(\d)/, '$1/$2');
	const maskPhone = (v) => {
		const nums = v.replace(/\D/g, '').substring(0, 11);
		if (nums.length <= 10)
			return nums.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
		return nums.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
	};

	const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	// ========================
	// CICLO DE VIDA
	// ========================
    useEffect(() => {
        if (responsavel) {
            setFormData({
                ...responsavel,
                athletes: responsavel.athletes || [],
                observations: responsavel.observations || responsavel.observacoes || '',
                address: responsavel.address || {
                    street: responsavel.logradouro || '',
                    neighborhood: responsavel.bairro || '',
                    city: responsavel.cidade || '',
                    uf: responsavel.uf || '',
                    cep: responsavel.cep || '',
                    complement: responsavel.complemento || '',
                }
            });
            setIsEditing(false);
            setActiveTab('info');
        }
    }, [responsavel, aberto]);

	// ========================
	// MANIPULADORES DE EVENTOS
	// ========================
	const handleChange = (e) => {
		const { name, value } = e.target;
		let maskedValue = value;

		if (isEditing) {
			if (name === 'cpf') maskedValue = maskCPF(value);
			if (name === 'address.cep') maskedValue = maskCEP(value);
			if (name === 'birthDate') maskedValue = maskData(value);
			if (name === 'phoneNumber') maskedValue = maskPhone(value);
			if (name === 'email') setEmailErro(!validarEmail(value) && value !== '');
		}

		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			setFormData((prev) => ({
				...prev,
				[parent]: { ...prev[parent], [child]: maskedValue },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: maskedValue }));
		}
	};

    const removerAtleta = (index) => {
        setFormData(prev => ({
            ...prev,
            athletes: prev.athletes.filter((_, i) => i !== index),
        }));
    };

	const handleDiscard = () => {
		setIsEditing(false);
		setEmailErro(false);
		// O useEffect resetará os dados ao recarregar a prop 'responsavel'
	};

	const handleFinalSave = () => {
		if (emailErro) return;
		onSave(formData);
		setIsEditing(false);
	};

	if (!aberto || !formData) return null;

	return (
		<>
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
				<div className="w-full max-w-lg bg-[#050a24] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
					{/* HEADER */}
					<div className="p-6 flex justify-between items-center shrink-0">
						<h2 className="text-xl font-bold truncate">
							{isEditing ? 'Modo Edição' : `${formData.name} - Responsável`}
						</h2>
						<button
							onClick={onClose}
							className="hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"
						>
							<IoClose size={28} />
						</button>
					</div>

					<div className="bg-[#d9d9d9] flex-1 flex flex-col overflow-hidden text-[#101944]">
						{/* NAVEGAÇÃO DE ABAS */}
						<div className="flex px-4 bg-black/5 text-sm border-b border-black/10 shrink-0">
							<button
								onClick={() => setActiveTab('info')}
								className={activeTab === 'info' ? tabStyleActive : tabStyleInactive}
							>
								<IoPerson /> Informações
							</button>
							<button
								onClick={() => setActiveTab('obs')}
								className={activeTab === 'obs' ? tabStyleActive : tabStyleInactive}
							>
								<IoDocumentText /> Observações
							</button>
							<button
								onClick={() => setActiveTab('atletas')}
								className={
									activeTab === 'atletas' ? tabStyleActive : tabStyleInactive
								}
							>
								<IoPeople /> Atletas
							</button>
						</div>

						<div className="flex-1 overflow-hidden flex flex-col p-6">
							{/* ABA: INFORMAÇÕES */}
							{activeTab === 'info' && (
								<div className="overflow-y-auto space-y-4 custom-scrollbar pr-1">
									<div>
										<label className={labelStyle}>Nome:</label>
										<input
											name="name"
											value={formData.name}
											onChange={handleChange}
											disabled={!isEditing}
											className={inputStyle}
										/>
									</div>
									<div>
										<label className={labelStyle}>E-mail:</label>
										<input
											name="email"
											value={formData.email}
											onChange={handleChange}
											disabled={!isEditing}
											className={getFieldStyle(isEditing, emailErro)}
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className={labelStyle}>CPF:</label>
											<input
												name="cpf"
												value={formData.cpf}
												onChange={handleChange}
												disabled={!isEditing}
												className={inputStyle}
												placeholder="000.000.000-00"
											/>
										</div>
										<div>
											<label className={labelStyle}>Data de Nasc:</label>
											<input
												name="birthDate"
												value={formData.birthDate}
												onChange={handleChange}
												disabled={!isEditing}
												className={inputStyle}
												placeholder="DD/MM/AAAA"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div className="relative">
											<label className={labelStyle}>
												Grau de Parentesco:
											</label>
											<select
												name="kinship"
												value={formData.kinship}
												onChange={handleChange}
												disabled={!isEditing}
												className={inputStyle}
											>
												<option>Mãe</option>
												<option>Pai</option>
												<option>Avô/Avó</option>
												<option>Tio/Tia</option>
												<option>Outro</option>
											</select>
											{isEditing && (
												<IoChevronDown
													className="absolute right-3 bottom-3 text-gray-500 pointer-events-none"
													size={18}
												/>
											)}
										</div>
										<div>
											<label className={labelStyle}>Telefone:</label>
											<input
												name="phoneNumber"
												value={formData.phoneNumber}
												onChange={handleChange}
												disabled={!isEditing}
												className={inputStyle}
												placeholder="(00) 00000-0000"
											/>
										</div>
									</div>

									<div className="pt-4 border-t border-black/10">
										<h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
											Endereço
										</h3>
										<div className="space-y-4">
											<div>
												<label className={labelStyle}>Logradouro:</label>
												<input
													name="address.street"
													value={formData.address.street}
													onChange={handleChange}
													disabled={!isEditing}
													className={inputStyle}
												/>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className={labelStyle}>
														Complemento:
													</label>
													<input
														name="address.complement"
														value={formData.address.complement}
														onChange={handleChange}
														disabled={!isEditing}
														className={inputStyle}
													/>
												</div>
												<div>
													<label className={labelStyle}>Bairro:</label>
													<input
														name="address.neighborhood"
														value={formData.address.neighborhood}
														onChange={handleChange}
														disabled={!isEditing}
														className={inputStyle}
													/>
												</div>
											</div>
											<div className="grid grid-cols-12 gap-3">
												<div className="col-span-6">
													<label className={labelStyle}>Cidade:</label>
													<input
														name="address.city"
														value={formData.address.city}
														onChange={handleChange}
														disabled={!isEditing}
														className={inputStyle}
													/>
												</div>
												<div className="col-span-2 relative">
													<label className={labelStyle}>UF:</label>
													<select
														name="address.uf"
														value={formData.address.uf}
														onChange={handleChange}
														disabled={!isEditing}
														className={inputStyle}
													>
														{listaUFs.map((uf) => (
															<option key={uf}>{uf}</option>
														))}
													</select>
													{isEditing && (
														<IoChevronDown
															className="absolute right-2 bottom-3 text-gray-500 pointer-events-none"
															size={14}
														/>
													)}
												</div>
												<div className="col-span-4">
													<label className={labelStyle}>CEP:</label>
													<input
														name="address.cep"
														value={formData.address.cep}
														onChange={handleChange}
														disabled={!isEditing}
														className={inputStyle}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* ABA: OBSERVAÇÕES */}
							{activeTab === 'obs' && (
								<div className="flex-1 flex flex-col overflow-hidden">
									<label className={labelStyle}>Notas e Observações:</label>
									<textarea
										name="observations"
										value={formData.observations}
										onChange={handleChange}
										disabled={!isEditing}
										className={`${getFieldStyle(
											isEditing,
											false,
											true
										)} flex-1 h-full! resize-none p-4 leading-relaxed custom-scrollbar`}
										placeholder="Nenhuma observação registrada..."
									/>
								</div>
							)}

							{/* ABA: ATLETAS VINCULADOS */}
							{activeTab === 'atletas' && (
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-bold uppercase">Lista de atletas:</h3>
                                        {isEditing && (
                                            <button onClick={() => setAbrirNovoAtleta(true)} className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer">
                                                <IoAddCircle size={16} /> Adicionar Atleta
                                            </button>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-y-auto custom-scrollbar">
                                        {(formData.athletes || []).map((atleta, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 border-b border-black/5 last:border-0 hover:bg-blue-50">
                                                <span className="text-sm font-bold">{idx + 1}. {atleta}</span>
                                                {isEditing && <button onClick={() => removerAtleta(idx)} className="text-red-500 hover:text-red-700 p-1"><IoTrash size={18} /></button>}
                                            </div>
                                        ))}
										{formData.athletes.length === 0 && (
											<div className="p-8 text-center text-gray-400 text-sm font-medium italic">
												Nenhum atleta vinculado.
											</div>
										)}
									</div>
								</div>
							)}
						</div>

						{/* RODAPÉ FIXO */}
						<div className="p-6 border-t border-black/10 flex gap-3 justify-end items-center bg-black/5 shrink-0">
							<button
								onClick={isEditing ? handleDiscard : onClose}
								className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
							>
								{isEditing ? 'Descartar' : 'Voltar'}
							</button>
							{!isEditing && (
								<button
									onClick={() => temAcessoBloqueado() || setIsEditing(true)}
									disabled={temAcessoBloqueado()}
									className={`bg-[#050a24] hover:bg-[#101944] text-white px-8 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
										temAcessoBloqueado()
											? 'cursor-not-allowed opacity-50'
											: 'cursor-pointer'
									}`}
								>
									Editar
								</button>
							)}
							{isEditing && (
								<button
									onClick={handleFinalSave}
									className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer"
								>
									Salvar
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Modal de Cadastro de Novo Atleta */}
            <ModalCadastroAtleta
                aberto={abrirNovoAtleta}
                onClose={() => setAbrirNovoAtleta(false)}
                responsavelContexto={formData}
				turmasGlobais={turmasGlobais}
        		categoriasGlobais={categoriasGlobais}
                onSave={(novoAtletaFull) => {
                    // CORREÇÃO: Atualizar a lista local de nomes e disparar evento para o pai
                    setFormData(prev => ({
                        ...prev,
                        athletes: [...prev.athletes, novoAtletaFull.name]
                    }));
                    // Enviar o novo atleta completo para o Cadastros.jsx persistir
                    if (window.handleCreatedExternal) {
                        window.handleCreatedExternal("atletas", novoAtletaFull);
                    }
                }}
            />
        </>
    );
}