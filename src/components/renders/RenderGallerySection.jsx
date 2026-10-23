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
  const enabled=localCoreEnabled();
  useEffect(()=>{
    let active=true;
    setData(null);setContext(null);setFailure('');setLoading(true);
    if(!enabled){setLoading(false);return ()=>{active=false;};}
    (async()=>{
      const current=providedContext ?? await client.initialize();
      if(!current) return;
      const result=await client.gallery(current);
      if(active){setContext(current);setData(result);}
    })().catch(()=>{if(active)setFailure('Galería no disponible. No se pudo verificar el acceso o la persistencia de las fotos.');})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[client,providedContext,enabled,refresh]);
  const visible=data && (!providedContext || data.project_id===providedContext.project_id) && !failure;
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
    </>}
    {enabled && <button type="button" disabled={loading} onClick={()=>setRefresh(n=>n+1)} className="rounded-lg border border-gray-500 px-4 py-2">Actualizar galería</button>}
  </section>;
};
export default RenderGallerySection;
