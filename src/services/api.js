const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
    return localStorage.getItem("token");
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401 && endpoint !== "/auth/login") {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
    }

    if (!response.ok) {
        const errorText = await response.text();

        const error = new Error(errorText || "Erro ao acessar API");
        error.status = response.status;
        error.response = {
            status: response.status,
            data: errorText
        };

        throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// 👇 FUNÇÕES PADRÃO

export function apiGet(endpoint) {
    return apiRequest(endpoint);
}

export function apiPost(endpoint, body) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
    });
}

export function apiPut(endpoint, body) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export function apiDelete(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE"
    });
}

export function apiPatch(endpoint, body) {
    return apiRequest(endpoint, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined
    });
}

// antes
//const API_URL = "http://localhost:5175/api";

//function getToken() {
//    return localStorage.getItem("token");
//}

//async function apiRequest(endpoint, options = {}) {
//    const token = getToken();

//    const headers = {
//        "Content-Type": "application/json",
//        ...(token && { Authorization: `Bearer ${token}` })
//    };

//    const response = await fetch(`${API_URL}${endpoint}`, {
//        ...options,
//        headers
//    });

//    // Se for 401 em qualquer rota EXCETO login, aí sim trata como sessão inválida
//    if (response.status === 401 && endpoint !== "/auth/login") {
//        localStorage.removeItem("token");
//        window.location.href = "/login";
//        return;
//    }

//    if (!response.ok) {
//        const errorText = await response.text();

//        const error = new Error(errorText || "Erro ao acessar API");
//        error.status = response.status;
//        error.response = {
//            status: response.status,
//            data: errorText
//        };

//        throw error;
//    }

//    const text = await response.text();

//    return text ? JSON.parse(text) : null;
//}

//export function apiGet(endpoint) {
//    return apiRequest(endpoint);
//}

//export function apiPost(endpoint, body) {
//    return apiRequest(endpoint, {
//        method: "POST",
//        body: JSON.stringify(body)
//    });
//}

//export function apiPut(endpoint, body) {
//    return apiRequest(endpoint, {
//        method: "PUT",
//        body: JSON.stringify(body)
//    });
//}

//export function apiDelete(endpoint) {
//    return apiRequest(endpoint, {
//        method: "DELETE"
//    });
//}

//export function apiPatch(endpoint, body) {
//    return apiRequest(endpoint, {
//        method: "PATCH",
//        body: body ? JSON.stringify(body) : undefined
//    });
//}