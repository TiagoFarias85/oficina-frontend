import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../services/api";
import { toastSucesso, toastErro } from "../utils/toast";

function ClienteForm() {

    const { id } = useParams(); 
    const navigate = useNavigate();

    const isEdicao = !!id;

    const [cliente, setCliente] = useState({
        nome: "",
        telefone: "",
        cpfCnpj: "",
        email: "",
        observacoes: ""
    });

    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: 10,
        borderRadius: 6,
        border: "1px solid #d1d5db",
        marginTop: 5
    };

    const primaryButton = {
        width: "100%",
        padding: 12,
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: "bold"
    };

    function renderInput(label, name) {
        return (
            <div style={{ marginBottom: 15 }}>
                <label>{label}</label>
                <input
                    name={name}
                    value={cliente[name] || ""}
                    onChange={handleChange}
                    style={inputStyle}
                />
                {erros[name] && (
                    <span style={{ color: "red", fontSize: 13 }}>
                        {erros[name]}
                    </span>
                )}
            </div>
        );
    }

    useEffect(() => {
        if (isEdicao) {
            carregarCliente();
        }
    }, [id]);

    async function carregarCliente() {
        try {
            const data = await apiGet(`/clientes/${id}`);
            setCliente(data);
        } catch {
            toastErro("Erro ao carregar cliente");
            
        }
    }

    function validar() {

        let novosErros = {};

        if (!cliente.nome.trim())
            novosErros.nome = "Nome é obrigatório";

        if (!cliente.telefone.trim())
            novosErros.telefone = "Telefone é obrigatório";

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validar())
            return;

        try {
            setSalvando(true);

            if (isEdicao)
                await apiPut(`/clientes/${id}`, cliente);
            else
                await apiPost("/clientes", cliente);

            //navigate("/clientes");
            toastSucesso(isEdicao ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!");
            navigate("/clientes");

        } catch {
            toastErro("Erro ao salvar cliente");
        } finally {
            setSalvando(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
                backgroundColor: "white",
                padding: 30,
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: 500
            }}>

                <h2 style={{ marginBottom: 20 }}>
                    {isEdicao ? "✏️ Editar Cliente" : "➕ Novo Cliente"}
                </h2>

                <form onSubmit={handleSubmit}>

                    {renderInput("Nome", "nome")}
                    {renderInput("Telefone", "telefone")}
                    {renderInput("CPF/CNPJ", "cpfCnpj")}
                    {renderInput("Email", "email")}

                    <div style={{ marginBottom: 15 }}>
                        <label>Observações</label>
                        <textarea
                            name="observacoes"
                            value={cliente.observacoes}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        disabled={salvando}
                        style={primaryButton}
                    >
                        {salvando ? "Salvando..." : "Salvar Cliente"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ClienteForm;