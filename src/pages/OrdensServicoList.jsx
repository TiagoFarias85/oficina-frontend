import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { apiGet, apiDelete, apiPost, apiPut } from '../services/api'
import { toastErro } from '../utils/toast';


function OrdensServicoList() {
    const navigate = useNavigate(); // cria a função que permite mudar de página.
    const [ordens, setOrdens] = useState(null);
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const filtro = params.get("filtro");
    const status = params.get("status");

    //useEffect(() => {
    //    apiGet('/ordens-servico')
    //        .then(data => setOrdens(data))
    //        .catch(err => setErro(err.message))
    //        .finally(() => setLoading(false));
    //}, []);

    useEffect(() => {

        async function load() {
            try {
                setLoading(true); // 🔥 começa carregamento

                let endpoint = "/ordens-servico";

                if (filtro === "hoje")
                    endpoint += "?filtro=hoje";

                if (filtro === "mes")
                    endpoint += "?filtro=mes";

                if (status)
                    endpoint += `?status=${status}`;

                const data = await apiGet(endpoint);

                setOrdens(data)

            } catch (error) {
                toastErro("Erro ao carregar ordens")
                console.error(error)
            } finally {
                setLoading(false); // 🔥 SEMPRE executa (sucesso ou erro)
            }
        }

        load()

    }, [])

    if (!ordens) return <p>Carregando...</p>
    if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

    function getStatusColor(status) {
        const colors = {
            Aberto: "#f59e0b",
            EmExecucao: "#3b82f6",
            Finalizado: "#10b981"
        };

        return colors[status] || "#9ca3af";
    }

    return (
        <div>
            <h2>Ordens de Serviço</h2>

            {/*<button onClick={() => navigate('/nova-ordem-servico')}>*/}
            {/*    + Nova Ordem de Serviço*/}
            {/*</button>*/}
            <button
                onClick={() => navigate("/ordens-servico/nova")}
                style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginBottom: 20
                }}
            >
                + Nova Ordem de Serviço
            </button>

            {/*<table border="1" cellPadding="6">*/}
            {/*    <thead>*/}
            {/*        <tr>*/}
            {/*            <th>OS</th>*/}
            {/*            <th>Cliente</th>*/}
            {/*            <th>Status</th>*/}
            {/*            <th>Total</th>*/}
            {/*            <th>Laudo</th>*/}
            {/*        </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*        {ordens.map(os => (*/}
            {/*            <tr*/}
            {/*                key={os.id}*/}
            {/*                style={{ cursor: 'pointer' }}*/}
            {/*                onClick={() => navigate(`/ordens-servico/${os.id}`)}*/}
            {/*            >*/}
            {/*                <td>{os.id}</td>*/}
            {/*                <td>{os.clienteNome}</td>*/}
            {/*                */}{/*<td>{os.status}</td>*/}
            {/*                <td>*/}
            {/*                    <StatusBadge status={os.status} />*/}
            {/*                </td>*/}
            {/*                <td>R$ {os.valorTotal}</td>*/}
            {/*                <td>{os.laudoGerado ? '🔒' : '🔓'}</td>*/}
            {/*            </tr>*/}
            {/*        ))}*/}
            {/*    </tbody>*/}
            {/*</table>*/}

            <div style={{ display: "grid", gap: 20 }}>

                {ordens.length === 0 ? (
                    <p>Nenhuma ordem encontrada.</p>
                ) : (
                    ordens.map(os => (
                        <div
                            key={os.id}
                            onClick={() => navigate(`/ordens-servico/${os.id}`)}
                            style={{
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                borderLeft: `6px solid ${getStatusColor(os.status)}`
                            }}
                            onMouseEnter={e =>
                                e.currentTarget.style.transform = "scale(1.01)"
                            }
                            onMouseLeave={e =>
                                e.currentTarget.style.transform = "scale(1)"
                            }
                        >

                            {/* Header */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 10
                            }}>
                                <strong>OS {String(os.id).padStart(4, "0")} • { os.clienteNome} </strong>
                                <span>
                                    {os.laudoGerado ? "🔒" : "🔓"}
                                </span>
                            </div>

                            {/* Cliente */}
                            <div style={{ marginBottom: 6 }}>
                                <strong>{os.clienteNome}</strong>
                            </div>

                            {/* Status */}
                            <div style={{ marginBottom: 6 }}>
                                <StatusBadge status={os.status} />
                            </div>

                            {/* Total */}
                            <div>
                                <strong>
                                    {/*R$ {Number(os.valorTotal).toFixed(2)}*/}
                                    {Number(os.valorTotal).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </strong>
                            </div>

                        </div>
                    ))
                )}

            </div>
        </div>
    );
}

function StatusBadge({ status }) {

    const colors = {
        Aberto: "#f59e0b",
        EmExecucao: "#3b82f6",
        Finalizado: "#10b981"
    };

    return (
        <span style={{
            padding: "5px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: "bold",
            backgroundColor: colors[status] || "#9ca3af",
            color: "white"
        }}>
            {status}
        </span>
    );
}

export default OrdensServicoList;