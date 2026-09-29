import { useQuery } from "@apollo/client/react";
import { GET_FEATURED_OFFERS } from "../graphql/queries";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Home() {
  const { loading, error, data } = useQuery(GET_FEATURED_OFFERS);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const ofertas = data?.getFeaturedOffers || [];

  return (
    <div className="page">
      <h1>UniGames</h1>
      <p>Compare preços, acompanhe ofertas e revenda jogos tudo em um só lugar.</p>

      <h2>Ofertas em destaque</h2>

      {ofertas.length === 0 && <p>Nenhuma oferta cadastrada ainda.</p>}

      <div className="ofertas-grid">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="oferta-card">
            {oferta.jogo?.imagemCapa && (
              <img src={oferta.jogo.imagemCapa} alt={oferta.jogo.titulo} />
            )}
            <h3>{oferta.jogo?.titulo}</h3>
            <p>{oferta.loja}</p>
            <p>
              <strong>R$ {oferta.preco.toFixed(2)}</strong>
              {oferta.descontoPercentual > 0 && (
                <span> (-{oferta.descontoPercentual}%)</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;