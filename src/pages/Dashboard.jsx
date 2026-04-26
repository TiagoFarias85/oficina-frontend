import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastErro } from "../utils/toast";

function Dashboard() {

    const [dados, setDados] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        async function carregar() {
            try {
                //const data = await apiGet("/dashboard");
                //const data = await apiGet("/ordens-servico/dashboard");
                const data = await apiGet("/dashboard");
                setDados(data);
            } catch {
                toastErro("Erro ao carregar dashboard");
            }
        }

        carregar();
    }, []);

    if (!dados) return <p>Carregando painel...</p>;

    const cardStyle = {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "0.2s"
    };

    const cardValue = {
        fontSize: "24px",
        fontWeight: "bold",
        marginTop: "5px"
    };

    return (
        //<div>

        //    <h2 style={{ marginBottom: 20 }}>📊 Painel</h2>

        //    <div style={gridStyle}>

        //        <Card titulo="Clientes" valor={dados.totalClientes} cor="#3b82f6" onClick={() => navigate("/clientes")} />
        //        <Card titulo="Veículos" valor={dados.totalVeiculos} cor="#10b981" onClick={() => navigate("/veiculos")} />
        //        <Card titulo="OS Hoje" valor={dados.osHoje} cor="#0ea5e9" />
        //        <Card titulo="OS Abertas" valor={dados.osAbertas} cor="#f59e0b" onClick={() => navigate("/ordens-servico")} />
        //        <Card titulo="OS Execução" valor={dados.osEmExecucao} cor="#6366f1" onClick={() => navigate("/ordens-servico")} />
        //        <Card titulo="OS Finalizadas" valor={dados.osFinalizadas} cor="#22c55e" onClick={() => navigate("/ordens-servico")} />
        //        <Card titulo="Faturamento Hoje" valor={`R$ ${dados.faturamentoHoje.toFixed(2)}`} cor="#16a34a" />
        //        <Card titulo="Faturamento Mês" valor={`R$ ${dados.faturamentoMes.toFixed(2)}`} cor="#ef4444" />
        //        <Card titulo="Faturamento Total" valor={`R$ ${dados.faturamentoTotal.toFixed(2)}`} cor="#111827" />

        //    </div>

        //</div>

        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px"
        }}>

            

            <div
                style={cardStyle}
                onClick={() => navigate("/ordens-servico?filtro=hoje")}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <strong>OS Hoje</strong>
                <div style={cardValue}>{dados.osHoje}</div>
            </div>

            <div style={cardStyle} onClick={() => navigate("/ordens-servico?filtro=mes")}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <strong>OS Mês</strong>
                {/*<div style={cardValue}>{dados.osMes}</div>*/}
                <div style={cardValue}>{dados.osHoje}</div>
            </div>

            <div style={cardStyle} onClick={() => navigate("/ordens-servico?status=ABERTA")}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <strong>Em Aberto</strong>
                <div style={{ ...cardValue, color: "#2563eb" }}>
                    {/*{dados.abertas}*/}
                    {dados.osAbertas}
                </div>
            </div>

            <div style={cardStyle}>
                <strong>Faturamento Mês</strong>
                <div style={{ ...cardValue, color: "#16a34a" }}>
                    {/*R$ {dados.faturamentoMes.toFixed(2)}*/}
                    R$ {Number(dados.faturamentoMes).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </div>
            </div>

            <button onClick={() => navigate("/alterar-senha")}>
                Alterar senha
            </button>

        </div>

    );
}

//function Card({ titulo, valor, cor, onClick }) {
//    return (
//        <div
//            onClick={onClick}
//            style={{
//            backgroundColor: "white",
//            padding: 20,
//            borderRadius: 10,
//            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                borderLeft: `5px solid ${cor}`,
//                transform: "scale(1.02)"
//        }}>
//            <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{titulo}</p>
//            <h2 style={{ margin: "10px 0 0 0" }}>{valor}</h2>
//        </div>
//    );
//}

function Card({ titulo, valor, cor, onClick }) {

    const [hover, setHover] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                borderLeft: `5px solid ${cor}`,
                cursor: "pointer",
                transform: hover ? "scale(1.03)" : "scale(1)",
                boxShadow: hover
                    ? "0 6px 18px rgba(0,0,0,0.15)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                transition: "0.2s"
            }}
        >
            <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{titulo}</p>
            <h2 style={{ margin: "10px 0 0 0", color: titulo.includes("Faturamento") ? "#16a34a" : "#111827" }}>{valor}</h2>
        </div>
    );
}

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20
};

export default Dashboard;