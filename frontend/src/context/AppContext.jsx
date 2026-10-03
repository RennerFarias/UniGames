import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import client from '../services/apollo';
import { config, readSession, writeSession } from '../services/config';
import { AppContext } from './useApp';
const stored = key => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readSession()?.usuario || null);
  const [authReady, setAuthReady] = useState(!readSession()?.token);
  const [version, setVersion] = useState(0);
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Set());
  const wishlistKey = `unigames.wishlist.${config.source}.${user?.id || 'guest'}`;
  const [wishlists, setWishlists] = useState(() => ({ [wishlistKey]: stored(wishlistKey) }));
  const wishlist = wishlists[wishlistKey] || stored(wishlistKey);
  const refresh = useCallback(() => setVersion(v => v + 1), []);
  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID(); setToasts(t => [...t, { id, message, type }]);
    const timer = setTimeout(() => { setToasts(t => t.filter(x => x.id !== id)); timers.current.delete(timer); }, 4500);
    timers.current.add(timer);
  }, []);
  const logout = useCallback(() => { writeSession(null); setUser(null); client.clearStore(); refresh(); }, [refresh]);
  useEffect(() => {
    let live = true;
    if (readSession()?.token) api.me().then(u => { if (live) { setUser(u); writeSession({ ...readSession(), usuario: u }); } }).catch(() => { if (live) logout(); }).finally(() => { if (live) setAuthReady(true); });
    return () => { live = false; };
  }, [logout]);
  useEffect(() => {
    const handler = () => { logout(); notify('Sua sessão expirou. Entre novamente para continuar.', 'error'); };
    window.addEventListener('unigames:unauthorized', handler);
    return () => window.removeEventListener('unigames:unauthorized', handler);
  }, [logout, notify]);
  useEffect(() => { const active = timers.current; return () => active.forEach(clearTimeout); }, []);
  const authenticate = async (kind, input) => { const session = await api[kind](input); writeSession(session); setUser(session.usuario); setAuthReady(true); await client.clearStore(); refresh(); };
  const updateUser = u => { setUser(u); writeSession({ ...readSession(), usuario: u }); refresh(); };
  const toggleWishlist = id => { setWishlists(lists => { const current = lists[wishlistKey] || stored(wishlistKey); const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]; localStorage.setItem(wishlistKey, JSON.stringify(next)); return { ...lists, [wishlistKey]: next }; }); };
  return <AppContext.Provider value={{ api, user, authReady, authenticate, logout, updateUser, version, refresh, notify, wishlist, toggleWishlist }}>
    {children}<div className="toast-stack" aria-live="polite">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}><span>{t.type === 'error' ? '!' : '✓'}</span>{t.message}</div>)}</div>
  </AppContext.Provider>;
}
