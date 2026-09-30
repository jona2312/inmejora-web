import { z } from 'zod';

// This is a transport/response contract, never an ownership decision.
const receiptSchema = z.object({
  schema_version: z.literal('intake-result.v1'), user_id: z.string().uuid().nullable(),
  client_id: z.string().uuid(), project_id: z.string().uuid(), lead_id: z.string().uuid(), conversation_id: z.string().uuid(),
  status: z.literal('received'), project_state: z.literal('submitted'), revision: z.literal(1), next_action: z.literal('await_operator'),
}).strict();
const state = z.enum(['draft', 'submitted', 'active', 'awaiting_client', 'completed', 'cancelled', 'archived']);
const viewSchema = z.object({
  project: z.object({id: z.string().uuid(), core_state: state}),
  conversation: z.object({id: z.string().uuid(), project_id: z.string().uuid()}),
});
const publicThreadSchema = z.object({
  conversation: z.object({id:z.string().uuid(), project_id:z.string().uuid(), mode:z.enum(['paused','human','auto']), revision:z.number().int().positive()}),
  events: z.array(z.object({id:z.string().uuid(), sequence:z.number().int().positive(), kind:z.string(), content:z.string(),
    visibility:z.literal('client'), actor_user_id:z.null(), created_at:z.string()})),
  can_message:z.boolean(), can_handoff:z.literal(false),
});
export class ProjectCoreError extends Error {
  constructor(code, status = 0) { super(code); this.code = code; this.status = status; }
}
export function localCoreEnabled() {
  return import.meta.env.DEV && import.meta.env.MODE === 'project-core-local' &&
    globalThis.location?.protocol === 'http:' && globalThis.location?.hostname === '127.0.0.1';
}
export function toLeadRequest(values, key) {
  return {
    schema_version: 'lead.v1', idempotency_key: key,
    source: {channel: 'web', path: '/contacto', campaign: null},
    project: {category: 'consulta', locality: values.locality.trim(), zone: null, property_type: 'otro', room: null,
      measurements: null, description: values.message.trim()},
    preferences: {materials: null, style: null}, attachment_refs: [], intent: 'asesoria',
    contact: {name: values.name.trim(), channel: 'email', email: values.email.trim()},
    consent: {contact_requested: values.consent === true, notice_version: 'LOCAL-FIXTURE-1', marketing: false},
  };
}

export function createProjectCoreClient({fetchImpl = globalThis.fetch.bind(globalThis), enabled = localCoreEnabled, timeoutMs = 8000} = {}) {
  let csrf, initialization, pendingBody, submission, pendingMessage, messageSubmission;
  async function request(path, method = 'GET', body) {
    if (!enabled()) throw new ProjectCoreError('LOCAL_CORE_DISABLED');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl('/api/v1' + path, {method, credentials: 'same-origin', redirect: 'error', signal: controller.signal,
        headers: {'Content-Type': 'application/json', ...(csrf ? {'X-CSRF-Token': csrf} : {})},
        ...(body === undefined ? {} : {body: JSON.stringify(body)})});
      if (!response.ok) throw new ProjectCoreError('CORE_HTTP_' + response.status, response.status);
      try {return await response.json();} catch {throw new ProjectCoreError('INVALID_CORE_RESPONSE');}
    } catch (error) {
      if (error instanceof ProjectCoreError) throw error;
      throw new ProjectCoreError(error.name === 'AbortError' ? 'CORE_TIMEOUT' : 'CORE_UNAVAILABLE');
    } finally {clearTimeout(timer);}
  }
  function context(view, receipt) {
    const parsed = viewSchema.safeParse(view);
    if (!parsed.success || parsed.data.project.id !== receipt.project_id || parsed.data.conversation.id !== receipt.conversation_id || parsed.data.conversation.project_id !== receipt.project_id)
      throw new ProjectCoreError('INVALID_CORE_CONTEXT');
    return {project_id: receipt.project_id, conversation_id: receipt.conversation_id, state: parsed.data.project.core_state};
  }
  async function current() {
    const data = await request('/intakes/current');
    if (typeof data.csrf_token !== 'string' || data.csrf_token.length !== 64) throw new ProjectCoreError('INVALID_CORE_RESPONSE');
    csrf = data.csrf_token;
    if (data.receipt === null) return null;
    const parsed = receiptSchema.safeParse(data.receipt);
    if (!parsed.success) throw new ProjectCoreError('INVALID_CORE_RESPONSE');
    return context(data.project, parsed.data);
  }
  function initialize() {
    if (!initialization) initialization = (async () => {
      try {return await current();} catch (error) {
        // Only initial absence of a capability creates a session. Failed POSTs never rotate it.
        if (error.status !== 401) throw error;
        const session = await request('/intake-sessions', 'POST', {});
        if (typeof session.csrf_token !== 'string' || session.csrf_token.length !== 64) throw new ProjectCoreError('INVALID_CORE_RESPONSE');
        csrf = session.csrf_token; return null;
      }
    })().catch(error => {initialization = undefined; throw error;});
    return initialization;
  }
  function submit(values) {
    if (submission) return submission;
    pendingBody ??= toLeadRequest(values, globalThis.crypto.randomUUID());
    submission = (async () => {
      const existing = await initialize(); if (existing) return existing;
      const data = await request('/leads', 'POST', pendingBody);
      const parsed = receiptSchema.safeParse(data);
      if (!parsed.success) throw new ProjectCoreError('INVALID_CORE_RESPONSE');
      return context(await request('/projects/' + parsed.data.project_id), parsed.data);
    })().catch(error => {if (error.status === 422) pendingBody = undefined; throw error;}).finally(() => {submission = undefined;});
    return submission;
  }
  function threadPath(context) {
    if (!z.string().uuid().safeParse(context.project_id).success || !z.string().uuid().safeParse(context.conversation_id).success)
      throw new ProjectCoreError('INVALID_THREAD_IDS');
    return '/projects/' + context.project_id + '/conversations/' + context.conversation_id;
  }
  function publicThread(data, context) {
    const parsed = publicThreadSchema.safeParse(data);
    if (!parsed.success || parsed.data.conversation.id !== context.conversation_id || parsed.data.conversation.project_id !== context.project_id ||
      parsed.data.events.some((e,i,all)=>i>0 && e.sequence<=all[i-1].sequence)) throw new ProjectCoreError('INVALID_PUBLIC_THREAD');
    return {mode:parsed.data.conversation.mode, can_message:parsed.data.can_message,
      events:parsed.data.events.map(({id,sequence,kind,content,created_at})=>({id,sequence,kind,content,created_at}))};
  }
  async function thread(context) {
    await initialize();
    return publicThread(await request(threadPath(context)),context);
  }
  function message(context, content) {
    if (messageSubmission) return messageSubmission;
    const path=threadPath(context)+'/messages';
    if (pendingMessage && pendingMessage.path!==path) return Promise.reject(new ProjectCoreError('PENDING_THREAD_MISMATCH'));
    pendingMessage ??= {path,body:{idempotency_key:globalThis.crypto.randomUUID(),content,visibility:'client'}};
    messageSubmission=(async()=>{
      await initialize();
      const result=publicThread(await request(path,'POST',pendingMessage.body),context);
      pendingMessage=undefined;
      return result;
    })().catch(error=>{if(error.status===422)pendingMessage=undefined;throw error;}).finally(()=>{messageSubmission=undefined;});
    return messageSubmission;
  }
  return {initialize, submit, current, thread, message};
}
