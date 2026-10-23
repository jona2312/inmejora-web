import React, { useEffect, useRef, useState } from 'react';
import { createProjectCoreClient, localCoreEnabled } from '@/lib/projectCoreClient';

const RenderGallerySection = ({client:providedClient, context:providedContext}) => {
  const fallback = useRef(null);
  if(!fallback.current) fallback.current=createProjectCoreClient();
  const client=providedClient ?? fallback.current;
  const [data,setData]=useState(null);
  const [context,setContext]=useState(null);
  const [failure,setFailure]=useState('');
  const [loading,setLoading]=useState(true);
  const [refresh,setRefresh]=useState(0);
  const [results,setResults]=useState(null);
  const [feedback,setFeedback]=useState(null);
  const [resultFailure,setResultFailure]=useState('');
  const [saving,setSaving]=useState(false);
  const requestEpoch=useRef(0);
  const enabled=localCoreEnabled();
  useEffect(()=>{
    let active=true;
    requestEpoch.current++;
    setSaving(false);
    setData(null);setContext(null);setFailure('');setLoading(true);
    setResults(null);setFeedback(null);setResultFailure('');
    if(!enabled){setLoading(false);return ()=>{active=false;};}
    (async()=>{
      const current=providedContext ?? await client.initialize();
      if(!current) return;
      const result=await client.gallery(current);
      if(active){setContext(current);setData(result);}
      if(result.render_results_enabled) try {
        const [renders,selection]=await Promise.all([client.renderResults(current),client.renderFeedback(current)]);
        if(active){setResults(renders);setFeedback(selection);}
      } catch {if(active)setResultFailure('Resultados no disponibles. No se pudo verificar su estado o acceso.');}
    })().catch(()=>{if(active)setFailure('Galería no disponible. No se pudo verificar el acceso o la persistencia de las fotos.');})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[client,providedContext,enabled,refresh]);
  const visible=data && (!providedContext || data.project_id===providedContext.project_id) && !failure;
  async function record(artifact_id,action) {
    const epoch=requestEpoch.current;
    setSaving(true);setResultFailure('');
    try {const next=await client.feedback(context,{artifact_id,action,expected_revision:feedback.revision});if(epoch===requestEpoch.current)setFeedback(next);}
    catch {if(epoch===requestEpoch.current)setResultFailure('No se pudo confirmar tu elección. Actualizá y verificá el estado antes de continuar.');}
    finally {if(epoch===requestEpoch.current)setSaving(false);}
  }
  return <section aria-label="Galería privada del proyecto" className="rounded-xl border border-gray-700 p-6 space-y-4">
    <h2 className="text-xl font-bold">Galería privada del proyecto</h2>
    <p>Fotografías originales guardadas. La generación de renders todavía no está habilitada.</p>
    {!enabled ? <p role="status">Galería no disponible fuera del ensayo local autorizado.</p> : loading ? <p role="status">Cargando fotos privadas…</p> : failure ? <p role="alert">{failure}</p> : !context ? <p>Primero completá tu consulta para abrir el proyecto autorizado.</p> : visible && <>
      <p className="break-all text-sm">Proyecto: {data.project_id}</p>
      {data.photos.length===0 ? <p>Este proyecto todavía no tiene fotos Web guardadas.</p> : <div className="grid grid-cols-2 gap-3">
        {data.photos.map((photo,index)=><figure key={photo.id} className="space-y-1">
          <img src={client.galleryPhotoPath(context,photo.id)} alt={`Foto privada ${index+1}`} referrerPolicy="no-referrer"
            className="w-full rounded-lg border border-gray-700" onError={()=>{setFailure('Foto no disponible. Actualizá para volver a verificar el acceso.');setData(null);}} />
          <figcaption>Original {index+1} · {new Date(photo.created_at).toLocaleDateString('es-AR')}</figcaption>
        </figure>)}
      </div>}
      {data.render_results_enabled && <><h3 className="text-lg font-bold">Resultados del ensayo</h3>
      <p>La elección queda registrada para revisión humana. Pedir un ajuste no inicia otra generación ni realiza un cobro.</p>
      {resultFailure && <p role="alert">{resultFailure}</p>}
      {results && results.project_id===context.project_id && !resultFailure && <>
        {results.jobs.length===0 && <p>No hay trabajos de render registrados.</p>}
        {results.jobs.filter(job=>job.state!=='succeeded').map(job=><p key={job.attempt_id} role="status">
          {job.state==='pending'?'Render pendiente.':job.state==='uncertain'?'Resultado incierto: requiere conciliación; no se reintentará automáticamente.':'Render fallido. No hay imagen para elegir.'}
        </p>)}
        <div className="grid grid-cols-2 gap-3">{results.results.map((result,index)=><figure key={result.id} className="space-y-2">
          <img src={client.renderResultPath(context,result.id)} alt={`Resultado privado ${index+1}`} referrerPolicy="no-referrer"
            className="w-full rounded-lg border border-gray-700" onError={()=>{setResults(null);setResultFailure('Resultado no disponible. Actualizá para verificar su integridad y acceso.');}} />
          <figcaption>Resultado {index+1}{feedback?.feedback?.artifact_id===result.id ? feedback.feedback.action==='select'?' · Elegido para revisión humana':' · Ajuste solicitado':''}</figcaption>
          <button type="button" disabled={saving || !feedback?.can_feedback} onClick={()=>record(result.id,'select')} className="rounded border px-3 py-2">Elegir para revisión</button>
          <button type="button" disabled={saving || !feedback?.can_feedback} onClick={()=>record(result.id,'adjust')} className="rounded border px-3 py-2">Pedir ajuste</button>
        </figure>)}</div>
      </>}</>}
    </>}
    {enabled && <button type="button" disabled={loading || saving} onClick={()=>setRefresh(n=>n+1)} className="rounded-lg border border-gray-500 px-4 py-2">Actualizar galería</button>}
  </section>;
};
export default RenderGallerySection;
