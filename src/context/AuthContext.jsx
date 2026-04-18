import { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [usuarioNome, setUsuarioNome] = useState(() => localStorage.getItem("usuarioNome"));
    const [perfil, setPerfil] = useState(() => localStorage.getItem("perfil"));

    function login(newToken, nome, perfilUsuario) {

        localStorage.setItem("token", newToken);
        localStorage.setItem("usuarioNome", nome);
        localStorage.setItem("perfil", perfilUsuario);

        setToken(newToken);
        setUsuarioNome(nome);
        setPerfil(perfilUsuario);
    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("usuarioNome");
        localStorage.removeItem("perfil");

        setToken(null);
        setUsuarioNome(null);
        setPerfil(null);
    }

    return (
        <AuthContext.Provider value={{
            token,
            usuarioNome,
            perfil,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export { AuthContext };