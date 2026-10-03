import { useEffect, useEffectEvent, useState } from 'react';
import { useApp } from '../context/useApp';
export default function useResource(key, loader) {
  const { version } = useApp(); const [retry, setRetry] = useState(0);
  const stamp = `${key}:${version}:${retry}`;
  const load = useEffectEvent(loader);
  const [state, setState] = useState({ stamp: null, data: null, error: null });
  useEffect(() => {
    let live = true;
    Promise.resolve().then(() => load()).then(data => { if (live) setState({ stamp, data, error: null }); }).catch(error => { if (live) setState({ stamp, data: null, error: error.message || 'Não foi possível carregar os dados.' }); });
    return () => { live = false; };
  }, [stamp]);
  return { data: state.stamp === stamp ? state.data : null, loading: state.stamp !== stamp, error: state.stamp === stamp ? state.error : null, reload: () => setRetry(x => x + 1) };
}
