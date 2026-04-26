import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function Financeiro() {

    const [dados, setDados] = useState(null);

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        try {
            const response = await apiGet("/dashboard");
            setDados(response);
        } catch (error) {
            console.error(error);
        }
    }

    if (!dados)
        return <div style={{ padding: "30px" }}>Carregando...</div>;

    return (
        <div style={{ padding: "30px" }}>
            <h1 style={{ marginBottom: "25px" }}>💰 Financeiro</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >
                {/*<Card titulo="Recebido Hoje" valor="R$ 0,00" />*/}
                {/*<Card titulo="Recebido no Mês" valor="R$ 0,00" />*/}
                {/*<Card titulo="Pendências" valor="R$ 0,00" />*/}
                {/*<Card titulo="OS em Aberto" valor="0" />*/}

                <Card
                    titulo="Recebido Hoje"
                    valor={Number(dados.faturamentoHoje).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                />

                <Card
                    titulo="Recebido no Mês"
                    valor={Number(dados.faturamentoMes).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                />

                <Card
                    titulo="Pendências"
                    valor={Number(dados.totalAReceber).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                />

                <Card
                    titulo="OS em Aberto"
                    valor={dados.osAbertas}
                />

            </div>

            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
            >
                <h3>📋 Últimos Pagamentos</h3>

                <p style={{ color: "#666" }}>
                    Nenhum pagamento encontrado.
                </p>
            </div>
        </div>
    );
}

function Card({ titulo, valor }) {
    return (
        <div
            style={{
                background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                padding: "22px",
                borderRadius: "14px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                border: "1px solid #e5e7eb",
                transition: "0.2s"
            }}
        >
            <div style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "10px"
            }}>
                {titulo}
            </div>

            <div
                style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#111827"
                }}
            >
                {valor}
            </div>
        </div>
    );
}