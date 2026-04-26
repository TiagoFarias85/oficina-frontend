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
                    <span style={{ color: "#dc2626", fontSize: 13 }}>
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

    function formatarCpfCnpj(valor) {

        valor = (valor || "").toString();

        valor = valor.replace(/\D/g, "");

        valor = valor.substring(0, 14);

        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {
            valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        }

        return valor;
    }

    //function formatarTelefone(valor) {
    //    valor = valor.replace(/\D/g, "");

    //    if (valor.length <= 10) {
    //        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    //        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    //    } else {
    //        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    //        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    //    }

    //    return valor;
    //}

    function formatarTelefone(valor) {

        valor = (valor || "").toString();

        valor = valor.replace(/\D/g, "");
        valor = valor.substring(0, 11);

        if (valor.length <= 10) {
            valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        }

        return valor;
    }

    function validarCampo(name, value) {

        let mensagem = "";

        if (name === "nome" && !value.trim()) {
            mensagem = "Informe o nome.";
        }

        if (name === "telefone") {
            const numeros = value.replace(/\D/g, "");
            if (numeros.length > 0 && numeros.length < 10) {
                mensagem = "Telefone incompleto.";
            }
        }

        if (name === "cpfCnpj") {
            const numeros = value.replace(/\D/g, "");

            if (numeros.length > 0 && numeros.length !== 11 && numeros.length !== 14) {
                mensagem = "CPF/CNPJ incompleto.";
            }
        }

        if (name === "email") {
            if (value && !value.includes("@")) {
                mensagem = "Email inválido.";
            }
        }

        setErros(prev => ({
            ...prev,
            [name]: mensagem
        }));
    }

    //function handleChange(e) {
    //    const { name, value } = e.target;

    //    setCliente(prev => ({
    //        ...prev,
    //        [name]: value
    //    }));
    //}

    function handleChange(e) {
        const { name, value } = e.target;

        let novoValor = value;

        if (name === "cpfCnpj") {
            novoValor = formatarCpfCnpj(value);
        }

        if (name === "telefone") {
            novoValor = formatarTelefone(value);
        }

        setCliente(prev => ({
            ...prev,
            [name]: novoValor
        }));

        validarCampo(name, novoValor);
    }

    const formInvalido =
        Object.values(erros).some(x => x) ||
        !cliente.nome?.trim();

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
                        disabled={salvando || formInvalido}
                        style={{
                            ...primaryButton,
                            opacity: salvando || formInvalido ? 0.6 : 1,
                            cursor: salvando || formInvalido ? "not-allowed" : "pointer"
                        }}
                    >
                        {salvando
                            ? "Salvando..."
                            : formInvalido
                                ? "Preencha corretamente"
                                : "Salvar Cliente"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ClienteForm;