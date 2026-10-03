import { useState } from 'react';
import { parseDate } from '../models/entities';
import { money, shortDate } from '../utils/format';
const COLORS = ['#5b9bff', '#62d9c3', '#cba5ff', '#ffb569', '#ff91ab'];
export default function PriceChart({ offers = [] }) {
  const [active, setActive] = useState(null);
  const lines = offers.map((offer, index) => ({ ...offer, color: COLORS[index % COLORS.length], points: offer.historicoPrecos.filter(p => parseDate(p.data) && Number.isFinite(p.preco)).sort((a, b) => parseDate(a.data) - parseDate(b.data)) })).filter(o => o.points.length);
  const points = lines.flatMap(l => l.points);
  if (!points.length) return <div className="empty-chart">O histórico aparecerá quando uma oferta tiver preços registrados.</div>;
  const dates = [...new Set(points.map(p => parseDate(p.data).getTime()))].sort((a, b) => a - b);
  const max = Math.max(...points.map(p => p.preco), 1) * 1.15; const minTime = dates[0]; const timeRange = dates.at(-1) - minTime || 1;
  const x = p => 70 + (parseDate(p.data).getTime() - minTime) / timeRange * 680;
  const y = p => 245 - p.preco / max * 205;
  return <><div className="chart-legend">{lines.map(l => <span key={l.id}><i style={{ background: l.color }}/>{l.loja}</span>)}</div><div className="price-chart"><svg viewBox="0 0 790 290" role="img" aria-label="Histórico de preços por loja. Os pontos podem ser selecionados para consultar o valor.">
    {[0, 1, 2, 3].map(n => <g key={n}><line x1="70" x2="750" y1={245 - n * 65} y2={245 - n * 65} stroke="#223048" strokeDasharray="4 5"/><text x="58" y={250 - n * 65} textAnchor="end">{money(max * n * 65 / 205)}</text></g>)}
    {lines.map(l => <g key={l.id}><polyline points={l.points.map(p => `${x(p)},${y(p)}`).join(' ')} fill="none" stroke={l.color} strokeWidth="2.5"/>{l.points.map((p, i) => <circle key={i} cx={x(p)} cy={y(p)} r="5" fill={l.color} stroke="#101b2c" strokeWidth="2" role="button" tabIndex="0" aria-label={`${l.loja}, ${shortDate(p.data)}, ${money(p.preco)}`} onMouseEnter={() => setActive({ ...p, loja: l.loja })} onFocus={() => setActive({ ...p, loja: l.loja })} onClick={() => setActive({ ...p, loja: l.loja })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActive({ ...p, loja: l.loja }); }}><title>{l.loja}: {money(p.preco)}</title></circle>)}</g>)}
    {dates.filter((_, i) => i === 0 || i === dates.length - 1 || i % Math.max(1, Math.ceil(dates.length / 5)) === 0).map(date => <text key={date} x={70 + (date - minTime) / timeRange * 680} y="277" textAnchor="middle">{shortDate(date)}</text>)}
  </svg></div><div className="chart-readout" aria-live="polite">{active ? `${active.loja} · ${shortDate(active.data)} · ${money(active.preco)}` : 'Selecione um ponto para consultar o preço.'}</div></>;
}
