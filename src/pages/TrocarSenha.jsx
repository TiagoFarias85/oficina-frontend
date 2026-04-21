import { useState } from "react";
import { apiPatch } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso } from "../utils/toast";

function TrocarSenha() {

    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    async function salvar() {
        try {
            if (!senha || senha.length < 6) {
                showToast("A senha deve ter pelo menos 6 caracteres", "error")
                return;
            }

            await apiPatch("/auth/trocar-senha", { Senha: senha });

            toastSucesso("Senha alterada com sucesso");

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            showToast("Erro ao trocar senha", "error")
        }
    }

    function showToast(message, type = "success") {

        setToast({ message, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)
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