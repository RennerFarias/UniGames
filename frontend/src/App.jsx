import { Component } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import EmptyState from './components/EmptyState';
import Home from './pages/Home';
import Explorar from './pages/Explorar';
import Auth from './pages/Auth';
import Jogo from './pages/Jogo';
import Historico from './pages/Historico';
import Revenda from './pages/Revenda';
import Anuncio from './pages/Anuncio';
import FormAnuncio from './pages/FormAnuncio';
import MeusAnuncios from './pages/MeusAnuncios';
import Perfil from './pages/Perfil';
import Relatorios from './pages/Relatorios';
import Admin from './pages/Admin';
import Configuracoes from './pages/Configuracoes';
import SobreNos from './pages/SobreNos';
import Suporte from './pages/Suporte';
class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="container">
        <EmptyState
          icon="info"
          title="Algo não carregou como esperado"
          text="Recarregue a página para tentar novamente."
        >
          <button className="btn primary" onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </EmptyState>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explorar" element={<Explorar />} />
              <Route path="favoritos" element={<Explorar favorites />} />
              <Route path="entrar" element={<Auth />} />
              <Route path="cadastro" element={<Auth register />} />
              <Route path="jogo/:id" element={<Jogo />} />
              <Route path="historico" element={<Historico />} />
              <Route path="revenda" element={<Revenda />} />
              <Route path="revenda/:id" element={<Anuncio />} />
              <Route path="suporte" element={<Suporte />} />
              <Route path="sobre-nos" element={<SobreNos />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route element={<ProtectedRoute />}>
                <Route path="perfil" element={<Perfil />} />
                <Route path="meus-anuncios" element={<MeusAnuncios />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="revenda/novo" element={<FormAnuncio />} />
                <Route path="revenda/:id/editar" element={<FormAnuncio />} />
              </Route>
              <Route element={<ProtectedRoute admin />}>
                <Route path="admin" element={<Admin />} />
              </Route>
              <Route
                path="*"
                element={
                  <EmptyState
                    icon="gamepad"
                    title="Essa fase não existe"
                    text="A página que você procurou não foi encontrada."
                  >
                    <Link to="/" className="btn primary">
                      Voltar para descobrir
                    </Link>
                  </EmptyState>
                }
              />
            </Route>
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
