import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/usuarios.css";
import UsuarioTable from "../../components/UsuarioTable";
import DataTable from "../../components/DataTable";
import { toastSucesso, toastErro } from "../../utils/toast";
import { confirmar } from "../../utils/confirm";

function Usuarios() {

    /*
    Dica rápida que vai te ajudar muito no React

    Sempre pense no componente em 6 blocos:

    Estados
    Constantes
    Hooks
    Funções
    Effects
    Render (JSX)

    Isso é um padrão muito usado em projetos React profissionais.
    */

    // 1️º Estados
    const [usuarios, setUsuarios] = useState([]);
    //const [busca, setBusca] = useState("");
    //const [paginaAtual, setPaginaAtual] = useState(1);

    // 2️º Constantes
    //const usuariosPorPagina = 5;

    // 3️º Hooks
    const navigate = useNavigate();

    // 4️º Funções
    async function carregarUsuarios() {

        try {

            const response = await apiGet("/usuarios");

            //setUsuarios(response.data);
            setUsuarios(response);

        } catch {

            toastErro("Erro ao carregar usuários");

        }
    }

    async function alterarStatus(id) {

        //if (!confirm("Deseja alterar o status do usuário?"))
        //    return;
        const confirmou = await confirmar("Deseja alterar o status do usuário?");

        if (!confirmou)
            return;

        await apiPatch(`/usuarios/${id}/status`);

        toastSucesso("Status atualizado com sucesso");

        carregarUsuarios();
    }

    async function resetSenha(id) {

        const confirmou = await confirmar("Resetar senha do usuário para 123456?");

        if (!confirmou)
            return;

        const response = await apiPatch(`/usuarios/${id}/reset-senha`);

        //alert("Nova senha: " + response.data.senha);
        toastSucesso("Nova senha: " + response.senha);
    }

    // 5️º useEffect
    useEffect(() => {

        async function carregar() {

            try {

                const response = await apiGet("/usuarios");

                //setUsuarios(response.data);
                setUsuarios(response);

            } catch {

                toastErro("Erro ao carregar usuários");

            }

        }

        carregar();

    }, []);

    const columns = [
        { header: "Nome", field: "nome" },
        { header: "Login", field: "login" },
        { header: "E-mail", field: "email" },
        { header: "Perfil", field: "perfil" },

        {
            header: "Status",
            render: (u) => (
                <span className={u.ativo ? "status-ativo" : "status-inativo"}>
                    {u.ativo ? "Ativo" : "Inativo"}
                </span>
            )
        },

        {
            header: "Ações",
            render: (u) => (
                <div className="acoes-botoes">
                    <button onClick={() => navigate(`/usuarios/${u.id}`)}>
                        Editar
                    </button>

                    <button onClick={() => alterarStatus(u.id)}>
                        {u.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button onClick={() => resetSenha(u.id)}>
                        Reset Senha
                    </button>
                </div>
            )
        }
    ];

    // 6️º JSX
    return (
        <div className="container">

            <div className="titulo">

                <h2>Usuários</h2>

                <button onClick={() => navigate("/usuarios/novo")}>
                    + Novo Usuário
                </button>

            </div>

            <DataTable
                columns={columns}
                data={usuarios}
            />

        </div>
    );
}

export default Usuarios;