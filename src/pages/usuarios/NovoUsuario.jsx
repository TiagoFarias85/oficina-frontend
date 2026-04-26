import { useState } from "react";
import { apiPost } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toastSucesso, toastErro } from "../../utils/toast";

function NovoUsuario() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("ATENDENTE");
    const [login, setLogin] = useState("");

    async function salvar() {

        try {
            if (!login || !nome || !email || !perfil) {
                toastErro("Preencha todos os campos.");
                return;
            }

            await apiPost("/usuarios", {
                login,
                nome,
                email,
                senha,
                perfil
            });

            toastSucesso("Usuário criado com sucesso");

            navigate("/usuarios");

        } catch (error) {
            toastErro("Erro ao cadastrar usuário.");
            //toastErro(error.message);

        }

    }

    return (
        <div className="form-container">

            <h2 className="form-title">Novo Usuário</h2>

            <div className="form-group">
                <label>Login</label>
                <input
                    type="text"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Perfil</label>
                <select
                    value={perfil}
                    onChange={e => setPerfil(e.target.value)}
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="ATENDENTE">ATENDENTE</option>
                    <option value="MECANICO">MECANICO</option>
                </select>
            </div>

            <div className="form-actions">

                <button
                    className="btn-secondary"
                    onClick={() => navigate("/usuarios")}
                >
                    Cancelar
                </button>

                <button
                    className="btn-primary"
                    onClick={salvar}
                >
                    Salvar
                </button>

            </div>

        </div>
    );
}

export default NovoUsuario;