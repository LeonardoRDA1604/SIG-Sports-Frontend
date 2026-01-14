import { useState, useEffect } from 'react';
import { IoClose, IoPerson, IoChevronDown } from 'react-icons/io5';

export default function ModalVisualizarInteressado({
	aberto,
	onClose,
	interessado,
	onSave,
}) {
	// ========================
	// ESTADOS DE CONTROLE
	// ========================
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState('info'); // Padrão do sistema
	const [formData, setFormData] = useState({
		id: '',
		name: '',
		email: '',
		phoneNumber: '',
		modality: '',
	});
	const [emailErro, setEmailErro] = useState(false);

	// ========================
	// ESTILOS REUTILIZÁVEIS (PADRÃO PS-SPORTS)
	// ========================
	const labelStyle = 'text-[10px] font-bold uppercase text-[#101944] px-1 mb-1 block';
	
	const tabStyleActive =
		'px-4 py-3 border-b-2 border-blue-600 font-bold text-[#101944] flex items-center gap-2 transition-all shrink-0';
	const tabStyleInactive =
		'px-4 py-3 text-[#101944]/60 font-semibold hover:text-[#101944] hover:bg-black/5 flex items-center gap-2 transition-all cursor-pointer shrink-0';

	const getFieldStyle = (editing, hasError = false) => {
		const base = `w-full h-[42px] px-4 rounded-xl font-medium transition-all outline-none border text-sm shadow-sm appearance-none`;
		if (!editing)
			return `${base} bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none`;
		if (hasError) return `${base} bg-white text-red-600 border-red-500 ring-2 ring-red-500/10`;
		return `${base} bg-white text-gray-800 border-blue-500 ring-2 ring-blue-500/10 focus:border-blue-600 cursor-text`;
	};

	// ========================
	// MÁSCARAS E VALIDAÇÕES
	// ========================
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
		if (interessado && aberto) {
			setFormData({ ...interessado });
			setIsEditing(false);
			setActiveTab('info');
			setEmailErro(false);
		}
	}, [interessado, aberto]);

	// ========================
	// MANIPULADORES
	// ========================
	const handleChange = (e) => {
		const { name, value } = e.target;
		let maskedValue = value;

		if (isEditing) {
			if (name === 'phoneNumber') maskedValue = maskPhone(value);
			if (name === 'email') setEmailErro(!validarEmail(value) && value !== '');
		}

		setFormData((prev) => ({ ...prev, [name]: maskedValue }));
	};

	const handleDiscard = () => {
		setFormData({ ...interessado });
		setIsEditing(false);
		setEmailErro(false);
	};

	const handleFinalSave = () => {
		if (emailErro || !formData.name) return;
		onSave?.(formData);
		setIsEditing(false);
	};

	if (!aberto || !formData) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
			<div className="w-full max-w-md bg-[#050a24] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
				
				{/* HEADER DARK */}
				<div className="p-6 flex justify-between items-center shrink-0">
					<h2 className="text-xl font-bold truncate">
						{isEditing ? 'Modo Edição' : `${formData.name || 'Interessado'}`}
					</h2>
					<button
						onClick={onClose}
						className="hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"
					>
						<IoClose size={28} />
					</button>
				</div>

				{/* ÁREA DE CONTEÚDO CINZA */}
				<div className="bg-[#d9d9d9] flex-1 flex flex-col overflow-hidden text-[#101944]">
					
					{/* NAVEGAÇÃO DE ABAS */}
					<div className="flex px-4 bg-black/5 text-sm border-b border-black/10 shrink-0">
						<button
							onClick={() => setActiveTab('info')}
							className={activeTab === 'info' ? tabStyleActive : tabStyleInactive}
						>
							<IoPerson size={16} /> Informações
						</button>
						{/* Você pode adicionar mais abas aqui no futuro */}
					</div>

					<div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
						{activeTab === 'info' && (
							<>
								{/* NOME */}
								<div>
									<label className={labelStyle}>Nome Completo:</label>
									<input
										name="name"
										value={formData.name}
										onChange={handleChange}
										disabled={!isEditing}
										className={getFieldStyle(isEditing)}
									/>
								</div>

								{/* EMAIL */}
								<div>
									<label className={labelStyle}>E-mail:</label>
									<input
										name="email"
										value={formData.email}
										onChange={handleChange}
										disabled={!isEditing}
										className={getFieldStyle(isEditing, emailErro)}
									/>
									{emailErro && isEditing && (
										<span className="text-[10px] text-red-600 font-bold px-1">Formato de e-mail inválido</span>
									)}
								</div>

								{/* TELEFONE */}
								<div>
									<label className={labelStyle}>Telefone:</label>
									<input
										name="phoneNumber"
										value={formData.phoneNumber}
										onChange={handleChange}
										disabled={!isEditing}
										className={getFieldStyle(isEditing)}
										placeholder="(00) 00000-0000"
									/>
								</div>

								{/* MODALIDADE */}
								<div className="relative">
									<label className={labelStyle}>Modalidade de Interesse:</label>
									<select
										name="modality"
										value={formData.modality}
										onChange={handleChange}
										disabled={!isEditing}
										className={getFieldStyle(isEditing)}
									>
										<option value="Futebol">Futebol</option>
										<option value="Futsal">Futsal</option>
										<option value="Beach Soccer">Beach Soccer</option>
										<option value="Fut7">Fut7</option>
									</select>
									{isEditing && (
										<IoChevronDown
											className="absolute right-3 bottom-3 text-gray-500 pointer-events-none"
											size={18}
										/>
									)}
								</div>
							</>
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
						
						{!isEditing ? (
							<button
								onClick={() => setIsEditing(true)}
								className="bg-[#050a24] hover:bg-[#101944] text-white px-8 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer"
							>
								Editar
							</button>
						) : (
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
	);
}