import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet, apiDelete, apiPost, apiPut } from '../services/api'
import { toastSucesso, toastErro } from "../utils/toast";
import { confirmar } from "../utils/confirm";

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
    const [valorPagamento, setValorPagamento] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

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
                    toastErro(error.message || "Erro ao carregar OS")   

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

    function moedaParaNumero(valor) {
        return parseFloat(
            valor.replace(/\./g, "").replace(",", ".")
        ) || 0;
    }

    async function adicionarServico() {

        if (!descricaoServico.trim()) {
            showToast("Informe a descrição do serviço", "error")
            return
        }

        if (!valorServico || isNaN(parseFloat(valorServico))) {
            showToast("Informe um valor válido", "error")
            return
        }

        //if (os.status === "Finalizado") {
        if (osEncerrada) {
            showToast("Esta OS está finalizada e não pode ser alterada", "error")
            return
        }

        try {

            await apiPost('/ordens-servico/adicionar-servico', {
                ordemServicoId: os.id,
                descricao: descricaoServico,
                //valor: parseFloat(valorServico)
                valor: moedaParaNumero(valorServico)
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
            toastErro("Erro ao remover serviço")
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
                //valorVendaUnitario: parseFloat(valorPeca)
                valorVendaUnitario: moedaParaNumero(valorPeca)
            })

            const atualizado = await apiGet(`/ordens-servico/${id}`)
            setOs(atualizado)

            setDescricaoPeca('')
            setQuantidadePeca('')
            setValorPeca('')
            toastSucesso("Peça adicionada com sucesso!")

        } catch (error) {
            toastErro("Erro ao adicionar peça")
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
            toastSucesso("Peça removida com sucesso!")

        } catch (error) {
            toastErro("Erro ao remover peça")
            console.error(error)
        }
    }

    async function alterarStatus(novoStatus) {

        try {

            await apiPut('/ordens-servico/alterar-status', {
                ordemServicoId: os.id,
                novoStatus: novoStatus
            })

            const atualizado = await apiGet(`/ordens-servico/${id}`);
            setOs(atualizado);

            toastSucesso("Status alterado com sucesso!")

        } catch (error) {
            toastErro("Erro ao alterar status", "error")
            console.error(error)
        }
}

