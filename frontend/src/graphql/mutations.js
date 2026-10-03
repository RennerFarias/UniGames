import { gql } from '@apollo/client';
import { USER_FIELDS, GAME_FIELDS, LISTING_FIELDS, REVIEW_FIELDS, OFFER_FIELDS } from './queries';
export const LOGIN = gql`mutation Login($input: LoginInput!) { login(input: $input) { token usuario { ...UserFields } } } ${USER_FIELDS}`;
export const REGISTER = gql`mutation Register($input: RegisterInput!) { register(input: $input) { token usuario { ...UserFields } } } ${USER_FIELDS}`;
export const UPDATE_PROFILE = gql`mutation UpdateProfile($input: UpdateUserInput!) { updateProfile(input: $input) { ...UserFields } } ${USER_FIELDS}`;

export const TORNAR_REVENDEDOR = gql`
  mutation TornarRevendedor($dataNascimento: String) {
    tornarRevendedor(dataNascimento: $dataNascimento) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const CREATE_LISTING = gql`mutation CreateListing($input: CreateListingInput!) { createListing(input: $input) { ...ListingFields } } ${LISTING_FIELDS}`;
export const UPDATE_LISTING = gql`mutation UpdateListing($id: ID!, $input: UpdateListingInput!) { updateListing(id: $id, input: $input) { ...ListingFields } } ${LISTING_FIELDS}`;
export const DELETE_LISTING = gql`mutation DeleteListing($id: ID!) { deleteListing(id: $id) }`;
export const CREATE_REVIEW = gql`mutation CreateReview($input: CreateReviewInput!) { createReview(input: $input) { ...ReviewFields } } ${REVIEW_FIELDS}`;
export const CREATE_GAME = gql`mutation CreateGame($input: CreateGameInput!) { createGame(input: $input) { ...GameFields } } ${GAME_FIELDS}`;
export const UPDATE_GAME = gql`mutation UpdateGame($id: ID!, $input: UpdateGameInput!) { updateGame(id: $id, input: $input) { ...GameFields } } ${GAME_FIELDS}`;
export const DELETE_GAME = gql`mutation DeleteGame($id: ID!) { deleteGame(id: $id) }`;
export const CREATE_OFFER = gql`mutation CreateOffer($input: CreatePriceOfferInput!) { createPriceOffer(input: $input) { ...OfferFields } } ${OFFER_FIELDS}`;
export const UPDATE_OFFER = gql`mutation UpdateOffer($id: ID!, $input: UpdatePriceOfferInput!) { updatePriceOffer(id: $id, input: $input) { ...OfferFields } } ${OFFER_FIELDS}`;

export const DELETE_USER = gql`mutation DeleteUser($id: ID!) { deleteUser(id: $id) }`;