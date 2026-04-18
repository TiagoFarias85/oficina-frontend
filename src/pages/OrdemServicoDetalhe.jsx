import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet, apiDelete, apiPost, apiPut } from '../services/api'
import { toastSucesso, toastErro } from "../utils/toast";
import { confirmar } from "../utils/confirm";
//import { obterMensagemErro } from "../utils/obterMensagemErro";
function OrdemServicoDetalhe() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [os, setOs] = useState(null);
    const [erro] = useState(null);
    const [descricaoServico, setDescricaoServico] = useState('');
    const [valorServico, setValorServico] = useState('');
    const [descricaoPeca, setDescricaoPeca] = useState('');
    const [quantidadePeca, setQuantidadePeca] = useState('');
    const [valorPeca, setValorPeca] = useState('');
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    //Criar estado de edição
    const [editandoDescricao, setEditandoDescricao] = useState(false);
    const [descricaoEditada, setDescricaoEditada] = useState("");

    const [valorPagamento, setValorPagamento] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");

    const STATUS_OS = {
        ABERTO: "Aberto",
        EM_EXECUCAO: "EmExecucao",
        FINALIZADO: "Finalizado",
        CANCELADO: "Cancelado"
    };

    const podeRegistrarPagamento =
        os?.status !== STATUS_OS.CANCELADO;

    //const formatarStatus = (status) => {
    //    if (status === "EmExecucao") return "Em execução";
    //    return status;
    //};

    const sectionStyle = {
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "20px"
    };

    //const osBloqueadaEdicao =
    //    os?.laudoGerado ||
    //    (os?.status !== STATUS_OS.ABERTO && os?.status !== STATUS_OS.EM_EXECUCAO && os?.status === "Cancelado");

    const osBloqueadaEdicao =
        os?.laudoGerado ||
        os?.status === STATUS_OS.FINALIZADO ||
        os?.status === STATUS_OS.CANCELADO;




    //const cardStyle = {
    //    padding: "15px",
    //    border: "1px solid #ddd",
    //    borderRadius: "8px",
    //    backgroundColor: "#fafafa",
    //    marginBottom: "15px"
    //}

    useEffect(() => {

        let isMounted = true

        async function load() {
            try {
                setLoading(true); // 🔥 começa carregamento

                const data = await apiGet(`/ordens-servico/${id}`)

                if (isMounted)
                    setOs(data)

            } catch (error) {
                if (isMounted)
                    toastErro(obterMensagemErro(error, error.message || "Erro ao carregar OS"));

                //setErro(error.message)
            } finally {
                setLoading(false); // 🔥 SEMPRE executa (sucesso ou erro)
            }
        }

        load()

        return () => {
            isMounted = false
        }

    }, [id])

    //async function alterarStatus(novoStatus) {
    //    try {
    //        const response = await fetch(
    //            'http://localhost:5175/api/ordens-servico/alterar-status',
    //            {
    //                method: 'PUT',
    //                headers: {
    //                    'Content-Type': 'application/json'
    //                },
    //                body: JSON.stringify({
    //                    ordemServicoId: os.id,
    //                    novoStatus: novoStatus
    //                })
    //            }
    //        );

    //        if (!response.ok) {
    //            const erro = await response.json();
    //            alert(erro.message);
    //            return;
    //        }

    //        const atualizado = await apiGet(`/ordens-servico/${id}`);
    //        setOs(atualizado);

    //    } catch (error) {
    //        console.error(error);
    //        alert('Erro ao alterar status');
    //    }
    //}

    async function adicionarServico() {

        if (!descricaoServico.trim()) {
            showToast("Informe a descrição do serviço", "error")
            return
        }

        if (!valorServico || isNaN(parseFloat(valorServico))) {
            showToast("Informe um valor válido", "error")
            return
        }

        if (os.status === STATUS_OS.FINALIZADO) {
            showToast("Esta OS está finalizada e não pode ser alterada", "error")
            return
        }

        try {

            await apiPost('/ordens-servico/adicionar-servico', {
                ordemServicoId: os.id,
                descricao: descricaoServico,
                valor: parseFloat(valorServico)
            })

            const atualizado = await apiGet(`/ordens-servico/${id}`)
            setOs(atualizado)

            setDescricaoServico('')
            setValorServico('')
            showToast("Serviço adicionado com sucesso!")

        } catch (error) {

            const mensagem =
                error?.response?.data?.message ||
                "Erro ao adicionar serviço"

            showToast(mensagem, "error")

            console.error(error)
        }
    }

    //async function removerServico(servicoId) {

    //    const confirmar = window.confirm("Deseja remover este serviço?")
    //    if (!confirmar) return

    //    const response = await fetch(
    //        'http://localhost:5175/api/ordens-servico/remover-servico',
    //        {
    //            method: 'DELETE',
    //            headers: { 'Content-Type': 'application/json' },
    //            body: JSON.stringify({
    //                ordemServicoId: os.id,
    //                servicoId: servicoId
    //            })
    //        }
    //    )

    //    if (!response.ok) {
    //        alert("Erro ao remover serviço")
    //        return
    //    }

    //    const atualizado = await apiGet(`/ordens-servico/${id}`)
    //    setOs(atualizado)
    //}

    async function removerServico(servicoId) {

        try {

            await apiDelete(`/ordens-servico/${os.id}/servicos/${servicoId}`)

            const atualizado = await apiGet(`/ordens-servico/${id}`)
            setOs(atualizado)
            toastSucesso("Serviço removido com sucesso!")

        } catch (error) {
            toastErro(obterMensagemErro(error, "Erro ao remover serviço"));
        }
    }

    async function adicionarPeca() {

        if (osBloqueadaEdicao) {
            toastErro("Esta OS está bloqueada para edição.");
            return;
        }

        if (!descricaoPeca.trim()) {
            showToast("Informe a descrição da peça", "error")
            return
        }

        if (!quantidadePeca || isNaN(parseInt(quantidadePeca))) {
            showToast("Informe uma quantidade válida", "error")
            return
        }

        if (!valorPeca || isNaN(parseFloat(valorPeca))) {
            showToast("Informe um valor válido", "error")
            return
        }

        try {

            await apiPost('/ordens-servico/adicionar-peca', {
                ordemServicoId: os.id,
                descricao: descricaoPeca,
                quantidade: parseInt(quantidadePeca),
                valorVendaUnitario: parseFloat(valorPeca)
            })

            const atualizado = await apiGet(`/ordens-servico/${id}`)
            setOs(atualizado)

            setDescricaoPeca('')
            setQuantidadePeca('')
            setValorPeca('')
            toastSucesso("Peça adicionada com sucesso!")

        } catch (error) {
            toastErro(obterMensagemErro(error, "Erro ao adicionar peça"));
        }
    }

    async function removerPeca(pecaId) {

        //const confirmar = window.confirm("Deseja remover esta peça?")
        //if (!confirmar) return
        const confirmou = await confirmar("Deseja remover esta peça?");
        if (!confirmou) return;

        try {

            await apiDelete(`/ordens-servico/${os.id}/pecas/${pecaId}`)

            const atualizado = await apiGet(`/ordens-servico/${id}`)
            setOs(atualizado)
            toastSucesso("Peça removida com sucesso!")

        } catch (error) {
            toastErro(obterMensagemErro(error, "Erro ao remover peça"));
        }
    }

    async function alterarStatus(novoStatus) {

        try {

            await apiPut('/ordens-servico/alterar-status', {
                ordemServicoId: os.id,
                novoStatus: novoStatus
            })

            const atualizado = await apiGet(`/ordens-servico/${id}`)
            setOs(atualizado)
            toastSucesso("Status alterado com sucesso!")

        } catch (error) {
            toastErro(obterMensagemErro(error, "Erro ao alterar status"));
        }
    }

    //function gerarLaudo() {
    //    window.open(
    //        `http://localhost:5175/api/ordens-servico/${id}/laudo`,
    //        '_blank'
    //    )
    //}

    async function gerarLaudo() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:5175/api/ordens-servico/${id}/laudo`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao gerar laudo");
            }

            const blob = await response.blob();
            const fileURL = window.URL.createObjectURL(blob);

            window.open(fileURL, "_blank");
        } catch (error) {
            console.error(error);
            toastErro("Erro ao gerar laudo");
        }
    }

    if (erro) return <p style={{ color: 'red' }}>{erro}</p>
    if (!os) return <p>Carregando...</p>

    function getStatusStyle(status) {
        switch (status) {
            case STATUS_OS.ABERTO:
                return { backgroundColor: "#ffc107", color: "#000" }
            case STATUS_OS.EM_EXECUCAO:
                return { backgroundColor: "#17a2b8", color: "#fff" }
            case STATUS_OS.FINALIZADO:
                return { backgroundColor: "#28a745", color: "#fff" }
            default:
                return { backgroundColor: "#6c757d", color: "#fff" }
        }
    }

    function obterMensagemErro(error, fallback = "Ocorreu um erro") {
        const data = error?.response?.data;

        // Caso 1: já venha como objeto { message: "..." }
        if (data && typeof data === "object" && data.message) {
            return data.message;
        }

        // Caso 2: venha como string JSON: '{"message":"..."}'
        if (typeof data === "string") {
            try {
                const parsed = JSON.parse(data);
                if (parsed?.message) return parsed.message;
            } catch {
                // não era JSON; segue abaixo
            }

            if (data.trim()) return data;
        }

        // Caso 3: fallback para message do erro
        return error?.response?.data?.message || fallback;
    }

    async function excluirOs() {

        //const confirmar = window.confirm("Deseja realmente excluir esta OS?")
        //if (!confirmar) return
        const confirmou = await confirmar("Deseja realmente excluir esta OS?");
        if (!confirmou) return;

        try {
            await apiDelete(`/ordens-servico/${os.id}`)

            toastSucesso("OS excluída com sucesso")

            navigate("/ordens-servico")

        } catch (error) {
            toastErro(obterMensagemErro(error, "Erro ao excluir OS"));
        }
    }

    function showToast(message, type = "success") {

        setToast({ message, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)
    }

    async function salvarDescricao() {
        try {
            await apiPut(`/ordens-servico/${os.id}/descricao`, {
                descricao: descricaoEditada
            });

            const atualizado = await apiGet(`/ordens-servico/${id}`);
            setOs(atualizado);

            setEditandoDescricao(false);
            toastSucesso("Descrição atualizada com sucesso!");

        } catch (error) {
            toastErro("Erro ao atualizar descrição");
        }
    }

    async function cancelarOs() {

        const motivo = prompt("Informe o motivo do cancelamento:");

        if (!motivo) return;

        try {
            await apiPut(`/ordens-servico/${os.id}/cancelar`, motivo);

            const atualizado = await apiGet(`/ordens-servico/${id}`);
            setOs(atualizado);

            toastSucesso("OS cancelada com sucesso!");

        } catch (error) {
            toastErro("Erro ao cancelar OS");
        }
    }

    const subtotalServicos = os.servicos?.reduce(
        (total, s) => total + Number(s.valor || 0),
        0
    );

    return (
        <div style={{ maxWidth: 850, margin: "0 auto", padding: 20 }}>

            {toast && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        padding: "15px 20px",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: "bold",
                        zIndex: 9999,
                        backgroundColor:
                            toast.type === "success" ? "#28a745" : "#dc3545",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}
                >
                    {toast.message}
                </div>
            )}

            {os.laudoGerado && (
                <div style={{
                    backgroundColor: "#fff3cd",
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 20,
                    border: "1px solid #ffeeba",
                    fontWeight: "bold"
                }}>
                    🔒 Esta OS está bloqueada para edição.
                </div>
            )}

        <div>
            {/*<button onClick={() => navigate(-1)}>⬅ Voltar</button>*/}{/* Depende do histórico do navegador*/}

                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginBottom: "15px",
                        fontWeight: "500",
                        color: "#111827"
                    }}
                >
                    ← Voltar para Lista
                </button>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 30,
                        paddingBottom: 20,
                        borderBottom: "1px solid #e5e7eb"
                    }}
                >

                    {/* ESQUERDA */}
                    <div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                           {/* <h2 style={{ margin: 0 }}>OS #{os.id}</h2>*/}

                            <div>
                                <div style={{ marginBottom: 5, color: "#6b7280", fontSize: 14 }}>
                                    🏢 {os.oficinaNome}
                                </div>

                                <h2 style={{ margin: 0 }}>
                                    {os.cliente?.nome}
                                </h2>

                                <div style={{ color: "#6b7280", marginTop: 4 }}>
                                    {os.veiculo?.modelo} - {os.veiculo?.placa}
                                </div>

                            {/*    <div style={{ fontSize: 13, color: "#9ca3af" }}>*/}
                            {/*        OS-{os.id.toString().padStart(4, "0")}*/}
                            {/*    </div>*/}

                            {/*<span*/}
                            {/*    style={{*/}
                            {/*        borderRadius: 20,*/}
                            {/*        fontWeight: "bold",*/}
                            {/*        fontSize: 13,*/}
                            {/*        padding: "6px 14px",*/}
                            {/*        backgroundColor:*/}
                            {/*            os.status === STATUS_OS.ABERTO ? "#f59e0b" :*/}
                            {/*                os.status === STATUS_OS.EM_EXECUCAO ? "#3b82f6" :*/}
                            {/*                    "#10b981",*/}
                            {/*        color: "white"*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    {os.status}*/}
                                {/*</span>*/}

                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    flexWrap: "wrap" // 🔥 evita sobreposição
                                }}>
                                    <h2 style={{ margin: 0 }}>
                                        OS-{os.id.toString().padStart(4, "0")}
                                    </h2>

                                    <span
                                        style={{
                                            borderRadius: 20,
                                            fontWeight: "bold",
                                            fontSize: 12,
                                            padding: "4px 10px",
                                            whiteSpace: "nowrap", // 🔥 evita quebrar
                                            backgroundColor:
                                                os.status === "Aberto" ? "#f59e0b" :
                                                    os.status === "EmExecucao" ? "#3b82f6" :
                                                        "#10b981",
                                            color: "white"
                                        }}
                                    >
                                        {os.status}
                                    </span>
                                </div>
                        </div>

                        
                        </div>


                        <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                            {/*<div style={{*/}
                            {/*    display: "flex",*/}
                            {/*    gap: "20px",*/}
                            {/*    marginBottom: "20px"*/}
                            {/*}}>*/}
                            {/*    <div*/}
                            {/*        style={{*/}
                            {/*            flex: 1,*/}
                            {/*            padding: "15px",*/}
                            {/*            border: "1px solid #ddd",*/}
                            {/*            borderRadius: "8px"*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <strong>Cliente:</strong> {os.cliente?.nome}*/}
                            {/*    </div>*/}

                            {/*    <div*/}
                            {/*        style={{*/}
                            {/*            flex: 1,*/}
                            {/*            padding: "15px",*/}
                            {/*            border: "1px solid #ddd",*/}
                            {/*            borderRadius: "8px"*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <p><strong>Placa:</strong> {os.veiculo?.placa?.toUpperCase()}</p>*/}
                            {/*        <p>{os.veiculo?.marca} {os.veiculo?.modelo}</p>*/}
                            {/*        </div>*/}
                            {/*</div>*/}

                            <div>
                                <strong>Abertura:</strong> {new Date(os.dataAbertura).toLocaleDateString()}
                            </div>
                        </div>

                    </div>

                    {/* DIREITA */}
                    <div style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#111827"
                    }}>
                        R$ {Number(os.valorTotal).toFixed(2)}
                    </div>

                </div>

            <div style={{ marginTop: 10, marginBottom: 20 }}>

                    {os.status === STATUS_OS.FINALIZADO ? (

                        <button
                            onClick={() => gerarLaudo()}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            📄 Gerar / Visualizar Laudo
                        </button>

                    ) : (

                        <span style={{ color: 'orange', fontWeight: 'bold' }}>
                            ⚠ Finalize a OS para gerar o laudo.
                        </span>

                    )}

            </div>

            {!os.laudoGerado && (
                <div style={{ marginBottom: 20 }}>
                    <h4>Alterar Status:</h4>

                    {/*<button onClick={() => alterarStatus("Aberto")} style={{ marginRight: 10 }}>*/}
                    {/*    Aberta*/}
                    {/*</button>*/}

                    {/*<button onClick={() => alterarStatus("EmExecucao")} style={{ marginRight: 10 }}>*/}
                    {/*    Em Execução*/}
                    {/*</button>*/}

                    {/*<button onClick={() => alterarStatus("Finalizado")}>*/}
                    {/*    Finalizado*/}
                    {/*</button>*/}

                        {os.status === STATUS_OS.ABERTO && (
                            <button
                                onClick={() => alterarStatus(STATUS_OS.EM_EXECUCAO)}
                                style={{
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "500"
                                }}
                            >
                                ▶ Iniciar Execução
                            </button>
                    )}

                        {os.status === STATUS_OS.EM_EXECUCAO && (
                        <button onClick={() => alterarStatus(STATUS_OS.FINALIZADO)}>
                            Finalizar OS
                        </button>
                    )}

                        {os.status === STATUS_OS.FINALIZADO && (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                            OS Finalizada
                        </span>
                    )}
                </div>
            )}

            <hr />

            {/* 🧾 Dados da OS */}
            <h3>Dados da OS</h3>

            {/*<p><strong>Status:</strong> {os.status}</p>*/}
            <div style={{ marginBottom: "10px" }}>
                <strong>Status:</strong>
                <span
                    style={{
                        marginLeft: "10px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        ...getStatusStyle(os.status)
                    }}
                >
                    {os.status}
                </span>
            </div>

                <div style={{ marginBottom: 15 }}>
                    <strong>Descrição do Problema:</strong>

                    {editandoDescricao ? (
                        <div style={{ marginTop: 10 }}>
                            <textarea
                                value={descricaoEditada}
                                onChange={e => setDescricaoEditada(e.target.value)}
                                style={{ width: "100%", padding: 10, borderRadius: 6 }}
                                rows={3}
                            />

                            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                                <button onClick={salvarDescricao()}>
                                    💾 Salvar
                                </button>

                                <button onClick={() => setEditandoDescricao(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginTop: 5 }}>
                            {os.descricaoProblema || "—"}

                            {!osBloqueadaEdicao && (
                                <button
                                    onClick={() => {
                                        setDescricaoEditada(os.descricaoProblema || "");
                                        setEditandoDescricao(true);
                                    }}
                                    style={{
                                        marginLeft: 10,
                                        fontSize: 12,
                                        background: "none",
                                        border: "none",
                                        color: "#2563eb",
                                        cursor: "pointer"
                                    }}
                                >
                                    ✏ Editar
                                </button>
                            )}
                        </div>
                    )}
                </div>

            <p><strong>Data de Abertura:</strong> {new Date(os.dataAbertura).toLocaleString()}</p>

            {/*<p><strong>Total:</strong> R$ {os.valorTotal}</p>*/}
            <div
                style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    marginBottom: "15px",
                    border: "1px solid #dee2e6"
                }}
            >
                <h3 style={{ margin: 0 }}>
                    💰 Total da OS: R$ {Number(os.valorTotal).toFixed(2)}
                </h3>
            </div>

            <hr />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#f1f5f9",
                        marginBottom: "20px"
                    }}
                >
                    <div>
                        <div>Total Pago</div>
                        <strong>R$ {Number(os.totalPago).toFixed(2)}</strong>
                    </div>

                    <div>
                        <div>Restante</div>
                        <strong style={{
                            color: os.valorRestante > 0 ? "#dc2626" : "#16a34a"
                        }}>
                            R$ {Number(os.valorRestante).toFixed(2)}
                        </strong>
                    </div>

                    <div>
                        <div>Status</div>
                        <strong>{os.statusFinanceiro}</strong>
                    </div>
                </div>

                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa"
                }}>
                    <h4>💰 Registrar Pagamento</h4>

                    <div style={{ display: "flex", gap: 10 }}>

                        <select
                            value={formaPagamento}
                            onChange={e => setFormaPagamento(e.target.value)}
                            disabled={!podeRegistrarPagamento}
                            title={!podeRegistrarPagamento ? "Não é possível registrar pagamento para OS cancelada." : ""}
                            style={{
                                width: "100%",
                                padding: 8,
                                marginBottom: 10,
                                borderRadius: 6,
                                border: "1px solid #ccc"
                            }}
                        >
                            <option value="">Selecione a forma</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartao">Cartão</option>
                            <option value="Pix">Pix</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Valor do pagamento"
                            value={valorPagamento}
                            onChange={e => setValorPagamento(e.target.value)}
                            disabled={!podeRegistrarPagamento}
                            title={!podeRegistrarPagamento ? "Não é possível registrar pagamento para OS cancelada." : ""}
                            style={{
                                flex: 1,
                                padding: 8,
                                borderRadius: 6,
                                border: "1px solid #ccc"
                            }}
                        />

                        <button
                        
                            //disabled={!podeRegistrarPagamento}
                            title={!podeRegistrarPagamento ? "Não é possível registrar pagamento para OS cancelada." : ""}
                            onClick={async () => {
                                try {
                                    if (!podeRegistrarPagamento) {
                                        toastErro("Não é possível registrar pagamento para OS cancelada.");
                                        return;
                                    }

                                    if (!formaPagamento) {
                                        toastErro("Selecione a forma de pagamento");
                                        return;
                                    }

                                    if (!valorPagamento || isNaN(parseFloat(valorPagamento))) {
                                        toastErro("Informe um valor válido");
                                        return;
                                    }

                                    await apiPost(`/ordens-servico/${os.id}/registrar-pagamento`, {
                                        //ordemServicoId: os.id,
                                        valor: parseFloat(valorPagamento),
                                        formaPagamento: formaPagamento
                                    });

                                    const atualizado = await apiGet(`/ordens-servico/${id}`);
                                    setOs(atualizado);
                                    setValorPagamento("");

                                    toastSucesso("Pagamento registrado!");

                                } catch (err) {
                                    toastErro("Erro ao registrar pagamento");
                                }
                            }}
                            style={{
                                backgroundColor: osBloqueadaEdicao ? "#6c757d" : "#007bff",
                                color: "white",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: 6,
                                cursor: "pointer"
                            }}
                        >
                            Registrar
                        </button>
                    </div>
                </div>

            <hr />

            {/* 👤 Cliente */}
            {/*<h3>Cliente</h3>*/}
            {/*<p><strong>Nome:</strong> {os.cliente?.nome}</p>*/}
            {/*<p><strong>Telefone:</strong> {os.cliente?.telefone}</p>*/}
            {/*<p><strong>CPF/CNPJ:</strong> {os.cliente?.cpfCnpj}</p>*/}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "20px"
                    }}
                >

                    {/* Cliente */}
                    <div
                        style={{
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#fafafa"
                        }}
                    >
                        <h3>👤 Cliente</h3>
                        <p><strong>Nome:</strong> {os.cliente?.nome}</p>
                        <p><strong>Telefone:</strong> {os.cliente?.telefone}</p>
                        <p><strong>CPF/CNPJ:</strong> {os.cliente?.cpfCnpj}</p>
                    </div>

                    {/* Veículo */}
                    <div
                        style={{
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#fafafa"
                        }}
                    >
                        <h3>🚗 Veículo</h3>
                        <p><strong>Placa:</strong> {os.veiculo?.placa}</p>
                        <p><strong>Marca:</strong> {os.veiculo?.marca}</p>
                        <p><strong>Modelo:</strong> {os.veiculo?.modelo}</p>
                        <p><strong>Ano:</strong> {os.veiculo?.ano}</p>
                        <p><strong>Quilometragem:</strong> {os.veiculo?.quilometragem?.toLocaleString()}</p>
                    </div>

                </div>

            {/*<div*/}
            {/*    style={{*/}
            {/*        padding: "15px",*/}
            {/*        border: "1px solid #ddd",*/}
            {/*        borderRadius: "8px",*/}
            {/*        marginBottom: "15px"*/}
            {/*    }}*/}
                {/*    >*/}

                <div style={sectionStyle}>
                <h3>🔧 Serviços</h3>
                {os.servicos?.length === 0 ? (
                    <p>Nenhum serviço cadastrado.</p>
                ) : (
                    //<ul>
                    //    {os.servicos.map((s) => (
                    //        <li key={s.id}>
                    //            {s.descricao} — R$ {s.valor}

                    //            {os.status !== "Finalizado" && (
                    //                <button
                    //                    onClick={() => removerServico(s.id)}
                    //                    style={{ marginLeft: 10 }}
                    //                >
                    //                    ❌
                    //                </button>
                    //            )}
                    //        </li>
                    //    ))}
                        //</ul>
                        <div style={{ marginTop: "15px" }}>
                            {os.servicos.length === 0 ? (
                                <p>Nenhum serviço cadastrado.</p>
                            ) : (
                                os.servicos.map((s, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "10px",
                                            borderBottom: "1px solid #eee"
                                        }}
                                    >
                                        <div>
                                            <strong>{s.descricao}</strong>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <span>
                                                R$ {Number(s.valor).toFixed(2)}
                                            </span>

                                            {!os.laudoGerado && os.status !== STATUS_OS.FINALIZADO && (
                                                <button
                                                    onClick={() => {
                                                        if (osBloqueadaEdicao) {
                                                            toastErro("Esta OS não pode ser alterada");
                                                            return;
                                                        }

                                                        removerServico(s.id);
                                                    }}
                                                    //disabled={osBloqueadaEdicao}
                                                    title={osBloqueadaEdicao ? "Esta OS não pode ser alterada" : ""}
                                                    style={{
                                                        backgroundColor: osBloqueadaEdicao ? "#6c757d" : "#007bff",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        padding: "5px 8px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    ✖
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            </div>





                )}
                </div>

                <div
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "6px",
                        fontWeight: "bold"
                    }}
                >
                    Subtotal Serviços: R$ {subtotalServicos.toFixed(2)}
                </div>

            {/*<h4>Adicionar Serviço</h4>*/}

            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Descrição"*/}
            {/*    value={descricaoServico}*/}
            {/*    disabled={os.status === "Finalizado"}*/}
            {/*    onChange={e => setDescricaoServico(e.target.value)}*/}
            {/*/>*/}

            {/*<input*/}
            {/*    type="number"*/}
            {/*    placeholder="Valor"*/}
            {/*    value={valorServico}*/}
            {/*    disabled={os.status === "Finalizado"}*/}
            {/*    onChange={e => setValorServico(e.target.value)}*/}
            {/*/>*/}

            {/*<button*/}
            {/*    onClick={adicionarServico}*/}
            {/*    disabled={os.status === "Finalizado"}*/}
            {/*>*/}
            {/*    Adicionar*/}
            {/*</button>*/}

            {/*<div*/}
            {/*    style={{*/}
            {/*        marginTop: "20px",*/}
            {/*        padding: "15px",*/}
            {/*        border: "1px solid #ddd",*/}
            {/*        borderRadius: "8px",*/}
            {/*        backgroundColor: "#f8f9fa"*/}
            {/*    }}*/}
                {/*>*/}

                <div style={sectionStyle}>
                <h4 style={{ marginBottom: "10px" }}>➕ Adicionar Serviço</h4>

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                            placeholder="Descrição"
                            disabled={osBloqueadaEdicao}
                            value={descricaoServico}
                            onChange={e => setDescricaoServico(e.target.value)}
                            style={{ flex: 2, padding: "8px" }}
                    />

                    <input
                        type="number"
                            placeholder="Valor"
                            disabled={osBloqueadaEdicao}
                            value={valorServico}
                            onChange={e => setValorServico(e.target.value)}
                            style={{ flex: 1, padding: "8px" }}
                    />

                    <button
                            //onClick={adicionarServico}
                            onClick={() => {
                                if (osBloqueadaEdicao) {
                                    toastErro("Esta OS não pode ser alterada");
                                    return;
                                }

                                adicionarServico();
                            }}
                            title={osBloqueadaEdicao ? "Esta OS não pode ser alterada" : ""}
                            style={{
                                padding: "8px 15px",
                                backgroundColor: osBloqueadaEdicao ? "#6c757d" : "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: osBloqueadaEdicao ? "not-allowed" : "pointer",
                                opacity: osBloqueadaEdicao ? 0.7 : 1
                            }}
                    >
                        + Adicionar
                    </button>
                </div>
            </div>

            <hr />

            <div style={{ marginTop: "15px" }}>
                {os.pecas.length === 0 ? (
                    <p>Nenhuma peça cadastrada.</p>
                ) : (
                    os.pecas.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px",
                                borderBottom: "1px solid #eee"
                            }}
                        >
                            <div>
                                <strong>{p.descricao}</strong>
                                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                    Qtd: {p.quantidade}
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <span>
                                    R$ {(p.quantidade * p.valorVendaUnitario).toFixed(2)}
                                </span>

                                {!os.laudoGerado && (
                                    <button
                                        onClick={() => {
                                            if (osBloqueadaEdicao) {
                                                toastErro("Esta OS não pode ser alterada");
                                                return;
                                            }

                                            removerPeca(p.id);
                                        }}
                                        //onClick={() => removerPeca(p.id)}
                                        //disabled={osBloqueadaEdicao}
                                        title={osBloqueadaEdicao ? "Esta OS não pode ser alterada" : ""}
                                        style={{
                                            backgroundColor: osBloqueadaEdicao ? "#6c757d" : "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "5px 8px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/*<div*/}
            {/*    style={{*/}
            {/*        marginTop: "10px",*/}
            {/*        padding: "10px",*/}
            {/*        backgroundColor: "#f8f9fa",*/}
            {/*        borderRadius: "6px",*/}
            {/*        fontWeight: "bold"*/}
            {/*    }}*/}
                {/*>*/}

                <div style={sectionStyle}>
                Subtotal Peças: R$ {Number(os.totalPecas).toFixed(2)}
            </div>

            {/*<div*/}
            {/*    style={{*/}
            {/*        marginTop: "20px",*/}
            {/*        padding: "15px",*/}
            {/*        border: "1px solid #ddd",*/}
            {/*        borderRadius: "8px",*/}
            {/*        backgroundColor: "#f8f9fa"*/}
            {/*    }}*/}
                {/*>*/}
                <div style={sectionStyle}>
                <h4 style={{ marginBottom: "10px" }}>➕ Adicionar Peça</h4>

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Descrição"
                            value={descricaoPeca}
                            disabled={osBloqueadaEdicao}
                        onChange={e => setDescricaoPeca(e.target.value)}
                        style={{ flex: 2, padding: "8px" }}
                    />

                    <input
                        type="number"
                        placeholder="Qtd"
                            value={quantidadePeca}
                            disabled={osBloqueadaEdicao}
                        onChange={e => setQuantidadePeca(e.target.value)}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <input
                        type="number"
                        placeholder="Valor Unit."
                            value={valorPeca}
                            disabled={osBloqueadaEdicao}
                        onChange={e => setValorPeca(e.target.value)}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <button
                            //onClick={adicionarPeca}
                            onClick={() => {
                                if (osBloqueadaEdicao) {
                                    toastErro("Esta OS não pode ser alterada");
                                    return;
                                }

                                adicionarPeca();
                            }}
                            //disabled={osBloqueadaEdicao}
                            //title={osBloqueadaEdicao ? "Esta OS está bloqueada para edição." : ""}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: osBloqueadaEdicao ? "#6c757d" : "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: osBloqueadaEdicao ? "not-allowed" : "pointer",
                            opacity: osBloqueadaEdicao ? 0.7 : 1
                        }}
                    >
                        + Adicionar
                    </button>
                </div>
            </div>

            <hr />

            {/*<div*/}
            {/*    style={{*/}
            {/*        padding: "15px",*/}
            {/*        border: "1px solid #ddd",*/}
            {/*        borderRadius: "8px",*/}
            {/*        marginBottom: "15px"*/}
            {/*    }}*/}
                {/*>*/}
                <div style={sectionStyle}>

                    <div style={sectionStyle}>
                        <h3>💳 Pagamentos</h3>

                        {!os.pagamentos || os.pagamentos.length === 0 ? (
                            <p>Nenhum pagamento registrado.</p>
                        ) : (
                            os.pagamentos.map((p, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px",
                                        borderBottom: "1px solid #eee"
                                    }}
                                >
                                    <div>
                                        <strong>
                                            R$ {Number(p.valor).toFixed(2)}
                                        </strong>
                                    </div>

                                    <div style={{ color: "#6b7280" }}>
                                        {p.formaPagamento}
                                    </div>

                                    <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                                        {new Date(p.dataPagamento).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                {/* 🕓 Histórico */}
                <h3>Histórico</h3>
                {os.historico?.length === 0 ? (
                    <p>Sem histórico.</p>
                ) : (
                    <ul>
                        {os.historico.map((h, index) => (
                            <li key={index}>
                                {h.evento} — {new Date(h.dataEvento).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                )}
                </div>

                {os.status !== "Finalizado" && os.status !== "Cancelado" && (
                <button
                        //onClick={cancelarOs}
                        onClick={() => {
                            if (os.status === "Cancelado") {
                                toastErro("OS já esta cancelada.");
                                return;
                            }

                            cancelarOs();
                        }}
                        title={osBloqueadaEdicao ? "OS já esta cancelada." : ""}
                    //disabled={os.status === "Cancelado"}
                    style={{
                        marginTop: "10px",
                        marginRight: "5px",
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "8px 15px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    ⚠ Cancelar OS
                </button>
                )}

            <button
                    //onClick={excluirOs}
                    onClick={() => {
                        if (osBloqueadaEdicao) {
                            toastErro("Esta OS não pode ser alterada");
                            return;
                        }

                        excluirOs();
                    }}
                    //disabled={osBloqueadaEdicao}
                    title={osBloqueadaEdicao ? "Esta OS não pode ser alterada" : ""}
                style={{
                    marginTop: "15px",
                    backgroundColor: osBloqueadaEdicao ? "#6c757d" : "#dc3545",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: osBloqueadaEdicao ? "not-allowed" : "pointer",
                    opacity: osBloqueadaEdicao ? 0.7 : 1
                }}
            >
                🗑 Excluir OS
            </button>

            </div>
        </div>
    )
}

export default OrdemServicoDetalhe