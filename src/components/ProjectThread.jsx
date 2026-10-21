import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ProjectThread({client, context, onRefresh}) {
  const {project_id,conversation_id}=context;
  const [thread,setThread]=useState(null), [error,setError]=useState(''), [status,setStatus]=useState('');
  const [content,setContent]=useState(''), [pending,setPending]=useState(false), [busy,setBusy]=useState(false);
  const lock=useRef(false), version=useRef(0);
  useEffect(()=>{
    let active=true;
    const current=++version.current;
    client.thread({project_id,conversation_id}).then(value=>{if(active && current===version.current)setThread(value);})
      .catch(()=>{if(active && current===version.current)setError('No se pudo cargar la conversación.');});
    return ()=>{active=false;};
  },[client,project_id,conversation_id]);
  async function refresh() {
    if(lock.current)return;
    lock.current=true;setBusy(true);const current=++version.current;
    try {const value=await client.thread(context);await onRefresh();if(current===version.current){setThread(value);setError('');}}
    catch {setError('No se pudo actualizar. La conversación no está confirmada como actualizada.');}
    finally {lock.current=false;setBusy(false);}
  }
  async function send(event) {
    event.preventDefault();if(lock.current)return;
    lock.current=true;version.current++;setBusy(true);setPending(true);setError('');setStatus('');
    try {setThread(await client.message(context,content));setContent('');setPending(false);setStatus('Mensaje guardado.');}
    catch(error){if(error.status===422)setPending(false);setError('No se confirmó el mensaje. Reintentá el mismo envío sin duplicarlo.');}
    finally{lock.current=false;setBusy(false);}
  }
  return <section aria-label="Tu conversación" className="space-y-4 border-t border-gray-700 pt-4">
    <h2 className="text-xl">Tu conversación</h2>
    {thread && <p>Modo: <span data-testid="thread-mode">{thread.mode}</span></p>}
    <Button type="button" disabled={busy} onClick={refresh}>Actualizar conversación</Button>
    {error && <p role="alert" className="text-red-300">{error}</p>}
    <ol aria-label="Timeline pública" className="space-y-3">
      {thread?.events.map(event=><li key={event.id} className="whitespace-pre-wrap break-words">
        <p>{event.content}</p><small>{event.created_at}</small>
      </li>)}
    </ol>
    {status && <p role="status">{status}</p>}
    {thread?.can_message ? <form aria-label="Enviar al operador" onSubmit={send} className="space-y-3">
      <label htmlFor="thread-message">Mensaje al operador</label>
      <Textarea id="thread-message" value={content} onChange={e=>setContent(e.target.value)} readOnly={busy||pending} required maxLength={2000} className="bg-gray-900 border-gray-700" />
      <Button disabled={busy} type="submit">{pending?'Reintentar mensaje':'Enviar al operador'}</Button>
    </form> : thread && <p>Este hilo es de sólo lectura.</p>}
  </section>;
}
