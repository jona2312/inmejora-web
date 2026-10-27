import { z } from 'zod';
const option=z.object({id:z.string(),provider:z.enum(['mp','stripe']),currency:z.enum(['ARS','USD']),amount_minor:z.number().int().nonnegative(),countries:z.array(z.string()),enabled:z.boolean()}).passthrough();
const plan=z.object({id:z.string(),version:z.number().int().positive(),approved_at:z.string(),terms:z.object({name:z.string(),description:z.string(),period:z.enum(['one_time','monthly','annual']),credits:z.number().int().nonnegative(),benefits:z.array(z.string()),visible:z.literal(true),available:z.literal(true),tax_notice:z.string(),renewal_notice:z.string(),options:z.array(option)})});
export function parseCatalog(value){return z.object({ok:z.literal(true),payments_enabled:z.literal(false),plans:z.array(plan)}).parse(value).plans;}
export async function readCatalog(signal){
 const response=await fetch('/api/plans/dynamic',{credentials:'same-origin',cache:'no-store',signal});
 if(!response.ok)throw Error('CATALOG_UNAVAILABLE');return parseCatalog(await response.json());
}
