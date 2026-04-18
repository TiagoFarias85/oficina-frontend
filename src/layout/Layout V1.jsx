import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";

function Layout() {

    //const usuarioNome = localStorage.getItem("usuarioNome");
    const { logout, usuarioNome } = useContext(AuthContext);

    //return (

    //    //<div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

    //    //    {/* Sidebar */}
    //    //    <div style={{
    //    //        width: 220,
    //    //        backgroundColor: "#1f2937",
    //    //        color: "white",
    //    //        padding: 20
    //    //    }}>
    //    //        <h2 style={{ marginBottom: 30 }}>Oficina</h2>

    //    //        <nav style={{ display: "flex", flexDirection: "column", gap: 15 }}>
    //    //            <Link to="/" style={linkStyle}>Dashboard</Link>
    //    //            <Link to="/ordens-servico" style={linkStyle}>Ordens de Serviço</Link>
    //    //            <Link to="/clientes" style={linkStyle}>Clientes</Link>
    //    //            <Link to="/veiculos" style={linkStyle}>Veículos</Link>
    //    //        </nav>
    //    //    </div>

    //    //    {/* Conteúdo */}
    //    //    <div style={{ flex: 1, padding: 30, backgroundColor: "#f3f4f6" }}>
    //    //        <Outlet />
    //    //    </div>

    //    //</div>
    //    //<div style={{ flex: 1, backgroundColor: "#f3f4f6" }}>

    //    //    {/* Topbar */}
    //    //    <div style={{
    //    //        backgroundColor: "white",
    //    //        padding: 15,
    //    //        borderBottom: "1px solid #e5e7eb",
    //    //        display: "flex",
    //    //        justifyContent: "space-between"
    //    //    }}>
    //    //        <strong>Painel da Oficina</strong>
    //    //        <span>👤 {usuarioNome || "Usuário"}</span>
    //    //        <Link to="/clientes">Clientes</Link>
    //    //        <button onClick={logout}>Sair</button>
    //    //    </div>

    //    //    {/* Conteúdo */}
    //    //    <div style={{ padding: 30 }}>
    //    //        <Outlet />
    //    //    </div>

    //    //</div>

    //    <div style={{
    //        backgroundColor: "#111827",
    //        color: "white",
    //        padding: "15px 30px",
    //        display: "flex",
    //        justifyContent: "space-between",
    //        alignItems: "center"
    //    }}>
    //        <strong style={{ fontSize: 18 }}>Oficina Mecânica</strong>

    //        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
    //            <span>👤 {usuarioNome}</span>
    //            <button
    //                onClick={logout}
    //                style={{
    //                    backgroundColor: "#ef4444",
    //                    border: "none",
    //                    padding: "6px 12px",
    //                    borderRadius: 6,
    //                    color: "white",
    //                    cursor: "pointer"
    //                }}
    //            >
    //                Sair
    //            </button>
    //        </div>
    //    </div>
    //);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>

            {/* Topbar */}
            <div style={{
                backgroundColor: "#111827",
                color: "white",
                padding: "15px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <strong style={{ fontSize: 18 }}>Oficina Mecânica</strong>

                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <span>👤 {usuarioNome}</span>
                    <button
                        onClick={logout}
                        style={{
                            backgroundColor: "#ef4444",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 6,
                            color: "white",
                            cursor: "pointer"
                        }}
                    >
                        Sair
                    </button>
                </div>
            </div>

            {/* Conteúdo das páginas */}
            <div style={{ padding: 30 }}>
                <Outlet />
            </div>

        </div>
    );

}

//function handleLogout() {
//    logout();
//}
//function logout() {
//    localStorage.removeItem("token");
//    localStorage.removeItem("usuarioNome");
//    window.location.href = "/login";
//}

//const linkStyle = {
//    color: "white",
//    textDecoration: "none",
//    fontSize: 15
//};

export default Layout;