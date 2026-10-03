import { idOf, parseDate } from '../models/entities';
export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
export const shortDate = value => parseDate(value)?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) || '—';
export const fullDate = value => parseDate(value)?.toLocaleDateString('pt-BR') || '—';
export const bestOffer = (game, offers = []) => offers.filter(o => idOf(o.jogo) === idOf(game)).sort((a, b) => a.preco - b.preco)[0];
export function safeUrl(value) { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; } }
export function downloadCsv(name, headers, rows) {
  const cell = value => '"' + String(value ?? '').replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"';
  const blob = new Blob(['\uFEFF' + [headers, ...rows].map(row => row.map(cell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
