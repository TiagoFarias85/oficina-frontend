import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../services/api";
//import { toastErro } from "../utils/toast";

function BuscaPlaca() {

    const [placa, setPlaca] = useState("");
    const [resultados, setResultados] = useState([]);

    const termoBusca = placa.toLowerCase();

    const navigate = useNavigate();

    async function buscar(termo) {

        if (!termo || termo.length < 2) {
            setResultados([]);
            return;
        }

        try {
            const data = await apiGet(`/veiculos/buscar?termo=${termo}`);

            setResultados(data);

        } catch {
            setResultados([]);
        }
    }

    function selecionar(veiculo) {
        setPlaca("");
        setResultados([]);
        //navigate(`/veiculos/${veiculo.id}`);
        navigate(`/veiculos/${veiculo.id}/ordens-servico`);
    }

    function highlight(texto, termo) {

        if (!termo) return texto;

        const regex = new RegExp(`(${termo})`, "gi");

        const partes = texto.split(regex);

        return partes.map((parte, index) =>
            parte.toLowerCase() === termo.toLowerCase()
                ? <span key={index} style={{ backgroundColor: "#fde68a" }}>{parte}</span>
                : parte
        );
    }

    return (
        <div style={{ position: "relative", width: "250px" }}>

            <input
                type="text"
                placeholder="Buscar placa, cliente ou modelo..."
                value={placa}
                onChange={(e) => {
                    const valor = e.target.value.toUpperCase();
                    setPlaca(valor);
                    buscar(valor);
                }}
                style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc"
                }}
            />

            {resultados.length > 0 && (
                <div style={{
                    position: "absolute",
                    top: "35px",
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 1000
                }}>
                    {resultados.map(v => (
                        <div
                            key={v.id}
                            onClick={() => selecionar(v)}
                            style={{
                                padding: "10px",
                                cursor: "pointer",
                                borderBottom: "1px solid #f1f1f1"
                            }}
                        >
                            <div>
                                <strong>{highlight(v.placa, placa)}</strong> - {highlight(v.modelo, placa)}
                            </div>

                            <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                {highlight(v.clienteNome, termoBusca)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default BuscaPlaca;