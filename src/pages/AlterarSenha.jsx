import { useState } from "react";
import { apiPatch } from "../services/api";

function AlterarSenha() {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    async function salvar() {
        try {
            await apiPatch("/auth/alterar-senha", {
                senhaAtual,
                novaSenha
            });

            alert("Senha alterada com sucesso");
        } catch (error) {
            alert("Erro ao alterar senha");
        }
    }

    return (
        <div>
            <h2>Alterar Senha</h2>

            <input
                type="password"
                placeholder="Senha atual"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
            />

            <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
            />

            <button onClick={salvar}>Salvar</button>
        </div>
    );
}

export default AlterarSenha;