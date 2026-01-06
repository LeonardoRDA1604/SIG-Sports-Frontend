import { useState } from "react";

import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";

// icones usados na navbar
import { BiDollar } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { LuClipboardList } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import {FcMenu} from "react-icons/fc";
import NotificationIcon from "../Notificacao/NotificationIcon";

function Navbar({ expanded, setExpanded }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        h-screen bg-primary-900 shadow-md z-40 fixed top-0 left-0
        transition-all duration-300 flex flex-col
        ${expanded ? "w-64" : "w-22"}
      `}
    >
      {/* Logo com possivel alteração */}
     <div className="flex items-center justify-center mb-2 relative py-14 mt-12">
      {/* Logo Grande*/}

      <img src="src/assets/icons/ps-sports-logo-color.svg" alt="Logo Expandida" className={` filter drop-shadow-[0_0_05px_rgba(255,255,255,0.7)] absolute  py-4 transition-all duration-300 ${expanded ? "opacity-100 w-48" : "opacity-0 w-12"}`} />

      {/* Logo Pequena */}
      <img src="src/assets/icons/ps-sports-logo-color.svg" alt="Logo Minimizada" className={` filter drop-shadow-[0_0_05px_rgba(255,255,255,0.7)] absolute py-4 transition-all duration-300 ${expanded ? "opacity-0 w-48" : "opacity-100 w-22"}`} />
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
                to: "/presenças",
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
              { to: "/administração", icon: IoSettingsOutline, label: "Administração" },
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
                      ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* FOOTER */}
        <div
          className={`
            h-36 w-64 flex gap-3 overflow-hidden
            transition-all duration-300
          `}
        >
          <div className="shrink-0 flex flex-col items-center justify-around w-12 h-full">
          <div>
              {/* NOVO CÓDIGO COM INICIAIS */}
              <div className="w-10 h-10 rounded-full ring-2 ring-gray-900 bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">LW</span> {/* Altere "JS" pelas iniciais desejadas */}
              </div>
              {/* FIM NOVO CÓDIGO */}
          </div>
          <div className="mt-1">
              {/* ... restante do código ... */}
              <Logout />
              <NotificationIcon count={3} />
              
            </div>
            {/* <div>
              <h5>Sair</h5>
            </div> */}
          </div>

          <div
            className={`
              flex flex-col transition-all duration-300 mt-1 gap-3
              ${expanded ? "opacity-100 max-w-200px" : "opacity-0 max-w-0  overflow-hidden"}
            `}
          >
            <p className="font-semibold text-primary-50 whitespace-nowrap">{usuario?.nome}</p>
            <p className="text-sm text-primary-200 whitespace-nowrap">{usuario?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex">
      <Navbar expanded={expanded} setExpanded={setExpanded} />

      <main
        className={`
          flex-1 p-6 transition-all duration-300
          ${expanded ? "ml-52" : "ml-10"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
