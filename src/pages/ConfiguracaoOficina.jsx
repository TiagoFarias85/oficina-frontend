import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/api";

function ConfiguracaoOficina() {

    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        const data = await apiGet("/oficina");

        setNome(data.nome || "");
        setCnpj(data.cnpj || "");
    }

    async function salvar() {
        await apiPut("/oficina", {
            nome,
            cnpj
        });

        setMensagem("Dados salvos com sucesso.");
    }

    return (
        <div style={{ padding: "30px" }}>

            <h2>⚙️ Configurações da Oficina</h2>

            <div style={{ marginTop: "20px" }}>
                <input
                    placeholder="Nome da Oficina"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <input
                    placeholder="CNPJ"
                    value={cnpj}
                    onChange={e => setCnpj(e.target.value)}
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