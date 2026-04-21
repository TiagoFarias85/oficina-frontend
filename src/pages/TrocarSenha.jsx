import { useState } from "react";
import { apiPatch } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso } from "../utils/toast";

function TrocarSenha() {

    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);  

    async function salvar() {
        try {
            if (!senha || senha.length < 6) {
                showToast("A senha deve ter pelo menos 6 caracteres", "error")
                return;
            }

            setLoading(true);

            await apiPatch("/auth/trocar-senha", { Senha: senha });

            toastSucesso("Senha alterada com sucesso");

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            showToast("Erro ao trocar senha", "error")
        } finally {
            setLoading(false);
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

            <h2>Trocar senha</h2>

            <input
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                minLength={6}
            />

            {/*<button onClick={salvar} disabled={!senha || senha.length < 6}>*/}
            {/*    Salvar*/}
            {/*</button>*/}
            <button onClick={salvar} disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
            </button>
        </div>
    );
}

export default TrocarSenha;