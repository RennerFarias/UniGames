import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { config, token } from './config';
const authLink = new SetContextLink(({ headers }) => ({
  headers: { ...headers, authorization: token() ? `Bearer ${token()}` : '' },
}));
const httpLink = new HttpLink({
  uri: config.graphqlUrl,
  fetch: (uri, options) =>
    fetch(uri, { ...options, signal: options.signal || AbortSignal.timeout(15000) }),
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: 'network-only' } },
});
export default client;
