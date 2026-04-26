import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/api";

function ConfiguracaoOficina() {

    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function carregarDados() {
            const data = await apiGet("/oficina");

            setNome(data.nome || "");
            setCnpj(data.cnpj || "");
        }

        carregarDados();
    }, []);

    async function salvar() {
        await apiPut("/oficina", {
            nome,
            cnpj
        });

        setMensagem("Dados salvos com sucesso.");
    }

    const inputStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box"
    };

    return (
        <div style={{ padding: "30px" }}>

            <h2>⚙️ Configurações da Oficina</h2>

            <div style={{ marginTop: "20px" }}>

                <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#374151"
                }}>
                    Nome da Oficina
                </label>

                <input
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    style={inputStyle}
                />

            </div>

            <div style={{ marginTop: "15px" }}>

                <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#374151"
                }}>
                    CNPJ
                </label>

                <input
                    value={cnpj}
                    onChange={e => setCnpj(e.target.value)}
                    style={inputStyle}
                />

            </div>

            <button
                style={{ marginTop: "20px" }}
                onClick={salvar}
            >
                Salvar
            </button>

            {mensagem && (
                <p style={{ color: "green" }}>
                    {mensagem}
                </p>
            )}
        </div>
    );
}

export default ConfiguracaoOficina;