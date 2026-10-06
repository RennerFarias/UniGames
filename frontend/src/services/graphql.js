import client from './apollo';
import * as Q from '../graphql/queries';
import * as M from '../graphql/mutations';
import { Game, PriceOffer, Listing, User, Review, Report } from '../models/entities';
import { authExpired } from './config';
async function execute(document, variables, mutation = false) {
  try {
    const result = mutation
      ? await client.mutate({ mutation: document, variables })
      : await client.query({ query: document, variables });
    return result.data;
  } catch (error) {
    if (error.errors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) authExpired();
    if (/fetch|network|timeout|aborted/i.test(error.message))
      throw new Error(
        'Não foi possível conectar ao GraphQL. Confira se o backend está rodando e se a URL está correta.',
      );
    throw error;
  }
}
export const graphqlService = {
  async catalog() {
    const d = await execute(Q.GET_CATALOG);
    return {
      games: d.getGames.map((g) => new Game(g)),
      offers: d.getPriceOffers.map((o) => new PriceOffer(o)),
    };
  },
  async game(id) {
    const d = await execute(Q.GET_GAME, { id });
    if (!d.getGame) throw new Error('Jogo não encontrado.');
    return {
      game: new Game(d.getGame),
      offers: d.getPriceHistory.map((o) => new PriceOffer(o)),
      reviews: d.getReviews.map((r) => new Review(r)),
    };
  },
  async listings() {
    return (await execute(Q.GET_LISTINGS)).getListings.map((l) => new Listing(l));
  },
  async listing(id) {
    return new Listing((await execute(Q.GET_LISTING, { id })).getListing);
  },
  async myListings() {
    return (await execute(Q.GET_MY_LISTINGS)).getMyListings.map((l) => new Listing(l));
  },
  async login(input) {
    const d = (await execute(M.LOGIN, { input }, true)).login;
    return { ...d, usuario: new User(d.usuario) };
  },
  async register(input) {
    const d = (await execute(M.REGISTER, { input }, true)).register;
    return { ...d, usuario: new User(d.usuario) };
  },
  async me() {
    return new User((await execute(Q.ME)).me);
  },
  async updateProfile(input) {
    return new User((await execute(M.UPDATE_PROFILE, { input }, true)).updateProfile);
  },
  async tornarRevendedor(dataNascimento) {
    return new User(
      (await execute(M.TORNAR_REVENDEDOR, { dataNascimento }, true)).tornarRevendedor,
    );
  },
  async publicUser(id) {
    return new User((await execute(Q.GET_PUBLIC_USER, { id })).getUser);
  },
  async reviews(filter = {}) {
    return (await execute(Q.GET_REVIEWS, filter)).getReviews.map((row) => new Review(row));
  },
  async updateReview(id, input) {
    return new Review((await execute(M.UPDATE_REVIEW, { id, input }, true)).updateReview);
  },
  async deleteReview(id) {
    return (await execute(M.DELETE_REVIEW, { id }, true)).deleteReview;
  },
  async deleteOffer(id) {
    return (await execute(M.DELETE_OFFER, { id }, true)).deletePriceOffer;
  },
  async savedReports(tipo) {
    return (await execute(Q.GET_SAVED_REPORTS, { tipo })).getReports.map((row) => new Report(row));
  },
  async savedReport(id) {
    return new Report((await execute(Q.GET_SAVED_REPORT, { id })).getReport);
  },
  async generateReport(tipo, descricao) {
    return new Report((await execute(M.GENERATE_REPORT, { tipo, descricao }, true)).generateReport);
  },
  async deleteReport(id) {
    return (await execute(M.DELETE_REPORT, { id }, true)).deleteReport;
  },
  async saveListing(id, input) {
    return new Listing(
      id
        ? (await execute(M.UPDATE_LISTING, { id, input }, true)).updateListing
        : (await execute(M.CREATE_LISTING, { input }, true)).createListing,
    );
  },
  async deleteListing(id) {
    return (await execute(M.DELETE_LISTING, { id }, true)).deleteListing;
  },
  async createReview(input) {
    return new Review((await execute(M.CREATE_REVIEW, { input }, true)).createReview);
  },
  async report() {
    return new Report((await execute(Q.GET_REPORT)).getMyReport);
  },
  async saveGame(id, input) {
    return new Game(
      id
        ? (await execute(M.UPDATE_GAME, { id, input }, true)).updateGame
        : (await execute(M.CREATE_GAME, { input }, true)).createGame,
    );
  },
  async deleteGame(id) {
    return (await execute(M.DELETE_GAME, { id }, true)).deleteGame;
  },
  async saveOffer(id, input) {
    return new PriceOffer(
      id
        ? (await execute(M.UPDATE_OFFER, { id, input }, true)).updatePriceOffer
        : (await execute(M.CREATE_OFFER, { input }, true)).createPriceOffer,
    );
  },
  async deleteUser(id) {
    return (await execute(M.DELETE_USER, { id }, true)).deleteUser;
  },
  async users() {
    return (await execute(Q.GET_USERS)).getUsers.map((u) => new User(u));
  },
};
