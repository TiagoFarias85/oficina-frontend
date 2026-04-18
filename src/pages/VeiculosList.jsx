import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso, toastErro } from "../utils/toast";
import { confirmar } from "../utils/confirm";

function VeiculosList() {

    const [veiculos, setVeiculos] = useState([]);
    //const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //useEffect(() => {

    //    async function load() {
    //        try {
    //            const data = await apiGet("/veiculos");
    //            setVeiculos(data);
    //        } catch (error) {
    //            console.error(error);
    //        }
    //    }

    //    load();

    //}, []);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true); // 🔥 começa carregamento

                const data = await apiGet("/veiculos");
                setVeiculos(data);
            } catch (error) {
                //toastErro("Erro ao carregar ordens")
                console.error(error)
            } finally {
                setLoading(false); // 🔥 SEMPRE executa (sucesso ou erro)
            }
        }

        load();
    }, []);

    //async function excluirVeiculo(id) {

    //    const confirmar = window.confirm("Deseja excluir este veículo?");
    //    if (!confirmar) return;

    //    try {
    //        await apiDelete(`/veiculos/${id}`);

    //        setVeiculos(prev => prev.filter(v => v.id !== id));
    //        showToast("Veículo excluído com sucesso");

    //    } catch (error) {
    //        showToast("Erro ao excluir veículo", "error");
    //        console.error(error);
    //    }
    //}

    async function excluirVeiculo(id) {

        //const confirmar = window.confirm("⚠️ Deseja excluir este veículo?");
        //if (!confirmar) return;
        const confirmou = await confirmar("Deseja excluir este veículo?");
        if (!confirmou) return;

        try {
            await apiDelete(`/veiculos/${id}`);

            toastSucesso("Veículo excluído com sucesso");

            carregarVeiculos();
        } catch (error) {
            toastErro("Erro ao excluir veículo");
            console.error(error);
        }

    }

    async function carregarVeiculos() {
        try {
            const data = await apiGet("/veiculos");
            setVeiculos(data);
        } catch (error) {
            toastErro("Erro ao carregar veículos");
            console.error(error);
        }
    }

    //function showToast(message, type = "success") {
    //    setToast({ message, type });

    //    setTimeout(() => {
    //        setToast(null);
    //    }, 3000);
    //}

    const thStyle = {
        textAlign: "left",
        padding: 14,
        fontSize: 14
    };

    const tdStyle = {
        padding: 14
    };

    const editButton = {
        backgroundColor: "#f59e0b",
        border: "none",
        padding: "6px 10px",
        borderRadius: 6,
        color: "white",
        cursor: "pointer",
        marginRight: 8
    };

    const deleteButton = {
        backgroundColor: "#ef4444",
        border: "none",
        padding: "6px 10px",
        borderRadius: 6,
        color: "white",
        cursor: "pointer"
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

            {/* HEADER */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30
            }}>
                <h2 style={{ margin: 0 }}>🚗 Veículos</h2>

                <button
                    onClick={() => navigate("/veiculos/novo")}
                    style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    + Novo Veículo
                </button>
            </div>

            {/* CARD TABELA */}
            <div style={{
                backgroundColor: "white",
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                overflow: "hidden"
            }}>

                <table style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}>
                    <thead style={{ backgroundColor: "#f9fafb" }}>
                        <tr>
                            <th style={thStyle}>Placa</th>
                            <th style={thStyle}>Marca</th>
                            <th style={thStyle}>Modelo</th>
                            <th style={thStyle}>Ano</th>
                            <th style={thStyle}>Cliente</th>
                            <th style={thStyle}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {veiculos.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                                    Nenhum veículo cadastrado.
                                </td>
                            </tr>
                        ) : (
                            veiculos.map(v => (
                                <tr
                                    key={v.id}
                                    style={{ borderTop: "1px solid #f1f5f9" }}
                                >
                                    <td style={tdStyle}>{v.placa}</td>
                                    <td style={tdStyle}>{v.marca}</td>
                                    <td style={tdStyle}>{v.modelo}</td>
                                    <td style={tdStyle}>{v.ano}</td>
                                    <td style={tdStyle}>{v.clienteNome}</td>

                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => navigate(`/veiculos/${v.id}`)}
                                            style={editButton}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => excluirVeiculo(v.id)}
                                            style={deleteButton}
                                        >
                                            🗑
                                        </button>
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

export default VeiculosList;