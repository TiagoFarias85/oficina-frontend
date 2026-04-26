import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toastSucesso, toastErro } from "../../utils/toast";

function EditarUsuario() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [perfil, setPerfil] = useState("ATENDENTE");
    const [login, setLogin] = useState("");

    useEffect(() => {

        async function carregarUsuario() {

            try {

                const response = await apiGet(`/usuarios/${id}`);

                //setNome(response.data.nome);
                //setEmail(response.data.email);
                //setPerfil(response.data.perfil);
                setNome(response.nome);
                setEmail(response.email);
                setPerfil(response.perfil);

            } catch {

                toastErro("Erro ao carregar usuário");

            }

        }

        carregarUsuario();

    }, [id]);

    async function salvar() {

        try {

            await apiPut(`/usuarios/${id}`, {
                login,
                nome,
                email,
                perfil
            });

            toastSucesso("Usuário atualizado com sucesso");

            navigate("/usuarios");

        } catch {

            toastErro("Erro ao atualizar usuário");

        }

    }

    return (
        <div className="form-container">

            <h2 className="form-title">Editar Usuário</h2>

            <div className="form-group">
                <label>Nome</label>
                <input
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Usuário (Login ou E-mail)</label>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                <button className="btn-primary" onClick={salvar}>
                    Salvar
                </button>

                <button className="btn-secondary"  onClick={() => navigate("/usuarios")}>
                    Cancelar
                </button>
            </div>

        </div>
    );
}

export default EditarUsuario;