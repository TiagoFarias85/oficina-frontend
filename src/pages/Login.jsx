import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../services/api";

function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        try {

            const data = await apiPost("/auth/login", { email, senha });

            login(data.token, data.nome, data.perfil);

            if (data.senhaProvisoria) {
                navigate("/trocar-senha");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            setErro(err.message || "Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #1e3c72, #2a5298)"
            }}
        >
            <div
                style={{
                    width: "380px",
                    backgroundColor: "#fff",
                    padding: "40px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
                }}
            >
                <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
                    🔧 Sistema Oficina
                </h2>

                <form onSubmit={handleLogin}>

                    <div style={{ marginBottom: "15px" }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <button
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: loading ? "#6c757d" : "#2a5298",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                </form>

                {erro && (
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            borderRadius: "6px",
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            border: "1px solid #f5c6cb"
                        }}
                    >
                        {erro}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;


//function Login() {

//    const { login } = useContext(AuthContext);
//    const navigate = useNavigate();

//    const [email, setEmail] = useState("");
//    const [senha, setSenha] = useState("");
//    const [erro, setErro] = useState(null);
//    const [loading, setLoading] = useState(false);

//    async function handleLogin(e) {
//        e.preventDefault();
//        setLoading(true);
//        setErro(null);

//        try {
//            const response = await fetch("http://localhost:5175/api/auth/login", {
//                method: "POST",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify({ email, senha })
//            });

//            if (!response.ok)
//                throw new Error("Email ou senha inválidos");

//            const data = await response.json();

//            login(data.token, data.nome);
//            //navigate("/");
//            navigate("/usuarios");

//        } catch (err) {
//            setErro(err.message);
//        } finally {
//            setLoading(false);
//        }
//    }

//    return (
//        <div
//            style={{
//                height: "100vh",
//                display: "flex",
//                justifyContent: "center",
//                alignItems: "center",
//                background: "linear-gradient(135deg, #1e3c72, #2a5298)"
//            }}
//        >
//            <div
//                style={{
//                    width: "380px",
//                    backgroundColor: "#fff",
//                    padding: "40px",
//                    borderRadius: "12px",
//                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
//                }}
//            >
//                <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
//                    🔧 Sistema Oficina
//                </h2>

//                <form onSubmit={handleLogin}>

//                    <div style={{ marginBottom: "15px" }}>
//                        <input
//                            type="email"
//                            placeholder="Email"
//                            value={email}
//                            onChange={e => setEmail(e.target.value)}
//                            required
//                            style={{
//                                width: "100%",
//                                padding: "10px",
//                                borderRadius: "6px",
//                                border: "1px solid #ccc"
//                            }}
//                        />
//                    </div>

//                    <div style={{ marginBottom: "20px" }}>
//                        <input
//                            type="password"
//                            placeholder="Senha"
//                            value={senha}
//                            onChange={e => setSenha(e.target.value)}
//                            required
//                            style={{
//                                width: "100%",
//                                padding: "10px",
//                                borderRadius: "6px",
//                                border: "1px solid #ccc"
//                            }}
//                        />
//                    </div>

//                    <button
//                        disabled={loading}
//                        style={{
//                            width: "100%",
//                            padding: "12px",
//                            borderRadius: "6px",
//                            border: "none",
//                            backgroundColor: loading ? "#6c757d" : "#2a5298",
//                            color: "#fff",
//                            fontWeight: "bold",
//                            cursor: loading ? "not-allowed" : "pointer"
//                        }}
//                    >
//                        {loading ? "Entrando..." : "Entrar"}
//                    </button>

//                </form>

//                {erro && (
//                    <div
//                        style={{
//                            marginTop: "15px",
//                            padding: "10px",
//                            borderRadius: "6px",
//                            backgroundColor: "#f8d7da",
//                            color: "#721c24",
//                            border: "1px solid #f5c6cb"
//                        }}
//                    >
//                        {erro}
//                    </div>
//                )}
//            </div>
//        </div>
//    );
//}

//export default Login;