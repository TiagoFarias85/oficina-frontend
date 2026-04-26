import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../../services/api";
import { toastErro } from "../../utils/toast";

function OrdensServicoPorVeiculo() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [veiculo, setVeiculo] = useState(null);
    const [ordens, setOrdens] = useState([]);

    const cardStyle = {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    };

    const cardValue = {
        fontSize: "22px",
        fontWeight: "bold",
        marginTop: "5px"
    };

    useEffect(() => {

        async function carregar() {
            try {
                const data = await apiGet(`/ordens-servico/veiculo/${id}`);

                setVeiculo(data.veiculo);
                setOrdens(data.ordens);

            } catch {
                toastErro("Erro ao carregar dados");
            }
        }

        carregar();

    }, [id]);

    function getStatusStyle(status) {

        switch (status) {
            case "ABERTA":
                return { color: "#2563eb", fontWeight: "bold" };

            case "FINALIZADA":
                return { color: "#16a34a", fontWeight: "bold" };

            case "CANCELADA":
                return { color: "#dc2626", fontWeight: "bold" };

            default:
                return {};
        }
    }


    const total = ordens.length;

    const abertas = ordens.filter(o => o.status === "ABERTA").length;

    const finalizadas = ordens.filter(o => o.status === "FINALIZADA").length;

    const faturamento = ordens
        .filter(o => o.status === "FINALIZADA")
        .reduce((total, o) => total + (o.valorTotal || 0), 0);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

            {/* HEADER */}
            {veiculo && (
                <div style={{
                    marginBottom: 30,
                    padding: 20,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}>
                    <h2 style={{ marginBottom: 10 }}>
                        🚗 {veiculo.placa} - {veiculo.modelo}
                    </h2>

                    <p style={{ color: "#6b7280" }}>
                        👤 {veiculo.clienteNome}
                    </p>

                    <button
                        onClick={() => navigate(`/ordens-servico/nova?veiculoId=${id}`)}
                        style={{
                            marginTop: 15,
                            padding: "10px 16px",
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        + Nova Ordem de Serviço
                    </button>
                </div>
            )}

            {/* LISTA */}
            <div style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                overflow: "hidden"
            }}>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "15px",
                    marginBottom: "20px"
                }}>

                    <div style={cardStyle}>
                        <strong>Total OS</strong>
                        <div style={cardValue}>{total}</div>
                    </div>

                    <div style={cardStyle}>
                        <strong>Abertas</strong>
                        <div style={{ ...cardValue, color: "#2563eb" }}>{abertas}</div>
                    </div>

                    <div style={cardStyle}>
                        <strong>Finalizadas</strong>
                        <div style={{ ...cardValue, color: "#16a34a" }}>{finalizadas}</div>
                    </div>

                    <div style={cardStyle}>
                        <strong>Faturamento</strong>
                        <div style={{ ...cardValue, color: "#059669" }}>
                          {/*  R$ {faturamento.toFixed(2)}*/}
                            {Number(faturamento).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </div>
                    </div>

                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f9fafb" }}>
                        <tr>
                            <th style={{ padding: 12, textAlign: "left" }}>OS</th>
                            <th style={{ padding: 12, textAlign: "left" }}>Status</th>
                            <th style={{ padding: 12, textAlign: "left" }}>Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ordens.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ padding: 20, textAlign: "center" }}>
                                    Nenhuma ordem de serviço encontrada.
                                </td>
                            </tr>
                        ) : (
                            ordens.map(os => (
                                <tr
                                    key={os.id}
                                    style={{ borderTop: "1px solid #f1f5f9", cursor: "pointer" }}
                                    onClick={() => navigate(`/ordens-servico/${os.id}`)}
                                >
                                    <td style={{ padding: 12 }}>#{os.id}</td>

                                    <td style={{ padding: 12 }}>
                                        <span style={getStatusStyle(os.status)}>
                                            {os.status}
                                        </span>
                                    </td>

                                    <td style={{ padding: 12 }}>
                                        {new Date(os.dataAbertura).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default OrdensServicoPorVeiculo;