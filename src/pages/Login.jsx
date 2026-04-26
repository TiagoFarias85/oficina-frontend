import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../services/api";
/*import { useEffect } from "react";*/

function Login() {

    //useEffect(() => {
    //    console.log("MONTANDO LOGIN");
    //}, []);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    //const [email, setEmail] = useState("");
    const [loginInput, setLoginInput] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputLoginRef = useRef(null);

    async function handleLogin(e) {

        if (e) e.preventDefault();

        if (loading) return;

        if (!loginInput || !senha) {
            setErro("Preencha login/email e senha");
            return;
        }

        setLoading(true);

        //e.preventDefault();
        //setLoading(true);
        //setErro(null);

        try {
            //const data = await apiPost("/auth/login", { loginInput, senha });
            const data = await apiPost("/auth/login", {
                login: loginInput,
                senha
            });

            if (!data?.token) {
                throw new Error("login ou senha inválidos");
            }

            login(data.token, data.nome, data.perfil);

            if (data.senhaProvisoria) {
                navigate("/trocar-senha");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            setErro("login ou senha inválidos");
            //setErro(err.message || "Erro ao fazer login");

            //console.log("SETANDO ERRO");

            //setErro("ERRO FIXO TESTE");

            //let mensagem = "Erro ao fazer login";

            //try {
            //    const data = JSON.parse(err.message);
            //    mensagem = data.message || mensagem;
            //} catch {
            //    mensagem = err.message || mensagem;
            //}

            //setErro(mensagem);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        inputLoginRef.current?.focus();
    }, []);

    return (
        
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
            }}
        >
            <div
                style={{
                    width: "420px",
                    backgroundColor: "#ffffff",
                    padding: "45px",
                    borderRadius: "20px",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.15)"
                }}
            >
                {/*<h2 style={{ marginBottom: "25px", textAlign: "center" }}>*/}
                {/*    🔧 Sistema Oficina*/}
                {/*</h2>*/}

                {/*<h2>*/}
                {/*    🔧 FS Oficina*/}
                {/*</h2>*/}

                {/*<p>*/}
                {/*    Sistema para gestão de oficinas*/}
                {/*</p>*/}

                <div style={{ textAlign: "center", marginBottom: "30px" }}>

                    <div
                        style={{
                            fontSize: "34px",
                            fontWeight: "900",
                            color: "#1e3c72",
                            letterSpacing: "1px"
                        }}
                    >
                        NORVIK AUTO
                    </div>

                    <div
                        style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "5px"
                        }}
                    >
                        by Norvik Sys
                    </div>

                    <div
                        style={{
                            fontSize: "13px",
                            color: "#999",
                            marginTop: "10px"
                        }}
                    >
                        Tecnologia que impulsiona negócios
                    </div>

                </div>

                {/*<form onSubmit={handleLogin}>*/}
                <form onSubmit={handleLogin}>

                {/*<form onSubmit={(e) => {*/}
                {/*    e.preventDefault();*/}
                {/*        console.log("SUBMIT DISPARADO");*/}
                {/*        handleLogin(e);*/}
                {/*    }}>*/}

                    <div style={{ marginBottom: "15px" }}>
                        <input
                            //type="email"
                            placeholder="Login ou Email"
                            ref={inputLoginRef}
                            value={loginInput}
                            onChange={e => setLoginInput(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "10px",
                                border: "1px solid #dcdcdc",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing: "border-box"
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
                                padding: "14px",
                                borderRadius: "10px",
                                border: "1px solid #dcdcdc",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        //type="button"
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "10px",
                            border: "none",
                            background: loading
                                ? "#6c757d"
                                : "linear-gradient(135deg,#1e3c72,#2a5298)",
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: "15px",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "0.2s"
                        }}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

              {/*  </form>*/}
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