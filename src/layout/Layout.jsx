import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiHome, FiUsers, FiTruck, FiFileText, FiLogOut, FiSettings, FiDollarSign } from "react-icons/fi";
import "../styles/usuarios.css";
import BuscaPlaca from "../components/BuscaPlaca";
import permissions from "../config/permissions";

function Layout() {

    const { logout, usuarioNome, perfil } = useContext(AuthContext);

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>

            {/* SIDEBAR */}
            {/*<aside style={{*/}
            {/*    width: "220px",*/}
            {/*    borderRight: "1px solid #e5e7eb",*/}
            {/*    display: "flex",*/}
            {/*    flexDirection: "column",*/}
            {/*    padding: "24px"*/}
            {/*}}>*/}
            <aside style={{
                width: "240px",
                backgroundColor: "#ffffff",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                boxShadow: "2px 0 10px rgba(0,0,0,0.03)"
            }}>

                <div style={{ marginBottom: "40px" }}>

                    <div style={{
                            fontSize: "24px",
                            fontWeight: "800",
                            color: "#1e3c72",
                            letterSpacing: "1px"
                        }}>
                        NORVIK AUTO
                    </div>

                    <div style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginTop: "4px"
                        }}>
                        by Norvik Sys
                    </div>

                </div>

                <nav style={{ flex: 1 }}>
                
                    <NavLink to="/dashboard" style={linkStyle} className="sidebar-link">
                        {/*<FiFileText size={18} />*/}
                        <FiHome size={18} />
                        <span>Painel</span>
                    </NavLink>

                    <NavLink to="/clientes" style={linkStyle} className="sidebar-link">
                        <FiUsers size={18} />
                        <span>Clientes</span>
                    </NavLink>

                    <NavLink to="/veiculos" style={linkStyle} className="sidebar-link">
                        <FiTruck size={18} />
                        <span>Veículos</span>
                    </NavLink>

                    <NavLink to="/ordens-servico" style={linkStyle} className="sidebar-link">
                        <FiFileText size={18} />
                        <span>Ordens</span>
                    </NavLink>

                    <NavLink to="/financeiro" style={linkStyle} className="sidebar-link">
                        <FiDollarSign size={18} />
                        💰 Financeiro
                    </NavLink>

                    {permissions.USUARIOS.includes(perfil) && (
                        <>
                            <NavLink to="/usuarios" style={linkStyle} className="sidebar-link">
                            <FiUsers size={18} />
                            <span>Usuários</span>
                        </NavLink>

           
                            <NavLink to="/configuracao-oficina" style={linkStyle} className="sidebar-link">
                            <FiSettings size={18} />
                            <span>Configurações</span>
                            </NavLink>
                        </>
                    )}

                </nav>

                <button
                    onClick={logout}
                    style={{
                        background: "none",
                        border: "none",
                        padding: "8px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        color: "#6b7280"
                    }}
                >
                    <FiLogOut size={18} />
                    Sair
                </button>

            </aside>

            {/* CONTEÚDO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                {/*<header style={{*/}
                {/*    padding: "20px 40px",*/}
                {/*    borderBottom: "1px solid #e5e7eb",*/}
                {/*    display: "flex",*/}
                {/*    justifyContent: "space-between",*/}
                {/*    alignItems: "center",*/}
                {/*    fontSize: "14px",*/}
                {/*    color: "#6b7280"*/}
                {/*}}>*/}
                <header style={{
                    padding: "18px 40px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#6b7280",
                    backgroundColor: "#ffffff"
                }}>
                    {/* BUSCA DE PLACA */}
                    <BuscaPlaca />

                    {/* USUÁRIO */}
                    <div style={{ fontWeight: 500 }}>
                        👤 {usuarioNome} • {perfil}
                    </div>
                </header>

                {/* PÁGINA */}
                <main style={{
                    padding: "40px",
                    flex: 1,
                    backgroundColor: "#f8fafc"
                }}>
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

//const linkStyle = ({ isActive }) => ({
//    display: "flex",
//    alignItems: "center",
//    gap: "10px",
//    padding: "10px 0",
//    textDecoration: "none",
//    fontSize: "14px",
//    fontWeight: isActive ? 600 : 400,
//    color: isActive ? "#111827" : "#6b7280",
//    transition: "0.2s"
//});

const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    marginBottom: "6px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive ? 700 : 500,
    color: isActive ? "#1e3c72" : "#6b7280",
    backgroundColor: isActive ? "#eef4ff" : "transparent",
    transition: "0.2s"
});

export default Layout;