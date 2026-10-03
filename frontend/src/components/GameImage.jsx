import { useState } from 'react';
import Icon from './Icon';
import { safeUrl } from '../utils/format';
export default function GameImage({ game, className = '', eager = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const src = game?.imagemCapa?.startsWith('/games/') ? game.imagemCapa : safeUrl(game?.imagemCapa);
  if (!src || failedSource === src) return <div className={`image-fallback ${className}`}><Icon name="gamepad" size={40}/><span>{game?.titulo || 'UniGames'}</span></div>;
  return <img className={className} src={src} alt={game?.titulo || 'Capa do jogo'} onError={() => setFailedSource(src)} loading={eager ? 'eager' : 'lazy'}/>;
}
