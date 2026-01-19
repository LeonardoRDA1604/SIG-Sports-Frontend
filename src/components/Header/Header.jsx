import Logout from "../Logout/Logout";
import AnimatedTitle from "../../modals/AnimatedTitle";
import NotificationIcon from "../Notificacao/NotificationIcon";
import { HiMenu, HiX } from "react-icons/hi";

const Header = ({
  title,
  subtitle,
  expanded,
  setExpanded,
  onMobileMenuToggle,
  mobileMenuOpen,
}) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <header className="flex items-center px-10 py-4 bg-primary-900">
      {/* Lado Esquerdo: Título Dinâmico */}
      <div className="text-center sm:text-left space-y-0 flex-1 py-2 sm:py-2 md:py-2 lg:py-3 overflow-hidden">
        <AnimatedTitle
          text={title || "Título"}
          className="text-sm sm:text-lg md:text-xl font-bold tracking-tight line-clamp-1"
        />
        <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 sm:line-clamp-1 leading-tight py-2.5">
          {subtitle || "Subtítulo"}
        </p>
      </div>

      {/* Lado Direito: Notificação, Perfil e Hamburger */}
      <div className="flex items-center gap-4 sm:gap-6 md:gap-7 lg:gap-8 shrink-0 h-full">
        {/* Notificação */}
        <NotificationIcon
          count={3}
          className="hover:bg-white/10 rounded-full p-1.5 sm:p-2 transition flex items-center justify-center"
        />

        {/* Separador Vertical */}
        <div className="hidden md:block h-5 w-px bg-white/20"></div>

        {/* Perfil do Usuário */}
        <div className="hidden lg:flex items-center gap-3 md:gap-4 lg:gap-5 h-full text-primary-50">
          {/* Nome e Cargo (oculto em mobile) */}
          <div className="hidden lg:block text-right py-1 px-2">
            <p className="text-xs sm:text-sm font-semibold leading-tight truncate max-w-40">
              {usuario?.name
                ? usuario.name.split(" ").slice(0, 2).join(" ")
                : "Usuário"}
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-tight">
              {usuario?.role || "Treinador"}
            </p>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white/20 overflow-hidden shrink-0">
            <span className="text-[10px] sm:text-xs font-bold">
              {usuario?.name
                ? usuario.name
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)
                : "US"}
            </span>
          </div>

          {/* Botão de Sair */}
          <Logout />
        </div>

        {/* Botão Hamburger (Mobile) - Menu Mobile */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex items-center justify-center hover:bg-primary-800 rounded-lg transition text-primary-50 ml-3"
        >
          <HiMenu size={34} />
        </button>
      </div>
    </header>
  );
};

export default Header;
