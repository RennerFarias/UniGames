import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import useResource from '../hooks/useResource';
import PageTitle from '../components/PageTitle';
import PriceChart from '../components/PriceChart';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import { idOf, parseDate } from '../models/entities';
import { money, fullDate, downloadCsv } from '../utils/format';
export default function Historico() {
  const { api } = useApp(); const [params, setParams] = useSearchParams(); const { data, loading, error, reload } = useResource('catalog', () => api.catalog());
  if (loading) return <Loading/>; if (error) return <ErrorMessage message={error} onRetry={reload}/>; if (!data.games.length) return <EmptyState title="Nenhum jogo cadastrado"/>;
  const selected = data.games.find(g => g.id === params.get('jogo')) || data.games[0]; const offers = data.offers.filter(o => idOf(o.jogo) === selected.id); const rows = offers.flatMap(o => o.historicoPrecos.map(p => ({ loja: o.loja, ...p }))).sort((a, b) => (parseDate(b.data) || 0) - (parseDate(a.data) || 0)); const values = rows.map(r => r.preco);
  return <><PageTitle eyebrow="ESCOLHA O MELHOR MOMENTO" title="Histórico de preços" text="Veja como os preços mudaram e compare o valor de cada loja."/><div className="history-toolbar"><label>Qual jogo você quer acompanhar?<select value={selected.id} onChange={e => setParams({ jogo: e.target.value })}>{data.games.map(g => <option key={g.id} value={g.id}>{g.titulo}</option>)}</select></label><Link className="btn secondary" to={`/jogo/${selected.id}`}>Ver o jogo <Icon name="arrow" size={16}/></Link></div><div className="metrics-row"><div className="metric"><Icon name="tag"/><span>Menor preço registrado</span><strong>{values.length ? money(Math.min(...values)) : '—'}</strong></div><div className="metric"><Icon name="store"/><span>Lojas acompanhadas</span><strong>{offers.length}</strong></div><div className="metric"><Icon name="clock"/><span>Registros de preço</span><strong>{rows.length}</strong></div></div><section className="panel"><div className="panel-heading"><h2>{selected.titulo}</h2><span>Valores em reais (BRL)</span></div><PriceChart offers={offers}/></section><section className="panel section"><div className="panel-heading"><h2>Todos os registros</h2><button className="btn secondary small" disabled={!rows.length} onClick={() => downloadCsv('historico-precos.csv', ['Jogo', 'Loja', 'Data', 'Preço (BRL)'], rows.map(r => [selected.titulo, r.loja, fullDate(r.data), r.preco.toFixed(2).replace('.', ',')]))}><Icon name="download" size={16}/>Exportar CSV</button></div><div className="table-wrap"><table><thead><tr><th>Data</th><th>Loja</th><th>Preço</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}><td>{fullDate(r.data)}</td><td>{r.loja}</td><td className="table-price">{money(r.preco)}</td></tr>)}</tbody></table>{!rows.length && <p className="small-note">Não há registros de preço para este jogo.</p>}</div></section></>;
}
