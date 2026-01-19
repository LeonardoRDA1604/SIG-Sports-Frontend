import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Logout from "../Logout/Logout";
import { HiX } from "react-icons/hi";

// icones usados na navbar
import { BiDollar } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { LuClipboardList } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";

function Navbar({ expanded, setExpanded }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        bg-primary-900 shadow-md z-20 fixed top-0 left-0 bottom-0
        flex-col hidden lg:flex transition-all duration-500 ease-out
        ${expanded ? "w-64" : "w-22"}
      `}
    >
      {/* Logo com possivel alteração */}
      <div className="flex items-center justify-center mb-2 relative py-14 mt-20">
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
                to: "/presencas",
                icon: LuClipboardCheck,
                label: "Presenças",
              },
              {
                to: "/financeiro",
                icon: BiDollar,
                label: "Financeiro",
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
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("navbarExpanded");
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    localStorage.setItem("navbarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row">
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
          w-screen sm:w-64 h-screen sm:h-screen lg:h-auto bg-primary-900 shadow-md z-40 fixed top-0 lg:top-20 left-0 bottom-0 right-0 sm:right-auto
          transition-all duration-300 flex flex-col justify-between lg:hidden
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          }
        `}
      >
        <div className="flex items-center justify-center p-6 sm:p-3 sm:-mt-4">
          <img
            src="src/assets/icons/ps-sports-logo-color.svg"
            alt="Logo"
            className="w-48 sm:w-56"
          />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white p-2 absolute right-6"
          >
            <HiX size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-0 sm:px-4 sm:py-0 sm:py-4 lg:py-0 flex flex-col sm:flex-col lg:flex-col items-center sm:items-stretch lg:items-start justify-center sm:justify-start lg:justify-start gap-4 sm:gap-4 sm:gap-6 lg:gap-4">
          {/* Avatar e Logout no Mobile - Esquerda (apenas landscape) */}
          <div className="hidden lg:flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white/20 flex-shrink-0">
              <span className="text-xs font-bold text-white">
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
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                {usuario?.name
                  ? usuario.name.split(" ").slice(0, 2).join(" ")
                  : "Usuário"}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                {usuario?.role || "Treinador"}
              </p>
            </div>
            <Logout />
          </div>

          {/* Botões Menu - Mobile/Tablet */}
          <div className="grid grid-cols-3 gap-2 sm:gap-1.5 lg:gap-2.5 w-full sm:max-w-xs lg:max-w-sm mx-auto">
            {[
              { to: "/dashboard", icon: RxDashboard, label: "Dashboard" },
              { to: "/cadastros", icon: AiOutlineUserAdd, label: "Cadastros" },
              {
                to: "/presencas",
                icon: LuClipboardCheck,
                label: "Presenças",
              },
              {
                to: "/financeiro",
                icon: BiDollar,
                label: "Financeiro",
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
              <Link
                key={i}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white/10 hover:bg-primary-700 backdrop-blur-sm rounded-lg p-5 sm:p-4 lg:p-5 flex flex-col items-center justify-center gap-2 sm:gap-2 transition-all duration-200 hover:scale-105 border border-white/20 hover:border-white/40"
              >
                <item.icon
                  size={36}
                  className="text-white sm:w-7 sm:h-7 lg:w-6 lg:h-6"
                />
                <span className="text-white text-[10px] sm:text-[10px] lg:text-[10px] font-semibold text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Divisor (apenas Tablet) */}
          <div className="hidden sm:block lg:hidden border-t border-white/20 w-full"></div>

          {/* Avatar e Logout (Tablet) - abaixo dos botões */}
          <div className="hidden sm:flex lg:hidden flex-col items-center gap-3 w-full">
            <div className="flex items-center justify-between gap-3 w-full px-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white/20 flex-shrink-0">
                  <span className="text-sm font-bold text-white">
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
                <div>
                  <p className="text-sm font-semibold text-white">
                    {usuario?.name
                      ? usuario.name.split(" ").slice(0, 2).join(" ")
                      : "Usuário"}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    {usuario?.role || "Treinador"}
                  </p>
                </div>
              </div>
              <Logout />
            </div>
          </div>

          {/* Avatar e Logout Mobile (retrato) - abaixo dos botões */}
          <div className="sm:hidden border-t border-white/10 mt-4 pt-4 flex items-center justify-between gap-3 w-full px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white/20">
                <span className="text-xs font-bold text-white">
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
              <div>
                <p className="text-sm font-semibold text-white">
                  {usuario?.name || "Usuário"}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {usuario?.role || "Treinador"}
                </p>
              </div>
            </div>
            <Logout />
          </div>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div
        className={`flex-1 flex flex-col w-full lg:w-auto overflow-hidden transition-all duration-500 ease-out
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

        <main className="flex-1 overflow-hidden w-full">{children}</main>
      </div>
    </div>
  );
}
