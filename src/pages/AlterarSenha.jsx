import { useState } from "react";
import { apiPatch } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso } from "../utils/toast";

function AlterarSenha() {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    async function salvar() {
        try {
            await apiPatch("/auth/alterar-senha", {
                senhaAtual,
                novaSenha
            });

            toastSucesso("Senha alterada com sucesso");

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            showToast("Erro ao alterar senha", "error")
        }
    }

    function showToast(message, type = "success") {
        setToast({ message, type });

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }

    return (
        <div>
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        padding: "15px 20px",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: "bold",
                        zIndex: 9999,
                        backgroundColor:
                            toast.type === "success" ? "#28a745" : "#dc3545",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}
                >
                    {toast.message}
                </div>
            )}

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