import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { LOGIN } from "../graphql/mutations";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    try {
      const { data } = await login({ variables: { input: { email, senha } } });
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("usuario", JSON.stringify(data.login.usuario));
      navigate("/perfil");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="page">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Entrar</h2>
        {erro && <p className="error">{erro}</p>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <button type="submit" className="button save" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </form>
    </div>
  );
}

export default Login;