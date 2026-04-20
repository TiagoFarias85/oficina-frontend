//const API_BASE_URL = 'http://localhost:5175/api';

//async function handleResponse(response) {
//    if (!response.ok) {
//        const error = await response.json().catch(() => ({}));
//        throw new Error(error.message || 'Erro ao acessar API');
//    }
//    return response.json();
//}

//export async function apiGet(endpoint) {
//    const response = await fetch(`${API_BASE_URL}${endpoint}`);
//    return handleResponse(response);
//}

//export async function apiPost(endpoint, body) {
//    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(body)
//    });

//    return handleResponse(response);
//}

const API_URL = "http://localhost:5175/api";

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

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao acessar API");
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
}

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