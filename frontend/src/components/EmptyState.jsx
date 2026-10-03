import Icon from './Icon';
export default function EmptyState({ icon = 'search', title = 'Nada por aqui ainda', text, children }) { return <div className="empty-state"><Icon name={icon} size={36}/><h2>{title}</h2>{text && <p>{text}</p>}{children}</div>; }
