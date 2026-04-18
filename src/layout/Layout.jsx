import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiUsers, FiTruck, FiFileText, FiLogOut } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import BuscaPlaca from "../components/BuscaPlaca";
import permissions from "../config/permissions";

function Layout() {

    const { logout, usuarioNome, perfil } = useContext(AuthContext);

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>

            {/* SIDEBAR */}
            <aside style={{
                width: "220px",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                padding: "24px"
            }}>

                <h2 style={{ fontSize: "18px", marginBottom: "40px", fontWeight: 600 }}>
                    Oficina
                </h2>

                <nav style={{ flex: 1 }}>
                
                    <NavLink to="/dashboard" style={linkStyle}>
                        {/*<FiFileText size={18} />*/}
                        <FiHome size={18} />
                        <span>Painel</span>
                    </NavLink>

                    <NavLink to="/clientes" style={linkStyle}>
                        <FiUsers size={18} />
                        <span>Clientes</span>
                    </NavLink>

                    <NavLink to="/veiculos" style={linkStyle}>
                        <FiTruck size={18} />
                        <span>Veículos</span>
                    </NavLink>

                    <NavLink to="/ordens-servico" style={linkStyle}>
                        <FiFileText size={18} />
                        <span>Ordens</span>
                    </NavLink>

                    {permissions.USUARIOS.includes(perfil) && (
                        <NavLink to="/usuarios" style={linkStyle}>
                            <FiUsers size={18} />
                            <span>Usuários</span>
                        </NavLink>
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
                <header style={{
                    padding: "20px 40px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#6b7280"
                }}>
                    {/* BUSCA DE PLACA */}
                    <BuscaPlaca />

                    {/* USUÁRIO */}
                    <div>
                        {usuarioNome} ({perfil})
                    </div>
                </header>

                {/* PÁGINA */}
                <main style={{
                    padding: "40px",
                    flex: 1,
                    backgroundColor: "#fafafa"
                }}>
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive ? 600 : 400,
    color: isActive ? "#111827" : "#6b7280",
    transition: "0.2s"
});

export default Layout;