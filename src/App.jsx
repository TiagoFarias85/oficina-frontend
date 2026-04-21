import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import OrdensServicoList from './pages/OrdensServicoList'
import ClientesList from './pages/ClientesList'
import ClienteForm from "./pages/ClienteForm";
import NovaOrdemServico from './pages/NovaOrdemServico';
import OrdemServicoDetalhe from './pages/OrdemServicoDetalhe';
import VeiculoForm from './pages/VeiculoForm';
import VeiculosList from './pages/VeiculosList';
import Usuarios from "./pages/usuarios/Usuarios";
import NovoUsuario from "./pages/usuarios/NovoUsuario";
import EditarUsuario from "./pages/usuarios/EditarUsuario";
import ProtectedRoute from "./components/ProtectedRoute";
import permissions from "./config/permissions";
import { Toaster } from "react-hot-toast";
import OrdensServicoPorVeiculo from "./pages/ordens/OrdensServicoPorVeiculo";
import TrocarSenha from "./pages/TrocarSenha";
import AlterarSenha from "./pages/AlterarSenha";

function App() {

    const { isAuthenticated } = useContext(AuthContext);

    return (
        <BrowserRouter>

            <Toaster position="top-right" />

            <Routes>

                <Route path="/login" element={<Login />} />
                {/*<Route path="/" element={<Dashboard />} />*/}

                <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>

                    <Route index element={<Dashboard />} />

                    <Route path="dashboard" element={<Dashboard />} />

                    {/*<Route path="ordens-servico" element={<OrdensServicoList />} />*/}
                    <Route
                        path="/ordens-servico"
                        element={
                            <ProtectedRoute roles={permissions.ORDENS}>
                                <OrdensServicoList />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="ordens-servico/nova" element={<NovaOrdemServico />} />
                    <Route path="ordens-servico/:id" element={<OrdemServicoDetalhe />} />

                    {/*<Route path="clientes" element={<ClientesList />} />*/}
                    <Route
                        path="/clientes"
                        element={
                            <ProtectedRoute roles={permissions.CLIENTES}>
                                <ClientesList />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="clientes/novo" element={<ClienteForm />} />
                    <Route path="clientes/:id" element={<ClienteForm />} />

                    {/*<Route path="veiculos" element={<VeiculosList />} />*/}
                    <Route
                        path="/veiculos"
                        element={
                            <ProtectedRoute roles={permissions.VEICULOS}>
                                <VeiculosList />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="veiculos/novo" element={<VeiculoForm />} />
                    <Route path="veiculos/:id" element={<VeiculoForm />} />

                    {/*<Route path="/usuarios" element={<Usuarios />} />*/}
                    <Route
                        path="/usuarios"
                        element={
                            <ProtectedRoute roles={permissions.USUARIOS}>
                                <Usuarios />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/usuarios/novo" element={<NovoUsuario />} />
                    <Route path="/usuarios/:id" element={<EditarUsuario />} />

                    <Route path="/veiculos/:id/ordens-servico" element={<OrdensServicoPorVeiculo />} />

                    <Route path="/trocar-senha" element={<TrocarSenha />} />
                    <Route path="/alterar-senha" element={<AlterarSenha />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;