export function obterMensagemErro(error, fallback = "Ocorreu um erro") {
    const data = error?.response?.data;

    if (data && typeof data === "object" && data.message) {
        return data.message;
    }

    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            if (parsed?.message) return parsed.message;
        } catch {
            // não era JSON
        }

        if (data.trim()) return data;
    }

    return error?.message || fallback;
}