import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCar, FaUsers, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

function Layout() {
    const { logout, usuarioNome } = useContext(AuthContext);

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

            {/* SIDEBAR */}
            <aside style={{
                width: "250px",
                backgroundColor: "#1e293b",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                padding: "20px"
            }}>

                <h2 style={{ marginBottom: "30px" }}>🚗 Oficina</h2>

                <nav style={{ flex: 1 }}>

                    <NavLink to="/clientes" style={linkStyle}>
                        <FaUsers style={{ marginRight: 10 }} />
                        Clientes
                    </NavLink>

                    <NavLink to="/veiculos" style={linkStyle}>
                        <FaCar style={{ marginRight: 10 }} />
                        Veículos
                    </NavLink>

                    <NavLink to="/ordens-servico" style={linkStyle}>
                        <FaClipboardList style={{ marginRight: 10 }} />
                        Ordens de Serviço
                    </NavLink>

                </nav>

                <button
                    onClick={logout}
                    style={{
                        backgroundColor: "#ef4444",
                        border: "none",
                        padding: "10px",
                        color: "#fff",
                        cursor: "pointer",
                        borderRadius: "6px"
                    }}
                >
                    <FaSignOutAlt style={{ marginRight: 8 }} />
                    Sair
                </button>
            </aside>

            {/* CONTEÚDO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <header style={{
                    backgroundColor: "#f1f5f9",
                    padding: "15px 30px",
                    borderBottom: "1px solid #e2e8f0"
                }}>
                    Bem-vindo, <strong>{usuarioNome}</strong>
                </header>

                {/* PÁGINA */}
                <main style={{ padding: "30px", flex: 1, backgroundColor: "#f8fafc" }}>
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    padding: "10px",
    marginBottom: "10px",
    textDecoration: "none",
    color: isActive ? "#38bdf8" : "#fff",
    backgroundColor: isActive ? "#334155" : "transparent",
    borderRadius: "6px",
    transition: "0.2s"
});

export default Layout;