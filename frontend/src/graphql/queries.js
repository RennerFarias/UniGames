import { gql } from "@apollo/client";

export const GET_GAMES = gql`
  query GetGames($search: String) {
    getGames(search: $search) {
      id
      titulo
      descricao
      generos
      plataformas
      imagemCapa
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    getGame(id: $id) {
      id
      titulo
      descricao
      generos
      plataformas
      imagemCapa
      linksReferencia
    }
  }
`;

export const GET_FEATURED_OFFERS = gql`
  query GetFeaturedOffers {
    getFeaturedOffers {
      id
      preco
      precoOriginal
      descontoPercentual
      loja
      jogo {
        id
        titulo
        imagemCapa
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      nome
      email
      perfil
    }
  }
`;