import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jogo from "./pages/Jogo";
import Revenda from "./pages/Revenda";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import SobreNos from "./pages/SobreNos";
import Suporte from "./pages/Suporte";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogo/:id" element={<Jogo />} />
        <Route path="/revenda" element={<Revenda />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/suporte" element={<Suporte />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;