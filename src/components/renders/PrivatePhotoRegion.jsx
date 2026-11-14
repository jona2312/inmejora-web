import React, { useEffect, useId, useRef, useState } from 'react';

const button = 'rounded border border-gray-500 px-3 py-2';
const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
  value => value.toString(16).padStart(2, '0')).join('');

// An oriented photo can be marked and exported locally. Core currently admits
// original PNGs with no EXIF chunk for a persisted source/mask coordinate pair.
function supportsPrivateMask(bytes, mime) {
  if (mime !== 'image/png' || bytes.byteLength < 33) return false;
  const view = new DataView(bytes);
  if (view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a) return false;
  for (let offset=8; offset+12<=view.byteLength;) {
    const length=view.getUint32(offset), kind=view.getUint32(offset+4);
    if (length>view.byteLength-offset-12 || kind===0x65584966) return false;
    if (kind===0x49454e44) return length===0 && offset+12===view.byteLength;
    offset+=length+12;
  }
  return false;
}

function xy(canvas, clientX, clientY) {
  const box = canvas.getBoundingClientRect();
  const x = Math.max(0, Math.min(canvas.width, (clientX - box.left) * canvas.width / box.width));
  const y = Math.max(0, Math.min(canvas.height, (clientY - box.top) * canvas.height / box.height));
  return [Math.round(x), Math.round(y)];
}

