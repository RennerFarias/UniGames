import { gql } from '@apollo/client';
export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    nome
    email
    perfil
    foto
    dataNascimento
    revendedor
    createdAt
    updatedAt
  }
`;
export const PUBLIC_USER_FIELDS = gql`
  fragment PublicUserFields on PublicUser {
    id
    nome
    perfil
    foto
    revendedor
    createdAt
    updatedAt
  }
`;
export const SAVED_REPORT_FIELDS = gql`
  fragment SavedReportFields on Report {
    id
    tipo
    dados
    descricao
    createdAt
    updatedAt
  }
`;
export const GAME_FIELDS = gql`
  fragment GameFields on Game {
    id
    titulo
    descricao
    generos
    plataformas
    imagemCapa
    linksReferencia
    createdAt
    updatedAt
  }
`;
export const OFFER_FIELDS = gql`
  fragment OfferFields on PriceOffer {
    id
    loja
    preco
    precoOriginal
    descontoPercentual
    urlLoja
    historicoPrecos {
      preco
      data
    }
    updatedAt
    jogo {
      ...GameFields
    }
  }
  ${GAME_FIELDS}
`;
export const LISTING_FIELDS = gql`
  fragment ListingFields on Listing {
    id
    preco
    estadoConservacao
    plataforma
    contato {
      nome
      info
    }
    descricao
    status
    vendidoEm
    createdAt
    updatedAt
    vendedor {
      ...PublicUserFields
    }
    jogo {
      ...GameFields
    }
  }
  ${GAME_FIELDS}
  ${PUBLIC_USER_FIELDS}
`;
export const REVIEW_FIELDS = gql`
  fragment ReviewFields on Review {
    id
    nota
    comentario
    createdAt
    updatedAt
    avaliador {
      ...PublicUserFields
    }
    avaliadoUser {
      ...PublicUserFields
    }
    jogo {
      ...GameFields
    }
  }
  ${PUBLIC_USER_FIELDS}
  ${GAME_FIELDS}
`;
export const GET_CATALOG = gql`
  query Catalog {
    getGames {
      ...GameFields
    }
    getPriceOffers {
      ...OfferFields
    }
  }
  ${GAME_FIELDS}
  ${OFFER_FIELDS}
`;
export const GET_GAME = gql`
  query GameDetail($id: ID!) {
    getGame(id: $id) {
      ...GameFields
    }
    getPriceHistory(jogoId: $id) {
      ...OfferFields
    }
    getReviews(jogoId: $id) {
      ...ReviewFields
    }
  }
  ${GAME_FIELDS}
  ${OFFER_FIELDS}
  ${REVIEW_FIELDS}
`;
export const GET_GAMES = gql`
  query GetGames($search: String) {
    getGames(search: $search) {
      ...GameFields
    }
  }
  ${GAME_FIELDS}
`;
export const GET_FEATURED_OFFERS = gql`
  query GetFeaturedOffers {
    getFeaturedOffers {
      ...OfferFields
    }
  }
  ${OFFER_FIELDS}
`;
export const GET_LISTINGS = gql`
  query Listings {
    getListings {
      ...ListingFields
    }
  }
  ${LISTING_FIELDS}
`;
export const GET_LISTING = gql`
  query ListingDetail($id: ID!) {
    getListing(id: $id) {
      ...ListingFields
    }
  }
  ${LISTING_FIELDS}
`;
export const GET_MY_LISTINGS = gql`
  query MyListings {
    getMyListings {
      ...ListingFields
    }
  }
  ${LISTING_FIELDS}
`;
export const ME = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;
export const GET_REPORT = gql`
  query MyReport {
    getMyReport {
      anunciosAtivos
      anunciosVendidos
      valorVendas
      totalAnuncios
      porPlataforma {
        plataforma
        quantidade
      }
    }
  }
`;
export const GET_USERS = gql`
  query Users {
    getUsers {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const GET_PUBLIC_USER = gql`
  query PublicUser($id: ID!) {
    getUser(id: $id) {
      ...PublicUserFields
    }
  }
  ${PUBLIC_USER_FIELDS}
`;
export const GET_REVIEWS = gql`
  query Reviews($jogoId: ID, $usuarioId: ID) {
    getReviews(jogoId: $jogoId, usuarioId: $usuarioId) {
      ...ReviewFields
    }
  }
  ${REVIEW_FIELDS}
`;
export const GET_SAVED_REPORTS = gql`
  query SavedReports($tipo: ReportType) {
    getReports(tipo: $tipo) {
      ...SavedReportFields
    }
  }
  ${SAVED_REPORT_FIELDS}
`;
export const GET_SAVED_REPORT = gql`
  query SavedReport($id: ID!) {
    getReport(id: $id) {
      ...SavedReportFields
    }
  }
  ${SAVED_REPORT_FIELDS}
`;