async function registrarPagamento() {

    if (!valorPagamento) {
        toastErro("Informe o valor do pagamento");
        return;
    }

    try {

        await apiPost('/ordens-servico/adicionar-pagamento', {
            ordemServicoId: os.id,
            valor: moedaParaNumero(valorPagamento),
            formaPagamento: formaPagamento
        });

        const atualizado = await apiGet(`/ordens-servico/${id}`);
        setOs(atualizado);

        setValorPagamento('');
        setFormaPagamento('Dinheiro');

        toastSucesso("Pagamento registrado com sucesso!");

    } catch (error) {
        toastErro(
            error.message || "Erro ao registrar pagamento"
        );
        console.error(error);
    }
}

    //function gerarLaudo() {
    //    window.open(
    //        `http://localhost:5175/api/ordens-servico/${id}/laudo`,
    //        '_blank'
    //    )
    //}

    //function gerarLaudo() {
    //    window.open(
    //        `https://oficina-tiago-api-dveqfccse5avhzaz.brazilsouth-01.azurewebsites.net/api/ordens-servico/${id}/laudo`,
    //        "_blank"
    //    );
    //}

    async function gerarLaudo() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://oficina-tiago-api-dveqfccse5avhzaz.brazilsouth-01.azurewebsites.net/api/ordens-servico/${id}/laudo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            window.open(url, "_blank");

        } catch {
            toastErro("Erro ao gerar laudo");
        }
    }

    if (erro) return <p style={{ color: 'red' }}>{erro}</p>
    if (!os) return <p>Carregando...</p>

    const osEncerrada =
        os.status === "Finalizado" ||
        os.status === "Entregue" ||
        os.status === "Cancelado";

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

            toastSucesso("OS excluída com sucesso")

            navigate("/ordens-servico")

        } catch (error) {
            toastErro("Erro ao excluir OS")
            console.error(error)
        }
    }

    function showToast(message, type = "success") {
        setToast({ message, type });

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }

    function formatarMoeda(valor) {

        valor = (valor || "").toString();

        // remove tudo que não for número
        valor = valor.replace(/\D/g, "");

        if (valor === "")
            return "";

        valor = (parseInt(valor, 10) / 100).toFixed(2);

        return Number(valor).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    async function entregarVeiculo() {

        if (os.valorRestante > 0) {

            const confirmou = await confirmar(
                `Cliente possui saldo pendente de ${Number(os.valorRestante).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}. Deseja entregar mesmo assim?`
            );

            if (!confirmou)
                return;
        }

        alterarStatus("Entregue");
    }

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
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginBottom: "15px"
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
                            <h2 style={{ margin: 0 }}>OS #{os.id}</h2>

                            <span
                                style={{
                                    borderRadius: 20,
                                    fontWeight: "bold",
                                    fontSize: 13,
                                    padding: "6px 14px",
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
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: "bold",
                            color: "#111827",
                            minWidth: 150,
                            textAlign: "right"
                        }}
                    >
                        {/*R$ {Number(os.valorTotal).toFixed(2)}*/}
                        {Number(os.valorTotal).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </div>

                </div>

            <div style={{ marginTop: 10, marginBottom: 20 }}>

                    {
                    //    os.laudoGerado ? (
                    //<span style={{ color: 'green', fontWeight: 'bold' }}>
                    //    ✔ Laudo já gerado
                    //</span>

                    //    ) :
                            os.status === "Finalizado" ? (

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

                    {/*{os.status === "Aberto" && (*/}
                    {/*        <button onClick={() => alterarStatus("EmExecucao")}*/}
                    {/*        style={{*/}
                    {/*            backgroundColor: "#f1f5f9",*/}
                    {/*            border: "1px solid #cbd5e1",*/}
                    {/*            padding: "6px 12px",*/}
                    {/*            borderRadius: "6px",*/}
                    {/*            cursor: "pointer",*/}
                    {/*            marginBottom: "15px"*/}
                    {/*        }}*/}
                    {/*        >*/}
                    {/*        Iniciar Execução*/}
                    {/*    </button>*/}
                    {/*)}*/}

                    {/*{os.status === "EmExecucao" && (*/}
                    {/*    <button onClick={() => alterarStatus("Finalizado")}>*/}
                    {/*        Finalizar OS*/}
                    {/*    </button>*/}
                    {/*)}*/}

                    {/*{os.status === "Finalizado" && (*/}
                    {/*    <span style={{ color: "green", fontWeight: "bold" }}>*/}
                    {/*        OS Finalizada*/}
                    {/*    </span>*/}
                        {/*)}*/}

                        {os.status === "Aberto" && (
                            <>
                                <button onClick={() => alterarStatus("EmExecucao")}>
                                    Iniciar Execução
                                </button>

                                <button onClick={() => alterarStatus("Cancelado")}>
                                    Cancelar OS
                                </button>
                            </>
                        )}

                        {os.status === "EmExecucao" && (
                            <>
                                <button onClick={() => alterarStatus("Finalizado")}>
                                    Finalizar OS
                                </button>

                                <button onClick={() => alterarStatus("Cancelado")}>
                                    Cancelar OS
                                </button>
                            </>
                        )}

                        {/*{os.status === "Finalizado" && (*/}
                        {/*    <button onClick={() => alterarStatus("Entregue")}>*/}
                        {/*        Entregar Veículo*/}
                        {/*    </button>*/}
                        {/*)}*/}

                        {os.status === "Finalizado" && (
                            <button
                                onClick={entregarVeiculo}
                                style={{
                                    backgroundColor: "#16a34a",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 18px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                🚗 Entregar Veículo
                            </button>
                        )}

                        {os.status === "Entregue" && (
                            <span>✅ Veículo entregue</span>
                        )}

                        {os.status === "Cancelado" && (
                            <span>❌ OS cancelada</span>
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
                {/*<p><strong>Data de Abertura:</strong> {new Date(os.dataAbertura).toLocaleString()}</p>*/}
                <p>
                    <strong>Data de Abertura:</strong>{" "}
                    {new Date(os.dataAbertura).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "medium"
                    })}
                </p>

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
                        💰 Total da OS: {Number(os.valorTotal).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
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
                        <strong>{Number(os.totalPago).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}</strong>
                    </div>

                    <div>
                        <div>Restante</div>
                        <strong style={{
                            color: os.valorRestante > 0 ? "#dc2626" : "#16a34a"
                        }}>
                            {Number(os.valorRestante).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </strong>
                    </div>

                    <div>
                        <div>Status</div>
                        <strong>{os.statusFinanceiro}</strong>
                    </div>
                </div>

                <div
                    style={{
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        backgroundColor: "#f8fafc"
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>💳 Registrar Pagamento</h3>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Valor"
                            value={valorPagamento}
                            onChange={e => setValorPagamento(formatarMoeda(e.target.value))}
                            style={{ flex: 1, padding: "8px" }}
                        />

                        <select
                            value={formaPagamento}
                            onChange={e => setFormaPagamento(e.target.value)}
                            style={{ flex: 1, padding: "8px" }}
                        >
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Pix">Pix</option>
                            <option value="Cartão Débito">Cartão Débito</option>
                            <option value="Cartão Crédito">Cartão Crédito</option>
                            <option value="Transferência">Transferência</option>
                        </select>

                        <button
                            onClick={registrarPagamento}
                            style={{
                                padding: "8px 15px",
                                backgroundColor: "#16a34a",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Registrar
                        </button>

                    </div>
                </div>

                <div
                    style={{
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        backgroundColor: "#ffffff"
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>📋 Pagamentos Registrados</h3>

                    {os.pagamentos?.length === 0 ? (
                        <p>Nenhum pagamento registrado.</p>
                    ) : (
                        os.pagamentos.map((p, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "10px 0",
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                <div>
                                    <strong>{p.formaPagamento}</strong>
                                    <div style={{ fontSize: "13px", color: "#666" }}>
                                        {new Date(p.dataPagamento).toLocaleString("pt-BR")}
                                    </div>
                                </div>

                                <div style={{ fontWeight: "bold", color: "#16a34a" }}>
                                    {Number(p.valor).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </div>
                            </div>
                        ))
                    )}
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
                        <p><strong>Quilometragem:</strong> {os.veiculo?.quilometragem}</p>
                    </div>

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

                    //            {!osEncerrada && (
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
                                        //key={index}
                                        key={s.servicoId}
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
                                                {Number(s.valor).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL"
                                                })}
                                            </span>

                                            {!os.laudoGerado && !osEncerrada && (
                                                <button
                                                    //onClick={() => removerServico(s.id)}
                                                    onClick={() => removerServico(s.servicoId)}
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
            {/*    disabled={osEncerrada}*/}
            {/*    onChange={e => setDescricaoServico(e.target.value)}*/}
            {/*/>*/}

            {/*<input*/}
            {/*    type="number"*/}
            {/*    placeholder="Valor"*/}
            {/*    value={valorServico}*/}
            {/*    disabled={osEncerrada}*/}
            {/*    onChange={e => setValorServico(e.target.value)}*/}
            {/*/>*/}

            {/*<button*/}
            {/*    onClick={adicionarServico}*/}
            {/*    disabled={osEncerrada}*/}
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
                            disabled={osEncerrada}
                        placeholder="Descrição"
                        value={descricaoServico}
                        onChange={e => setDescricaoServico(e.target.value)}
                        style={{ flex: 2, padding: "8px" }}
                    />

                    <input
                            type="text"
                            disabled={osEncerrada}
                            inputMode="numeric"
                        placeholder="Valor"
                        value={valorServico}
                            onChange={e => setValorServico(formatarMoeda(e.target.value))}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <button
                            onClick={adicionarServico}
                            disabled={osEncerrada}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: osEncerrada ? "#9ca3af" : "#007bff",
                            cursor: osEncerrada ? "not-allowed" : "pointer",
                            color: "white",
                            border: "none",
                            borderRadius: "5px"
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
                                    {(p.quantidade * p.valorVendaUnitario).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </span>

                                {!os.laudoGerado && !osEncerrada && (
                                    <button
                                        onClick={() => removerPeca(p.id)}
                                        disabled={osEncerrada}
                                        style={{

                                            backgroundColor: osEncerrada ? "#9ca3af" : "#dc3545",
                                            cursor: osEncerrada ? "not-allowed" : "pointer",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "5px 8px"
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
                    Subtotal Peças: {Number(os.totalPecas).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
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
                            disabled={osEncerrada}
                        placeholder="Descrição"
                        value={descricaoPeca}
                        onChange={e => setDescricaoPeca(e.target.value)}
                        style={{ flex: 2, padding: "8px" }}
                    />

                    <input
                            type="number"
                            disabled={osEncerrada}
                        placeholder="Qtd"
                        value={quantidadePeca}
                        onChange={e => setQuantidadePeca(e.target.value)}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <input
                            type="text"
                            disabled={osEncerrada}
                            inputMode="numeric"
                        placeholder="Valor Unit."
                        value={valorPeca}
                        onChange={e => setValorPeca(formatarMoeda(e.target.value))}
                        style={{ flex: 1, padding: "8px" }}
                    />

                    <button
                            onClick={adicionarPeca}
                            disabled={osEncerrada}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: osEncerrada ? "#9ca3af" : "#007bff",
                            cursor: osEncerrada ? "not-allowed" : "pointer",
                            color: "white",
                            border: "none",
                            borderRadius: "5px"
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
                            //<li key={index}>
                            <li key={index}>
                                {h.evento} — {new Date(h.dataEvento).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

                {(os.status === "Aberto" || os.status === "Cancelado") && (
            <button
                onClick={excluirOs}
                style={{
                    marginTop: "15px",
                    marginBottom: "30px",
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
)}

            </div>
        </div>
    )
}

export default OrdemServicoDetalhe