import { useEffect, useState } from "react"
import { apiGet, apiPost, apiPut } from "../services/api"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { toastSucesso, toastErro } from "../utils/toast";

function VeiculoForm() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const clienteIdParam = searchParams.get("clienteId")

    const [clienteId, setClienteId] = useState(clienteIdParam || "")
    const [clientes, setClientes] = useState([])

    const [placa, setPlaca] = useState("")
    const [marca, setMarca] = useState("")
    const [modelo, setModelo] = useState("")
    const [ano, setAno] = useState("")
    const [quilometragem, setQuilometragem] = useState("")

    const [erros, setErros] = useState({});

    // 🔹 Carregar lista de clientes
    useEffect(() => {
        async function loadClientes() {
            try {
                const data = await apiGet("/clientes")
                setClientes(data)
            } catch (error) {
                toastErro("Erro ao carregar Veículos")
                console.error(error)
            }
        }

        loadClientes()
    }, [])

    // 🔹 Se for edição, carregar veículo
    useEffect(() => {

        if (!id) return

        async function carregarVeiculo() {
            try {
                const data = await apiGet(`/veiculos/${id}`)

                setClienteId(data.clienteId)
                setPlaca(data.placa)
                setMarca(data.marca)
                setModelo(data.modelo)
                setAno(data.ano || "")
                setQuilometragem(data.quilometragem || "")

            } catch (error) {
                toastErro("Erro ao carregar veículo")
                console.error(error)
            }
        }

        carregarVeiculo()

    }, [id])

    async function salvar() {

        const novosErros = {};

        if (!clienteId) novosErros.clienteId = "Selecione o cliente";
        if (!placa) novosErros.placa = "Placa é obrigatória";
        if (!marca) novosErros.marca = "Marca é obrigatória";
        if (!modelo) novosErros.modelo = "Modelo é obrigatório";
        if (!ano) novosErros.ano = "Ano é obrigatório";

        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) {
            return;
        }

        try {
            const payload = {
                clienteId: parseInt(clienteId),
                placa,
                marca,
                modelo,
                ano: parseInt(ano),
                quilometragem: quilometragem ? parseInt(quilometragem) : 0
            }

            if (id) {
                await apiPut(`/veiculos/${id}`, payload)
                toastSucesso("Veículo atualizado com sucesso")
            } else {
                await apiPost("/veiculos", payload)
                toastSucesso("Veículo cadastrado com sucesso")
            }

            navigate("/veiculos")

        } catch (error) {
            toastErro("Erro ao salvar veículo")
            console.error(error)
        }
    }

    const getInputStyle = (campo) => ({
        width: "100%",
        padding: 8,
        marginTop: 5,
        borderRadius: 6,
        border: erros[campo] ? "1px solid red" : "1px solid #ccc"
    });

    

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 40
            }}
        >
            <div
                style={{
                    width: 500,
                    backgroundColor: "white",
                    padding: 30,
                    borderRadius: 10,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
            >
                <h2 style={{ marginBottom: 20 }}>
                    {id ? "✏ Editar Veículo" : "🚗 Novo Veículo"}
                </h2>

                <div style={{ marginBottom: 15 }}>
                    <label>Cliente *</label>
                    <select
                        value={clienteId}
                        onChange={e => setClienteId(e.target.value)}
                        style={getInputStyle("clienteId")}
                    >
                        <option value="">Selecione</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
                    {erros.clienteId && (
                        <span style={{ color: "red" }}>
                            {erros.clienteId}
                        </span>
                    )}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Placa *</label>
                    <input
                        value={placa}
                        onChange={e => setPlaca(e.target.value.toUpperCase())}
                        style={getInputStyle("placa")}
                    />
                    {erros.placa && <span style={{ color: "red" }}>{erros.placa}</span>}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Marca *</label>
                    <input
                        value={marca}
                        onChange={e => setMarca(e.target.value)}
                        style={getInputStyle("marca")}
                    />
                    {erros.marca && <span style={{ color: "red" }}>{erros.marca}</span>}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Modelo *</label>
                    <input
                        value={modelo}
                        onChange={e => setModelo(e.target.value)}
                        style={getInputStyle("modelo")}
                    />
                    {erros.modelo && <span style={{ color: "red" }}>{erros.modelo}</span>}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Ano *</label>
                    <input
                        type="number"
                        value={ano}
                        onChange={e => setAno(e.target.value)}
                        style={getInputStyle("ano")}
                    />
                    {erros.ano && <span style={{ color: "red" }}>{erros.ano}</span>}
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label>Quilometragem</label>
                    <input
                        //type="number"
                        type="text"
                        value={quilometragem}
                        //onChange={e => setQuilometragem(e.target.value)}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, "");
                            setQuilometragem(valor);
                        }}
                        style={getInputStyle("quilometragem")}
                    />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={salvar}
                        style={{
                            flex: 1,
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: 10,
                            borderRadius: 6,
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        💾 Salvar
                    </button>

                    <button
                        onClick={() => navigate("/veiculos")}
                        style={{
                            flex: 1,
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            padding: 10,
                            borderRadius: 6,
                            cursor: "pointer"
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VeiculoForm