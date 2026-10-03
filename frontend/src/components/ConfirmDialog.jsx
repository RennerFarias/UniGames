import { useEffect, useRef } from 'react';
export default function ConfirmDialog({ open, title, text, onCancel, onConfirm, busy = false, label = 'Excluir' }) {
  const ref = useRef(null);
  useEffect(() => { if (open && !ref.current.open) ref.current.showModal(); if (!open && ref.current.open) ref.current.close(); }, [open]);
  return <dialog className="confirm-dialog" ref={ref} onCancel={e => { e.preventDefault(); if (!busy) onCancel(); }} aria-labelledby="confirm-title"><h2 id="confirm-title">{title}</h2><p>{text}</p><div className="dialog-actions"><button className="btn secondary" disabled={busy} onClick={onCancel} autoFocus>Cancelar</button><button className="btn danger" disabled={busy} onClick={onConfirm}>{busy ? 'Aguarde…' : label}</button></div></dialog>;
}
