import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../services/api'
import { toastSucesso, toastErro } from "../utils/toast";

function NovaOrdemServico() {

    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [veiculosFiltrados, setVeiculosFiltrados] = useState([]);
    const [erros, setErros] = useState({});

    const [clienteId, setClienteId] = useState('');
    const [veiculoId, setVeiculoId] = useState('');
    const [descricaoProblema, setDescricaoProblema] = useState('');

    const [loading, setLoading] = useState(false);

    //useEffect(() => {
    //    apiGet('/clientes').then(setClientes)
    //    apiGet('/veiculos').then(setVeiculos)
    //}, [])

    //useEffect(() => {
    //    if (!clienteId) {
    //        setVeiculosFiltrados([])
    //        return
    //    }

    //    const filtrados = veiculos.filter(
    //        v => Number(v.clienteId) === Number(clienteId)
    //    )

    //    setVeiculosFiltrados(filtrados)
    //    setVeiculoId('')

    //}, [clienteId, veiculos])

    useEffect(() => {

        let isMounted = true

        async function load() {
            try {
                setLoading(true); // 🔥 começa carregamento

                const clientesData = await apiGet('/clientes')

                if (isMounted) {
                    setClientes(clientesData)
                }

            } catch (error) {
                toastErro("Erro ao carregar OS")
                console.error(error)
            } finally {
                setLoading(false); // 🔥 SEMPRE executa (sucesso ou erro)
            }
        }

        load()

        return () => {
            isMounted = false
        }

    }, [])
       

    //async function criarOs() {

    //    const response = await fetch(
    //        'http://localhost:5175/api/ordens-servico',
    //        {
    //            method: 'POST',
    //            headers: { 'Content-Type': 'application/json' },
    //            body: JSON.stringify({
    //                clienteId: parseInt(clienteId),
    //                veiculoId: parseInt(veiculoId),
    //                descricaoProblema
    //            })
    //        }
    //    )

    //    if (!response.ok) {
    //        alert('Erro ao criar OS')
    //        return
    //    }

    //    //navigate('/'); // volta para a lista, onde a nova OS já aparecerá
    //    const criada = await response.json()
    //    navigate(`/ordens-servico/${criada.id}`)
    //}

    async function criarOs() {

        const novosErros = {}

        if (!clienteId)
            novosErros.cliente = "Selecione um cliente"

        if (!veiculoId)
            novosErros.veiculo = "Selecione um veículo"

        if (!descricaoProblema.trim())
            novosErros.descricao = "Informe a descrição do problema"

        setErros(novosErros)

        if (Object.keys(novosErros).length > 0)
            return

        try {

            const criada = await apiPost('/ordens-servico', {
                clienteId: parseInt(clienteId),
                veiculoId: parseInt(veiculoId),
                descricaoProblema
            })

            toastSucesso("Ordem de serviço criada com sucesso")
            navigate(`/ordens-servico/${criada.id}`)

        } catch (error) {
            toastErro("Erro ao criar OS")
            console.error(error)
        }
    }

    const handleClienteChange = async (e) => {

        const novoClienteId = e.target.value;

        setClienteId(novoClienteId);
        setErros(prev => ({ ...prev, cliente: null }));

        // limpa veículo selecionado
        setVeiculoId("");

        if (!novoClienteId) {
            setVeiculosFiltrados([]);
            return;
        }

        try {

            const veiculos = await apiGet(`/veiculos/cliente/${novoClienteId}`);

            setVeiculosFiltrados(veiculos || []);

        } catch (error) {
            console.error(error);
            setVeiculosFiltrados([]);
        }
    };

    //return (
    //    <div>
    //        <h2>Nova Ordem de Serviço</h2>

    //        <div>
    //            <label>Cliente:</label>
    //            <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
    //                <option value="">Selecione</option>
    //                {clientes.map(c => (
    //                    <option key={c.id} value={c.id}>
    //                        {c.nome}
    //                    </option>
    //                ))}
    //            </select>
    //            {erros.cliente && (
    //                <p style={{ color: 'red' }}>{erros.cliente}</p>
    //            )}
    //        </div>

    //        <div>
    //            <label>Veículo:</label>
    //            <select value={veiculoId} onChange={e => setVeiculoId(e.target.value)}>
    //                <option value="">Selecione</option>
    //                {veiculosFiltrados.map(v => (
    //                    <option key={v.id} value={v.id}>
    //                        {v.placa} - {v.modelo}
    //                    </option>
    //                ))}
    //            </select>
    //            {erros.veiculo && (
    //                <p style={{ color: 'red' }}>{erros.veiculo}</p>
    //            )}
    //        </div>

    //        <div>
    //            <label>Descrição do Problema:</label>
    //            <textarea
    //                value={descricaoProblema}
    //                onChange={e => setDescricaoProblema(e.target.value)}
    //            />
    //            {erros.descricao && (
    //                <p style={{ color: 'red' }}>{erros.descricao}</p>
    //            )}
    //        </div>

    //        <button onClick={criarOs} style={{ marginTop: 10 }}>
    //            Criar OS
    //        </button>
    //    </div>
    //)

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '40px'
            }}
        >
            <div
                style={{
                    width: '500px',
                    padding: '30px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff'
                }}
            >
                <h2 style={{ marginBottom: '20px' }}>
                    Nova Ordem de Serviço
                </h2>

                {/* CLIENTE */}
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Cliente</strong></label>
                    <select
                        value={clienteId}
                        //onChange={e => setClienteId(e.target.value)}
                        onChange={handleClienteChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="">Selecione</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
                    {erros.cliente && (
                        <p style={{ color: 'red', marginTop: '5px' }}>
                            {erros.cliente}
                        </p>
                    )}
                </div>

                {/* VEÍCULO */}
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Veículo</strong></label>
                    <select
                        value={veiculoId}
                        onChange={e => setVeiculoId(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="">Selecione</option>
                        {/*O ?. evita erro quando for undefined.*/}
                        {veiculosFiltrados?.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.placa} - {v.modelo}
                            </option>
                        ))}
                    </select>
                    {erros.veiculo && (
                        <p style={{ color: 'red', marginTop: '5px' }}>
                            {erros.veiculo}
                        </p>
                    )}

                    {/*?. evita erro se for undefined*/}
                    {/*?? 0 garante comparação segura*/}
                    {clienteId && (veiculosFiltrados?.length ?? 0) === 0 && (
                        <div
                            style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffeeba',
                                borderRadius: '5px'
                            }}
                        >
                            <p style={{ margin: 0, marginBottom: '8px' }}>
                                ⚠ Este cliente não possui veículos cadastrados.
                            </p>

                            <button
                                onClick={() => navigate(`/veiculos/novo?clienteId=${clienteId}`)}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cadastrar Veículo
                            </button>
                        </div>
                    )}

                </div>

                {/* DESCRIÇÃO */}
                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Descrição do Problema</strong></label>
                    <textarea
                        value={descricaoProblema}
                        onChange={e => setDescricaoProblema(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            minHeight: '80px'
                        }}
                    />
                    {erros.descricao && (
                        <p style={{ color: 'red', marginTop: '5px' }}>
                            {erros.descricao}
                        </p>
                    )}
                </div>

                <button
                    onClick={criarOs}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Criar Ordem de Serviço
                </button>
            </div>
        </div>
    )
}

export default NovaOrdemServico