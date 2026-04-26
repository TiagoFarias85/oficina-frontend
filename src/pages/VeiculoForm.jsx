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

        if (!clienteId || !placa || !marca || !modelo || !ano) {
            toastErro("Preencha todos os campos obrigatórios")
            return
        }

        if (placa.length !== 7) {
            toastErro("Informe uma placa válida");
            return;
        }

        const anoNumero = parseInt(ano);
        const anoAtual = new Date().getFullYear() + 1;

        if (anoNumero < 1900 || anoNumero > anoAtual) {
            toastErro("Informe um ano válido");
            return;
        }

        try {

            const payload = {
                clienteId: parseInt(clienteId),
                placa,
                marca,
                modelo,
                ano: parseInt(ano),
                quilometragem: quilometragem ? parseInt(quilometragem.replace(/\D/g, "")) : 0
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

    const inputStyle = {
        width: "100%",
        padding: 8,
        marginTop: 5,
        borderRadius: 6,
        border: "1px solid #ccc"
    }

    function formatarPlaca(valor) {

        valor = (valor || "").toString();

        valor = valor.toUpperCase();

        valor = valor.replace(/[^A-Z0-9]/g, "");

        valor = valor.substring(0, 7);

        return valor;
    }

    function formatarAno(valor) {

        valor = (valor || "").toString();

        valor = valor.replace(/\D/g, "");

        valor = valor.substring(0, 4);

        return valor;
    }

    function formatarKm(valor) {

        valor = (valor || "").toString();

        valor = valor.replace(/\D/g, "");

        valor = valor.substring(0, 7);

        return valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

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
                    <label>Cliente</label>
                    <select
                        value={clienteId}
                        onChange={e => setClienteId(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">Selecione</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Placa</label>
                    <input
                        value={placa}
                        onChange={e => setPlaca(formatarPlaca(e.target.value))}
                        placeholder="ABC1234"
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Marca</label>
                    <input
                        value={marca}
                        onChange={e => setMarca(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Modelo</label>
                    <input
                        value={modelo}
                        onChange={e => setModelo(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label>Ano</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={ano}
                        onChange={e => setAno(formatarAno(e.target.value))}
                        placeholder="2024"
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label>Quilometragem</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={quilometragem}
                        onChange={e => setQuilometragem(formatarKm(e.target.value))}
                        placeholder="125.000"
                        style={inputStyle}
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