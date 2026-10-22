import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { COMMERCIAL, PROMISE, buildWhatsappUrl } from '@/config/commercial';
import { ZONES, TIMING_OPTIONS, serviceBySlug, zoneBySlug } from '@/data/salesContent';
import { SERVICE_OPTIONS, buildConsultaMessage, validateConsulta, LIMITS } from '@/utils/consultaMessage';
import { track } from '@/utils/track';

import { createProjectCoreClient, localCoreEnabled, invitationFromSearch } from '@/lib/projectCoreClient';
import ProjectThread from '@/components/ProjectThread';

const field = 'w-full rounded-lg bg-[#141414] border border-white/15 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]';
const label = 'block text-sm font-semibold text-gray-200 mb-1.5';

const ConsultaForm = () => {
  const local = localCoreEnabled();
  const client = useRef(null);
  if (!client.current) {
    // Read once from ?inv=, keep in memory and strip it from the address bar / history.
    const invitation = local ? invitationFromSearch(globalThis.location?.search) : null;
    if (invitation) globalThis.history?.replaceState(null, '', globalThis.location.pathname + globalThis.location.hash);
    client.current = createProjectCoreClient({ invitation });
  }
  const [context, setContext] = useState(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [photos, setPhotos] = useState([]);
  const [readingPhotos, setReadingPhotos] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const photoRead = useRef(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [colors, setColors] = useState('');
  const lock = useRef(false);
  useEffect(() => { if (!local) return; let active=true;
    client.current.initialize().then(v=>{if(active)setContext(v);}).catch(()=>{if(active)setFailure('No se pudo conectar. No hay envío confirmado.');});
    return ()=>{active=false;}; }, [local]);
  const [params] = useSearchParams();
  const initialService = serviceBySlug(params.get('servicio')) ? params.get('servicio') : '';
  const initialZone = zoneBySlug(params.get('zona'))?.name ?? '';
  const [values, setValues] = useState({ servicio: initialService, localidad: initialZone, ambiente: '', descripcion: '', medidas: '', cuando: '', nombre: '' });
  const [errors, setErrors] = useState({});
  const [prepared, setPrepared] = useState(null); // { url, text } once the WhatsApp message was prepared
  const [copied, setCopied] = useState(false);

  const set = key => event => setValues(current => ({ ...current, [key]: event.target.value }));

  const submit = async event => {
    event.preventDefault();
    if (local) {
      if (lock.current || photoRead.current) return;
      if (!values.nombre.trim() || !email.trim() || !consent || Object.keys(validateConsulta(values)).length) {
        setFailure('Completá nombre, email, servicio, localidad, descripción y consentimiento.'); return;
      }
      lock.current=true;setBusy(true);setAttempted(true);setFailure('');
      try {
        const saved=await client.current.submit({name:values.nombre,email,locality:values.localidad,consent,
          message:buildConsultaMessage(values),materials:colors,room:values.ambiente,
          category:values.servicio==='pintura-y-terminaciones'?'pintar':values.servicio==='diseno-y-visualizacion'?'disenar':'consulta'});
        for (const photo of photos) await client.current.photo(saved, photo);
        setContext(saved);
      } catch { setFailure('No se confirmó todo el envío. Reintentá sin cambiar los datos; no se duplicará la consulta.'); }
      finally {lock.current=false;setBusy(false);}
      return;
    }
    if (!COMMERCIAL.channelEnabled) return; // fail-closed: no number configured, nothing is prepared or opened
    const found = validateConsulta(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`consulta-${first}`)?.focus();
      return;
    }
    const text = buildConsultaMessage(values);
    const url = buildWhatsappUrl(text);
    setPrepared({ url, text });
    track('whatsapp_consulta_open', { servicio: values.servicio });
    // The consultation is NOT sent by this page. WhatsApp opens with the message ready for the visitor to send.
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prepared.text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (!local && !COMMERCIAL.channelEnabled) {
    return (
      <div role="alert" className="rounded-xl border border-red-400/40 bg-red-400/5 p-6 text-gray-200" data-channel="disabled">
        <p className="font-bold text-white">Por el momento no podemos recibir consultas por este medio.</p>
        <p className="mt-2 text-sm">Escribinos a <a className="underline text-[#d4af37]" href={`mailto:${COMMERCIAL.email}`}>{COMMERCIAL.email}</a> y te respondemos por ahí.</p>
      </div>
    );
  }

  if (local && context) return <section className="space-y-4" aria-label="Consulta guardada">
    <h2>Consulta guardada en INMEJORA</h2><p>Proyecto: <span data-testid="project_id">{context.project_id}</span></p>
    <p>Conversación: <span data-testid="conversation_id">{context.conversation_id}</span></p>
    <p>{PROMISE.short}. {PROMISE.note}</p>
    <ProjectThread client={client.current} context={context} onRefresh={async()=>setContext(await client.current.current())} />
  </section>;
  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-describedby="consulta-note">
      <fieldset disabled={local && (busy || attempted)} className="space-y-5">
      <div>
        <label htmlFor="consulta-servicio" className={label}>¿Qué querés hacer? *</label>
        <select id="consulta-servicio" value={values.servicio} onChange={set('servicio')} className={field} aria-invalid={!!errors.servicio} aria-required="true">
          <option value="">Elegí un servicio</option>
          {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {errors.servicio && <p role="alert" className="mt-1 text-sm text-red-400">{errors.servicio}</p>}
      </div>

      <div>
        <label htmlFor="consulta-localidad" className={label}>Localidad *</label>
        <input id="consulta-localidad" list="consulta-zonas" value={values.localidad} onChange={set('localidad')} maxLength={LIMITS.short} autoComplete="address-level2" placeholder="Hudson, Berazategui, Quilmes…" className={field} aria-invalid={!!errors.localidad} aria-required="true" />
        <datalist id="consulta-zonas">{ZONES.map(z => <option key={z.slug} value={z.name} />)}</datalist>
        {errors.localidad && <p role="alert" className="mt-1 text-sm text-red-400">{errors.localidad}</p>}
      </div>

      <div>
        <label htmlFor="consulta-ambiente" className={label}>Ambiente o sector <span className="font-normal text-gray-500">(opcional)</span></label>
        <input id="consulta-ambiente" value={values.ambiente} onChange={set('ambiente')} maxLength={LIMITS.short} placeholder="Cocina, baño, terraza, fachada…" className={field} />
      </div>

      <div>
        <label htmlFor="consulta-descripcion" className={label}>Contanos qué necesitás *</label>
        <textarea id="consulta-descripcion" rows={4} value={values.descripcion} onChange={set('descripcion')} maxLength={LIMITS.description} placeholder="Qué querés cambiar o arreglar, cómo está hoy, qué te preocupa." className={field} aria-invalid={!!errors.descripcion} aria-required="true" />
        {errors.descripcion && <p role="alert" className="mt-1 text-sm text-red-400">{errors.descripcion}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="consulta-medidas" className={label}>Medidas <span className="font-normal text-gray-500">(si las sabés)</span></label>
          <input id="consulta-medidas" value={values.medidas} onChange={set('medidas')} maxLength={LIMITS.short} placeholder="Ej: 3 x 4 m" className={field} />
        </div>
        <div>
          <label htmlFor="consulta-cuando" className={label}>¿Para cuándo? <span className="font-normal text-gray-500">(opcional)</span></label>
          <select id="consulta-cuando" value={values.cuando} onChange={set('cuando')} className={field}>
            <option value="">Sin definir</option>
            {TIMING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="consulta-nombre" className={label}>Tu nombre <span className="font-normal text-gray-500">(opcional)</span></label>
        <input id="consulta-nombre" value={values.nombre} onChange={set('nombre')} maxLength={80} autoComplete="name" className={field} />
      </div>

      {local && <fieldset disabled={busy || readingPhotos} className="space-y-3">
        <label className={label}>Email de contacto<input type="email" aria-label="Email de contacto" value={email} onChange={e=>setEmail(e.target.value)} className={field} required /></label>
        <label className={label}>Colores o materiales elegidos<input aria-label="Colores o materiales elegidos" value={colors} onChange={e=>setColors(e.target.value)} maxLength={500} className={field} /></label>
        <label className={label}>Fotos privadas (hasta 4, máximo 2 MB cada una)<input type="file" aria-label="Fotos privadas" accept="image/png,image/jpeg,image/webp" multiple onChange={async e=>{
          const files=[...e.target.files];
          setPhotos([]);
          if(files.length>4 || files.some(f=>f.size>2*1024*1024)){setFailure('Máximo cuatro fotos de 2 MB.');e.target.value='';return;}
          photoRead.current=true;setReadingPhotos(true);
          try {setPhotos(await Promise.all(files.map(async file=>({idempotency_key:crypto.randomUUID(),media_type:file.type,
            base64:await new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=reject;r.onload=()=>resolve(String(r.result).split(',')[1]);r.readAsDataURL(file);})}))));}
          catch {setFailure('No se pudieron leer las fotos.');}
          finally {photoRead.current=false;setReadingPhotos(false);}
        }} /></label>
        <label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /> Autorizo el contacto y el almacenamiento privado de mi consulta y fotos.</label>
        {failure && <p role="alert">{failure}</p>}
      </fieldset>}
      </fieldset>
      <p id="consulta-note" className="text-sm text-gray-400">
        {local ? 'La consulta y las fotos se guardan en el Dashboard. La confirmación aparece sólo después de persistirlas; no se abre WhatsApp.' : <>Al continuar se abre WhatsApp con tu consulta lista para enviar. <strong className="text-gray-200">Tu consulta llega a INMEJORA cuando la enviás desde WhatsApp.</strong> Las fotos las sumás ahí mismo.</>}
      </p>

      <button type="submit" disabled={busy || readingPhotos} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--accent-cta))] px-8 py-4 text-lg font-bold text-white hover:bg-[hsl(24_100%_45%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <MessageCircle className="w-5 h-5" aria-hidden="true" /> {local ? (busy ? 'Guardando…' : 'Guardar consulta') : 'Continuar por WhatsApp'}
      </button>
      <p className="text-center text-sm text-gray-400">{PROMISE.short}. {PROMISE.note}</p>

      {prepared && (
        <div role="status" className="rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/5 p-5 space-y-3">
          <p className="font-semibold text-white">Preparamos tu mensaje. Todavía no fue enviado.</p>
          <p className="text-sm text-gray-300">Si WhatsApp no se abrió, usá el enlace o copiá el texto y envialo de INMEJORA. La consulta se recibe recién cuando la enviás.</p>
          <div className="flex flex-wrap gap-3">
            <a href={prepared.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-semibold text-black">
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> Abrir WhatsApp
            </a>
            <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 font-semibold text-white hover:bg-white/10">
              {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />} {copied ? 'Texto copiado' : 'Copiar texto'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ConsultaForm;
