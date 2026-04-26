function UsuarioTable({ usuarios, navigate, alterarStatus, resetSenha }) {

    return (

        <table>

            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>

            <tbody>

                {usuarios.map(u => (

                    <tr key={u.id}>
                        <td>{u.nome}</td>
                        <td>{u.email}</td>
                        <td>{u.perfil}</td>

                        <td className={u.ativo ? "status-ativo" : "status-inativo"}>
                            {u.ativo ? "Ativo" : "Inativo"}
                        </td>

                        <td className="acoes">

                            <button onClick={() => navigate(`/usuarios/${u.id}`)}>
                                Editar
                            </button>

                            <button onClick={() => alterarStatus(u.id)}>
                                {u.ativo ? "Desativar" : "Ativar"}
                            </button>

                            <button onClick={() => resetSenha(u.id)}>
                                Reset Senha
                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );
}

export default UsuarioTable;