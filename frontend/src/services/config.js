export const config = { source: import.meta.env.VITE_DATA_SOURCE || 'demo', graphqlUrl: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql', apiUrl: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '') };
if (!['demo', 'graphql', 'rest'].includes(config.source)) throw new Error('VITE_DATA_SOURCE deve ser demo, graphql ou rest.');
export const SESSION_KEY = `unigames.session.${config.source}`;
export function readSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null; } catch { return null; } }
export function writeSession(value) { if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value)); else sessionStorage.removeItem(SESSION_KEY); }
export function token() { return readSession()?.token || ''; }
export function authExpired() { window.dispatchEvent(new Event('unigames:unauthorized')); }