function outline(ctx, points) {
  ctx.beginPath();
  for (const [index, [x, y]] of points.entries()) {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

async function createMask(points, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', {willReadFrequently:true});
  ctx.fillStyle = 'black';
  outline(ctx, points);
  ctx.fill();
  const image = ctx.getImageData(0, 0, width, height);
  let editable = 0;
  // Canvas antialiases polygon edges. Quantize coverage to exactly two alpha values.
  for (let i = 3; i < image.data.length; i += 4) {
    const inside = image.data[i] >= 128;
    image.data[i] = inside ? 0 : 255;
    if (inside) editable++;
  }
  if (!editable || editable === width * height) throw new Error('Marcá sólo el objeto o la zona que querés cambiar.');
  ctx.putImageData(image, 0, 0);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('No se pudo preparar la máscara.');
  return {blob, editable};
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PrivatePhotoRegion({projectId, photoId, sourcePath, onSave, onClose}) {
  const [source,setSource] = useState(null);
  const [points,setPoints] = useState([]);
  const [cursor,setCursor] = useState(null);
  const [selection,setSelection] = useState(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const saving = useRef(false);
  const canvas = useRef(null);
  const epoch = useRef(0);
  const description = useId();
  useEffect(() => {
    const controller = new AbortController();
    let bitmap;
    setSource(null); setSelection(null); setPoints([]); setCursor(null); setError(''); setBusy(false);
    async function open() {
      const response = await fetch(sourcePath,{credentials:'same-origin',redirect:'error',cache:'no-store',signal:controller.signal});
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      if (!['image/png','image/jpeg','image/webp'].includes(blob.type)) throw new Error();
      bitmap = await createImageBitmap(blob,{imageOrientation:'from-image'});
      if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 16 * 1024 * 1024) throw new Error();
      const bytes = await blob.arrayBuffer();
      const sha256 = await digest(bytes);
      if (controller.signal.aborted) {bitmap.close(); return;}
      setSource({bitmap,sha256,persistable:supportsPrivateMask(bytes,blob.type),width:bitmap.width,height:bitmap.height});
    }
    open().catch(() => {if (!controller.signal.aborted) setError('No se pudo abrir esta foto privada a su resolución original.');});
    return () => {controller.abort(); epoch.current++; bitmap?.close();};
  }, [projectId,photoId,sourcePath]);

  useEffect(() => {
    if (!source || !canvas.current) return;
    const ctx = canvas.current.getContext('2d');
    ctx.clearRect(0, 0, source.width, source.height);
    ctx.drawImage(source.bitmap, 0, 0);
    const scale = source.width / Math.max(1, canvas.current.clientWidth);
    outline(ctx, points);
    ctx.fillStyle = 'rgba(0,167,210,.34)';
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#004c64';
    ctx.stroke();
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    for (const [x,y] of points) {
      ctx.beginPath(); ctx.arc(x,y,3 * scale,0,2 * Math.PI); ctx.fillStyle='#ffffff';ctx.fill();
    }
    if (cursor) {
      const [x,y] = cursor;
      ctx.beginPath(); ctx.arc(x,y,6*scale,0,2*Math.PI);
      ctx.lineWidth=2*scale;ctx.strokeStyle='#ffffff';ctx.stroke();
    }
  }, [source,points,cursor]);

  function edit(next) {
    epoch.current++; setPoints(next); setSelection(null); setError('');
  }
  function keyPoint(event) {
    if (busy || !source) return;
    const step = event.shiftKey ? 10 : 1;
    const moves = {ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]};
    const current = cursor || [Math.floor(source.width/2),Math.floor(source.height/2)];
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); setCursor(current); edit([...points,current]);
    } else if (Object.hasOwn(moves,event.key)) {
      event.preventDefault();
      const [dx,dy]=moves[event.key];
      setCursor([Math.max(0,Math.min(source.width,current[0]+dx)),Math.max(0,Math.min(source.height,current[1]+dy))]);
    }
  }
  async function confirm() {
    if (busy || points.length < 3 || !source) return;
    const current = ++epoch.current;
    setBusy(true); setError('');
    try {
      const {blob,editable} = await createMask(points,source.width,source.height);
      const maskHash = await digest(await blob.arrayBuffer());
      const manifest = {
        format:'inmejora.private-region.v1', project_id:projectId, source_id:photoId,
        source_sha256:source.sha256, mask_sha256:maskHash, width:source.width, height:source.height,
        orientation:'from-image', coordinates:'oriented-source-pixels', polygon:points,
        editable_pixels:editable, editable_alpha:0, protected_alpha:255,
      };
      const selectionId = await digest(new TextEncoder().encode(JSON.stringify(manifest)));
      if (epoch.current === current) setSelection({blob,requestKey:crypto.randomUUID(),manifest:{...manifest,selection_id:selectionId}});
    } catch (err) {
      if (epoch.current === current) setError(err.message || 'No se pudo preparar la máscara.');
    } finally {if (epoch.current === current) setBusy(false);}
  }

  async function save() {
    if (!selection || !source?.persistable || !onSave || saving.current || selection.storedId) return;
    const current = epoch.current;
    saving.current = true;
    setBusy(true); setError('');
    try {
      const storedId = await onSave({sourceId:photoId,sourceHash:source.sha256,maskHash:selection.manifest.mask_sha256,
        blob:selection.blob,requestKey:selection.requestKey});
      if (current === epoch.current) setSelection({...selection,storedId,manifest:{...selection.manifest,mask_id:storedId}});
    } catch {
      if (current === epoch.current) setError('No se confirmó el guardado privado. Podés reintentar o descargar la selección.');
    } finally {
      saving.current = false;
      if (current === epoch.current) setBusy(false);
    }
  }

  return <section aria-label="Marcar zona de la foto" className="space-y-3 rounded border border-gray-600 p-3">
    <p id={description}>Tocá las esquinas del área que querés editar y revisá la zona sombreada. Primero se prepara en este dispositivo. Con teclado, usá las flechas y Enter para marcar.</p>
    {!source && !error && <p role="status">Abriendo foto privada…</p>}
    {source && <>
      <canvas ref={canvas} width={source.width} height={source.height} aria-label="Foto original con la selección" aria-describedby={description}
        tabIndex={0} onKeyDown={keyPoint} onBlur={()=>setCursor(null)}
        className="block h-auto w-full cursor-crosshair rounded focus:outline" style={{touchAction:'manipulation'}}
        onClick={e=>{if (!busy) {setCursor(null);edit([...points,xy(e.currentTarget,e.clientX,e.clientY)]);}}} />
      <p className="text-sm">{source.width} × {source.height} px · {points.length} puntos</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} disabled={busy||!points.length} onClick={()=>edit(points.slice(0,-1))}>Deshacer punto</button>
        <button type="button" className={button} disabled={busy||!points.length} onClick={()=>edit([])}>Borrar selección</button>
        <button type="button" className={button} disabled={busy||points.length<3||!!selection} onClick={confirm}>Confirmar zona</button>
      </div>
    </>}
    {error && <p role="alert">{error}</p>}
    {selection && <div className="space-y-2">
      <p role="status">{selection.storedId?'Zona guardada en privado para este proyecto.':'Zona confirmada en este dispositivo.'}</p>
      {source.persistable && onSave ? <button type="button" className={button} disabled={busy||!!selection.storedId} onClick={save}>Guardar zona en el proyecto</button>
        : <p>Para esta foto, la selección está disponible para descarga local.</p>}
      <button type="button" className={button} onClick={()=>download(selection.blob,'mascara-'+photoId+'.png')}>Descargar máscara PNG</button>{' '}
      <button type="button" className={button} onClick={()=>download(
        new Blob([JSON.stringify(selection.manifest,null,2)],{type:'application/json'}),'mascara-'+photoId+'.json')}>Descargar ficha de la selección</button>
    </div>}
    <button type="button" className={button} onClick={onClose}>Cerrar marcado</button>
  </section>;
}
