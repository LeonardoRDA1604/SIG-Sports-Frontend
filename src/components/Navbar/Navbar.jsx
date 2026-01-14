import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { HiX } from "react-icons/hi";

// icones usados na navbar
import { BiDollar } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { LuClipboardList } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";

function Navbar({ expanded, setExpanded }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        h-screen bg-primary-900 shadow-md z-40 fixed top-0 left-0
        transition-all duration-300 flex-col
        hidden lg:flex
        ${expanded ? "w-64" : "w-22"}
      `}
    >
      {/* Logo com possivel alteração */}
      <div className="flex items-center justify-center mb-2 relative py-14 mt-15">
        {/* Logo Grande*/}

        <img
          src="src/assets/icons/ps-sports-logo-color.svg"
          alt="Logo Expandida"
          className={` filter drop-shadow-[0_0_05px_rgba(255,255,255,0.7)] absolute  py-4 transition-all duration-300 ${
            expanded ? "opacity-100 w-48" : "opacity-0 w-12"
          }`}
        />

        {/* Logo Pequena */}
        <img
          src="src/assets/icons/ps-sports-logo-color.svg"
          alt="Logo Minimizada"
          className={` filter drop-shadow-[0_0_05px_rgba(255,255,255,0.7)] absolute py-4 transition-all duration-300 ${
            expanded ? "opacity-0 w-48" : "opacity-100 w-22"
          }`}
        />
      </div>

      <div className="flex flex-col h-full px-6 p-6 mt-15 justify-between">
        {/* MENU */}
        <nav className="flex-2">
          <ul className="space-y-4 text-slate-900 ">
            {[
              { to: "/dashboard", icon: RxDashboard, label: "Dashboard" },
              { to: "/cadastros", icon: AiOutlineUserAdd, label: "Cadastros" },
              {
                to: "/financeiro",
                icon: BiDollar,
                label: "Financeiro",
              },
              {
                to: "/presencas",
                icon: LuClipboardCheck,
                label: "Presenças",
              },
              {
                to: "/interessados",
                icon: FaUsers,
                label: "Interessados",
              },
              {
                to: "/relatorios",
                icon: LuClipboardList,
                label: "Relatórios",
              },
              {
                to: "/administracao",
                icon: IoSettingsOutline,
                label: "Administração",
              },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className=" bg-linear-to-l from-slate-100 to-slate-200 hover:from-primary-200 hover:to-primary-500 hover:text-white
                    p-2 shadow-lg flex flex-row gap-3 rounded-md cursor-pointer items-center
                    transition-transform duration-200 hover:scale-115
                  "
                >
                  <item.icon size={24} className="min-w-6" />
                  <span
                    className={`
                      transition-all duration-300 text-nowrap
                      ${
                        expanded
                          ? "opacity-100"
                          : "opacity-0 w-0 overflow-hidden"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default function Layout({ children, title, subtitle }) {
  const [expanded, setExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex w-screen min-h-screen flex-col lg:flex-row">
      {/* Navbar Desktop */}
      <Navbar expanded={expanded} setExpanded={setExpanded} />

      {/* Menu Overlay Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navbar Mobile */}
      <aside
        className={`
          h-screen w-64 bg-primary-900 shadow-md z-40 fixed top-0 left-0
          transition-all duration-300 flex flex-col lg:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-6">
          <img
            src="src/assets/icons/ps-sports-logo-color.svg"
            alt="Logo"
            className="w-32"
          />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white p-2"
          >
            <HiX size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {[
              { to: "/dashboard", icon: RxDashboard, label: "Dashboard" },
              { to: "/cadastros", icon: AiOutlineUserAdd, label: "Cadastros" },
              {
                to: "/financeiro",
                icon: BiDollar,
                label: "Financeiro",
              },
              {
                to: "/presencas",
                icon: LuClipboardCheck,
                label: "Presenças",
              },
              {
                to: "/interessados",
                icon: FaUsers,
                label: "Interessados",
              },
              {
                to: "/relatorios",
                icon: LuClipboardList,
                label: "Relatórios",
              },
              {
                to: "/administracao",
                icon: IoSettingsOutline,
                label: "Administração",
              },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-linear-to-l from-slate-100 to-slate-200 hover:from-primary-200 hover:to-primary-500 hover:text-white
                    p-2 shadow-lg flex flex-row gap-3 rounded-md cursor-pointer items-center
                    transition-transform duration-200 hover:scale-105 text-sm
                  "
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full lg:w-auto
          lg:${expanded ? "ml-64" : "ml-22"}
        `}
      >
        {title && subtitle && (
          <Header
            title={title}
            subtitle={subtitle}
            expanded={expanded}
            setExpanded={setExpanded}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            mobileMenuOpen={mobileMenuOpen}
          />
        )}

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
