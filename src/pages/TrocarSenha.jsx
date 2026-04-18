import { useState } from "react";
import { apiPatch } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso } from "../../utils/toast";

function TrocarSenha() {

    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function salvar() {

        await apiPatch("/auth/trocar-senha", { senha });

        toastSucesso("Senha alterada com sucesso");

        navigate("/dashboard");
    }

    return (
        <div>
            <h2>Trocar senha</h2>

            <input
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
            />

            <button onClick={salvar}>
                Salvar
            </button>
        </div>
    );
}

export default TrocarSenha;