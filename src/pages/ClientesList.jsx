import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso, toastErro } from "../utils/toast";
import { confirmar } from "../utils/confirm";

function ClientesList() {

    const [clientes, setClientes] = useState([]);
    //const [toast] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

    useEffect(() => {

        let isMounted = true;

        async function load() {
            try {
                setLoading(true); // 🔥 começa carregamento

                const data = await apiGet("/clientes");

                if (isMounted) {
                    setClientes(data);
                }

            } catch (error) {
                toastErro("Erro ao carregar clientes.");
                console.error(error);
            } finally {
                setLoading(false); // 🔥 SEMPRE executa (sucesso ou erro)
            }
        }

        load();

        return () => {
            isMounted = false;
        };

    }, []);

    async function excluirCliente(id) {

        //const confirmar = window.confirm("⚠️ Tem certeza que deseja excluir este cliente?");
        //if (!confirmar) return;

        const confirmou = await confirmar("Tem certeza que deseja excluir este cliente?");
        if (!confirmou) return;

        try {

            await apiDelete(`/clientes/${id}`);

            toastSucesso("Cliente excluído com sucesso");

            const data = await apiGet("/clientes");
            setClientes(data);

        } catch (error) {
            toastErro("Não é possível excluir o cliente pois existem ordens de serviço vinculadas.");
            console.error(error);
        }
    }

    //function showToast(message, type = "success") {
    //    setToast({ message, type });

    //    setTimeout(() => {
    //        setToast(null);
    //    }, 3000);
    //}

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

            {/* 🔥 TOAST DENTRO DO RETURN */}
            {/*{toast && (*/}
            {/*    <div*/}
            {/*        style={{*/}
            {/*            position: "fixed",*/}
            {/*            top: "20px",*/}
            {/*            right: "20px",*/}
            {/*            padding: "15px 20px",*/}
            {/*            borderRadius: "8px",*/}
            {/*            color: "#fff",*/}
            {/*            fontWeight: "bold",*/}
            {/*            zIndex: 9999,*/}
            {/*            backgroundColor:*/}
            {/*                toast.type === "success" ? "#28a745" : "#dc3545"*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {toast.message}*/}
            {/*    </div>*/}
            {/*)}*/}

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30
            }}>
                <h2 style={{ margin: 0 }}>Clientes</h2>

                <button
                    onClick={() => navigate("/clientes/novo")}
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
                    + Novo Cliente
                </button>
            </div>

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
                            <th style={thStyle}>Nome</th>
                            <th style={thStyle}>Telefone</th>
                            <th style={thStyle}>CPF/CNPJ</th>
                            <th style={thStyle}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clientes.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                                    Nenhum cliente cadastrado.
                                </td>
                            </tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                    <td style={tdStyle}>{cliente.nome}</td>
                                    <td style={tdStyle}>{cliente.telefone}</td>
                                    <td style={tdStyle}>{cliente.cpfCnpj}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                                            style={editButton}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => excluirCliente(cliente.id)}
                                            style={{
                                                backgroundColor: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 8px",
                                                borderRadius: "4px",
                                                cursor: "pointer"
                                            }}
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

export default ClientesList;