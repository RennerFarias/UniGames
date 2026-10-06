import Icon from './Icon';
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <Icon name="info" size={28} />
      <h2>Não foi possível carregar</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="btn primary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
