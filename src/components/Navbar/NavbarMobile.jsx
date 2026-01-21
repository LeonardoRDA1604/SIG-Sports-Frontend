import { Link } from "react-router-dom";

// icones usados na navbar
import { BiDollar } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { LuClipboardList } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

export default function NavbarMobile({ expanded, setExpanded }) {
  const menuItems = [
    { to: "/dashboard", icon: RxDashboard, label: "Dashboard" },
    { to: "/cadastros", icon: AiOutlineUserAdd, label: "Cadastros" },
    { to: "/financeiro", icon: BiDollar, label: "Financeiro" },
    { to: "/presencas", icon: LuClipboardCheck, label: "Presenças" },
    { to: "/interessados", icon: FaUsers, label: "Interessados" },
    { to: "/relatorios", icon: LuClipboardList, label: "Relatórios" },
    { to: "/administracao", icon: IoSettingsOutline, label: "Administração" },
  ];

  return (
    <>
      {/* Overlay para fechar menu ao clicar fora */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Navbar Mobile */}
      <aside
        className={`
          h-screen bg-primary-900 shadow-2xl z-40 fixed top-0 left-0
          transition-all duration-300 flex flex-col lg:hidden
          ${expanded ? "w-full translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Botão Fechar */}
        <div className="flex justify-end p-3">
          <button
            onClick={() => setExpanded(false)}
            className="p-2 hover:bg-primary-800 rounded-md transition-colors duration-200"
            aria-label="Fechar menu"
          >
            <IoClose size={28} className="text-white" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center mb-4 relative py-8 mt-4">
          <img
            src="src/assets/SigSports.png"
            alt="Logo"
            className="filter drop-shadow-[0_0_05px_rgba(255,255,255,0.7)] w-40"
          />
        </div>

        {/* Menu Mobile */}
        <nav className="flex-1">
          <ul className="space-y-2 text-slate-900 px-3 py-4">
            {menuItems.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  onClick={() => setExpanded(false)}
                  className="bg-linear-to-l from-slate-100 to-slate-200 hover:from-primary-200 hover:to-primary-500 hover:text-white
                    p-3 shadow-lg flex flex-row gap-3 rounded-md cursor-pointer items-center
                    transition-transform duration-200 hover:scale-105 text-sm font-medium
                  "
                >
                  <item.icon size={24} className="min-w-6" />
                  <span className="text-nowrap">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
