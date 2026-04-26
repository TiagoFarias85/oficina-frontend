import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet, apiDelete, apiPost, apiPut } from '../services/api'
import { confirmar } from "../utils/confirm";

function OrdemServicoDetalhe() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [os, setOs] = useState(null);
    const [erro, setErro] = useState(null);
    const [descricaoServico, setDescricaoServico] = useState('');
    const [valorServico, setValorServico] = useState('');
    const [descricaoPeca, setDescricaoPeca] = useState('');
    const [quantidadePeca, setQuantidadePeca] = useState('');
    const [valorPeca, setValorPeca] = useState('');
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

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
                    setErro(error.message)
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

        if (os.status === "Finalizada") {
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
            showToast("Serviço removido com sucesso!")

        } catch (error) {
            showToast("Erro ao remover serviço", "error")
            console.error(error)
        }
    }

    async function adicionarPeca() {

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
            showToast("Peça adicionada com sucesso!")

        } catch (error) {
            showToast("Erro ao adicionar peça", "error")
            console.error(error)
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
            showToast("Peça removida com sucesso!")

        } catch (error) {
            showToast("Erro ao remover peça", "error")
            console.error(error)
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
            showToast("Status alterado com sucesso!")

        } catch (error) {
            showToast("Erro ao alterar status", "error")
            console.error(error)
        }
    }

    function gerarLaudo() {
        window.open(
            `http://localhost:5175/api/ordens-servico/${id}/laudo`,
            '_blank'
        )
    }

    if (erro) return <p style={{ color: 'red' }}>{erro}</p>
    if (!os) return <p>Carregando...</p>

    function getStatusStyle(status) {
        switch (status) {
            case "Aberta":
                return { backgroundColor: "#ffc107", color: "#000" }
            case "EmExecucao":
                return { backgroundColor: "#17a2b8", color: "#fff" }
            case "Finalizado":
                return { backgroundColor: "#28a745", color: "#fff" }
            default:
                return { backgroundColor: "#6c757d", color: "#fff" }
        }
    }

    async function excluirOs() {

        //const confirmar = window.confirm("Deseja realmente excluir esta OS?")
        //if (!confirmar) return
        const confirmou = await confirmar("Deseja realmente excluir esta OS?");
        if (!confirmou) return;

        try {

            await apiDelete(`/ordens-servico/${os.id}`)

            showToast("OS excluída com sucesso")

            navigate("/ordens-servico")

        } catch (error) {
            showToast("Erro ao excluir OS", "error")
            console.error(error)
        }
    }

    function showToast(message, type = "success") {

        setToast({ message, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)
    }

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>

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

            <button onClick={() => navigate('/')}>
                ⬅ Voltar para Lista
            </button>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 25
                }}>

                    <div>
                        <h2 style={{ margin: 0 }}>
                            Ordem de Serviço #{os.id}
                        </h2>
                        <span
                            style={{
                                marginTop: 5,
                                display: "inline-block",
                                padding: "5px 12px",
                                borderRadius: 20,
                                fontWeight: "bold",
                                fontSize: 12,
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

                    <div style={{
                        fontSize: 24,
                        fontWeight: "bold"
                    }}>
                        {/*R$ {Number(os.valorTotal).toFixed(2)}*/}
                        {Number(os.valorTotal).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </div>

                </div>

            <div style={{ marginTop: 10, marginBottom: 20 }}>

                {os.laudoGerado ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>
                        ✔ Laudo já gerado
                    </span>

                ) : os.status === "Finalizado" ? (

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
                        📄 Gerar Laudo
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

                    {os.status === "Aberto" && (
                        <button onClick={() => alterarStatus("EmExecucao")}>
                            Iniciar Execução
                        </button>
                    )}

                    {os.status === "EmExecucao" && (
                        <button onClick={() => alterarStatus("Finalizado")}>
                            Finalizar OS
                        </button>
                    )}

                    {os.status === "Finalizado" && (
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

            <p><strong>Descrição do Problema:</strong> {os.descricaoProblema}</p>
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

            <hr />

            {/* 👤 Cliente */}
            {/*<h3>Cliente</h3>*/}
            {/*<p><strong>Nome:</strong> {os.cliente?.nome}</p>*/}
            {/*<p><strong>Telefone:</strong> {os.cliente?.telefone}</p>*/}
            {/*<p><strong>CPF/CNPJ:</strong> {os.cliente?.cpfCnpj}</p>*/}

            <div
                style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "15px"
                }}
            >
                <h3>👤 Cliente</h3>
                <p><strong>Nome:</strong> {os.cliente?.nome}</p>
                <p><strong>Telefone:</strong> {os.cliente?.telefone}</p>
                <p><strong>CPF/CNPJ:</strong> {os.cliente?.cpfCnpj}</p>
            </div>


            <div
                style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "15px"
                }}
            >
                <h3>🚗 Veículo</h3>
                <p><strong>Placa:</strong> {os.veiculo?.placa}</p>
                <p><strong>Marca:</strong> {os.veiculo?.marca}</p>
                <p><strong>Modelo:</strong> {os.veiculo?.modelo}</p>
                <p><strong>Ano:</strong> {os.veiculo?.ano}</p>
                <p><strong>Quilometragem:</strong> {os.veiculo?.quilometragem}</p>
            </div>

            <div
                style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "15px"
                }}
            >
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

                                            {!os.laudoGerado && os.status !== "Finalizado" && (
                                                <button
                                                    onClick={() => removerServico(s.id)}
                                                    style={{
                                                        backgroundColor: "#dc3545",
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

            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa"
                }}
            >
                <h4 style={{ marginBottom: "10px" }}>➕ Adicionar Serviço</h4>

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricaoServico}
                        onChange={e => setDescricaoServico(e.target.value)}
                        style={{ flex: 2, padding: "8px" }}
                    />

                    <input
                        type="number"
                        placeholder="Valor"
                        value={valorServico}
                        onChange={e => setValorServico(e.target.value)}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <button
                        onClick={adicionarServico}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
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
                                        onClick={() => removerPeca(p.id)}
                                        style={{
                                            backgroundColor: "#dc3545",
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

            <div
                style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    fontWeight: "bold"
                }}
            >
                Subtotal Peças: R$ {Number(os.totalPecas).toFixed(2)}
            </div>

            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa"
                }}
            >
                <h4 style={{ marginBottom: "10px" }}>➕ Adicionar Peça</h4>

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricaoPeca}
                        onChange={e => setDescricaoPeca(e.target.value)}
                        style={{ flex: 2, padding: "8px" }}
                    />

                    <input
                        type="number"
                        placeholder="Qtd"
                        value={quantidadePeca}
                        onChange={e => setQuantidadePeca(e.target.value)}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <input
                        type="number"
                        placeholder="Valor Unit."
                        value={valorPeca}
                        onChange={e => setValorPeca(e.target.value)}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <button
                        onClick={adicionarPeca}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        + Adicionar
                    </button>
                </div>
            </div>

            <hr />

            <div
                style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "15px"
                }}
            >
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

            <button
                onClick={excluirOs}
                style={{
                    marginTop: "15px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                🗑 Excluir OS
            </button>

            </div>
        </div>
    )
}

export default OrdemServicoDetalhe