import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h2>UniGames</h2>
                <div className="navbar-links">
                    <Link to="/">Início</Link>
                    <Link to="/revenda">Revenda</Link>
                    <Link to="/suporte">Suporte</Link>
                    <Link to="/sobre-nos">Sobre Nós</Link>
                    <Link to="/configuracoes">Configurações</Link>
                    <Link to="/perfil">Perfil</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;