import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {

    const { isAuthenticated, perfil } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(perfil)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default ProtectedRoute;